class Rigid extends Entity {
  constructor(pos = Vector.zero(), vel = Vector.zero(), rotation = 0, rotation_velocity = 0, hitbox) {
    super(pos, vel, rotation, rotation_velocity)
    this.hitbox = _.cloneDeep(hitbox)
    this.hitbox_relative = _.cloneDeep(this.hitbox)
    rigids.push(this)
    this.referenced_in.push(rigids)
  }
}