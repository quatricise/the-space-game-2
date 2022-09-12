class Program {
  constructor() {
    this.windows = {
      all: [],
      history: [],
      active: null,
      set(window) {
        if(!window && !this.all.find(w => w === window)) return
        this.active = window
        window.active = true
        this.all.forEach(a => {
          if(window instanceof DialogueScreen) {
            game.state.set("dialogue")
            game.show()
          } 
          if(window instanceof BuyMenu) {
            game.show()
          }
          a.hide()
        })
        this.history.push(window)
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
  handle_input(e) {
    mouse.handle_input(e)
    this.ui.handle_input(e)
    this.windows.active.handle_input(e)
  }
  update() {
    this.ui.update()
  }
}

const program = new Program()
