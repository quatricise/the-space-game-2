class Manual extends GameWindow {
  constructor() {
    super("Pilot's Manual", Q("#pilot-manual"))
  }
  handleKeydown(e) {
    if(e.code === "Escape")             gameManager.closeWindow()
    if(e.code === binds.showControls)   gameManager.closeWindow()
  }
  handleMousedown(e) {
    if(e.button === 0) gameManager.closeWindow()
  }
}