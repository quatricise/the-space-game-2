class BgObject extends GameObject {
  constructor(transform, name) {
    super(transform)
    this.type = "bg_object"
    this.name = name
    Sprite.construct(this)
  }
  rotation_update() {
    this.transform.rotation += this.transform.angular_velocity
    this.wrap_rotation()
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  update() {
    this.move()
    Sprite.update(this)
  }
  destroy() {
    this.sprites.forEach(s => s.destroy())
    this.container.destroy()
  }
}