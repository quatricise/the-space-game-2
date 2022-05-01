class Entity {
  constructor(pos = Vector.zero(), vel = Vector.zero(), rotation = 0, rotation_velocity = 0) {
    this.pos = pos
    this.vel = vel
    this.rotation = rotation
    this.rotation_velocity = rotation_velocity
    this.id = 420 //todo some id system
    this.cell_pos = Vector.zero()
    this.referenced_in = [entities]
    entities.push(this)
  }
}

class Asteroid extends Entity {
  constructor(asteroid, pos, vel, rotation, rotation_velocity) {
    super(pos, vel, rotation, rotation_velocity)
    this.sources = asteroid.sources
    this.mass = asteroid.mass
    this.sprites = []
    this.sprites_special = {
      highlights: []
    }
    this.hitbox = _.cloneDeep(asteroid.hitbox)
    this.sprite_container = new PIXI.Container()
    SpriteTools.constructSprites(this)

    rigids.push(this)
  }
  addToScene() {
    app.stage.addChild(this.sprite_container)
  }
  update() {
    this.updateHitbox()
    this.move()
    this.rotate()
    this.updateSprite()
  }
  move() {
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt
  }
  rotate() {
    this.rotation += this.rotation_velocity * dt
    this.clampRotation()
    if(Math.abs(this.rotation_velocity) < 0.01) this.rotation_velocity = 0
  }
  clampRotation() {
    if(this.rotation >= PI*2) this.rotation = 0
    if(this.rotation < 0) this.rotation = PI*2
  }
  updateSprite() {
    this.sprite_container.position.x = this.pos.x
    this.sprite_container.position.y = this.pos.y
    this.sprite_container.rotation = this.rotation

    SpriteTools.updateHighlights(this)
  }
  updateHitbox() {

  }
  destroy() {

  }
}


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
