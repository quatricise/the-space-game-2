class Ship extends GameObject {
  constructor(transform, name, pilot) {
    super(transform)
    let objectData = data.ship[name]
    this.type = "ship"
    this.name = name
    this.pilot = pilot
    this.weaponSlots = objectData.weaponSlots
    this.mass = objectData.mass ?? console.error("object doesn't have mass")
    this.state = new State(
      "default",
      "skipping",
      "docking",
      "docked",
      "undocking",
    )
    this.components = [
      "hitbox",
      "wreckHitboxVault",
      "rigidbody",
      "sprite",
      "reactor",
      "hull",
      "skip",
      "wreck",
    ]
    this.shipSystems = _.cloneDeep(objectData.systems)
    this.registerComponents(objectData)

    this.dockData = {
      offset: new Vector(),
      origin: new Vector(),
      rotationInitial: 0,
      rotationOffset: 0,
      durationMin: 1500,
      station: null,
    }
    this.targetPosition = new Vector()

    this.timers = new Timer(
      ["dock", Ship.dockDurationMS, {loop: false, active: false, onfinish: this.dockFinish.bind(this)}],
    )
    this.autoPowerSystems(objectData.systems)
    setTimeout(() => this.createCaptain(pilot))
    //#endregion
  }
  rotate(direction) {
    if(!direction) throw "specify direction"
    if(this.state.is("docking", "docked", "undocking")) return
    if(!this.engine.powered) return
    if(this.stuck) return

    let max = this.engine.angularVelocity
    this.transform.angularVelocity += (max * direction) * this.engine.glideReduction
    if(this.transform.angularVelocity * direction > max) 
      this.transform.angularVelocity = max * direction
  }
  accelerate() {
    if(this.state.is("skipping", "docked", "docking", "undocking")) return
    if(!this.engine.powered) return
        
    let accel = new Vector(this.engine.acceleration, 0)
    .rotate(this.transform.rotation)

    this.transform.velocity.add(accel.mult(dtf))
  }
  decelerate() {
    if(this.state.is("skipping")) return
    if(!this.engine.powered) return
    
    let accel = new Vector(this.engine.acceleration, 0)
    .rotate(this.transform.rotation)
    
    this.transform.velocity.sub(accel.mult(dtf))
  }
  move() {
    if(this.state.is("default") && this.transform.velocity.length() === 0) return
    if(this.state.is("skipping", "docking", "undocking", "docked")) return
    
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
    
    if(!this.boosters?.active)
      this.reduceGlide()

    /* softly clamp the max speed, without causing bumpy behaviour */
    let speed = this.transform.velocity.length()
    let maxSpeed = this.engine.maxSpeed
    if(speed > maxSpeed) 
      this.transform.velocity.mult(
        (maxSpeed / speed) * 0.1
        +
        0.9
      )
  }
  reduceGlide() {
    let glideReduction = this.engine.glideReduction
    let directionalVelocity = new Vector(this.transform.velocity.length(), 0)
        directionalVelocity.rotate(this.transform.rotation)
        directionalVelocity.mult(glideReduction)
    this.transform.velocity.mult(1 - glideReduction)
    this.transform.velocity.add(directionalVelocity)
  }
  toggleBrakeIndicator() {
    
  }
  drawGhost() {
    let ghost = this.sprite.ghost
    let skip = this.sprite.skip

    this.gameWorld.layers.ghost.addChild(ghost, skip)

    ghost.position.set(mouse.worldPosition.x, mouse.worldPosition.y)
    skip.position.set(mouse.worldPosition.x, mouse.worldPosition.y)
    ghost.alpha = 0.2
    ghost.rotation = this.transform.rotation
  }
  hideGhost() {
    this.gameWorld.layers.ghost.removeChild(this.sprite.ghost)
    this.gameWorld.layers.ghost.removeChild(this.sprite.skip)
  }
  toggleDockState() {
    this.state.is("docked") ? this.undockBegin() : this.dockBegin()
  }
  //#region docking logic
  dockBegin() {
    if(this.state.is("docking", "undocking", "skipping")) return

    let stationPoints = this.gameWorld.gameObjects.station.map(station => {
      let points = station.dockingPoints.map(p => p.clone())
      points.forEach(p => {
        p.add(station.transform.position)
        p.stationReference = station
      })
      return points
    })
    .flat()

    if(!stationPoints || stationPoints.length === 0) return

    let destinationPoint = this.transform.position.closest(...stationPoints)
    if(this.transform.position.distance(destinationPoint) > Ship.maxDistanceToDock) return

    this.dockData.station = destinationPoint.stationReference
    delete destinationPoint.stationReference
    let angleDifference = this.dockData.station.transform.rotation - this.transform.rotation

    this.dockData.origin.setFrom(this.transform.position)
    this.dockData.offset.setFrom(destinationPoint).sub(this.transform.position)
    this.dockData.rotationInitial = this.transform.rotation
    this.dockData.rotationOffset = angleDifference

    this.timers.dock.duration = this.dockData.durationMin + destinationPoint.distance(this.transform.position) * 3.75

    this.state.set("docking")
    this.timers.dock.start()

    /* camera zoom in */
    if(this.gameWorld.camera.lockedTo === this)
      this.gameWorld.camera.zoomInit("in")

    AudioManager.playSFX("shipEngineStop")
  }
  dockTick() {
    if(this.state.isnt("docking", "undocking")) return

    this.transform.position.set(
      Ease.InOut(this.timers.dock.currentTime, this.dockData.origin.x, this.dockData.offset.x, this.timers.dock.duration),
      Ease.InOut(this.timers.dock.currentTime, this.dockData.origin.y, this.dockData.offset.y, this.timers.dock.duration),
    )
    this.transform.rotation = Ease.InOut(this.timers.dock.currentTime, this.dockData.rotationInitial, this.dockData.rotationOffset, this.timers.dock.duration)
  }
  dockFinish() {
    this.state.ifthen("docking", "docked")
    this.state.ifthen("undocking", "default")

    if(this.state.is("docked")) {
      this.engine.unpower()
      this.weapons.disarmWeapons()
      this.dockData.station.onPlayerDock()
    }
    else {
      this.engine.repower()
      this.weapons.armWeapons()
      this.dockData.station = null
    }
  }
  undockBegin() {
    if(this.state.is("undocking")) return

    this.dockData.station.onPlayerUndock()
    this.dockData.origin.setFrom(this.transform.position)
    this.dockData.offset = Vector.fromAngle(this.transform.rotation).mult(100)
    this.dockData.rotationInitial = this.transform.rotation
    this.dockData.rotationOffset = 0

    this.timers.dock.duration = this.dockData.durationMin
    this.state.set("undocking")
    this.timers.dock.start()

    AudioManager.playSFX("shipEngineStart")

    /* camera zoom out */
    if(this.gameWorld.camera.lockedTo === this)
      this.gameWorld.camera.zoomInit("out")
  }
  //#endregion
  handleImpact(collisionEvent) {
    /* hot touch property */
    if(this.hull.properties.hotTouch) {
      let obj = collisionEvent.obj1 !== this ? collisionEvent.obj1 : collisionEvent.obj2
      if(obj instanceof Ship) {
        obj.hull.damage(CollisionEvent.fakeEvent(1, 1000, this.transform.position.copy))
      }
    }

    this.hull.handleImpact(collisionEvent)
  }
  autoPowerSystems(systems) {
    for(let sys of systems)
      this[sys].addPower()
  }
  createCaptain(pilotName) {
    if(pilotName === undefined) return
    if(this.gameWorld !== game) return
    if(!data.person[pilotName]) throw "pilot: " + pilotName + " doesn't exist"

    let 
    pilot = GameObject.create("npc", pilotName, {}, {world: this.gameWorld})
    pilot.assignShip(this)
  }
  update() {
    this.move()
    this.dockTick()

    /* move with station, for hacky purposes I assume the station only has one docking point, otherwise this code breaks */
    if(this.state.is("docked")) {
      this.transform.position.setFrom(this.dockData.station.dockingPoints[0].clone().add(this.dockData.station.transform.position))
    }
  }
  static maxDistanceToDock = 500
  static dockDurationMS = 1600
}