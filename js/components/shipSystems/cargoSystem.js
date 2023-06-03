class CargoSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.capacity = data.capacity
    this.items = []
    for(let item of data.items)
      this.addItems(new Item(item))
  }
  removeItems(...items) {
    items.forEach(i => this.items.remove(i))
  }
  removeItemByName(name) {
    let item = this.findItemByName(name)
    if(item) {
      this.removeItems(item)
      return true
    }
    else {
      return false
    }
  }
  transferItem(item) {
    this.removeItems(item)
    return item
  }
  addItems(...items) {
    for(let item of items) {
      if(this.isFull) {
        this.displayFullWarning()
        break
      }
      this.items.push(item)
    }
  }
  displayFullWarning() {
    console.warn("Ship cargo is full. Any overflowing items have been lost to the void.")
  }
  findItemByName(name) {
    return this.items.find(i => i.name === name) || null
  }
  update() {

  }
  get isFull() {
    return this.items.length === this.capacity
  }
}