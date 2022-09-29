class Asteroid extends GameObject {
  constructor(transform, name) {
    let asteroid = data.asteroid[name]
    super(transform)
    this.type = "asteroid"
    this.name = name
    console.log(this.type, this.name);
    this.dataref = asteroid
    this.mass = asteroid.mass
    this.health = asteroid.health
    this.material = asteroid.material
    // this.hitbox = new Hitbox(this, colors.hitbox.noCollision, true)
    this.sprite = new Sprite(this)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  rotate() {
    this.rotation += this.rotationVelocity * dt
    this.wrapRotation()
  }
  takeDamage() {
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