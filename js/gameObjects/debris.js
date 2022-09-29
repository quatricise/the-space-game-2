class Debris extends Rigid {
  constructor(transform, name) {
    let debris = data.debris[name]
    super(transform, debris.hitbox)
    this.type = "debris"
    this.name = name
    this.mass = debris.mass
    this.health = debris.health
    Sprite.construct(this)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  rotate() {
    this.rotation += this.transform.angularVelocity * dt
    this.wrapRotation()
    if(Math.abs(this.transform.angularVelocity) < 0.01) this.transform.angularVelocity = 0
  }
  update() {
    this.move()
    this.rotate()
  }
}