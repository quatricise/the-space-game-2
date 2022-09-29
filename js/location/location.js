class GameLocation {
  constructor(name, gameWorld) {
    this.name = name
    this.generated = false
    this.objects = []
    this.fog = []
    this.npcs = []
    this.gameWorld = gameWorld
  }
  generate() {
    // throw "deprecated, I need to unify this location generation logic into one place"
  }
  load() {
    this.gameWorld.state.set("loading")
    readTextFile("data/locations/" + this.name + ".json", (text) => {
      let d = JSON.parse(text)
      d.objects.forEach(obj => {
        GameObject.create(obj.type, obj.name, obj, {world: this.gameWorld})
      })
      this.createBackground()
      this.createFog(d.fog)
      this.gameWorld.state.revert()
    })
    if(!this.generated) 
      this.generate()
  }
  createBackground() {
    console.warn("Background generation is a static function, location background parameters aren't implemented yet.")
    let objects = []
    let variants = ["bgMedium0", "bgMedium1", "bgMedium2", "bgMedium3", "bgMedium4", "bgMedium5"]
    let minDistance = 50
    let total = 400
    let attempts = 0

    function newPos() {
      return new Vector(randR(-cw*2, cw*2), randR(-ch*2, ch*2))
    }
    for (let i = 0; i < total; i++) {
      let pos;
      let vel = new Vector(rand(-5,5), rand(-5,5))
      let rotation = rand(0, TAU)
      let rotationVelocity = 0
      let overlapping;
      
      do {
        overlapping = false
        pos = newPos()
        objects.forEach(obj => {
          if(Collision.circleCircle({pos: pos, radius: minDistance}, {pos: obj.pos, radius: minDistance})) {
            overlapping = true
            attempts++
          }
        })
        if(attempts > 100_000) {
          console.log('too many attempts to generate BG (> 100_000)')
          break
        }
      }
      while(overlapping)

      GameObject.create(
        "bgObject", 
        pickRand(variants), 
        {
          transform: new Transform(
            pos,
            vel,
            rotation,
            rotationVelocity,
          ),
          bgType: "asteroid",
        },
        {world: this.gameWorld}
      )
    }
    
    let planet = PIXI.Sprite.from("assets/planet.png")
    planet.anchor.set(0.5)
    planet.alpha = 0.5
    game.layers.planet.addChild(planet)
  }
  createFog(fog) {
    if(!fog) return
    fog.forEach(f => {
      let fog = PIXI.Sprite.from("assets/fogDab.png")
      fog.position.set(f.pos.x, f.pos.y)
      fog.anchor.set(0.5)
      fog.alpha = f.alpha
      this.fog.push(fog)
      game.layers.fog.addChild(fog)
    })
  }
  // sendObject(destination = "location string identifier", object) {
  //   destination.receive(object)
  //   this.objectRemove(object)
  // }
  // sendFact(destination = "locationName", fact = "string") {
  //   let factcopy = _.cloneDeep(fact)
  //   locations[destination].facts.push(factcopy)
  // }
  // objectRemove(object) {
  //   this.objects.remove(object)
  // }
}