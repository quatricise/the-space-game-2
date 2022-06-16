class Ship extends Rigid {
  constructor(pos, vel = Vector.zero(), rotation = 0, rotation_velocity = 0, ship) {
    super(pos, vel, rotation, rotation_velocity, ship.hitbox)
    this.model_name = ship.model_name

    this.inventory = _.cloneDeep(ship.inventory)
    this.weapons = _.cloneDeep(ship.systems.weapons)
    this.rotation_speed_base = ship.rotation_speed_base
    this.rotation_velocity = 0
    this.rotation_smoothing = ship.rotation_smoothing
    // this.accel = ship.accel
    // this.max_speed = ship.max_speed
    
    this.cell_pos = new Vector(Math.floor(this.pos.x / grid.cell_size), Math.floor(this.pos.y / grid.cell_size))
    
    this.invulnerable = false
    this.steering = false
    this.colliding = false
    
    //sprites
    this.sources = ship.sources
    this.sprite_container = new PIXI.Container()
    this.sprites = [] //actual PIXI.Sprite objects
    this.sprites_special = { // arrays of PIXI.Sprite objects which have special or unique function
      highlights: [], 
      animated: [],
    }
    //systems
    
    //okay - so if we don't find the requested object in ship.systems, we just add a dummy system
    //with disabled property instead
    this.engines = _.cloneDeep(ship.systems.engines)
    this.brakes = _.cloneDeep(ship.systems.brakes)
    this.shields = _.cloneDeep(ship.systems.shields)
    this.dash = _.cloneDeep(ship.systems.dash)

    //location
    this.location = {
      system: "tauri_b",
      planet: "tauri_b",
    }
    //crew
    this.crew = []
    this.captain = {}

    ships.push(this)
    this.referenced_in.push(ships)

    SpriteTools.constructSprites(this)
  }
  constructHitbox() {
    //after being spawned, it'll recalculate the hitbox data to be in the right position
  }
  addToScene() {
    layer_ships.addChild(this.sprite_container)
  }
  removeFromScene() {
    layer_ships.removeChild(this.sprite_container)
    // !! don't remove the ship from ships[], for continuity reasons
  }
  rotate(direction = [-1 || 1]) {
    let max_speed = this.rotation_speed_base + this.engines.steering.rotation_speed_bonus
    let smoothing = d.global.rotation_smoothing + this.engines.steering.glide_reduction

    this.rotation_velocity += (max_speed * direction) * smoothing
    if(this.rotation_velocity * direction > max_speed) this.rotation_velocity = max_speed * direction
    this.wrapRotation()
    this.sprite_container.rotation = this.rotation
  }
  updateRotation() {
    this.rotation += this.rotation_velocity * dt
    let smoothing = d.global.rotation_smoothing + this.engines.steering.glide_reduction

    if(!this.steering) this.rotation_velocity *= (1 - smoothing)
    if(Math.abs(this.rotation_velocity) < 0.01) this.rotation_velocity = 0
  }
  wrapRotation() {
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
    HitboxTools.updateHitbox(this)
  }
  takeDamage() {

  }
  accelerate() {
    let accel = vectorRotate(this.engines.main.accel, 0, this.rotation)
    accel.y *= -1
    this.vel.x += accel.x * dtf
    this.vel.y += accel.y * dtf
  }
  move() {
    if(this.vel.length() === 0) return

    let max_speed = this.engines.main.max_speed
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt

    let speed = this.vel.length()

    //softly clamp the max speed, without causing bumpy behaviour
    if(speed > max_speed) this.vel.mult(
      (max_speed / speed)*0.1
      +
      0.9
    )
  }
  brake() {
    this.vel.x *= (1-this.brakes.power/100) * dtf //todo - make the braking dependent on your brakes
    this.vel.y *= (1-this.brakes.power/100) * dtf
    if(this.vel.length() < 0.03) this.vel.x = this.vel.y = 0
  }
  decelerate() {
    //todo - this will be like braking but stronger and can make you go backwards
    this.brake() //temporary
  }
  animate() {

  }
  fire() {
    //here determine which weapon is being fired and let it handle the logic internally
    let angle_rad = Math.atan2(mouse.world_pos.y - this.pos.y, mouse.world_pos.x - this.pos.x)
    let vector = vectorRotate(data.projectiles.debug_laser.speed, 0, -angle_rad)
    let vel = new Vector(vector.x, vector.y)
    new Projectile(this.pos, vel)
  }
  dash() {
    //3 directions - forward, right, left, depending on keypresses, if you're only moving forward
    // then you dash forward, if you're moving forward && left || right, then you dash sideways,
    // if you're moving forward and press both forward, left and right, you dash forward
  }
  dock(object) {
    //this will take control away from the controlling entity and dock it into a station or some place,
    //specifying the a vec2 offset if it's not to be parked to the center of the object //maybe move this logic inside the station itself
  }
  skip() {

  }
  draw_ghosts() {

  }
  update() {
    this.updateHitbox()
    this.move()
    this.updateRotation()
    this.updateSprite()
    this.animate()
  }
  destroy() {
    for (let i = 0; i < this.referenced_in.length; i++) {
      this.referenced_in[i].splice(this.referenced_in[i].indexOf(this), 1)
    }
    this.sprites.forEach(sprite => sprite.destroy())
    this.sprite_container.destroy()
    this.removeFromScene()
  }
}

// Ship.prototype.add_body = Rigid.prototype.add_body
// Ship.prototype.offset_body = Rigid.prototype.offset_body
// Ship.prototype.remove_body = Rigid.prototype.remove_body
// Ship.prototype.offset_vertex = Rigid.prototype.offset_vertex
// Ship.prototype.move_point = Rigid.prototype.move_point
// Ship.prototype.remove_point = Rigid.prototype.remove_point
// Ship.prototype.get_indices = Rigid.prototype.get_indices