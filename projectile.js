class Projectile extends Rigid {
  constructor(pos = Vector.zero(), vel = Vector.zero(), rotation = 0, rotation_velocity = 0, projectile = data.projectiles.debug_laser, owner) {
    super(pos, vel, rotation, rotation_velocity, projectile.hitbox)
    this.hitbox = _.cloneDeep(projectile.hitbox)
    this.sprite = PIXI.Sprite.from("assets/circle.png")
    this.sprite.anchor.set(0.5)
    app.stage.addChild(this.sprite)
    this.owner = owner
    this.life_max = projectile.life
    this.life = this.life_max
    this.referenced_in.push(projectiles)
    projectiles.push(this)
  }
  updateSprite() {
    this.sprite.position.x = this.pos.x
    this.sprite.position.y = this.pos.y
  }
  move() {
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt
  }
  update() {
    this.updateSprite()
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