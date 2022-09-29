class GameObject {
  constructor(
    transform = new Transform()
  ) {
    this.transform = transform
    this.type = "gameObject"
    this.components = []
    this.vwb = false
    this.canCollide = true
    this.destroyed = false
    this.visible = true
    this.steering = false
    this.braking = false
    this.colliding = false
    this.stuck = false
    this.wrecked = false
    this.timers = []
  }
  clone() {
    return _.cloneDeep(this)
  }
  //#region instance methods
  autoCull() {
    return
    if(!this.stage) return
    if(!this.container) return
    if(
      //unfinished code
      this.transform.position.x < this.stage.position.x - cw*2 ||
      this.transform.position.x > this.stage.position.x + cw*2
    ) {
      this.hide()
    }
    else this.show()
  }
  hide() {
    if(this.container) this.container.renderable = false
    this.visible = false
  }
  show() {
    if(this.container) this.container.renderable = true
    this.visible = true
  }
  enterVoid() {
    this.vwb = true
    this.canCollide = false
  }
  exitVoid() {
    this.vwb = false
    this.canCollide = true
  }
  applyInertia() {
    if(this.brakes && this.brakes.auto == false) return
    if(this instanceof Projectile) return
    if(this instanceof BgObject) return
    this.transform.velocity.mult(data.inertia)
  }
  updateCellPosition() {
    this.transform.cellPosition.x = Math.floor(this.transform.position.x / grid.cellSize)
    this.transform.cellPosition.y = Math.floor(this.transform.position.y / grid.cellSize)
  }
  wrapRotation() {
    if(this.transform.rotation > TAU) 
      this.transform.rotation -= TAU
    if(this.transform.rotation < 0) 
      this.transform.rotation += TAU
  }
  floorAngularVelocity() {
    if(Math.abs(this.angularVelocity) < 0.015) this.angularVelocity = 0
  }
  updateTimers() {
    this.timers.update()
  }
  update() {
    throw "GameObject is an abstract class, don't instantiate directly"
  }
  updateComponents() {
    this.components.forEach(comp => {
      this[comp].update()
    })
  }
  destroy() {
    if(this.sprites) 
      this.sprites.forEach(sprite => sprite.destroy())
    if(this.container) 
      this.container.destroy()
  }
  //#endregion

  //#region static methods
  static updateOnPlay(gameObject) {
    gameObject.update()
    gameObject.updateTimers()
    gameObject.floorAngularVelocity()
    gameObject.applyInertia()
  }
  static updateOnAll(gameObject) {
    gameObject.updateCellPosition()
    gameObject.updateComponents()
    gameObject.autoCull()
  }
  static create(type, name, params = {}, options = {world: game}) {
    if(!options.world) throw "A GameObject needs to be placed inside a GameWorldWindow."
    let obj
    if(type === "camera") obj = new Camera(params.transform, params.context, params.contextDim, params.lockedTo, params.baseZoom)
    if(type === "asteroid") obj = new Asteroid(params.transform, name)
    if(type === "ship") obj = new Ship(params.transform, name)
    if(type === "debris") obj = new Debris(params.transform, name)
    if(type === "interactable") obj = new Interactable(params.transform, name, params.hitbox, params.doOnEnter, params.doOnLeave, params.hintText, params.parent)
    if(type === "hint") obj = new DynamicHint(params.transform, params.text, params.fadeoutTime, params.parent )
    if(type === "projectile") obj = new Projectile(params.transform, name, params.owner, params.target)
    if(type === "cluster") obj = new Cluster(params.transform)
    if(type === "bgObject") obj = new BgObject(params.transform, name)
    if(type === "ultraportBeacon") obj = new UltraportBeacon(params.transform)
    if(type === "locationRandomizer") obj = new LocationRandomizer(params.transform)
    if(type === "randomSpawner") obj = new RandomSpawner(params.transform, {type: "circle", radius: 50}, 250)
    if(type === "mapIcon") obj = new MapIcon(params.location, params.locationName)
    if(type === "mapImage") obj = new MapImage(params.transform, params.scale, name)

    obj.prototypeChain = []
    if(obj instanceof GameObject) obj.prototypeChain.push("gameObject")
    if(obj instanceof Camera) obj.prototypeChain.push("camera")
    if(obj instanceof Rigid) obj.prototypeChain.push("rigid")
    if(obj instanceof Asteroid) obj.prototypeChain.push("asteroid")
    if(obj instanceof Debris) obj.prototypeChain.push("debris")
    if(obj instanceof BgObject) obj.prototypeChain.push("bgObject")
    if(obj instanceof Cluster) obj.prototypeChain.push("cluster")
    if(obj instanceof Interactable) obj.prototypeChain.push("interactable")
    if(obj instanceof Hint) obj.prototypeChain.push("hint")
    if(obj instanceof Projectile) obj.prototypeChain.push("projectile")
    if(obj instanceof Ship) obj.prototypeChain.push("ship")
    if(obj instanceof UltraportBeacon) obj.prototypeChain.push("ultraportBeacon")
    if(obj instanceof LocationRandomizer) obj.prototypeChain.push("locationRandomizer")
    if(obj instanceof RandomSpawner) obj.prototypeChain.push("randomSpawner")

    options.world.addGameObject(obj)
    if(obj === undefined) 
      throw "GameObject is undefined"
    return obj
  }
  static destroy(obj) {
    this.removeFromStage(obj)
    if(obj.container) 
      obj.container.destroy()
    if(obj.sprite) 
      obj.sprite.all.forEach(s => s.destroy())
    obj.gameWorld.removeGameObject(obj)
    obj.destroy()
  }
  static addToStage(obj, stage) {
    if(!stage) return
    obj.stage = stage
    obj.stage.addChild(obj.sprite.container)
    obj.show()
  }
  static removeFromStage(obj) {
    if(obj.stage) 
      obj.stage.removeChild(obj.sprite.container)
    obj.hide()
  }
  static getLayerForObject(obj) {
    let types = data.objectToLayerMap.get(obj.type)
    if(types) 
      return pickRand(types)
    return null
  }
  //#endregion

  //#region components
  addComponent(name, objData) {
    switch(name) {
      case "rigidbody": {
        this.rigidbody = new RigidBody(objData.rigidbody)
        break
      }
      case "controller": {
        this.rigidbody = new Controller(objData.controller)
        break
      }
      case "hitbox": {
        this.hitbox = new Hitbox(objData.hitbox)
        break
      }
      case "sprite" : {
        this.sprite = new Sprite(this)
        break
      }
      case "shields" : {
        this.shields = new Shields(objData.shields)
        break
      }
      case "stealth" : {
        this.stealth = new Stealth(objData.stealth)
        break
      }
      case "weapons" : {
        this.weapons = new Weapons(objData.weapons)
        break
      }
      case "engines" : {
        this.engines = new Engines(objData.engines)
        break
      }
      case "dash" : {
        this.engines = new Dash(objData.dash)
        break
      }
      case "brakes" : {
        this.brakes = new Brakes(objData.brakes)
        break
      }
      case "cargo" : {
        this.cargo = new Cargo(objData.cargo)
        break
      }
    }
  }
  //#endregion
}
