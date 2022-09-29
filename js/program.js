class Program {
  constructor() {
    this.windows = {
      all: [],
      history: [],
      active: null,
      set(win) {
        if(!win && !this.all.find(w => w === win)) return
        this.active = win
        win.active = true
        this.all.forEach(w => {
          if(win instanceof DialogueScreen) {
            game.state.set("dialogue")
            game.show()
          } 
          if(win instanceof BuyMenu) {
            game.show()
          }
          w.hide()
        })
        this.history.push(win)
        this.active.show()
      },
      close() {
        this.active.hide()
        this.active.active = false
        let prev = this.history.pop()
        if(prev instanceof DialogueScreen) {
          game.state.ifrevert("dialogue")
        }
        this.set(this.history.pop())
      }
    }
    this.ui = new GameUI()
  }
  handleInput(e) {
    mouse.handleInput(e)
    this.ui.handleInput(e)
    this.windows.active.handleInput(e)
  }
  update() {
    this.ui.update()
  }
}

const program = new Program()
