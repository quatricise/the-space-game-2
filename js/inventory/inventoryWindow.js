class InventoryWindow extends GameWindow {
  constructor() {
    super("InventoryWindow", Q('#inventory-window'))

    this.inventoryTab = Q("#inventory-inventory-tab")
    this.stationTab =   Q("#inventory-station-tab")
    this.questTab =     Q("#inventory-quest-tab")
    this.inventoryTabs = [this.inventoryTab, this.stationTab, this.questTab]

    this.cargoInventoryGrid = Q("#cargo-inventory-grid-6-columns")
  
    this.viewInventoryTab("station")
    this.createStationSellInventories()
  }
  show() {
    this.element.classList.remove("hidden")

    if(this.currentTabName === "station" && player?.ship?.state.isnt("docked"))
      this.viewInventoryTab("inventory")
    
    gameUI.beginUIHintSequence("inventory")
  }
  hide() {
    this.element.classList.add("hidden")
    gameUI.finishUISequence()
  }
  createStationSellInventories() {
    let categories = ["weapons", "systems", "misc"]
    for(let category of categories) {
      let itemContainerId = `station-row-items-${category}`
      let capacity = +Q(`#${itemContainerId}`).dataset.inventoryitemcount
      this["stationInventory" + category.capitalize()] = new Inventory(capacity, {itemContainerId})
    }
  }
  viewInventoryTab(which) {
    if(which === "station" && player?.ship?.state.isnt("docked")) return

    this.inventoryTabs.forEach(t => t.classList.add("hidden"))
    this[which + "Tab"].classList.remove("hidden")

    /* set the right window label */
    Qa(".station-window-label").forEach(label => label.classList.add("hidden"))
    this.element.querySelector(`.station-window-label.${which}`)  ?.classList.remove("hidden")
    
    this.element.querySelector(".station-switch-icon.active")     ?.classList.remove("active")
    this.element.querySelector(`.station-switch-icon.${which}`)   .classList.add("active")
    this.element.querySelector(`*[data-tab='${which}']`)          .classList.add("active")

    this[`viewInventoryTab${which.capitalize()}`]()
    this.currentTabName = which
  }
  viewInventoryTabStation() {
    Q("#station-currency-container").innerText = player?.currency
  }
  viewInventoryTabInventory() {
    this.refreshInventoryTab()
  }
  viewInventoryTabQuest() {
    
  }
  enableStationTab() {
    Q("#inventory-switch-station").classList.remove("disabled")
    Q("#inventory-switch-station").classList.remove("tooltip")
  }
  disableStationTab() {
    Q("#inventory-switch-station").classList.add("disabled")
    Q("#inventory-switch-station").classList.add("tooltip")
  }
  fillCargoWithEmptyItems() {
    for(let i = 0; i < 6 * 6; i++) {
      this.cargoInventoryGrid.append(Item.emptyItemElement())
    }
  }
  refreshInventoryTab() {
    player.inventory.assignContainer("player-inventory-grid")
    player.inventory.updateContainer()

    /* update ship weapon slots */
    Qa(".ship-weapon-slot-wrapper .ship-inventory-weapon-slot").forEach((slot, index) => {
      slot.innerHTML = ""

      let item
      if(player.ship.weapons.weapons[index]) {
        let itemData = data.item[player.ship.weapons.weapons[index].name]
        item = Item.createItemElement(itemData, {enableDrag: true})

        /* if the weapon is equipped, remove its item from the player inventory grid */
        let duplicateItemInGrid = Q(`#${player.inventory.containerId} .inventory-item[data-itemname='${itemData.name}']`)
        if(duplicateItemInGrid) {
          duplicateItemInGrid.remove()
          Q(`#${player.inventory.containerId}`).append(Item.createEmptyItemElement())
        }

      }
      else {
        item = Item.createEmptyItemElement()
      }
      
      slot.append(item)
    })
  }
  //#region input
  handleKeydown(event) {
    if(event.code === binds.openInventory)
      gameManager.closeWindow()
    if(event.code === binds.openStationMenu)
      gameManager.closeWindow()
  }
  handleMousedown(event) {
    switch(event.button) {
      case 0: {this.handleLeftDown(event);   break}
      case 1: {this.handleMiddleDown(event); break}
      case 2: {this.handleRightDown(event);  break}
    }
  }
  handleLeftDown(event) {
    
  }
  handleMiddleDown(event) {
    
  }
  handleRightDown(event) {
    
  }
  //#endregion
}