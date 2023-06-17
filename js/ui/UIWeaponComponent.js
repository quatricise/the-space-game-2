class UIWeaponComponent extends UIComponent {
  constructor(gameWindow, appendTo, playerWeaponReference, weaponSystem) {
    super(gameWindow)
    this.weapon = playerWeaponReference
    this.weaponSystem = weaponSystem
    this.chargeBars = []
    this.chargesMax = this.weapon.chargesMax ?? this.weapon.chargeLevelMax ?? 1
    this.createHTML(appendTo)
  }
  createHTML(parentElement) {
    this.elementId = uniqueIDString()

    /* elements for the weapon selector */
    this.element =                El("div", "ui-weapon-container tooltip-popup", [["id", this.elementId]])
    this.icon =                   El("div", `weapon-icon`)
    this.titleElement =           El("div", "weapon-title", undefined, this.weapon.displayNameShort)
    this.weaponChargeContainer =  El("div", "selected-weapon-charge-state tooltip-popup")
    this.chargeIndicator =        El("div", `ui-weapon-container-charge-indicator ${this.weapon.type}`)

    this.icon.style.backgroundImage = `url(assets/weaponIcon/${this.weapon.name}.png)`
    this.titleElement.style.color = data.weapon[this.weapon.name].iconColor || `var(--color-${this.weapon.type})`
    
    /* element tooltip setup */
    this.element.dataset.parentelementid =      "ship-hull-and-weapon-panel"
    this.element.dataset.tooltipattachment =    "right"
    this.element.dataset.tooltip =              "Selected weapon"
    this.element.dataset.tooltipdescription =   "This weapon fires if you click somewhere."

    /* create charge bars */
    for(let i = 0; i < this.chargesMax; i++) {
      let bar = El("div", `selected-weapon-charge-bar ${this.weapon.type}`)
      this.weaponChargeContainer.append(bar)
      this.chargeBars.push(bar)
    }

    /* weapon slots for the ship graphic */
    this.weaponChargeContainer.dataset.parentelementid =    "ship-hull-and-weapon-panel"
    this.weaponChargeContainer.dataset.tooltipattachment =  "right"
    this.weaponChargeContainer.dataset.tooltip =            "Charges"
    this.weaponChargeContainer.dataset.tooltipdescription = "Current number of charges for this weapon."

    let weaponSlotYPositionGreaterThanZero = this.weaponSystem.gameObject.weaponSlots[+this.weapon.slotIndex].y > 0

    this.weaponSlot =                 El("div", `weapon-slot weapon-slot-${this.weapon.slotIndex}`)
    this.weaponSlotChargeIndicator =  El("div", `weapon-charge-indicator ${weaponSlotYPositionGreaterThanZero ? "right" : "left"}`)
    this.weaponChargeProgressBar =    El("div", "weapon-charge-progress-bar")
    this.weaponSlotIcon =             this.icon.cloneNode(true)

    this.weaponSlot.dataset.weaponcomponentid = this.elementId
    this.weaponSlot.dataset.playsfx = ""
    this.weaponSlot.dataset.sounds = "buttonClick"
    this.weaponSlot.dataset.playonevents = "mousedown"
    this.weaponSlot.onmouseenter = () => this.weaponSystem.createWeaponSelectOverlay(this.weapon.slotIndex)

    /* append stuff together */
    this.weaponSlot.append(this.weaponSlotIcon, this.weaponSlotChargeIndicator)
    
    this.weaponSlotChargeIndicator.append(this.weaponChargeProgressBar)
    Q("#ship-graphic").append(this.weaponSlot)

    this.element.append(this.chargeIndicator, this.icon, this.titleElement, this.weaponChargeContainer)
    parentElement.append(this.element)
  }
  handleMousedown(event) {
    if(event.target.closest("#" + this.elementId))
      player.ship.weapons.setActiveWeapon(this.weapon)
    if(event.target.closest(`.weapon-slot[data-weaponcomponentid='${this.elementId}'`))
      player.ship.weapons.setActiveWeapon(this.weapon)
  }
  toggleActiveState() {
    if(this.weaponSystem.activeWeapon !== this.weapon) return

    Qa(".ui-weapon-container").forEach(w => w.classList.remove("active"))
    this.element.classList.add("active")
  }
  toggleChargedState() {
    if(this.weapon.ready) {
      this.element.classList.add("charged")
      this.weaponSlot.classList.add("ready")
    }
    else {
      this.element.classList.remove("charged")
      this.weaponSlot.classList.remove("ready")
    }
  }
  updateWeaponChargePercentage() {
    if(!this.weapon.timers?.recharge) return

    let percentage = (this.weapon.timers.recharge.currentTime / this.weapon.chargeDurationMS) * 100
    let cssValue
    if(!this.weapon.ready && !this.weapon.charges && !percentage)
      cssValue = 0
    else
      cssValue = percentage || 100
    this.chargeIndicator.style.width =          cssValue + "%"
    this.weaponChargeProgressBar.style.height = cssValue + "%"
  }
  updateWeaponCharges() {
    let charges = this.weapon.charges ?? 1
    if(this.weapon.ready && !this.weapon.charges)
      charges = 1
    if(!this.weapon.ready && this.weapon.charges === 0)
      charges = 0

    for(let i = 0; i < this.chargeBars.length; i++) {
      if(charges > i)
        this.chargeBars[i].classList.add("active")
      else
        this.chargeBars[i].classList.remove("active")
    }
  }
  update() {
    this.updateWeaponCharges()
    this.updateWeaponChargePercentage()
    this.toggleActiveState()
    this.toggleChargedState()
  }
  destroy() {
    this.element.remove()
    this.weaponSlot.remove()
  }
}