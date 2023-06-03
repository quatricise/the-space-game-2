class Requirement {
  constructor(type, data = {}) {
    this.initialize(type, data)
  }
  initialize(type, data) {
    this.type = type
    if(!Requirement.types[type])
      return console.error("Invalid requirement type: ", type)
    for(let key in data) {
      if(Requirement.propertiesPerType[this.type].findChild(key))
        this[key] = data[key]
    }
  }
  flipType() {
    let type = this.type === "condition" ? "fact" : "condition"
    this.initialize(type, Requirement.defaultData())
  }
  static empty(type) {
    return new Requirement(
      type,
      Requirement.defaultData()
    )
  }
  static defaultData() {
    return {
      entryObject: "emptyObject", 
      accessorChain: [""], 
      condition: {type: "exists"},
      identifier: "",
      expectedValue: true,
    }
  }
  static types = {
    condition: true,
    fact: true,
  }
  static propertiesPerType = {
    condition:  ["entryObject", "accessorChain", "condition"],
    fact:       ["identifier", "expectedValue"],
  }
  static conditionTypes = ["exists", "greater", "smaller", "equals"]
}