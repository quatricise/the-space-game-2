class Coater extends ShipSystem {
  constructor(gameObject, objectData) {
    super(gameObject, objectData)
    this.active = false
    this.layersMax = objectData.layersMax
    
    /** @type Integer - How long it takes to create 1 coating layer */
    this.durationMS = 4000
    this.timers = new Timer(
      ["coat", this.durationMS, {loop: false, active: false, onfinish: this.completeCoating.bind(this)}]
    )
  }
  beginCoating() {
    if(this.active) return
    if(this.gameObject.hull.coatingLayers >= this.layersMax) return

    let sprite = this.gameObject.sprite.coatingAnimation

    sprite.renderable = true
    sprite.alpha = 1.0
    sprite.loop = false
    sprite.animationSpeed = 200 / this.durationMS /* this should be the optimal length given the coating animation has 8 frames */
    sprite.gotoAndPlay(0)
    sprite.onComplete = () => {
      sprite.renderable = false
    }

    this.active = true
    this.gameObject.reactor.unpower()
    this.timers.coat.start()
  }
  cancelCoating() {
    if(!this.active) return
    
    this.onCoatingEnd()
    this.timers.coat.reset()

    AudioManager.playSFX("buttonNegative", 1.0)
  }
  completeCoating() {
    this.onCoatingEnd()
    this.gameObject.hull.coatingLayers++
    this.gameObject.sprite.coatingLayer.gotoAndStop(this.gameObject.hull.coatingLayers)

    AudioManager.playSFX("cardShimmer", 1.0)
  }
  onCoatingEnd() {
    this.active = false
    this.gameObject.reactor.repower()
    this.gameObject.sprite.coatingAnimation.renderable = false
  }
  update() {
    this.timers.update()
  }
}