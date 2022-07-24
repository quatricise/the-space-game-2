class Loc {
  constructor(identifier) {
    this.name = identifier
    this.generated = false
    this.objects = []
    this.npcs = []
  }
  generate() {
    this.objects.forEach(obj => {
      if(obj.type === "location_randomizer") x
      if(obj.type === "random_spawner") y
    })
  }
  load(id) {
    if(!this.generated) this.generate()
    readTextFile("data/locations/" + id + ".json", (text) => {
      let d = JSON.parse(text)
      d.objects.forEach(obj => {
        if(obj.type === "asteroid") {
          let asteroid = new Asteroid(
            new Vector(obj.pos.x, obj.pos.y),
            new Vector(obj.vel.x, obj.vel.y),
            obj.rotation,
            obj.rotation_velocity, 
            obj.name
          )
          asteroid.addToScene()
          this.objects.push(asteroid)
        }
        if(obj.type === "ship") {
          let asteroid = new Ship(
            new Vector(obj.pos.x, obj.pos.y),
            new Vector(obj.vel.x, obj.vel.y),
            obj.rotation,
            obj.rotation_velocity, 
            obj.name
          )
          asteroid.addToScene()
          this.objects.push(asteroid)
        }
      })
    })
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
