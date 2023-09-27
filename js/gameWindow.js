class GameWindow {
  constructor(title, element) {
    this.title = title
    this.element = element

    /** (unused property) "solid" or "overlay" */
    this.windowType = "solid"
    this.graphics = new PIXI.Graphics()
    this.uiComponents = []
    this.active = false
    this.visible = false
  }
  show() {
    this.visible = true
    this.element.classList.remove('hidden')
  }
  hide() {
    this.visible = false
    this.element.classList.add('hidden')
  }
  toggle() {
    this.element.classList.toggle('hidden')
  }
  handleInput(event) {
    this["handle" + event.type.capitalize()](event)
    this.handleSecondaryInput(event)
  }
  handleSecondaryInput(event) {

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
  handlePointerup(event) {

  }
  update() {

  }
}