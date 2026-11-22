using UnityEngine;

namespace Clearcut
{
    public sealed class TimberTree : MonoBehaviour
    {
        public int id;
        public string species;
        public float height;
        public float radius;
        public float toughness;
        public float mass;
        public int saleValue;
        public Transform standing;
        public Collider trunk;
        public GameObject stumpPrefab;
        public GameObject logPrefab;
        public Material freshWood;

        public TreeRecord Record { get; private set; }
        public Rigidbody Log { get; private set; }
        public float Progress => Mathf.Clamp01(Record.damage / toughness);
        Transform notch;
        GameObject logDisplay;
        Transform toppledCanopy;
        float clearCanopyAt;
        Vector3 notchDirection;
        bool hasCutDirection;

        public void Restore(TreeRecord record)
        {
            Record = record;
            if (record.felled)
            {
                LeaveStump();
                standing.gameObject.SetActive(false);
                if (!record.sold)
                    MakeLog(record.logPosition, record.logRotation);
            }
            else if (record.damage > 0)
                MarkNotch(transform.position + transform.forward * radius);
        }

        public bool Strike(float damage, Vector3 point, Vector3 away)
        {
            if (Record.felled)
                return false;
            Record.damage = Mathf.Min(toughness, Record.damage + damage);
            MarkNotch(point);
            if (Record.damage < toughness)
                return false;

            Vector3 direction = Vector3.ProjectOnPlane(away, Vector3.up).normalized;
            if (direction.sqrMagnitude < 0.01f)
                direction = transform.forward;
            LeaveStump();
            trunk.enabled = false;
            notch.gameObject.SetActive(false);
            Quaternion tilt = Quaternion.FromToRotation(Vector3.up, Vector3.up + direction * 0.17f);
            Vector3 center = transform.position + Vector3.up * (height * 0.5f) + direction * (height * 0.09f);
            MakeLog(center, tilt * transform.rotation);
            Physics.IgnoreCollision(Log.GetComponent<Collider>(), GetComponentInChildren<StumpMarker>().GetComponent<Collider>());
            toppledCanopy = standing;
            toppledCanopy.SetParent(Log.transform);
            toppledCanopy.localPosition = -Vector3.up * (height * 0.5f);
            toppledCanopy.localRotation = Quaternion.identity;
            logDisplay.SetActive(false);
            clearCanopyAt = Time.time + 2.1f;
            Log.AddTorque(Vector3.Cross(Vector3.up, direction) * (mass * height * 0.42f), ForceMode.Impulse);
            Record.felled = true;
            Snapshot();
            return true;
        }

        void Update()
        {
            if (!toppledCanopy || Time.time < clearCanopyAt)
                return;

            Destroy(toppledCanopy.gameObject);
            toppledCanopy = null;
            if (logDisplay)
                logDisplay.SetActive(true);
        }

        void MarkNotch(Vector3 point)
        {
            if (!hasCutDirection)
            {
                notchDirection = Vector3.ProjectOnPlane(point - transform.position, Vector3.up).normalized;
                if (notchDirection.sqrMagnitude < 0.01f)
                    notchDirection = transform.forward;
                hasCutDirection = true;
            }
            if (!notch)
            {
                var mark = GameObject.CreatePrimitive(PrimitiveType.Cube);
                mark.name = "Growing cut";
                Destroy(mark.GetComponent<Collider>());
                notch = mark.transform;
                notch.SetParent(transform);
                notch.GetComponent<MeshRenderer>().sharedMaterial = freshWood;
                notch.position = transform.position + Vector3.up * Mathf.Clamp(point.y - transform.position.y, 0.45f, height * 0.7f)
                    + notchDirection * (radius * 0.97f);
                notch.rotation = Quaternion.LookRotation(notchDirection);
            }
            notch.localScale = new Vector3(radius * Mathf.Lerp(0.22f, 1.65f, Progress), Mathf.Lerp(0.024f, 0.12f, Progress), 0.105f);
        }

        void LeaveStump()
        {
            var stump = Instantiate(stumpPrefab, transform.position, transform.rotation, transform);
            stump.name = species + " stump";
            float scale = radius / 0.16f;
            stump.transform.localScale = new Vector3(scale, Mathf.Sqrt(scale), scale);
            stump.AddComponent<StumpMarker>();
            var collider = stump.AddComponent<BoxCollider>();
            collider.size = new Vector3(0.34f, 0.33f, 0.34f);
            collider.center = new Vector3(0, 0.165f, 0);
            trunk.enabled = false;
        }

        void MakeLog(Vector3 position, Quaternion rotation)
        {
            GameObject body = new GameObject(species + " timber");
            body.transform.SetPositionAndRotation(position, rotation);
            var collider = body.AddComponent<CapsuleCollider>();
            collider.radius = radius;
            collider.height = height * 0.97f;
            collider.material = new PhysicsMaterial("Timber against dirt")
            {
                dynamicFriction = 0.65f, staticFriction = 0.8f, bounciness = 0.08f
            };
            var part = body.AddComponent<FelledTimber>();
            part.tree = this;
            Log = body.AddComponent<Rigidbody>();
            Log.mass = mass;
            Log.linearDamping = 0.23f;
            Log.angularDamping = 0.7f;
            Log.interpolation = RigidbodyInterpolation.Interpolate;
            Log.collisionDetectionMode = CollisionDetectionMode.ContinuousDynamic;
            logDisplay = Instantiate(logPrefab, body.transform);
            logDisplay.transform.localScale = new Vector3(radius / 0.16f, height / 2.75f, radius / 0.16f);
        }

        public void Snapshot()
        {
            if (!Log || Record.sold)
                return;
            Record.logPosition = Log.position;
            Record.logRotation = Log.rotation;
        }

        public void Consume()
        {
            Record.sold = true;
            Destroy(Log.gameObject);
            Log = null;
            toppledCanopy = null;
        }
    }
}
