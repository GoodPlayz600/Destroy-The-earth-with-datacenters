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
            ["FlameCore"] = "#FFAE27", ["Reed"] = "#527E36"
        };
        static readonly Dictionary<string, Material> Materials = new();

        [MenuItem("Clearcut/Build Opening Scene")]
        public static void Create()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
                throw new InvalidOperationException("Stop Play Mode before rebuilding the scene.");
            if (!AssetDatabase.IsValidFolder(Art))
                AssetDatabase.CreateFolder("Assets/Clearcut", "Art");
            Materials.Clear();

            var trees = new[] { Bake("Sapling"), Bake("Ribbonwood"), Bake("Ironwood") };
            var stump = Bake("Stump");
            var log = Bake("FallenLog");
            var knife = Bake("ButterKnife");
            var pit = Bake("AshPit");
            var sign = Bake("ExchangeSign");
            var fern = Bake("Understory");

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
                var plant = Drop("Fern", fern, decorations, new Vector3(x, Elevation(x, z), z), Range(random, 0, 360));
                plant.transform.localScale = Vector3.one * Range(random, 0.61f, 1.48f);
                MarkStatic(plant);
            }
            foreach (var position in new[] { new Vector2(-2.7f, 2.1f), new Vector2(-4.4f, 4.1f),
                new Vector2(5.8f, 2.2f), new Vector2(-1.9f, 6.1f), new Vector2(2.3f, 7.8f),
                new Vector2(4.9f, 8.1f), new Vector2(-4.3f, -0.9f), new Vector2(-4.8f, 6.2f) })
            {
                var plant = Drop("Clearing fern", fern, decorations,
                    new Vector3(position.x, Elevation(position.x, position.y), position.y), Range(random, 0, 360));
                plant.transform.localScale = Vector3.one * Range(random, 0.58f, 0.86f);
                MarkStatic(plant);
            }

            var exchange = MakeExchange(pit, sign);
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
            var linkerArguments = PlayerSettings.WebGL.emscriptenArgs;
            if (string.IsNullOrWhiteSpace(linkerArguments) || !linkerArguments.Contains("-lembind"))
                PlayerSettings.WebGL.emscriptenArgs = (linkerArguments + " -lembind").Trim();
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Disabled;
            PlayerSettings.WebGL.memorySize = 96;
            AssetDatabase.SaveAssets();
            Debug.Log("Clearcut opening saved with " + records.Count + " living 3D trees and " + trees.Length + " species.");
        }

        static AshExchange MakeExchange(GameObject pit, GameObject sign)
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
            Letter(signObj.transform, "ASH EXCHANGE", 1.58f, 0.05f, new Color(1, 0.84f, 0.47f));
            Letter(signObj.transform, "LOGS IN   •   CASH OUT", 1.37f, 0.028f, new Color(0.91f, 0.78f, 0.54f));
            var fire = new List<Transform>();
            for (int i = 0; i < 8; i++)
            {
                float angle = i * Mathf.PI * 2 / 8;
                GameObject tongue = GameObject.CreatePrimitive(PrimitiveType.Sphere);
                tongue.name = "Flame";
                Object.DestroyImmediate(tongue.GetComponent<Collider>());
                tongue.transform.SetParent(site.transform, false);
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
            light.transform.rotation = Quaternion.Euler(43f, -34f, 0);
            light.color = new Color(1, 0.92f, 0.72f);
            light.intensity = 1.65f;
            light.shadows = LightShadows.Soft;
            RenderSettings.sun = light;
            RenderSettings.ambientMode = AmbientMode.Trilight;
            RenderSettings.ambientSkyColor = new Color(0.57f, 0.65f, 0.61f);
            RenderSettings.ambientEquatorColor = new Color(0.42f, 0.53f, 0.42f);
            RenderSettings.ambientGroundColor = new Color(0.28f, 0.29f, 0.18f);
            RenderSettings.fog = true;
            RenderSettings.fogMode = FogMode.ExponentialSquared;
            RenderSettings.fogDensity = 0.020f;
            RenderSettings.fogColor = new Color(0.62f, 0.75f, 0.64f);
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
            var materials = new[] { Mat("Dirt"), Mat("DryDirt"), Mat("Moss"), Mat("Grass"), Mat("DampGrass") };
            var indices = new List<int>[materials.Length];
            for (int i = 0; i < materials.Length; i++)
                indices[i] = new List<int>();

            for (int z = 0; z < dimension; z++)
                for (int x = 0; x < dimension; x++)
                {
                    float wx = (x - dimension / 2) * step;
                    float wz = (z - dimension / 2) * step;
                    int id = z * dimension + x;
                    vertices[id] = new Vector3(wx, Elevation(wx, wz), wz);
                    uvs[id] = new Vector2(x / (float)dimension, z / (float)dimension);
                    if (x == dimension - 1 || z == dimension - 1)
                        continue;
                    float noise = Mathf.PerlinNoise(wx * 0.27f + 137, wz * 0.27f + 47);
                    float clearing = new Vector2(wx * 0.92f, wz * 0.70f - 2.2f).magnitude + (noise - 0.5f) * 3.6f;
                    var triangles = indices[clearing < 4.15f ? noise > 0.54f ? 1 : 0 :
                        clearing < 7.4f ? 2 : noise > 0.51f ? 3 : 4];
                    int opposite = id + dimension + 1;
                    triangles.Add(id);
                    triangles.Add(id + dimension);
                    triangles.Add(opposite);
                    triangles.Add(id);
                    triangles.Add(opposite);
                    triangles.Add(id + 1);
                }

            var mesh = new Mesh { vertices = vertices, uv = uvs, subMeshCount = indices.Length };
            for (int i = 0; i < indices.Length; i++)
                mesh.SetTriangles(indices[i], i);
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            mesh = Store(mesh, Art + "/ClearingGround.asset");
            ground.AddComponent<MeshFilter>().sharedMesh = mesh;
            ground.AddComponent<MeshRenderer>().sharedMaterials = materials;
            ground.AddComponent<MeshCollider>().sharedMesh = mesh;
            MarkStatic(ground);
        }

        static GameObject Bake(string id)
        {
            var source = AssetDatabase.LoadAssetAtPath<GameObject>(Imports + "/" + id + ".fbx");
            if (!source)
                throw new InvalidOperationException("Missing Blender export " + id);
            var sections = new Dictionary<Material, List<CombineInstance>>();
            var bones = source.GetComponentsInChildren<MeshRenderer>();
            foreach (var renderer in bones)
            {
                var mesh = renderer.GetComponent<MeshFilter>().sharedMesh;
                for (int i = 0; i < mesh.subMeshCount; i++)
                {
                    var material = Mat(renderer.sharedMaterials[i].name);
                    if (!sections.TryGetValue(material, out var parts))
                    {
                        parts = new List<CombineInstance>();
                        sections.Add(material, parts);
                    }
                    parts.Add(new CombineInstance
                    {
                        mesh = mesh, subMeshIndex = i,
                        transform = source.transform.worldToLocalMatrix * renderer.transform.localToWorldMatrix
                    });
                }
            }
            var byMaterial = new List<CombineInstance>();
            foreach (var parts in sections.Values)
            {
                var local = new Mesh();
                local.CombineMeshes(parts.ToArray(), true, true);
                byMaterial.Add(new CombineInstance { mesh = local });
            }
            var baked = new Mesh();
            baked.CombineMeshes(byMaterial.ToArray(), false, false);
            baked.RecalculateBounds();
            foreach (var section in byMaterial)
                Object.DestroyImmediate(section.mesh);

            var saved = Store(baked, Art + "/" + id + "Mesh.asset");
            var item = new GameObject(id);
            item.AddComponent<MeshFilter>().sharedMesh = saved;
            item.AddComponent<MeshRenderer>().sharedMaterials = sections.Keys.ToArray();
            var prefab = PrefabUtility.SaveAsPrefabAsset(item, Art + "/" + id + ".prefab");
            Object.DestroyImmediate(item);
            return prefab;
        }

        static T Store<T>(T asset, string path) where T : Object
        {
            var existing = AssetDatabase.LoadAssetAtPath<T>(path);
            if (existing)
            {
                EditorUtility.CopySerialized(asset, existing);
                Object.DestroyImmediate(asset);
                EditorUtility.SetDirty(existing);
                return existing;
            }
            asset.name = System.IO.Path.GetFileNameWithoutExtension(path);
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
