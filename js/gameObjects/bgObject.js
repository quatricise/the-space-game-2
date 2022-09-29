class BgObject extends GameObject {
  constructor(transform, name) {
    super(transform)
    this.type = "bgObject"
    this.name = name
    this.sprite = new Sprite(this)
  }
  rotationUpdate() {
    this.transform.rotation += this.transform.angularVelocity
    this.wrapRotation()
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