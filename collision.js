class CircleHitbox {
  constructor(radius, color = debug.colors.hitbox_no_collision) {
    this.type = "circle"
    this.color = color
    this.pos = new Vector(0,0)
    this.radius = radius
    this.tested = false
  }
  get bb() {
    return {
      x: this.pos.x - this.radius,
      y: this.pos.y - this.radius,
      w: this.radius * 2,
      h: this.radius * 2,
    }
  }
}

class PolygonHitbox {
  constructor(bodies, color = debug.colors.hitbox_no_collision) {
    this.type = "polygon"
    this.color = color
    this.bodies = bodies
    this.tested = false
  }
  get bb() {
    let xs = []
    let ys = []
    this.bodies.forEach(body => {
      body.vertices.forEach(vert => {
        xs.push(vert.x)
        ys.push(vert.y)
      })
    })
    let left = Math.min(...xs)
    let top  = Math.min(...ys)
    let right = Math.max(...xs) - left
    let bottom = Math.max(...ys) - top
    return {
      x: left,
      y: top,
      w: right,
      h: bottom,
    }
  }
  static default() {
    let hitbox = new PolygonHitbox([
      PolygonBuilder.Square(50, {x: -25, y: -25})
    ])
    return hitbox
  }
}
class BoxHitbox {
  constructor(a, b, color = debug.colors.hitbox_no_collision) {
    this.type = "box"
    this.color = color
    this.pos = new Vector(0,0)
    this.w = a
    this.h = b
    this.tested = false
  }
  get bb() {
    return {
      x: this.pos.x - this.w/2,
      y: this.pos.y - this.h/2,
      w: this.w,
      h: this.h
    }
  }
}

class Polygon {
  constructor(vertices) {
    this.vertices = vertices
    this.color = debug.colors.hitbox_no_collision
  }
  rotate(rotation) {
    this.vertices.forEach(vertex => {
      let newPos = vectorRotate(vertex.x , vertex.y, rotation)
      vertex.x = newPos.x
      vertex.y = newPos.y
    })
  }
}

class PolygonBuilder {
  //where the center of rotation is somewhere, ffs, but i don't know where
  static Triangle_right(dim = {x: 100, y: 100}, offset = {x: 0, y: 0}, flipHorizontal = false, flipVertical = false, rotationDeg = 0 ) { //rotation in deg
    let rotation = rotationDeg * PI/180
    let pivot = {x: dim.x/2, y: dim.y/2}
    let vertices = [
      {x: 0, y: 0},
      {x: dim.x, y: dim.y},
      {x: 0 , y: dim.y},
    ]
    if(flipHorizontal)
    vertices.forEach((vertex) => {
      let offset = pivot.x - vertex.x
      vertex.x += offset*2
    })

    if(flipVertical)
    vertices.forEach((vertex) => {
      let offset = pivot.y - vertex.y
      vertex.y += offset*2
    })

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
  static Polygon(edge_count, dimensions = { x: 100, y: 100 }, offset = {x: 0, y: 0}, rotationDeg = 0) {

  }
  static Trapezoid(a, b, skew_factor, skew_midpoint, offset = {x: 0, y: 0}, rotationDeg = 0) {
    //skew midpoint is the point along the top edge that the edge will be scaled towards

  }
  static Custom(vertices = [{x:0, y:0}], offset = {x: 0, y: 0}, rotationDeg = 0) {

  }
  static rotateVertices(vertices, rotation) {
    vertices.forEach((vertex) => {
      let newPos = vectorRotate(vertex.x, vertex.y, rotation)
      vertex.x = newPos.x
      vertex.y = newPos.y //this works
    })
  }
  static offsetVertices(vertices, offset) {
    vertices.forEach((vertex) => {   
      vertex.x += offset.x
      vertex.y += offset.y
    })
  }
}


class Collision {
  static broadphaseFilter(entity) {
    return rigids.filter( candidate => 
      candidate.cell_pos.x >= entity.cell_pos.x - 1 &&
      candidate.cell_pos.x <= entity.cell_pos.x + 1 &&
      candidate.cell_pos.y >= entity.cell_pos.y - 1 &&
      candidate.cell_pos.y <= entity.cell_pos.y + 1 &&
      candidate !== entity &&
      candidate.hitbox.tested === false // should make sure that the candidate isn't one of the already fully tested objects
    )
  }
  static auto(h1, h2) {
    let collided = false
    let checked_bodies = []
    if(h1.type === "polygon" && h2.type === "polygon") {
      h1.bodies.forEach(b1=> {
        if(collided) return
        if(checked_bodies.find(b => b === b1)) return
        h2.bodies.forEach(b2 => {
          if(collided) return
          if(checked_bodies.find(b => b === b2)) return
          if(Collision.polygonPolygon(b1, b2)) {
            collided = true
          }
          checked_bodies.push(b2)
        })
        checked_bodies.push(b1)
      })
      return collided
    }
  }
  static lineCircle(line = [], circle) {
    return Intersects.lineCircle(line[0].x, line[0].y, line[1].x, line[1].y, circle.pos.x, circle.pos.y, circle.radius)
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
      if(Collision.linePolygon(line, body)) collided = true
    })
    return collided
  }
  static polygonHitboxPolygonHitbox(hitbox1, hitbox2) {
    let collided = false
    let checked_bodies = []
      hitbox1.bodies.forEach(body1 => {
        hitbox2.bodies.forEach(body2 => {
          if(checked_bodies.find(body => body === body2)) return
          if(Collision.polygonPolygon(body1, body2)) collided = true
        })
        checked_bodies.push(body1)
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
      circle.pos.x,
      circle.pos.y,
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
      circle1.pos.x, circle1.pos.y, circle1.radius,
      circle2.pos.x, circle2.pos.y, circle2.radius,
    )
  }
  static pointCircle(point, circle) {
    return Intersects.pointCircle(
      point.x, point.y,
      circle.pos.x, circle.pos.y, circle.radius
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

class HitboxTools {
  static drawPolygon(body) {
    let color = body.color
        ui.windows.active.graphics.lineStyle(2, color, 1);
        body.vertices.forEach((vertex, index) => {
          ui.windows.active.graphics.moveTo(vertex.x, vertex.y);
          
          if(index === body.vertices.length - 1)
          ui.windows.active.graphics.lineTo(body.vertices[0].x, body.vertices[0].y);
          else
          ui.windows.active.graphics.lineTo(body.vertices[index + 1].x, body.vertices[index + 1].y);
        })
      ui.windows.active.graphics.closePath();
  }
  static drawHitbox(entity) {
    if(!visible.hitbox) return
    let color = entity.hitbox.color
    if(entity.hitbox.type === "circle") {
      ui.windows.active.graphics.lineStyle(2, color, 1);
      ui.windows.active.graphics.drawCircle(entity.pos.x, entity.pos.y, entity.hitbox.radius)
      ui.windows.active.graphics.closePath();
    }
    if(entity.hitbox.type === "polygon") {
      
      let hitbox = entity.hitbox
      hitbox.bodies.forEach((body) => {
        this.drawPolygon(body)
      })
    }
    if(entity.hitbox.type === "box") {
      let box = entity.hitbox
      let pos = entity.pos
      
      ui.windows.active.graphics.lineStyle(2, color, 1);
      ui.windows.active.graphics.drawRect(
        pos.x - box.w/2, 
        pos.y - box.h/2, 
        box.w, 
        box.h
      )
      ui.windows.active.graphics.closePath()
    }
  }
  static draw_bounding_box(entity) {
    let bb = entity.hitbox.bb
    ui.windows.active.graphics.lineStyle(2, 0x0011dd, 1);
    ui.windows.active.graphics.drawRect(bb.x, bb.y, bb.w, bb.h)
  }
  static rotatePolygonHitbox(entity) {
    entity.hitbox.bodies.forEach((body, b) => {
      body.vertices.forEach((vertex, v) => {
        vertex.x = entity.hitbox_relative.bodies[b].vertices[v].x
        vertex.y = entity.hitbox_relative.bodies[b].vertices[v].y
      })
      body.rotate(-entity.rotation)
      body.vertices.forEach(vertex=> {
        vertex.x += entity.pos.x
        vertex.y += entity.pos.y
      })
    })
  }
  static updatePolygonHitbox(entity) {
    entity.hitbox.bodies.forEach((body, b) => {
      body.vertices.forEach((vertex, v) => {
        vertex.x = entity.pos.x + entity.hitbox_relative.bodies[b].vertices[v].x
        vertex.y = entity.pos.y + entity.hitbox_relative.bodies[b].vertices[v].y
      })
    })
  }
  static updateHitbox(entity) {
    if(!entity.hitbox) return
    if(entity.hitbox.type === "circle") {
      // entity.hitbox.pos.x = entity.pos.x
      // entity.hitbox.pos.y = entity.pos.y
      entity.hitbox.pos.set_from(entity.pos)
    }
    if(entity.hitbox.type === "box") {
      entity.hitbox.pos.set_from(entity.pos)
      // entity.hitbox.pos.x = entity.pos.x
      // entity.hitbox.pos.y = entity.pos.y
    }
    if(entity.hitbox.type === "polygon") {
      this.updatePolygonHitbox(entity)
      this.rotatePolygonHitbox(entity)
    }
    if(entity.collided) {
      entity.hitbox.color = debug.colors.hitbox_collision
    }
    else {
      entity.hitbox.color = debug.colors.hitbox_no_collision
    }
  }
}


function testCollision() { 
  let total = 0
  let number_of_checks = 0
  rigids.forEach(rigid => {
    rigid.collided = false
    rigid.collided_with = null
  })
  rigids.forEach(rigid => {
    //broadphase
    let candidates = Collision.broadphaseFilter(rigid) 

    //second phase
    candidates.forEach(candidate => {
      //temporary variable for one iteration of the forEach loop
      let collided = false
      number_of_checks++
      if(rigid.vwb || candidate.vwb) return

      //circle x circle
      if(rigid.hitbox.type === "circle" && candidate.hitbox.type === "circle") {
        let circle1 = {
          pos: {
            x: rigid.pos.x,
            y: rigid.pos.y,
          },
          radius: rigid.hitbox.radius
        }
        let circle2 = {
          pos: {
            x: candidate.pos.x,
            y: candidate.pos.y,
          },
          radius: candidate.hitbox.radius
        }
        if(Collision.circleCircle(circle1, circle2)) {
          collided = true
          total++
        }
      }
      else
      //circle x polygon
      if(
        (rigid.hitbox.type === "polygon" && candidate.hitbox.type === "circle") 
        ||
        (rigid.hitbox.type === "circle" && candidate.hitbox.type === "polygon") 
      ) {
        let circular = candidate
        let polygonal = rigid
        if(rigid.hitbox.type === "circle") {
          circular = rigid
          polygonal = candidate
        }
        polygonal.hitbox.bodies.forEach(body => {
          if(Collision.polygonCircle(body, circular.hitbox)) {
            collided = true
            total++
          }
        })
      }
      else
      //polygon x polygon
      if(rigid.hitbox.type === "polygon" && candidate.hitbox.type === "polygon") {
        if(Collision.polygonHitboxPolygonHitbox(rigid.hitbox, candidate.hitbox)) {
          collided = true
          total++
        }
      }
      //if any test has been successful, mark both as collided
      if(collided) {
        rigid.collided = candidate.collided = true
        rigid.collided_with = candidate
        candidate.collided_with = rigid
      }
    })
    //rule out duplicit collision checks by marking the current object as tested
    rigid.hitbox.tested = true
  })
  rigids.forEach(rigid => {rigid.hitbox.tested = false})
  if(debug.hitbox) console.log("number of checks/s: " + number_of_checks)

  //proto laser code
  lasers.forEach(laser => {
    if(laser.find(v => v.data.hit === true)) return
    rigids.forEach(rigid => {
      if(laser.find(v => v.data.hit === true)) return
      if(rigid === laser[0].data.owner) return
      let hit = false
      if(rigid.hitbox.type === "circle" && Collision.lineCircle(laser, rigid.hitbox)) hit = true
      if(rigid.hitbox.type === "polygon" && Collision.linePolygonHitbox(laser, rigid.hitbox)) hit = true
      if(hit) {
        let distance = laser[0].distance(rigid.pos)
        let length = laser[0].distance(laser[1])
        let diff = laser[1].clone().sub(laser[0])
        diff.mult(distance/length)
        laser[1] = laser[0].clone().add(diff)
        
        laser.forEach(v => v.data.hit = true)
        if(rigid instanceof Ship) rigid.hull_damage()
        if(rigid instanceof Asteroid) {
          let angle = Math.atan2(laser[1].y - laser[0].y, laser[1].x - laser[0].x)
          let angle2 = Math.atan2(rigid.pos.y - laser[0].y, rigid.pos.x - laser[0].x)
          if(angle < angle2) rigid.rotation_velocity += PI * (angle2 - angle)
          if(angle > angle2) rigid.rotation_velocity -= PI * (angle - angle2)

          rigid.vel.add(Vector.fromAngle(angle).mult(3))
        }
      }
    })
  })
  //test player inside interactable objects
  interactables.forEach(interactable => {
    if(interactable.hitbox.type === "box") {
      if(Collision.boxPoint(interactable.hitbox.bb, player.ship.pos)) {
        interactable.enter()
      }
      else {
        interactable.leave()
      }
    }
  })
  Q('#collision-count').innerText = total
}

function solveCollision() {
  //prototype projectile code
  rigids.forEach(rigid => {
    if(!rigid.collided) return
    if(rigid instanceof Ship && rigid.collided_with instanceof Projectile) {
      if(rigid.collided_with.owner === rigid) return
      rigid.hull_damage()
      rigid.collided_with.destroy()
    }
    if(rigid instanceof Asteroid && rigid.collided_with instanceof Projectile) {
      rigid.collided_with.destroy()
    }
  })
  //collision damage
  rigids.forEach(rigid => {
    if(!rigid.collided) return
    if(rigid instanceof Ship && (
      rigid.collided_with instanceof Asteroid || 
      rigid.collided_with instanceof Ship
    )) {
      rigid.hull_damage()
    }
  })
  //physics solver
  rigids.forEach(rigid => {
    if(!rigid.collided) return
    if(rigid instanceof Projectile) return
    if(rigid.collided_with instanceof Projectile && rigid.collided_with.owner === rigid) return
    let rigid2 = rigid.collided_with

    let vel = rigid.vel.clone()
    let vel2 = rigid2.vel.clone()
    let result = vel.add(vel2)

    rigid.vel
    .set(result.x, result.y)
    .mult( 0.5)

    rigid2.vel
    .set(result.x, result.y)
    .mult( 0.5)

    //approach 2

    // let mass_total = rigid.mass + rigid2.mass
    // let step = 1/mass_total
    // let fac1 = step * rigid.mass
    // let fac2 = step * rigid2.mass

    // rigid.vel
    // .set(result.x, result.y)
    // .mult( fac1)

    // rigid2.vel
    // .set(result.x, result.y)
    // .mult( fac2)

    //approach 3
    // let add1 = rigid2.  vel.clone().mult(fac2)
    // let add2 = rigid.   vel.clone().mult(fac1)

    // rigid.vel.add(add1)
    // rigid2.vel.add(add2)

    rigid.collided = false
    rigid2.collided = false
  })
}