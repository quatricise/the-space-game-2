// class MapImage extends GameObject {
//   constructor(transform, scale = 1, name) {
//     super(transform, BoxHitbox.default())
//     this.type = "mapImage"
//     this.name = name
//     this.scale = scale
//     this.scaleStep = 0.9
//     this.src = src
//     this.img = new Image()
//     this.img.src = src
//     this.img.onload = () => {
//       this.hitbox.w = this.img.naturalWidth * this.scale
//       this.hitbox.h = this.img.naturalHeight * this.scale
//     }
//   }
//   scaleDown() {
//     this.scale = this.sprite.scale.x * this.scaleStep
//     this.hitbox.w *= this.scaleStep
//     this.hitbox.h *= this.scaleStep
//   }
//   scaleUp() {
//     this.scale = this.sprite.scale.x / this.scaleStep
//     this.hitbox.w /= this.scaleStep
//     this.hitbox.h /= this.scaleStep
//   }
//   update() {
//     this.sprite.position.set(this.transform.position.x, this.transform.position.y)
//     this.sprite.scale.set(this.scale)
//   }
//   destroy() {
//     throw "use the GameObject.destroy()"
//     map.images.remove(this)
//     this.sprite.destroy()
//   }
// }
class MapImage extends GameObject {
  constructor(transform, scale, name) {
    console.log(transform, scale, name)
    super(transform)
    this.name = name
    this.type = "mapImage"
    this.scale = scale || 1
    this.scaleStep = 0.9

    this.hitbox = BoxHitbox.default()
    this.sprite = new Sprite(this)

    // this.src = src
    // this.img = new Image()
    // this.img.src = src
    // this.img.onload = () => {
    //   this.hitbox.w = this.img.naturalWidth * this.scale
    //   this.hitbox.h = this.img.naturalHeight * this.scale
    // }
  }
  scaleDown() {
    this.scale = this.sprite.scale.x * this.scaleStep
    this.hitbox.w *= this.scaleStep
    this.hitbox.h *= this.scaleStep
  }
  scaleUp() {
    this.scale = this.sprite.scale.x / this.scaleStep
    this.hitbox.w /= this.scaleStep
    this.hitbox.h /= this.scaleStep
  }
  update() {
    this.sprite.position.set(this.transform.position.x, this.transform.position.y)
    this.sprite.scale.set(this.scale)
  }
}