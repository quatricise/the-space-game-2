class Person extends GameObject {
  constructor(name) {
    super()
    let objectData = data.person[name]
    /** @type String */
    this.name = objectData.name
    /** @type String */
    this.type = "person"
    /** @type String */
    this.displayName = objectData.displayName
    /** @type Number */
    this.currency = 0
    
    /** @type Inventory */
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