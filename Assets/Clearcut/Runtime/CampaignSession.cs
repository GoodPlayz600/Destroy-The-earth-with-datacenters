using System;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.SceneManagement;

namespace Clearcut
{
    [RequireComponent(typeof(CharacterController))]
    public sealed class CampaignSession : MonoBehaviour
    {
        public Camera view;
        public Transform knife;
        public AshExchange exchange;
        public TimberTree[] trees;
        public Material chipMaterial;

        internal static readonly Upgrade[] Upgrades =
        {
            new("01-01", "Rubberized Handle", "Knife swings use 15% less stamina.", 15),
            new("01-02", "Butter Knife Serration", "Deal 35% more damage to saplings.", 32, "01-01"),
            new("02-01", "Work Gloves", "Apply 15% more force while dragging.", 15),
            new("02-02", "Longer Stride", "Walk and run 8% faster.", 32, "02-01"),
            new("04-01", "Bigger Fire Ring", "Accept logs up to 30% heavier.", 15),
            new("04-02", "Hotter Ember Bed", "Burn wood 25% faster.", 32, "04-01")
        };

        internal OpeningCoop Coop { get; private set; }
        internal CampaignSave Save { get; private set; }
        internal TimberTree TargetTree { get; private set; }
        internal TimberTree TargetLog { get; private set; }
        internal TimberTree Held { get; private set; }
        internal float Stamina { get; private set; } = 1;
        internal string Notice { get; private set; }
        internal float NoticeUntil { get; private set; }
        internal bool HasStarted { get; private set; }
        internal bool MenuOpen { get; private set; }
        internal bool DragLook { get; private set; }
        internal float Sensitivity { get; private set; }
        internal float Volume { get; private set; }
        internal Vector3 CashPopupPosition { get; private set; }
        internal int CashPopupAmount { get; private set; }
        internal float CashPopupUntil { get; private set; }
        internal string SaveStatus { get; private set; }
        public float IntakeCapacity => Has("04-01") ? 1.3f : 1;
        public float BurnThroughput => Has("04-02") ? 1.25f : 1;

        CharacterController controller;
        OpeningAudio audio;
        Vector3 spawn;
        Vector3 knifeOrigin;
        Quaternion knifeRotation;
        Vector3 localGrip;
        Vector2 look;
        float gravity;
        float nextSwing;
        float lastSwing = -2;
        float lastInput;
        float saveAt;
        float lockRequest;
        string slot;
        bool walked;
        int quality;

        bool Has(string id) => Save.Owns(id);
        internal float DamageFor(TimberTree tree) => Has("01-02") && tree.height <= 3 ? 1.35f : 1;
        internal float SwingCost => Has("01-01") ? 0.0714f : 0.084f;
        internal float WalkSpeed => Has("02-02") ? 4.536f : 4.2f;
        internal float Grip => Has("02-01") ? 1.15f : 1;
        internal bool IsHeld(TimberTree tree) => Held == tree;

        void Awake()
        {
            controller = GetComponent<CharacterController>();
            spawn = transform.position;
            knifeOrigin = knife.localPosition;
            knifeRotation = knife.localRotation;
            slot = Application.isEditor ? ".editor" : ".player";
#if UNITY_EDITOR
            if (UnityEditor.SessionState.GetBool(ClearcutOpeningSmoke.Flag, false))
                slot = ClearcutOpeningSmoke.Slot;
#endif
            Save = CampaignSave.Load(slot, out bool recovered);
            SaveStatus = recovered ? "Recovered the previous checkpoint" : "Local autosave";
            foreach (var tree in trees)
                tree.Restore(Save.ForTree(tree.id));

            if (Save.hasPosition)
            {
                MoveTo(Save.position);
                Aim(Save.look);
            }
            else
                Aim(Vector2.zero);

            Sensitivity = PlayerPrefs.GetFloat("clearcut.sensitivity", 0.115f);
            DragLook = PlayerPrefs.GetInt("clearcut.drag-look") != 0;
            Volume = PlayerPrefs.GetFloat("clearcut.volume", 0.65f);
            quality = PlayerPrefs.GetInt("clearcut.quality", 1);
            ApplyQuality();
            audio = gameObject.AddComponent<OpeningAudio>();
            SetVolume(Volume);
            Coop = gameObject.AddComponent<OpeningCoop>();
        }

        void Update()
        {
            var keyboard = Keyboard.current;
            var mouse = Mouse.current;
            if (!HasStarted || keyboard == null || mouse == null)
                return;

            if (keyboard.tabKey.wasPressedThisFrame || keyboard.escapeKey.wasPressedThisFrame ||
                keyboard.iKey.wasPressedThisFrame)
            {
                SetMenu(!MenuOpen);
                return;
            }

            if (MenuOpen)
                return;

            bool locked = Cursor.lockState == CursorLockMode.Locked;
            if (!DragLook && !locked && mouse.leftButton.wasPressedThisFrame)
            {
                RequestLock();
                return;
            }
            if (!DragLook && !locked && Time.unscaledTime - lockRequest > 0.5f)
            {
                Release();
                return;
            }

            if ((locked || DragLook && mouse.rightButton.isPressed))
                Aim(look + mouse.delta.ReadValue() * Sensitivity * new Vector2(1, -1));

            float dt = Time.deltaTime;
            Vector2 motion = new((keyboard.dKey.isPressed ? 1 : 0) - (keyboard.aKey.isPressed ? 1 : 0),
                (keyboard.wKey.isPressed ? 1 : 0) - (keyboard.sKey.isPressed ? 1 : 0));
            bool sprint = keyboard.leftShiftKey.isPressed && !Held && Stamina > 0.09f && motion.sqrMagnitude > 0;
            Walk(motion, sprint, keyboard.spaceKey.wasPressedThisFrame, dt);

            var ray = new Ray(view.transform.position, view.transform.forward);
            FindTargets(ray);
            if (keyboard.eKey.isPressed && !Held)
                TryGrab(ray);
            if (!keyboard.eKey.isPressed && Held)
                Release();
            if (mouse.leftButton.isPressed && !Held)
                Swing(ray);
            RecoverStamina(dt, sprint, mouse.leftButton.isPressed);

            AnimateKnife(dt, motion.sqrMagnitude > 0);
            if (keyboard.f5Key.wasPressedThisFrame || Time.time >= saveAt)
                Persist();
        }

        internal void Walk(Vector2 motion, bool sprint, bool jump, float dt)
        {
            if (sprint)
                Stamina = Mathf.Max(0, Stamina - dt * 0.13f);
            Vector3 direction = transform.TransformDirection(new Vector3(motion.x, 0, motion.y).normalized);
            float speed = WalkSpeed * (Held ? 0.56f : sprint ? 1.57f : 1);
            if (controller.isGrounded)
                gravity = jump && !Held ? 5.9f : -1.4f;
            gravity -= dt * 18;
            controller.Move((direction * speed + Vector3.up * gravity) * dt);
            if (transform.position.y < -5)
            {
                Release();
                MoveTo(spawn);
                Show("Returned to the clearing");
            }

            if (motion.sqrMagnitude > 0 && controller.isGrounded)
            {
                if (!walked)
                    walked = true;
                audio.Step(speed, dt);
            }
        }

        internal void RecoverStamina(float dt, bool sprint, bool swinging)
        {
            if (!sprint && Time.time - lastInput > 0.35f)
                Stamina = Mathf.Min(1, Stamina + dt * (swinging ? 0.09f : 0.24f));
        }

        void FixedUpdate() => PullHeldTimber();

        internal void PullHeldTimber()
        {
            if (!Held || !Held.Log || MenuOpen)
                return;
            var body = Held.Log;
            Vector3 point = body.transform.TransformPoint(localGrip);
            Vector3 forward = Vector3.ProjectOnPlane(view.transform.forward, Vector3.up).normalized;
            Vector3 target = transform.position + forward * 1.12f + Vector3.up * Mathf.Clamp(0.39f + view.transform.forward.y * 0.21f, 0.22f, 0.60f);
            Vector3 offset = target - point;
            if (offset.sqrMagnitude > 18)
            {
                Release();
                return;
            }
            Vector3 spring = offset * 320f - body.GetPointVelocity(point) * 31f;
            spring.y = Mathf.Clamp(spring.y, -225, 285);
            body.AddForceAtPosition(Vector3.ClampMagnitude(spring, 655 * Grip), point, ForceMode.Force);
        }

        void FindTargets(Ray ray)
        {
            TargetTree = null;
            TargetLog = null;
            if (Physics.Raycast(ray, out var hit, 3.15f, Physics.DefaultRaycastLayers, QueryTriggerInteraction.Ignore))
            {
                var tree = hit.collider.GetComponent<TimberTree>();
                if (tree && !tree.Record.felled && hit.distance <= 2.55f)
                    TargetTree = tree;
                var felled = hit.collider.GetComponent<FelledTimber>();
                if (felled && exchange.Burning != felled.tree)
                    TargetLog = felled.tree;
            }

            if (!TargetLog && !TargetTree)
                TargetLog = FindGroundLog(ray);
        }

        TimberTree FindGroundLog(Ray ray)
        {
            TimberTree best = null;
            float shortest = 2.8f;
            foreach (var tree in trees)
            {
                if (!tree.Log || exchange.Burning == tree)
                    continue;
                var collider = tree.Log.GetComponent<Collider>();
                Vector3 point = collider.ClosestPoint(ray.origin + ray.direction * 1.5f);
                Vector3 delta = point - ray.origin;
                float distance = delta.magnitude;
                if (distance >= shortest || Vector3.Dot(delta.normalized, ray.direction) < 0.72f)
                    continue;
                if (Physics.Raycast(ray.origin, delta.normalized, out var obstruction, distance + 0.03f,
                    Physics.DefaultRaycastLayers, QueryTriggerInteraction.Ignore) && obstruction.collider != collider)
                    continue;
                best = tree;
                shortest = distance;
            }
            return best;
        }

        internal bool TryGrab(Ray ray)
        {
            if (Held || Coop.Guest)
                return false;
            FindTargets(ray);
            if (!TargetLog)
                return false;

            Held = TargetLog;
            var collider = Held.Log.GetComponent<Collider>();
            Vector3 point = collider.ClosestPoint(ray.origin + ray.direction * 1.55f);
            localGrip = Held.Log.transform.InverseTransformPoint(point);
            Held.Log.WakeUp();
            return true;
        }

        internal void Release()
        {
            if (!Held)
                return;
            Held.Snapshot();
            Held = null;
        }

        internal bool Swing(Ray ray)
        {
            if (Time.time < nextSwing || Stamina < SwingCost)
                return false;
            nextSwing = Time.time + (walked ? 0.69f : 0.72f);
            lastInput = lastSwing = Time.time;
            Stamina -= SwingCost;
            if (!Physics.Raycast(ray, out var hit, 2.55f, Physics.DefaultRaycastLayers, QueryTriggerInteraction.Ignore) ||
                !hit.collider.TryGetComponent<TimberTree>(out var tree) || tree.Record.felled)
            {
                audio.Swing();
                return false;
            }

            if (Coop.Guest)
            {
                Coop.RequestCut();
                return true;
            }
            StrikeTree(tree, hit, ray);
            return true;
        }

        internal void CutFromPeer(Ray ray)
        {
            if (Physics.Raycast(ray, out var hit, 2.55f, Physics.DefaultRaycastLayers, QueryTriggerInteraction.Ignore)
                && hit.collider.TryGetComponent<TimberTree>(out var tree) && !tree.Record.felled)
                StrikeTree(tree, hit, ray);
        }

        void StrikeTree(TimberTree tree, RaycastHit hit, Ray ray)
        {
            audio.Scrape();
            MakeChipBurst(hit.point, hit.normal);
            if (tree.Strike(DamageFor(tree), hit.point, ray.direction))
            {
                audio.Fall();
                Show("Timber! Hold E to drag the log.");
                Persist();
            }
        }

        void MakeChipBurst(Vector3 position, Vector3 normal)
        {
            for (int i = 0; i < 4; i++)
            {
                var chip = GameObject.CreatePrimitive(PrimitiveType.Cube);
                chip.name = "Wood chip";
                Destroy(chip.GetComponent<Collider>());
                chip.transform.position = position + normal * 0.06f;
                chip.transform.localScale = new Vector3(0.035f, 0.022f, 0.053f) * UnityEngine.Random.Range(0.65f, 1.55f);
                chip.GetComponent<MeshRenderer>().sharedMaterial = chipMaterial;
                var body = chip.AddComponent<Rigidbody>();
                body.linearVelocity = normal * 1.1f + UnityEngine.Random.insideUnitSphere * 1.7f + Vector3.up;
                body.angularVelocity = UnityEngine.Random.insideUnitSphere * 10;
                Destroy(chip, 0.52f);
            }
        }

        void AnimateKnife(float dt, bool moving)
        {
            float phase = Mathf.Clamp01((Time.time - lastSwing) / 0.48f);
            float arc = Mathf.Sin(phase * Mathf.PI);
            float flick = Mathf.Sin(phase * 23.5f) * arc;
            Vector3 bob = moving ? new Vector3(Mathf.Sin(Time.time * 9) * 0.013f, Mathf.Cos(Time.time * 18) * 0.013f, 0) : Vector3.zero;
            Vector3 grip = Held ? new Vector3(0.1f, -0.35f, -0.03f) : new Vector3(-arc * 0.18f, arc * 0.03f, arc * 0.19f);
            knife.localPosition = Vector3.Lerp(knife.localPosition, knifeOrigin + bob + grip, dt * 21);
            knife.localRotation = Quaternion.Slerp(knife.localRotation,
                knifeRotation * Quaternion.Euler(arc * 27 + flick * 9, arc * 23, -arc * 78 + flick * 13), dt * 23);
        }

        internal void OnBurnStarted(TimberTree tree)
        {
            Show("Burning " + tree.species.ToLowerInvariant() + "…", 3.4f);
            audio.Burn();
        }

        internal void CompleteSale(TimberTree tree)
        {
            if (tree.Record.sold)
                return;
            tree.Consume();
            Save.cash += tree.saleValue;
            Save.receipts.Add(new Receipt { treeId = tree.id, species = tree.species, amount = tree.saleValue });
            CashPopupPosition = exchange.transform.position + Vector3.up * 2f;
            CashPopupAmount = tree.saleValue;
            CashPopupUntil = Time.unscaledTime + 3;
            Show("Ash Exchange receipt · " + tree.species + " · +$" + tree.saleValue, 5.5f);
            audio.Sale();
            Persist();
        }

        internal bool Buy(Upgrade upgrade)
        {
            if (Coop.Guest || Has(upgrade.Id) || Save.cash < upgrade.Price || upgrade.Requires != null && !Has(upgrade.Requires))
                return false;
            Save.cash -= upgrade.Price;
            Save.upgrades.Add(upgrade.Id);
            audio.Sale();
            Show(upgrade.Name + " installed");
            Persist();
            return true;
        }

        internal void StartPlaying()
        {
            HasStarted = true;
            SetMenu(false);
        }

        internal void SetMenu(bool open)
        {
            MenuOpen = open;
            Time.timeScale = open && !Coop.InRoom ? 0 : 1;
            if (open)
            {
                Release();
                Unlock();
                Persist();
            }
            else if (DragLook)
                Unlock();
            else
                RequestLock();
        }

        void RequestLock()
        {
            lockRequest = Time.unscaledTime;
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }

        void Unlock()
        {
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
        }

        void Aim(Vector2 angles)
        {
            look = new Vector2(Mathf.Repeat(angles.x + 180, 360) - 180, Mathf.Clamp(angles.y, -82, 82));
            transform.rotation = Quaternion.Euler(0, look.x, 0);
            view.transform.localRotation = Quaternion.Euler(look.y, 0, 0);
        }

        void MoveTo(Vector3 position)
        {
            controller.enabled = false;
            transform.position = position;
            controller.enabled = true;
            gravity = 0;
        }

        internal void SetLookMode(bool drag)
        {
            DragLook = drag;
            PlayerPrefs.SetInt("clearcut.drag-look", drag ? 1 : 0);
            PlayerPrefs.Save();
        }

        internal void SetSensitivity(float value)
        {
            Sensitivity = value;
            PlayerPrefs.SetFloat("clearcut.sensitivity", value);
        }

        internal void SetVolume(float value)
        {
            Volume = value;
            AudioListener.volume = value;
            PlayerPrefs.SetFloat("clearcut.volume", value);
        }

        internal bool HighQuality => quality == 1;

        internal void SetQuality(bool high)
        {
            quality = high ? 1 : 0;
            ApplyQuality();
            PlayerPrefs.SetInt("clearcut.quality", quality);
            PlayerPrefs.Save();
        }

        void ApplyQuality()
        {
            QualitySettings.SetQualityLevel(quality == 1 ? QualitySettings.names.Length - 1 : 0);
            view.allowHDR = quality == 1;
            view.farClipPlane = quality == 1 ? 155 : 102;
        }

        internal string Export() => Persist();

        internal bool Import(string json)
        {
            if (Coop.InRoom || !CampaignSave.TryRead(json, out var imported))
                return false;
            imported.Write(slot);
            SceneManager.LoadScene(gameObject.scene.buildIndex);
            return true;
        }

        internal string Persist()
        {
            foreach (var tree in trees)
                tree.Snapshot();
            Save.hasPosition = true;
            Save.position = transform.position;
            Save.look = look;
            saveAt = Time.time + 8f;
            string encoded = slot == null ? JsonUtility.ToJson(Save) : Save.Write(slot);
            SaveStatus = slot == null ? "Synced from room host" : "Saved locally · " + DateTime.Now.ToString("HH:mm:ss");
            return encoded;
        }

        internal void BeginRoomSave(string roomSlot)
        {
            Release();
            slot = roomSlot;
        }

        internal string MakeRoomState()
        {
            foreach (var tree in trees)
                tree.Snapshot();
            var state = new CampaignSave { cash = Save.cash, upgrades = Save.upgrades, receipts = Save.receipts };
            state.trees.AddRange(Save.trees.FindAll(item => item.damage > 0 || item.felled));
            return JsonUtility.ToJson(state);
        }

        internal bool ApplyRoomState(string json)
        {
            if (!CampaignSave.TryRead(json, out var state))
                return false;
            Save = state;
            foreach (var tree in trees)
                tree.ApplyHostRecord(Save.ForTree(tree.id));
            return true;
        }

        internal void Show(string message, float seconds = 3f)
        {
            Notice = message;
            NoticeUntil = Time.unscaledTime + seconds;
        }

        void OnApplicationPause(bool pause)
        {
            if (pause && Save != null)
                Persist();
        }

        void OnApplicationFocus(bool focused)
        {
            if (!focused && Save != null && HasStarted)
            {
                Release();
                Persist();
            }
        }

        void OnApplicationQuit()
        {
            if (HasStarted)
                Persist();
        }

        void OnDestroy()
        {
            Time.timeScale = 1;
            Unlock();
        }

        internal readonly struct Upgrade
        {
            public readonly string Id, Name, Effect, Requires;
            public readonly int Price;

            public Upgrade(string id, string name, string effect, int price, string requires = null)
            {
                Id = id;
                Name = name;
                Effect = effect;
                Price = price;
                Requires = requires;
            }
        }
    }
}
