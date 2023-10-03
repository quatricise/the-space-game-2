class UILootingPopupComponent extends UIComponent {
  constructor(gameWindow, gameObject, cargoSystem) {
    super(gameWindow)
    this.gameObject = gameObject
    this.visible = {
      popup: false,
      indicator: false,
    }
    this.items = [...cargoSystem.items]
    this.createPopup()
    this.createIndicator()
  }
  createPopup() {
    this.element =  El("div", "looting-popup-container hidden")
    this.itemGrid = El("div", "looting-popup-item-grid")
    this.title =    El("div", "looting-popup-title", undefined, "Cargo")

    let slotCount = 6
    for(let i = 0; i < slotCount; i++) {
      let item
      if(this.items[i]) {
        item = Item.createItemElement(data.item[this.items[i].name], {smallItem: true})
        item.onclick = () => {
          /* 
          add to player inventory for now, even though it should be in ship, 
          because I'm not at the stage where player is separate from their ship yet 
          */
          player.inventory.addItems(this.items[i])
          
          this.items.remove(this.items[i])
          item.replaceWith(Item.createEmptyItemElement({smallItem: true}))
        }
      }
      else 
      {
        item = Item.createEmptyItemElement({smallItem: true})
      }
      this.itemGrid.append(item)
    }

    this.element.append(this.title, this.itemGrid)
    Q("#game-ui").append(this.element)
  }
  showPopup() {
    if(this.visible.popup) return

    this.visible.popup = true
    this.element.classList.remove("hidden")
    this.element.animate(
      [{filter: "opacity(0)"}, {filter: "opacity(1)"}],
      {duration: 500, easing: "ease-in-out"})
    .onfinish = () => this.element.style.filter = ""
  }
  hidePopup() {
    if(!this.visible.popup) return
    
    this.visible.popup = false
    this.element.animate([
      {filter: "opacity(1)"}, {filter: "opacity(0)"}
    ], {duration: 500, easing: "ease-in-out"})
    .onfinish = () => {
      this.element.classList.add("hidden")
      this.destroyIfNoCargo()
    }
  }
  update() {
    this.updateIndicator()
    this.updatePopup()
    this.updateVisibility()

    if(this.gameObject.destroyed)
      UIComponent.destroy(this)
  }
  updateVisibility() {
    let playerShipDistance = GameObject.distance(this.gameObject, player.ship)

    if(playerShipDistance < UILootingPopupComponent.maxDistanceToLoot) {
      this.showPopup()
      this.hideIndicator()
    }
    else {
      this.hidePopup()
      this.showIndicator()
    }
  }
  updatePopup() {
    let rect = this.element.getBoundingClientRect()
    let position = worldToClientPosition(game, this.gameObject.transform.position)
    position.x -= rect.width/2 + 120
    position.y -= rect.height/2 + 120

    position.x = clamp(position.x, UILootingPopupComponent.elementViewportInset, window.innerWidth - rect.width - UILootingPopupComponent.elementViewportInset)
    position.y = clamp(position.y, UILootingPopupComponent.elementViewportInset, window.innerHeight - rect.height - UILootingPopupComponent.elementViewportInset)

    this.element.style.left = position.x + "px"
    this.element.style.top = position.y + "px"
  }
  createIndicator() {    
    this.indicator = El("div", "looting-popup-indicator hidden")
    let text = El("div", "looting-popup-text", undefined, "Cargo left")
    let icon = El("img", "looting-popup-indicator-icon", [["src", "assets/icons/iconWarning.png"]])
    this.indicator.append(icon, text)
    Q("#game-ui").append(this.indicator)
  }
  showIndicator() {
    if(this.visible.indicator) return
    if(!this.items.length) return

    this.visible.indicator = true
    this.indicator.classList.remove("hidden")
    this.indicator.animate([
      {filter: "opacity(0)"}, {filter: "opacity(1)"}
    ], {duration: 500, easing: "ease-in-out"})
    .onfinish = () => this.indicator.style.filter = ""
  }
  hideIndicator() {
    if(!this.visible.indicator) return
    this.visible.indicator = false
    this.indicator.animate([
      {filter: "opacity(1)"}, {filter: "opacity(0)"}
    ], {duration: 500, easing: "ease-in-out"})
    .onfinish = () => this.indicator.classList.add("hidden")
  }
  updateIndicator() {
    let position = worldToClientPosition(game, this.gameObject.transform.position)
    this.indicator.style.left = position.x + "px"
    this.indicator.style.top = position.y + "px"
  }
  destroyIfNoCargo() {
    if(!this.items.length) 
      UIComponent.destroy(this)
  }
  destroy() {
    this.element.remove()
    this.indicator.remove()
  }
  static elementViewportInset = 120
  static maxDistanceToLoot = 300
}