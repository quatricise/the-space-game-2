class PolygonBuilder {
  static TriangleRight(dim = {x: 100, y: 100}, offset = {x: 0, y: 0}, flipHorizontal = false, flipVertical = false, rotationDeg = 0 ) {
    let rotation = rotationDeg * PI/180
    let pivot = {x: dim.x/2, y: dim.y/2}
    let vertices = [
      {x: 0, y: 0},
      {x: dim.x, y: dim.y},
      {x: 0 , y: dim.y},
    ]
    if(flipHorizontal) {
      vertices.forEach((vertex) => {
        let offset = pivot.x - vertex.x
        vertex.x += offset*2
      })
    }
    if(flipVertical) {
      vertices.forEach((vertex) => {
        let offset = pivot.y - vertex.y
        vertex.y += offset*2
      })
    }
    this.rotateVertices(vertices, rotation)
    this.offsetVertices(vertices, offset)
    return new Polygon(vertices)
  }
  static Rectangle(a, b, offset = {x: 0, y: 0}, rotationDeg = 0) {
    let rotation = rotationDeg * PI/180
    let vertices = [
      {x: 0, y: 0},
      {x: a, y: 0},
      {x: a , y: b},
      {x: 0 , y: b},
    ]
    this.rotateVertices(vertices, rotation)
    this.offsetVertices(vertices, offset)
    return new Polygon(vertices)
  }
  static Square(a, offset = {x: 0, y: 0}, rotationDeg = 0) {
    let rotation = rotationDeg * PI/180
    let vertices = [
      {x: 0, y: 0},
      {x: a, y: 0},
      {x: a , y: a},
      {x: 0 , y: a},
    ]
    this.rotateVertices(vertices, rotation)
    this.offsetVertices(vertices, offset)
    return new Polygon(vertices)
  }
  static Polygon(edgeCount, dimensions = { x: 100, y: 100 }, offset = {x: 0, y: 0}, rotationDeg = 0) {

  }
  static Trapezoid(a, b, skewFactor, skewMidpoint, offset = {x: 0, y: 0}, rotationDeg = 0) {
    //skew midpoint is the point along the top edge that the edge will be scaled towards

  }
  static Custom(vertices = [{x:0, y:0}], offset = {x: 0, y: 0}, rotationDeg = 0) {

  }
}
