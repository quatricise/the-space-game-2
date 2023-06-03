class HintGraphic extends GameObject {
  constructor(transform, name, parent) {
    super(transform)
    let objectData = data.hintGraphic[name]
    this.type = "hintGraphic"
    this.name = name
    this.parent = parent
    this.components = [
      "sprite"
    ]
    this.registerComponents(objectData)
    this.timers = new Timer(
      ["fadeout", 1000, {loop: false, active: false, onfinish: this.onFadeout.bind(this)}]
    )
    this.onload(objectData)
  }
  onload() {
    this.update()
    this.sprite.linework.animationSpeed = 0.2
    this.sprite.linework.loop = false
    this.sprite.linework.play()
  }
  //#region input
  handleInput(event) {
    this["handle" + event.type.capitalize()](event)
  }
  handleKeydown(event) {

  }
  handleKeyup(event) {

  }
  handleMousedown(event) {

  }
  handleMousemove(event) {

  }
  handleMouseup(event) {

  }
  handleClick(event) {

  }
  handleWheel(event) {

  }
  handlePointerdown(event) {

  }
  handlePointermove(event) {

  }
  //#endregion
  dismiss() {
    this.timers.fadeout.start()
  }
  onFadeout() {
    GameObject.destroy(this)
  }
  updateSprite() {
    if(!this.timers.fadeout.active) return
    this.sprite.container.alpha = Ease.InOut(this.timers.fadeout.currentTime, 1, -1, this.timers.fadeout.duration)
  }
  update() {
    this.updateSprite()
    this.transform.position.setFrom(this.parent.transform.position)
  }
}