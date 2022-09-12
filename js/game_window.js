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
  handle_input(event) {
    switch(event.type) {
      case "keydown"      : { this.handle_keydown(event); break}
      case "keyup"        : { this.handle_keyup(event); break}
      case "mousedown"    : { this.handle_mousedown(event); break}
      case "mousemove"    : { this.handle_mousemove(event); break}
      case "mouseup"      : { this.handle_mouseup(event); break}
      case "click"        : { this.handle_click(event); break}
      case "wheel"        : { this.handle_wheel(event); break}
      case "pointerdown"  : { this.handle_pointerdown(event); break}
      case "pointermove"  : { this.handle_pointermove(event); break}
    }
  }
  handle_keydown(event) {

  }
  handle_keyup(event) {

  }
  handle_mousedown(event) {

  }
  handle_mousemove(event) {

  }
  handle_mouseup(event) {

  }
  handle_click(event) {

  }
  handle_wheel(event) {

  }
  handle_pointerdown(event) {

  }
  handle_pointermove(event) {

  }
  update() {

  }
}