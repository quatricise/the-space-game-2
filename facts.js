class FactManager {
  constructor() {
    
  }
  update_fact(identifier, value) {

  }
  create_fact(owner, identifier, value) {
    if(!owner || !identifier || value === undefined) return false
    if(facts.find(f => f.identifier === identifier && f.owner === owner)) {
      alert("already exists")
      return false
    }
    console.log('created fact')
    Qa(".icon-export-facts").forEach(icon => icon.classList.add('warning'))
    let id = facts.length
    facts.push(
      {
        id: id,
        owner: owner,
        identifier: identifier,
        value: value,
      }
    )
    return true
  }
  delete_fact(identifier) {

  }
  export() {
    exportToJsonFile(facts, "facts")
    Qa(".icon-export-facts").forEach(icon => icon.classList.remove('warning'))
  }
}
let fact_manager = new FactManager()

let facts; 
readTextFile("data/facts/facts.json", function(text) {
  let d = JSON.parse(text)
  facts = d
})



//so the dialogue with the highest number of specific requirements from any given set of options
//will be triggered

//each "criterion" will have an importance rating, and it will override any number or at least
//an equal number of less important facts
