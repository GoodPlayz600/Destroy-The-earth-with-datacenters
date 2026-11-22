using UnityEngine;

namespace Clearcut
{
    public sealed class AshExchange : MonoBehaviour
    {
        public Transform[] flames;
        public Light fireLight;
        public CampaignSession session;
        public float baseMaxMass = 41;
        public TimberTree Burning { get; private set; }
        public float Progress => Burning ? Mathf.Clamp01(1 - remaining / duration) : 0;
        public bool TooHeavy(TimberTree tree) => tree.mass > baseMaxMass * session.IntakeCapacity;

        float duration;
        float remaining;

        void OnTriggerStay(Collider other)
        {
            if (session.Coop.Guest)
                return;
            var dropped = other.GetComponent<FelledTimber>();
            if (dropped && !session.IsHeld(dropped.tree))
                TryIntake(dropped.tree);
        }

        void TryIntake(TimberTree tree)
        {
            if (Burning || tree.Record.product != TimberProduct.Log || tree.Record.sold || TooHeavy(tree) || !tree.Log)
                return;
            Vector3 center = tree.Log.worldCenterOfMass - transform.position;
            if (new Vector2(center.x, center.z).sqrMagnitude > 1.35f * 1.35f ||
                center.y > 1.8f || tree.Log.linearVelocity.sqrMagnitude > 16 ||
                Mathf.Abs(Vector3.Dot(tree.Log.transform.up, Vector3.up)) > 0.47f)
                return;

            if (!tree.Reserve(this))
                return;
            Burning = tree;
            duration = 2.8f / session.BurnThroughput;
            remaining = duration;
            session.OnBurnStarted(tree);
        }

        internal void CancelLocal()
        {
            if (Burning)
                Burning.ReleaseReservation(this);
            Burning = null;
        }

        void Update()
        {
            float time = Time.time;
            float intensity = Burning ? 1.4f : 1.0f;
            for (int index = 0; index < flames.Length; index++)
            {
                Transform flame = flames[index];
                float delay = index * 1.42f;
                float pulse = 0.91f + Mathf.Sin(time * (6 + index) + delay) * 0.2f;
                float height = (0.34f + index % 3 * 0.14f) * intensity * pulse;
                flame.localScale = new Vector3(0.24f * pulse, height, 0.24f * pulse);
                flame.localRotation = Quaternion.Euler(12 * Mathf.Sin(time * 5 + delay), time * 63 + index * 39, 14 * Mathf.Cos(time * 4 + delay));
            }
            fireLight.intensity = intensity * (1.9f + 0.36f * Mathf.Sin(time * 13));

            if (!Burning)
                return;
            remaining -= Time.deltaTime;
            if (remaining > 0)
                return;

            var sold = Burning;
            Burning = null;
            session.CompleteSale(sold);
        }
    }
}
