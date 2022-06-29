class Ship extends Rigid {
  constructor(pos, vel = Vector.zero(), rotation = 0, rotation_velocity = 0, ship) {
    super(pos, vel, rotation, rotation_velocity, ship.hitbox)
    this.model = ship.model
    this.dataref = ship
    this.inventory = _.cloneDeep(ship.inventory)
    this.weapons = _.cloneDeep(ship.systems.weapons)
    this.rotation_speed_base = ship.rotation_speed_base
    this.rotation_velocity = 0
    this.rotation_smoothing = ship.rotation_smoothing

    this.cell_pos = new Vector(Math.floor(this.pos.x / grid.cell_size), Math.floor(this.pos.y / grid.cell_size))
    this.target_pos = this.pos.clone()
    this.vwb = false
    this.steering = false
    this.colliding = false
    
    this.sources = ship.sources
    SpriteTools.constructSprites(this)
    //systems
    this.engines = _.cloneDeep(ship.systems.engines)
    this.hull = _.cloneDeep(ship.hull)
    this.brakes = _.cloneDeep(ship.systems.brakes)
    this.shields = _.cloneDeep(ship.systems.shields)
    this.dash = _.cloneDeep(ship.systems.dash)

    this.state = new State(
      "default",
      "skipping"
    )
    //location
    this.location = {
      system: "tauri_b",
      planet: "tauri_b",
    }
    //crew
    this.crew = []
    this.captain = {}

    this.skip_end = () => {
      this.state.set("default")
      console.log('skip end')
      this.vwb = false

    }
    this.skip_data = {
      pos_start: new Vector(0),
      pos_add: new Vector(0),
      duration: 0
    }

    this.timers.add(
      ["skip", 500, {loop: false, active: false, onfinish: this.skip_end}],
      ["skip_submerge", 500, {loop: false, active: false, }],
      ["skip_emerge", 500, {loop: false, active: false, }],
    )

    ships.push(this)
    this.referenced_in.push(ships)
  }
  constructHitbox() {
    //?? unused
  }
  addToScene(scene) {
    this.scene = scene || layer_ships
    this.scene.addChild(this.sprite_container)
  }
  removeFromScene() {
    this.scene.removeChild(this.sprite_container)
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
  accelerate() {
    if(this.state.is("skipping")) return
    let accel = vectorRotate(this.engines.main.accel, 0, this.rotation)
    accel.y *= -1
    this.vel.x += accel.x * dtf
    this.vel.y += accel.y * dtf
  }
  move() {
    if(this.state.is("default") && this.vel.length() === 0) return

    if(this.state.is("skipping")) {
      this.pos.set(
        easeInOutQuad(this.timers.skip.curr, this.skip_data.pos_start.x, this.skip_data.pos_add.x, this.timers.skip.duration),
        easeInOutQuad(this.timers.skip.curr, this.skip_data.pos_start.y, this.skip_data.pos_add.y, this.timers.skip.duration),
      )
    }

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
    if(this.state.is("skipping")) return
    this.vel.x *= (1-this.brakes.power/100) * dtf //todo - make the braking dependent on your brakes
    this.vel.y *= (1-this.brakes.power/100) * dtf
    if(this.vel.length() < 0.04) this.vel.x = this.vel.y = 0
  }
  decelerate() {
    if(this.state.is("skipping")) return
    let accel = vectorRotate(this.engines.braking.accel, 0, this.rotation)
    accel.y *= -1
    this.vel.x -= accel.x * dtf
    this.vel.y -= accel.y * dtf
  }
  fire(target_pos) {
    //here determine which weapon is being fired and let it handle the logic internally
    if(this !== player.ship) {
      let angle_rad = Math.atan2(target_pos.y - this.pos.y, target_pos.x - this.pos.x)
      let vector = vectorRotate(data.projectiles.debug_laser.speed, 0, -angle_rad)
      let vel = new Vector(vector.x, vector.y).add(this.vel.clone().mult(0.2))
      new Projectile(this.pos, vel, undefined, undefined, data.projectiles.debug_laser, this)
    }

    //hitscan laser
    if(this === player.ship) {
      let verts = [
        this.pos.clone(),
        this.target_pos.clone()
      ]
      verts.forEach(v => {
        v.data.health_init = 10
        v.data.health = 10
        v.data.owner = this
      })
      let diff = verts[1].clone()
      .sub(verts[0])
      .mult(8)
      verts[1] = verts[0].clone().add(diff)
      lasers.push(verts)
    }
  }
  dash_init() {
    //3 directions - forward, right, left, depending on keypresses, if you're only moving forward
    // then you dash forward, if you're moving forward && left || right, then you dash sideways,
    // if you're moving forward and press both forward, left and right, you dash forward
    let vec = Vector.fromAngle(this.rotation)
    let dash_power = 500
    vec.mult(dash_power)
    this.vel.add(vec)
    //okay, to make this smooth, add the vector consecutively several times, first something like
    // 10% then 20% then 30% then 40%
  }
  dock(object) {
    //this will take control away from the controlling entity and dock it into a station or some place,
    //specifying the a vec2 offset if it's not to be parked to the center of the object //maybe move this logic inside the station itself
  }
  skip_begin(target_pos) {
    if(this.state.is("skipping")) return
    this.state.set("skipping")
    console.log('skip began')
    this.vel.set(0)
    this.skip_data.pos_add = target_pos.clone().sub(this.pos)
    this.skip_data.pos_start = this.pos.clone()

    // let speed = 0.75
    // this.timers.skip.duration = this.skip_data.pos_add.length() / speed
    this.timers.skip.duration = 500 + this.skip_data.pos_add.length() / 4
    this.timers.skip.restart()
    this.vwb = true
  }
  draw_ghost() {
    let [ghost, skip] = [this.sprites_special.ghost, this.sprites_special.skip]
    this.scene.addChild(ghost, skip)
    ghost.position.set(mouse.world_pos.x, mouse.world_pos.y)
    ghost.alpha = 0.2
    ghost.rotation = this.rotation

    skip.position.set(mouse.world_pos.x, mouse.world_pos.y)
    ghost.alpha = 0.2
  }
  hide_ghost() {
    let things = [this.sprites_special.ghost, this.sprites_special.skip]
    this.scene.removeChild(...things)
  }
  update() {
    if(this.hull.curr <= 0) {
      let npc = npcs.find(n => n.ship === this)
      if(npc) npc.destroy()
      else if(player.ship === this) console.log('player noob')
      this.destroy()
      return
    }
    HitboxTools.updateHitbox(this)
    this.move()
    this.updateRotation()
    SpriteTools.update_sprite(this)
    if(this.state.is("skipping")) this.sprite_container.filters = [filter_vwb]
    else this.sprite_container.filters = []
    this.timers.update()
  }
  destroy() {
    let newnpc = new NPC("Newguy McQuack")
    let newship = new Ship(new Vector(randR(-1200,1200),randR(-1200,1200)), new Vector(0), 0, 0, data.ships["crimson"])
    newship.addToScene()
    newnpc.assign_ship(newship)
    this.removeFromScene()
    for (let i = 0; i < this.referenced_in.length; i++) {
      this.referenced_in[i].splice(this.referenced_in[i].indexOf(this), 1)
    }
    this.sprites.forEach(sprite => sprite.destroy())
    this.sprite_container.destroy()
  }
}