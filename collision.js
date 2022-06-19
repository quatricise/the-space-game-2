class CircleHitbox {
  constructor(radius, color = debug.colors.hitbox_no_collision) {
    this.type = "circle"
    this.color = color
    this.pos = new Vector(0,0)
    this.radius = radius
    this.tested = false
  }
}

class PolygonHitbox {
  constructor(bodies, color = debug.colors.hitbox_no_collision) {
    this.type = "polygon"
    this.color = color
    this.bodies = bodies
    this.tested = false
  }
}
class BoxHitbox {
  constructor(a, b, color = debug.colors.hitbox_no_collision) {
    this.type = "box"
    this.color = color
    this.pos = new Vector(0,0)
    this.dim = {
      x: a,
      y: b
    }
    this.tested = false
  }
}

class Polygon {
  constructor(vertices) {
    this.vertices = vertices
    this.edges = this.buildEdges(vertices)
    this.color = debug.colors.hitbox_no_collision
  }
  rotate(rotation) {
    this.vertices.forEach(vertex => {
      let newPos = vectorRotate(vertex.x , vertex.y, rotation)
      vertex.x = newPos.x
      vertex.y = newPos.y
    })
    this.edges = this.buildEdges()
  }
  buildEdges() {
    return
    let edges = [];
    let vertices = this.vertices
    if (vertices.length < 3) {
      console.error("Your shape has less than 3 vertices.");
      return
    }
    for (let i = 0; i < vertices.length; i++) {
        const a = vertices[i];
        let b = vertices[0];
        if (i + 1 < vertices.length) {
            b = vertices[i + 1];
        }
        edges.push({
            x: (b.x - a.x),
            y: (b.y - a.y),
        });
    }
    this.edges = edges
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
      candidate.hitbox.tested === false // should make sure that the candidate isn't one of the already fully tested objects
    )
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
      circle.x, circle.y, circle.radius
    )
  }
  static boxBox(box1, box2) {
    return Intersects.boxBox(
      box1.x, box1.y, box1.dim.x, box1.dim.y, 
      box2.x, box2.y, box2.dim.x, box2.dim.y 
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
        pos.x - box.dim.x/2, 
        pos.y - box.dim.y/2, 
        box.dim.x, 
        box.dim.y
      )
      ui.windows.active.graphics.closePath()
    }
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
      body.edges = body.buildEdges()
    })
  }
  static updateHitbox(entity) {
    if(!entity.hitbox) return
    if(entity.hitbox.type === "circle") {
      entity.hitbox.pos.x = entity.pos.x
      entity.hitbox.pos.y = entity.pos.y
    }
    if(entity.hitbox.type === "box") {
      entity.hitbox.pos.x = entity.pos.x
      entity.hitbox.pos.y = entity.pos.y
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
      //rule out self-collision
      if(candidate === rigid) return

      //temporary variable for one iteration of the forEach loop
      let collided = false
      
      number_of_checks++

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
        let checked_bodies = []
        rigid.hitbox.bodies.forEach(r_body => {
          candidate.hitbox.bodies.forEach(c_body => {
            if(checked_bodies.find(body => body === c_body)) return
            if(Collision.polygonPolygon(r_body, c_body)) {
              collided = true
              total++
            }
          })
          checked_bodies.push(r_body)
        })
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

  
  //reset the tested property for the next iteration of testCollision()
  rigids.forEach(rigid => {rigid.hitbox.tested = false})
  if(debug.hitbox) console.log("number of checks/s: " + number_of_checks)

  //test player inside interactable objects
  interactables.forEach(interactable => {
    if(interactable.hitbox.type === "box") {
      let box = {
        x: interactable.pos.x - interactable.hitbox.dim.x/2,
        y: interactable.pos.y - interactable.hitbox.dim.y/2,
        w: interactable.hitbox.dim.x,
        h: interactable.hitbox.dim.y,
      }
      if(Collision.boxPoint(box, player.ship.pos)) {
        interactable.trigger()
      }
      else {
        interactable.playerInside = false
      }
    }
  })
  Q('#collision-count').innerText = total
}

function solveCollision() {
  
}