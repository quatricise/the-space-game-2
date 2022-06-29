class GameUI {
  constructor() {
    this.windows = {
      all: [

      ],
      history: [],
      active: null,
      set(window) {
        if(!window) return
        this.active = window
        this.all.forEach(a => {
          a.hide()
        })
        this.history.push(window)
        this.active.show()
        // console.log('set active window to', this.active)
      },
      close() {
        this.active.hide()
        this.history.pop()
        this.set(this.history.pop())
      }
    }
    this.tooltip = {
      timeout: null,
      delay_default: 250,
      element: Q('#mouse-tooltip'),
      update() {
        let tooltip = this.element
        let offset = {x: mouse.client_pos.x + 20, y: mouse.client_pos.y + 30}
        offset.x = clamp(offset.x, 0, window.innerWidth - tooltip.offsetWidth - 10)
        tooltip.style.left = offset.x + "px"
        tooltip.style.top = offset.y + "px"
      },
    },
    this.overlays = {
      //useful but currently not used
      top_left: {
        pos: {
          x: 20,
          y: 25
        },
        items: [
          {
            name: "ship_hull",
            value: 10
          },
          {
            name: "reactor_power",
            value: 10
          },
          {
            name: "currency",
            value: 10
          },
          {
            name: "dash_timer",
            value: 10
          },
          {
            name: "location",
            value: 10
          },
        ]
      }
    }
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
    if(event.code === binds.hitbox) {
      visible.hitbox = !visible.hitbox
    }
  }
  handle_keyup(event) {

  }
  handle_mousedown(event) {

  }
  handle_mousemove(event) {
    if(event.target.closest(".tooltip")) {
      let delay = +event.target.closest(".tooltip").dataset.delay
      let tooltip = this.tooltip.element
      
      let inner_text = tooltip.querySelector(".tooltip-inner-text")
      if(inner_text) {
        inner_text.remove()
      }
      window.clearTimeout( this.tooltip.timeout )
      if(delay && typeof delay === "number") {
        this.tooltip.timeout = setTimeout(()=> { 
          tooltip.classList.remove("hidden")
          this.tooltip.update()
        }, delay)
      }
      else {
        this.tooltip.timeout = setTimeout(()=> { 
          tooltip.classList.remove("hidden")
          this.tooltip.update()
        }, this.tooltip.delay_default)
      }
      let text = El("span", "tooltip-inner-text")
      text.innerText = event.target.closest(".tooltip").dataset.tooltip
      tooltip.append(text)
      this.tooltip.update()
    }
    else {
      window.clearTimeout( this.tooltip.timeout )
      this.tooltip.element.classList.add("hidden")
    }
  }
  handle_mouseup(event) {

  }
  handle_click(event) {

  }
  update() {
    Q('#ship-hull').innerHTML = ""
    for (let index = 0; index < player.ship.hull.curr; index++) {
      Q('#ship-hull').append(El("div", "ship-hull-point"))
    }
  }
}

const ui = new GameUI()
