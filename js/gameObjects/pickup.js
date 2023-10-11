class Pickup extends GameObject {
  constructor(transform, name, objectData) {
    super(transform)
    this.type = "pickup"
    this.name = name
    let objData = data.pickup[name]

    this.mass = 1
    this.setAsImmovable()
    
    this.components = ["sprite", "hitbox"]
    this.registerComponents(objData)
  }
  update() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  handleImpact(collisionEvent) {
    let obj = collisionEvent.obj1 !== this ? collisionEvent.obj1 : collisionEvent.obj2
    if(obj instanceof Ship) {
      this.consume(obj)
    }
  }
  consume(/** @type Ship */ targetObj) {
    switch(this.name) {
      case "health": {
        targetObj.hull.repair()
        AudioManager.playSFX("cardShimmer", 1.0)
        break
      }
    }
    GameObject.destroy(this)
  }
  destroy() {

  }
}