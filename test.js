const { GLTF, Asset, PrimitiveHelper } = require('./gltfLib')
const gltf = new GLTF(new Asset())

const vectors = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]]
const normals = [[0, 0, 1], [0, 0, 1], [0, 0, 1], [0, 0, 1]]
const indices = [0, 1, 3, 2, 3, 1]

// top
let top = new PrimitiveHelper({ vectors, indices, normals })
top.offset([0, 0, 1])
top.color = Array(4).fill([0, 0.5, 1])
gltf.referenceGeometry(top, "sub_bin")
top.destroy()

// bottom
let bottom = new PrimitiveHelper({ vectors, indices, normals })
bottom.rotation([[0, 1, 0], [1, 0, 0], [0, 0, -1]])
bottom.color = Array(4).fill([1, 1, 0.5])
gltf.referenceGeometry(bottom, "sub_bin")
bottom.destroy()

// east
let east = new PrimitiveHelper({ vectors, indices, normals })
east.offset([0, 0, 1])
east.rotation([[0, 1, 0], [0, 0, 1], [1, 0, 0]])
east.color = Array(4).fill([1, 0.5, 0.5])
gltf.referenceGeometry(east, "sub_bin")
east.destroy()

// west
let west = new PrimitiveHelper({ vectors, indices, normals })
west.rotation([[0, -1, 0], [0, 0, 1], [-1, 0, 0]])
west.offset([0, 1, 0])
west.color = Array(4).fill([0.4, 0.8, 0.2])
gltf.referenceGeometry(west, "sub_bin")
west.destroy()

// north
let north = new PrimitiveHelper({ vectors, indices, normals })
north.rotation([[-1, 0, 0], [0, 0, 1], [0, 1, 0]])
north.offset([1, 1, 0])
north.color = Array(4).fill([1, 0.8, 1])
gltf.referenceGeometry(north, "sub_bin")
north.destroy()

// south
let south = new PrimitiveHelper({ vectors, indices, normals })
south.rotation([[1, 0, 0], [0, 0, 1], [0, -1, 0]])
south.color = Array(4).fill([0.4, 1, 1])
gltf.referenceGeometry(south, "sub_bin")
south.destroy()


// gltf
gltf.zup()
gltf.axis(6)
gltf.save('test_output/test.gltf')
gltf.destroy()
