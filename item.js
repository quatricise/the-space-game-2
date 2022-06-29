// class Item {
//   constructor(owner, name, description) {
//     this.id = uniqueID(items)
//     this.name = name
//     this.description = description
//     this.location = []//reference to object
//     this.owners = [{},{}] //player or NPC or null, it cannot be sold if it is not in possession of one of the owners, which means a type of inventory[] container that they have control over
//   }
//   static moveTo(owner) {
//     this.referenced_in.forEach(array => {array = array.filter(item=> item !== this)})
//     location.push(this)
//   }
//   static destroy() {
//     this.referenced_in.forEach(array => {array = array.filter(item=> item !== this)})
//   }
// }

let items = []

class Item {
  constructor(name, title, thumb, desc, location) {
    this.id = uniqueID(items)
    this.name = name
    this.title = title
    this.thumb = thumb
    this.desc = desc
    this.location = location
    
    items.push(this)
    this.referenced_in = []
    this.referenced_in.push(items)
  }
}