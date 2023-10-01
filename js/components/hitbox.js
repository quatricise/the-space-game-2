class Hitbox extends Component {
  constructor(gameObject, color) {
    super(gameObject)
    if(!gameObject) 
      console.error("hitbox must have a reference to its gameobject: ", this)
    this.color = color || colors.hitbox.noCollision
    this.projections = []
    this.timers = new Timer(
      ["project", 500, {loop: true, active: true, onfinish: this.projectPosition.bind(this)}]
    )
  }
  projectPosition() {
    this.projections = []
    let boundingBox = this.boundingBox
    let iterations = data.pathfinding.projection.iterations
    let timestretch = data.pathfinding.projection.timestretch
    for (let i = 0; i < iterations; i++) {
      let offsetPerIteration = this.gameObject.transform.velocity.clone()
      .mult(timestretch)
      .mult(dt)

      boundingBox.x += offsetPerIteration.x
      boundingBox.y += offsetPerIteration.y
      this.projections.push(_.cloneDeep(boundingBox))
    }
  }
  projectPositionInDifferentAngle(gameObjectRotationOffset, velocity = this.gameObject.transform.velocity) {
    let projections = []
    let boundingBox = this.boundingBox
    let iterations = data.pathfinding.projection.iterations
    let timestretch = data.pathfinding.projection.timestretch
    for (let i = 0; i < iterations; i++) {
      let offsetPerIteration = velocity.clone().rotate(gameObjectRotationOffset)
      .mult(timestretch)
      .mult(dt)
      
      boundingBox.x += offsetPerIteration.x
      boundingBox.y += offsetPerIteration.y
      projections.push(_.cloneDeep(boundingBox))
    }
    return projections
  }
  update() {
    throw "supply update() method"
  }
  //#region static draw methods
  static draw(gameObject, graphics, widthMultiplier = 1) {
    if(!visible.hitbox)
      return
    if(!gameObject.hitbox) 
      return
      
    let color = gameObject.hitbox.color

    if(gameObject instanceof Interactable) 
      color = colors.hitbox.interactable
      
    if(gameObject.triggered) 
      color = colors.hitbox.collision

    if(gameObject.hitbox.type === "circle") {
      this.drawCircle(gameObject, gameObject.hitbox, graphics, widthMultiplier, color)
    }
    if(gameObject.hitbox.type === "polygonHitbox") {
      this.drawPolygonHitbox(gameObject, gameObject.hitbox, graphics, widthMultiplier, color)
    }
    if(gameObject.hitbox.type === "box") {
      this.drawBox(gameObject, gameObject.hitbox, graphics, widthMultiplier, color)
    }
    if(visible.origin)
      this.drawOrigin(gameObject, graphics, color, widthMultiplier)
  }
  static drawBox(gameObject, hitbox, graphics, widthMultiplier, color) {
    let pos = gameObject.transform.position
    let positionOffset = hitbox.positionOffset ?? {x: 0, y: 0}
    graphics.lineStyle(2 * widthMultiplier, color, 1);
    graphics.drawRect(
      pos.x - hitbox.w/2 + positionOffset.x, 
      pos.y - hitbox.h/2 + positionOffset.y, 
      hitbox.w, 
      hitbox.h
    )
    graphics.closePath()
  }
  static drawCircle(gameObject, hitbox, graphics, widthMultiplier, color) {
    graphics.lineStyle(2 * widthMultiplier, color, 1);
      graphics.drawCircle(
        gameObject.transform.position.x, 
        gameObject.transform.position.y, 
        hitbox.radius
      )
      graphics.closePath();
  }
  static drawPolygonHitbox(gameObject, hitbox, graphics, widthMultiplier, color) {
    hitbox.bodies.forEach((body) => {
      this.drawPolygon(body, graphics, widthMultiplier)
    }) 
  }
  static drawPolygon(body, graphics, widthMultiplier = 1) {
    let color = body.color
    graphics.lineStyle(2 * widthMultiplier, color, 1);
    body.vertices.forEach((vertex, index) => {
      graphics.moveTo(vertex.x, vertex.y);
      
      if(index === body.vertices.length - 1)
      graphics.lineTo(body.vertices[0].x, body.vertices[0].y);
      else
      graphics.lineTo(body.vertices[index + 1].x, body.vertices[index + 1].y);
    })
  graphics.closePath();
  }
  static drawBoundingBox(object, graphics, widthMultiplier = 1) {
    if(!object.hitbox) return

    let bb = object.hitbox.boundingBox
    graphics.lineStyle(2 * widthMultiplier, 0x0011dd, 1);
    graphics.drawRect(
      bb.x, 
      bb.y, 
      bb.w, 
      bb.h
    )
  }
  static drawProjections(obj, graphics, widthMultiplier = 1) {
    if(!visible.projections) return
    if(obj instanceof Interactable) return
    if(!obj.hitbox) return
    if(!obj.hitbox.projections) return

    obj.hitbox.projections.forEach(box => {
      graphics.lineStyle(2 * widthMultiplier, colors.hitbox.projection, 1)
      graphics.drawRect(
        box.x, 
        box.y, 
        box.w, 
        box.h
      )
    })
  }
  static drawOrigin(gameObject, graphics, color, widthMultiplier = 1) {
    let layerOffsetMultiplier = GameWorldWindow.layerCounterOffset[gameObject.layer] ?? 1
    graphics.lineStyle(2 * widthMultiplier, color, 1);
    graphics.drawCircle(
      gameObject.transform.position.x + (gameObject.gameWorld.camera.transform.position.x * layerOffsetMultiplier),
      gameObject.transform.position.y + (gameObject.gameWorld.camera.transform.position.y * layerOffsetMultiplier),
      4
    )
    graphics.closePath();
  }
  //#endregion
  //#region static update methods
  static updatePolygonHitbox(object, hitbox) {
    if(object.performanceData.previousRotation === object.transform.rotation && object.gameWorld === game && !(object instanceof Interactable) && !object.vwb) {
      this.offsetPolygonHitbox(object, hitbox)
    }
    else {
      this.recalculatePolygonHitbox(object, hitbox)
    }
  }
  static offsetPolygonHitbox(object, hitbox) {
    let offset = object.transform.position.clone().sub(object.performanceData.previousPosition)
    for(let body of hitbox.bodies) {
      for(let vertex of body.vertices) {
        vertex.x += offset.x
        vertex.y += offset.y
      }
    }
  }
  static recalculatePolygonHitbox(/**@type GameObject */ go, /** @type PolygonHitbox */ hitbox) {

    /* reset position to the hitbox definition */
    for(let i = 0; i < hitbox.bodies.length; i++) {
      for(let j = 0; j < hitbox.bodies[i].vertices.length; j++) {
        hitbox.bodies[i].vertices[j].x = go.transform.position.x + hitbox.definition[i].vertices[j].x
        hitbox.bodies[i].vertices[j].y = go.transform.position.y + hitbox.definition[i].vertices[j].y
      }
    }

    /* rotate and return to the object's position */
    for(let b = 0; b < hitbox.bodies.length; b++) {
      for(let v = 0; v < hitbox.bodies[b].vertices.length; v++) {
        hitbox.bodies[b].vertices[v].x = hitbox.definition[b].vertices[v].x
        hitbox.bodies[b].vertices[v].y = hitbox.definition[b].vertices[v].y
      }
      hitbox.bodies[b].rotate(-go.transform.rotation)
      for(let v = 0; v < hitbox.bodies[b].vertices.length; v++) {
        hitbox.bodies[b].vertices[v].x += go.transform.position.x
        hitbox.bodies[b].vertices[v].y += go.transform.position.y
      }
    }
  }
  //#endregion
}

class CircleHitbox extends Hitbox {
  constructor(gameObject, radius, color) {
    super(gameObject, color)
    this.type = "circle"
    this.radius = radius
    this.radiusDefault = radius
  }
  clone(gameObject) {
    return new CircleHitbox(gameObject, this.radius, this.color)
  }
  update() {
    
  }
  get boundingBox() {
    return new BoundingBox(
      this.gameObject.transform.position.x - this.radius,
      this.gameObject.transform.position.y - this.radius,
      this.radius * 2,
      this.radius * 2,
    )
  }
}

class PolygonHitbox extends Hitbox {
  constructor(gameObject, bodies, color) {
    super(gameObject, color)
    this.type = "polygonHitbox"
    this.bodies = bodies
    this.definition = _.cloneDeep(this.bodies)
    Hitbox.recalculatePolygonHitbox(gameObject, this)
  }
  clone(attachTo) {
    return new PolygonHitbox(attachTo, _.cloneDeep(this.definition), this.color)
  }
  //#region hitbox manipulation methods
  addBody(body) {
    if(!body)
      console.error('please specify body')
    this.bodies.push(body)
    this.definition.push(_.cloneDeep(body))
  }
  offsetBody(body, offset) {
    let [indexB, indexV] = this.getIndices(body, null)
    this.definition[indexB].vertices.forEach(vert => {
      this.offsetVertex(vert, offset)
    })
  }
  removeBody(body) {
    let index = this.bodies.indexOf(body)
    this.definition.splice(index, 1)
    this.bodies = _.cloneDeep(this.definition)
  }
  addVertex(body) {
    let ind = this.bodies.indexOf(body)
    let b = this.definition[ind]
    let first = b.vertices[0]
    let second = b.vertices[1]

    let diff = new Vector(first.x - second.x, first.y - second.y)
    diff.mult(0.5)
    b.vertices.push(
      {
        x: first.x + diff.x,
        y: first.y + diff.y
      }
    )
    this.bodies = _.cloneDeep(this.definition)
  }
  offsetVertex(vert, offset) {
    vert.x += offset.x
    vert.y += offset.y
  }
  movePoint(body, point, offset) {
    console.log(body, point, offset)
    let [indexB, indexV] = this.getIndices(body, point)
    let vert = this.definition[indexB].vertices[indexV]
    this.offsetVertex(vert, offset)
  }
  getIndices(body, point) {
    return [this.bodies.indexOf(body), body.vertices.indexOf(point)]
  }
  removePoint(body, point) {
    if(body.vertices.length <= 3) return
    let [indexB, indexV] = this.getIndices(body, point)
    let vert = this.definition[indexB].vertices[indexV]
    this.definition[indexB].vertices.splice(indexV, 1)
    this.bodies = _.cloneDeep(this.definition)
  }
  //#endregion
  update() {
    Hitbox.updatePolygonHitbox(this.gameObject, this)
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
  static default(gameObject) {
    return new PolygonHitbox(gameObject, 
      [
        PolygonBuilder.Square(50, {x: -25, y: -25})
      ]
    )
  }
}

class BoxHitbox extends Hitbox {
  constructor(gameObject, w, h, color) {
    super(gameObject, color)
    this.type = "box"
    this.positionOffset = new Vector()
    this.w = w
    this.h = h
  }
  clone(attachTo) {
    return new BoxHitbox(attachTo, this.w, this.h, this.color)
  }
  update() {
    this.x = this.gameObject.transform.position.x + this.positionOffset.x
    this.y = this.gameObject.transform.position.y + this.positionOffset.y
  }
  get boundingBox() {
    return new BoundingBox(
      this.gameObject.transform.position.x - this.w/2 + this.positionOffset.x,
      this.gameObject.transform.position.y - this.h/2 + this.positionOffset.y,
      this.w,
      this.h
    )
  }
  static default() {
    return new BoxHitbox(50, 50)
  }
}

class FastCircleHitbox extends Hitbox {
  constructor(gameObject, radius, color) {
    super(gameObject, color)
    this.type = "fastCircle"
    this.radius = radius
    this.radiusDefault = radius
  }
  clone(attachTo) {
    return new FastCircleHitbox(attachTo, this.radius, this.color)
  }
  update() {

  }
  testAgainstVector(testVector) {
    let hitboxPosition = this.gameObject.transform.position
    let necessaryDistance = this.radius
    let vectorRelativePosition = testVector.copy.sub(hitboxPosition)
    let absoluteOffsetValues = [Math.abs(vectorRelativePosition.x), Math.abs(vectorRelativePosition.y)]
    let [smaller, larger] = [Math.min(...absoluteOffsetValues), Math.max(...absoluteOffsetValues)]
    
    //if the vector is inside the fast-distance "diamond shape" the collision is successful either way
    if(testVector.fastDistance(hitboxPosition) < necessaryDistance) 
      return true
    
    //increase the necessary distance by multiplying it by a value between 1 and SQRT2, based on how close the larger and smaller testVector offset dimensions are
    necessaryDistance *= 1 + (smaller / larger) * SQRT2 
    
    if(testVector.fastDistance(hitboxPosition) < necessaryDistance)
      return true
    
    return false
  }
  get boundingBox() {
    return new BoundingBox(
      this.gameObject.transform.position.x - this.radius,
      this.gameObject.transform.position.y - this.radius,
      this.radius * 2,
      this.radius * 2,
    )
  }
}

class BoundingBox {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.type = "box"
    this.positionOffset = new Vector()
  }
  expand(amount) {
    this.w += amount * 2
    this.h += amount * 2
    this.x -= amount
    this.y -= amount
    return this
  }
  get position() {
    return new Vector(this.x - this.w/2, this.y - this.h/2)
  }
}

class HitboxVault extends Component {
  constructor(gameObject, hitboxes = []) {
    super(gameObject)
    this.hitboxes = hitboxes ?? []
  }
  addHitbox(hitbox) {
    this.hitboxes.push(hitbox)
  }
  update() {
    for(let hitbox of this.hitboxes)
      hitbox.update()
  }
}