class WeaponSystem extends ShipSystem {
  constructor(gameObject, systemData) {
    super(gameObject, systemData)
    this.powerFree = this.power
    this.createWeaponSlots(systemData.slots)
    this.weapons = []
    this.activeWeapon = null
    for(let weaponName of systemData.weapons)
      this.addWeapon(weaponName)
  }
  createWeaponSlots(slotCount) {
    this.slots = {}
    for(let i = 0; i < slotCount; i++)
      this.slots[i] = null
  }
  addWeapon(weaponName) {
    let weapon = new Weapon(this.gameObject, weaponName)
    this.weapons.push(weapon)

    let firstEmptySlot
    for(let key in this.slots) {
      if(this.slots[key] === null) {
        firstEmptySlot = key
        break
      }
    }
    if(firstEmptySlot === "0")
      this.activeWeapon = weapon
    if(firstEmptySlot === undefined)
      console.error("weapon cannot be added, all slots are taken")

    this.slots[firstEmptySlot] = weapon
    weapon.slotIndex = +firstEmptySlot
    
    setTimeout(() => {
      this.editShipSpriteWeapons(weapon, firstEmptySlot)
      if(this.gameObject === player.ship)
        gameUI.createUIWeaponComponent(weapon, this)
    }, 0)
  }
  editShipSpriteWeapons(weapon, slotIndex) {
    let sprite
    if(data.weapon[weapon.name].spriteCount) {
      if(weapon.canBeDismounted) 
        sprite = Sprite.animatedSprite("assets/weaponSprite/" + weapon.name + "0000.png", data.weapon[weapon.name].spriteCount)
      else
        sprite = Sprite.animatedSprite("assets/weaponSprite/_empty0000.png", 1)
      sprite.animationSpeed = 0.1
      sprite.loop = false
      sprite.gotoAndStop(0)
    }
    
    sprite.anchor.set(0.5)
    sprite.position.set(this.gameObject.weaponSlots[slotIndex].x, this.gameObject.weaponSlots[slotIndex].y)
    
    if(this.gameObject.weaponSlots[weapon.slotIndex].y > 0)
      sprite.scale.set(1, -1)

    this.gameObject.sprite.weapons.addChild(sprite)
    this.gameObject.sprite.all.push(sprite)
  }
  setActiveWeapon(weapon) {
    this.activeWeapon = weapon

    if(this.gameObject === player?.ship) 
      this.createWeaponSelectOverlay(this.weapons.indexOf(this.activeWeapon))
  }
  cycleActiveWeapon(direction) {
    let weaponIndex = this.weapons.indexOf(this.activeWeapon)
    if(direction === 1) 
      weaponIndex === this.weapons.length - 1 ? this.setActiveWeapon(this.weapons[0])     : this.setActiveWeapon(this.weapons[weaponIndex + 1])
    else 
      weaponIndex === 0                       ? this.setActiveWeapon(this.weapons.last()) : this.setActiveWeapon(this.weapons[weaponIndex - 1])
  }
  removeAllWeapons() {
    let indexOffset = 0
    let indices = []
    this.weapons.forEach((weapon, index) => {
      if(!weapon.canBeDismounted) return indexOffset--

      for(let key in this.slots)
        if(this.slots[key] === weapon)
          this.slots[key] = null

      indices.push(index + indexOffset)
    })
    this.gameObject.sprite.weapons.children = this.gameObject.sprite.weapons.children.filter((c, i) => indices.findChild(i) == null)
    this.weapons = this.weapons.filter(weapon => !weapon.canBeDismounted)
    // console.log(this.weapons, this.slots)
  }
  removeWeapon(weapon) {
    throw "unfinished function"
  }
  powerWeapon(weapon) {
    weapon.powered = true
  }
  unpowerWeapon(weapon) {
    weapon.powered = false
  }
  toggleArmWeapons() {
    if(this.weapons.find(w => w.powered))
      this.disarmWeapons()
    else
      this.armWeapons()

    AudioManager.playSFX("buttonNoAction", 0.3)
  }
  disarmWeapons() {
    if(!this.weapons.find(w => w.powered)) return

    this.weapons.forEach(w => {
      w.powered = false
      w.ready = false
      w.charges = 0
      w.timers?.recharge?.reset()
      this.gameObject.sprite.weapons.children[w.slotIndex]?.gotoAndStop(0)
    })
    this.adjustWeaponSprites(-10, false)
  }
  armWeapons() {
    if(this.weapons.find(w => w.powered)) return

    this.weapons.forEach(w => {
      w.powered = true
      w.timers?.recharge?.start()
    })
    this.adjustWeaponSprites(10, true)
  }
  adjustWeaponSprites(shiftAmount, setToPowered) {
    let indexOffset = 0
    this.weapons.forEach((w, index) => {
      if(!w.canBeDismounted) return
      
      let sprite = this.gameObject.sprite.weapons.children[index + indexOffset]
      this.gameObject.weaponSlots[index].y > 0 ?
      sprite.position.set(sprite.position.x, sprite.position.y + shiftAmount) :
      sprite.position.set(sprite.position.x, sprite.position.y - shiftAmount)
      setToPowered ? sprite.filters = [] : sprite.filters = [filters.unpoweredWeapon]
    })
  }
  createWeaponSelectOverlay(slotIndex) {
    if(this.weapons.length === 0) return

    this.destroyWeaponSelectOverlay()
    this.weaponSelectOverlay = GameObject.create("gameOverlay", "weaponSelect", {}, {world: this.gameObject.gameWorld})
    this.weaponSelectOverlay.slotIndex = slotIndex
    this.updateWeaponSelectOverlay()

    AudioManager.playSFX("buttonNoAction", 0.15)
  }
  updateWeaponSelectOverlay() {
    if(this.weapons.length === 0)            return
    if(this.weaponSelectOverlay?.destroyed) return this.weaponSelectOverlay = null
    if(!this.weaponSelectOverlay)           return

    this.weaponSelectOverlay.transform.position.setFrom(
      this.gameObject.transform.position.clone().add(
        new Vector(
          this.gameObject.weaponSlots[this.weaponSelectOverlay.slotIndex].x,
          this.gameObject.weaponSlots[this.weaponSelectOverlay.slotIndex].y,
        ).rotate(this.gameObject.transform.rotation)
      )
    )
    this.weaponSelectOverlay.transform.rotation = this.gameObject.transform.rotation
  }
  destroyWeaponSelectOverlay() {
    if(this.weaponSelectOverlay) {
      GameObject.destroy(this.weaponSelectOverlay)
      this.weaponSelectOverlay = null
    }
  }
  onUnpower() {
    this.disarmWeapons()
  }
  onRepower() {
    this.armWeapons()
  }
  update() {
    let weaponPowerReduction = sum(...this.weapons.map(w => {
      if(w.powered)
        return w.power
      else
        return 0
    }))
    this.powerFree = this.power - weaponPowerReduction
    this.weapons.forEach(w => w.update())
    this.updateWeaponSelectOverlay()
  }
}