class Entity {
  constructor(pos = Vector.zero(), vel = Vector.zero(), rotation = 0, rotation_velocity = 0) {
    //create uniqueID
    this.id = uniqueID(entities)
    this.pos = _.cloneDeep(pos)
    this.vel = _.cloneDeep(vel)
    this.rotation = rotation
    this.rotation_velocity = rotation_velocity
    this.cell_pos = new Vector(0)

    this.collided = false
    this.collided_with = null //object reference

    this.disabled = false //this will stop any calculations on the entity, including rendering of any kind

    this.referenced_in = []
    //this is roughly the composition system
    //i want to reference classes in the most specific object in the hierarchy,
    //the object will copy methods from classes mentioned in this array
    this.copy_methods_from = [Entity, Rigid] 
    entities.push(this)
    this.referenced_in.push(entities)
  }
  update_cell_pos() {
    this.cell_pos.x = Math.floor(this.pos.x / grid.cell_size)
    this.cell_pos.y = Math.floor(this.pos.y / grid.cell_size)
  }
}

class EntityMethods {
  static destroy() {
    for (let i = 0; i < this.referenced_in.length; i++) {
      let index = this.referenced_in[i].indexOf(this)
      this.referenced_in[i].splice(index, 1)
    }
    this.removeFromScene()
  }
  static removeFromScene() {
    this.disabled = true
    app.stage.removeChild(this.sprite_container)
  }
}