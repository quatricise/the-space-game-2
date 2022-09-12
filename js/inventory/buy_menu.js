class BuyMenu extends GameWindow {
  constructor() {
    super("BuyMenu", Q("#buy-menu"))
    this.state = new State(
      "default",
      "dragging"
    )
    this.placeholder = null
    this.placeholder_timeout = null
    this.dragged = null
    this.drag_parent = null
    this.generate_empty()
    this.generate_test_items()
  }
  generate_empty() {
    for(let i = 0; i < 24; i++) {
      let el = El("div", "inventory-item empty")
      el.style.order = i
      el.dataset.order = i
      Q("#buy-menu .buy-menu-left .buy-inventory-grid").append(el)
      Q("#buy-menu .buy-menu-right .buy-inventory-grid").append(el.cloneNode(true))
    }
  }
  generate_test_items() {
    let folder = "assets/weapons/"
    let sources = [
      "missile_helios",
      "plasma_cannon_i",
      "plasma_cannon_ii",
    ]
    for(let i = 0; i < sources.length; i++) {
      let el = El("div", "inventory-item empty draggable drag-self")
      let img = new Image(); img.src = folder + sources[i] + ".png"
      el.style.order = i
      el.dataset.order = i
      el.append(img)
      let replaced = Q("#buy-menu .buy-menu-right .buy-inventory-grid [data-order='" + i +  "'")
      replaced.replaceWith(el)
      // console.log(replaced)
    }
  }
  //#region input handlers 
  handle_keydown(event) {

  }
  handle_keyup(event) {

  }
  handle_mousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".draggable.drag-self")) {
        this.dragged = target.closest(".draggable.drag-self")
        this.placeholder_create(this.dragged)
        let rect = this.dragged.getBoundingClientRect()

        this.dragged.style.width = rect.width  + "px"
        this.dragged.style.height = rect.height  + "px"
        this.dragged.style.left = (mouse.client_pos.x - rect.width/2) + "px"
        this.dragged.style.top = (mouse.client_pos.y - rect.height/2) + "px"
        this.dragged.style.pointerEvents = "none"
        this.dragged.style.position = "absolute"

        this.dragged.dataset.style_changed = "width height left top pointerEvents position"
        this.drag_parent = this.dragged.parentElement
        this.element.append(this.dragged)

        Qa("[data-drop='inventory-item']").forEach(drop => {
          drop.dataset.border = drop.style.border
          drop.style.border = "2px solid var(--color-shield)"
        })
        this.state.set("dragging")
      }
    }
  }
  handle_mousemove(event) {
    let target = event.target
    if(this.state.is("dragging") && this.dragged) {
      let x = +this.dragged.style.left.replace("px", "")
      let y = +this.dragged.style.top.replace("px", "")
      x += mouse.client_moved.x
      y += mouse.client_moved.y
      this.dragged.style.left = x + "px"
      this.dragged.style.top = y + "px"
      if(this.dragged.classList.contains("inventory-item") && target.closest("[data-drop='inventory-item']")) {
        let targ = target.closest(".inventory-item")
        if(targ === this.placeholder) return
        if(!targ) return
        window.clearTimeout(this.placeholder_timeout)
        if(!this.placeholder) {
          this.placeholder_create(targ)
        }
        else {
          this.placeholder_remove()
          this.placeholder_timeout = setTimeout(() => {
            if(this.placeholder) {
              targ.before(this.placeholder)
              let index = getChildIndex(this.placeholder)
              this.placeholder.dataset.index = index
              this.placeholder.style.order = index
            }
          }, 200)
        }
      }
      else {
        window.clearTimeout(this.placeholder_timeout)
        this.placeholder_remove()
      }
    }
  }
  handle_mouseup(event) {
    let target = event.target
    if(this.state.is("dragging")) {
      if(target.closest("[data-drop='inventory-item']") && this.dragged.classList.contains("inventory-item")) {
        let targ = target.closest(".inventory-item")
        if(targ) {
          targ.before(this.dragged)
          let index = +targ.style.order
          this.dragged.style.order = index
          this.dragged.dataset.order = index
        }
        else {
          target.closest("[data-drop='inventory-item']").append(this.dragged)
        }
        Qa("[data-drop='inventory-item']").forEach(drop => drop.style.border = drop.dataset.border)
        this.drag_end()
      }
      else {
        this.drag_parent.childNodes[+this.dragged.dataset.order].before(this.dragged)
        Qa("[data-drop='inventory-item']").forEach(drop => drop.style.border = drop.dataset.border)
        this.drag_end()
      }
    }
  }
  handle_click(event) {

  }
  handle_wheel(event) {

  }
  //#endregion
  drag_end() {
    if(this.state.isnt("dragging")) return
    console.log('drag ended')
    let changes = this.dragged.dataset.style_changed.split(" ")
    changes.forEach(ch => {
      this.dragged.style[ch] = ""
      this.dragged.dataset.style_changed = ""
    })
    this.state.revert()
    this.placeholder_remove()
    this.dragged = null
    this.drag_parent = null
  }
  placeholder_create(target) {
    let newitem = target.cloneNode(true)
    newitem.classList.add("placeholder")
    this.placeholder = newitem
    target.before(newitem)
  }
  placeholder_remove() {
    if(!this.placeholder) return
    this.placeholder.remove()
    this.placeholder = null
  }
  update() {
    
  }
}