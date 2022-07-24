class Projectile extends Rigid {
  constructor(pos = Vector.zero(), 
  vel = Vector.zero(), 
  rotation = 0, 
  rotation_velocity = 0, 
  name, 
  owner,
  target,
  ) {
    let projectile = data.projectiles[name]
    super(pos, vel, rotation, rotation_velocity, projectile.hitbox)
    this.speed = this.vel.length()
    this.hitbox = _.cloneDeep(projectile.hitbox)
    this.sprite = PIXI.Sprite.from("assets/projectiles/" + projectile.sprite + ".png")
    this.sprite.anchor.set(0.5)
    app.stage.addChild(this.sprite)
    this.owner = owner
    this.target = target
    this.mass = projectile.mass
    this.life_max = projectile.life
    this.life = this.life_max
    this.referenced_in.push(projectiles)
    projectiles.push(this)
  }
  updateSprite() {
    this.sprite.rotation = this.rotation
    this.sprite.position.x = this.pos.x
    this.sprite.position.y = this.pos.y
  }
  move() {
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt
  }
  rotate_to_target() {
    if(!this.target) return
    let angle = Math.atan2(this.target.pos.y - this.pos.y, this.target.pos.x - this.pos.x )
    console.log(angle)
    //this is too OP, should just find out if to turn left or right
    //based on the angle to the target
    this.rotation = angle
    let vec = vectorRotate(this.speed, 0, this.rotation)
    this.vel.set(vec.x, vec.y)
    this.vel.y *= -1
  }
  update() {
    this.updateSprite()
    this.rotate_to_target()
    this.move()
    this.life -= 1000 * dt
    if(this.life <= 0) this.destroy()
  }
  destroy() {
    app.stage.removeChild(this.sprite)
    for (let i = 0; i < this.referenced_in.length; i++) {
      this.referenced_in[i].splice(this.referenced_in[i].indexOf(this), 1)
    }
    this.sprite.destroy()
  }
}