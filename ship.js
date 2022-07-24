class Ship extends Rigid {
  constructor(pos, vel = Vector.zero(), rotation = 0, rotation_velocity = 0, name) {
    let ship = data.ships[name]
    super(pos, vel, rotation, rotation_velocity, ship.hitbox)
    this.model = ship.model
    this.type = "ship"
    this.name = name
    this.mass_base = ship.mass_base
    this.mass = this.mass_base
    this.dataref = ship
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
    this.cargo = _.cloneDeep(ship.cargo)
    this.weapons = _.cloneDeep(ship.systems.weapons)
    this.engines = _.cloneDeep(ship.systems.engines)
    this.hull = _.cloneDeep(ship.hull)
    this.brakes = _.cloneDeep(ship.systems.brakes)
    this.shields = _.cloneDeep(ship.systems.shields)
    this.dash = _.cloneDeep(ship.systems.dash)

    this.state = new State(
      "default",
      "skipping",
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
    this.skip = {
      pos_start: new Vector(0),
      pos_add: new Vector(0),
      duration: 0,
      ready: true
    }

    this.pulse_shield = {
      recharge_time: 2500,
      level: 1,
      level_max: 5,
      range: 250,
      arclen: 90 * PI/180,
      charged: true,
      sprite: PIXI.Sprite.from("assets/pulse_shield.png"),
      sprite_life: 0,
      sprite_life_max: 32,
    }
    this.pulse_shield.sprite.anchor.set(0.5)
    this.pulse_shield.sprite.alpha = 0.0
    this.sprite_container.addChild(this.pulse_shield.sprite)

    this.pulse_shield_recharge = () => {
      this.pulse_shield.charged = true
      this.sprites_special.shield_charge.alpha = 1.0
    }

    this.invulnerable_end = () => {
      this.invulnerable = false
    }
    this.dash_recharge = () => {
      this.dash.ready = true
      this.sprites_special.dash_indicator.alpha = 1.0
    }
    this.skip_recharge = () => {
      this.skip.ready = true
    }
    this.laser_fire = () => {
      let verts = [
        this.pos.clone(),
        this.target_pos.clone()
      ]
      verts.forEach(v => {
        v.data.health_init = 10
        v.data.health = 15
        v.data.owner = this
      })
      let diff = verts[1].clone()
      .sub(verts[0])
      .mult(8)
      verts[1] = verts[0].clone().add(diff)
      if(verts[1].distance(verts[0]) < Math.hypot(ch, cw)/2) {
        diff.mult(
          Math.hypot(ch, cw) / verts[1].distance(verts[0])
        )
        verts[1] = verts[0].clone().add(diff)
      }
      lasers.push(verts)
    }
    this.timers.add(
      ["skip", 500, {loop: false, active: false, onfinish: this.skip_end}],
      ["skip_recharge", 2500, {loop: false, active: false, onfinish: this.skip_recharge}],
      ["skip_submerge", 500, {loop: false, active: false, }],
      ["skip_emerge", 500, {loop: false, active: false, }],
      ["pulse_shield_recharge", this.pulse_shield.recharge_time, {loop: false, active: false, onfinish: this.pulse_shield_recharge}],
      ["invulnerable", data.invulnerability_window, {loop: false, active: false, onfinish: this.invulnerable_end}],
      ["dash_recharge", 600, {loop: false, active: false, onfinish: this.dash_recharge}],
      ["laser_charge", 1200, {loop: false, active: false, onfinish: this.laser_fire}],
    )

    ships.push(this)
    this.referenced_in.push(ships)
  }
  addToScene(scene) {
    this.scene = scene || layer_ships
    game.loc.objects.push(this)
    this.scene.addChild(this.sprite_container)
  }
  remove_from_scene() {
    this.scene.removeChild(this.sprite_container)
    game.loc.objects.splice(game.loc.objects.indexOf(this),1)
  }
  calculate_mass() {
    this.mass = this.mass_base + this.cargo.items.length
  }
  rotate(direction = [-1 || 1]) {
    // if(keys.shift) {
    //   let accel = new Vector(this.engines.main.accel, 0)
    //   accel.rotate(this.rotation)
    //   if(keys.rotateCCW && !keys.rotateCW) accel.rotate(PI/2 * -1)
    //   if(keys.rotateCW && !keys.rotateCCW) accel.rotate(PI/2)
    //   if(keys.rotateCW + keys.rotateCCW === 1) this.accelerate(accel)
    //   return
    // }
    let max_speed = this.rotation_speed_base + this.engines.steering.rotation_speed_bonus
    let smoothing = this.rotation_smoothing + this.engines.steering.glide_reduction

    this.rotation_velocity += (max_speed * direction) * smoothing
    if(this.rotation_velocity * direction > max_speed) this.rotation_velocity = max_speed * direction
    this.wrapRotation()
    this.sprite_container.rotation = this.rotation
  }
  reactor_upgrade() {

  }
  reactor_update() {

  }
  remove_power(system) {

  }
  add_power(system) {

  }
  weapon_mount(slot) {
  
  }   
  weapon_dismount(slot) {

  }
  update_rotation() {
    this.rotation += this.rotation_velocity * dt
    let smoothing = this.rotation_smoothing + this.engines.steering.glide_reduction

    if(!this.steering) this.rotation_velocity *= (1 - smoothing)
    if(Math.abs(this.rotation_velocity) < 0.01) this.rotation_velocity = 0
  }
  wrapRotation() {
    if(this.rotation >= PI*2) this.rotation = 0
    if(this.rotation < 0) this.rotation = PI*2
  }
  accelerate(vector = null) {
    if(this.state.is("skipping")) return
    let accel = vectorRotate(this.engines.main.accel, 0, this.rotation)
    // let accel = vector
    // if(!accel) {
    //   accel = new Vector(this.engines.main.accel, 0)
    //   accel.rotate(this.rotation)
    // }
    accel.y *= -1
    this.vel.x += accel.x * dtf
    this.vel.y += accel.y * dtf
  }
  move() {
    if(this.state.is("default") && this.vel.length() === 0) return

    if(this.state.is("skipping")) {
      this.pos.set(
        easeInOutQuad(this.timers.skip.curr, this.skip.pos_start.x, this.skip.pos_add.x, this.timers.skip.duration),
        easeInOutQuad(this.timers.skip.curr, this.skip.pos_start.y, this.skip.pos_add.y, this.timers.skip.duration),
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
    this.vel.x *= (1-this.brakes.power/100) * dtf
    this.vel.y *= (1-this.brakes.power/100) * dtf
    if(this.vel.length() < 0.04) this.vel.x = this.vel.y = 0
  }
  brakes_toggle_auto() {
    this.brakes.auto = !this.brakes.auto
  }
  decelerate() {
    if(this.state.is("skipping")) return
    let accel = vectorRotate(this.engines.braking.accel, 0, this.rotation)
    accel.y *= -1
    this.vel.x -= accel.x * dtf
    this.vel.y -= accel.y * dtf
  }
  fire(target_pos) {
    //determine which weapon is being fired and let it handle the logic internally
    console.log('fd')
    //placeholder projectile
    let angle_rad = Math.atan2(target_pos.y - this.pos.y, target_pos.x - this.pos.x)
    let base = vectorRotate(data.projectiles.debug_laser.speed, 0, -angle_rad)
    let vel = new Vector(base.x, base.y) 

    if(this === player.ship) {
      
      let target = game.loc.objects.find(obj => obj instanceof Ship && obj !== this)
      let proj = new Projectile(this.pos, vel, undefined, undefined, "missile_helios", this, target)

    }
    if(this !== player.ship) {
      new Projectile(this.pos, vel, undefined, undefined, "debug_laser", this)
    }



  }
  dash_init() {
    if(!this.dash.ready) return
    this.dash.ready = false
    this.timers.dash_recharge.restart()
    this.sprites_special.dash_indicator.alpha = 0.0
    //3 directions - forward, right, left, depending on keypresses, if you're only moving forward
    // then you dash forward, if you're moving forward && left || right, then you dash sideways,
    // if you're moving forward and press both forward, left and right, you dash forward
    let vec = Vector.fromAngle(mouse.ship_angle)
    vec.mult(this.dash.power * 100 + 400)
    this.vel.add(vec)
    //okay, to make this smooth, add the vector consecutively several times, first something like
    // 10% then 20% then 30% then 40%
  }
  hull_damage() {
    if(this.invulnerable) return
    this.hull.curr--
    this.invulnerable = true
    this.timers.invulnerable.restart()
  }
  hull_repair(amt) {
    if(this.hull.curr >= this.hull.level) return
    this.hull.curr++
  }
  hull_upgrade() {
    if(this.hull.level >= this.hull.level_max) return
    this.hull.level += 1
    this.hull.curr += 1
  }
  pulse_shield_activate() {
    let shield = this.pulse_shield
    if(!shield.charged) return
    this.sprites_special.shield_charge.alpha = 0.0
    shield.sprite.rotation = mouse.ship_angle - this.rotation
    shield.charged = false
    shield.sprite.alpha = 1.0
    shield.sprite_life = shield.sprite_life_max
    this.timers.pulse_shield_recharge.restart()

    let targets = rigids.filter(obj => obj.pos.distance(this.pos) < shield.range && obj !== this)
    targets.forEach(target => {
      let angle = Math.atan2(target.pos.y - this.pos.y, target.pos.x - this.pos.x)
      let angle2 = mouse.ship_angle
      console.log(angle, angle2)
      if(angle > angle2 - shield.arclen/2 && angle < angle2 + shield.arclen/2) {
        let vel = Vector.fromAngle(angle2).mult(750 + 750 * (shield.level/shield.level_max))
        vel.mult(1/target.mass)
        target.vel.add(vel)
        if(target.vel.length() > data.max_velocity) {
          console.log("too long",target.vel.length())
          target.vel.mult(data.max_velocity / target.vel.length())
        }
      }
      
    })
  }
  upgrade_pulse_shield() {
    if(this.pulse_shield.level === this.pulse_shield.level_max) return
    this.pulse_shield.level++
    this.pulse_shield.range += 50
  }
  update_pulse_shield_sprite() {
    let shield = this.pulse_shield
    if(shield.sprite_life <= 0) return
    shield.sprite_life--
    shield.sprite.alpha = Math.max(0, shield.sprite_life / shield.sprite_life_max)
    if(shield.sprite_life <= 0) {
      shield.sprite_life = 0
      shield.sprite.alpha = 0.0
    }
  }
  update_vwb_outline() {
    if(this.sprites_special.vwb_outline) this.sprites_special.vwb_outline.alpha = 0.3 * this.skip.ready
  }
  update_laser_charge_progress() {
    if(!this.sprites_special.laser_charge_progress) return
    let curr = this.timers.laser_charge.curr
    let step = this.timers.laser_charge.duration / 5
    let index = Math.floor(curr / step)
    this.sprites_special.laser_charge_progress.gotoAndStop(index)
  }
  skip_begin(target_pos) {
    if(this.state.is("skipping")) return
    if(!this.skip.ready) return
    this.state.set("skipping")
    console.log('skip began')
    this.vel.set(0)
    this.skip.pos_add = target_pos.clone().sub(this.pos)
    this.skip.pos_start = this.pos.clone()

    // let speed = 0.75
    // this.timers.skip.duration = this.skip.pos_add.length() / speed
    this.timers.skip.duration = 500 + this.skip.pos_add.length() / 4
    this.timers.skip.restart()
    this.timers.skip_recharge.restart()
    this.skip.ready = false
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
    let children = [this.sprites_special.ghost, this.sprites_special.skip]
    this.scene.removeChild(...children)
  }
  update() {
    if(this.hull.curr <= 0) {
      let npc = npcs.find(n => n.ship === this)
      if(npc) npc.destroy()
      else if(player.ship === this) console.log('you are daed')
      this.destroy()
      return
    }
    HitboxTools.updateHitbox(this)
    this.move()
    this.update_rotation()
    SpriteTools.update_sprite(this)
    this.update_pulse_shield_sprite()
    this.update_vwb_outline()
    this.update_laser_charge_progress()
    if(this.state.is("skipping")) this.sprite_container.filters = [filter_vwb]
    else
    if(this.invulnerable) this.sprite_container.filters = [filter_invul]
    else this.sprite_container.filters = []
    this.timers.update()
  }
  destroy() {
    //spawn a new ship once this one is destroyed, for testing purposes
    // let newtarget = game.loc.objects.find(obj => obj.type === "ship")
    // let newnpc = new NPC("Newguy McQuack", newtarget)
    // let newship = new Ship(new Vector(randR(-1200,1200),randR(-1200,1200)), new Vector(0), 0, 0, this.name)
    // newship.addToScene()
    // newnpc.assign_ship(newship)

    this.remove_from_scene()
    for (let i = 0; i < this.referenced_in.length; i++) {
      this.referenced_in[i].splice(this.referenced_in[i].indexOf(this), 1)
    }
    this.sprites.forEach(sprite => sprite.destroy())
    this.sprite_container.destroy()
  }
}