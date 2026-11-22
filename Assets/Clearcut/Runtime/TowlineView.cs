using UnityEngine;

namespace Clearcut
{
    internal sealed class TowlineView : MonoBehaviour
    {
        const int Segments = 8;
        const int Sides = 6;
        const float Radius = 0.019f;
        readonly Vector3[] points = new Vector3[(Segments + 1) * Sides];
        Mesh mesh;

        internal void Initialize(Material material)
        {
            mesh = new Mesh { name = "Flexible twine" };
            mesh.MarkDynamic();
            var triangles = new int[Segments * Sides * 6];
            for (int ring = 0; ring < Segments; ring++)
                for (int side = 0; side < Sides; side++)
                {
                    int a = ring * Sides + side;
                    int b = ring * Sides + (side + 1) % Sides;
                    int index = a * 6;
                    triangles[index] = a;
                    triangles[index + 1] = b;
                    triangles[index + 2] = a + Sides;
                    triangles[index + 3] = b;
                    triangles[index + 4] = b + Sides;
                    triangles[index + 5] = a + Sides;
                }
            mesh.vertices = points;
            mesh.triangles = triangles;
            gameObject.AddComponent<MeshFilter>().sharedMesh = mesh;
            gameObject.AddComponent<MeshRenderer>().sharedMaterial = material;
        }

        internal void Draw(Vector3 first, Vector3 last, float slack)
        {
            Vector3 direction = (last - first).normalized;
            Vector3 axis = Vector3.Cross(direction, Vector3.up);
            if (axis.sqrMagnitude < 0.05f)
                axis = Vector3.Cross(direction, Vector3.right);
            axis.Normalize();
            Vector3 perpendicular = Vector3.Cross(direction, axis);
            for (int ring = 0; ring <= Segments; ring++)
            {
                float t = ring / (float)Segments;
                Vector3 point = Vector3.Lerp(first, last, t) - Vector3.up * (Mathf.Sin(Mathf.PI * t) * slack);
                for (int side = 0; side < Sides; side++)
                {
                    float angle = side * Mathf.PI * 2 / Sides;
                    Vector3 tip = point + (axis * Mathf.Cos(angle) + perpendicular * Mathf.Sin(angle)) * Radius;
                    points[ring * Sides + side] = transform.InverseTransformPoint(tip);
                }
            }
            mesh.vertices = points;
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
        }

        void OnDestroy()
        {
            if (mesh)
                Destroy(mesh);
        }
    }
}
