class LevelEditor {
  constructor() {
    this.element = Q('#level-editor')
    this.graphics = new PIXI.Graphics()
    this.app = level_app
  }
  import() {

  }
  export() {

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
      case "keydown"    : {this.handle_keydown(event); break;}
      case "keyup"      : {this.handle_keyup(event); break;}
      case "mousemove"  : {this.handle_mousemove(event); break;}
      case "mousedown"  : {this.handle_mousedown(event); break;}
      case "mouseup"    : {this.handle_mouseup(event); break;}
      case "click"      : {this.handle_click(event); break;}
    }
  }
}