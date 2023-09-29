class Explosion extends GameObject {
  constructor(transform, name, SFXName) {
    super(transform)
    let objectData = data.explosion[name]
    this.type = "explosion"
    this.name = name
    for(let key in objectData)
      this[key] = objectData[key]

    this.components = [
      "sprite",
    ]
    this.registerComponents(objectData)
    this.setAsImmovable()
    this.play()
    AudioManager.playSFX(SFXName)
    setTimeout(() => this.affectNearbyObjects(), 100)
  }
  affectNearbyObjects() {
    let targets = Collision.broadphase(this.gameWorld, this, {exclude: [Interactable, HintGraphic, Hint, Explosion]})
    targets.forEach(target => {
      if(Collision.isSameCollisionGroup(this, target)) return
      if(target.immovable) return

      let distance = GameObject.distance(this, target) 
      if(distance > this.effectRadius) return

      let angle = GameObject.angle(this, target)
      let pushVector = Vector.fromAngle(angle).mult((1 - distance / (this.effectRadius * 2)) * this.strength).div(target.mass)
      target.transform.velocity.add(pushVector)

      let world = target.gameWorld

      target.handleImpact(CollisionEvent.fakeEvent(1, pushVector.length() * 6))
      
      if(target instanceof Ship)
      GameObject.create(
        "particle",
        target.name + "HullDamage",
        {
          transform: target.transform.clone()
        },
        {world}
      )
      if(this.name = "default") {
        let particle = GameObject.create(
          "particle",
          "explosionHit",
          {
            transform: new Transform(target.transform.position.clone(), undefined, Random.rotation())
          },
          {world}
        )
        particle.sprite.container.scale.set(Random.float(0.65, 1.0))
      }
    })
  }
  play() {
    this.sprite.container.position.set(this.transform.position.x, this.transform.position.y)
    this.transform.rotation = Math.random() * TAU
    this.sprite.linework.gotoAndPlay(0)
    this.sprite.linework.loop = false
    this.sprite.linework.animationSpeed = 0.1
    this.sprite.linework.onComplete = () => GameObject.destroy(this)
  }
  update() {

  }
}