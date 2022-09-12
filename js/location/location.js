class GameLocation {
  constructor(name, game_world) {
    this.name = name
    this.generated = false
    this.objects = []
    this.fog = []
    this.npcs = []
    this.game_world = game_world
  }
  generate() {
    throw "deprecated, I need to unify this location generation logic into one place"
    // this.objects.forEach(obj => {
    //   if(obj.type === "location_randomizer") {
    //     let type = obj.object.type
    //     let name = obj.object.name
    //     if(type === "ship") {
    //       let ship = new Ship(
    //         new Vector(obj.pos.x, obj.pos.y),
    //         new Vector(obj.vel.x, obj.vel.y),
    //         obj.rotation,
    //         obj.rotation_velocity, 
    //         obj.name,
    //       )
    //     }
    //   }
    //   if(obj.type === "random_spawner") {

    //   }
    // })
  }
  load() {
    this.game_world.state.set("loading")
    readTextFile("data/locations/" + this.name + ".json", (text) => {
      let d = JSON.parse(text)
      d.objects.forEach(obj => {
        GameObject.create(obj.type, obj.name, obj, {world: this.game_world})
      })
      this.generate_background()
      this.generate_fog(d.fog)
      this.game_world.state.revert()
    })
    if(!this.generated) this.generate()
  }
  generate_background() {
    console.warn("Background generation is a static function, location background parameters aren't implemented yet.")
    let objects = []
    let variants = ["bg_medium_0", "bg_medium_1", "bg_medium_2", "bg_medium_3", "bg_medium_4", "bg_medium_5"]
    let min_distance = 50
    let total = 400
    let attempts = 0
    function new_pos() {
      return new Vector(randR(-cw*2, cw*2), randR(-ch*2, ch*2))
    }
    for (let i = 0; i < total; i++) {
      let pos;
      let vel = new Vector(rand(-5,5), rand(-5,5))
      let rotation = rand(0, TAU)
      let rotation_velocity = 0
      let overlapping;
      
      do {
        overlapping = false
        pos = new_pos()
        objects.forEach(obj => {
          if(Collision.circleCircle({pos: pos, radius: min_distance}, {pos: obj.pos, radius: min_distance})) {
            overlapping = true
            attempts++
          }
        })
        if(attempts > 100000) {console.log('f'); break }
      }
      while(overlapping)

      GameObject.create(
        "bg_object", 
        pickRand(variants), 
        {
          pos: pos, 
          vel: vel, 
          rotation: rotation, 
          rotation_velocity: rotation_velocity,
          bg_type: "asteroid",
        },
        {world: this.game_world}
      )
    }
    
    let planet = PIXI.Sprite.from("assets/planet.png")
    planet.anchor.set(0.5)
    planet.alpha = 0.5
    game.layers.planet.addChild(planet)
  }
  generate_fog(fog) {
    if(!fog) return
    fog.forEach(f => {
      let fog = PIXI.Sprite.from("assets/fog_dab.png")
      fog.position.set(f.pos.x, f.pos.y)
      fog.anchor.set(0.5)
      fog.alpha = f.alpha
      this.fog.push(fog)
      game.layers.fog.addChild(fog)
    })
  }
  send_object(destination = "location string identifier", object) {
    destination.receive(object)
    this.object_remove(object)
  }
  send_fact(destination = "location_name", fact = "string") {
    let factcopy = _.cloneDeep(fact)
    locations[destination].facts.push(factcopy)
  }
  object_remove(object) {
    this.objects.remove(object)
  }
}