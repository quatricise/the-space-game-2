class Projectile extends GameObject {
  constructor(transform, name, owner, target) {
    super(transform)
    let objectData = data.projectile[name]
    this.type = "projectile"
    this.name = name
    this.impactDamage = objectData.impactDamage
    this.speed = objectData.speed
    this.owner = owner
    this.target = target
    this.mass = objectData.mass
    this.lifeMax = objectData.life
    this.life = objectData.life
    this.projectileData = objectData.projectileData
    this.components = ["sprite", "hitbox", "rigidbody"]
    this.registerComponents(objectData)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  rotateToTarget() {
    if(!this.target) return
    //this is too overpowered, should just find out if to turn left or right, this makes it not fun

    let angle = GameObject.angle(this, this.target)

    this.transform.rotation = angle
    let vec = Vector.fromAngle(angle).mult(this.speed)
    this.transform.velocity.set(vec.x, vec.y)
  }
  matchRotationToVelocity() {
    this.transform.rotation = this.transform.velocity.angle()
  }
  //#region methods specific per projectile name
  updateBlackhole() {
    let objs = Collision.broadphase(game, this)
    objs.forEach(obj => {
      let distanceMax = 800
      let distance = this.transform.position.distance(obj.transform.position)
          distance = Math.max(distanceMax - distance, 0)

      let angle = this.transform.position.angleTo(obj.transform.position)
      let strength = 120
      let vec = Vector.fromAngle(angle)
      .mult(strength)
      .mult(distance / distanceMax)
      .mult(dt)

      if(distance < distanceMax) 
        obj.transform.velocity.add(vec)
    })
  }
  updateFireball() {

  }
  updateMissileHelios() {
    this.rotateToTarget()
    this.matchRotationToVelocity()
    let currentSpeed = this.transform.velocity.length()
    if(currentSpeed < this.speed)
      this.transform.velocity.mult(1 + 1.2 * dt * (this.speed / currentSpeed))
    else
      this.transform.velocity.mult(1 + 0.1 * dt)
  }
  updatePlasmaShotI() {
    this.matchRotationToVelocity()
  }
  updateTrapMissile() {
    this.matchRotationToVelocity()
  }
  updateDebris() {

  }
  updateSnakeMissile() {
    let offsetVector = 
    new Vector(
      0,
      Math.sin(Date.now() / 100) * 400 * dt, 
    ).rotate(this.transform.rotation)
    this.transform.position.add(offsetVector)
  }
  updateLava() {

  }
  updateLavaBig() {
    
  }
  updateLavaSmall() {
      
  }
  //#endregion
  handleImpact(event) {
    this[this.projectileData.onHit](event)
  }
  //#region onHit methods
  plasmaExplode(event) {
    GameObject.create(
      "explosion", 
      "plasma", 
      {
        transform: new Transform(
          this.transform.position.clone()
        ),
        SFXName: "explosionPlasma" + Random.int(1, 2),
        collisionGroup: this.collisionGroup
      },
      {
        world: this.gameWorld,
      }
    )
    GameObject.destroy(this)
  }
  explode(event) {
    GameObject.create(
      "explosion", 
      "default", 
      {
        transform: new Transform(
          this.transform.position.clone(),
          new Vector(Random.int(-5, 5), Random.int(-5, 5)),
          Random.float(0, TAU),
          0
        ),
        SFXName: "explosionDefault"
      },
      {
        world: this.gameWorld
      }
    )
    GameObject.destroy(this)
  }
  trapTarget(event) {
    let target
    event.obj1 === this ? target = event.obj2 : target = event.obj1
    if(target instanceof Ship) {
      GameObject.create("gameOverlay", "movementTrap", {parent: target}, {world: this.gameWorld})
      new StatusEffect(target, "movementTrap")
    }
    GameObject.destroy(this)
  }
  dieAndCreateParticles(event) {
    GameObject.create(
      "particle", 
      this.projectileData.particleName, 
      {
        transform: new Transform(
          this.transform.position.clone().add(new Vector(...Random.intArray(-8, 8, 2))),
          this.transform.velocity.clone().normalize(Random.int(2, 25)),
          Random.rotation(),
          Random.float(-PI/2, PI/2)
        )
      },
      {
        world: this.gameWorld
      }
    )
    GameObject.destroy(this)
  }
  //#endregion
  updateLife() {
    this.life -= 1000 * dt
    if(this.life <= 0) 
      GameObject.destroy(this)
  }
  deleteIfFarFromPlayer() {
    if(GameObject.distanceFast(this, player.ship) > data.detectCollisionWithinThisFastDistanceOfPlayer)
      GameObject.destroy(this)
  }
  update() {
    this["update" + this.name.capitalize()]()
    this.move()
    this.updateLife()
    this.deleteIfFarFromPlayer()
  }
}