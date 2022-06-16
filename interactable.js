class Interactable extends Entity {
  constructor(pos = Vector.zero(), parent = null, hitbox = new BoxHitbox(300, 300, debug.colors.hitbox_interactable)) {
    super(pos, undefined, undefined, undefined)
    this.pos = pos
    this.parent = parent
    this.hitbox = hitbox
    this.playerInside = false
    this.trigger = () => {
      if(!this.playerInside)
      console.log('triggered interaction')
      this.playerInside = true
    }
  }
  update() {
    //HitboxTools.updateHitbox(this.hitbox) i guess
  }
}