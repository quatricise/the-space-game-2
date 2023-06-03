class StartScreen extends GameWindow {
  constructor() {
    super("SaveSelectScreen", Q('#start-screen'))
  }
  show() {
    this.visible = true
    this.element.classList.remove('hidden')
  }
}