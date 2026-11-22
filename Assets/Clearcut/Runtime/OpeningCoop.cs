using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Clearcut
{
    public sealed class OpeningCoop : MonoBehaviour
    {
        public bool InRoom { get; private set; }
        public bool Guest => InRoom && actor != master;
        public bool Connecting { get; private set; }
        public string Status { get; private set; } = "Private rooms · up to four players";
        public string RoomCode { get; private set; }
        public int PlayerCount => avatars.Count + 1;
        public bool GuestHauling { get; private set; }
        public bool GuestTethered { get; private set; }
        public int GuestTetherId => gripRequestedFor;
        public bool Ready { get; private set; }
        public int LocalActor => actor;

        const int PoseCode = 40, StateCode = 41, HelloCode = 42, ActionCode = 43, GripCode = 44;
        readonly Dictionary<int, Ghost> avatars = new();
        CampaignSession game;
        GameObject avatarPrefab;
        int actor, master;
        float nextPose, nextState;
        string lastState;
        int gripRequestedFor;
        bool towlineRequested;
        float nextWork;

#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")] static extern void ClearcutPhotonOpen(string id, string region, string room, int host);
        [DllImport("__Internal")] static extern void ClearcutPhotonSend(int code, string payload, int target);
        [DllImport("__Internal")] static extern void ClearcutPhotonClose();
#endif

        void Awake()
        {
            game = GetComponent<CampaignSession>();
            avatarPrefab = Resources.Load<GameObject>("FieldOperatorAvatar");
        }

#if UNITY_EDITOR
        internal void StartHostForSmokeTest()
        {
            actor = master = 1;
            InRoom = Ready = true;
        }
#endif

        public void Open(string id, string region, string room, bool host)
        {
            if (Connecting || InRoom)
                return;
            if (!Guid.TryParse(id.Trim(), out var app) || region.Trim().Length == 0)
            {
                Status = "Enter a Realtime App ID and region.";
                return;
            }
            if (!host && (room.Trim().Length != 10 || !Guid.TryParseExact(room.Trim().PadRight(32, '0'), "N", out _)))
            {
                Status = "Enter the host's 10-character room code.";
                return;
            }
#if UNITY_WEBGL && !UNITY_EDITOR
            Connecting = true;
            game.Persist();
            RoomCode = host ? Guid.NewGuid().ToString("N")[..10].ToUpperInvariant() : room.Trim().ToUpperInvariant();
            Status = "Connecting to Photon…";
            ClearcutPhotonOpen(app.ToString(), region.Trim().ToLowerInvariant(), RoomCode, host ? 1 : 0);
#else
            Status = "Photon co-op is currently available in the Web build.";
#endif
        }

        public void Leave()
        {
            if (!InRoom && !Connecting)
                return;
            Close();
        }

        void Close()
        {
            bool hadRoom = InRoom;
            if (hadRoom && !Guest)
                game.Persist();
            Connecting = InRoom = false;
#if UNITY_WEBGL && !UNITY_EDITOR
            ClearcutPhotonClose();
#endif
            if (hadRoom)
                SceneManager.LoadScene(gameObject.scene.buildIndex);
            else
                Status = "Connection canceled.";
        }

        [UnityEngine.Scripting.Preserve]
        public void OnPhotonMessage(string json)
        {
            var message = Decode<Packet>(json);
            if (message == null)
                return;

            switch (message.kind)
            {
                case "joined":
                    actor = message.actor;
                    master = message.master;
                    Connecting = false;
                    InRoom = true;
                    Ready = !Guest;
                    game.BeginRoomSave(Guest ? null : ".room." + RoomCode, Guest ? LocalActor : 0);
                    Time.timeScale = 1;
                    Status = Guest ? "Waiting for the host's clearing…" : "Hosting private room";
                    if (Guest)
                        Send(HelloCode, "ready", master);
                    break;
                case "error":
                    Connecting = false;
                    Status = message.payload;
                    break;
                case "closed":
                    Close();
                    break;
                case "left":
                    if (avatars.Remove(message.actor, out var entry) && entry.Display)
                        Destroy(entry.Display);
                    break;
                case "event":
                    Deliver(message);
                    break;
            }
        }

        void Deliver(Packet message)
        {
            if (!InRoom || message.actor == actor)
                return;
            if (message.code == HelloCode && !Guest)
            {
                Send(StateCode, game.MakeRoomState(), message.actor);
                return;
            }
            if (message.code == StateCode && Guest && message.actor == master)
            {
                if (game.ApplyRoomState(message.payload))
                {
                    Ready = true;
                    Status = "Connected to the host";
                }
                return;
            }
            if (message.code == GripCode && Guest && message.actor == master)
            {
                GuestTethered = message.payload == "tethered" && gripRequestedFor != 0;
                GuestHauling = GuestTethered || message.payload == "held" && gripRequestedFor != 0;
                if (!GuestHauling)
                {
                    if (towlineRequested)
                        gripRequestedFor = 0;
                    towlineRequested = false;
                    if (message.payload != "released")
                        game.Show(message.payload);
                }
                return;
            }

            if (message.code == PoseCode)
            {
                var pose = Decode<OperatorPose>(message.payload);
                if (pose != null && pose.Valid)
                    UpdateGhost(message.actor, pose);
            }
            else if (message.code == ActionCode && !Guest)
            {
                var request = Decode<OperatorAction>(message.payload);
                if (request?.pose != null && request.pose.Valid)
                    ApplyAction(message.actor, request, UpdateGhost(message.actor, request.pose));
            }
        }

        Ghost UpdateGhost(int number, OperatorPose pose)
        {
            if (!avatars.TryGetValue(number, out var ghost))
            {
                var display = avatarPrefab
                    ? Instantiate(avatarPrefab, pose.position, Quaternion.Euler(0, pose.yaw, 0))
                    : null;
                ghost = new Ghost(display);
                avatars.Add(number, ghost);
            }
            ghost.Pose = pose;
            ghost.LastSeen = Time.unscaledTime;
            return ghost;
        }

        void ApplyAction(int number, OperatorAction action, Ghost ghost)
        {
            switch (action.kind)
            {
                case "chop" when ghost.Holding == null && Time.unscaledTime >= ghost.NextChop:
                    ghost.NextChop = Time.unscaledTime + 0.62f;
                    game.CutFromPeer(ghost.Pose.Ray, action.saw);
                    break;
                case "tether":
                case "grab":
                    bool twine = action.kind == "tether";
                    if (ghost.Holding != null || !game.TryRemoteGrip(action.treeId, ghost.Pose.Ray, out var timber, out var localGrip))
                    {
                        Send(GripCode, "That log is out of reach or already held.", number);
                        break;
                    }
                    if (twine && !game.CanTether(timber))
                    {
                        Send(GripCode, "Unlock twine and aim at light cargo.", number);
                        break;
                    }
                    ghost.Holding = timber;
                    ghost.Tether = twine;
                    ghost.LocalGrip = localGrip;
                    Send(GripCode, twine ? "tethered" : "held", number);
                    break;
                case "release":
                    ReleaseGrip(number, ghost, "released");
                    break;
                case "work" when ghost.Holding == null:
                    var station = game.FindWorkStation(ghost.Pose.Ray);
                    if (station)
                        station.Work();
                    break;
                case "buy":
                    game.BuyFromPeer(action.upgradeId);
                    break;
            }
        }

        void ReleaseGrip(int number, Ghost ghost, string reason)
        {
            if (ghost.Holding != null)
                ghost.Holding.Snapshot();
            ghost.Holding = null;
            Send(GripCode, reason, number);
        }

        internal bool IsHeldByGuest(TimberTree tree)
        {
            foreach (var ghost in avatars.Values)
                if (ghost.Holding == tree)
                    return true;
            return false;
        }

        void FixedUpdate()
        {
            if (!InRoom || Guest)
                return;
            foreach (var pair in avatars)
            {
                var ghost = pair.Value;
                if (ghost.Holding == null)
                    continue;
                if (Time.unscaledTime - ghost.LastSeen > 1.6f)
                {
                    ReleaseGrip(pair.Key, ghost, "released");
                    continue;
                }
                bool held = ghost.Tether
                    ? game.PullTowline(ghost.Holding, ghost.LocalGrip, ghost.Pose.position, Quaternion.Euler(0, ghost.Pose.yaw, 0) * Vector3.forward)
                    : game.PullTimber(ghost.Holding, ghost.LocalGrip, ghost.Pose.position, ghost.Pose.Ray.direction);
                if (!held)
                    ReleaseGrip(pair.Key, ghost, "released");
            }
        }

        void Update()
        {
            if (!InRoom)
                return;
            float now = Time.unscaledTime;
            if (now >= nextPose)
            {
                nextPose = now + 0.09f;
                Send(PoseCode, JsonUtility.ToJson(CapturePose()));
            }
            if (!Guest && now >= nextState && PlayerCount > 1)
            {
                nextState = now + 0.14f;
                string snapshot = game.MakeRoomState();
                if (snapshot != lastState)
                {
                    Send(StateCode, snapshot);
                    lastState = snapshot;
                }
            }
            float weight = 1 - Mathf.Exp(-14 * Time.unscaledDeltaTime);
            foreach (var ghost in avatars.Values)
            {
                if (!ghost.Display)
                    continue;
                var display = ghost.Display.transform;
                display.position = Vector3.Lerp(display.position, ghost.Pose.position, weight);
                display.rotation = Quaternion.Euler(0, Mathf.LerpAngle(display.eulerAngles.y, ghost.Pose.yaw, weight), 0);
            }
        }

        OperatorPose CapturePose() => new()
        {
            position = transform.position, yaw = transform.eulerAngles.y, pitch = game.view.transform.localEulerAngles.x
        };

        public void RequestCut(bool saw) => Request("chop", saw: saw);

        public void RequestWork()
        {
            if (Time.unscaledTime < nextWork)
                return;
            nextWork = Time.unscaledTime + 0.12f;
            Request("work");
        }

        public void RequestPurchase(string id) => Request("buy", upgradeId: id);

        public void ToggleGuestTowline(TimberTree target)
        {
            if (towlineRequested)
            {
                ReleaseGuestGrip();
                return;
            }
            if (!Ready || gripRequestedFor != 0)
                return;
            if (!game.CanTether(target))
            {
                game.Show(game.Save.Owns("03-01") ? "Aim at light, loose cargo to attach twine." : "Buy Twine Bundle in the field desk.");
                return;
            }
            gripRequestedFor = target.id;
            towlineRequested = true;
            Request("tether", target.id);
        }

        public void UpdateGuestGrip(bool pressed, TimberTree target)
        {
            if (towlineRequested)
                return;
            if (pressed && Ready && gripRequestedFor == 0 && target)
            {
                gripRequestedFor = target.id;
                Request("grab", target.id);
            }
            else if (!pressed)
                ReleaseGuestGrip();
        }

        public void ReleaseGuestGrip()
        {
            if (gripRequestedFor == 0)
                return;
            gripRequestedFor = 0;
            GuestHauling = GuestTethered = towlineRequested = false;
            Request("release");
        }

        void Request(string kind, int treeId = 0, string upgradeId = null, bool saw = false)
        {
            if (Guest && Ready)
                Send(ActionCode, JsonUtility.ToJson(new OperatorAction { kind = kind, pose = CapturePose(),
                    treeId = treeId, upgradeId = upgradeId, saw = saw }), master);
        }

        static T Decode<T>(string json) where T : class
        {
            if (string.IsNullOrEmpty(json) || json.Length > 200000)
                return null;
            try
            {
                return JsonUtility.FromJson<T>(json);
            }
            catch (ArgumentException)
            {
                return null;
            }
        }

        static void Send(int code, string payload, int target = 0)
        {
#if UNITY_WEBGL && !UNITY_EDITOR
            if (payload.Length <= 55000)
                ClearcutPhotonSend(code, payload, target);
#endif
        }

        void OnDestroy()
        {
            foreach (var avatar in avatars.Values)
                if (avatar.Display)
                    Destroy(avatar.Display);
#if UNITY_WEBGL && !UNITY_EDITOR
            if (Connecting || InRoom)
                ClearcutPhotonClose();
#endif
        }

        [Serializable] sealed class Packet
        {
            public string kind, payload;
            public int code, actor, master;
        }

        [Serializable] sealed class OperatorPose
        {
            public Vector3 position;
            public float yaw, pitch;
            public Ray Ray => new(position + Vector3.up * 1.62f, Quaternion.Euler(pitch, yaw, 0) * Vector3.forward);
            public bool Valid => Mathf.Abs(position.x) < 70 && Mathf.Abs(position.z) < 70 && Mathf.Abs(position.y) < 12 &&
                float.IsFinite(yaw) && float.IsFinite(pitch);
        }

        [Serializable] sealed class OperatorAction
        {
            public OperatorPose pose;
            public string kind, upgradeId;
            public bool saw;
            public int treeId;
        }

        sealed class Ghost
        {
            public readonly GameObject Display;
            public OperatorPose Pose;
            public TimberTree Holding;
            public bool Tether;
            public Vector3 LocalGrip;
            public float LastSeen, NextChop;
            public Ghost(GameObject display) => Display = display;
        }
    }
}
