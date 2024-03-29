class ShieldSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.type = data.type
    this.ready = false
    this.active = false
    this.shieldData = data.shieldData

    if(this.gameObject.hitbox)
      this.setupShield.bind(this)
    else
      this.gameObject.onHitboxLoad = this.setupShield.bind(this)

    this.timers = new Timer()
  }
  //#region setup
  setupShield() {
    this[`setup${this.type.capitalize()}Shield`]()
  }
  setupBubbleShield() {
    let radius = this.gameObject.hitbox.boundingBox.w/2 + this.shieldData.sizeGrowth
    this.hitbox = new CircleHitbox(this.gameObject, radius, colors.hitbox.shields)
  }
  setupHardLightShield() {
    let radius = this.gameObject.hitbox.boundingBox.w/2 + 50
    this.hitbox = new CircleHitbox(this.gameObject, radius, colors.hitbox.shields)
  }
  setupForceFieldShield() {
    this.hitbox = this.gameObject.hitbox.clone(this.gameObject)
    if(this.hitbox.type === "circle") {
      this.hitbox.radius += this.shieldData.effectiveDistance * 2
    }
    if(this.hitbox.type === "polygonHitbox") {
      this.hitbox.definition.forEach(body => {
        body.vertices.forEach(vert => {
          let angle = new Vector(vert.x, vert.y).angle()
          let direction = Vector.fromAngle(angle)

          direction.mult(this.shieldData.effectiveDistance)
          vert.x += direction.x
          vert.y += direction.y
        })
      })
    }
    if(this.hitbox.type === "box") {
      this.hitbox.w += this.shieldData.effectiveDistance * 2
      this.hitbox.h += this.shieldData.effectiveDistance * 2
    }
  }
  setupPulseShield() {
    this.timers.add(
      ["pulseRecharge", this.shieldData.rechargeTimeMS, {loop: false, active: true, onfinish: this.pulseRecharge.bind(this)}]
    )
    this.hitbox = new CircleHitbox(this.gameObject, this.shieldData.distance, colors.hitbox.shields)
  }
  //#endregion
  activate(...params) {
    this[this.type + "Activate"](...params)
  }
  //#region shield type specific methods
  pulse() {
    
  }
  pulseActivate(NPCShipAngle) {
    if(!this.ready) return

    this.ready = false
    this.pulseUpdateSprites(NPCShipAngle)
    this.pulseTestCollision(NPCShipAngle)
    this.timers.pulseRecharge.start()
  }
  pulseUpdateSprites(NPCShipAngle) {
    this.gameObject.sprite.shieldCharge.renderable = false

    
    /* sprite */
    let sprite = this.gameObject.sprite.shieldPulse
    this.gameObject.gameWorld.layers.overlays.addChild(sprite)
    sprite.position.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y)
    sprite.anchor.set(0.5)
    sprite.renderable = true
    sprite.animationSpeed = 0.25
    sprite.gotoAndPlay(0)
    sprite.loop = false

    if(this.gameObject === player.ship) 
      sprite.rotation = mouse.shipAngle
    else {
      sprite.rotation = NPCShipAngle
      console.log(NPCShipAngle)
    }

    sprite.onComplete = () => sprite.renderable = false
  }
  pulseTestCollision(NPCShipAngle) {
    let minAngle = 0 - this.shieldData.arcLength/2
    let maxAngle = 0 + this.shieldData.arcLength/2

    if(this.gameObject === player.ship) {
      minAngle += mouse.shipAngle
      maxAngle += mouse.shipAngle
    }
    else {
      minAngle += NPCShipAngle
      maxAngle += NPCShipAngle
    }

    let targets = Collision.broadphase(this.gameObject.gameWorld, this.gameObject, {exclude: [Interactable]})
    targets.forEach(target => {
      let hasHit = false
      let isWithinHitbox = false
      let isWithinAngle = false

      let endPointOffset1 = new Vector(this.shieldData.distance, 0).rotate(mouse.shipAngle)
      let endPointOffset2 = endPointOffset1.clone()

      endPointOffset1.rotate(-this.shieldData.arcLength/2)
      endPointOffset2.rotate(this.shieldData.arcLength/2)

      let line1 = new Line(
        this.gameObject.transform.position.clone(),
        this.gameObject.transform.position.clone().add(endPointOffset1)
      )
      let line2 = new Line(
        this.gameObject.transform.position.clone(),
        this.gameObject.transform.position.clone().add(endPointOffset2)
      )
      let angle = GameObject.angle(this.gameObject, target)

      if(Collision.auto(target.hitbox, this.hitbox))
        isWithinHitbox = true
      if(angle > minAngle && angle < maxAngle)
        isWithinAngle = true
      if(Collision.auto(target.hitbox, line1))
        hasHit = true
      if(Collision.auto(target.hitbox, line2))
        hasHit = true
      if((isWithinAngle && isWithinHitbox) || hasHit)
        this.pulseParseCollision(target)
    })
  }
  pulseParseCollision(/** @type GameObject */ object) {
    if(object.immovable) return
    let angle = GameObject.angle(this.gameObject, object)
    let distance = GameObject.distance(this.gameObject, object)
    let strength = ((this.shieldData.pulseStrength / distance ) / object.mass) * 1000
    let velocity = Vector.fromAngle(angle).mult(strength).clamp(1000)

    /* blend (ship to projectile) angle and (the actual direction of the pulse) */
    let velCopy = Vector.fromAngle(mouse.shipAngle).mult(strength).clamp(1000).mult(0.9)
    velocity.mult(0.1).add(velCopy)
    console.log(velocity.length)

    /* if you pierce through the void, it does damage */
    if(this.gameObject.vwb) {
      velocity.mult(5)
      object.handleImpact(CollisionEvent.fakeEvent(1, 1000))

      /* if the object has a skip system, theres a chance it'll explode */
      if(object.skip && Random.chance(30)) {
        GameObject.create(
          "explosion",
          "default",
          {
            SFXName: "explosionDefault",
            transform: new Transform(object.transform.position.copy),
          },
          { world: object.gameWorld }
        );
      }
    }

    if(object instanceof Projectile) {
      object.owner = null
      object.target = null
    }

    object.transform.velocity.add(velocity)
  }
  pulseRecharge() {
    this.ready = true
    this.gameObject.sprite.shieldCharge.renderable = true
  }
  hardLight() {
    this.hardLightTestCollision()
  }
  hardLightActivate() {
    this.active = !this.active
    this.active ? this.gameObject.sprite.shieldHardLightFront.renderable = true : this.gameObject.sprite.shieldHardLightFront.renderable = false
    this.active ? this.gameObject.sprite.shieldCharge.renderable = true         : this.gameObject.sprite.shieldCharge.renderable = false
  }
  hardLightTestCollision() {
    //assume that the disposition is set to front
    let arcLength = PI/2

    let minAngle = this.gameObject.transform.rotation - arcLength/2
    let maxAngle = this.gameObject.transform.rotation + arcLength/2

    let targets = Collision.broadphase(this.gameObject.gameWorld, this.gameObject, {solo: [Projectile]})
    targets.forEach(target => {
      let isWithinRadius = false
      let isWithinAngle = false
      
      let angle = GameObject.angle(this.gameObject, target)

      if(Collision.auto(target.hitbox, this.hitbox))
        isWithinRadius = true
      if(angle > minAngle && angle < maxAngle)
        isWithinAngle = true
      if(isWithinAngle && isWithinRadius)
        this.hardLightParseCollision(target)
    })
  }
  hardLightParseCollision(object) {
    object.handleImpact(CollisionEvent.fakeEvent(1, 0))
  }
  hardLightSetDisposition(disposition) {
    if(!disposition.matchAgainst("front", "flank", "sides")) throw "disposition: " + disposition + "not valid"

  }
  forceField() {
    let targets = Collision.broadphase(this.gameObject.gameWorld, this.gameObject, {exclude: [Interactable]})
    targets.forEach(target => {
      if(Collision.auto(target.hitbox, this.hitbox)) {
        if(Collision.isOwnerWithProjectileCollision(target, this.gameObject)) return

        Collision.repelObjects(target, this.gameObject, this.shieldData.strength)
      }
    })
  }
  forceFieldActivate() {
    this.active = !this.active
    this.active ? this.gameObject.sprite.shieldForceField.renderable = true : this.gameObject.sprite.shieldForceField.renderable = false

    //sets sprite scale to match the actual hitbox growth, and take into consideration that for polygon hitbox the growth is * 2
    let spriteScale = ((this.shieldData.effectiveDistance + this.shieldData.effectiveDistance * (this.hitbox instanceof PolygonHitbox)) / this.hitbox.boundingBox.w) + 1 
    this.gameObject.sprite.shieldForceField.scale.set(spriteScale)
    console.log(this.hitbox)
  }
  bubble() {

  }
  bubbleActivate() {
    this.active = !this.active
    this.active ? this.gameObject.sprite.shieldBubble.renderable = true : this.gameObject.sprite.shieldBubble.renderable = false

    let spriteScale = ((this.shieldData.sizeGrowth + this.shieldData.sizeGrowth * (this.hitbox instanceof PolygonHitbox)) / this.hitbox.boundingBox.w) + 1 
    this.gameObject.sprite.shieldBubble.scale.set(spriteScale)
  }
  //#endregion
  //#region input
  handleInput(event) {
    // if(!this.powered) return
    switch(event.type) {
      case "keydown"    : {this.onkeydown(event);    break}
      case "keyup"      : {this.onkeyup(event);      break}
      case "mousemove"  : {this.onmousemove(event);  break}
      case "mousedown"  : {this.onmousedown(event);  break}
      case "mouseup"    : {this.onmouseup(event);    break}
      case "click"      : {this.onclick(event);      break}
      case "wheel"      : {this.onwheel(event);      break}
    }
  }
  onkeydown(event) {
    if(event.code === binds.activateShields)
      this.activate()
  }
  onkeyup(event) {

  }
  onmousemove(event) {

  }
  onmousedown(event) {

  }
  onmouseup(event) {

  }
  onclick(event) {

  }
  onwheel(event) {

  }
  //#endregion
  drawHitbox() {
    Hitbox["draw" + this.hitbox.type.capitalize()]
    (this.gameObject, this.hitbox, this.gameObject.gameWorld.graphics, 1, colors.hitbox.noCollision)
  }
  update() {
    if(this.active)
      this[this.type]()

    if(this.hitbox) {
      this.hitbox.update()
      if(visible.hitbox)
        this.drawHitbox()
    }
  }
  static dispositionToAngleMaxAndMin() {
    if(disposition === "front") return
    if(disposition === "flank") return
    if(disposition === "sides") return
  }
}