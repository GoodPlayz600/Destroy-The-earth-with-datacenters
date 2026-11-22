from math import cos, pi, sin
from pathlib import Path
import sys

import bpy
from mathutils import Vector


if not bpy.app.background:
    raise RuntimeError("Run this generator in a separate Blender background process.")

project = Path(__file__).resolve().parents[1]
arguments = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
output = Path(arguments[0]).resolve() if arguments else project / "Builds" / "Art"
output.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.name = "Clearcut · Crude Sled"
scene.unit_settings.system = "METRIC"
parts = []


def material(name, rgb, roughness=.72, metal=0):
    mat = bpy.data.materials.new(name + "_Art_Sled")
    mat.diffuse_color = (*rgb, 1)
    mat.use_nodes = True
    bsdf = next(node for node in mat.node_tree.nodes if node.type == "BSDF_PRINCIPLED")
    bsdf.inputs["Base Color"].default_value = (*rgb, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metal
    return mat


wood = material("BarkLight", (.42, .24, .095))
pale = material("Heartwood", (.61, .37, .14))
dark = material("BarkDark", (.19, .10, .037))
iron = material("Iron", (.091, .114, .105), .38, .7)
bolt = material("Tarnish", (.29, .20, .13), .43, .7)
rope = material("WoodRing", (.43, .29, .12))


def register(obj, label, mat):
    obj.name = label
    obj.data.materials.append(mat)
    parts.append(obj)
    return obj


def beam(label, center, size, mat, radius=.018):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj = bpy.context.object
    obj.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    bevel = obj.modifiers.new("Rounded edges", "BEVEL")
    bevel.width = radius
    bevel.segments = 3
    bevel.harden_normals = True
    bpy.ops.object.modifier_apply(modifier=bevel.name)
    return register(obj, label, mat)


def runner(label, x, width, height, mat, offset=0, shorter=False):
    length = 2.46 if not shorter else 2.32
    steps, sides = 28, 8
    vertices, faces = [], []
    for section in range(steps + 1):
        t = section / steps
        y = -1.10 + t * length
        bow = .44 * max(0, (t - .65) / .35) ** 2
        heel = .075 * max(0, (.19 - t) / .19) ** 2
        for side in range(sides):
            angle = 2 * pi * side / sides
            vertices.append((x + cos(angle) * width, y, .132 + bow + heel + offset + height * sin(angle)))
    for section in range(steps):
        for side in range(sides):
            a = section * sides + side
            b = section * sides + (side + 1) % sides
            faces.append((a, a + sides, b + sides, b))
    faces.append(tuple(range(sides)))
    faces.append(tuple(range((steps + 1) * sides - 1, steps * sides - 1, -1)))
    mesh = bpy.data.meshes.new(label)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(label, mesh)
    scene.collection.objects.link(obj)
    for face in mesh.polygons:
        face.use_smooth = True
    register(obj, label, mat)


def braid(label, path, radius):
    curve = bpy.data.curves.new(label, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = 1
    spline = curve.splines.new("POLY")
    spline.points.add(len(path) - 1)
    for point, coord in zip(spline.points, path):
        point.co = (*coord, 1)
    obj = bpy.data.objects.new(label, curve)
    scene.collection.objects.link(obj)
    register(obj, label, rope)


for side in (-1, 1):
    x = side * .46
    runner("Steam-bent ash runner", x, .083, .102, dark)
    runner("Short iron skid", x, .078, .027, iron, -.092, shorter=True)
    for y in (-.64, .58):
        beam("Runner riser", (x, y, .245), (.16, .24, .20), wood)
    rail = beam("Log capture rail", (side * .58, -.18, .457), (.115, 1.57, .12), dark, .035)
    rail.rotation_euler.y = side * -.07
    for y in (-.66, .54):
        bpy.ops.mesh.primitive_uv_sphere_add(segments=12, ring_count=8, radius=1, location=(side * .58, y, .512))
        rivet = register(bpy.context.object, "Rounded fastener", bolt)
        rivet.scale = (.032, .032, .024)

for y in (-.66, .56):
    beam("Tenoned deck crosspiece", (0, y, .31), (1.24, .16, .135), dark, .026)
for index in range(5):
    beam("Hand-planed bed board", ((index - 2) * .205, -.08, .396),
         (.187, 1.70 - .09 * abs(index - 2), .09), pale if index % 2 == 0 else wood, .028)
beam("Drawbar", (0, .89, .433), (1.02, .135, .133), wood, .025)
for side in (-1, 1):
    path = [(side * .31 * (1 - t), .89 + .72 * t, .48 - .34 * sin(pi * t / 2))
            for t in (step / 20 for step in range(21))]
    braid("Tow bridle", path, .021)
braid("Knotted pulling eye", [(.075 * sin(t), 1.68 + .078 * cos(t), .14 + .022 * sin(t))
                              for t in (step * 2 * pi / 25 for step in range(26))], .019)

bpy.ops.object.select_all(action="DESELECT")
for obj in parts:
    obj.select_set(True)
bpy.context.view_layer.objects.active = parts[0]
bpy.ops.wm.save_as_mainfile(filepath=str(output / "PrimitiveSled.blend"))
bpy.ops.export_scene.fbx(filepath=str(output / "PrimitiveSled.fbx"), use_selection=True,
                         object_types={"MESH", "OTHER"}, axis_forward="-Z", axis_up="Y",
                         add_leaf_bones=False, bake_anim=False)

cam_data = bpy.data.cameras.new("Sled preview")
camera = bpy.data.objects.new("Sled preview", cam_data)
scene.collection.objects.link(camera)
camera.location = (3.5, 4.2, 2.5)
camera.rotation_euler = (Vector((0, .24, .22)) - camera.location).to_track_quat("-Z", "Y").to_euler()
cam_data.type = "ORTHO"
cam_data.ortho_scale = 3.25
scene.camera = camera
scene.render.engine = "BLENDER_WORKBENCH"
scene.display.shading.color_type = "MATERIAL"
scene.display.shading.light = "STUDIO"
scene.display.shading.show_cavity = True
scene.display.shading.cavity_type = "BOTH"
scene.render.resolution_x = 880
scene.render.resolution_y = 640
scene.render.resolution_percentage = 100
scene.render.filepath = str(output / "primitive-sled.png")
bpy.ops.render.render(write_still=True)
