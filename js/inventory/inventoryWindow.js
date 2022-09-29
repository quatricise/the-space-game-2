class InventoryWindow extends GameWindow {
  constructor(params) {
    super("InventoryWindow")
    this.element = Q('#player-inventory')
    this.grid = Q('#player-inventory-grid')
    this.graphics = new PIXI.Graphics()
  }
  show() {
    this.element.classList.remove('hidden')
    this.displayItems()
  }
  hide() {
    this.element.classList.add('hidden')
  }
  toggle() {
    if(this.element.classList.contains("hidden")) this.displayItems()
    this.element.classList.toggle('hidden')
  }
  displayItems() {
    this.grid.innerHTML = ""
    player.inventory.forEach(item => {
      let cont = El("div", "inventory-item")
      this.grid.append(cont)
    })
  }
  handleInput(event) {
    switch(event.type) {
      case "keydown"    : {this.handleKeydown(event); break;}
      case "keyup"      : {this.handleKeyup(event); break;}
      case "mousemove"  : {this.handleMousemove(event); break;}
      case "mousedown"  : {this.handleMousedown(event); break;}
      case "mouseup"    : {this.handleMouseup(event); break;}
      case "click"      : {this.handleClick(event); break;}
    }
  }
  handleKeydown(event) {

  }
  handleKeyup(event) {

  }
  handleMousemove(event) {

  }
  handleMousedown(event) {

  }
  handleMouseup(event) {

  }
  handleClick(event) {

  }
  update() {
    
  }
}