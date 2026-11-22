using UnityEngine;

namespace Clearcut
{
    [RequireComponent(typeof(CampaignSession))]
    public sealed class OpeningHud : MonoBehaviour
    {
        static readonly Color Panel = new(0.035f, 0.088f, 0.076f, 0.96f);
        static readonly Color Raised = new(0.083f, 0.144f, 0.112f, 0.97f);
        static readonly Color Accent = new(0.99f, 0.74f, 0.32f);
        static readonly Color Paper = new(0.97f, 0.94f, 0.79f);
        static readonly Color Muted = new(0.72f, 0.77f, 0.63f);
        static readonly Color Line = new(0.69f, 0.79f, 0.63f, 0.26f);

        CampaignSession game;
        GUIStyle title, subtitle, body, small, bold, center, button, input;
        int screen;
        Vector2 scroll;
        float width, height;
        string saveText = "";
        bool showSave;
        internal bool EditingText { get; private set; }
        string photonId = "", photonRegion = "us", photonRoom = "";

        void Awake() => game = GetComponent<CampaignSession>();

        void OnGUI()
        {
            if (title == null)
                CreateStyles();
            float scale = Mathf.Clamp(Mathf.Min(Screen.width / 1180f, Screen.height / 690f), 0.6f, 1.48f);
            width = Screen.width / scale;
            height = Screen.height / scale;
            Matrix4x4 previous = GUI.matrix;
            GUI.matrix = Matrix4x4.Scale(new Vector3(scale, scale, 1));
            if (!game.HasStarted)
                DrawEntry();
            else if (game.MenuOpen)
                DrawMenu();
            else
                DrawHud();
            EditingText = game.MenuOpen && GUI.GetNameOfFocusedControl().StartsWith("Field desk ");
            GUI.matrix = previous;
        }

        void CreateStyles()
        {
            title = Label(47, FontStyle.Bold, Paper);
            subtitle = Label(17, FontStyle.Bold, Accent);
            body = Label(17, FontStyle.Normal, Paper);
            small = Label(13, FontStyle.Normal, Muted);
            bold = Label(23, FontStyle.Bold, Paper);
            center = Label(15, FontStyle.Bold, Paper);
            center.alignment = TextAnchor.MiddleCenter;
            button = Label(15, FontStyle.Bold, Paper);
            button.alignment = TextAnchor.MiddleCenter;
            input = new GUIStyle(GUI.skin.textArea) { fontSize = 14, wordWrap = true };
        }

        static GUIStyle Label(int size, FontStyle weight, Color color)
        {
            return new GUIStyle(GUI.skin.label)
            {
                fontSize = size,
                fontStyle = weight,
                normal = { textColor = color },
                alignment = TextAnchor.MiddleLeft,
                padding = new RectOffset(0, 0, 0, 0)
            };
        }

        static void Ink(Rect rect, Color color)
        {
            Color saved = GUI.color;
            GUI.color = color;
            GUI.DrawTexture(rect, Texture2D.whiteTexture);
            GUI.color = saved;
        }

        static bool Action(Rect rect, string label, GUIStyle style, bool primary = false, bool active = true)
        {
            bool hover = active && rect.Contains(Event.current.mousePosition);
            if (hover || primary)
                Ink(rect, hover ? new Color(1, 0.84f, 0.51f) : Accent);
            else
                Ink(rect, active ? Raised : Panel);
            Color original = style.normal.textColor;
            style.normal.textColor = hover || primary ? Panel : active ? Paper : Muted;
            var outer = GUI.enabled;
            GUI.enabled = active && outer;
            bool pressed = GUI.Button(rect, label, style);
            GUI.enabled = outer;
            style.normal.textColor = original;
            return pressed;
        }

        void DrawEntry()
        {
            Ink(new Rect(0, 0, width, height), new Color(0.012f, 0.042f, 0.033f, 0.28f));
            float x = Mathf.Max(24, width * 0.075f);
            float y = height * 0.5f - 168;
            float card = Mathf.Min(500, width - x - 24);
            Ink(new Rect(x, y, card, 344), Panel);
            Ink(new Rect(x, y, card, 4), Accent);
            GUI.Label(new Rect(x + 29, y + 27, card - 54, 26), "ASH EXCHANGE  /  FIELD OPERATIONS", subtitle);
            GUI.Label(new Rect(x + 28, y + 63, card - 52, 59), "Project Clearcut", title);
            GUI.Label(new Rect(x + 30, y + 121, card - 54, 34), "The Last Jungle", bold);
            GUI.Label(new Rect(x + 30, y + 169, card - 52, 28), "$0 and a plastic butter knife.", body);
            GUI.Label(new Rect(x + 30, y + 197, card - 52, 28), "Start with the sapling by the clearing.", body);
            if (Action(new Rect(x + 30, y + 245, card - 60, 48),
                game.Save.receipts.Count > 0 || game.Save.hasPosition ? "Continue campaign" : "Enter the clearing", button, true))
                game.StartPlaying();
            GUI.Label(new Rect(x + 30, y + 302, card - 50, 22),
                "WASD  Move      LMB  Swing      Hold E  Drag      Tab  Field desk", small);
        }

        void DrawHud()
        {
            float y = 22;
            Ink(new Rect(22, y, 345, 98), Panel);
            Ink(new Rect(22, y, 3, 98), Accent);
            GUI.Label(new Rect(39, y + 10, 310, 21), "ASH EXCHANGE  /  FORESTRY", subtitle);
            string objective = game.Save.receipts.Count == 0
                ? game.trees[0].Record.felled ? "Drag the timber into the stone fire ring" : "Cut the young tree beside the clearing"
                : game.Save.upgrades.Count == 0 ? "Buy a starter upgrade or try the sawmill" : "Bring timber to the mill or buyers";
            GUI.Label(new Rect(39, y + 36, 318, 31), objective, body);
            GUI.Label(new Rect(39, y + 67, 310, 20), game.UsingSaw ? "Pocket saw   ·   1 Knife" : "Plastic butter knife   ·   2 Saw", small);

            float cashX = width - 206;
            Ink(new Rect(cashX, y, 184, 86), Panel);
            GUI.Label(new Rect(cashX + 16, y + 8, 144, 23), "WALLET", subtitle);
            GUI.Label(new Rect(cashX + 16, y + 33, 147, 37), "$" + game.Save.cash, bold);
            if (game.Save.receipts.Count > 0)
                GUI.Label(new Rect(cashX + 68, y + 39, 112, 28), game.Save.receipts.Count + " sold", small);

            Vector2 mid = new(width / 2, height / 2);
            Ink(new Rect(mid.x - 6, mid.y, 13, 1), Paper);
            Ink(new Rect(mid.x, mid.y - 6, 1, 13), Paper);
            string target = null;
            float progress = 0;
            if (game.Tethered || game.Coop.GuestTethered)
                target = "Twine attached  ·  G or T releases cargo";
            else if (game.Held)
                target = "Release E at intake  ·  " + game.Held.Log.mass.ToString("0") + " kg";
            else if (game.Coop.GuestHauling)
                target = "Release E at intake";
            else if (game.WorkTarget)
            {
                target = game.WorkTarget.WorkPrompt;
                progress = game.WorkTarget.Completion;
            }
            else if (game.TargetTree)
            {
                target = game.TargetTree.species + "  ·  Hold LMB to cut";
                progress = game.TargetTree.Progress;
            }
            else if (game.TargetLog)
                target = TimberYard.ProductName(game.TargetLog.Record.product) +
                    (game.CanTether(game.TargetLog) ? "  ·  E drag  /  T tether" : "  ·  Hold E to drag");
            else if (game.exchange.Burning)
            {
                target = "Wood burning";
                progress = game.exchange.Progress;
            }
            if (target != null)
            {
                var hint = new Rect(mid.x - 164, mid.y + 21, 328, 34);
                Ink(hint, Panel);
                GUI.Label(hint, target, center);
                if (progress > 0)
                    Ink(new Rect(hint.x, hint.yMax - 3, hint.width * progress, 3), Accent);
            }
            if (!game.DragLook && !game.PointerLocked)
            {
                Ink(new Rect(mid.x - 177, mid.y - 68, 354, 40), Panel);
                GUI.Label(new Rect(mid.x - 177, mid.y - 68, 354, 40),
                    "Click to lock the mouse  ·  Hold right mouse to look", center);
            }
            if (Time.unscaledTime < game.NoticeUntil)
            {
                var notice = new Rect(mid.x - 232, height * 0.76f, 464, 41);
                Ink(notice, Panel);
                GUI.Label(notice, game.Notice, center);
            }

            if (Time.unscaledTime < game.CashPopupUntil)
            {
                Vector3 world = game.CashPopupPosition + Vector3.up * (game.CashPopupUntil - Time.unscaledTime) * -0.15f;
                Vector3 pixel = game.view.WorldToViewportPoint(world);
                if (pixel.z > 0)
                {
                    var popup = new Rect(pixel.x * width - 52, (1 - pixel.y) * height - 18, 104, 36);
                    Ink(popup, Accent);
                    var color = center.normal.textColor;
                    center.normal.textColor = Panel;
                    GUI.Label(popup, "+$" + game.CashPopupAmount, center);
                    center.normal.textColor = color;
                }
            }

            float bottom = height - 67;
            Ink(new Rect(22, bottom, 325, 45), Panel);
            GUI.Label(new Rect(38, bottom + 5, 75, 22), "STAMINA", small);
            Ink(new Rect(115, bottom + 13, 215, 8), Raised);
            Ink(new Rect(115, bottom + 13, 215 * game.Stamina, 8), Accent);
            GUI.Label(new Rect(38, bottom + 24, 296, 19), "WASD  Move     Shift  Run     Space  Jump", small);

            Ink(new Rect(width - 209, bottom, 187, 45), Panel);
            GUI.Label(new Rect(width - 194, bottom + 2, 168, 22), "TAB  Field desk", body);
            GUI.Label(new Rect(width - 194, bottom + 22, 168, 21), game.SaveStatus, small);
        }

        void DrawMenu()
        {
            Ink(new Rect(0, 0, width, height), new Color(0.012f, 0.033f, 0.025f, 0.76f));
            Rect card = new(Mathf.Max(18, width / 2 - 385), 34, Mathf.Min(width - 36, 770), height - 68);
            Ink(card, Panel);
            Ink(new Rect(card.x, card.y, card.width, 4), Accent);
            GUI.Label(new Rect(card.x + 24, card.y + 12, card.width - 150, 50), "Field desk", bold);
            if (Action(new Rect(card.xMax - 139, card.y + 17, 115, 37), "Resume", button, true))
                game.SetMenu(false);

            string[] tabs = { "Upgrades", "Receipts", "Settings", "Multiplayer", "Market" };
            float tabStep = Mathf.Min(114, (card.width - 140) / tabs.Length);
            for (int i = 0; i < tabs.Length; i++)
                if (Action(new Rect(card.x + 24 + i * tabStep, card.y + 65, tabStep - 8, 36), tabs[i], button, screen == i))
                {
                    screen = i;
                    scroll = Vector2.zero;
                }

            GUI.Label(new Rect(card.xMax - 119, card.y + 70, 95, 26), "$" + game.Save.cash, subtitle);
            Ink(new Rect(card.x + 24, card.y + 113, card.width - 48, 1), Line);
            Rect content = new(card.x + 24, card.y + 126, card.width - 48, card.height - 149);
            if (screen == 0)
                DrawUpgrades(content);
            else if (screen == 1)
                DrawReceipts(content);
            else if (screen == 2)
                DrawSettings(content);
            else if (screen == 3)
                DrawCoop(content);
            else
                DrawMarket(content);
        }

        void DrawUpgrades(Rect content)
        {
            float rowWidth = content.width - 22;
            scroll = GUI.BeginScrollView(content, scroll, new Rect(0, 0, rowWidth, CampaignSession.Upgrades.Length * 67), false, false);
            for (int i = 0; i < CampaignSession.Upgrades.Length; i++)
            {
                var upgrade = CampaignSession.Upgrades[i];
                float top = i * 67;
                bool owned = game.Save.Owns(upgrade.Id);
                bool prerequisite = upgrade.Requires == null || game.Save.Owns(upgrade.Requires);
                bool available = !owned && prerequisite && game.Save.cash >= upgrade.Price;
                Ink(new Rect(0, top, rowWidth, 59), Raised);
                GUI.Label(new Rect(15, top + 5, rowWidth - 152, 25), upgrade.Name, body);
                GUI.Label(new Rect(15, top + 30, rowWidth - 152, 20), upgrade.Effect, small);
                string action = owned ? "Installed" : prerequisite ? "$" + upgrade.Price : "Locked";
                if (Action(new Rect(rowWidth - 116, top + 11, 103, 37), action, button, available, available))
                    game.Buy(upgrade);
            }
            GUI.EndScrollView();
        }

        void DrawReceipts(Rect content)
        {
            int count = game.Save.receipts.Count;
            if (count == 0)
            {
                GUI.Label(new Rect(content.x, content.y, content.width, 32), "No sales yet. Deliver timber to the exchange or a buyer.", body);
                return;
            }
            float rowWidth = content.width - 22;
            scroll = GUI.BeginScrollView(content, scroll, new Rect(0, 0, rowWidth, count * 41), false, false);
            for (int i = 0; i < count; i++)
            {
                var receipt = game.Save.receipts[count - i - 1];
                GUI.Label(new Rect(6, i * 41, rowWidth - 85, 36), TimberYard.ProductName(receipt.product) + "  ·  " + (receipt.buyer ?? "Ash Exchange"), body);
                GUI.Label(new Rect(rowWidth - 70, i * 41, 70, 36), "+$" + receipt.amount, subtitle);
                Ink(new Rect(0, i * 41 + 39, rowWidth, 1), Line);
            }
            GUI.EndScrollView();
        }

        void DrawMarket(Rect area)
        {
            GUI.Label(new Rect(area.x, area.y, area.width, 31), "Payout from one golden sapling", bold);
            string[] routes = { "Burn at Ash Exchange", "Sell raw log", "Saw into rough boards",
                "Saw and dry the boards", "Saw, dry, and assemble a crate" };
            for (int i = 0; i < routes.Length; i++)
            {
                float y = area.y + 40 + i * 39;
                int value = i == 0 ? 18 : TimberYard.Quote(18, (TimberProduct)(i - 1));
                GUI.Label(new Rect(area.x, y, area.width - 65, 33), routes[i], body);
                GUI.Label(new Rect(area.xMax - 59, y, 59, 33), "$" + value, subtitle);
                Ink(new Rect(area.x, y + 34, area.width, 1), Line);
            }
        }

        void DrawCoop(Rect area)
        {
            var coop = game.Coop;
            float x = area.x, y = area.y;
            GUI.Label(new Rect(x, y, area.width, 29), coop.Status, body);
            if (coop.InRoom)
            {
                GUI.Label(new Rect(x, y + 43, area.width, 34), "Room " + coop.RoomCode + "   ·   " + coop.PlayerCount + "/4", bold);
                GUI.Label(new Rect(x, y + 88, area.width, 30), "Share the room code and region. Wallet and upgrades are shared.", small);
                if (Action(new Rect(x, y + 134, 135, 37), "Leave room", button))
                    coop.Leave();
                return;
            }
            if (coop.Connecting)
            {
                if (Action(new Rect(x, y + 64, 135, 37), "Cancel", button))
                    coop.Leave();
                return;
            }

            y += 44;
            if (!coop.HasConfiguredAppId)
            {
                GUI.Label(new Rect(x, y, 135, 30), "Realtime App ID", body);
                GUI.SetNextControlName("Field desk App ID");
                photonId = GUI.TextField(new Rect(x + 145, y, area.width - 157, 30), photonId, 40);
                y += 41;
            }
            GUI.Label(new Rect(x, y, 135, 30), "Region", body);
            GUI.SetNextControlName("Field desk region");
            photonRegion = GUI.TextField(new Rect(x + 145, y, 105, 30), photonRegion, 12);
            GUI.Label(new Rect(x, y + 41, 135, 30), "Room code", body);
            GUI.SetNextControlName("Field desk room");
            photonRoom = GUI.TextField(new Rect(x + 145, y + 41, 160, 30), photonRoom, 10);
            if (Action(new Rect(x, y + 92, 194, 40), "Host a copy of solo", button, true))
                coop.Open(photonId, photonRegion, photonRoom, true);
            if (Action(new Rect(x + 207, y + 92, 134, 40), "Join room", button))
                coop.Open(photonId, photonRegion, photonRoom, false);
        }

        void DrawSettings(Rect content)
        {
            float x = content.x, y = content.y, w = content.width;
            GUI.Label(new Rect(x, y, 180, 33), "Mouse look", body);
            if (Action(new Rect(x + 185, y, 130, 32), "Pointer lock", button, !game.DragLook))
                game.SetLookMode(false);
            if (Action(new Rect(x + 323, y, 143, 32), "Hold right mouse", button, game.DragLook))
                game.SetLookMode(true);
            GUI.Label(new Rect(x, y + 49, 180, 30), "Look sensitivity", body);
            float sensitivity = GUI.HorizontalSlider(new Rect(x + 185, y + 59, 190, 20), game.Sensitivity, 0.035f, 0.28f);
            if (!Mathf.Approximately(sensitivity, game.Sensitivity))
                game.SetSensitivity(sensitivity);
            GUI.Label(new Rect(x, y + 91, 180, 30), "Volume", body);
            float volume = GUI.HorizontalSlider(new Rect(x + 185, y + 101, 190, 20), game.Volume, 0, 1);
            if (!Mathf.Approximately(volume, game.Volume))
                game.SetVolume(volume);
            GUI.Label(new Rect(x, y + 133, 180, 32), "Graphics", body);
            if (Action(new Rect(x + 185, y + 133, 130, 32), "High", button, game.HighQuality))
                game.SetQuality(true);
            if (Action(new Rect(x + 323, y + 133, 143, 32), "Low", button, !game.HighQuality))
                game.SetQuality(false);

            if (Action(new Rect(x, y + 186, 172, 35), "Save / backup text", button))
            {
                if (!showSave)
                    saveText = game.Export();
                showSave = !showSave;
            }
            GUI.Label(new Rect(x + 184, y + 186, w - 184, 35),
                Time.unscaledTime < game.NoticeUntil ? game.Notice : game.SaveStatus, small);
            if (!showSave)
                return;
            float fieldHeight = Mathf.Max(38, content.height - 292);
            GUI.SetNextControlName("Field desk save");
            saveText = GUI.TextArea(new Rect(x, y + 231, w, fieldHeight), saveText, 2_000_000, input);
            if (Action(new Rect(x, y + 241 + fieldHeight, 189, 35), "Restore pasted backup", button)
                && !game.Import(saveText))
                game.Show("Invalid or unsupported backup");
        }
    }
}
