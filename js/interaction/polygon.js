class Polygon {
  constructor(vertices) {
    this.vertices = vertices
    this.color = colors.hitbox.no_collision
  }
  rotate(rotation) {
    this.vertices.forEach(vertex => {
      let newPos = vectorRotate(vertex.x , vertex.y, rotation)
      vertex.x = newPos.x
      vertex.y = newPos.y
    })
  }
}