class MapImage extends Rigid {
  constructor(transform, scale = 1, name) {
    super(transform, BoxHitbox.default())
    this.type = "map_image"
    this.name = name
    this.scale = scale
    this.scale_step = 0.9
    // this.src = src
    // this.img = new Image()
    // this.img.src = src
    // this.img.onload = () => {
    //   this.hitbox.w = this.img.naturalWidth * this.scale
    //   this.hitbox.h = this.img.naturalHeight * this.scale
    // }
    console.log(name)
    Sprite.construct(this)
  }
  scale_down() {
    this.scale = this.sprite.scale.x * this.scale_step
    this.hitbox.w *= this.scale_step
    this.hitbox.h *= this.scale_step
  }
  scale_up() {
    this.scale = this.sprite.scale.x / this.scale_step
    this.hitbox.w /= this.scale_step
    this.hitbox.h /= this.scale_step
  }
  update() {
    this.sprite.position.set(this.transform.position.x, this.transform.position.y)
    this.sprite.scale.set(this.scale)
  }
  destroy() {
    throw "use the GameObject.destroy()"
    map.images.remove(this)
    this.sprite.destroy()
  }
}