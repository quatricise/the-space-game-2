class Projectile extends Rigid {
  constructor(pos = Vector.zero(), vel = Vector.zero(), rotation = 0, rotation_velocity = 0, projectile = data.projectiles.debug_laser) {
    super(pos, vel, rotation, rotation_velocity, projectile.hitbox)
    this.hitbox = _.cloneDeep(projectile.hitbox)
    this.sprite_test = PIXI.Sprite.from("assets/circle.png")
    this.sprite_test.anchor.set(0.5)
    app.stage.addChild(this.sprite_test)
    // this.sources = projectile.sources
    this.referenced_in.push(projectiles)
    projectiles.push(this)
  }
  updateSprite() {
    this.sprite_test.position.x = this.pos.x
    this.sprite_test.position.y = this.pos.y
  }
  move() {
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt
  }
  update() {
    this.updateSprite()
    this.move()
  }
  destroy() {
    this.referenced_in.forEach(ref => {
      
    })
  }
}