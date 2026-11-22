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
            var catalog = UpgradeCatalog.Entries;
            Check(catalog.Count == 1696 && catalog["112-16"].price > int.MaxValue &&
                catalog["73-01"].previousInBranch == "" && catalog["73-16"].previousInBranch == "73-15",
                "The runtime catalog loads all 1,696 entries with wide prices and branch ordering.");
            Check(CampaignSession.Upgrades.Length == 7 && CampaignSession.Upgrades[1].Requires == "01-01",
                "Only wired effects are sold, and their purchase data comes from the catalog.");
            Check(game.Save.cash == 0 && game.Save.receipts.Count == 0 && game.knife.GetComponent<MeshFilter>().sharedMesh,
                "Fresh campaign starts at $0 with the modeled knife.");
            Check(game.trees.Length >= 200 && game.trees[0].standing.GetComponent<MeshFilter>().sharedMesh,
                "The saved scene instantiates a modeled jungle.");
            var avatar = Resources.Load<GameObject>("FieldOperatorAvatar");
            Check(avatar && avatar.GetComponentsInChildren<MeshFilter>().Length > 8 &&
                avatar.GetComponentsInChildren<Collider>().Length == 0,
                "The remote operator is a build-included visual prefab with no physics components.");
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
            game.Coop.StartHostForSmokeTest();
            SendGuest(game.Coop, 2, "grab", new Ray(grabRay.origin - grabRay.direction * 9f, grabRay.direction), tree.id);
            Check(!game.IsHeld(tree), "Host rejects an out-of-range guest grip.");
            SendGuest(game.Coop, 2, "grab", grabRay, tree.id);
            Check(game.IsHeld(tree) && game.Held == null, "Guest commands attach a grip on the host.");
            SendGuest(game.Coop, 3, "grab", grabRay, tree.id);
            Check(!game.TryGrab(grabRay), "A guest-held log cannot also be grabbed by the host.");
            game.Coop.OnPhotonMessage("{\"kind\":\"left\",\"actor\":2}");
            Check(!game.IsHeld(tree), "A competing guest cannot steal the grip. Departure releases it.");
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
            SendGuest(game.Coop, 3, "buy", grabRay, upgradeId: upgrade.Id);
            Check(game.Save.cash == 3 && game.SwingCost < before,
                "Guest purchase deducts $15 on the host and lowers actual swing stamina cost.");
            SendGuest(game.Coop, 3, "buy", grabRay, upgradeId: upgrade.Id);
            Check(!game.Buy(upgrade) && game.Save.cash == 3, "A repeated purchase cannot charge twice.");
            Check(CampaignSave.TryRead(game.MakeRoomState(), out var room) && room.Owns(upgrade.Id) &&
                room.cash == 3 && room.receipts.Count == 1, "Shared snapshot carries the host's sale and upgrade.");
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

            Check(game.yard.Length == 5, "The saved scene carries all five usable timber-yard stations.");
            TimberYard Site(YardService service) => Array.Find(game.yard, station => station.service == service);
            var raw = game.trees[1];
            FellForYardTest(raw);
            PlaceCargo(raw, Site(YardService.RawBuyer).transform);
            yield return WaitUntilCargo(() => raw.Record.sold, 3);
            Check(raw.Record.sold && game.Save.cash == 25 && game.Save.receipts[^1].buyer == "Raw Timber Buyer",
                "The raw timber buyer pays $22 for one sapling and records its own receipt.");

            var crafted = game.trees[2];
            FellForYardTest(crafted);
            var sawmill = Site(YardService.Sawmill);
            PlaceCargo(crafted, sawmill.transform);
            yield return WaitUntilCargo(() => sawmill.Active == crafted, 2);
            Check(sawmill.Active == crafted && crafted.ReservedBy == sawmill,
                "The sawmill reserves an actual delivered log.");
            yield return new WaitForSeconds(0.35f);
            Check(crafted.Record.product == TimberProduct.Log && sawmill.Completion < 0.01f,
                "Idle manual work does not advance the sawmill.");
            var sawOrigin = sawmill.transform.TransformPoint(new Vector3(0, 1.6f, -1.5f));
            var sawRay = new Ray(sawOrigin, sawmill.intake.position - sawOrigin);
            Check(game.FindWorkStation(sawRay) == sawmill, "Walking up to the sawmill gives the manual work action.");
            yield return RunBench(sawmill, crafted, TimberProduct.Boards);
            Check(crafted.Record.product == TimberProduct.Boards && crafted.Log && crafted.CargoCollider is BoxCollider &&
                crafted.Log.mass < crafted.mass && !crafted.ReservedBy,
                "Manual sawing creates a lighter, physical bundle and releases it for hauling.");

            PlaceCargo(crafted, game.exchange.transform);
            yield return new WaitForSeconds(0.3f);
            Check(!game.exchange.Burning && !crafted.Record.sold, "The fire ring rejects a board bundle.");
            var dryer = Site(YardService.DryingRack);
            PlaceCargo(crafted, dryer.transform);
            yield return WaitUntilCargo(() => dryer.Active == crafted, 2);
            Check(dryer.Active == crafted, "The drying rack takes rough boards.");
            var dryingSave = game.Export();
            Check(CampaignSave.TryRead(dryingSave, out var drying) &&
                drying.ForTree(crafted.id).product == TimberProduct.Boards &&
                drying.ForTree(crafted.id).processRemaining > 0, "An active drying cycle is written to the save.");
            yield return WaitUntilCargo(() => crafted.Record.product == TimberProduct.DriedBoards, 11);
            Check(crafted.Record.product == TimberProduct.DriedBoards, "The rack yields dried boards after elapsed play time.");

            var bench = Site(YardService.CrateBench);
            PlaceCargo(crafted, bench.transform);
            yield return WaitUntilCargo(() => bench.Active == crafted, 2);
            Check(bench.Active == crafted, "The crate bench accepts the dried bundle.");
            yield return RunBench(bench, crafted, TimberProduct.Crate);
            Check(crafted.Record.product == TimberProduct.Crate && crafted.Log && !crafted.ReservedBy,
                "Assembly produces a separate crated cargo mesh on the workbench output.");

            var buyer = Site(YardService.LumberBuyer);
            PlaceCargo(crafted, buyer.transform);
            yield return WaitUntilCargo(() => crafted.Record.sold, 3);
            Check(crafted.Record.sold && game.Save.cash == 105 && game.Save.receipts[^1].product == TimberProduct.Crate &&
                game.Save.receipts[^1].buyer == "Lumber Buyer", "The finished crate sells once for $80.");
            game.CompleteSale(crafted);
            Check(game.Save.cash == 105 && game.Save.receipts.Count == 3, "Sold cargo cannot pay again through the fire route.");

            var saw = Array.Find(CampaignSession.Upgrades, upgrade => upgrade.Id == "05-01");
            Check(!game.EquipSaw(true), "The Pocket Saw cannot be equipped before purchase.");
            Check(game.Buy(saw) && game.Save.cash == 30, "The Pocket Saw purchase deducts $75.");
            Check(game.EquipSaw(true) && game.pocketSaw.gameObject.activeSelf && !game.knife.gameObject.activeSelf,
                "Equipping the purchased saw swaps to the physical saw model.");
            var largeTree = Array.Find(game.trees, t => t.height > 3f && !t.Record.felled);
            Check(game.DamageFor(game.trees[3], true) > 2 && game.DamageFor(largeTree, true) < 1,
                "The Pocket Saw is faster on saplings and loses effectiveness on larger trees.");
        }

        static void FellForYardTest(TimberTree tree)
        {
            var point = tree.transform.position + Vector3.up;
            tree.Strike(tree.toughness, point, Vector3.forward);
        }

        static void PlaceCargo(TimberTree tree, Transform receiver)
        {
            tree.Log.position = receiver.TransformPoint(new Vector3(0, 0.31f, -0.16f));
            tree.Log.rotation = tree.Record.product == TimberProduct.Log ? Quaternion.Euler(0, 0, 90) : Quaternion.identity;
            tree.Log.linearVelocity = Vector3.zero;
            tree.Log.angularVelocity = Vector3.zero;
            tree.Log.WakeUp();
            Physics.SyncTransforms();
        }

        static IEnumerator RunBench(TimberYard site, TimberTree timber, TimberProduct product)
        {
            float deadline = Time.time + 7;
            while (timber.Record.product != product && Time.time < deadline)
            {
                site.Work();
                yield return null;
            }
        }

        static IEnumerator WaitUntilCargo(Func<bool> predicate, float timeout)
        {
            float deadline = Time.time + timeout;
            while (!predicate() && Time.time < deadline)
                yield return null;
        }

        static void SendGuest(OpeningCoop coop, int actor, string kind, Ray ray, int treeId = 0, string upgradeId = null)
        {
            Vector3 angles = Quaternion.LookRotation(ray.direction).eulerAngles;
            var action = new TestAction {
                kind = kind, treeId = treeId, upgradeId = upgradeId,
                pose = new TestPose { position = ray.origin - Vector3.up * 1.62f, yaw = angles.y, pitch = angles.x }
            };
            coop.OnPhotonMessage(JsonUtility.ToJson(new TestPacket { kind = "event", code = 43,
                actor = actor, payload = JsonUtility.ToJson(action) }));
        }

        [Serializable] sealed class TestAction
        {
            public TestPose pose;
            public string kind, upgradeId;
            public int treeId;
        }

        [Serializable] sealed class TestPose
        {
            public Vector3 position;
            public float yaw, pitch;
        }

        [Serializable] sealed class TestPacket
        {
            public string kind, payload;
            public int code, actor;
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
