class UIComponent {
  constructor(gameWindow) {
    gameWindow.uiComponents.push(this)
    this.gameWindow = gameWindow
    UIComponent.list.push(this)
  }
  handleInput(event) {
    this["handle" + event.type.capitalize()](event)
  }
  handleKeydown() {

  }
  handleKeyup() {

  }
  handleMousedown() {

  }
  handleMousemove() {

  }
  handleMouseup() {

  }
  handleClick() {

  }
  handleWheel() {

  }
  handlePointerdown() {

  }
  handlePointerup() {

  }
  handlePointermove() {

  }
  update() {
    
  }
  destroy() {

  }
  static list = []
  static destroy(component) {
    component.gameWindow.uiComponents.remove(component)
    this.list.remove(this)
    component.destroy()
  }
}