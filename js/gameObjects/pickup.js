class Pickup extends GameObject {
  constructor(transform, name, objectData) {
    super(transform)
    this.type = "pickup"
    this.name = name
    let objData = data.pickup[name]

    this.components = ["sprite", "hitbox"]
  }
}