const path = require('path')
const fs = require('fs')
const math = require('mathjs')

const ANIM_LINEAR = "LINEAR"
const ANIM_STEP = "STEP"
const ANIM_CALMULLROMSPLINE = "CALMULLROMSPLINE"
const ANIM_CUBICSPLINE = "CUBICSPLINE"

const SCALAR = "SCALAR"
const VEC2 = "VEC2"
const VEC3 = "VEC3"
const VEC4 = "VEC4"
const MAT2 = "MAT2"
const MAT3 = "MAT3"
const MAT4 = "MAT4"

const BYTE = 5120
const UNSIGNED_BYTE = 5121
const SHORT = 5122
const UNSIGNED_SHORT = 5123
const INT = 5124
const UNSIGNED_INT = 5125
const FLOAT = 5126
const DOUBLE = 5127


const COMPONENT_TYPES = [BYTE, UNSIGNED_BYTE, SHORT, UNSIGNED_SHORT, UNSIGNED_INT, FLOAT]
const ACCESSOR_SPARSE_INDICES_COMPONENT_TYPES = [UNSIGNED_BYTE, UNSIGNED_SHORT, UNSIGNED_INT]

// MESH PRIMITIVE MODES
const POINTS = 0
const LINES = 1
const LINE_LOOP = 2
const LINE_STRIP = 3
const TRIANGLES = 4
const TRIANGLE_STRIP = 5
const TRIANGLE_FAN = 6

const MESH_PRIMITIVE_MODES = [POINTS, LINES, LINE_LOOP, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN]

// The bufferView target that the GPU buffer should be bound to.
const ARRAY_BUFFER = 34962  // eg vertex data
const ELEMENT_ARRAY_BUFFER = 34963  // eg index data

const BUFFERVIEW_TARGETS = [ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER]

const TRANSLATION = "translation"
const ROTATION = "rotation"
const SCALE = "scale"
const WEIGHTS = "weights"

const ANIMATION_CHANNEL_TARGET_PATHS = [TRANSLATION, ROTATION, SCALE, WEIGHTS]

const ATTR_KEYS = ["POSITION", "NORMAL", "TANGENT", "TEXCOORD_0", "TEXCOORD_1", "COLOR_0", "JOINTS_0", "WEIGHTS_0"]

const YUPTOZUP = [
    1, 0, 0, 0,
    0, 0, -1, 0,
    0, 1, 0, 0,
    0, 0, 0, 1]
const CLAMP_TO_EDGE = 33071
const MIRRORED_REPEAT = 33648
const REPEAT = 10497

const WRAPPING_MODES = [CLAMP_TO_EDGE, MIRRORED_REPEAT, REPEAT]

const IMAGEJPEG = 'image/jpeg'
const IMAGEPNG = "image/png"

const IMAGE_MIMETYPES = [IMAGEJPEG, IMAGEPNG]

const NEAREST = 9728
const LINEAR = 9729
const NEAREST_MIPMAP_NEAREST = 9984
const LINEAR_MIPMAP_NEAREST = 9985
const NEAREST_MIPMAP_LINEAR = 9986
const LINEAR_MIPMAP_LINEAR = 9987

const MAGNIFICATION_FILTERS = [NEAREST, LINEAR]
const MINIFICATION_FILTERS = [NEAREST, LINEAR, NEAREST_MIPMAP_NEAREST, LINEAR_MIPMAP_NEAREST, NEAREST_MIPMAP_LINEAR, LINEAR_MIPMAP_LINEAR]

const PERSPECTIVE = "perspective"
const ORTHOGRAPHIC = "orthographic"

const CAMERA_TYPES = [PERSPECTIVE, ORTHOGRAPHIC]

const BLEND = "BLEND"
const MASK = "MASK"
const OPAQUE = "OPAQUE"

const MATERIAL_ALPHAMODES = [OPAQUE, MASK, BLEND]

const _JSON = "JSON"
const BIN = "BIN\x00"
const MAGIC = 'glTF'
const GLTF_VERSION = 2  // version this library exports
const GLTF_MIN_VERSION = 2  // minimum version this library can load
const GLTF_MAX_VERSION = 2  // maximum supported version this library can load

const DATA_URI_HEADER = "data:application/octet-stream;base64,"

class Str { }
class Int { }
class Float { }
class Bool { }


function data2buffer(data, type) {

    let buf = null

    let d = []
    if (data[0] instanceof Array) {
        data.forEach(s => d.push(...s));
    } else {
        d = data
    }

    let _init = global.Buffer.alloc(d.length)

    if (type === BYTE || type === 'BYTE') {
        buf = new Int8Array(_init)

    } else if (type === UNSIGNED_BYTE || type === 'UNSIGNED_BYTE') {
        buf = new Uint8Array(_init)

    } else if (type === SHORT || type === 'SHORT') {
        buf = new Int16Array(_init)

    } else if (type === UNSIGNED_SHORT || type === 'UNSIGNED_SHORT') {
        buf = new Uint16Array(_init)

    } else if (type === INT || type === 'INT') {
        buf = new Int32Array(_init)

    } else if (type === UNSIGNED_INT || type === 'UNSIGNED_INT') {
        buf = new Uint32Array(_init)

    } else if (type === FLOAT || type === 'FLOAT') {
        buf = new Float32Array(_init)

    } else if (type === DOUBLE || type === 'DOUBLE') {
        buf = new Float64Array(_init)
    }

    buf.set(d)
    return global.Buffer.from(buf.buffer)
}


function padbytes(buf, alignment, fillchar, offset = 0) {
    let buflen = buf.byteLength
    let padlen = (alignment - ((buflen + offset) % alignment)) % alignment
    buf = global.Buffer.concat([buf, global.Buffer.from(fillchar.repeat(padlen))], buflen + padlen)
    return buf
}


class BaseModel {
    //具有扩展特定对象的字典对象
    extensions = undefined
    //应用程序特定数据
    extras = undefined

    setExtras(k, v, s = undefined) {
        if (!this.extras) {
            this.extras = {}
        }
        this.extras[k] = v
        if (!!s) {
            bins.set(v, new TSoures(s))
        }
    }

    static from(obj) {
        let s = new this()
        for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
                s[key] = obj[key];
            }
        }
        return s
    }
}

class Asset extends BaseModel {
    generator = undefined && Str
    copyright = undefined && Str
    version = "2.0"
    minVersion = undefined && Str
}

class Attributes {
    POSITION = undefined && Int
    NORMAL = undefined && Int
    TANGENT = undefined && Int
    TEXCOORD_0 = undefined && Int
    TEXCOORD_1 = undefined && Int
    COLOR_0 = undefined && Int
    JOINTS_0 = undefined && Int
    WEIGHTS_0 = undefined && Int

    constructor(object = {}) {
        for (const key in object) {
            if (Object.hasOwnProperty.call(object, key)) {
                this.setAttr(key, object[key])
            }
        }
    }

    setAttr(key, value) {
        let _key = key.toUpperCase()
        if (ATTR_KEYS.includes(_key)) {
            this[_key] = value
        } else {
            this[`_${_key}`] = value
        }
    }
}

class Primitive extends BaseModel {
    attributes = null && Attributes
    indices = undefined && Int
    mode = undefined && Int && MESH_PRIMITIVE_MODES
    material = undefined && Int
    targets = undefined && [Attributes]
}

class Mesh extends BaseModel {
    primitives = null && [Primitive]
    weights = undefined && [Float]
    name = undefined && Str
}

class AccessorSparseIndices extends BaseModel {
    bufferView = null && Int
    byteOffset = undefined && Int && 0
    componentType = null && Int && COMPONENT_TYPES
}

class AccessorSparseValues extends BaseModel {
    bufferView = null && Int
    byteOffset = undefined && Int && 0
}

class Sparse extends BaseModel {
    count = null && Int
    indices = null && AccessorSparseIndices
    values = null && AccessorSparseValues
}

class Accessor extends BaseModel {
    bufferView = undefined && Int
    byteOffset = undefined && Int && 0
    componentType = null && Int && COMPONENT_TYPES
    normalized = undefined && Bool && false
    count = null && Int
    type = null && Str && SCALAR
    sparse = undefined && Sparse
    max = undefined && [Float]
    min = undefined && [Float]
    name = undefined && Str
}

class BufferView extends BaseModel {
    buffer = null && Int
    byteOffset = undefined && Int && 0
    byteLength = null && Int
    byteStride = undefined && Int
    target = undefined && Int && BUFFERVIEW_TARGETS
    name = undefined && Str

    constructor(buffer, byteLength, byteOffset = undefined) {
        super()
        this.buffer = buffer
        this.byteLength = byteLength
        this.byteOffset = byteOffset
    }
}

class Buffer extends BaseModel {
    uri = undefined && Str
    byteLength = null && Int
    // name = undefined && Str

    constructor(uri, byteLength, name) {
        super()
        this.uri = uri
        this.byteLength = byteLength
        // this.name = name
    }
}

class Perspective extends BaseModel {
    aspectRatio = undefined && Float
    yfov = null && Float
    zfar = undefined && Float
    znear = null && Float
}

class Orthographic extends BaseModel {
    xmag = null && Float
    ymag = null && Float
    zfar = null && Float
    znear = null && Float
}

class Camera extends BaseModel {
    perspective = undefined && Perspective
    orthographic = undefined && Orthographic
    type = null && Str
    name = undefined && Str
}

class TextureInfo extends BaseModel {
    index = null && Int
    texCoord = undefined && Int && 0
}

class OcclusionTextureInfo extends BaseModel {
    index = undefined && Int
    texCoord = undefined && Int
    strength = undefined && Float && 1.0
}

class NormalMaterialTexture extends BaseModel {
    index = undefined && Int
    texCoord = undefined && Int
    scale = undefined && Float && 1.0
}

class PbrMetallicRoughness extends BaseModel {
    baseColorFactor = undefined && [Float] && [1.0, 1.0, 1.0, 1.0]
    metallicFactor = undefined && Float && 1.0
    roughnessFactor = undefined && Float && 1.0
    baseColorTexture = undefined && TextureInfo
    metallicRoughnessTexture = undefined && TextureInfo
}

class Material extends BaseModel {
    pbrMetallicRoughness = undefined && PbrMetallicRoughness
    normalTexture = undefined && NormalMaterialTexture
    occlusionTexture = undefined && OcclusionTextureInfo
    emissiveFactor = undefined && [Float] && [0., 0., 0.]
    emissiveTexture = undefined && TextureInfo
    alphaMode = undefined && Str && OPAQUE
    alphaCutoff = undefined && Float && 0.5
    doubleSided = undefined && Bool && false
    name = undefined && Str
}

class Sampler extends BaseModel {
    input = undefined && Int
    interpolation = undefined && Str
    output = undefined && Int
    magFilter = undefined && Int
    minFilte = undefined && Int
    wrapS = undefined && Int && REPEAT  // repeat wrapping in S(U)
    wrapT = undefined && Int && REPEAT  // repeat wrapping in T(V)
}

class Node extends BaseModel {
    mesh = undefined && Int
    skin = undefined && Int
    rotation = undefined && [Float]
    translation = undefined && [Float]
    scale = undefined && [Float]
    children = undefined && [Int]
    matrix = undefined && [Float]
    camera = undefined && Int
    name = undefined && Str
}

class Skin extends BaseModel {
    inverseBindMatrices = undefined && Int
    skeleton = undefined && Int
    joints = undefined && [Int]
    name = undefined && Str
}

class Scene extends BaseModel {
    name = undefined && Str
    nodes = undefined && [Int]
}

class Texture extends BaseModel {
    sampler = undefined && Int
    source = undefined && Int
    name = undefined && Str
}

class Image extends BaseModel {
    uri = null && Str
    mimeType = null && Str
    bufferView = null && Int
    name = undefined && Str
}

class AnimationChannelTarget extends BaseModel {
    node = undefined && Int
    path = null && Str
}

class AnimationSampler extends BaseModel {
    input = null && Int
    output = null && Int
    interpolation = undefined && Str
}

class AnimationChannel extends BaseModel {
    sampler = null && Int
    target = null && AnimationChannelTarget
}

class Animation extends BaseModel {
    name = undefined
    channels = null && [AnimationChannel]
    samplers = null && [AnimationSampler]
}

class GLTF extends BaseModel {
    asset = null && Asset
    accessors = undefined && [Accessor]
    animations = undefined && [Animation]
    bufferViews = undefined && [BufferView]
    buffers = undefined && [Buffer]
    cameras = undefined && [Camera]
    extensionsUsed = undefined && [Str]
    extensionsRequired = undefined && [Str]
    images = undefined && [Image]
    materials = undefined && [Material]
    meshes = undefined && [Mesh]
    nodes = undefined && [Node]
    samplers = undefined && [Sampler]
    scene = undefined && Int
    scenes = undefined && [Scene]
    skins = undefined && [Skin]
    textures = undefined && [Texture]

    constructor(asset) {
        super()
        this.asset = asset

        this.buffers = []
        this.meshes = []
        // 以node0为根，node0中包含全部模型
        this.nodes = [Node.from({
            children: [],
            matrix: [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]
        })]
        this.scenes = [Scene.from({ nodes: [0] })]
        this.scene = 0

        // 闭包带替类变量，且不参与JSON.stringify
        let bins = new Map()
        this.bins = () => bins
        // 不用时要清掉，可能导致内存泄露
        this.clear_bins = () => {
            bins = new Map()
        }
    }


    append_data(uri, data, component_type, type, target) {
        if (data && data.length) {

            let buf = data2buffer(data, component_type)

            let bv = this.__append_buffer(uri, buf)
            bv.target = target

            this.bufferViews ||= []
            this.bufferViews.push(bv)

            let acc = new Accessor()
            acc.count = data.length
            acc.bufferView = this.bufferViews.length - 1
            acc.componentType = component_type
            acc.type = type
            acc.max = [math.max(data, 0)].flat()
            acc.min = [math.min(data, 0)].flat()

            this.accessors ||= []
            this.accessors.push(acc)

            return this.accessors.length - 1
        }
    }

    __append_buffer(uri, buffer) {
        let cur_buf = this.bins().get(uri) || global.Buffer.alloc(0)
        let new_buf = global.Buffer.concat([cur_buf, buffer])
        this.bins().set(uri, new_buf)
        return new BufferView(this.bins().size - 1, buffer.byteLength, cur_buf.byteLength)
    }

    zup() {
        let ori = math.reshape(this.nodes[0].matrix, [4, 4])
        this.nodes[0].matrix = math.multiply(ori, [
            [1, 0, 0, 0],
            [0, 0, -1, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 1]
        ]).flat()
    }

    yup() {
        let ori = math.reshape(this.nodes[0].matrix, [4, 4])
        this.nodes[0].matrix = math.multiply(ori, [
            [1, 0, 0, 0],
            [0, 0, 1, 0],
            [0, -1, 0, 0],
            [0, 0, 0, 1]
        ]).flat()
    }

    offset(off) {
        this.nodes[0].translation = off
        this.nodes[0].matrix = undefined
    }

    save(outPath) {
        let gltf = JSON.parse(JSON.stringify(this))
        let dirPath = path.dirname(outPath)
        this.bins().forEach((v, k) => {
            let name = `${k}.bin`
            gltf.buffers.push({ uri: name, byteLength: v.byteLength })
            let filePath = path.join(dirPath, name)
            fs.mkdir(path.dirname(filePath), { recursive: true }, err => {
                if (!err) {
                    fs.writeFile(filePath, v, 'utf-8', err => console.error(err))
                } else {
                    console.error(err);
                }
            })
        })
        fs.writeFile(outPath, JSON.stringify(gltf, null, '\t'), 'utf-8', err => console.error(err))
        gltf = null
    }

    toBinary() {
        let gltf = JSON.parse(JSON.stringify(this))

        let chunk_bins = []
        let total_length = 0
        let Buf = global.Buffer
        let _head, _bin, _chunk
        this.bins().forEach((v, k) => {
            gltf.buffers.push({ uri: undefined, byteLength: v.byteLength })
            _bin = padbytes(v, 4, '\x20')

            _head = Buf.alloc(8)
            _head.writeUint32LE(_bin.byteLength)
            _head.writeUint32LE(0x004E4942, 4)

            _chunk = Buf.concat([_head, _bin])
            chunk_bins.push(_chunk)
            total_length += _chunk.byteLength
        })

        _bin = Buf.from(JSON.stringify(gltf))
        _bin = padbytes(_bin, 4, '\x20')
        _head = Buf.alloc(8)
        _head.writeUint32LE(_bin.byteLength)
        _head.writeUint32LE(0x4E4F534A, 4)
        _chunk = Buf.concat([_head, _bin])
        total_length += _chunk.byteLength

        _head = Buf.alloc(12)
        _head.write(MAGIC)
        _head.writeUint32LE(GLTF_VERSION, 4)
        _head.writeUint32LE(total_length, 8)

        return Buf.concat([_head, _chunk, ...chunk_bins])
    }

    toBase64() {
        let gltf = JSON.parse(JSON.stringify(this))

        this.bins().forEach((v, k) => {
            gltf.buffers.push({
                uri: `data:application/octet-stream;base64,${v.toString('base64')}`,
                byteLength: v.byteLength
            })
        })

        return gltf
    }

    destroy() {
        this.clear_bins()
        delete this
    }

    referenceGeometry(geom, source_url = 'bin') {

        let _vectors = this.append_data(source_url, geom.vectors, FLOAT, VEC3, ARRAY_BUFFER)
        let _normals = this.append_data(source_url, geom.normals, FLOAT, VEC3, ARRAY_BUFFER)
        let _indices = this.append_data(source_url, geom.indices, UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)

        let _color_0 = this.append_data(source_url, geom.color, FLOAT, VEC3, ARRAY_BUFFER)
        let _texco_0 = this.append_data(source_url, geom.texcoord_0, FLOAT, VEC2, ARRAY_BUFFER)
        let _batchid = this.append_data(source_url, geom.batchid, FLOAT, SCALAR, ARRAY_BUFFER)

        // let _tangent = this.append_data(source_url, geom.tangent?.flat(), UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)
        // let _texcoord_1 = this.append_data(source_url, geom.texcoord_1?.flat(), UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)
        // let _joints_0 = this.append_data(source_url, geom.joints_0?.flat(), UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)
        // let _weights_0 = this.append_data(source_url, geom.weights_0?.flat(), UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)


        let mesh = Mesh.from({
            primitives: [
                Primitive.from({
                    attributes: new Attributes({
                        POSITION: _vectors,
                        NORMAL: _normals,
                        COLOR_0: _color_0,
                        TEXCOORD_0: _texco_0,
                        BATCHID: _batchid,
                        // TANGENT: _tangent,
                        // TEXCOORD_1: _texcoord_1,
                        // JOINTS_0: _joints_0,
                        // WEIGHTS_0: _weights_0,
                    }),
                    indices: _indices
                })
            ]
        })
        this.meshes.push(mesh)
        let node = Node.from({ mesh: this.meshes.indexOf(mesh) })
        this.nodes.push(node)
        this.nodes[0].children.push(this.nodes.indexOf(node))
    }
    referenceGeometry1(geom, source_url = 'bin', mode = 4) {

        let _vectors = this.append_data(source_url, geom.vectors, FLOAT, VEC3, ARRAY_BUFFER)
        let _normals = this.append_data(source_url, geom.normals, FLOAT, VEC3, ARRAY_BUFFER)
        let _indices = this.append_data(source_url, geom.indices, UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)

        let _color_0 = this.append_data(source_url, geom.color, FLOAT, VEC3, ARRAY_BUFFER)
        let _batchid = this.append_data(source_url, geom.batchid, FLOAT, SCALAR, ARRAY_BUFFER)

        // let _tangent = this.append_data(source_url, geom.tangent?.flat(), UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)
        // let _texcoord_0 = this.append_data(source_url, geom.texcoord_0?.flat(), UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)
        // let _texcoord_1 = this.append_data(source_url, geom.texcoord_1?.flat(), UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)
        // let _joints_0 = this.append_data(source_url, geom.joints_0?.flat(), UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)
        // let _weights_0 = this.append_data(source_url, geom.weights_0?.flat(), UNSIGNED_INT, SCALAR, ELEMENT_ARRAY_BUFFER)


        let mesh = Mesh.from({
            primitives: [
                Primitive.from({
                    attributes: new Attributes({
                        POSITION: _vectors,
                        NORMAL: _normals,
                        COLOR_0: _color_0,
                        BATCHID: _batchid,
                        // TANGENT: _tangent,
                        // TEXCOORD_0: _texcoord_0,
                        // TEXCOORD_1: _texcoord_1,
                        // JOINTS_0: _joints_0,
                        // WEIGHTS_0: _weights_0,
                    }),
                    indices: _indices,
                    mode: LINES
                })
            ]
        })
        this.meshes.push(mesh)
        let node = Node.from({ mesh: this.meshes.indexOf(mesh) })
        this.nodes.push(node)
        this.nodes[0].children.push(this.nodes.indexOf(node))
    }
    // 绘多边形
    referencePolygon(points) {
        let res = []
        points.forEach(p => {
            res.push(p)
            res.push(p)
        });
        let vectors = this.append_data('bin', res, FLOAT, VEC3, ARRAY_BUFFER)

        let mesh = Mesh.from({
            primitives: [
                Primitive.from({
                    attributes: new Attributes({
                        POSITION: vectors
                    }),
                    mode: LINE_LOOP
                })
            ]
        })

        this.meshes.push(mesh)
        let node = Node.from({ mesh: this.meshes.indexOf(mesh) })
        this.nodes.push(node)
        this.nodes[0].children.push(this.nodes.indexOf(node))
    }

    // 参考点
    referencePoint(point, size = 1) {
        let a = [point[0] - size, point[1], point[2]]
        let a1 = [point[0] + size, point[1], point[2]]
        this.referenceLine(a, a1)
        let b = [point[0], point[1] - size, point[2]]
        let b1 = [point[0], point[1] + size, point[2]]
        this.referenceLine(b, b1)
        let c = [point[0], point[1], point[2] - size]
        let c1 = [point[0], point[1], point[2] + size]
        this.referenceLine(c, c1)
    }

    // 参考线
    referenceLines(lines) {
        for (let i = 0; i < lines.length - 1; i++) {
            this.referenceLine(lines[i], lines[i + 1])
        }
    }

    // 参考线段
    referenceLine(start, end) {
        let vectors = this.append_data('bin', [start, end], FLOAT, VEC3, ARRAY_BUFFER)

        let mesh = Mesh.from({
            primitives: [
                Primitive.from({
                    attributes: new Attributes({
                        POSITION: vectors
                    }),
                    mode: LINES
                })
            ]
        })

        this.meshes.push(mesh)
        let node = Node.from({ mesh: this.meshes.indexOf(mesh) })
        this.nodes.push(node)
        this.nodes[0].children.push(this.nodes.indexOf(node))
    }

    // 坐标轴
    axis(s = 10) {
        let vectors = this.append_data('bin', [
            [0, 0, 0], [s, 0, 0],
            [0, 0, 0], [0, s, 0],
            [0, 0, 0], [0, 0, s]
        ], FLOAT, VEC3, ARRAY_BUFFER)
        let color = this.append_data('bin', [
            [0, 0, 1], [0.3, 0, 0],
            [1, 0, 0], [0, 0.3, 0],
            [0, 1, 0], [0, 0, 0.3]
        ], FLOAT, VEC3, ARRAY_BUFFER)


        let mesh = Mesh.from({
            primitives: [
                Primitive.from({
                    attributes: new Attributes({
                        POSITION: vectors,
                        COLOR_0: color
                    }),
                    mode: LINE_LOOP
                })
            ],
        })


        this.meshes.push(mesh)
        let node = Node.from({ mesh: this.meshes.indexOf(mesh), name: 'axis' })
        this.nodes.push(node)
        this.nodes[0].children.push(this.nodes.indexOf(node))
    }
}

class GLB {
    constructor(buf) {
        let cus = 0
        let magic = buf.subarray(cus, cus + 4).toString() //0,4
        let version = buf.readUint32LE(cus += 4) //4-7
        let length = buf.readUint32LE(cus += 4) //8-11

        let c0_length = buf.readUint32LE(cus += 4)// 12-15
        let c0_type = buf.readUint32LE(cus += 4).toString(16) //16-19, 0x4E4F534A
        let c0_data = buf.subarray(cus += 4, cus += c0_length)// 20~(20+len)
        this.chunk0 = JSON.parse(c0_data.toString())

        let c1_length = buf.readUint32LE(cus)
        let c1_type = buf.readUint32LE(cus += 4).toString(16) // 0x004E4942	
        let chunk1 = buf.subarray(cus += 4, cus += c1_length) // buf.subarray(cus+4) if no others
        this.chunks = [chunk1]
        // ... other chunks

    }

    // 解析accessors，用于debug
    get_arr_by_accessor(index) {
        let acc = this.chunk0.accessors[index]
        let acc_off = acc.byteOffset ? acc.byteOffset : 0

        let itemCount = _type[acc.type]
        let typeLen = _typeLen[`${acc.componentType}`].len
        let _fuc = _typeLen[`${acc.componentType}`].convt

        let bufView = this.chunk0.bufferViews[acc.bufferView]
        let bv_off = bufView.byteOffset ? bufView.byteOffset : 0

        let _off = acc_off + bv_off

        // 同类数据有交错，则使用交错，无交错则使用实际占位
        let _step = bufView.byteStride ? bufView.byteStride : (itemCount * typeLen)

        let buf = this.chunks[bufView.buffer]
        let res = []

        for (let i = 0; i < acc.count; i++) {
            let cus = i * _step + _off
            let items = []
            for (let j = 0; j < itemCount; j++) {
                let item = buf[_fuc](cus)
                items.push(item)
                cus += typeLen
            }
            res.push(items)
        }
        // 34962  # eg vertex data
        // 34963  # eg index data
        return bufView.target == 34962 ? res : res.flat()
    }
}

class PrimitiveHelper {
    constructor(args = {}) {
        this.vectors = args.vectors || []
        this.normals = args.normals || []
        this.indices = args.indices || []
        this.color = args.color || []
        this.texcoord_0 = args.texcoord_0 || []
        this.batchid = args.batchid || []
        this.name = 'batch'
    }

    add(other) {
        if (other) {
            this.indices.push(...math.add(other.indices, this.vectors.length))
            this.vectors.push(...other.vectors)
            this.normals.push(...other.normals)
            this.color.push(...other.color)
            this.batchid.push(...other.batchid)
        }
    }

    offset(vec) {
        this.vectors = this.vectors.map(v => math.add(v, vec))
    }

    // matrix: 3x3旋转矩阵
    rotation(matrix) {
        let m = math.resize(matrix, [3, 3])
        this.vectors = this.vectors.map(v => math.multiply(v, m))
        this.normals = this.normals.map(n => math.multiply(n, m))
    }

    aabb() {
        return [
            math.min(this.vectors, 0),
            math.max(this.vectors, 0)
        ]
    }

    destroy() {
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                this[key] = null
            }
        }
    }
}

module.exports = {
    Asset, Attributes, Primitive, Mesh, AccessorSparseIndices,
    AccessorSparseValues, Sparse, Accessor, BufferView, Buffer,
    Perspective, Orthographic, TextureInfo, OcclusionTextureInfo,
    NormalMaterialTexture, PbrMetallicRoughness, Material, Sampler,
    Node, Skin, Scene, Texture, Image, AnimationChannelTarget, PrimitiveHelper,
    AnimationSampler, AnimationChannel, Animation, GLTF, GLB, Camera,
    BYTE, UNSIGNED_BYTE, SHORT, UNSIGNED_SHORT, UNSIGNED_INT, FLOAT,
    SCALAR, VEC2, VEC3, VEC4, MAT2, MAT3, MAT4,
    POINTS, LINES, LINE_LOOP, LINE_STRIP, TRIANGLES, TRIANGLE_STRIP, TRIANGLE_FAN,
    ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER,
    YUPTOZUP
}