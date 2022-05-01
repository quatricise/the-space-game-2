class Ship {
  constructor(ship, pos, rotation) {
    this.model_name = ship.model_name
    this.pos = pos
    this.vel = Vector.zero()
    this.rotation = rotation
    this.hitbox = _.cloneDeep(ship.hitbox)  //?? dunno where exactly to store hitbox // a standardized hitbox for all rigidbody entities
    this.hitbox_relative = _.cloneDeep(ship.hitbox)
    this.inventory = {
      items: [],
      capacity: ship.inventory.capacity
    }
    this.rotation_speed = ship.rotation_speed_base * PI/180 //rad per second
    this.rotation_velocity = 0 //this'll control the smoothing of the rotation, positive == CW, negative == CCW
    this.accel = ship.accel
    this.max_speed = ship.max_speed

    this.invulnerable = false
    this.steering = false

    //sprites
    this.sources = ship.sources
    this.sprite_container = new PIXI.Container()
    this.sprites = [] //actual PIXI.Sprite objects
    this.sprites_special = {
      highlights: [], //array of sprites
      animated: [],
    }
    this.cell_pos = Vector.zero() // this'll be later recalculated for all entities on each tick
    this.brakes = ship.brakes
    this.shields = ship.shields
    this.dash = ship.dash

    entities.push(this)
    rigids.push(this)
    ships.push(this)

    SpriteTools.constructSprites(this)
  }
  constructHitbox() {
    //after being spawned, it'll recalculate the hitbox data to be in the right position
  }

  addToScene() {
    app.stage.addChild(this.sprite_container)
  }
  removeFromScene() {
    entities = entities.filter(entity => entity !== this)
    rigids = rigids.filter(rigid => rigid !== this)
    app.scene.removeChild(this.container)
    // !! don't remove the ship from ships[], 
  }
  rotateCW() {
    this.rotation_velocity += (this.rotation_speed) * d.global.rotation_smoothing
    if(this.rotation_velocity > this.rotation_speed) this.rotation_velocity = this.rotation_speed
    this.clampRotation()
    this.sprite_container.rotation = this.rotation
  }
  rotateCCW() {
    this.rotation_velocity -= (this.rotation_speed) * d.global.rotation_smoothing
    if(this.rotation_velocity < this.rotation_speed * -1 ) this.rotation_velocity = this.rotation_speed * -1
    this.clampRotation()
    this.sprite_container.rotation = this.rotation
  }
  rotate() {
    this.rotation += this.rotation_velocity * dt
    if(!this.steering) this.rotation_velocity *= 0.5
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
    if(this.hitbox.type !== "polygon") return
    HitboxTools.updatePolygonHitbox(this)
    HitboxTools.rotatePolygonHitbox(this)
  }
  takeDamage() {

  }
  accelerate() {
    let accel = vectorRotate(this.accel, 0, this.rotation)
    accel.y *= -1
    this.vel.x += accel.x * dtf
    this.vel.y += accel.y * dtf
  }
  move() {
    if(this.vel.length() === 0) return

    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt

    let speed = this.vel.length()
    //softly clamp the max speed, without causing bumpy behaviour
    if(speed > this.max_speed) this.vel.mult(
      (this.max_speed / speed)*0.1
      +
      0.9
    )
  }
  brake() {
    this.vel.x *= 0.97 * dtf
    this.vel.y *= 0.97 * dtf
    if(this.vel.length() < 0.03) this.vel.x = this.vel.y = 0
  }
  animate() {

  }
  fire() {
    //here determine which weapon is being fired and let it handle the logic internally
  }
  update() {
    this.updateHitbox()
    this.move()
    this.rotate()
    this.updateSprite()
    this.animate()
  }
}