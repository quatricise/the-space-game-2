class Decoration {
  constructor(transform, src) {
    this.transform = transform || new Transform()
    this.sprite = PIXI.Sprite.from(src)
  }
  update() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt

    this.transform.rotation += this.transform.angularVelocity * dt

    this.sprite.position.set(this.transform.position.x, this.transform.position.y)
  }
}