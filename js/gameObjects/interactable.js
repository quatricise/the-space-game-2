class Interactable extends Rigid {
  constructor(
    transform,
    name,
    hitbox,
    doOnEnter = ["set", "of", "commands"],
    doOnLeave = ["set", "of", "commands"],
    hintText = "",
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
      this.hintText = hintText
      this.hint = null
      this.sprite = PIXI.Sprite.from("assets/specialObjects/interactable.png")
      this.sprite.anchor.set(0.5)
      this.container = new PIXI.Container()
      this.container.addChild(this.sprite)
    }
    this.doOnEnter = doOnEnter
    this.doOnLeave = doOnLeave
  }
  trigger(triggerer) {
    if(this.triggerers.has(triggerer)) return
    else this.enter(triggerer)
  }
  enter(triggerer) {
    this.triggerers.add(triggerer)
    this.triggered = !!this.triggerers.size
    this.doOnEnter.forEach(
      command => this[command]()
    )
  }
  leave(triggerer) {
    this.triggerers.delete(triggerer)
    this.triggered = !!this.triggerers.size
    this.doOnLeave.forEach(
      command => this[command]()
    )
  }
  //#region commands
  hideHint() {
    if(!this.hint) return
    this.hint.dismiss()
    this.hint = null
  }
  showHint() {
    if(this.hint) return
    this.hint = GameObject.create("hint", "Hint", {transform: new Transform(), parent: this, text: this.hintText})
  }
  //#endregion
  updatePosition() {
    if(this.parent) this.transform.position.setFrom(this.parent.transform.position)
  }
  update() {
    this.updatePosition()
    this.triggerers.forEach(object => {
      if(!Collision.auto(this.hitbox, object.hitbox)) {
        this.leave(object)
      }
    })
  }
}