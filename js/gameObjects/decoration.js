class Decoration {
  constructor(transform, name) {
    this.transform = transform || new Transform()
    this.type = "decoration"
    this.name = name
    this.id = Random.uniqueIDHEX()

    /* 
    get sprite source to avoid having to create a sprite component 
    the sprite source is ALWAYS linework.png
    */
    let folder = sources.img.decoration[name].folder
    let src = folder + "linework.png"

    this.sprite = PIXI.Sprite.from(src)
    this.sprite.anchor.set(0.5)
    this.sprite.rotation = this.transform.rotation
  }
  set alpha(/** @type Float - 0 to 1 */ value) {
    this.sprite.alpha = clamp(value, 0, 1)
  }
  get alpha() {
    return this.sprite.alpha
  }
  update() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
    this.transform.rotation += this.transform.angularVelocity * dt
    this.sprite.position.set(this.transform.position.x, this.transform.position.y)
    this.sprite.rotation = this.transform.rotation
  }
  destroy() {
    this.stage.removeChild(this.sprite)
  }
}