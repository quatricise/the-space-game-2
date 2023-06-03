class Fragment extends GameObject {
  constructor(transform, name, parent, fragmentData) {
    super(transform)
    let objectData = {
      hitbox: {
        type: "polygonHitbox",
        filename: null,
        definition: fragmentData.hitbox
      }
    }
    this.mass = parent.mass / 3
    this.health = 3
    this.scrappable = true
    this.debrisYield = {min: 6, max: 12}
    this.type = "fragment"
    this.name = name

    this.parent = parent
    this.parentName = parent.name
    setTimeout(() => delete this.parent, 0)

    this.components = ["hitbox", "rigidbody"]
    this.registerComponents(objectData)
    this.addSpriteComponentToFragment(fragmentData.index)
    this.update()
    this.timers = new Timer(
      ["invulnerableWindow", 500, {loop: false, active: false, onfinish: this.setInvulnerableState.bind(this, false)}]
    )
  }
  handleImpact(event) {
    if(event.impactSpeed > 50) 
      this.takeDamage(event.impactDamage)
  }
  setInvulnerableState(bool) {
    this.invulnerable = bool
  }
  takeDamage(amt) {
    if(this.invulnerable) return

    this.health -= amt
    this.invulnerable = true
    this.timers.invulnerableWindow.start()

    AudioManager.playSFX("hullDamage")
    this.createParticles()

    if(this.health <= 0)
      GameObject.destroy(this)
  }
  createParticles() {
    console.count("createParticlesFragment")
    let particleName = data.particle[this.parentName + "HullDamage"] ? this.parentName + "HullDamage" : "debris"
    let count = Random.int(1, 2)
    for(let i = 0; i < count; i++)
    GameObject.create(
      "particle", 
      particleName,
      {
        transform: new Transform(
          this.transform.position.clone().add(new Vector(...Random.intArray(-25, 25, 2))),
          this.transform.velocity.clone().normalize(Random.int(2, 25)),
          Random.rotation(),
          Random.float(-PI/2, PI/2)
        )
      },
      {
        world: this.gameWorld
      }
    )
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  update() {
    this.move()
  }
}