class Modal extends GameWindow {
  constructor() {
    super("Modal", Q("#modal"))

    /* setup buttons */
    this.buttons = {}
    Qa(".modal-button").forEach(button => {
      let key = button.id.replace("modal-button-", "")
      this.buttons[key] = button
      button.callOnClick = []
    })
  }
  handleClick(e) {
    if(e.target.closest(".modal-button")) {
      e.target.closest(".modal-button").callOnClick.forEach(fn => fn())
      gameManager.closeWindow()
      this.clearButtons()
    }
  }
  handleKeydown(e) {
    if(e.code === "KeyN") 
      this.buttons.right.click()
    if(e.code === "KeyY" || e.code === "KeyZ") 
      this.buttons.left.click()
  }
  clearButtons() {
    for(let key in this.buttons)
      this.buttons[key].callOnClick = []
  }
  addClickForButton(buttonName, /** Function */ fn) {
    this.buttons[buttonName].callOnClick.push(fn)
  }
}