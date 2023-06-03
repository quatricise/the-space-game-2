class SkipSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.ready = true
    this.active = false
    this.positionStart = new Vector()
    this.positionAdd = new Vector()

    this.timers = new Timer(
      ["recharge", SkipSystem.rechargeTimeMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}],
      ["skip", SkipSystem.skipDurationMin,    {loop: false, active: false, onfinish: this.finish.bind(this)}],
    )
  }
  activate(destination) {
    if(!this.ready) return
    if(this.gameObject.state.is("docking", "docked", "undocking")) return

    this.active = true
    this.ready = false
    
    let distance = destination.clone().sub(this.gameObject.transform.position)
    let duration = Math.max(SkipSystem.skipDurationMin, distance.length())

    this.timers.skip.duration = duration
    this.positionStart = this.gameObject.transform.position.clone()
    this.positionAdd = distance
    this.gameObject.state.set("skipping")
    this.gameObject.transform.velocity.set(0)
    this.gameObject.enterVoid()
    this.gameObject.sprite.vwbOutline.renderable = false
    this.playTravelAnimation(destination)
    this.gameObject.sprite.container.filters = [filters.vwb, filters.glitch]

    this.timers.recharge.start()
    this.timers.skip.start()
  }
  playTravelAnimation(destination) {
    let [submerge, emerge] = [this.gameObject.sprite.travelAnimationSubmerge, this.gameObject.sprite.travelAnimationEmerge]
    let layer = this.gameObject.gameWorld.layers.overlays
    let alpha = 0.3
    layer.addChild(submerge)
    layer.addChild(this.gameObject.sprite.travelAnimationEmerge)
    
    submerge.rotation = this.gameObject.transform.rotation
    submerge.renderable = true
    submerge.loop = false
    submerge.alpha = alpha
    submerge.position.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y)
    submerge.gotoAndPlay(0)
    submerge.onComplete = () => {
      submerge.renderable = false
      layer.removeChild(submerge)
    }

    emerge.rotation = this.gameObject.transform.rotation
    emerge.position.set(destination.x, destination.y)
    emerge.onFrameChange = () => {
      if(emerge.currentFrame < 5) {
        emerge.alpha = clamp((emerge.currentFrame / 5 * alpha), 0, 1)
      }
      if(emerge.currentFrame === 0) {
        emerge.renderable = false
        layer.removeChild(emerge)
      }
    }
    setTimeout(() => {
      emerge.animationSpeed = submerge.animationSpeed * -1
      emerge.renderable = true
      emerge.loop = false
      emerge.alpha = alpha
      emerge.gotoAndPlay(emerge.totalFrames - 1)
    }, Math.max(0, this.timers.skip.duration - 450))
  }
  onActive() {
    this.moveGameObject()
    this.scaleGlitchFilter()
  }
  finish() {
    this.active = false
    this.gameObject.exitVoid()
    this.gameObject.sprite.container.filters = []
    this.gameObject.transform.velocity.set(0)
    Hitbox.recalculatePolygonHitbox(this.gameObject, this.gameObject.hitbox)
    setTimeout(() => {
      this.gameObject.state.ifrevert("skipping")
    }, SkipSystem.shipImmobilizeTime)
  }
  moveGameObject() {
    this.gameObject.transform.position.set(
      Ease.InOut(this.timers.skip.currentTime, this.positionStart.x, this.positionAdd.x, this.timers.skip.duration),
      Ease.InOut(this.timers.skip.currentTime, this.positionStart.y, this.positionAdd.y, this.timers.skip.duration),
    )
  }
  scaleGlitchFilter() {
    let halfwayPoint = this.timers.skip.duration / 2
    let scale = Ease.Linear(this.timers.skip.currentTime, 0, 1, this.timers.skip.duration)

    if(this.timers.skip.currentTime > halfwayPoint)
      scale = 1 - scale
    filterManager.scaleGlitchFilter(scale)
  }
  recharge() {
    this.ready = true
    this.gameObject.sprite.vwbOutline.renderable = true
  }
  updateUISkipCharge() {
    let chargePercentage
    if(this.ready)
      chargePercentage = 100
    else
      chargePercentage = (this.timers.recharge.currentTime / SkipSystem.rechargeTimeMS) * 100

    let uiGraphicStateCount = 6
    let chargeStep = Math.floor(chargePercentage / (100 / uiGraphicStateCount))
    Q("#ship-skip-charge-icon").style.backgroundImage = `url(/assets/ui/skipCharge/skipChargeGraphic000${chargeStep}.png)`
  }
  update() {
    if(this.active)
      this.onActive()
    if(this.gameObject === player.ship)
      this.updateUISkipCharge()
  }
  static skipDurationMin = 480 
  static shipImmobilizeTime = 150
  static rechargeTimeMS = 4500
}