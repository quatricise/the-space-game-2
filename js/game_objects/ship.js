class Ship extends Rigid {
  constructor(transform, name) {
    let ship = data.ship[name]
    super(transform, ship.hitbox)
    this.model = ship.model
    this.type = "ship"
    this.name = name
    this.mass_base = ship.mass_base
    this.mass = this.mass_base
    this.dataref = ship
    this.rotation_speed_base = ship.rotation_speed_base
    this.rotation_velocity = 0
    this.glide_reduction = ship.glide_reduction
    
    // this.cell_pos = new Vector(Math.floor(this.transform.position.x / grid.cell_size), Math.floor(this.transform.position.y / grid.cell_size))
    this.target_position = new Vector()
    this.steering = false
    this.braking = false
    this.colliding = false
    this.stuck = false
    this.wrecked = false
    this.weapon_slots = ship.weapon_slots
    Sprite.construct(this)

    // let hard_shields = PIXI.Sprite.from("assets/ship_system/shields/hard_light/shields_hard_light.png")
    // this.sprite.shield_hard_light = hard_shields
    // this.container.addChild(hard_shields)
    // hard_shields.anchor.set(0.5)
    if(this.sprite.wreck) this.wreck_vels = this.sprite.wreck.map(obj => new Vector(randR(-25,25),randR(-25,25)))
    if(this.sprite.wreck) this.wreck_rots = this.sprite.wreck.map(obj => randR(-0.2, 0.2))

    this.reactor = _.cloneDeep(ship.reactor)
    this.cargo = _.cloneDeep(ship.cargo)
    this.weapons = new ShipSystemWeapons(ship)
    this.engines = _.cloneDeep(ship.systems.engines)
    this.hull = _.cloneDeep(ship.hull)
    this.brakes = _.cloneDeep(ship.systems.brakes)
    this.shields = _.cloneDeep(ship.systems.shields)
    this.dash = _.cloneDeep(ship.systems.dash)

    this.state = new State(
      "default",
      "skipping",
    )
    //where the ship currently resides
    // this.location = {
    //   system: "tauri_b",
    //   planet: "tauri_b",
    // }
    // this.crew = []
    // this.captain = {}
    // this.pilot = "ada"
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
    this.hard_shield = {
      radius: 128,
      arclen: PI/2,
      rot_offset: -PI/4,
      pos: this.transform.position.clone()
    }
    this.pulse_shield.sprite.anchor.set(0.5)
    this.pulse_shield.sprite.alpha = 0.0
    this.container.addChild(this.pulse_shield.sprite)
    //#region arrow methods controlled by timers
    this.skip_end = () => {
      this.state.set("default")
      this.exit_void()
    }
    this.pulse_shield_recharge = () => {
      this.pulse_shield.charged = true
      this.sprite.shield_charge.alpha = 1.0
    }

    this.invulnerable_end = () => {
      this.invulnerable = false
    }
    this.dash_recharge = () => {
      this.dash.ready = true
      this.sprite.dash_indicator.alpha = 1.0
    }
    this.skip_recharge = () => {
      this.skip.ready = true
    }
    this.laser_fire = () => {
      let verts = [
        this.transform.position.clone(),
        this.target_position.clone()
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
    //#endregion
    this.timers.add(
      ["skip", data.ship_skip_time, {loop: false, active: false, onfinish: this.skip_end}],
      ["skip_recharge", 2500, {loop: false, active: false, onfinish: this.skip_recharge}],
      ["skip_submerge", 500, {loop: false, active: false, }],
      ["skip_emerge", 500, {loop: false, active: false, }],
      ["pulse_shield_recharge", this.pulse_shield.recharge_time, {loop: false, active: false, onfinish: this.pulse_shield_recharge}],
      ["invulnerable", data.invulnerability_window, {loop: false, active: false, onfinish: this.invulnerable_end}],
      ["dash_recharge", 700, {loop: false, active: false, onfinish: this.dash_recharge}],
      ["laser_charge", 1200, {loop: false, active: false, onfinish: this.laser_fire}],
    )
  }
  calculate_mass() {
    this.mass = this.mass_base + this.cargo.items.length
  }
  reactor_upgrade() {
    this.reactor.power < this.reactor.power_max ? this.reactor.power++ : null
  }
  reactor_update() {

  }
  remove_power(system) {
    if(system.power === 0) return
    system.power--
    this.reactor.power_free++
  }
  add_power(system) {
    if(system.power === system.level || this.reactor.power_free === 0) return
    system.power++
    this.reactor.power_free--
  }
  cargo_unload(item) {
    this.cargo.remove(item)
  }
  cargo_load(item) {
    this.cargo.push(item)
  }
  weapon_mount(item) {
    //transfer item object from cargo into weapons, and add weapon object 
    let slot = 1
    this.cargo_unload()
    let weapon = new Weapon(this, item, slot, data.weapon_full.missile_helios.methods)
    this.weapons.weapons.push(weapon)
  }   
  weapon_dismount(weapon) {
    Item.create(weapon, "weapon")
    this.weapons.weapons.remove(weapon)
  }
  rotate(direction = [-1 || 1]) {
    //sideways motion idea, this doesn't work but I want it to
    // if(keys.shift) {
    //   let accel = vectorRotate(this.engines.main.accel, 0, this.rotation)
    //   accel.y *= -1
    //   if(!keys.rotateCW && keys.rotateCCW) accel.rotate(-PI/2)
    //   if(keys.rotateCW && !keys.rotateCCW) accel.rotate( PI/2)
    //   if(keys.rotateCW + keys.rotateCCW === 1) this.accelerate(accel)
    //   return
    // }
    if(this.stuck) return
    let max_speed = this.rotation_speed_base + this.engines.steering.rotation_speed_bonus
    let smoothing = this.glide_reduction + this.engines.steering.glide_reduction

    this.rotation_velocity += (max_speed * direction) * smoothing
    if(this.rotation_velocity * direction > max_speed) this.rotation_velocity = max_speed * direction
    this.wrap_rotation()
    this.container.rotation = this.rotation
  }
  rotation_update() {
    this.rotation += this.rotation_velocity * dt
    let smoothing = this.glide_reduction + this.engines.steering.glide_reduction

    if(!this.steering) this.rotation_velocity *= (1 - smoothing)
    if(Math.abs(this.rotation_velocity) < 0.01) this.rotation_velocity = 0
  }
  accelerate(vector) {
    if(this.state.is("skipping")) return
    let accel = vector
    if(!accel) {
      accel = vectorRotate(this.engines.main.accel, 0, this.rotation)
      accel.y *= -1
    }
    this.transform.velocity.x += accel.x * dtf
    this.transform.velocity.y += accel.y * dtf
  }
  decelerate() {
    if(this.state.is("skipping")) return
    let accel = vectorRotate(this.engines.main.accel, 0, this.rotation)
    accel.y *= -1
    this.transform.velocity.x -= accel.x * dtf
    this.transform.velocity.y -= accel.y * dtf
  }
  move() {
    if(this.state.is("default") && this.transform.velocity.length() === 0) return
    if(this.state.is("skipping")) {
      this.transform.position.set(
        Ease.InOut(this.timers.skip.curr, this.skip.pos_start.x, this.skip.pos_add.x, this.timers.skip.duration),
        Ease.InOut(this.timers.skip.curr, this.skip.pos_start.y, this.skip.pos_add.y, this.timers.skip.duration),
      )
    }
    let max_speed = this.engines.main.max_speed
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt

    //glide reduction
    let glide_redux = this.engines.steering.glide_reduction
    let directional_velocity = vectorRotate(this.transform.velocity.length(), 0, this.rotation).mult(glide_redux)
    directional_velocity.y *= -1
    this.transform.velocity.mult(1 - glide_redux)
    this.transform.velocity.add(directional_velocity)
    let speed = this.transform.velocity.length()

    //softly clamp the max speed, without causing bumpy behaviour
    if(speed > max_speed) this.transform.velocity.mult(
      (max_speed / speed)*0.1
      +
      0.9
    )
  }
  brake() {
    if(this.state.is("skipping")) return
    this.transform.velocity.x *= (1-this.brakes.power/100) * dtf
    this.transform.velocity.y *= (1-this.brakes.power/100) * dtf
    if(this.transform.velocity.length() < 0.04) this.transform.velocity.set(0)
  }
  brakes_toggle_auto() {
    this.brakes.auto = !this.brakes.auto
  }
  fire(target_position) {
    //placeholder projectile
    let angle = Math.atan2(target_position.y - this.transform.position.y, target_position.x - this.transform.position.x) // ????
    let base = vectorRotate(data.projectile.blackhole.speed, 0, -angle)
    let vel = new Vector(base.x, base.y) 

    if(this === player.ship) {
      //blackhole
      GameObject.create("projectile", "blackhole", {
        pos: this.transform.position, 
        vel: vel, 
        rotation: angle, 
        rotation_velocity: 0, 
        owner: this, 
        target: null
      },
      {
        world: game
      })
    }
  }
  on_hit(projectile) {
    this.hull_damage(projectile.impact_damage)
  }
  dash_init() {
    if(!this.dash.ready) return
    this.dash.ready = false
    this.timers.dash_recharge.restart()
    this.sprite.dash_indicator.alpha = 0.0
    //3 directions - forward, right, left, depending on keypresses, if you're only moving forward
    // then you dash forward, if you're moving forward && left || right, then you dash sideways,
    // if you're moving forward and press both forward, left and right, you dash forward
    let vec = Vector.fromAngle(mouse.ship_angle)
    vec.mult(this.dash.power * data.dash_power/4 + data.dash_power)
    this.transform.velocity.add(vec)
    //okay, to make this smooth, add the vector consecutively several times, first something like
    // 10% then 20% then 30% then 40%
  }
  hull_damage() {
    if(this.invulnerable) return
    this.hull.curr--
    if(this.hull.level <= 0) this.wreck()
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
    this.sprite.shield_charge.alpha = 0.0
    shield.sprite.rotation = mouse.ship_angle - this.rotation
    shield.charged = false
    shield.sprite.alpha = 1.0
    shield.sprite_life = shield.sprite_life_max
    this.timers.pulse_shield_recharge.restart()

    let targets = rigids.filter(obj => obj.pos.distance(this.transform.position) < shield.range && obj !== this)
    targets.forEach(target => {
      let angle = Math.atan2(target.pos.y - this.transform.position.y, target.pos.x - this.transform.position.x)
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
  pulse_shield_upgrade() {
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
    if(this.wrecked) return
    if(this.sprite.vwb_outline) this.sprite.vwb_outline.alpha = 0.3 * this.skip.ready
  }
  update_laser_charge_progress() {
    if(!this.sprite.laser_charge_progress) return
    let curr = this.timers.laser_charge.curr
    let step = this.timers.laser_charge.duration / 5
    let index = Math.floor(curr / step)
    this.sprite.laser_charge_progress.gotoAndStop(index)
  }
  toggle_brake_indicator(state = 0) {
    if(!this.sprite.brake_indicator) return
    this.sprite.brake_indicator.alpha = 1 * state
  }
  update_wreck() {
    if(!this.wrecked) return
    this.sprite.wreck.forEach((sprite, i) => {
      sprite.position.set(
        sprite.position.x + (this.wreck_vels[i].x * dt),
        sprite.position.y + (this.wreck_vels[i].y * dt),
      )
      sprite.rotation = this.wreck_rots[i]
    })
  }
  skip_begin(target_position) {
    if(this.state.is("skipping")) return
    if(!this.skip.ready) return
    this.state.set("skipping")
    this.transform.velocity.set(0)
    this.skip.pos_add = target_position.clone().sub(this.transform.position)
    this.skip.pos_start = this.transform.position.clone()
    this.timers.skip.duration = data.ship_skip_time + this.skip.pos_add.length() / 4
    this.timers.skip.restart()
    this.timers.skip_recharge.restart()
    this.skip.ready = false
    this.enter_void()
  }
  draw_ghost() {
    let [ghost, skip] = [this.sprite.ghost, this.sprite.skip]
    this.stage.addChild(ghost, skip)
    ghost.position.set(mouse.world_pos.x, mouse.world_pos.y)
    ghost.alpha = 0.2
    ghost.rotation = this.rotation
    skip.position.set(mouse.world_pos.x, mouse.world_pos.y)
    ghost.alpha = 0.2
  }
  hide_ghost() {
    let children = [this.sprite.ghost, this.sprite.skip]
    this.stage.removeChild(...children)
  }
  update() {
    if(this.hull.curr <= 0) {
      let npc = npcs.find(n => n.ship === this)
      if(npc) npc.destroy()
      this.wreck()
    }
    this.move()
    this.rotation_update()
    this.update_pulse_shield_sprite()
    this.update_vwb_outline()
    this.update_laser_charge_progress()

    if(this.state.is("skipping")) 
    this.container.filters = [filter_vwb, filter_glitch, filter_dist_map]
    else 
    if(this.invulnerable) 
    this.container.filters = [filter_invul]
    else this.container.filters = []

    this.update_wreck()
  }
  update_visual() {
    this.hard_shield.pos.set_from(this.transform.position)
  }
  wreck() {
    if(this.wrecked) return
    this.container.filters = []
    this.invulnerable = false
    this.wrecked = true
    let explosion = Sprite.animated_sprite("assets/explosion/generic_explosion_0000.png", 12)
    explosion.play()
    explosion.loop = false
    explosion.rotation = randR(0, PI*2)
    explosion.animationSpeed = 0.12
    explosion.onComplete = () => {this.container.removeChild(explosion);explosion.destroy()}
    explosion.anchor.set(0.5)
    this.container.addChild(explosion)
    this.sprite.wreck.forEach(sprite => sprite.alpha = 1.0)
    this.sprite.flame.alpha = 0.0
    this.sprite.glow.alpha = 0.0
    this.sprite.fill.alpha = 0.0
    this.sprite.linework.alpha = 0.0
    this.sprite.highlights.forEach(sprite => sprite.alpha = 0.0)
    this.sprite.shield_charge.alpha = 0.0
    this.sprite.vwb_outline.alpha = 0.0
    this.sprite.dash_indicator.alpha = 0.0
    this.sprite.brake_indicator.alpha = 0.0
    if(this.sprite.laser_charge_progress) this.sprite.laser_charge_progress.alpha = 0.0
  }
}