class LocationRandomizer {
  constructor(pos) {
    this.pos = pos
    this.object = {}
    this.spawns = []
    this.hitbox = new BoxHitbox(50,50)
  }
  add_object(obj) {
    this.object = obj
  }
  add_spawn(pos, radius) {
    let newspawn = {
      pos: pos.clone(),
      weight: 1,
    }
    this.spawns.push(newspawn)
  }
  remove_spawn(spawn) {
    this.spawns.splice(this.spawns.indexOf(spawn),1)
  }
  update() {
    
  }
}

class RandomSpawner {
  constructor(pos, hitbox = {}) {
    this.pos = pos
    this.data = []
    if(hitbox.type === "circle") this.hitbox = new CircleHitbox(hitbox.radius)
    if(hitbox.type === "box") this.hitbox = new BoxHitbox(hitbox.a, hitbox.b)
  }
  add_object(type, name, weight) {
    let block = {
      weight: weight
    }
    if(type === "asteroid") block.object = new Asteroid()
  }
  update() {
    
  }
}