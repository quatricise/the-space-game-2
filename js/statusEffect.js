class StatusEffect {
  constructor(gameObject, name) {
    let objectData = data.statusEffect[name]
    this.type = "statusEffect"
    this.name = name

    this.gameObject = gameObject
    this.gameObject.statusEffects.push(this)

    this.timers = new Timer(
      ["decrement", objectData.durationMS, {loop: false, active: true, onfinish: this.onFinish.bind(this)}]
    )
  }
  onFinish() {
    this[this.name + "Finish"]()
    this.destroy()
  }
  affectGameObject() {
    this[this.name]()
  }
  //#region effect type specific methods
  movementTrap() {
    this.gameObject.engine?.unpower()
    this.gameObject.brakes?.brake()
    this.gameObject.boosters?.unpower()
  }
  movementTrapFinish() {
    this.gameObject.engine?.repower()
    this.gameObject.boosters?.repower()
  }
  //#endregion
  update() {
    this.affectGameObject()
    this.timers.update()
  }
  destroy() {
    this.gameObject.statusEffects.remove(this)
  }
  static types = [
    "fire",
    "frost",
    "movementTrap",
    "engineJam",
    "fog",
  ]
}