class Location {
  constructor(identifier) {
    this.name = identifier
    this.objects = []
    this.facts = {
      hostile_towards_crown: true,
      has_angered_weapon_shopkeeper: false,
    }
  }
  load(id) {
    let d = data.locations[id]
  }
  unload() {
    //unload all sprites, music and garbage, only keep a reference to this somewhere
    
  }
  send_object(destination = "scene string identifier", object) {
    destination.receive(object)
    this.removeObject(object)
  }
  send_fact(destination = "scene_name", fact = "string") {
    locations["destination"].receive_fact(fact)
  }
  removeObject(object) {
    this.objects.splice(this.objects.indexOf(object), 1)
  }
  receive_fact(fact) {
    let factcopy = _.cloneDeep(fact)
    this.facts.push(factcopy)
  }
}

//make scenes share and send data like ships with characters, 

//also some facts will be local to any scene, like the fact you murdered a dozen civilians
//by accident, but they may spread through various methods the NPC class or something
