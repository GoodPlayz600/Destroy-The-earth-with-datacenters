using UnityEngine;

namespace Clearcut
{
    public enum TimberProduct { Log, Boards, DriedBoards, Crate }
    public enum YardService { RawBuyer, Sawmill, DryingRack, CrateBench, LumberBuyer }

    public sealed class TimberYard : MonoBehaviour
    {
        public YardService service;
        public CampaignSession session;
        public Transform intake;
        public Transform drop;
        public TimberTree Active { get; private set; }
        public bool Manual => service is YardService.Sawmill or YardService.CrateBench;
        public float Completion
        {
            get
            {
                var cargo = Active ? Active : FindReplicatedLoad();
                return cargo ? 1 - Mathf.Clamp01(cargo.Record.processRemaining / Duration) : 0;
            }
        }

        public string Label => service switch
        {
            YardService.RawBuyer => "Raw Timber Buyer",
            YardService.Sawmill => "Hand Sawmill",
            YardService.DryingRack => "Drying Rack",
            YardService.CrateBench => "Crate Bench",
            _ => "Lumber Buyer"
        };

        public string WorkPrompt => service == YardService.Sawmill ? "Hold LMB to saw timber" : "Hold LMB to assemble crate";
        float workUntil;
        float Duration => service switch
        {
            YardService.Sawmill => 4.6f,
            YardService.DryingRack => 8.5f,
            YardService.CrateBench => 4.1f,
            _ => 0.65f
        };

        public static string ProductName(TimberProduct product) => product switch
        {
            TimberProduct.Boards => "Rough boards",
            TimberProduct.DriedBoards => "Dried boards",
            TimberProduct.Crate => "Shipping crate",
            _ => "Raw log"
        };

        public static int Quote(int baseValue, TimberProduct product) => Mathf.Max(1, Mathf.RoundToInt(baseValue * (product switch
        {
            TimberProduct.Boards => 2.35f,
            TimberProduct.DriedBoards => 3.35f,
            TimberProduct.Crate => 4.45f,
            _ => 1.22f
        })));

        internal bool Accepts(TimberProduct product) => service switch
        {
            YardService.RawBuyer or YardService.Sawmill => product == TimberProduct.Log,
            YardService.DryingRack => product == TimberProduct.Boards,
            YardService.CrateBench => product == TimberProduct.DriedBoards,
            _ => product != TimberProduct.Log
        };

        void OnTriggerStay(Collider other)
        {
            if (Active || session.Coop.Guest || !other.TryGetComponent<FelledTimber>(out var load))
                return;
            var tree = load.tree;
            if (!tree.Log || tree.Record.sold || !Accepts(tree.Record.product) || session.IsHeld(tree) ||
                tree.Log.linearVelocity.sqrMagnitude > 13f)
                return;
            Vector3 offset = tree.Log.worldCenterOfMass - transform.position;
            if (new Vector2(offset.x, offset.z).sqrMagnitude > 2.15f || offset.y > 1.6f ||
                !tree.Reserve(this))
                return;

            Active = tree;
            if (tree.Record.processRemaining <= 0 || tree.Record.processService != (int)service)
                tree.Record.processRemaining = Duration;
            tree.Record.processService = (int)service;
            tree.Log.position = intake.position;
            tree.Log.rotation = intake.rotation * (tree.Record.product == TimberProduct.Log ?
                Quaternion.Euler(0, 0, 90) : Quaternion.identity);
            tree.Snapshot();
            session.Show(Manual ? WorkPrompt : Label + " accepted " + ProductName(tree.Record.product).ToLowerInvariant() + ".");
            session.Persist();
        }

        internal bool CanWork(Ray ray)
        {
            if (!Manual)
                return false;
            var delta = intake.position - ray.origin;
            return delta.sqrMagnitude <= 3.55f * 3.55f &&
                Vector3.Dot(delta.normalized, ray.direction) > 0.65f &&
                (Active || FindReplicatedLoad());
        }

        TimberTree FindReplicatedLoad()
        {
            if (!session.Coop.Guest)
                return null;
            foreach (var tree in session.trees)
                if (tree.Log && tree.Record.processRemaining > 0 && tree.Record.processService == (int)service &&
                    (tree.Record.logPosition - intake.position).sqrMagnitude < 0.06f)
                    return tree;
            return null;
        }

        internal void Work() => workUntil = Time.time + 0.23f;

        internal void CancelLocal()
        {
            if (Active)
                Active.ReleaseReservation(this);
            Active = null;
        }

        void Update()
        {
            if (!Active || session.Coop.Guest || Manual && Time.time >= workUntil)
                return;
            Active.Record.processRemaining = Mathf.Max(0, Active.Record.processRemaining - Time.deltaTime);
            if (Active.Record.processRemaining > 0)
                return;
            var finished = Active;
            Active = null;

            if (service is YardService.RawBuyer or YardService.LumberBuyer)
            {
                session.CompleteSale(finished, Quote(finished.saleValue, finished.Record.product), Label, transform.position);
                return;
            }

            var next = service switch
            {
                YardService.Sawmill => TimberProduct.Boards,
                YardService.DryingRack => TimberProduct.DriedBoards,
                _ => TimberProduct.Crate
            };
            finished.SetProduct(next);
            finished.Log.position = drop.position;
            finished.Log.rotation = drop.rotation;
            finished.ReleaseReservation(this);
            finished.Snapshot();
            session.Show(ProductName(next) + " ready · hold E to haul.", 4.5f);
            session.Persist();
        }
    }
}
