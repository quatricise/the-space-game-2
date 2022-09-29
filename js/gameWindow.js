class GameWindow {
  constructor(title, element) {
    this.title = title
    this.element = element
    this.graphics = new PIXI.Graphics()
    this.active = false
  }
  show() {
    this.element.classList.remove('hidden')
  }
  hide() {
    this.element.classList.add('hidden')
  }
  toggle() {
    this.element.classList.toggle('hidden')
  }
  handleInput(event) {
    switch(event.type) {
      case "keydown"      : { this.handleKeydown(event); break}
      case "keyup"        : { this.handleKeyup(event); break}
      case "mousedown"    : { this.handleMousedown(event); break}
      case "mousemove"    : { this.handleMousemove(event); break}
      case "mouseup"      : { this.handleMouseup(event); break}
      case "click"        : { this.handleClick(event); break}
      case "wheel"        : { this.handleWheel(event); break}
      case "pointerdown"  : { this.handlePointerdown(event); break}
      case "pointermove"  : { this.handlePointermove(event); break}
    }
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
  update() {

  }
}