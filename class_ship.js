class Ship {
  constructor(ship, pos, rotation) {
    this.model_name = ship.model_name
    this.pos = pos
    this.vel = {
      x: 0, y: 0
    }
    this.rotation = rotation
    this.hitbox = ship.hitbox  //?? dunno where exactly to store hitbox // a standardized hitbox for all rigidbody entities
    this.inventory = {
      items: [],
      capacity: ship.inventory.capacity
    }
    this.rotation_speed = 210 //degrees per second
    this.maxSpeed = 20

    this.invulnerable = false


    //sprites
    this.sources = ship.sources
    this.sprite_container = new PIXI.Container()
    this.sprites = [] //actual PIXI.Sprite objects
    this.sprites_special = {
      highlights: [] //array of sprites
    }

    entities.push(this)
    rigids.push(this)
    ships.push(this)
  }
  constructHitbox() {
    //after being spawned, it'll recalculate the hitbox data to be in the right position
  }
  constructSprites() {
    for (let src in this.sources) {
      let sprite = PIXI.Sprite.from(this.sources[src].src);
      this.sprite_container.addChild(sprite)
      if(this.sources[src].src.includes("highlights")) this.sprites_special.highlights.push(sprite) //todo, put everything inside the sprite container
      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5
      this.sprites.push(sprite)
    }
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
  rotate() {
    if(keys.rotateCW) {
      this.rotation += (this.rotation_speed * PI/180) * dt * 0.01
    }
    if(keys.rotateCCW) {
      this.rotation -= (this.rotation_speed * PI/180) * dt * 0.01
    }
    if(this.rotation >= PI*2) this.rotation = 0
    if(this.rotation < 0) this.rotation = PI*2
    this.sprite_container.rotation = this.rotation
  }
  updateSprite() {
    this.sprite_container.position.x = this.pos.x
    this.sprite_container.position.y = this.pos.y
    this.sprite_container.rotation = this.rotation

    //update highlights
    let deg = this.rotation * 180/PI
    for (let i = 0; i < this.sprites_special.highlights.length; i++) {

      let offsetFromFront = i*90 - deg
      if(offsetFromFront <= -270) offsetFromFront = 360 + offsetFromFront
      offsetFromFront = Math.abs(offsetFromFront)
      this.sprites_special.highlights[i].alpha = Math.max(0,Math.round((1 - offsetFromFront/90 )*100)/100) //this puts the alpha between 0 and 1 with 0.01 precision
    }
    
  }
  updateHitbox() {

  }
  takeDamage() {

  }
  accelerate(dt) {
    if(!keys.accel) return
    let accel = vectorRotate(this.maxSpeed/100, 0, this.rotation)
    accel.y *= -1
    this.vel.x += accel.x * dt
    this.vel.y += accel.y * dt
  }
  move(dt) {
    this.pos.x += this.vel.x * dt
    this.pos.y += this.vel.y * dt
  }
  brake(dt) {
    if(keys.accel) return
    this.vel.x *= 0.97 * dt
    this.vel.y *= 0.97 * dt
    if(Math.abs(this.vel.x) < 0.001 && Math.abs(this.vel.y) < 0.001) this.vel.x = this.vel.y = 0
  }
  animate() {

  }
  update() {
    this.updateHitbox()
    this.rotate()
    this.accelerate()
    this.move()
    this.brake()
    this.updateSprite()
    this.animate()
  }
}
