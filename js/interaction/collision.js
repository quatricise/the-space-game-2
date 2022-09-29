class Collision {
  static broadphase(world, tested) {
    //it is only assumed that we are testing the entity against the same gameWorld it inhabits
    return world.gameObjects.rigid.filter(
      rigid => 
      rigid.transform.cellPosition.x >= tested.transform.cellPosition.x - 1 &&
      rigid.transform.cellPosition.x <= tested.transform.cellPosition.x + 1 &&
      rigid.transform.cellPosition.y >= tested.transform.cellPosition.y - 1 &&
      rigid.transform.cellPosition.y <= tested.transform.cellPosition.y + 1 &&
      rigid !== tested
    )
  }
  static auto(h1, h2) {
    if(typeof h1 !== "object" || typeof h2 !== "object") return
    if(h1.type === "polygon" && h2.type === "polygon")  return this.polygonHitboxPolygonHitbox(h1, h2)
    if(h1.type === "polygon" && h2.type === "circle")   return this.polygonHitboxCircle(h1, h2)
    if(h1.type === "circle" && h2.type === "polygon")   return this.polygonHitboxCircle(h2, h1)
    if(h1.type === "circle" && h2.type === "circle")    return this.circleCircle(h1, h2)
    if(h1 instanceof Vector) {
      console.log(h1, h2)
      if(h2.type === "polygon") return this.polygonHitboxPoint(h2, h1)
      if(h2.type === "circle") return this.pointCircle(h1, h2)
    }
    if(h2 instanceof Vector) {
      console.log(h1, h2)
      if(h1.type === "polygon") return this.polygonHitboxPoint(h1, h2)
      if(h1.type === "circle") return this.pointCircle(h2, h1)
    }
  }
  static lineCircle(line = [], circle) {
    return Intersects.lineCircle(line[0].x, line[0].y, line[1].x, line[1].y, circle.transform.position.x, circle.transform.position.y, circle.radius)
  }
  static linePolygon(line = [], polygon) {
    let verts = []
    polygon.vertices.forEach((vertex)=> {
      verts.push(vertex.x)
      verts.push(vertex.y)
    })
    let tolerance = 0
    return Intersects.linePolygon(line[0].x, line[0].y, line[1].x, line[1].y, verts, tolerance)
  }
  static linePolygonHitbox(line = [], hitbox) {
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.linePolygon(line, body)) collided = true
    })
    return collided
  }
  static polygonHitboxPolygonHitbox(hitbox1, hitbox2) {
    let collided = false
    let checkedBodies = []
      hitbox1.bodies.forEach(body1 => {
        hitbox2.bodies.forEach(body2 => {
          if(checkedBodies.find(body => body === body2)) return
          if(this.polygonPolygon(body1, body2)) collided = true
        })
        checkedBodies.push(body1)
    })
    return collided
  }
  static polygonHitboxPoint(hitbox, point) {
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.polygonPoint(body, point)) collided = true
    })
    return collided
  }
  static polygonHitboxCircle(hitbox, circle) {
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.polygonCircle(body, circle)) collided = true
    })
    return collided
  }
  static polygonCircle(polygon, circle) {
    let verts = []
    polygon.vertices.forEach((vertex)=> {
      verts.push(vertex.x)
      verts.push(vertex.y)
    })
    return Intersects.polygonCircle(
      verts,
      circle.transform.position.x,
      circle.transform.position.y,
      circle.radius,
    )
  }
  static polygonPoint(polygon, point) {
    let verts = []
    polygon.vertices.forEach((vertex)=> {
      verts.push(vertex.x)
      verts.push(vertex.y)
    })
    return Intersects.polygonPoint(
      verts,
      point.x,
      point.y,
    )
  }
  static polygonPolygon(polygon1, polygon2) {
    let verts1 = []
    let verts2 = []
    polygon1.vertices.forEach(vert=> {
      verts1.push(vert.x)
      verts1.push(vert.y)
    })
    polygon2.vertices.forEach(vert=> {
      verts2.push(vert.x)
      verts2.push(vert.y)
    })
    return Intersects.polygonPolygon(
      verts1,
      verts2,
    )
  }
  static circleCircle(circle1, circle2) {
    return Intersects.circleCircle(
      circle1.transform.position.x, circle1.transform.position.y, circle1.radius,
      circle2.transform.position.x, circle2.transform.position.y, circle2.radius,
    )
  }
  static pointCircle(point, circle) {
    return Intersects.pointCircle(
      point.x, point.y,
      circle.transform.position.x, circle.transform.position.y, circle.radius
    )
  }
  static boxBox(box1, box2) {
    return Intersects.boxBox(
      box1.x, box1.y, box1.w, box1.h, 
      box2.x, box2.y, box2.w, box2.h 
    )
  }
  static boxPoint(box, point) {
    return Intersects.boxPoint(
      box.x, box.y, box.w, box.h, 
      point.x, point.y
    )
  }
}