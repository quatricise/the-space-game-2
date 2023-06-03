class Weapon extends Component {
  constructor(
    gameObject,
    name,
  ) {
    super(gameObject)
    let objectData = data.weapon[name]
    this.name = name
    this.displayName = objectData.displayName
    this.displayNameShort = objectData.displayNameShort

    for(let key in objectData.weaponData)
      this[key] = objectData.weaponData[key]
      
    for(let key in objectData.methods)
      this[key] = objectData.methods[key]
      
    this.powered = true
    this.ready = true
    this.slotIndex = null
    this.weaponNotReadyOverlay = null
    this.setup()
  }
  handleInput(event) {
    if(!this.powered) return
    this.showNotReadyOverlay(event.type)
    switch(event.type) {
      case "keydown"    : {this.onkeydown(event);    break}
      case "keyup"      : {this.onkeyup(event);      break}
      case "mousemove"  : {this.onmousemove(event);  break}
      case "mousedown"  : {this.onmousedown(event);  break}
      case "mouseup"    : {this.onmouseup(event);    break}
      case "click"      : {this.onclick(event);      break}
      case "wheel"      : {this.onwheel(event);      break}
    }
  }
  showNotReadyOverlay(type) {
    if(type !== this.fireMethod || this.ready) return
    this.destroyNotReadyOverlay()
    this.weaponNotReadyOverlay = GameObject.create(
      "gameOverlay",
      "weaponNotCharged",
      {},
      {world: this.gameObject.gameWorld}
    )
    AudioManager.playSFX("buttonNoAction", 0.1)
  }
  updateNotReadyOverlay() {
    this.weaponNotReadyOverlay?.transform.position.setFrom(
      this.gameObject.transform.position.clone().add(
        new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        ).rotate(this.gameObject.transform.rotation)
      )
    )
    if(this.weaponNotReadyOverlay?.destroyed)
      this.weaponNotReadyOverlay = null
  }
  destroyNotReadyOverlay() {
    if(this.weaponNotReadyOverlay)
      GameObject.destroy(this.weaponNotReadyOverlay)
    this.weaponNotReadyOverlay = null
  }
  update() {
    this.updateSpecific()
    this.updateNotReadyOverlay()
  }
}