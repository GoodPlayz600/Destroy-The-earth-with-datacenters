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
        public GameObject standingPrefab;
        public Collider trunk;
        public GameObject stumpPrefab;
        public GameObject logPrefab;
        public GameObject boardPrefab;
        public GameObject cratePrefab;
        public Material freshWood;

        public TreeRecord Record { get; private set; }
        public Rigidbody Log { get; private set; }
        public Component ReservedBy { get; private set; }
        public Collider CargoCollider => Record.product == TimberProduct.Log ? cylinder : package;
        CapsuleCollider cylinder;
        BoxCollider package;
        public float Progress => Mathf.Clamp01(Record.damage / toughness);
        Transform notch;
        GameObject logDisplay;
        Transform toppledCanopy;
        float clearCanopyAt;
        Vector3 notchDirection;
        bool hasCutDirection;
        bool followsHost;
        Vector3 hostPosition;
        Quaternion hostRotation;

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

        public void ApplyHostRecord(TreeRecord record)
        {
            bool wasFelled = Record.felled;
            bool changedProduct = Record.product != record.product;
            Record = record;
            if (record.felled)
            {
                if (!wasFelled)
                {
                    LeaveStump();
                    standing.gameObject.SetActive(false);
                    if (notch)
                        notch.gameObject.SetActive(false);
                }
                if (record.sold)
                {
                    if (Log)
                        Consume();
                    return;
                }
                if (!Log)
                    MakeLog(record.logPosition, record.logRotation);
                else if (changedProduct)
                    ConfigureCargo();
                Log.isKinematic = true;
                followsHost = true;
                hostPosition = record.logPosition;
                hostRotation = record.logRotation;
                return;
            }

            followsHost = false;
            if (wasFelled)
            {
                var stump = GetComponentInChildren<StumpMarker>();
                if (stump)
                    Destroy(stump.gameObject);
                if (Log)
                    Destroy(Log.gameObject);
                Log = null;
                if (!standing)
                    standing = Instantiate(standingPrefab, transform).transform;
                standing.gameObject.SetActive(true);
                trunk.enabled = true;
            }
            if (record.damage > 0)
            {
                MarkNotch(transform.position + transform.forward * radius);
                notch.gameObject.SetActive(true);
            }
            else if (notch)
                notch.gameObject.SetActive(false);
        }

        void FixedUpdate()
        {
            if (!followsHost || !Log)
                return;
            float weight = 1 - Mathf.Exp(-15 * Time.fixedDeltaTime);
            Log.MovePosition(Vector3.Lerp(Log.position, hostPosition, weight));
            Log.MoveRotation(Quaternion.Slerp(Log.rotation, hostRotation, weight));
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
            Physics.IgnoreCollision(CargoCollider, GetComponentInChildren<StumpMarker>().GetComponent<Collider>());
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
            cylinder = body.AddComponent<CapsuleCollider>();
            cylinder.radius = radius;
            cylinder.height = height * 0.97f;
            package = body.AddComponent<BoxCollider>();
            var friction = new PhysicsMaterial("Timber against dirt")
            {
                dynamicFriction = 0.65f, staticFriction = 0.8f, bounciness = 0.08f
            };
            cylinder.sharedMaterial = package.sharedMaterial = friction;
            var part = body.AddComponent<FelledTimber>();
            part.tree = this;
            Log = body.AddComponent<Rigidbody>();
            Log.linearDamping = 0.23f;
            Log.angularDamping = 0.7f;
            Log.interpolation = RigidbodyInterpolation.Interpolate;
            Log.collisionDetectionMode = CollisionDetectionMode.ContinuousDynamic;
            ConfigureCargo();
        }

        void ConfigureCargo()
        {
            bool raw = Record.product == TimberProduct.Log;
            bool crate = Record.product == TimberProduct.Crate;
            cylinder.enabled = raw;
            package.enabled = !raw;
            float scale = Mathf.Clamp(Mathf.Sqrt(mass / 19f), 0.7f, 2.25f);
            package.size = (crate ? new Vector3(0.85f, 0.74f, 0.79f) : new Vector3(0.50f, 0.30f, 1.38f)) * scale;
            Log.mass = raw ? mass : mass * (crate ? 0.67f : 0.80f);
            if (logDisplay)
            {
                logDisplay.SetActive(false);
                Destroy(logDisplay);
            }
            logDisplay = Instantiate(raw ? logPrefab : crate ? cratePrefab : boardPrefab, Log.transform);
            logDisplay.transform.localScale = raw
                ? new Vector3(radius / 0.16f, height / 2.75f, radius / 0.16f) : Vector3.one * scale;
        }

        public bool Reserve(Component owner)
        {
            if (ReservedBy || !Log || Record.sold)
                return false;
            ReservedBy = owner;
            Log.isKinematic = true;
            return true;
        }

        public void ReleaseReservation(Component owner)
        {
            if (ReservedBy != owner)
                return;
            ReservedBy = null;
            if (Log && !followsHost)
                Log.isKinematic = false;
        }

        public void SetProduct(TimberProduct product)
        {
            Record.product = product;
            if (toppledCanopy)
            {
                Destroy(toppledCanopy.gameObject);
                toppledCanopy = null;
            }
            ConfigureCargo();
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
            ReservedBy = null;
            Destroy(Log.gameObject);
            Log = null;
            toppledCanopy = null;
        }
    }
}
