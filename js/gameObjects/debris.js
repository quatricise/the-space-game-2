class Debris extends GameObject {
  constructor(transform, name) {
    let objectData = data.debris[name]
    super(transform)
    this.type = "debris"
    this.name = name
    this.mass = objectData.mass
    this.health = objectData.health
    this.debrisYield = objectData.debrisYield ?? {min: 0, max: 0}
    this.scrappable = objectData.scrappable ?? true
    this.components = [
      "hitbox",
      "sprite",
      "rigidbody",
    ]
    this.registerComponents(objectData)

    if(Random.chance(50))
      this.transform.angularVelocity += Random.float(-0.20, 0.20)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  handleImpact(event) {
    if(event.impactSpeed > 35)
      this.takeDamage(event.impactDamage)
  }
  takeDamage(amount) {
    this.health -= amount

    AudioManager.playSFX("hullDamage")

    if(this.health <= 0)
      GameObject.destroy(this)
  }
  update() {
    this.move()
  }
  destroy() {
    for(let i = 0; i < 2; i++)
    GameObject.create(
      "particle", 
      "debris", 
      {
        transform: new Transform(
          this.transform.position.clone().add(new Vector(...Random.intArray(-10, 10, 2))),
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
}