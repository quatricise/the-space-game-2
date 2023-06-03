class ReceivedItemModal extends GameWindow {
  constructor() {
    super("ReceivedItemModal", Q('#received-item-modal'))
    this.itemContainer = this.element.querySelector(".item-container")
  }
  show() {
    if(this.visible) return
    AudioManager.playSFX("receivedItem")
    this.element.classList.remove("hidden")
    this.element.animate([
      {filter: "opacity(0)", transform: "scale(0.9)"},
      {filter: "opacity(1)", transform: "scale(1.0)"},
    ], {
      duration: 1000,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    }).onfinish = () => this.visible = true
  }
  hide() {
    if(!this.visible) return
    this.element.animate([
      {filter: "opacity(1)", transform: "scale(1.0)"},
      {filter: "opacity(0)", transform: "scale(0.92)"},
    ], {
      duration: 1000,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    })
    .onfinish = () => {
      this.element.classList.add("hidden")
      this.onClose()
      this.visible = false
    }
  }
  onClose() {
    //empty method that can be used to attach handlers to the closing of this window
  }
  setItems(...items) {
    if(items.find(i => (i instanceof Item) == false)) throw "only accept instances of Item class"

    this.itemContainer.innerHTML = ""
    items.forEach(item => {
      this.itemContainer.append(Item.createItemElement(data.item[item.name]))
    })
  }
}