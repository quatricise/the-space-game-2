class Person extends GameObject {
  constructor(name) {
    super()
    let objectData = data.person[name]
    this.name = objectData.name
    this.type = "person"
    this.displayName = objectData.displayName
    this.currency = 0
    this.inventory = new Inventory()
    this.setJobTitle(objectData.jobTitle)
  }
  setJobTitle(jobTitle) {
    this.jobTitle = data.jobTitle[jobTitle] ?? console.error("invalid job title: ", jobTitle)
  }
  update() {
    throw "person cannot be instantiated, it either has to be NPC or Player"
  }
}