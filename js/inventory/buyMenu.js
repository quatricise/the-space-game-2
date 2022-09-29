class BuyMenu extends GameWindow {
  constructor() {
    super("BuyMenu", Q("#buy-menu"))
    this.state = new State(
      "default",
      "dragging"
    )
    this.placeholder = null
    this.placeholderTimeout = null
    this.dragged = null
    this.dragParent = null
    this.generateEmpty()
    this.generateTestItems()
  }
  generateEmpty() {
    for(let i = 0; i < 24; i++) {
      let el = El("div", "inventory-item empty")
      el.style.order = i
      el.dataset.order = i
      Q("#buy-menu .buy-menu-left .buy-inventory-grid").append(el)
      Q("#buy-menu .buy-menu-right .buy-inventory-grid").append(el.cloneNode(true))
    }
  }
  generateTestItems() {
    let folder = "assets/weapons/"
    let sources = [
      "missileHelios",
      "plasmaCannonI",
      "plasmaCannonII",
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
  handleKeydown(event) {

  }
  handleKeyup(event) {

  }
  handleMousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".draggable.drag-self")) {
        this.dragged = target.closest(".draggable.drag-self")
        this.placeholderCreate(this.dragged)
        let rect = this.dragged.getBoundingClientRect()

        this.dragged.style.width = rect.width  + "px"
        this.dragged.style.height = rect.height  + "px"
        this.dragged.style.left = (mouse.clientPos.x - rect.width/2) + "px"
        this.dragged.style.top = (mouse.clientPos.y - rect.height/2) + "px"
        this.dragged.style.pointerEvents = "none"
        this.dragged.style.position = "absolute"

        this.dragged.dataset.styleChanged = "width height left top pointerEvents position"
        this.dragParent = this.dragged.parentElement
        this.element.append(this.dragged)

        Qa("[data-drop='inventory-item']").forEach(drop => {
          drop.dataset.border = drop.style.border
          drop.style.border = "2px solid var(--color-shield)"
        })
        this.state.set("dragging")
      }
    }
  }
  handleMousemove(event) {
    let target = event.target
    if(this.state.is("dragging") && this.dragged) {
      let x = +this.dragged.style.left.replace("px", "")
      let y = +this.dragged.style.top.replace("px", "")
      x += mouse.clientMoved.x
      y += mouse.clientMoved.y
      this.dragged.style.left = x + "px"
      this.dragged.style.top = y + "px"
      if(this.dragged.classList.contains("inventory-item") && target.closest("[data-drop='inventory-item']")) {
        let targ = target.closest(".inventory-item")
        if(targ === this.placeholder) return
        if(!targ) return
        window.clearTimeout(this.placeholderTimeout)
        if(!this.placeholder) {
          this.placeholderCreate(targ)
        }
        else {
          this.placeholderRemove()
          this.placeholderTimeout = setTimeout(() => {
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
        window.clearTimeout(this.placeholderTimeout)
        this.placeholderRemove()
      }
    }
  }
  handleMouseup(event) {
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
        this.dragEnd()
      }
      else {
        this.dragParent.childNodes[+this.dragged.dataset.order].before(this.dragged)
        Qa("[data-drop='inventory-item']").forEach(drop => drop.style.border = drop.dataset.border)
        this.dragEnd()
      }
    }
  }
  handleClick(event) {

  }
  handleWheel(event) {

  }
  //#endregion
  dragEnd() {
    if(this.state.isnt("dragging")) return
    console.log('drag ended')
    let changes = this.dragged.dataset.styleChanged.split(" ")
    changes.forEach(ch => {
      this.dragged.style[ch] = ""
      this.dragged.dataset.styleChanged = ""
    })
    this.state.revert()
    this.placeholderRemove()
    this.dragged = null
    this.dragParent = null
  }
  placeholderCreate(target) {
    let newitem = target.cloneNode(true)
    newitem.classList.add("placeholder")
    this.placeholder = newitem
    target.before(newitem)
  }
  placeholderRemove() {
    if(!this.placeholder) return
    this.placeholder.remove()
    this.placeholder = null
  }
  update() {
    
  }
}