class Hitbox extends Component {
  constructor(gameObject, color) {
    super(gameObject)
    this.color = color || colors.hitbox.noCollision
  }
  update() {
    
  }
  //#region static draw methods
  static draw(object, graphics) {
    if(!visible.hitbox) 
      return
    if(!object.hitbox) 
      return

    let color = object.hitbox.color

    if(object instanceof Interactable) 
      color = colors.hitbox.interactable
    if(object.triggered) 
      color = colors.hitbox.collision
    if(object.hitbox.type === "circle") {
      graphics.lineStyle(2, color, 1);
      graphics.drawCircle(
        object.transform.position.x, 
        object.transform.position.y, 
        object.hitbox.radius
      )
      graphics.closePath();
    }
    if(object.hitbox.type === "polygon") {
      let hitbox = object.hitbox
      hitbox.bodies.forEach((body) => {
        this.drawPolygon(body, graphics)
      }) 
    }
    if(object.hitbox.type === "box") {
      let box = object.hitbox
      let pos = object.transform.position
      
     graphics.lineStyle(2, color, 1);
     graphics.drawRect(
        pos.x - box.w/2, 
        pos.y - box.h/2, 
        box.w, 
        box.h
      )
      graphics.closePath()
    }
  }
  static drawProjections(obj, graphics) {
    if(!visible.projections) 
      return
    if(!obj.projections) 
      return
    obj.projections.forEach(box => {
      graphics.lineStyle(2, colors.hitbox.projection, 1)
      graphics.drawRect(
        box.x, 
        box.y, 
        box.w, 
        box.h
      )
    })
  }
  static drawPolygon(body, graphics) {
    let color = body.color
        graphics.lineStyle(2, color, 1);
        body.vertices.forEach((vertex, index) => {
          graphics.moveTo(vertex.x, vertex.y);
          
          if(index === body.vertices.length - 1)
          graphics.lineTo(body.vertices[0].x, body.vertices[0].y);
          else
          graphics.lineTo(body.vertices[index + 1].x, body.vertices[index + 1].y);
        })
      graphics.closePath();
  }
  static drawBoundingBox(object, graphics) {
    let bb = object.hitbox.boundingBox
    graphics.lineStyle(2, 0x0011dd, 1);
    graphics.drawRect(bb.x, bb.y, bb.w, bb.h)
  }
  //#endregion

  //#region static update methods
  static updatePolygonHitbox(object) {
    //resets position to the hitbox definition
    object.hitbox.bodies.forEach((body, b) => {
      body.vertices.forEach((vertex, v) => {
        vertex.x = object.transform.position.x + object.hitbox.definition[b].vertices[v].x
        vertex.y = object.transform.position.y + object.hitbox.definition[b].vertices[v].y
      })
    })
    //rotate and return to the object's position
    object.hitbox.bodies.forEach((body, b) => {
      body.vertices.forEach((vertex, v) => {
        vertex.x = object.hitbox.definition[b].vertices[v].x
        vertex.y = object.hitbox.definition[b].vertices[v].y
      })
      body.rotate(-object.transform.rotation)
      body.vertices.forEach(vertex=> {
        vertex.x += object.transform.position.x
        vertex.y += object.transform.position.y
      })
    })
  }
  //#endregion
}

class CircleHitbox extends Hitbox {
  constructor(radius, color) {
    super(color)
    this.type = "circle"
    this.radius = radius
  }
  get boundingBox() {
    return new BoundingBox(
      this.transform.position.x - this.radius,
      this.transform.position.y - this.radius,
      this.radius * 2,
      this.radius * 2,
    )
  }
}

class PolygonHitbox extends Hitbox {
  constructor(bodies, color) {
    super(color)
    this.type = "polygon"
    this.bodies = bodies
    this.definition = _.cloneDeep(this.bodies)
  }
  update() {
    Hitbox.updatePolygonHitbox(this.gameObject)
  }
  get boundingBox() {
    let arrayX = []
    let arrayY = []
    this.bodies.forEach(body => {
      body.vertices.forEach(vert => {
        arrayX.push(vert.x)
        arrayY.push(vert.y)
      })
    })
    let left = Math.min(...arrayX)
    let top  = Math.min(...arrayY)
    let right = Math.max(...arrayX) - left
    let bottom = Math.max(...arrayY) - top
    return new BoundingBox(
      left,
      top,
      right,
      bottom,
    )
  }
  static default() {
    return new PolygonHitbox([
      PolygonBuilder.Square(50, {x: -25, y: -25})
    ])
  }
}

class BoxHitbox extends Hitbox {
  constructor(a, b, color) {
    super(color)
    this.type = "box"
    this.w = a
    this.h = b
  }
  get boundingBox() {
    return new BoundingBox(
      this.transform.position.x - this.w/2,
      this.transform.position.y - this.h/2,
      this.w,
      this.h
    )
  }
  static default() {
    return new BoxHitbox(50, 50)
  }
}

class BoundingBox {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
}
