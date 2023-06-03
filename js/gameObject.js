class GameObject {
  constructor(transform = new Transform(), id) {
    this.transform = transform
    this.transform.gameObject = this
    this.id = id ?? Random.uniqueIDHEX()
    this.type = "gameObject"

    this.components = []
    this.overrides = []
    this.npcs = []
    this.statusEffects = []
    this.performanceData = {}
    
    this.gameWorld = null
    this.timers = null

    /* flags */
    this.loaded = false //unused currently
    this.vwb = false
    this.canCollide = true
    this.immovable = false
    this.visible = true
    this.steering = false
    this.braking = false
    this.colliding = false
    this.stuck = false
    this.wrecked = false
    this.destroyed = false
    this.dying = false

    this.broadphaseGrowFactor = 1
  }
  //#region instance methods
  clone() {
    return _.cloneDeep(this)
  }
  onHitboxLoad() {
    //use this to attach some custom methods for handling the loading of the hitbox, by default it's empty
  }
  onWreckHitboxVaultLoad() {
    //use this to attach some custom methods for handling the loading of the hitboxVault, by default it's empty
  }
  calculateBroadphaseGrowFactor() {
    if(!this.hitbox?.boundingBox) 
      console.error("growFactor calculation fail:", this)
    this.broadphaseGrowFactor = Math.ceil(this.hitbox.boundingBox.w / grid.cellSize) ?? 1
  }
  cull() {
    if(!this.sprite) return
    if(this instanceof DecorativeObject) return
    
    let offsetFromCamera = this.transform.position.clone().sub(this.gameWorld.camera.transform.position)
    if(offsetFromCamera.fastLength() > (cw + (grid.cellSize * this.broadphaseGrowFactor)) * this.gameWorld.camera.currentZoom)
      this.hide()
    else
      this.show()
  }
  hide() {
    if(!this.sprite) return
    this.sprite.container.visible = false
    this.sprite.container.renderable = false
    this.visible = false
  }
  show() {
    if(!this.sprite) return
    this.sprite.container.visible = true
    this.sprite.container.renderable = true
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
  setAsImmovable() {
    this.immovable = true
  }
  unsetAsImmovable() {
    this.immovable = false
  }
  resetVelocityIfImmovable() {
    if(!this.immovable) return
    this.transform.velocity.set(0)
  }
  clampVelocity() {
    this.transform.velocity.clamp(data.maxObjectVelocity)
  }
  applyInertia() {
    throw "inertia id deprecated"
    if(this.brakes && this.brakes.auto == false) return
    if(this instanceof Projectile) return
    if(this instanceof DecorativeObject) return

    this.transform.velocity.mult(data.inertia)
  }
  updateRotation() {
    if(this.gameWorld !== game) return
    
    this.transform.rotation += this.transform.angularVelocity * dt
    if(this.engine && !this.steering)
      this.transform.angularVelocity *= (1 - this.engine.glideReduction)
    if(Math.abs(this.transform.angularVelocity) < 0.01) 
      this.transform.angularVelocity = 0
  }
  wrapRotation() {
    if(this.transform.rotation > TAU) 
      this.transform.rotation -= TAU
    if(this.transform.rotation < 0) 
      this.transform.rotation += TAU
  }
  updateTimers() {
    this.timers?.update()
  }
  updateStatusEffects() {
    for(let effect of this.statusEffects)
      effect.update()
  }
  setPerformanceData() {
    this.performanceData.previousRotation = this.transform.rotation
    this.performanceData.previousPosition = this.transform.position.clone()
  }
  update() {
    console.error("supply a new update method", this)
  }
  handleImpact(collisionEvent) {
    //custom method for handling impacts of descendant objects
  }
  destroy() {
    //custom method for handling the destruction of descendant objects
  }
  //#endregion
  //#region component methods
  registerComponents(objData = []) {
    if(objData.systems)
      for(let systemName of objData.systems)
        this.components.push(systemName)
    for(let component of this.components)
      this.addComponent(component, objData)
  }
  updateComponents() {
    for(let comp of this.components) {
      if(!this[comp]) return

      this[comp].update()
      this[comp].timers?.update()
    }
  }
  addSpriteComponentToFragment(fragmentIndex) {
    Sprite.createForFragment(this, fragmentIndex)
    this.components.push("sprite")
  }
  addSpriteComponentToMapLabel(text, color) {
    Sprite.createForMapLabel(this, text, color)
    this.components.push("sprite")
  }
  addComponent(name, objData) {
    switch(name) {
      case "hitbox": {
        if(objData.hitbox.filename === undefined || objData.hitbox.type === undefined || objData.hitbox.definition === undefined)
          throw "invalid hitbox data structure" + this.type + ", " + this.name
        
        this.objectData = { hitbox: objData.hitbox }

        if(objData.hitbox.filename) {
          readJSONFile(`data/hitboxes/${objData.hitbox.filename}.json`, (text) => {
            let hitboxData = JSON.parse(text)
            if(hitboxData.type !== "polygonHitbox") throw "only polygon hitboxes can be loaded from JSON" + this.type + ", " + this.name

            let bodies = hitboxData.bodies.map(body => new Polygon(body.vertices))
            this.hitbox = new PolygonHitbox(this, bodies, hitboxData.color)
            this.onHitboxLoad()
            this.transform.update()
            Hitbox.recalculatePolygonHitbox(this, this.hitbox)
            this.calculateBroadphaseGrowFactor()
          })
        }
        else {
          let def = objData.hitbox.definition

          if(objData.hitbox.type === "polygonHitbox") 
            this.hitbox = new PolygonHitbox(this, def.definition, def.color)
          if(objData.hitbox.type === "circle") 
            this.hitbox = new CircleHitbox(this, def.radius, def.color)
          if(objData.hitbox.type === "box") 
            this.hitbox = new BoxHitbox(this, def.a, def.b, def.color)
            
          this.calculateBroadphaseGrowFactor()
          
          if(objData.hitbox.type === "polygonHitbox" && this.type === "interactable") 
            console.log(this.hitbox)
        }
        break
      }
      case "rigidbody": {
        this.rigidbody = new RigidBody(this, objData.rigidbody)
        break
      }
      case "wreckHitboxVault" : {
        if(objData.wreck.hitboxVaultName) {
          readJSONFile(`data/hitboxes/wreckHitboxVault/${objData.wreck.hitboxVaultName}.json`, (text) => {
            let hitboxVaultData = JSON.parse(text)
            this.wreckHitboxVault = new HitboxVault(this)
            for(let hitbox of hitboxVaultData) {
              let bodies = hitbox.bodies.map(body => new Polygon(body.vertices))
              this.wreckHitboxVault.addHitbox(new PolygonHitbox(this, bodies, hitbox.color))
            }
            this.onWreckHitboxVaultLoad()
          })
        }
        else {
          this.wreckHitboxVault = new HitboxVault(this)
          for(let i = 0; i < objData.wreck.count; i++)
            this.wreckHitboxVault.addHitbox(PolygonHitbox.default(this))
        }
        break
      }
      case "sprite" : {
        Sprite.createDefault(this)
        break
      }
      case "reactor" : {
        this.reactor = new Reactor(this, objData.reactor)
        break
      }
      case "hull" : {
        this.hull = new HullSystem(this, objData.hull)
        break
      }
      case "shields" : {
        this.shields = new ShieldSystem(this, objData.shields)
        break
      }
      case "stealth" : {
        this.stealth = new StealthSystem(this, objData.stealth)
        break
      }
      case "weapons" : {
        this.weapons = new WeaponSystem(this, objData.weapons)
        break
      }
      case "engine" : {
        this.engine = new EngineSystem(this, objData.engine)
        break
      }
      case "boosters" : {
        this.boosters = new BoosterSystem(this, objData.boosters)
        break
      }
      case "brakes" : {
        this.brakes = new BrakeSystem(this, objData.brakes)
        break
      }
      case "cargo" : {
        this.cargo = new CargoSystem(this, objData.cargo)
        break
      }
      case "skip" : {
        this.skip = new SkipSystem(this, objData.skip)
        break
      }
      case "wreck" : {
        this.wreck = new Wreck(this, objData.wreck)
        break
      }
      case "coater" : {
        this.coater = new Coater(this, objData.coater)
        break
      }
    }
  }
  //#endregion
  //#region static methods
  static updateOnPlay(gameObject) {
    gameObject.updateStatusEffects()
    gameObject.update()
    gameObject.updateRotation()
    gameObject.wrapRotation()
    gameObject.updateTimers()
    gameObject.resetVelocityIfImmovable()
    gameObject.clampVelocity()
  }
  static updateOnAll(gameObject) {
    gameObject.updateComponents()
    gameObject.transform.update()
    gameObject.setPerformanceData()
    gameObject.cull()
  }
  static create(type, name, params = {}, options = {world: game, layer: null}) {
    let obj
    if(type === "camera")                   obj = new Camera(params.transform, params.context, params.contextDim, params.lockedTo, params.baseZoom, params.zoomRange)
    if(type === "asteroid")                 obj = new Asteroid(params.transform, name)
    if(type === "ship")                     obj = new Ship(params.transform, name, params.pilot)
    if(type === "station")                  obj = new Station(params.transform, name)
    if(type === "satellite")                obj = new Satellite(params.transform, name)
    if(type === "debris")                   obj = new Debris(params.transform, name)
    if(type === "interactable")             obj = new Interactable(params.transform, name, params.hitbox, params.doOnEnter, params.doOnLeave, params.doOnDestroy, params.parent, params.interactionData, params.interactionId)
    if(type === "hint")                     obj = new Hint(params.transform, params.hintData, params.fadeoutTime, params.parent)
    if(type === "projectile")               obj = new Projectile(params.transform, name, params.owner, params.target)
    if(type === "cluster")                  obj = new Cluster(params.transform)
    if(type === "fragment")                 obj = new Fragment(params.transform, name, params.parent, params.fragmentData)
    if(type === "decorativeObject")         obj = new DecorativeObject(params.transform, name, params.isPermanent, params.opacity)
    if(type === "ultraportBeacon")          obj = new UltraportBeacon(params.transform, name)
    if(type === "hintGraphic")              obj = new HintGraphic(params.transform, name, params.parent)
    if(type === "gameOverlay")              obj = new GameOverlay(params.transform, name, params.parent)
    if(type === "explosion")                obj = new Explosion(params.transform, name, params.SFXName)
    if(type === "particle")                 obj = new Particle(params.transform, name)
    if(type === "mapIcon")                  obj = new MapIcon(params.transform, name, params.locationReference)
    if(type === "mapImage")                 obj = new MapImage(params.transform, params.scale, name)
    if(type === "mapLabel")                 obj = new MapLabel(params.transform, params.text, params.color)
    if(type === "npc")                      obj = new NPC(name, params.jobTitle, params.location)
    if(type === "player")                   obj = new Player()
    if(type === "lightSource")              obj = new LightSource(params.transform, name, params.parent, params.lightData)
    if(type === "audioEmitter")             obj = new AudioEmitter(params.category, name, params.parent, params.options)
    if(type === "locationRandomizer")       throw "location randomizer not finished"
    if(type === "randomSpawner")            throw "random spawner not finished"

    if(!options.world)
      console.error("A GameObject needs to be placed inside a GameWorldWindow.", type, name, params, options)
    if(obj === undefined) 
      throw `GameObject is undefined, incorrect type or name: ${type}, ${name}`

    obj.prototypeChain = []
    
    if(params.id)
      obj.id = params.id
    if(params.collisionGroup)
      obj.collisionGroup = params.collisionGroup

    // if(Random.chance(20) && options.world === game && (obj instanceof Asteroid || obj instanceof Debris))
    //   obj.transform.angularVelocity += Random.float(-0.5, 0.5)

    if(obj instanceof GameObject)           obj.prototypeChain.push("gameObject")
    if(obj instanceof Camera)               obj.prototypeChain.push("camera")
    if(obj instanceof Station)              obj.prototypeChain.push("station")
    if(obj instanceof Satellite)            obj.prototypeChain.push("satellite")
    if(obj instanceof Asteroid)             obj.prototypeChain.push("asteroid")
    if(obj instanceof Debris)               obj.prototypeChain.push("debris")
    if(obj instanceof DecorativeObject)     obj.prototypeChain.push("decorativeObject")
    if(obj instanceof Cluster)              obj.prototypeChain.push("cluster")
    if(obj instanceof Interactable)         obj.prototypeChain.push("interactable")
    if(obj instanceof Ship)                 obj.prototypeChain.push("ship")
    if(obj instanceof Fragment)             obj.prototypeChain.push("fragment")
    if(obj instanceof Projectile)           obj.prototypeChain.push("projectile")
    if(obj instanceof UltraportBeacon)      obj.prototypeChain.push("ultraportBeacon")
    if(obj instanceof Explosion)            obj.prototypeChain.push("explosion")
    if(obj instanceof Particle)             obj.prototypeChain.push("particle")
    if(obj instanceof Hint)                 obj.prototypeChain.push("hint")
    if(obj instanceof HintGraphic)          obj.prototypeChain.push("hintGraphic")
    if(obj instanceof GameOverlay)          obj.prototypeChain.push("gameOverlay")
    if(obj instanceof LocationRandomizer)   obj.prototypeChain.push("locationRandomizer")
    if(obj instanceof RandomSpawner)        obj.prototypeChain.push("randomSpawner")
    if(obj instanceof MapIcon)              obj.prototypeChain.push("mapIcon")
    if(obj instanceof MapImage)             obj.prototypeChain.push("mapImage")
    if(obj instanceof MapLabel)             obj.prototypeChain.push("mapLabel")
    if(obj instanceof Person)               obj.prototypeChain.push("person")
    if(obj instanceof NPC)                  obj.prototypeChain.push("npc")
    if(obj instanceof Player)               obj.prototypeChain.push("player")
    if(obj instanceof LightSource)          obj.prototypeChain.push("lightSource")
    if(obj instanceof AudioEmitter)         obj.prototypeChain.push("audioEmitter")

    options.world.addGameObject(obj, options.layer)
    return obj
  }
  static destroy(obj) {
    if(obj.destroyed) return
    
    obj.destroy()
    this.removeFromStage(obj)
    if(obj.sprite) {
      obj.sprite.container.destroy()
      if(obj.sprite.minimapIcon)
        game.minimapApp.stage.removeChild(obj.sprite.minimapIcon)
    }
    obj.components.forEach(comp => {
      delete obj[comp].gameObject
      delete obj[comp]
    })

    obj.npcs.forEach(npc => GameObject.destroy(npc))
    obj.gameWorld.removeGameObject(obj)
    obj.destroyed = true
  }
  static addToStage(obj, stage) {
    obj.stage = stage
    obj.stage.addChild(obj.sprite.container)
    obj.show()
  }
  static removeFromStage(obj) {
    obj.stage?.removeChild(obj.sprite?.container)
    obj.hide()
  }
  //#endregion
  //#region utility methods
  static distance(obj1, obj2) {
    return obj1.transform.position.distance(obj2.transform.position)
  }
  static distanceFast(obj1, obj2) {
    return Math.abs(obj2.transform.position.x - obj1.transform.position.x) + Math.abs(obj2.transform.position.y - obj1.transform.position.y) - (obj1.broadphaseGrowFactor >> 1) * grid.cellSize - (obj2.broadphaseGrowFactor >> 1) * grid.cellSize
  }
  static closest(target, ...objects) {
    let closestVector = target.transform.position.closest(...objects.map(obj => obj.transform.position))
    return objects.find(obj => obj.transform.position.is(closestVector))
  }
  static closestToPoint(vector, ...objects) {
    let closestVector = vector.closest(...objects.map(t => t.transform.position))
    return objects.find(obj => obj.transform.position.is(closestVector))
  }
  static angle(obj1, obj2) {
    return obj1.transform.position.angleTo(obj2.transform.position)
  }
  static byId(world, id) {
    return world.gameObjects.gameObject.find(obj => obj.id === id)
  }
  //#endregion
}