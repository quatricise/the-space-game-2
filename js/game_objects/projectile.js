class Projectile extends Rigid {
  constructor(
    transform,
    name, 
    owner,
    target,
  ) {
    let projectile = data.projectile[name]
    super(transform, projectile.hitbox)
    this.type = "projectile"
    this.impact_damage = projectile.impact_damage
    this.speed = this.transform.velocity.length()
    Hitbox.update(this)
    this.owner = owner
    this.name = name
    this.target = target
    this.mass = projectile.mass
    this.life_max = projectile.life
    this.life = this.life_max
    this.create_sprite()
  }
  create_sprite() {
    this.sprite = PIXI.Sprite.from("assets/projectile/" + this.name + ".png")
    this.sprite.anchor.set(0.5)
    this.container = new PIXI.Container()
    this.container.addChild(this.sprite)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  rotate_to_target() {
    if(!this.target) return
    let angle = Math.atan2(this.target.transform.position.y - this.transform.position.y, this.target.transform.position.x - this.transform.position.x )
    console.log(angle)
    //this is too OP, should just find out if to turn left or right
    //based on the angle to the target
    this.transform.rotation = angle
    let vec = vectorRotate(this.speed, 0, this.transform.rotation)
    this.transform.velocity.set(vec.x, vec.y)
    this.transform.velocity.y *= -1
  }
  blackhole() {
    let objs = Collision.broadphase(game, this)
    objs.forEach(obj => {
      let dist = this.transform.position.distance(obj.transform.position)
      let max_dist = 800
      dist = Math.max(max_dist - dist, 0)
      let angle = Math.atan2(this.transform.position.y - obj.transform.position.y, this.transform.position.x - obj.transform.position.x)
      let strength = 120
      let vec = Vector.fromAngle(angle).mult(strength).mult(dist / max_dist).mult(dt)
      if(dist < max_dist) {
        obj.vel.add(vec)
      }
    })
  }
  fireball() {

  }
  update() {
    this[this.name]()
    this.rotate_to_target()
    this.move()
    this.life -= 1000 * dt
    if(this.life <= 0) this.destroyed = true
  }
}