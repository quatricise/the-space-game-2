class Player extends Person {
  constructor(ship) {
    super("player")
    this.ship = ship

    /* Modify inventory to display message when you receive a new item */
    this.inventory.onItemAdd = () => {
      GameObject.create("gameOverlay", "itemAdded", {parent: this.ship, offset: new Vector(0, 200)}, {world: this.gameWorld})
    }
  }
  handleInput(event) {
    this["handle" + event.type.capitalize()](event)
  }
  handleMousedown(event) {
    if(event.target !== game.element) return

    if(event.button === 0) {
      if(keys.shift || keys.shiftRight) {
        this.ship.skip.activate(mouse.worldPosition)
      }
      else
      if(keys.ctrl || keys.ctrlRight) {
        this.ship.shields.activate()
      }
      else {
        
      }
    }
  }
  handleMousemove(event) {

  }
  handleMouseup(event) {

  }
  handleClick(event) {

  }
  handleKeydown(event) {
    /* ship controls */
    if(event.code === binds.boosters)         this.ship.boosters.activate()
    if(event.code === binds.toggleAutobrake)  this.ship.brakes.toggleAuto()
    if(event.code === binds.dockShip)         this.ship.toggleDockState()
    if(event.code === binds.activateStealth)  this.ship.stealth.toggle()
    if(event.code === binds.armWeapons)       this.ship.weapons.toggleArmWeapons()
    if(event.code === binds.beginCoating)     this.ship.coater.beginCoating()

    /* general game */
    if(event.code === binds.openStationMenu)  this.openStationIfAvailable()
    if(event.code === binds.scrapDebris)      this.scrapDebris()

    /* weapon selection */
    if(event.code === binds.selectWeapon0)     this.selectWeapon(0)
    if(event.code === binds.selectWeapon1)     this.selectWeapon(1)
    if(event.code === binds.selectWeapon2)     this.selectWeapon(2)
    if(event.code === binds.selectWeapon3)     this.selectWeapon(3)
  }
  handleKeyup(event) {
    if(event.code === binds.boosters)         this.ship.boosters.deactivate()
    if(event.code === binds.beginCoating)     this.ship.coater.cancelCoating()
  }
  handleWheel(event) {
    let direction = clamp(event.deltaY, -1, 1)
    this.ship.weapons.cycleActiveWeapon(direction)
  }
  handlePointermove(event) {
    
  }
  handlePointerdown(event) {
    
  }
  handlePointerup(event) {
    
  }
  controlShipContinuous() {
    if(gameManager.activeWindow !== game) return
    if(game.state.is("loadingLocation")) return
    this.ship.targetPosition = mouse.worldPosition.clone()
    
    if(keys.shift) 
      this.ship.drawGhost()
    else 
      this.ship.hideGhost()
    
    if(keys.accel) {
      this.ship.accelerate()
      this.ship.brakes.setTargetSpeed()
    }
    if(keys.decel)  {
      this.ship.decelerate()
      this.ship.brakes.setTargetSpeed()
    }
    
    //brakes are janky and the order of if-statements matters here
    if(keys.brake)
      this.ship.brakes.active = true
    else
    if(!(keys.accel || keys.decel) && this.ship.brakes.auto)  
      this.ship.brakes.active = true
    else
      this.ship.brakes.active = false

    if(keys.rotateCCW || keys.rotateCW)  
      this.ship.steering = true
    if(!keys.rotateCCW && !keys.rotateCW)  
      this.ship.steering = false

    if(keys.rotateCW && !keys.rotateCCW)
      this.ship.rotate(1)
    if(keys.rotateCCW && !keys.rotateCC)
      this.ship.rotate(-1)
  }
  selectWeapon(index) {
    if(this.ship?.weapons?.weapons[index])
      this.ship.weapons.setActiveWeapon(this.ship.weapons.weapons[index])
  }
  openStationIfAvailable() {
    if(this.ship.state.is("docked")) {
      gameManager.setWindow(inventory)
      inventory.viewInventoryTab("station")
    }
  }
  scrapDebris() {
    if(!this.targetDebris) return
    if(this.ship.cargo.isFull) {
      GameObject.create("gameOverlay", "cargoFull", {parent: this.ship, offset: new Vector(0, 200)}, {world: this.gameWorld})
      return
    }
    for(let i = 0; i < 3; i++) {
      GameObject.create(
        "particle", 
        "debris", 
        {
          transform: new Transform(
            this.targetDebris.transform.position.clone().add(new Vector(...Random.intArray(-12, 12, 2))),
            new Vector(...Random.intArray(-12, 12, 2)),
            Random.rotation(),
            Random.float(-PI/4, PI/4)
          )
        },
        {
          world: this.targetDebris.gameWorld
        }
      )
    }
    
    let debrisCount = Random.int(
      this.targetDebris.debrisYield.min,
      this.targetDebris.debrisYield.max
    )
    for(let i = 0; i < debrisCount; i++) {
      this.ship.cargo.addItems(new Item("debris"))
    }
    GameObject.destroy(this.targetDebris)
  }
  createDebrisHighlight() {
    if(mouse.target !== Q("#game")) return
    let targets = Collision.broadphase(this.ship.gameWorld, this.ship, {solo: [Debris, Fragment]})
    if(!targets.length) {
      this.destroyDebrisHighlight()
      return
    }
    let mouseCollidesWithDebris = false
    for(let debris of targets) {
      if(!debris.scrappable) return
      if(!Collision.auto(mouse.worldPosition, debris.hitbox.boundingBox.expand(20))) continue
      
      mouseCollidesWithDebris = true
      if(this.targetDebris === debris) break

      this.targetDebrisOverlay = GameObject.create(
        "gameOverlay", 
        "scrapDebris", 
        {parent: debris}, 
        {world: this.ship.gameWorld}
      )
      this.targetDebris = debris
      break
    }
    if(!mouseCollidesWithDebris)
      this.destroyDebrisHighlight()
  }
  destroyDebrisHighlight() {
    if(this.targetDebrisOverlay)
      GameObject.destroy(this.targetDebrisOverlay)
    for(let overlay of game.gameObjects.gameOverlay.filter(a => a.name === "scrapDebris")) {
      GameObject.destroy(overlay)
    }
    this.targetDebris = null
    this.targetDebrisOverlay = null
  }
  update() {
    if(gameManager.activeWindow !== game) return
    if(game.state.is("loadingLocation")) return
    this.controlShipContinuous()
    this.createDebrisHighlight()
    Q("#ship-reactor-view").innerText = this.ship.reactor.powerFree + "/" + this.ship.reactor.power
    Q("#currency-view").innerText     = this.currency
    this.transform.position.setFrom(this.ship.transform.position)
  }
}
