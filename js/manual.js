class Manual extends GameWindow {
  constructor() {
    super("Pilot's Manual", Q("#pilot-manual"))
  }
  handleKeydown(e) {
    if(e.code === "Escape")             gameManager.setWindow(game)
    if(e.code === binds.showControls)   gameManager.setWindow(game)
  }
  handleMousedown(e) {
    if(e.button === 0) gameManager.setWindow(game)
  }
}