class Interactable extends Entity {
  constructor(
    pos = Vector.zero(), 
    hitbox = new BoxHitbox(300, 300, debug.colors.hitbox_interactable),
    do_on_enter = [],
    do_on_leave = [],
    hint_text = "",
    parent = null,
  ) {
    super(pos, undefined, undefined, undefined)
    this.pos = pos
    this.parent = parent
    this.hitbox = hitbox
    this.player_inside = false
    this.hint_text = hint_text
    this.hint = null
    this.do_on_enter = do_on_enter
    this.do_on_leave = do_on_leave
  }
  enter() {
    if(this.player_inside) return
    this.player_inside = true
    console.log('player in')
    this.do_on_enter.forEach(command => {
      if(command === "show_hint") {
        this.hint = new Hint(this, this.hint_text)
      }
    })
  }
  leave() {
    if(!this.player_inside) return
    this.player_inside = false
    console.log('player out')
    this.do_on_leave.forEach(command => {
      if(command === "hide_hint") {
        this.hint.dismiss()
        this.hint = null
      }
    })
  }
  update() {
    HitboxTools.updateHitbox(this)
  }
}