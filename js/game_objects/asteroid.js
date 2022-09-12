class Asteroid extends Rigid {
  constructor(transform, name) {
    let asteroid = data.asteroid[name]
    super(transform, asteroid.hitbox)
    this.type = "asteroid"
    this.name = name
    this.dataref = asteroid
    this.mass = asteroid.mass
    this.health = asteroid.health
    this.material = asteroid.material
    Sprite.construct(this)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  rotate() {
    this.rotation += this.rotation_velocity * dt
    this.wrap_rotation()
  }
  take_damage() {
    this.health--
    if(this.health <= 0) this.destroy()
  }
  destroy() {
    
  }
  update() {
    this.move()
    this.rotate()
  }
}