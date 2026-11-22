#if UNITY_EDITOR
using System;
using System.Collections;
using System.IO;
using UnityEditor;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Clearcut
{
    public sealed class ClearcutOpeningSmoke : MonoBehaviour
    {
        internal const string Flag = "Clearcut.OpeningSmoke.InProgress";
        internal const string Slot = ".smoke";
        const string Report = "Builds/Evidence/opening-smoke.txt";

        [MenuItem("Clearcut/Run Opening Smoke Test")]
        public static void StartTest()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode ||
                SceneManager.GetActiveScene().path != "Assets/Scenes/TheLastJungle.unity")
                throw new InvalidOperationException("Open TheLastJungle in Edit Mode before testing.");

            Directory.CreateDirectory(Path.GetDirectoryName(Report));
            File.WriteAllText(Report, "RUNNING" + Environment.NewLine);
            CampaignSave.Clear(Slot);
            SessionState.SetBool(Flag, true);
            EditorApplication.ExecuteMenuItem("Window/General/Game");
            EditorApplication.EnterPlaymode();
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void Initialize()
        {
            if (!SessionState.GetBool(Flag, false) || FindAnyObjectByType<ClearcutOpeningSmoke>())
                return;
            var probe = new GameObject("Opening smoke test").AddComponent<ClearcutOpeningSmoke>();
            DontDestroyOnLoad(probe.gameObject);
            probe.StartCoroutine(probe.Run());
        }

        IEnumerator Run()
        {
            var steps = Checks();
            while (true)
            {
                object wait;
                try
                {
                    if (!steps.MoveNext())
                        break;
                    wait = steps.Current;
                }
                catch (Exception error)
                {
                    File.AppendAllText(Report, "FAIL " + error + Environment.NewLine);
                    Debug.LogError("Clearcut opening smoke failed: " + error.Message);
                    Finish();
                    yield break;
                }
                yield return wait;
            }
            File.AppendAllText(Report, "PASS" + Environment.NewLine);
            Debug.Log("Clearcut opening smoke passed. See " + Report);
            Finish();
        }

        IEnumerator Checks()
        {
            yield return null;
            var game = FindAnyObjectByType<CampaignSession>();
            var tree = game.trees[0];
            Check(game.Save.cash == 0 && game.Save.receipts.Count == 0 && game.knife.GetComponent<MeshFilter>().sharedMesh,
                "Fresh campaign starts at $0 with the modeled knife.");
            Check(game.trees.Length >= 200 && game.trees[0].standing.GetComponent<MeshFilter>().sharedMesh,
                "The saved scene instantiates a modeled jungle.");
            game.enabled = false;
            Vector3 spawn = game.transform.position;
            for (int frame = 0; frame < 25; frame++)
                game.Walk(Vector2.up, false, false, 1f / 60);
            Check(game.transform.position.z > spawn.z + 0.45f && game.transform.position.y > -0.2f,
                "Player movement traverses colliding terrain.");

            Vector3 basePosition = tree.transform.position;
            Vector3 origin = basePosition + new Vector3(0, 1.4f, -1.75f);
            Check(!game.Swing(new Ray(origin, Vector3.left)) && tree.Progress == 0, "Missed swing leaves the tree unchanged.");
            yield return new WaitForSeconds(0.8f);
            Check(!game.Swing(new Ray(origin - Vector3.forward * 4, Vector3.forward)) && tree.Progress == 0,
                "Out-of-reach strike leaves the tree unchanged.");
            yield return new WaitForSeconds(0.8f);

            for (int i = 0; i < 15; i++)
            {
                if (!game.Swing(new Ray(origin, Vector3.forward)))
                    throw new InvalidOperationException("Valid strike failed at swing " + (i + 1));
                if (i == 0)
                    Check(tree.Progress > 0 && tree.transform.Find("Growing cut"), "One valid hit makes a persistent notch.");
                yield return new WaitForSeconds(0.76f);
                game.RecoverStamina(0.76f, false, false);
            }
            Check(tree.Record.felled && tree.Log && tree.GetComponentInChildren<StumpMarker>(),
                "Fifteen valid hits leave a stump and an actual non-kinematic timber rigidbody.");
            yield return new WaitForSeconds(2.0f);
            Check(tree.Log.mass == 19 && !tree.Log.isKinematic && tree.Log.position.y > 0 &&
                Mathf.Abs(Vector3.Dot(tree.Log.transform.up, Vector3.up)) < 0.47f,
                "Felled timber collides with the ground and lies flat at its logged mass.");

            Vector3 pit = game.exchange.transform.position;
            Vector3 start = tree.Log.position;
            Vector3 toPit = Vector3.ProjectOnPlane(pit - start, Vector3.up).normalized;
            var controller = game.GetComponent<CharacterController>();
            controller.enabled = false;
            game.transform.position = new Vector3(start.x, 0.02f, start.z) - toPit * 1.2f;
            game.transform.rotation = Quaternion.LookRotation(toPit);
            game.view.transform.localRotation = Quaternion.Euler(43, 0, 0);
            controller.enabled = true;
            Physics.SyncTransforms();
            var grabRay = new Ray(game.view.transform.position, tree.Log.worldCenterOfMass - game.view.transform.position);
            Check(game.TryGrab(grabRay), "Grab action attaches to a reachable timber body.");

            Vector3 destination = pit - toPit * 1.08f;
            destination.y = game.transform.position.y;
            float timeout = Time.time + 7;
            while (Time.time < timeout && game.Held && Vector3.ProjectOnPlane(tree.Log.position - pit, Vector3.up).magnitude > 0.92f)
            {
                controller.Move(Vector3.MoveTowards(game.transform.position, destination, 1.7f * Time.fixedDeltaTime) - game.transform.position);
                game.PullHeldTimber();
                yield return new WaitForFixedUpdate();
            }
            Check(game.Held == tree && (tree.Log.position - start).sqrMagnitude > 1,
                "Grounded spring hauling moves the body across the clearing.");
            game.Release();

            timeout = Time.time + 4;
            while (!game.exchange.Burning && Time.time < timeout)
                yield return null;
            Check(game.exchange.Burning == tree && game.Save.cash == 0,
                "The site accepts an actual log and pays nothing before burn completion.");
            yield return new WaitForSeconds(3.05f);
            Check(tree.Record.sold && !tree.Log && game.Save.cash == 18 && game.Save.receipts.Count == 1,
                "A finished burn consumes the log, pays $18 and issues a receipt.");
            game.CompleteSale(tree);
            Check(game.Save.cash == 18 && game.Save.receipts.Count == 1, "A repeat delivery cannot pay twice.");

            float before = game.SwingCost;
            var upgrade = CampaignSession.Upgrades[0];
            Check(game.Buy(upgrade) && game.Save.cash == 3 && game.SwingCost < before,
                "Rubberized Handle deducts $15 and lowers the actual swing stamina cost.");
            Check(!game.Buy(upgrade) && game.Save.cash == 3, "A repeated purchase cannot charge twice.");
            string encoded = game.Export();
            Check(CampaignSave.TryRead(encoded, out _) && !CampaignSave.TryRead("{broken", out _),
                "Current JSON can be decoded and malformed JSON is rejected.");

            SceneManager.LoadScene(game.gameObject.scene.buildIndex);
            yield return null;
            yield return null;
            game = FindAnyObjectByType<CampaignSession>();
            Check(game.Save.cash == 3 && game.Save.receipts.Count == 1 && game.Save.Owns(upgrade.Id) &&
                game.SwingCost < before && game.trees[0].Record.sold && !game.trees[0].Log &&
                game.trees[0].GetComponentInChildren<StumpMarker>(),
                "A real scene reload restores wallet, upgrade effects, sold timber and the stump.");
        }

        static void Check(bool condition, string description)
        {
            if (!condition)
                throw new InvalidOperationException(description);
            File.AppendAllText(Report, "OK " + description + Environment.NewLine);
        }

        void Finish()
        {
            CampaignSave.Clear(Slot);
            SessionState.SetBool(Flag, false);
            EditorApplication.ExitPlaymode();
        }
    }
}
#endif
