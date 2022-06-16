class Item {
  constructor(location, name, description) {
    this.id = uniqueID(items)
    this.name = name
    this.description = description
    this.location = []//reference to object
    this.owners = [{},{}] //player or NPC or null, it cannot be sold if it is not in possession of one of the owners, which means a type of inventory[] container that they have control over
  }
  static moveTo(location) {
    this.referenced_in.forEach(array => {array = array.filter(item=> item !== this)})
    location.push(this)
  }
  static destroy() {
    this.referenced_in.forEach(array => {array = array.filter(item=> item !== this)})
  }
}

let items = []