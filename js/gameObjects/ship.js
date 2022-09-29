// class Ship extends Rigid {
//   constructor(transform, name) {
//     let ship = data.ship[name]
//     super(transform, ship.hitbox)
//     this.model = ship.model
//     this.type = "ship"
//     this.name = name
//     this.massBase = ship.massBase
//     this.mass = this.massBase
//     this.dataref = ship
//     this.rotationSpeedBase = ship.rotationSpeedBase
//     this.rotationVelocity = 0
//     this.glideReduction = ship.glideReduction
    
//     // this.cellPosition = new Vector(Math.floor(this.transform.position.x / grid.cellSize), Math.floor(this.transform.position.y / grid.cellSize))
//     this.targetPosition = new Vector()
//     this.steering = false
//     this.braking = false
//     this.colliding = false
//     this.stuck = false
//     this.wrecked = false
//     this.weaponSlots = ship.weaponSlots
//     Sprite.construct(this)

//     // let hardShields = PIXI.Sprite.from("assets/shipSystem/shields/hardLight/shieldsHardLight.png")
//     // this.sprite.shieldHardLight = hardShields
//     // this.container.addChild(hardShields)
//     // hardShields.anchor.set(0.5)
//     if(this.sprite.wreck) this.wreckVels = this.sprite.wreck.map(obj => new Vector(randR(-25,25),randR(-25,25)))
//     if(this.sprite.wreck) this.wreckRots = this.sprite.wreck.map(obj => randR(-0.2, 0.2))

//     this.reactor = _.cloneDeep(ship.reactor)
//     this.cargo = _.cloneDeep(ship.cargo)
//     this.weapons = new ShipSystemWeapons(ship)
//     this.engines = _.cloneDeep(ship.systems.engines)
//     this.hull = _.cloneDeep(ship.hull)
//     this.brakes = _.cloneDeep(ship.systems.brakes)
//     this.shields = _.cloneDeep(ship.systems.shields)
//     this.dash = _.cloneDeep(ship.systems.dash)

//     this.state = new State(
//       "default",
//       "skipping",
//     )
//     //where the ship currently resides
//     // this.location = {
//     //   system: "tauriB",
//     //   planet: "tauriB",
//     // }
//     // this.crew = []
//     // this.captain = {}
//     // this.pilot = "ada"
//     this.skip = {
//       posStart: new Vector(0),
//       posAdd: new Vector(0),
//       duration: 0,
//       ready: true
//     }
//     this.pulseShield = {
//       rechargeTime: 2500,
//       level: 1,
//       levelMax: 5,
//       range: 250,
//       arclen: 90 * PI/180,
//       charged: true,
//       sprite: PIXI.Sprite.from("assets/pulseShield.png"),
//       spriteLife: 0,
//       spriteLifeMax: 32,
//     }
//     this.hardShield = {
//       radius: 128,
//       arclen: PI/2,
//       rotOffset: -PI/4,
//       pos: this.transform.position.clone()
//     }
//     this.pulseShield.sprite.anchor.set(0.5)
//     this.pulseShield.sprite.alpha = 0.0
//     this.container.addChild(this.pulseShield.sprite)
//     //#region arrow methods controlled by timers
//     this.skipEnd = () => {
//       this.state.set("default")
//       this.exitVoid()
//     }
//     this.pulseShieldRecharge = () => {
//       this.pulseShield.charged = true
//       this.sprite.shieldCharge.alpha = 1.0
//     }

//     this.invulnerableEnd = () => {
//       this.invulnerable = false
//     }
//     this.dashRecharge = () => {
//       this.dash.ready = true
//       this.sprite.dashIndicator.alpha = 1.0
//     }
//     this.skipRecharge = () => {
//       this.skip.ready = true
//     }
//     this.laserFire = () => {
//       let verts = [
//         this.transform.position.clone(),
//         this.targetPosition.clone()
//       ]
//       verts.forEach(v => {
//         v.data.healthInit = 10
//         v.data.health = 15
//         v.data.owner = this
//       })
//       let diff = verts[1].clone()
//       .sub(verts[0])
//       .mult(8)
//       verts[1] = verts[0].clone().add(diff)
//       if(verts[1].distance(verts[0]) < Math.hypot(ch, cw)/2) {
//         diff.mult(
//           Math.hypot(ch, cw) / verts[1].distance(verts[0])
//         )
//         verts[1] = verts[0].clone().add(diff)
//       }
//       lasers.push(verts)
//     }
//     //#endregion
//     this.timers.add(
//       ["skip", data.shipSkipTime, {loop: false, active: false, onfinish: this.skipEnd}],
//       ["skipRecharge", 2500, {loop: false, active: false, onfinish: this.skipRecharge}],
//       ["skipSubmerge", 500, {loop: false, active: false, }],
//       ["skipEmerge", 500, {loop: false, active: false, }],
//       ["pulseShieldRecharge", this.pulseShield.rechargeTime, {loop: false, active: false, onfinish: this.pulseShieldRecharge}],
//       ["invulnerable", data.invulnerabilityWindow, {loop: false, active: false, onfinish: this.invulnerableEnd}],
//       ["dashRecharge", 700, {loop: false, active: false, onfinish: this.dashRecharge}],
//       ["laserCharge", 1200, {loop: false, active: false, onfinish: this.laserFire}],
//     )
//   }
//   calculateMass() {
//     this.mass = this.massBase + this.cargo.items.length
//   }
//   reactorUpgrade() {
//     this.reactor.power < this.reactor.powerMax ? this.reactor.power++ : null
//   }
//   reactorUpdate() {

//   }
//   removePower(system) {
//     if(system.power === 0) return
//     system.power--
//     this.reactor.powerFree++
//   }
//   addPower(system) {
//     if(system.power === system.level || this.reactor.powerFree === 0) return
//     system.power++
//     this.reactor.powerFree--
//   }
//   cargoUnload(item) {
//     this.cargo.remove(item)
//   }
//   cargoLoad(item) {
//     this.cargo.push(item)
//   }
//   weaponMount(item) {
//     //transfer item object from cargo into weapons, and add weapon object 
//     let slot = 1
//     this.cargoUnload()
//     let weapon = new Weapon(this, item, slot, data.weaponFull.missileHelios.methods)
//     this.weapons.weapons.push(weapon)
//   }   
//   weaponDismount(weapon) {
//     Item.create(weapon, "weapon")
//     this.weapons.weapons.remove(weapon)
//   }
//   rotate(direction = [-1 || 1]) {
//     //sideways motion idea, this doesn't work but I want it to
//     // if(keys.shift) {
//     //   let accel = vectorRotate(this.engines.main.accel, 0, this.rotation)
//     //   accel.y *= -1
//     //   if(!keys.rotateCW && keys.rotateCCW) accel.rotate(-PI/2)
//     //   if(keys.rotateCW && !keys.rotateCCW) accel.rotate( PI/2)
//     //   if(keys.rotateCW + keys.rotateCCW === 1) this.accelerate(accel)
//     //   return
//     // }
//     if(this.stuck) return
//     let maxSpeed = this.rotationSpeedBase + this.engines.steering.rotationSpeedBonus
//     let smoothing = this.glideReduction + this.engines.steering.glideReduction

//     this.rotationVelocity += (maxSpeed * direction) * smoothing
//     if(this.rotationVelocity * direction > maxSpeed) this.rotationVelocity = maxSpeed * direction
//     this.wrapRotation()
//     this.container.rotation = this.rotation
//   }
//   rotationUpdate() {
//     this.rotation += this.rotationVelocity * dt
//     let smoothing = this.glideReduction + this.engines.steering.glideReduction

//     if(!this.steering) this.rotationVelocity *= (1 - smoothing)
//     if(Math.abs(this.rotationVelocity) < 0.01) this.rotationVelocity = 0
//   }
//   accelerate(vector) {
//     if(this.state.is("skipping")) return
//     let accel = vector
//     if(!accel) {
//       accel = vectorRotate(this.engines.main.accel, 0, this.rotation)
//       accel.y *= -1
//     }
//     this.transform.velocity.x += accel.x * dtf
//     this.transform.velocity.y += accel.y * dtf
//   }
//   decelerate() {
//     if(this.state.is("skipping")) return
//     let accel = vectorRotate(this.engines.main.accel, 0, this.rotation)
//     accel.y *= -1
//     this.transform.velocity.x -= accel.x * dtf
//     this.transform.velocity.y -= accel.y * dtf
//   }
//   move() {
//     if(this.state.is("default") && this.transform.velocity.length() === 0) return
//     if(this.state.is("skipping")) {
//       this.transform.position.set(
//         Ease.InOut(this.timers.skip.curr, this.skip.posStart.x, this.skip.posAdd.x, this.timers.skip.duration),
//         Ease.InOut(this.timers.skip.curr, this.skip.posStart.y, this.skip.posAdd.y, this.timers.skip.duration),
//       )
//     }
//     let maxSpeed = this.engines.main.maxSpeed
//     this.transform.position.x += this.transform.velocity.x * dt
//     this.transform.position.y += this.transform.velocity.y * dt

//     //glide reduction
//     let glideRedux = this.engines.steering.glideReduction
//     let directionalVelocity = vectorRotate(this.transform.velocity.length(), 0, this.rotation).mult(glideRedux)
//     directionalVelocity.y *= -1
//     this.transform.velocity.mult(1 - glideRedux)
//     this.transform.velocity.add(directionalVelocity)
//     let speed = this.transform.velocity.length()

//     //softly clamp the max speed, without causing bumpy behaviour
//     if(speed > maxSpeed) this.transform.velocity.mult(
//       (maxSpeed / speed)*0.1
//       +
//       0.9
//     )
//   }
//   brake() {
//     if(this.state.is("skipping")) return
//     this.transform.velocity.x *= (1-this.brakes.power/100) * dtf
//     this.transform.velocity.y *= (1-this.brakes.power/100) * dtf
//     if(this.transform.velocity.length() < 0.04) this.transform.velocity.set(0)
//   }
//   brakesToggleAuto() {
//     this.brakes.auto = !this.brakes.auto
//   }
//   fire(targetPosition) {
//     //placeholder projectile
//     let angle = Math.atan2(targetPosition.y - this.transform.position.y, targetPosition.x - this.transform.position.x) // ????
//     let base = vectorRotate(data.projectile.blackhole.speed, 0, -angle)
//     let vel = new Vector(base.x, base.y) 

//     if(this === player.ship) {
//       //blackhole
//       GameObject.create("projectile", "blackhole", {
//         pos: this.transform.position, 
//         vel: vel, 
//         rotation: angle, 
//         rotationVelocity: 0, 
//         owner: this, 
//         target: null
//       },
//       {
//         world: game
//       })
//     }
//   }
//   onHit(projectile) {
//     this.hullDamage(projectile.impactDamage)
//   }
//   dashInit() {
//     if(!this.dash.ready) return
//     this.dash.ready = false
//     this.timers.dashRecharge.restart()
//     this.sprite.dashIndicator.alpha = 0.0
//     //3 directions - forward, right, left, depending on keypresses, if you're only moving forward
//     // then you dash forward, if you're moving forward && left || right, then you dash sideways,
//     // if you're moving forward and press both forward, left and right, you dash forward
//     let vec = Vector.fromAngle(mouse.shipAngle)
//     vec.mult(this.dash.power * data.dashPower/4 + data.dashPower)
//     this.transform.velocity.add(vec)
//     //okay, to make this smooth, add the vector consecutively several times, first something like
//     // 10% then 20% then 30% then 40%
//   }
//   hullDamage() {
//     if(this.invulnerable) return
//     this.hull.curr--
//     if(this.hull.level <= 0) this.wreck()
//     this.invulnerable = true
//     this.timers.invulnerable.restart()
//   }
//   hullRepair(amt) {
//     if(this.hull.curr >= this.hull.level) return
//     this.hull.curr++
//   }
//   hullUpgrade() {
//     if(this.hull.level >= this.hull.levelMax) return
//     this.hull.level += 1
//     this.hull.curr += 1
//   }
//   pulseShieldActivate() {
//     let shield = this.pulseShield
//     if(!shield.charged) return
//     this.sprite.shieldCharge.alpha = 0.0
//     shield.sprite.rotation = mouse.shipAngle - this.rotation
//     shield.charged = false
//     shield.sprite.alpha = 1.0
//     shield.spriteLife = shield.spriteLifeMax
//     this.timers.pulseShieldRecharge.restart()

//     let targets = rigids.filter(obj => obj.pos.distance(this.transform.position) < shield.range && obj !== this)
//     targets.forEach(target => {
//       let angle = Math.atan2(target.pos.y - this.transform.position.y, target.pos.x - this.transform.position.x)
//       let angle2 = mouse.shipAngle
//       console.log(angle, angle2)
//       if(angle > angle2 - shield.arclen/2 && angle < angle2 + shield.arclen/2) {
//         let vel = Vector.fromAngle(angle2).mult(750 + 750 * (shield.level/shield.levelMax))
//         vel.mult(1/target.mass)
//         target.vel.add(vel)
//         if(target.vel.length() > data.maxVelocity) {
//           console.log("too long",target.vel.length())
//           target.vel.mult(data.maxVelocity / target.vel.length())
//         }
//       }
      
//     })
//   }
//   pulseShieldUpgrade() {
//     if(this.pulseShield.level === this.pulseShield.levelMax) return
//     this.pulseShield.level++
//     this.pulseShield.range += 50
//   }
//   updatePulseShieldSprite() {
//     let shield = this.pulseShield
//     if(shield.spriteLife <= 0) return
//     shield.spriteLife--
//     shield.sprite.alpha = Math.max(0, shield.spriteLife / shield.spriteLifeMax)
//     if(shield.spriteLife <= 0) {
//       shield.spriteLife = 0
//       shield.sprite.alpha = 0.0
//     }
//   }
//   updateVwbOutline() {
//     if(this.wrecked) return
//     if(this.sprite.vwbOutline) this.sprite.vwbOutline.alpha = 0.3 * this.skip.ready
//   }
//   updateLaserChargeProgress() {
//     if(!this.sprite.laserChargeProgress) return
//     let curr = this.timers.laserCharge.curr
//     let step = this.timers.laserCharge.duration / 5
//     let index = Math.floor(curr / step)
//     this.sprite.laserChargeProgress.gotoAndStop(index)
//   }
//   toggleBrakeIndicator(state = 0) {
//     if(!this.sprite.brakeIndicator) return
//     this.sprite.brakeIndicator.alpha = 1 * state
//   }
//   updateWreck() {
//     if(!this.wrecked) return
//     this.sprite.wreck.forEach((sprite, i) => {
//       sprite.position.set(
//         sprite.position.x + (this.wreckVels[i].x * dt),
//         sprite.position.y + (this.wreckVels[i].y * dt),
//       )
//       sprite.rotation = this.wreckRots[i]
//     })
//   }
//   skipBegin(targetPosition) {
//     if(this.state.is("skipping")) return
//     if(!this.skip.ready) return
//     this.state.set("skipping")
//     this.transform.velocity.set(0)
//     this.skip.posAdd = targetPosition.clone().sub(this.transform.position)
//     this.skip.posStart = this.transform.position.clone()
//     this.timers.skip.duration = data.shipSkipTime + this.skip.posAdd.length() / 4
//     this.timers.skip.restart()
//     this.timers.skipRecharge.restart()
//     this.skip.ready = false
//     this.enterVoid()
//   }
//   drawGhost() {
//     let [ghost, skip] = [this.sprite.ghost, this.sprite.skip]
//     this.stage.addChild(ghost, skip)
//     ghost.position.set(mouse.worldPosition.x, mouse.worldPosition.y)
//     ghost.alpha = 0.2
//     ghost.rotation = this.rotation
//     skip.position.set(mouse.worldPosition.x, mouse.worldPosition.y)
//     ghost.alpha = 0.2
//   }
//   hideGhost() {
//     let children = [this.sprite.ghost, this.sprite.skip]
//     this.stage.removeChild(...children)
//   }
//   update() {
//     if(this.hull.curr <= 0) {
//       let npc = npcs.find(n => n.ship === this)
//       if(npc) npc.destroy()
//       this.wreck()
//     }
//     this.move()
//     this.rotationUpdate()
//     this.updatePulseShieldSprite()
//     this.updateVwbOutline()
//     this.updateLaserChargeProgress()

//     if(this.state.is("skipping")) 
//     this.container.filters = [filterVwb, filterGlitch, filterDistMap]
//     else 
//     if(this.invulnerable) 
//     this.container.filters = [filterInvul]
//     else this.container.filters = []

//     this.updateWreck()
//   }
//   updateVisual() {
//     this.hardShield.pos.setFrom(this.transform.position)
//   }
//   wreck() {
//     if(this.wrecked) return
//     this.container.filters = []
//     this.invulnerable = false
//     this.wrecked = true
//     let explosion = Sprite.animatedSprite("assets/explosion/genericExplosion_0000.png", 12)
//     explosion.play()
//     explosion.loop = false
//     explosion.rotation = randR(0, PI*2)
//     explosion.animationSpeed = 0.12
//     explosion.onComplete = () => {this.container.removeChild(explosion);explosion.destroy()}
//     explosion.anchor.set(0.5)
//     this.container.addChild(explosion)
//     this.sprite.wreck.forEach(sprite => sprite.alpha = 1.0)
//     this.sprite.flame.alpha = 0.0
//     this.sprite.glow.alpha = 0.0
//     this.sprite.fill.alpha = 0.0
//     this.sprite.linework.alpha = 0.0
//     this.sprite.highlights.forEach(sprite => sprite.alpha = 0.0)
//     this.sprite.shieldCharge.alpha = 0.0
//     this.sprite.vwbOutline.alpha = 0.0
//     this.sprite.dashIndicator.alpha = 0.0
//     this.sprite.brakeIndicator.alpha = 0.0
//     if(this.sprite.laserChargeProgress) this.sprite.laserChargeProgress.alpha = 0.0
//   }
// }

class Ship extends GameObject {
  constructor(transform, name) {
    super(transform)
    let ship = data.ship[name]
    this.model = ship.model
    this.type = "ship"
    this.name = name

    this.weaponSlots = ship.weaponSlots

    this.components = [
      "hitbox",
      "rigidbody",
      "sprite",
      "controller",
    ]
    for(let systemName of Object.keys(ship.systems))
      this.components.push(systemName)
    console.log(this.components)
    for(let component of this.components)
      this.addComponent(component, ship)
  }
}