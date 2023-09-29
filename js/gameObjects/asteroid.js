class Asteroid extends GameObject {
  constructor(transform, name) {
    super(transform)
    let objectData = data.asteroid[name]
    this.type = "asteroid"
    this.name = name
    this.mass = objectData.mass
    this.health = objectData.health
    this.material = objectData.material

    this.components = [
      "hitbox",
      "rigidbody",
      "sprite",
    ]
    this.registerComponents(objectData)
    
    /* set some properties based on material */
    switch(this.material) {
      case "lava": {
        this.timers = new Timer(
          ["spawnLava", 500, {loop: false, active: true, onfinish: this.spawnLavaParticles.bind(this)}]
        )
        break
      }
    }
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  handleImpact(event) {
    if(this.material === "lava") {
      let ship = event.obj1 !== this ? event.obj1 : event.obj2
      if(ship instanceof Ship) {
        ship.hull.damage(CollisionEvent.fakeEvent(1, 10000, ship.transform.position.copy))
      }
    }

    if(event.impactSpeed < Asteroid.minImpactSpeedToDamage) return

    this.takeDamage(event.impactDamage)
    
    if(this.health)
      this.createParticles(event.impactDamage + 1)
  }
  takeDamage(impactDamage) {
    this.health -= impactDamage
    if(this.health <= 0) {
      this.die()
      return
    }
    AudioManager.playSFX("asteroidDamage")
  }
  createParticles(/** @type Integer */ count, /** @type String */ particleName) {
    let spawnAttempts = 0
    let name = particleName ?? "asteroid" + this.material.capitalize()
    for(let i = 0; i < count; i++) {
      spawnAttempts++
      let timeoutMS = i == 0 ? 0 : Random.int(0, 100)
      let position = this.transform.position.clone().add(new Vector(...Random.intArray(-50, 50, 2)))
      
      if(spawnAttempts > 20) {
        break
      }
      if(!Collision.auto(position, this.hitbox)) {
        i--
        continue
      }
      
      setTimeout(() => {
        if(this.destroyed) return
        let particle = GameObject.create(
          "particle", 
          name, 
          {
            transform: new Transform(
              position,
              this.transform.velocity.copy.normalize(Random.int(2, 20)),
              Random.rotation(),
              Random.float(-PI/4, PI/4)
            )
          },
          {
            world: this.gameWorld
          }
        )
        particle.sprite.container.scale.set(
          clamp((this.broadphaseGrowFactor / 2) * Random.float(0.75, 1), 0.9, 1.45)
        )
      }, timeoutMS)
    }
  }
  spawnLavaParticles() {
    this.createParticles(Random.int(1, 2), "lavaSlow")
    this.timers.spawnLava.duration = Random.int(250, 800)
    this.timers.spawnLava.start()
  }
  die() {
    if(this.dying) return

    if(this.sprite.death) 
      this.playDeathAnimationAndDestroy()
    else
      GameObject.destroy(this)

    this.dying = true
    this.playDeathSound()
  }
  playDeathAnimationAndDestroy() {
    this.sprite.all.forEach(sprite => sprite.renderable = false)
    this.sprite.death.renderable = true
    this.sprite.death.gotoAndPlay(0)
    this.sprite.death.animationSpeed = 0.1
    this.sprite.death.loop = false
    this.sprite.death.onComplete = () => GameObject.destroy(this)
  }
  playDeathSound() {
    if(this.name.search(/small/i) !== -1)
      AudioManager.playSFX("asteroidDestroySmall")
    if(this.name.search(/medium/i) !== -1)
      AudioManager.playSFX("asteroidDestroyMedium")
    if(this.name.search(/large/i) !== -1)
      AudioManager.playSFX("asteroidDestroyLarge")
  }
  update() {
    this.move()
  }
  destroy() {
    
  }
  static minImpactSpeedToDamage = 80
}