class Weapon extends Component {
  constructor(
    /** @type GameObject */ gameObject,
    /** @type String */     name,
  ) {
    super(gameObject)
    let objectData = data.weapon[name]

    /** @type String */
    this.name = name

    /** @type String */
    this.displayName = objectData.displayName

    /** @type String */
    this.displayNameShort = objectData.displayNameShort

    for(let key in objectData.weaponData)
      this[key] = objectData.weaponData[key]
      
    for(let key in objectData.methods)
      this[key] = objectData.methods[key]
    
    /** @type Boolean */
    this.powered = true

    /** @type Boolean */    
    this.ready = true

    /** @type Number */
    this.slotIndex = null

    /** @type GameOverlay */
    this.weaponNotReadyOverlay = null

    /** @type GameOverlay */
    this.noAmmoOverlay = null

    /** Function provided by the weapon data */
    this.setup()
  }
  handleInput(event) {
    if(!this.powered) return
    this.createNotReadyOverlay(event.type)
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
  createNotReadyOverlay(type) {
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
  createNoAmmoOverlay() {
    this.destroyNoAmmoOverlay()
    this.noAmmoOverlay = GameObject.create(
      "gameOverlay",
      "noAmmo",
      {},
      {world: this.gameObject.gameWorld}
    )
    AudioManager.playSFX("buttonNoAction", 0.1)
  }
  updateNoAmmoOverlay() {
    this.noAmmoOverlay?.transform.position.setFrom(
      this.gameObject.transform.position.copy.add(new Vector(0, 200))
    )
    if(!this.noAmmoOverlay || this.noAmmoOverlay.destroyed)
      this.noAmmoOverlay = null
  }
  destroyNoAmmoOverlay() {
    if(this.noAmmoOverlay) {
      GameObject.destroy(this.noAmmoOverlay)
      console.log("f")
    }
      
    this.noAmmoOverlay = null
  }
  update() {
    this.updateSpecific()
    this.updateNotReadyOverlay()
    this.updateNoAmmoOverlay()
  }
}