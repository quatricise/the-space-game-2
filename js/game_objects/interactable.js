class Interactable extends Rigid {
  constructor(
    transform,
    name,
    hitbox,
    do_on_enter = ["set", "of", "commands"],
    do_on_leave = ["set", "of", "commands"],
    hint_text = "",
    parent = null,
  ) {
    super(transform, hitbox)
    this.type = "interactable"
    this.name = name
    this.parent = parent
    this.triggered = false
    this.triggerers = new Set()
    {
      //weird garbage, these are too specific
      this.hint_text = hint_text
      this.hint = null
      this.sprite = PIXI.Sprite.from("assets/special_objects/interactable.png")
      this.sprite.anchor.set(0.5)
      this.container = new PIXI.Container()
      this.container.addChild(this.sprite)
    }
    this.do_on_enter = do_on_enter
    this.do_on_leave = do_on_leave
  }
  trigger(triggerer) {
    if(this.triggerers.has(triggerer)) return
    else this.enter(triggerer)
  }
  enter(triggerer) {
    this.triggerers.add(triggerer)
    this.triggered = !!this.triggerers.size
    this.do_on_enter.forEach(
      command => this[command]()
    )
  }
  leave(triggerer) {
    this.triggerers.delete(triggerer)
    this.triggered = !!this.triggerers.size
    this.do_on_leave.forEach(
      command => this[command]()
    )
  }
  //#region commands
  hide_hint() {
    if(!this.hint) return
    this.hint.dismiss()
    this.hint = null
  }
  show_hint() {
    if(this.hint) return
    this.hint = GameObject.create("hint", "Hint", {transform: new Transform(), parent: this, text: this.hint_text})
  }
  //#endregion
  update_position() {
    if(this.parent) this.transform.position.set_from(this.parent.transform.position)
  }
  update() {
    this.update_position()
    this.triggerers.forEach(object => {
      if(!Collision.auto(this.hitbox, object.hitbox)) {
        this.leave(object)
      }
    })
  }
}