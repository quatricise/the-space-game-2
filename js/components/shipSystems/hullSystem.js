class HullSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.level = data.level
    this.levelMax = data.levelMax
    this.current = data.level
    this.impactResistance = data.impactResistance

    this.coatingLayers = 0

    this.timers = new Timer(
      ["invulnerableWindow", 1500, {loop: false, active: false, onfinish: this.toggleInvulnerability.bind(this)}]
    )
  }
  upgrade() {
    if(this.level >= this.levelMax) return
    this.level++
    this.current = this.level
  }
  repair() {
    if(this.current >= this.level) return
    this.current++
    if(this.gameObject === player.ship)
      this.handlePlayerShipHullRepair()
  }
  toggleInvulnerability() {
    this.invulnerable = !this.invulnerable
    this.setSpriteInvulnerableState()
  }
  setSpriteInvulnerableState() {
    if(this.invulnerable) {
      this.gameObject.sprite.hullInvulnerableAnimation.renderable = true
      this.gameObject.sprite.hullInvulnerableAnimation.alpha = 1
      this.gameObject.sprite.hullInvulnerableAnimation.loop = false
      this.gameObject.sprite.hullInvulnerableAnimation.gotoAndPlay(0)
      this.gameObject.sprite.container.filters = [filters.invulnerable]
    }
    else {
      this.gameObject.sprite.hullInvulnerableAnimation.renderable = false
      this.gameObject.sprite.container.filters = []
    }
  }
  damage(collisionEvent) {
    if(this.invulnerable) return

    if(this.coatingLayers)
      this.processCoatingDamage()
    else
      this.processHullDamage(collisionEvent.impactDamage)

    this.createParticles(collisionEvent)
  }
  processCoatingDamage() {
    this.coatingLayers--
    this.gameObject.sprite.coatingLayer.gotoAndStop(this.coatingLayers)
  }
  processHullDamage(amount) {
    this.current -= amount
    if(this.current <= 0)
      this.gameObject.wreck.activate()
    
    this.toggleInvulnerability()
    
    if(this.gameObject === player.ship) 
      this.handlePlayerShipHullDamage()
      
    this.timers.invulnerableWindow.start()
  }
  handlePlayerShipHullDamage() {
    gameUI.animateHullDamage()
    game.camera.shake()
    gameUI.updateShipHullUI()
    AudioManager.playSFX("hullDamage")
  }
  handlePlayerShipHullRepair() {
    gameUI.animateHullRepair()
    gameUI.updateShipHullUI()
    AudioManager.playSFX("hullRepair")
  }
  handleImpact(collisionEvent) {
    if(collisionEvent.impactSpeed > this.impactResistance)
      this.damage(collisionEvent)
  }
  updateInvulnerableAnimation() {
    let offsetFromEnd = 500
    let startValueAbsolute = this.timers.invulnerableWindow.duration - offsetFromEnd
    if(this.timers.invulnerableWindow.currentTime >= startValueAbsolute) {
      let alphaRedux = Ease.InOut(this.timers.invulnerableWindow.currentTime - startValueAbsolute, 0, 1, offsetFromEnd)
      this.gameObject.sprite.hullInvulnerableAnimation.alpha = 1 - alphaRedux
    }
  }
  createParticles(collisionEvent) {
    let particleOrigin = this.setParticleOrigin(collisionEvent)

    let particleCount = Random.int(1, Math.min(Math.ceil(collisionEvent.impactSpeed / 100), 5))
    collisionEvent.impactDamage ? 
    particleCount = particleCount : 
    particleCount = 1
    
    let firstParticleVelocity = 
    Vector.fromAngle(
      this.gameObject.transform.position.angleTo(particleOrigin)
    )
    .mult(Random.int(1, 80))

    let spawnAttempts = 0
    let maxSpawnAttempts = 30

    let transforms = [
      new Transform(particleOrigin, firstParticleVelocity, Random.float(0, TAU))
    ]
    createTransforms:
    for(let i = 0; i < particleCount; i++) {
      spawnAttempts++
      let position = particleOrigin.clone().add(
        new Vector(
          Random.int(30, 60) * Random.from(-1, 1), 
          Random.int(30, 60) * Random.from(-1, 1)
        )
      )
      if(spawnAttempts > maxSpawnAttempts) {
        console.warn("> 50 attempts to spawn particles, breaking loop prematurely")
        break
      }
      if(!Collision.auto(position, this.gameObject.hitbox)) {
        i--
        continue
      }

      let velocity = Vector.fromAngle(this.gameObject.transform.position.angleTo(position)).mult(Random.int(4, 40))
      let rotation = Random.float(0, TAU)
      transforms.push(
        new Transform(
          position, 
          velocity,
          rotation
        )
      )
    }
    spawnParticles:
    for(let transform of transforms) {
      GameObject.create(
        "particle",
        this.gameObject.name + "HullDamage",
        {
          transform
        },
        {world: this.gameObject.gameWorld}
      )
    }
  }
  setParticleOrigin(collisionEvent) {
    let particleOrigin
    if(collisionEvent.collisionPoint) {
      particleOrigin = collisionEvent.collisionPoint.clone()
    }
    else {
      let otherObject = 
      collisionEvent.obj1 === this.gameObject ? 
      collisionEvent.obj2 : 
      collisionEvent.obj1

      if(!otherObject)
        return particleOrigin = this.gameObject.transform.position.clone()
        
      let angle = GameObject.angle(this.gameObject, otherObject)
      let positionOffset = 
      Vector.fromAngle(angle)
        .mult(
          Math.min(
            this.gameObject.hitbox.boundingBox.w/2, 
            this.gameObject.hitbox.boundingBox.h/2
          )
        )
      particleOrigin = this.gameObject.transform.position.clone().add(positionOffset)
    }
    return particleOrigin
  }
  update() {
    this.updateInvulnerableAnimation()
  }
}