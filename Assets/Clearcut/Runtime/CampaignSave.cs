using System;
using System.Collections.Generic;
using UnityEngine;

namespace Clearcut
{
    [Serializable]
    public sealed class CampaignSave
    {
        public const int SchemaVersion = 1;
        const string Main = "clearcut.opening.v1";
        const string Backup = Main + ".backup";

        public int version = SchemaVersion;
        public int cash;
        public List<string> upgrades = new();
        public List<TreeRecord> trees = new();
        public List<Receipt> receipts = new();
        public bool hasPosition;
        public Vector3 position;
        public Vector2 look;

        public TreeRecord ForTree(int id)
        {
            var record = trees.Find(tree => tree.id == id);
            if (record != null)
                return record;

            record = new TreeRecord { id = id };
            trees.Add(record);
            return record;
        }

        public bool Owns(string id) => upgrades.Contains(id);

        public static CampaignSave Load(string slot, out bool recovered)
        {
            recovered = false;
            if (TryRead(PlayerPrefs.GetString(Main + slot), out var save))
                return save;

            recovered = TryRead(PlayerPrefs.GetString(Backup + slot), out save);
            return save ?? new CampaignSave();
        }

        public static bool TryRead(string json, out CampaignSave save)
        {
            save = null;
            if (string.IsNullOrEmpty(json))
                return false;
            try
            {
                var value = JsonUtility.FromJson<CampaignSave>(json);
                if (value == null || value.version != SchemaVersion || value.cash < 0 ||
                    value.trees == null || value.upgrades == null || value.receipts == null)
                    return false;

                var treeIds = new HashSet<int>();
                foreach (var tree in value.trees)
                    if (tree == null || tree.id <= 0 || !treeIds.Add(tree.id) || tree.damage < 0 ||
                        !float.IsFinite(tree.damage) || !Finite(tree.logPosition) ||
                        !float.IsFinite(tree.logRotation.x) || !float.IsFinite(tree.logRotation.y) ||
                        !float.IsFinite(tree.logRotation.z) || !float.IsFinite(tree.logRotation.w) ||
                        (tree.felled && Quaternion.Dot(tree.logRotation, tree.logRotation) < 0.01f) ||
                        (tree.sold && !tree.felled) || (int)tree.product < 0 || tree.product > TimberProduct.Crate ||
                        !float.IsFinite(tree.processRemaining) || tree.processRemaining < 0 || tree.processRemaining > 30)
                        return false;

                var owned = new HashSet<string>();
                foreach (string upgrade in value.upgrades)
                    if (string.IsNullOrEmpty(upgrade) || !owned.Add(upgrade))
                        return false;

                var sold = new HashSet<int>();
                foreach (var receipt in value.receipts)
                    if (receipt == null || receipt.amount < 1 || !treeIds.Contains(receipt.treeId) ||
                        !sold.Add(receipt.treeId))
                        return false;

                foreach (var tree in value.trees)
                    if (tree.sold != sold.Contains(tree.id))
                        return false;

                if (!Finite(value.position) || !float.IsFinite(value.look.x) || !float.IsFinite(value.look.y))
                    return false;

                save = value;
                return true;
            }
            catch (ArgumentException)
            {
                return false;
            }
        }

        static bool Finite(Vector3 v) => float.IsFinite(v.x) && float.IsFinite(v.y) && float.IsFinite(v.z);

        public string Write(string slot)
        {
            string encoded = JsonUtility.ToJson(this);
            string main = Main + slot;
            string backup = Backup + slot;
            string previous = PlayerPrefs.GetString(main);
            if (TryRead(previous, out _) && !string.Equals(previous, encoded, StringComparison.Ordinal))
                PlayerPrefs.SetString(backup, previous);
            PlayerPrefs.SetString(main, encoded);
            PlayerPrefs.Save();
            return encoded;
        }

        public static void Clear(string slot)
        {
            PlayerPrefs.DeleteKey(Main + slot);
            PlayerPrefs.DeleteKey(Backup + slot);
            PlayerPrefs.Save();
        }
    }

    [Serializable]
    public sealed class TreeRecord
    {
        public int id;
        public float damage;
        public bool felled;
        public bool sold;
        public TimberProduct product;
        public int processService;
        public float processRemaining;
        public Vector3 logPosition;
        public Quaternion logRotation = Quaternion.identity;
    }

    [Serializable]
    public sealed class Receipt
    {
        public int treeId;
        public string species;
        public string buyer;
        public TimberProduct product;
        public int amount;
    }
}
