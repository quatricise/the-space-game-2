class Item {
  constructor(name, title, thumb, desc, location) {
    this.id = uniqueID(items)
    this.name = name
    this.title = title
    this.thumb = thumb
    this.desc = desc
    this.location = location
    
    items.push(this)
    this.referencedIn = []
    this.referencedIn.push(items)
  }
}

Item.create = (object, type = "e.g. weapon") => {
  if(type === "weapon") {
    let item = new Item(object.name, object.title)
  }
}