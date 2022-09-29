class Person extends GameObject {
  constructor(name, jobTitle, location) {
    super()
    let person = data.person[name]
    this.name = person.name
    this.location = location
    this.jobTitle = data.jobTitle[jobTitle]
    this.displayName = person.displayName
    this.currency = 0
    this.inventory = new Inventory()
  }
  setJobTitle(jobTitle) {
    if(!data.jobTitle[jobTitle])
      throw "jobTitle not found"
    this.jobTitle = data.jobTitle[jobTitle]
  }
}