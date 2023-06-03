class Fact {
  constructor(id, identifier, value) {
    this.id = id ?? Fact.index.length
    this.identifier = identifier
    this.value = value ?? false
  }
  static createSetterFact(...args) {
    return new Fact(...args)
  }
  static loadFacts() {
    readJSONFile("data/facts/facts.json", function(text) {
      let facts = JSON.parse(text)
      facts.forEach(fact => {
        Fact.create(fact.id, fact.identifier, fact.value)
      })
    })
  }
  static exportFacts() {
    let exportData = []
    for(let key in this.index) {
      let fact = this.index[key]
      exportData.push({id: fact.id, identifier: fact.identifier, value: fact.value})
    }
    exportToJSONFile(exportData, "facts")
  }
  static create(...args) {
    let fact = new Fact(...args)

    if(this.index[fact.identifier] === undefined)
      this.index[fact.identifier] = fact
    else
      this.setFact(args[1], args[2])
  }
  static setFact(identifier, value) {
    if(this.index[identifier] === undefined)
      this.create(undefined, identifier, value)
    else
      this.index[identifier].value = value
  }
  static testForCondition(entryObject = "player", accessorChain = ["ship", "hull", "current"], condition) {
    let currentLevel = eval(entryObject)
    while
    (
      accessorChain.length && 
      currentLevel[accessorChain[0]] !== null && 
      currentLevel[accessorChain[0]] !== undefined
    )
    currentLevel = currentLevel[accessorChain.shift()]

    switch(condition.type) {
      case "exists": {
        return !!currentLevel
      }
      case "greater": {
        return currentLevel > condition.testValue
      }
      case "smaller": {
        return currentLevel < condition.testValue
      }
      case "equals": {
        return currentLevel == condition.testValue
      }
    }
    return false
  }
  static testForFact(identifier) {
    return this.index[identifier]?.value === true
  }
  static index = {} //index of Fact instances
}