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

        const int PoseCode = 40, StateCode = 41, HelloCode = 42, ChopCode = 43;
        readonly Dictionary<int, Ghost> avatars = new();
        CampaignSession game;
        int actor, master;
        float nextPose, nextState;
        string lastState;

#if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")] static extern void ClearcutPhotonOpen(string id, string region, string room, int host);
        [DllImport("__Internal")] static extern void ClearcutPhotonSend(int code, string payload, int target);
        [DllImport("__Internal")] static extern void ClearcutPhotonClose();
#endif

        void Awake() => game = GetComponent<CampaignSession>();

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
            var message = JsonUtility.FromJson<Packet>(json);
            if (message == null)
                return;

            switch (message.kind)
            {
                case "joined":
                    actor = message.actor;
                    master = message.master;
                    Connecting = false;
                    InRoom = true;
                    game.BeginRoomSave(Guest ? null : ".room." + RoomCode);
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
                    if (avatars.Remove(message.actor, out var entry))
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
                    Status = "Connected to the host";
                return;
            }
            if (message.code != PoseCode && (message.code != ChopCode || Guest))
                return;
            var pose = JsonUtility.FromJson<OperatorPose>(message.payload);
            if (pose == null || !pose.Valid)
                return;
            if (!avatars.TryGetValue(message.actor, out var ghost))
            {
                ghost = new Ghost(CreateAvatar());
                ghost.Display.transform.position = pose.position;
                avatars.Add(message.actor, ghost);
            }
            ghost.Target = pose.position;
            ghost.Yaw = pose.yaw;
            if (message.code == ChopCode && Time.unscaledTime >= ghost.NextChop)
            {
                ghost.NextChop = Time.unscaledTime + 0.62f;
                var direction = Quaternion.Euler(pose.pitch, pose.yaw, 0) * Vector3.forward;
                game.CutFromPeer(new Ray(pose.position + Vector3.up * 1.62f, direction));
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
                Send(PoseCode, CapturePose());
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
                var display = ghost.Display.transform;
                display.position = Vector3.Lerp(display.position, ghost.Target, weight);
                display.rotation = Quaternion.Euler(0, Mathf.LerpAngle(display.eulerAngles.y, ghost.Yaw, weight), 0);
            }
        }

        GameObject CreateAvatar()
        {
            var root = new GameObject("Co-op field operator");
            Part(PrimitiveType.Capsule, new Vector3(0, 0.79f, 0), new Vector3(0.53f, 0.61f, 0.42f));
            Part(PrimitiveType.Sphere, new Vector3(0, 1.58f, 0), new Vector3(0.32f, 0.30f, 0.33f));
            Part(PrimitiveType.Sphere, new Vector3(0, 1.68f, 0.02f), new Vector3(0.43f, 0.14f, 0.41f));
            return root;

            void Part(PrimitiveType shape, Vector3 point, Vector3 scale)
            {
                var item = GameObject.CreatePrimitive(shape);
                Destroy(item.GetComponent<Collider>());
                item.transform.SetParent(root.transform, false);
                item.transform.localPosition = point;
                item.transform.localScale = scale;
                item.GetComponent<MeshRenderer>().sharedMaterial = game.chipMaterial;
            }
        }

        string CapturePose() => JsonUtility.ToJson(new OperatorPose
        {
            position = transform.position, yaw = transform.eulerAngles.y, pitch = game.view.transform.localEulerAngles.x
        });

        public void RequestCut()
        {
            if (Guest)
                Send(ChopCode, CapturePose(), master);
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
            public bool Valid => Mathf.Abs(position.x) < 70 && Mathf.Abs(position.z) < 70 && Mathf.Abs(position.y) < 12 &&
                float.IsFinite(yaw) && float.IsFinite(pitch);
        }

        sealed class Ghost
        {
            public readonly GameObject Display;
            public Vector3 Target;
            public float Yaw, NextChop;
            public Ghost(GameObject display) => Display = display;
        }
    }
}
