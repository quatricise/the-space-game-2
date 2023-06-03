class MapImage extends GameObject {
  constructor(transform, scale, name) {
    super(transform)
    let objectData = data.mapImage[name]
    this.name = name
    this.type = "mapImage"

    this.scale = scale || 1
    this.scaleStep = 0.9

    this.components = [
      "hitbox",
      "sprite",
    ]
    this.registerComponents(objectData)

    this.source = sources.img.mapImage[name].folder + sources.img.mapImage[name].auto[0] + ".png"
    this.img = new Image()
    this.img.src = this.source
    this.img.onload = () => {
      if(!this.hitbox.w || !this.hitbox.h)
        throw "mapImage can only have a box hitbox"
      this.hitbox.w = this.img.naturalWidth * this.scale
      this.hitbox.h = this.img.naturalHeight * this.scale
    }
  }
  cull() {
    //this is an override of the default method to prevent the large image in world map from disappearing
  }
  scaleDown() {
    this.scale = this.sprite.container.scale.x * this.scaleStep
    this.hitbox.w *= this.scaleStep
    this.hitbox.h *= this.scaleStep
  }
  scaleUp() {
    this.scale = this.sprite.container.scale.x / this.scaleStep
    this.hitbox.w /= this.scaleStep
    this.hitbox.h /= this.scaleStep
  }
  setScale(scale) {
    let factor = scale / this.scale
    this.hitbox.w *= factor
    this.hitbox.h *= factor
    this.scale = scale
  }
  update() {
    this.sprite.container.position.set(this.transform.position.x, this.transform.position.y)
    this.sprite.container.scale.set(this.scale)
  }
}