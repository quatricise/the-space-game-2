class Asteroid extends Rigid {
  constructor(pos, vel, rotation, rotation_velocity, name) {
    let asteroid = data.asteroids[name]
    super(pos, vel, rotation, rotation_velocity, asteroid.hitbox)
    this.name = name
    this.type = "asteroid"
    this.dataref = asteroid
    this.sources = asteroid.sources
    this.mass = asteroid.mass
    this.material = asteroid.material
    this.sprites = []
    this.sprites_special = {
      highlights: []
    }
    this.sprite_container = new PIXI.Container()
    SpriteTools.constructSprites(this)
  }
  addToScene(container) {
    this.scene = container || layer_debris
    this.scene.addChild(this.sprite_container)
    this.disabled = false
  }
  removeFromScene() {
    this.disabled = true
    this.scene.removeChild(this.sprite_container)
  }
  move() {
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt
  }
  rotate() {
    this.rotation += this.rotation_velocity * dt
    this.wrapRotation()
    if(Math.abs(this.rotation_velocity) < 0.01) this.rotation_velocity = 0
  }
  wrapRotation() {
    if(this.rotation >= PI*2) this.rotation = 0
    if(this.rotation < 0) this.rotation = PI*2
  }
  destroy() {
    for (let i = 0; i < this.referenced_in.length; i++) {
      let index = this.referenced_in[i].indexOf(this)
      this.referenced_in[i].splice(index, 1)
    }
    this.sprite_container.destroy()
    this.sprites.forEach(sprite => sprite.destroy())
    this.removeFromScene()
  }
  update() {
    this.move()
    this.rotate()
    this.updateSprite()
  }
}

class GlobalMethods {
  static updateSprite() {
    this.sprite_container.position.x = this.pos.x
    this.sprite_container.position.y = this.pos.y
    this.sprite_container.rotation = this.rotation
    SpriteTools.updateHighlights(this)
  }
}

Asteroid.prototype.updateSprite = GlobalMethods.updateSprite

//todo i wanna do away with inheritance entirely and use some sort of prototype composition approach


//todo, it'll model asteroid
// class ShipDebris extends Entity {
//   constructor() {
//     super()
//   }
//   update() {
//     this.move()
//     this.updateSprite()
//   }
//   move() {

//   }
//   updateSprite() {

//   }
//   destroy() {

//   }
// }
