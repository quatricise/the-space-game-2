class BoosterSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.strength = data.strength
    this.rechargeTime = data.rechargeTime
    this.type = data.type
    this.ready = true
    this.active = false
  }
  activate() {
    if(!this.powered) return
    this.active = true
    this["activate" + this.type.capitalize()]()
  }
  deactivate() {
    this.active = false
  }
  //#region type specific methods
  activateContinuous() {
    this.active = true
  }
  continuous() {
    if(!this.active) return

    let angle = this.gameObject.transform.position.angleTo(mouse.worldPosition)
    let v = Vector.fromAngle(angle).mult(this.strength * dt)
    this.gameObject.transform.velocity.add(v)
  }
  activatePulse() {

  }
  pulse() {
    let vel = this.gameObject.transform.velocity
    .clone()
    .normalize()
    .mult(this.strength)

    this.gameObject.transform.velocity.setFrom(vel)
  }
  //#endregion
  updateSprite() {
    this.active ? this.gameObject.sprite.boostersIndicator.renderable = true : this.gameObject.sprite.boostersIndicator.renderable = false
    if(!this.gameObject.sprite.boostersGlow) return
    this.active ? this.gameObject.sprite.boostersGlow.renderable = true : this.gameObject.sprite.boostersGlow.renderable = false
  }
  update() {
    this[this.type]()
    this.updateSprite()
  }
}