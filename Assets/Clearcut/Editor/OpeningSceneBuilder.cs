using System;
using System.Collections.Generic;
using System.Linq;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.SceneManagement;
using Object = UnityEngine.Object;
using Random = System.Random;

namespace Clearcut.Editor
{
    public static class OpeningSceneBuilder
    {
        public const string ScenePath = "Assets/Scenes/TheLastJungle.unity";
        const string Art = "Assets/Clearcut/Art";
        const string Imports = "Assets/Models/Clearcut";
        static readonly Dictionary<string, string> Palette = new()
        {
            ["Bark"] = "#775136", ["BarkDark"] = "#51352C", ["BarkLight"] = "#98724B",
            ["Heartwood"] = "#DAA962", ["WoodRing"] = "#9D653D", ["LeafDeep"] = "#245747",
            ["LeafMid"] = "#438447", ["LeafGold"] = "#8DAD4F", ["LeafTeal"] = "#3A7D62",
            ["Fern"] = "#38894E", ["FernTip"] = "#75A94A", ["Stone"] = "#626B54",
            ["StoneLight"] = "#8C8B6B", ["Iron"] = "#353B36", ["Coal"] = "#30291F",
            ["Ember"] = "#E8551D", ["Plastic"] = "#F1F0C4", ["Grip"] = "#E9AC42",
            ["GripDark"] = "#A56E35", ["SignBoard"] = "#885534",
            ["Dirt"] = "#8E7245", ["DryDirt"] = "#A18452", ["Moss"] = "#5F7347",
            ["Grass"] = "#49673F", ["DampGrass"] = "#3B5D3D", ["Flame"] = "#F8460D",
            ["FlameCore"] = "#FFAE27", ["LeafVein"] = "#83AD55",
            ["LeafLime"] = "#A4BF50", ["CoralFlower"] = "#E1784C", ["Pollen"] = "#FFC355",
            ["Tarnish"] = "#67483A", ["Paint"] = "#D89E4B", ["MossRock"] = "#667D49"
        };
        static readonly Dictionary<string, Material> Materials = new();
        static Texture2D barkPattern;

        [MenuItem("Clearcut/Build Opening Scene")]
        public static void Create()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
                throw new InvalidOperationException("Stop Play Mode before rebuilding the scene.");
            if (!AssetDatabase.IsValidFolder(Art))
                AssetDatabase.CreateFolder("Assets/Clearcut", "Art");
            Materials.Clear();
            barkPattern = null;

            var trees = new[] { Bake("Sapling"), Bake("Ribbonwood"), Bake("Ironwood") };
            var stump = Bake("Stump");
            var log = Bake("FallenLog");
            var knife = Bake("ButterKnife");
            var pit = Bake("AshPit");
            var sign = Bake("ExchangeSign");
            var fern = Bake("Understory");
            var broadleaf = Bake("Broadleaf");
            var crate = Bake("ServiceCrate");
            var boulder = Bake("MossBoulder");
            var flame = Bake("FlameTongue");

            Scene scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            Environment();
            Ground();
            var random = new Random(262);
            var grove = new GameObject("Jungle species").transform;
            var records = new List<TimberTree>();
            void Plant(float x, float z, int kind, float yaw)
            {
                Vector3 position = new(x, Elevation(x, z), z);
                var settings = kind switch
                {
                    0 => new Species("Golden sapling", 2.75f, 0.16f, 15, 19, 18),
                    1 => new Species("Ribbonwood", 4.9f, 0.29f, 33, 49, 42),
                    _ => new Species("Old-growth ironwood", 6.6f, 0.43f, 126, 123, 95)
                };
                var obj = new GameObject(settings.Name + " " + (records.Count + 1));
                obj.transform.SetParent(grove);
                obj.transform.SetPositionAndRotation(position, Quaternion.Euler(0, yaw, 0));
                var data = obj.AddComponent<TimberTree>();
                data.id = records.Count + 1;
                data.species = settings.Name;
                data.height = settings.Height;
                data.radius = settings.Radius;
                data.mass = settings.Mass;
                data.toughness = settings.Toughness;
                data.saleValue = settings.Price;
                data.logPrefab = log;
                data.stumpPrefab = stump;
                data.freshWood = Mat("Heartwood");
                data.standingPrefab = trees[kind];
                data.standing = Drop(settings.Name + " mesh", trees[kind], obj.transform, position, yaw).transform;
                var collider = obj.AddComponent<CapsuleCollider>();
                collider.radius = settings.Radius * 1.05f;
                collider.height = settings.Height * 0.93f;
                collider.center = new Vector3(0, collider.height * 0.5f, 0);
                data.trunk = collider;
                records.Add(data);
            }

            Plant(0, 4.3f, 0, 19);
            Plant(-3.1f, 4.9f, 0, 40);
            Plant(-5.65f, 6.9f, 0, 160);
            Plant(1.48f, 11.9f, 0, 18);
            Plant(6.4f, 8.1f, 1, 120);
            Plant(3.7f, 11.7f, 0, 75);
            Plant(-1.0f, 9.8f, 0, 76);
            Plant(-5.2f, 1.3f, 1, 16);
            Plant(7.1f, 0.7f, 2, 155);
            Plant(-6.4f, 3.1f, 2, 43);
            Plant(6.8f, 10.6f, 2, 315);
            Plant(-2.2f, 14.2f, 2, 23);
            Plant(0.8f, 17.7f, 1, 116);
            Plant(-6.1f, -4.3f, 1, 155);
            for (int x = -57; x <= 57; x += 4)
                for (int z = -53; z <= 59; z += 4)
                {
                    float px = x + Range(random, -1.38f, 1.38f);
                    float pz = z + Range(random, -1.38f, 1.38f);
                    float distance = new Vector2(px, pz - 3).magnitude;
                    if (distance < 9.6f || random.NextDouble() > (distance < 24 ? 0.77 : 0.34))
                        continue;
                    float choice = (float)random.NextDouble();
                    Plant(px, pz, choice < 0.22f ? 0 : choice < 0.69f ? 1 : 2, Range(random, 0, 360));
                }

            var decorations = new GameObject("Jungle understory").transform;
            for (int i = 0; i < 175; i++)
            {
                float x = Range(random, -35, 35);
                float z = Range(random, -22, 39);
                if (new Vector2(x * 1.1f, z - 3).sqrMagnitude < 46)
                    continue;
                var plant = Drop("Ground foliage", i % 6 == 0 ? broadleaf : fern, decorations,
                    new Vector3(x, Elevation(x, z), z), Range(random, 0, 360));
                plant.transform.localScale = Vector3.one * Range(random, 0.61f, 1.48f);
            }
            foreach (var position in new[] { new Vector2(-2.7f, 2.1f), new Vector2(-4.4f, 4.1f),
                new Vector2(5.8f, 2.2f), new Vector2(-1.9f, 6.1f), new Vector2(2.3f, 7.8f),
                new Vector2(4.9f, 8.1f), new Vector2(-4.3f, -0.9f), new Vector2(-4.8f, 6.2f) })
            {
                var plant = Drop("Clearing foliage", position.x < -3 || position.y > 7.5f ? broadleaf : fern, decorations,
                    new Vector3(position.x, Elevation(position.x, position.y), position.y), Range(random, 0, 360));
                plant.transform.localScale = Vector3.one * Range(random, 0.74f, 1.06f);
            }
            foreach (var place in new[] { new Vector2(-6.7f, 5.9f), new Vector2(6.8f, 6.4f),
                new Vector2(-6.2f, -1f), new Vector2(8.5f, 12.2f), new Vector2(-3.1f, 12.9f),
                new Vector2(4.3f, -2.0f), new Vector2(-10.2f, 8.5f) })
            {
                var stone = Drop("Moss-covered boulders", boulder, decorations,
                    new Vector3(place.x, Elevation(place.x, place.y), place.y), Range(random, 0, 360));
                stone.transform.localScale = Vector3.one * Range(random, 0.78f, 1.27f);
                var blocking = stone.AddComponent<BoxCollider>();
                blocking.center = new Vector3(0, 0.28f, 0);
                blocking.size = new Vector3(1.36f, 0.56f, 0.68f);
                MarkStatic(stone);
            }

            var exchange = MakeExchange(pit, sign, crate, flame);
            var player = new GameObject("Field operator");
            player.transform.position = new Vector3(0, 0.04f, -0.15f);
            var controller = player.AddComponent<CharacterController>();
            controller.radius = 0.31f;
            controller.center = Vector3.up * 0.91f;
            controller.height = 1.82f;
            controller.stepOffset = 0.31f;
            var camera = new GameObject("Jungle camera").AddComponent<Camera>();
            camera.tag = "MainCamera";
            camera.transform.SetParent(player.transform, false);
            camera.transform.localPosition = new Vector3(0, 1.62f, 0);
            camera.nearClipPlane = 0.025f;
            camera.fieldOfView = 67;
            camera.gameObject.AddComponent<AudioListener>();
            var tool = Drop("Plastic butter knife", knife, camera.transform, Vector3.zero, 0);
            tool.transform.localPosition = new Vector3(0.38f, -0.31f, 0.48f);
            tool.transform.localRotation = Quaternion.Euler(19, -12, -33);
            tool.transform.localScale = Vector3.one * 1.48f;
            var game = player.AddComponent<CampaignSession>();
            player.AddComponent<OpeningHud>();
            game.view = camera;
            game.knife = tool.transform;
            game.exchange = exchange;
            game.trees = records.ToArray();
            game.chipMaterial = Mat("Heartwood");
            exchange.session = game;

            if (!EditorSceneManager.SaveScene(scene, ScenePath))
                throw new InvalidOperationException("Could not save opening scene.");
            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
            PlayerSettings.productName = "Project Clearcut - The Last Jungle";
            PlayerSettings.defaultScreenWidth = 1280;
            PlayerSettings.defaultScreenHeight = 720;
            PlayerSettings.fullScreenMode = FullScreenMode.Windowed;
            PlayerSettings.WebGL.template = "PROJECT:Clearcut";
            PlayerSettings.SetUseDefaultGraphicsAPIs(BuildTarget.WebGL, false);
            PlayerSettings.SetGraphicsAPIs(BuildTarget.WebGL, new[] { GraphicsDeviceType.OpenGLES3 });
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
            PlayerSettings.WebGL.memorySize = 96;
            AssetDatabase.SaveAssets();
            Debug.Log("Clearcut opening saved with " + records.Count + " living 3D trees and " + trees.Length + " species.");
        }

        static AshExchange MakeExchange(GameObject pit, GameObject sign, GameObject crate, GameObject flame)
        {
            var site = new GameObject("Ash Exchange");
            Vector3 center = new(3.9f, Elevation(3.9f, 4.6f), 4.6f);
            site.transform.position = center;
            Drop("Stone pit and iron intake", pit, site.transform, center, 0);
            var volume = site.AddComponent<CapsuleCollider>();
            volume.isTrigger = true;
            volume.radius = 1.28f;
            volume.height = 2.2f;
            volume.center = Vector3.up * 0.63f;
            var exchange = site.AddComponent<AshExchange>();

            var signObj = Drop("Ash Exchange sign", sign, site.transform, new Vector3(5.25f, Elevation(5.25f, 5.9f), 5.9f), 21);
            Letter(signObj.transform, "ASH EXCHANGE", 1.63f, 0.041f, new Color(1, 0.84f, 0.47f));
            Letter(signObj.transform, "LOGS IN   •   CASH OUT", 1.37f, 0.024f, new Color(0.91f, 0.78f, 0.54f));
            Vector3 storage = new(5.85f, Elevation(5.85f, 6.72f), 6.72f);
            var container = Drop("Cordwood crate", crate, site.transform, storage, -17);
            var crateCollider = container.AddComponent<BoxCollider>();
            crateCollider.center = Vector3.up * 0.38f;
            crateCollider.size = new Vector3(1.23f, 0.76f, 0.9f);
            MarkStatic(container);
            var fire = new List<Transform>();
            for (int i = 0; i < 8; i++)
            {
                float angle = i * Mathf.PI * 2 / 8;
                GameObject tongue = Drop("Flame", flame, site.transform, site.transform.position, i * 31);
                tongue.transform.localPosition = new Vector3(Mathf.Cos(angle) * 0.31f, 0.29f, Mathf.Sin(angle) * 0.31f);
                tongue.transform.localScale = new Vector3(0.23f, 0.45f, 0.23f);
                var renderer = tongue.GetComponent<MeshRenderer>();
                renderer.sharedMaterial = Mat(i % 2 == 0 ? "FlameCore" : "Flame");
                renderer.shadowCastingMode = ShadowCastingMode.Off;
                fire.Add(tongue.transform);
            }
            exchange.flames = fire.ToArray();
            var fireLight = new GameObject("Warm firelight").AddComponent<Light>();
            fireLight.transform.SetParent(site.transform, false);
            fireLight.transform.localPosition = Vector3.up * 0.73f;
            fireLight.type = LightType.Point;
            fireLight.range = 6.9f;
            fireLight.color = new Color(1, 0.5f, 0.16f);
            fireLight.intensity = 2;
            exchange.fireLight = fireLight;
            return exchange;
        }

        static void Letter(Transform parent, string caption, float height, float size, Color color)
        {
            var label = new GameObject(caption).AddComponent<TextMesh>();
            label.transform.SetParent(parent, false);
            label.transform.localPosition = new Vector3(0, height, -0.072f);
            label.anchor = TextAnchor.MiddleCenter;
            label.alignment = TextAlignment.Center;
            label.fontSize = 58;
            label.fontStyle = FontStyle.Bold;
            label.characterSize = size;
            label.color = color;
            label.text = caption;
        }

        static void Environment()
        {
            var light = new GameObject("Late morning sun").AddComponent<Light>();
            light.type = LightType.Directional;
            light.transform.rotation = Quaternion.Euler(36f, -48f, 0);
            light.color = new Color(1, 0.91f, 0.65f);
            light.intensity = 1.76f;
            light.shadows = LightShadows.Soft;
            RenderSettings.sun = light;
            RenderSettings.ambientMode = AmbientMode.Trilight;
            RenderSettings.ambientSkyColor = new Color(0.57f, 0.65f, 0.61f);
            RenderSettings.ambientEquatorColor = new Color(0.50f, 0.52f, 0.45f);
            RenderSettings.ambientGroundColor = new Color(0.35f, 0.31f, 0.23f);
            RenderSettings.fog = true;
            RenderSettings.fogMode = FogMode.ExponentialSquared;
            RenderSettings.fogDensity = 0.020f;
            RenderSettings.fogColor = new Color(0.56f, 0.70f, 0.62f);
            var sky = new Material(Shader.Find("Skybox/Procedural"));
            sky.SetColor("_SkyTint", new Color(0.5f, 0.68f, 0.69f));
            sky.SetColor("_GroundColor", new Color(0.36f, 0.43f, 0.31f));
            sky.SetFloat("_AtmosphereThickness", 1.18f);
            sky.SetFloat("_SunSize", 0.042f);
            RenderSettings.skybox = Store(sky, Art + "/CanopySky.mat");
        }

        static float Elevation(float x, float z)
        {
            float distance = new Vector2(x, z - 3).magnitude;
            float variation = Mathf.PerlinNoise(37 + x * 0.064f, 12 + z * 0.064f) * 4 - 1.8f;
            variation += (Mathf.PerlinNoise(76 + x * 0.15f, 27 + z * 0.15f) - 0.5f) * 0.68f;
            return variation * Mathf.InverseLerp(7, 17, distance);
        }

        static void Ground()
        {
            const int dimension = 97;
            const float step = 1.38f;
            var ground = new GameObject("Dirt trail and forest floor");
            var vertices = new Vector3[dimension * dimension];
            var uvs = new Vector2[vertices.Length];
            var triangles = new List<int>((dimension - 1) * (dimension - 1) * 6);
            float extent = (dimension - 1) * step / 2;
            var material = new Material(Shader.Find("Universal Render Pipeline/Lit"));
            material.SetColor("_BaseColor", Color.white);
            material.SetFloat("_Smoothness", 0.045f);
            material.SetTexture("_BaseMap", PaintGround(extent));
            material = Store(material, Art + "/GroundSurface.mat");

            for (int z = 0; z < dimension; z++)
                for (int x = 0; x < dimension; x++)
                {
                    float wx = (x - dimension / 2) * step;
                    float wz = (z - dimension / 2) * step;
                    int id = z * dimension + x;
                    vertices[id] = new Vector3(wx, Elevation(wx, wz), wz);
                    uvs[id] = new Vector2(x / (float)(dimension - 1), z / (float)(dimension - 1));
                    if (x == dimension - 1 || z == dimension - 1)
                        continue;
                    int opposite = id + dimension + 1;
                    triangles.Add(id);
                    triangles.Add(id + dimension);
                    triangles.Add(opposite);
                    triangles.Add(id);
                    triangles.Add(opposite);
                    triangles.Add(id + 1);
                }

            var mesh = new Mesh { vertices = vertices, uv = uvs };
            mesh.SetTriangles(triangles, 0);
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            mesh = Store(mesh, Art + "/ClearingGround.asset");
            ground.AddComponent<MeshFilter>().sharedMesh = mesh;
            ground.AddComponent<MeshRenderer>().sharedMaterial = material;
            ground.AddComponent<MeshCollider>().sharedMesh = mesh;
            MarkStatic(ground);
        }

        static Texture2D PaintGround(float extent)
        {
            const int size = 768;
            var pixels = new Color32[size * size];
            Color dirt = new(0.57f, 0.40f, 0.23f);
            Color sunlitDirt = new(0.70f, 0.54f, 0.33f);
            Color moss = new(0.37f, 0.42f, 0.24f);
            Color grass = new(0.24f, 0.36f, 0.24f);
            Color damp = new(0.19f, 0.28f, 0.19f);
            for (int row = 0; row < size; row++)
                for (int col = 0; col < size; col++)
                {
                    float x = Mathf.Lerp(-extent, extent, col / (float)(size - 1));
                    float z = Mathf.Lerp(-extent, extent, row / (float)(size - 1));
                    float broad = Mathf.PerlinNoise(x * 0.14f + 80, z * 0.14f + 42);
                    float patch = Mathf.PerlinNoise(x * 0.51f + 37, z * 0.51f + 49);
                    float grit = Mathf.PerlinNoise(x * 2.7f + 111, z * 2.7f + 26);
                    float clearing = new Vector2(x * 0.87f, z * 0.71f - 2.25f).magnitude + (broad - 0.5f) * 3.2f;
                    Color compacted = Color.Lerp(dirt, sunlitDirt, Mathf.Clamp01(broad * 1.25f));
                    Color forest = Color.Lerp(damp, grass, Mathf.SmoothStep(0, 1, broad * 0.72f + patch * 0.42f));
                    Color edge = Color.Lerp(moss, forest, Mathf.SmoothStep(0, 1, Mathf.InverseLerp(4.5f, 8.8f, clearing)));
                    Color ground = Color.Lerp(compacted, edge, Mathf.SmoothStep(0, 1, Mathf.InverseLerp(2.9f, 5.1f, clearing)));
                    ground *= 0.87f + patch * 0.13f + grit * 0.16f;
                    ground.a = 1;
                    pixels[row * size + col] = ground;
                }
            return StoreTexture("ClearingFloor", size, pixels, TextureWrapMode.Clamp);
        }

        static Texture2D PaintBark()
        {
            const int size = 128;
            var pixels = new Color32[size * size];
            for (int row = 0; row < size; row++)
                for (int col = 0; col < size; col++)
                {
                    float u = col / (float)size;
                    float v = row / (float)size;
                    float waviness = Mathf.Sin(v * Mathf.PI * 2) * 0.068f + Mathf.Sin(v * Mathf.PI * 6) * 0.017f;
                    float ridge = (1 + Mathf.Cos((u + waviness) * Mathf.PI * 22)) * 0.5f;
                    float fleck = Mathf.PerlinNoise(u * 13 + 40, v * 24 + 20);
                    float shade = 0.66f + Mathf.Pow(ridge, 0.38f) * 0.21f + fleck * 0.13f;
                    pixels[row * size + col] = new Color(shade, shade, shade, 1);
                }
            return StoreTexture("BarkGrain", size, pixels, TextureWrapMode.Repeat);
        }

        static Texture2D StoreTexture(string name, int size, Color32[] pixels, TextureWrapMode wrap)
        {
            var texture = new Texture2D(size, size, TextureFormat.RGBA32, false);
            texture.SetPixels32(pixels);
            texture.Apply();
            string path = Art + "/" + name + ".png";
            byte[] png = texture.EncodeToPNG();
            Object.DestroyImmediate(texture);
            if (!System.IO.File.Exists(path) || !System.IO.File.ReadAllBytes(path).SequenceEqual(png))
            {
                System.IO.File.WriteAllBytes(path, png);
                AssetDatabase.ImportAsset(path, ImportAssetOptions.ForceSynchronousImport);
            }
            var importer = (TextureImporter)AssetImporter.GetAtPath(path);
            if (importer.wrapMode != wrap || importer.anisoLevel < 4)
            {
                importer.wrapMode = wrap;
                importer.anisoLevel = 4;
                importer.SaveAndReimport();
            }
            return AssetDatabase.LoadAssetAtPath<Texture2D>(path);
        }

        static GameObject Bake(string id)
        {
            var source = AssetDatabase.LoadAssetAtPath<GameObject>(Imports + "/" + id + ".fbx");
            if (!source)
                throw new InvalidOperationException("Missing Blender export " + id);
            var item = new GameObject(id);
            var renderers = source.GetComponentsInChildren<MeshRenderer>();
            var full = BakeMesh(source.transform, renderers, id, item);
            if (id is "Sapling" or "Ribbonwood" or "Ironwood" or "Understory" or "Broadleaf")
            {
                var reduced = new GameObject("Reduced detail");
                reduced.transform.SetParent(item.transform, false);
                var distant = BakeMesh(source.transform,
                    renderers.Where((renderer, index) => PreserveAtDistance(renderer.name, index)), id + "Distant", reduced);
                var group = item.AddComponent<LODGroup>();
                group.SetLODs(new[] { new LOD(0.14f, new Renderer[] { full }), new LOD(0.007f, new Renderer[] { distant }) });
                group.RecalculateBounds();
            }
            var prefab = PrefabUtility.SaveAsPrefabAsset(item, Art + "/" + id + ".prefab");
            Object.DestroyImmediate(item);
            return prefab;
        }

        static bool PreserveAtDistance(string name, int index)
        {
            if (name.StartsWith("Fern pinna") || name.StartsWith("Shaped ribbon frond") ||
                name.StartsWith("Leaf canopy") || name.StartsWith("Coral petal"))
                return index % 2 == 0;
            return !name.StartsWith("Vine leaf") && !name.StartsWith("Crown edge foliage") && !name.StartsWith("Raised bark seam");
        }

        static MeshRenderer BakeMesh(Transform source, IEnumerable<MeshRenderer> renderers, string id, GameObject item)
        {
            var sections = new Dictionary<Material, List<CombineInstance>>();
            foreach (var renderer in renderers)
            {
                var mesh = renderer.GetComponent<MeshFilter>().sharedMesh;
                for (int i = 0; i < mesh.subMeshCount; i++)
                {
                    string name = renderer.sharedMaterials[i].name;
                    int suffix = name.IndexOf("_Art", StringComparison.Ordinal);
                    var material = Mat(suffix > 0 ? name[..suffix] : name);
                    if (!sections.TryGetValue(material, out var parts))
                    {
                        parts = new List<CombineInstance>();
                        sections.Add(material, parts);
                    }
                    parts.Add(new CombineInstance
                    {
                        mesh = mesh, subMeshIndex = i,
                        transform = source.worldToLocalMatrix * renderer.transform.localToWorldMatrix
                    });
                }
            }
            var byMaterial = new List<CombineInstance>();
            foreach (var parts in sections.Values)
            {
                var local = new Mesh { indexFormat = IndexFormat.UInt32 };
                local.CombineMeshes(parts.ToArray(), true, true);
                byMaterial.Add(new CombineInstance { mesh = local });
            }
            var baked = new Mesh
            {
                indexFormat = byMaterial.Sum(section => section.mesh.vertexCount) > 65534 ? IndexFormat.UInt32 : IndexFormat.UInt16
            };
            baked.CombineMeshes(byMaterial.ToArray(), false, false);
            baked.RecalculateBounds();
            foreach (var section in byMaterial)
                Object.DestroyImmediate(section.mesh);

            item.AddComponent<MeshFilter>().sharedMesh = Store(baked, Art + "/" + id + "Mesh.asset");
            var result = item.AddComponent<MeshRenderer>();
            result.sharedMaterials = sections.Keys.ToArray();
            return result;
        }

        static T Store<T>(T asset, string path) where T : Object
        {
            asset.name = System.IO.Path.GetFileNameWithoutExtension(path);
            var existing = AssetDatabase.LoadAssetAtPath<T>(path);
            if (existing)
            {
                EditorUtility.CopySerialized(asset, existing);
                Object.DestroyImmediate(asset);
                EditorUtility.SetDirty(existing);
                return existing;
            }
            AssetDatabase.CreateAsset(asset, path);
            return asset;
        }

        static Material Mat(string name)
        {
            if (Materials.TryGetValue(name, out var cached))
                return cached;
            ColorUtility.TryParseHtmlString(Palette.TryGetValue(name, out var hex) ? hex : "#8D8B68", out var color);
            var material = new Material(Shader.Find("Universal Render Pipeline/Lit")) { enableInstancing = true };
            material.SetColor("_BaseColor", color);
            material.SetFloat("_Smoothness", name is "Iron" or "Plastic" ? 0.33f : 0.08f);
            if (name is "Bark" or "BarkDark" or "BarkLight")
            {
                if (!barkPattern)
                    barkPattern = PaintBark();
                material.SetTexture("_BaseMap", barkPattern);
            }
            if (name is "Flame" or "FlameCore" or "Ember")
            {
                material.EnableKeyword("_EMISSION");
                material.SetColor("_EmissionColor", color * (name == "FlameCore" ? 2.2f : 1.35f));
            }
            material = Store(material, Art + "/" + name + ".mat");
            Materials[name] = material;
            return material;
        }

        static GameObject Drop(string name, GameObject prefab, Transform parent, Vector3 position, float yaw)
        {
            var item = (GameObject)PrefabUtility.InstantiatePrefab(prefab, parent);
            item.name = name;
            item.transform.SetPositionAndRotation(position, Quaternion.Euler(0, yaw, 0));
            return item;
        }

        static void MarkStatic(GameObject item) => GameObjectUtility.SetStaticEditorFlags(item, StaticEditorFlags.BatchingStatic);

        static float Range(Random random, float low, float high) => Mathf.Lerp(low, high, (float)random.NextDouble());

        readonly struct Species
        {
            public readonly string Name;
            public readonly float Height, Radius, Toughness, Mass;
            public readonly int Price;

            public Species(string name, float height, float radius, float toughness, float mass, int price)
            {
                Name = name;
                Height = height;
                Radius = radius;
                Toughness = toughness;
                Mass = mass;
                Price = price;
            }
        }
    }
}
