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
}
let fact_manager = new FactManager()

let facts = [
  {
    id: 0,
    owner: "player",
    identifier: "has_big_pp",
    value: true,
  },
  {
    id: 1,
    owner: "player",
    identifier: "is_big_t",
    value: true,
  },
  {
    id: 2,
    owner: "bob",
    identifier: "is_sexy",
    value: true,
  },
]
