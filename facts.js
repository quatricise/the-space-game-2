class FactManager {
  constructor(params) {
    
  }
  update_fact(owner, identifier, value) {

  }
  create_fact(owner, identifier, value) {
    if(!owner || !identifier || value === undefined) return
    if(facts.find(f => f.identifier === identifier && f.owner === owner)) {
      alert("already exists")
      return
    }
    console.log('created fact')
    let id = facts.length
    facts.push(
      {
        id: id,
        owner: owner,
        identifier: identifier,
        value: value,
      }
    )
  }
  export() {
    exportToJsonFile(facts, "facts")
  }
}
let fact_manager = new FactManager()

let facts; 
readTextFile("data/facts/facts.json", function(text) {
  let d = JSON.parse(text)
  facts = d
})
