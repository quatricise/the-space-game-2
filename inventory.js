class Inventory {
  constructor(params) {
    this.element = Q('#player-inventory')
    this.grid = Q('#player-inventory-grid')
    this.graphics = new PIXI.Graphics()
  }
  show() {
    this.element.classList.remove('hidden')
    this.display_items()
  }
  hide() {
    this.element.classList.add('hidden')
  }
  toggle() {
    if(this.element.classList.contains("hidden")) this.display_items()
    this.element.classList.toggle('hidden')
  }
  display_items() {
    this.grid.innerHTML = ""
    player.inventory.forEach(item => {
      let cont = El("div", "inventory-item")
      this.grid.append(cont)
    })
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
  handle_keydown(event) {

  }
  handle_keyup(event) {

  }
  handle_mousemove(event) {

  }
  handle_mousedown(event) {

  }
  handle_mouseup(event) {

  }
  handle_click(event) {

  }
}