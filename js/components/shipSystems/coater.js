class Coater extends ShipSystem {
  constructor(gameObject, objectData) {
    super(gameObject, objectData)
    this.active = false
    this.layersMax = objectData.layersMax
    this.timers = new Timer(
      ["coat", 4000, {loop: false, active: false, onfinish: this.completeCoating.bind(this)}]
    )
  }
  beginCoating() {
    if(this.active) return
    if(this.gameObject.hull.coatingLayers >= this.layersMax) return

    this.gameObject.sprite.coatingAnimation.renderable = true
    this.gameObject.sprite.coatingAnimation.loop = false
    this.gameObject.sprite.coatingAnimation.gotoAndPlay(0)
    this.gameObject.sprite.coatingAnimation.onComplete = () => this.gameObject.sprite.coatingAnimation.renderable = false

    this.active = true
    this.gameObject.reactor.unpower()
    this.timers.coat.start()
  }
  cancelCoating() {
    if(!this.active) return
    
    this.onCoatingEnd()
    this.timers.coat.reset()
  }
  completeCoating() {
    this.onCoatingEnd()
    this.gameObject.hull.coatingLayers++
    this.gameObject.sprite.coatingLayer.gotoAndStop(this.gameObject.hull.coatingLayers)
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