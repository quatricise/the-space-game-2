class Inventory {
  constructor(capacity, options = {itemContainerId: null}) {
    this.items = []
    this.capacity = capacity ?? 30
    this.id = uniqueIDString()

    if(options.itemContainerId) {
      this.assignContainer(options.itemContainerId)
      this.updateContainer()
    }
  }
  /* Replace with a custom handling method */
  onItemAdd() {

  }
  assignContainer(containerId) {
    this.containerId = containerId
  }
  removeItems(...items) {
    items.forEach(i => this.items.remove(i))
  }
  addItems(...items) {
    for(let item of items) {
      if(this.isFull) break
      if(!(item instanceof Item)) throw "only input Item class instances"
      this.items.push(item)
      this.onItemAdd()
    }
  }
  findItemByName(name) {
    return this.items.find(i => i.name === name) || null
  }
  get isFull() {
    return this.items.length === this.capacity
  }
  //#region HTML part
  updateContainer() {
    Q(`#${this.containerId}`).innerHTML = ""
    let items = []

    for(let i = 0; i < this.capacity; i++)
      if(this.items[i])
        items.push(Item.createItemElement(data.item[this.items[i].name], {enableDrag: true, smallItem: false}))
      else
        items.push(Item.createEmptyItemElement({smallItem: false}))
    
    this.itemElements = [...items]
    Q(`#${this.containerId}`).append(...items)
    Q(`#${this.containerId}`).dataset.inventoryid = this.id
  }
  refillWithEmpty() {
    
  }
  //#endregion
}