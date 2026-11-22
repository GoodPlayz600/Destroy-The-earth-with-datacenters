using System;
using System.Collections.Generic;
using UnityEngine;

namespace Clearcut
{
    internal static class UpgradeCatalog
    {
        static Dictionary<string, Definition> catalog;

        internal static IReadOnlyDictionary<string, Definition> Entries => catalog ??= Read();

        internal static CampaignSession.Upgrade Playable(string id, string behavior)
        {
            var definition = Entries[id];
            return new CampaignSession.Upgrade(id, definition.name, behavior, checked((int)definition.price),
                string.IsNullOrEmpty(definition.previousInBranch) ? null : definition.previousInBranch);
        }

        static Dictionary<string, Definition> Read()
        {
            var resource = Resources.Load<TextAsset>("UpgradeCatalog");
            if (!resource)
                throw new InvalidOperationException("The upgrade catalog is missing.");
            var data = JsonUtility.FromJson<CatalogData>(resource.text);
            var entries = new Dictionary<string, Definition>(data.entries.Length, StringComparer.Ordinal);
            foreach (var entry in data.entries)
                entries.Add(entry.id, entry);
            return entries;
        }

        [Serializable]
        sealed class CatalogData
        {
            public Definition[] entries;
        }

        [Serializable]
        internal sealed class Definition
        {
            public string id, name, effect, previousInBranch;
            public long price;
        }
    }
}
