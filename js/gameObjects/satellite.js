class Satellite extends GameObject {
  constructor(transform, name) {
    super(transform)
    let objectData = data.satellite[name]
    this.type = "satellite"
    this.name = name
    this.mass = objectData.mass ?? console.error("object mass (: number) missing", this)
    this.health = objectData.health
    this.components = [
      "sprite",
      "hitbox",
      "rigidbody",
      "wreckHitboxVault",
      "wreck",
    ]
    this.shipSystems = _.cloneDeep(objectData.systems)
    this.registerComponents(objectData)
    this.update()
  }
  takeDamage(amount) {
    this.health -= amount
    if(this.health <= 0)
      this.wreck.activate()
  }
  handleImpact(event) {
    this.takeDamage(event.impactDamage)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  update() {
    this.move()
  }
}