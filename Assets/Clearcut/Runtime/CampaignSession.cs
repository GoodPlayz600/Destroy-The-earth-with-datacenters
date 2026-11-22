using System;
using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.SceneManagement;

namespace Clearcut
{
    [RequireComponent(typeof(CharacterController))]
    public sealed class CampaignSession : MonoBehaviour
    {
        public Camera view;
        public Transform knife, pocketSaw;
        public AshExchange exchange;
        public TimberTree[] trees;
        public TimberYard[] yard = Array.Empty<TimberYard>();
        public Material chipMaterial;

        static Upgrade[] implementedUpgrades;

        internal static Upgrade[] Upgrades => implementedUpgrades ??= new[]
        {
            UpgradeCatalog.Playable("01-01", "Knife swings use 15% less stamina."),
            UpgradeCatalog.Playable("01-02", "Deal 35% more damage to saplings."),
            UpgradeCatalog.Playable("02-01", "Apply 15% more force while dragging."),
            UpgradeCatalog.Playable("02-02", "Walk and run 8% faster."),
            UpgradeCatalog.Playable("03-01", "Press T near light cargo to attach or release twine."),
            UpgradeCatalog.Playable("03-02", "The tether is 50% longer."),
            UpgradeCatalog.Playable("03-03", "The hitch holds heavier cargo and resists more tension."),
            UpgradeCatalog.Playable("04-01", "Accept logs up to 30% heavier."),
            UpgradeCatalog.Playable("04-02", "Burn wood 25% faster."),
            UpgradeCatalog.Playable("05-01", "Equip with 2. Cuts small trees more than twice as fast.")
        };

        internal OpeningCoop Coop { get; private set; }
        internal CampaignSave Save { get; private set; }
        internal TimberTree TargetTree { get; private set; }
        internal TimberTree TargetLog { get; private set; }
        internal TimberTree Held { get; private set; }
        internal TimberYard WorkTarget { get; private set; }
        internal bool UsingSaw { get; private set; }
        internal bool Tethered { get; private set; }
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
        OpeningHud hud;
        TowlineView towline;
        internal float RopeLength => Has("03-02") ? 3.15f : 2.1f;
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
        string slot;
        bool walked;
        int quality;

        bool Has(string id) => Save.Owns(id);
        internal float DamageFor(TimberTree tree, bool saw = false)
        {
            if (saw && Has("05-01"))
                return tree.height <= 3 ? 2.4f : 0.7f;
            return Has("01-02") && tree.height <= 3 ? 1.35f : 1;
        }

        internal bool EquipSaw(bool enabled)
        {
            if (enabled && (!pocketSaw || !Has("05-01")))
                return false;
            UsingSaw = enabled;
            knife.gameObject.SetActive(!enabled);
            if (pocketSaw)
                pocketSaw.gameObject.SetActive(enabled);
            return true;
        }
        internal float SwingCost => UsingSaw ? 0.102f : Has("01-01") ? 0.0714f : 0.084f;
        internal float WalkSpeed => Has("02-02") ? 4.536f : 4.2f;
        internal float Grip => Has("02-01") ? 1.15f : 1;
        internal bool Hauling => Held || Coop.GuestHauling;
        internal bool IsHeld(TimberTree tree) => Held == tree || Coop.IsHeldByGuest(tree);

        void Awake()
        {
            controller = GetComponent<CharacterController>();
            hud = GetComponent<OpeningHud>();
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

            if (keyboard.escapeKey.wasPressedThisFrame || (!hud.EditingText &&
                (keyboard.tabKey.wasPressedThisFrame || keyboard.iKey.wasPressedThisFrame)))
            {
                SetMenu(!MenuOpen);
                return;
            }

            if (MenuOpen)
                return;

            bool locked = PointerLocked;
#if !UNITY_WEBGL || UNITY_EDITOR
            if (!DragLook && !locked && mouse.leftButton.wasPressedThisFrame)
            {
                RequestLock();
                return;
            }
#endif
            if (locked || mouse.rightButton.isPressed)
                Aim(look + mouse.delta.ReadValue() * Sensitivity * new Vector2(1, -1));

            float dt = Time.deltaTime;
            Vector2 motion = new((keyboard.dKey.isPressed ? 1 : 0) - (keyboard.aKey.isPressed ? 1 : 0),
                (keyboard.wKey.isPressed ? 1 : 0) - (keyboard.sKey.isPressed ? 1 : 0));
            bool sprint = keyboard.leftShiftKey.isPressed && !Hauling && Stamina > 0.09f && motion.sqrMagnitude > 0;
            Walk(motion, sprint, keyboard.spaceKey.wasPressedThisFrame, dt);

            var ray = new Ray(view.transform.position, view.transform.forward);
            FindTargets(ray);
            WorkTarget = FindWorkStation(ray);
            if (keyboard.digit1Key.wasPressedThisFrame)
                EquipSaw(false);
            if (keyboard.digit2Key.wasPressedThisFrame && !EquipSaw(true))
                Show("Unlock Pocket Saw at the field desk.");
            if (keyboard.gKey.wasPressedThisFrame)
            {
                if (Coop.Guest)
                    Coop.ReleaseGuestGrip();
                else
                    Release();
            }
            else if (keyboard.tKey.wasPressedThisFrame)
            {
                if (Coop.Guest)
                    Coop.ToggleGuestTowline(TargetLog);
                else
                    ToggleTowline(ray);
            }
            else if (Coop.Guest)
                Coop.UpdateGuestGrip(keyboard.eKey.isPressed, TargetLog);
            else if (!Tethered && keyboard.eKey.isPressed && !Held)
                TryGrab(ray);
            else if (!Tethered && !keyboard.eKey.isPressed && Held)
                Release();
            if (mouse.leftButton.isPressed && !Hauling)
            {
                if (!WorkTarget)
                    Swing(ray);
                else if (Coop.Guest)
                    Coop.RequestWork();
                else
                    WorkTarget.Work();
            }
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
            float speedMultiplier = sprint ? 1.57f : 1;
            if (Hauling)
                speedMultiplier = Tethered || Coop.GuestTethered ? 0.8f : 0.56f;
            float speed = WalkSpeed * speedMultiplier;
            if (controller.isGrounded)
                gravity = jump && !Hauling ? 5.9f : -1.4f;
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
            if (!Held || MenuOpen)
                return;
            bool connected = Tethered
                ? PullTowline(Held, localGrip, transform.position, transform.forward)
                : PullTimber(Held, localGrip, transform.position, view.transform.forward);
            if (!connected)
            {
                if (Tethered)
                    Show("The tether slipped loose.");
                Release();
            }
        }

        internal bool CanTether(TimberTree tree) =>
            Has("03-01") && tree && tree.Log && !tree.ReservedBy && tree.Log.mass <= (Has("03-03") ? 62 : 24);

        internal Rigidbody TetherBody(int id)
        {
            foreach (var tree in trees)
                if (tree.id == id)
                    return tree.Log;
            return null;
        }

        internal void ToggleTowline(Ray ray)
        {
            if (Tethered)
            {
                Release();
                return;
            }
            if (!Held)
                FindTargets(ray);
            var target = Held ? Held : TargetLog;
            if (!CanTether(target))
            {
                Show(Has("03-01") ? "Aim at light, loose cargo to attach twine." : "Buy Twine Bundle in the field desk.");
                return;
            }

            Held = target;
            Vector3 end = target.CargoCollider.ClosestPoint(transform.position + Vector3.up * 0.55f);
            localGrip = target.Log.transform.InverseTransformPoint(end);
            Tethered = true;
            target.Log.WakeUp();
            Show("Twine attached. Press G or T to release.");
        }

        internal bool PullTowline(TimberTree tree, Vector3 gripPoint, Vector3 position, Vector3 facing)
        {
            if (!CanTether(tree))
                return false;
            var body = tree.Log;
            Vector3 start = position + Vector3.up * 0.62f - facing * 0.24f;
            Vector3 end = body.transform.TransformPoint(gripPoint);
            Vector3 separation = start - end;
            float length = separation.magnitude;
            bool hitch = Has("03-03");
            if (length > RopeLength + (hitch ? 2.85f : 1.8f))
                return false;
            if (length <= RopeLength)
                return true;
            Vector3 axis = separation / length;
            float force = (length - RopeLength) * 410f - Vector3.Dot(body.GetPointVelocity(end), axis) * 42f;
            body.AddForceAtPosition(axis * Mathf.Clamp(force, 0, hitch ? 880 : 505), end);
            return true;
        }

        void LateUpdate()
        {
            Rigidbody body = null;
            if (Tethered && Held)
                body = Held.Log;
            else if (Coop.GuestTethered)
                body = TetherBody(Coop.GuestTetherId);
            if (!body)
            {
                if (towline)
                    towline.gameObject.SetActive(false);
                return;
            }
            if (!towline)
            {
                var visual = new GameObject("Twine between operator and cargo");
                visual.transform.SetParent(transform, false);
                towline = visual.AddComponent<TowlineView>();
                towline.Initialize(chipMaterial);
            }

            Vector3 start = transform.position + Vector3.up * 0.62f - transform.forward * 0.24f;
            Vector3 end = Tethered ? body.transform.TransformPoint(localGrip) : body.worldCenterOfMass;
            towline.gameObject.SetActive(true);
            towline.Draw(start, end, Mathf.Clamp((RopeLength - Vector3.Distance(start, end)) * 0.25f, 0.025f, 0.25f));
        }

        internal bool PullTimber(TimberTree tree, Vector3 gripPoint, Vector3 operatorPosition, Vector3 lookDirection)
        {
            if (!tree.Log)
                return false;
            var body = tree.Log;
            Vector3 point = body.transform.TransformPoint(gripPoint);
            Vector3 forward = Vector3.ProjectOnPlane(lookDirection, Vector3.up).normalized;
            Vector3 target = operatorPosition + forward * 1.12f + Vector3.up * Mathf.Clamp(0.39f + lookDirection.y * 0.21f, 0.22f, 0.60f);
            Vector3 offset = target - point;
            if (offset.sqrMagnitude > 18)
                return false;
            Vector3 spring = offset * 320f - body.GetPointVelocity(point) * 31f;
            spring.y = Mathf.Clamp(spring.y, -225, 285);
            body.AddForceAtPosition(Vector3.ClampMagnitude(spring, 655 * Grip), point, ForceMode.Force);
            return true;
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
                if (felled && !felled.tree.ReservedBy && !Coop.IsHeldByGuest(felled.tree))
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
                if (!tree.Log || tree.ReservedBy || Coop.IsHeldByGuest(tree))
                    continue;
                var collider = tree.CargoCollider;
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
            var collider = Held.CargoCollider;
            Vector3 point = collider.ClosestPoint(ray.origin + ray.direction * 1.55f);
            localGrip = Held.Log.transform.InverseTransformPoint(point);
            Held.Log.WakeUp();
            return true;
        }

        internal bool TryRemoteGrip(int treeId, Ray ray, out TimberTree tree, out Vector3 gripPoint)
        {
            tree = Array.Find(trees, candidate => candidate.id == treeId);
            gripPoint = Vector3.zero;
            if (!tree || !tree.Log || IsHeld(tree) || tree.ReservedBy)
                return false;
            var collider = tree.CargoCollider;
            Vector3 point = collider.ClosestPoint(ray.GetPoint(1.55f));
            Vector3 toward = point - ray.origin;
            float distance = toward.magnitude;
            if (distance > 2.8f || Vector3.Dot(toward.normalized, ray.direction) < 0.65f)
                return false;
            if (Physics.Raycast(ray.origin, toward.normalized, out var hit, distance + 0.03f,
                Physics.DefaultRaycastLayers, QueryTriggerInteraction.Ignore) && hit.collider != collider)
                return false;
            gripPoint = tree.Log.transform.InverseTransformPoint(point);
            tree.Log.WakeUp();
            return true;
        }

        internal void Release()
        {
            if (!Held)
                return;
            Held.Snapshot();
            Held = null;
            Tethered = false;
        }

        internal bool Swing(Ray ray)
        {
            if (Time.time < nextSwing || Stamina < SwingCost)
                return false;
            nextSwing = Time.time + (UsingSaw ? 0.61f : walked ? 0.69f : 0.72f);
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
                Coop.RequestCut(UsingSaw);
                return true;
            }
            StrikeTree(tree, hit, ray, UsingSaw);
            return true;
        }

        internal TimberYard FindWorkStation(Ray ray)
        {
            foreach (var station in yard)
                if (station.CanWork(ray))
                    return station;
            return null;
        }

        internal void CutFromPeer(Ray ray, bool saw)
        {
            if (Physics.Raycast(ray, out var hit, 2.55f, Physics.DefaultRaycastLayers, QueryTriggerInteraction.Ignore)
                && hit.collider.TryGetComponent<TimberTree>(out var tree) && !tree.Record.felled)
                StrikeTree(tree, hit, ray, saw);
        }

        void StrikeTree(TimberTree tree, RaycastHit hit, Ray ray, bool saw)
        {
            audio.Scrape();
            MakeChipBurst(hit.point, hit.normal);
            if (tree.Strike(DamageFor(tree, saw), hit.point, ray.direction))
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
            Vector3 grip = Hauling ? new Vector3(0.1f, -0.35f, -0.03f) : new Vector3(-arc * 0.18f, arc * 0.03f, arc * 0.19f);
            Transform tool = UsingSaw ? pocketSaw : knife;
            tool.localPosition = Vector3.Lerp(tool.localPosition, knifeOrigin + bob + grip, dt * 21);
            tool.localRotation = Quaternion.Slerp(tool.localRotation,
                knifeRotation * Quaternion.Euler(arc * 27 + flick * 9, arc * 23, -arc * 78 + flick * 13), dt * 23);
        }

        internal void OnBurnStarted(TimberTree tree)
        {
            Show("Burning " + tree.species.ToLowerInvariant() + "…", 3.4f);
            audio.Burn();
        }

        internal void CompleteSale(TimberTree tree) =>
            CompleteSale(tree, tree.saleValue, "Ash Exchange", exchange.transform.position);

        internal void CompleteSale(TimberTree tree, int amount, string buyer, Vector3 location)
        {
            if (tree.Record.sold)
                return;
            tree.Consume();
            Save.cash += amount;
            Save.receipts.Add(new Receipt {
                treeId = tree.id, species = tree.species, amount = amount, buyer = buyer, product = tree.Record.product
            });
            CashPopupPosition = location + Vector3.up * 2f;
            CashPopupAmount = amount;
            CashPopupUntil = Time.unscaledTime + 3;
            Show(buyer + " receipt · " + tree.species + " · +$" + amount, 5.5f);
            audio.Sale();
            Persist();
        }

        internal bool Buy(Upgrade upgrade)
        {
            if (Coop.Guest)
            {
                Coop.RequestPurchase(upgrade.Id);
                return false;
            }
            if (Has(upgrade.Id) || Save.cash < upgrade.Price || upgrade.Requires != null && !Has(upgrade.Requires))
                return false;
            Save.cash -= upgrade.Price;
            Save.upgrades.Add(upgrade.Id);
            audio.Sale();
            Show(upgrade.Name + " installed");
            Persist();
            return true;
        }

        internal void BuyFromPeer(string id)
        {
            foreach (var upgrade in Upgrades)
                if (upgrade.Id == id)
                {
                    Buy(upgrade);
                    return;
                }
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
                Coop.ReleaseGuestGrip();
                Release();
                Unlock();
                Persist();
            }
            else if (DragLook)
                Unlock();
            else
                RequestLock();
        }

#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")] static extern void ClearcutPointerArm(int enabled);
        [DllImport("__Internal")] static extern int ClearcutPointerLocked();

        internal bool PointerLocked => ClearcutPointerLocked() != 0;
#else
        internal bool PointerLocked => Cursor.lockState == CursorLockMode.Locked;
#endif

        void RequestLock()
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            ClearcutPointerArm(1);
#else
            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
#endif
        }

        void Unlock()
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            ClearcutPointerArm(0);
#else
            Cursor.lockState = CursorLockMode.None;
            Cursor.visible = true;
#endif
        }

        [UnityEngine.Scripting.Preserve]
        public void OnWebPointerLockDenied()
        {
            DragLook = true;
            Show("Mouse lock unavailable · hold right mouse to look", 5f);
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

        internal void BeginRoomSave(string roomSlot, int joiningActor)
        {
            Release();
            slot = roomSlot;
            if (joiningActor > 0)
            {
                exchange.CancelLocal();
                foreach (var station in yard)
                    station.CancelLocal();
                EquipSaw(false);
                MoveTo(spawn + new Vector3(-1.35f * (joiningActor - 1), 0, -0.8f));
                Aim(Vector2.zero);
            }
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
            if (UsingSaw && !Has("05-01"))
                EquipSaw(false);
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
                Coop.ReleaseGuestGrip();
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
