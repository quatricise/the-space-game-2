class GameUI extends GameWindow {
  constructor() {
    super("GameUI", Q("#game-ui"))
    this.shipHull = Q('#ship-hull-wrapper')
    this.shipHullWrapper = Q('#ship-hull-wrapper')
    this.audioCallPanel = Q("#audio-call-panel")
    this.tooltip = new Tooltip(250)
    this.state = new State(
      "default",
      "dragging"
    )

    this.timers = new Timer(
      ["audioCallFlash", 4000, {loop: true, active: false, onfinish: this.flashAudioCallPanel.bind(this)}]
    )

    /* temp globals for drag functionality */
    this.placeholder = null
    this.placeholderTimeout = null
    this.draggedElement = null
    this.dragParent = null

    /* UI sequence data */
    this.sequenceTooltip = null

    /* Means that game statistics like fps and collisionCount are displayed */
    this.statsVisible = false
  }
  //#region input
  handleKeydown(event) {
    if(event.code === binds.hitbox) 
      visible.hitbox = !visible.hitbox
    if(event.code === binds.navMesh) 
      visible.navMesh = !visible.navMesh
    if(event.code === binds.gameStats)
      this.toggleGameStats()
    if(event.code === binds.devIcons) 
      this.toggleDevIcons()
  }
  handleKeyup(event) {
    
  }
  handleMousedown(event) {
    if(event.target.closest("*[data-draggable='true']"))
      this.activateDrag(event.target.closest("*[data-draggable='true']"))
  }
  handleMousemove(event) {
    let target = event.target
    this.cancelTooltipTimeout()

    if(target.closest(".tooltip"))
      this.activateTooltip(target.closest(".tooltip"))
    else 
      this.cancelTooltip(target.closest(".tooltip"))

    if(target.closest(".tooltip-popup"))
      this.activateTooltipPopup(target.closest(".tooltip-popup"))
    else 
      this.cancelTooltipPopup()

    if(this.state.is("dragging") && this.draggedElement)
      this.updateDraggedItem(target)
  }
  handleMouseup(event) {
    if(this.state.is("dragging"))
      this.endDrag(event)
  }
  handleClick(event) {
    let target = event.target
    if(target.closest(".keyboard-bind-button")) {
      this.handleKeyBind(target)
    }
  }
  handleWheel(event) {

  }
  //#endregion
  handleKeyBind(target) {
    let 
    button = target.closest(".keyboard-bind-button")
    button.classList.add("active")

    let confirm = (e) => {
      button.dataset.key = e.code
      button.innerText = e.code.replace("Key", "").capitalize()
      binds[button.dataset.bind] = e.code
    }
    let resetHTML =  (e) => {
      button.classList.remove("active")
      document.removeEventListener("keydown", handler)
      document.removeEventListener("mousedown", handler)
    }
    let handler = (e) => {
      if(e.code === "Escape" || e.code === "Backspace") 
        return resetHTML(e)
      if(e.type === "mousedown")  
        return resetHTML(e)
      
      confirm(e)
      resetHTML(e)
    }
    document.addEventListener("keydown", handler)
    document.addEventListener("mousedown", handler)
  }
  //#region tooltips
  activateTooltip(target) {
    let delay = +target.dataset.delay
    let element = this.tooltip.element
    this.tooltip.setDataFrom(target)

    const updateTooltip = () => { element.classList.remove("hidden"); this.tooltip.update() }
    
    if(typeof delay === "number")
      this.tooltip.timeout = setTimeout(updateTooltip, delay)
    else 
      this.tooltip.timeout = setTimeout(updateTooltip, this.tooltip.delayDefault)

    this.tooltip.update()
  }
  cancelTooltip() {
    this.tooltip.element.classList.add("hidden")
  }
  cancelTooltipTimeout() {
    window.clearTimeout( this.tooltip.timeout )
  }
  activateTooltipPopup(eventTarget) {
    if(this.tooltipPopup?.triggerElement === eventTarget) {
      this.tooltipPopup.show()
    }
    else {
      this.tooltipPopup?.destroy()
      let attachmentOffset = null
      if(eventTarget.dataset.attachmentoffset)
        attachmentOffset = eval(eventTarget.dataset.attachmentoffset)

      this.tooltipPopup = new PopupTooltip(
        eventTarget, 
        eventTarget.dataset.tooltipattachment, 
        {title: eventTarget.dataset.tooltip, text: eventTarget.dataset.tooltipdescription}, 
        {
          setMaxWidthToTriggerElement:  eventTarget.dataset.setmaxwidthtotriggerelement?.bool(), 
          setMaxHeightToTriggerElement: eventTarget.dataset.setmaxheighttotriggerelement?.bool(),
          centerTooltipText:            eventTarget.dataset.centertooltiptext?.bool(),
          attachmentOffset:             attachmentOffset
        }
      )
    }
  }
  cancelTooltipPopup() {
    this.tooltipPopup?.destroy()
    this.tooltipPopup = null
  }
  //#endregion
  openAudioCallPanel(caller, message, dialogueName) {
    let name = data.person[caller].addressAs ?? data.person[caller].displayName

    this.audioCallPanel.classList.remove("hidden")
    this.audioCallPanel.querySelector(".audio-call-heading").innerText = "You have a call from " + name + "."
    this.audioCallPanel.querySelector(".audio-call-message").innerText = message
    this.audioCallPanel.querySelector(".caller-portrait").src = "assets/portraits/" + caller + ".png"
    this.audioCallPanel.querySelector(".call-option.accept").onclick = () => {
      gameManager.setWindow(dialogueScreen)
      setTimeout(() => dialogueScreen.load(dialogueName), 600)
      this.closeAudioCallPanel()
    }
    this.animateAudioCallPanel(0, 100, () => this.timers.audioCallFlash.start())
    AudioManager.playLoopedAudio("SFX", "tightbeamCall")
  }
  animateAudioCallPanel(fromOpacity, toOpacity, onfinish = () => {}) {
    this.audioCallPanel.animate([
      {filter: `opacity(${fromOpacity / 100})`},
      {filter: `opacity(${toOpacity / 100})`},
    ],
    {
      duration: 650,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    })
    .onfinish = () => {
      this.audioCallPanel.style.filter = ""
      onfinish()
    }
  }
  async flashAudioCallPanel(iterations = 3, durationMS = 125) {
    await fetch("assets/ui/audioCallPopupHover.png")
    await fetch("assets/ui/audioCallPopup.png")
    for(let i = 0; i < iterations; i++) {
      setTimeout(() => this.audioCallPanel.style.backgroundImage = 'url("assets/ui/audioCallPopup.png")')
      AudioManager.playSFX("buttonNoAction", Random.decimal(0.05, 0.15, 1.5))
      await waitFor(durationMS)
      setTimeout(() => this.audioCallPanel.style.backgroundImage = 'url("assets/ui/audioCallPopupHover.png")')
      await waitFor(durationMS)
    }
    this.audioCallPanel.style.backgroundImage = ""
  }
  closeAudioCallPanel() {
    this.animateAudioCallPanel(100, 0, () => this.audioCallPanel.classList.add("hidden"))
    this.timers.audioCallFlash.stop()
  }
  async animateHullDamage() {
    let iterations = 4
    let animDurationMS = 1000 / 8
    await fetch("assets/ui/shipHullAndWeaponPanelWarning.png")
    for(let i = 0; i < iterations; i++) {
      setTimeout(() => Q("#ship-hull-and-weapon-panel").style.backgroundImage = 'url("assets/ui/shipHullAndWeaponPanelWarning.png")')
      await waitFor(animDurationMS)
      setTimeout(() => Q("#ship-hull-and-weapon-panel").style.backgroundImage = 'url("assets/ui/shipHullAndWeaponPanel.png")')
      await waitFor(animDurationMS)
    }
    Q("#ship-hull-and-weapon-panel").style.backgroundImage = ""
  }
  animateHullRepair() {
    this.shipHullWrapper.animate([
      {borderColor: "var(--color-accent)"},
      {borderColor: "unset"},
    ], {
      duration: 250,
      iterations: 2,
      easing: "steps(2)"
    })
    .onfinish = () => {
      this.shipHullWrapper.style.borderColor = ""
    }
  }
  createUIWeaponComponent(weapon, weaponSystem) {
    new UIWeaponComponent(game, Q("#ui-weapon-component-parent"), weapon, weaponSystem)
  }
  destroyUIWeaponComponents() {
    let weaponComponents = game.uiComponents.filter(c => c instanceof UIWeaponComponent)
    for(let c of weaponComponents)
      UIComponent.destroy(c)
  }
  toggleWeaponUIComponentChargedState(weaponElement, isCharged) {
    isCharged ? weaponElement.classList.add("charged") : weaponElement.classList.remove("charged")
  }
  highlightUIElement(elementId) {
    Q(`#${elementId}`).animate([
      {borderColor: "var(--dark-4)"},{borderColor: "white"},
    ], {duration: 220, iterations: 4, easing: "steps(2)"})
  }
  updateShipHullUI() {
    this.shipHull.innerHTML = ""
    for (let i = 0; i < player.ship.hull.level; i++) {
      if(i < player.ship.hull.current)
        this.shipHull.append(El("div", "ship-hull-point"))
      else
        this.shipHull.append(El("div", "ship-hull-point empty"))
    }

    if(player.ship.hull.current <= 4) {
      Q("#ship-hull-and-weapon-panel").classList.add("warning")
      Q("#red-overlay").classList.remove("hidden")
    } 
    else {
      Q("#ship-hull-and-weapon-panel").classList.remove("warning")
      Q("#red-overlay").classList.add("hidden")
    }
  }
  beginUIHintSequence(sequenceName) {
    if(data.UIHintSequence[sequenceName].finished) return

    this.UIHintSequence = sequenceName
    this.stepUIHintSequence(0)
  }
  stepUIHintSequence(index, previousHandler) {
    if(!this.UIHintSequence) return

    document.removeEventListener("keydown", previousHandler)
    let handler = (e) => {
      if(e.code.includesAny("Enter", "NumpadEnter", "Space"))
        this.stepUIHintSequence(++index, handler)
      if(e.code.includes("Escape"))
        this.finishUISequence(handler)
    }
    
    let hintBlock = data.UIHintSequence[this.UIHintSequence].hintSequence[index]
    if(!hintBlock) return this.finishUISequence(handler)

    console.log("Step UI sequence")
    this.sequenceTooltip?.destroy()
    this.sequenceTooltip = null

    let element = Q(`#${hintBlock.parentElementId}`)
    this.sequenceTooltip = new PopupTooltip(
      element, 
      hintBlock.hintPlacement, 
      {title: hintBlock.title, text: hintBlock.text}, 
      hintBlock.options
    )

    if(hintBlock.options.allowPointerEvents)
      this.sequenceTooltip.element.onclick = () => this.stepUIHintSequence(++index, handler)

    document.addEventListener("keydown", handler)

    /* hint actions */
    for(let action of hintBlock.actions) {
      switch(action.actionName) {
        case "clickElement": {
          Q(`#${action.elementId}`).onclick()
          break
        }
        case "focusElement": {
          Q(`#${action.elementId}`).focus()
          break
        }
        case "addClass": {
          Q(`#${action.elementId}`).classList.add(...action.classes)
          break
        }
        case "removeClass": {
          Q(`#${action.elementId}`).classList.remove(...action.classes)
          break
        }
      }
    }
  }
  finishUISequence(handler) {
    if(!this.UIHintSequence) return
    console.log("Finished/Cancelled UI hint sequence")
    
    data.UIHintSequence[this.UIHintSequence].finished = true
    this.UIHintSequence = null
    this.sequenceTooltip?.destroy()
    this.sequenceTooltip = null
    document.removeEventListener("keydown", handler)
  }
  //#region drag and drop 
  activateDrag(target) {
    this.draggedElement = target
    this.dragParent = this.draggedElement.parentElement
    
    if(this.dragParent.dataset.inventorytype == "fixed-size" && this.dragParent.querySelectorAll("[data-draggable='true']").length === +this.dragParent.dataset.inventoryitemcount)
      this.dragParent.append(Item.createEmptyItemElement())
    else
      this.createPlaceholderElement(this.draggedElement)

    let rect = this.draggedElement.getBoundingClientRect()

    this.draggedElement.style.width =   rect.width  + "px"
    this.draggedElement.style.height =  rect.height  + "px"
    this.draggedElement.style.left =    mouse.clientPosition.x + "px"
    this.draggedElement.style.top =     mouse.clientPosition.y  + "px"
    this.draggedElement.style.pointerEvents = "none"
    this.draggedElement.style.position = "fixed"
    this.draggedElement.style.zIndex = 100000

    this.draggedElement.dataset.changedstyles = "width height left top pointerEvents position zIndex"
    this.draggedElement.dataset.order = getChildIndex(this.draggedElement)

    document.body.append(this.draggedElement)
    this.state.set("dragging")

    Qa(".inventory-buy-drop-area") .forEach(button => button.classList.add("active"))
  }
  updateDraggedItem(target) {
    let x = +this.draggedElement.style.left.replace("px", "")
    let y = +this.draggedElement.style.top.replace("px", "")
    x += mouse.clientMoved.x
    y += mouse.clientMoved.y
    this.draggedElement.style.left = x + "px"
    this.draggedElement.style.top = y + "px"

    let dropTarget = target.closest("[data-drop]")
    let dropTargetAcceptedClass = dropTarget?.dataset.drop
    let dropTargetMatchesDraggedElementClass = this.draggedElement.classList.contains(dropTargetAcceptedClass)

    if(dropTargetMatchesDraggedElementClass) {
      let targ = target.closest(`.${dropTargetAcceptedClass}`)
      if(!targ) return
      if(targ === this.placeholder) return
      window.clearTimeout(this.placeholderTimeout)

      if(!this.placeholder && (+dropTarget.dataset.inventoryitemcount || 1) < dropTarget.querySelectorAll("div").length) {
        this.createPlaceholderElement(targ)
      }
      else {
        this.removePlaceholderElement()
        this.placeholderTimeout = setTimeout(() => {
          if(this.placeholder) {
            targ.before(this.placeholder)
            let index = getChildIndex(this.placeholder)
            this.placeholder.dataset.index = index
            this.placeholder.style.order = index
          }
        }, 200)
      }
    }
    else {
      window.clearTimeout(this.placeholderTimeout)
      this.removePlaceholderElement()
    }
  }
  endDrag(event) {
    console.log("end drag")
    if(this.state.isnt("dragging")) return

    let target = event.target
    let dropTarget = target.closest("[data-drop]")
    if(!dropTarget) 
      return this.cancelDrag()

    let dropTargetAcceptedClass = dropTarget.dataset.drop
    let matchesClass = this.draggedElement.classList.contains(dropTargetAcceptedClass)

    if(matchesClass) 
      this.confirmDrag(target, dropTarget, dropTargetAcceptedClass)
    else 
      this.cancelDrag()
  }
  confirmDrag(eventTarget, dropTarget, dropTargetAcceptedClass) {
    console.log("confirm drag")

    let hoveredItem = eventTarget.closest(`.${dropTargetAcceptedClass}`)
    
    if(hoveredItem) {
      let index = +hoveredItem.style.order
      this.draggedElement.style.order = index
      this.draggedElement.dataset.order = index
      
      hoveredItem.before(this.draggedElement)
    }
    else {
      dropTarget.append(this.draggedElement)
    }
    
    const areItemsOverflowing = () => {
      let children = Array.from(dropTarget.querySelectorAll("div"))
      let length = children.length
      if(children.findChild(this.placeholder))
        length--
      
      return length > +dropTarget.dataset.inventoryitemcount
    }

    /* this shit removes overflowing items but only if they are an empty item */
    if(dropTarget.dataset.inventorytype === "fixed-size" && areItemsOverflowing()) {
      let empties = Array.from(dropTarget.querySelectorAll(".empty")).reverse()
      empties.forEach(child => {
        if(
          (child.dataset.draggable || child.classList.contains(dropTargetAcceptedClass) || child.classList.contains("empty")) && 
          child !== this.draggedElement &&
          areItemsOverflowing()
        ) {
          child.remove()
        }
      })
    }
    let areMissingItems = Array.from(this.dragParent.querySelectorAll("div")).length < +this.dragParent.dataset.inventoryitemcount
    if(dropTarget !== this.dragParent && areMissingItems) 
      this.dragParent.append(Item.createEmptyItemElement())
      
    /* awful rudimentary item buy code */
    if(dropTarget.dataset.ondrop === "buy" && this.draggedElement.dataset.cansell && this.draggedElement.dataset.isstationware && player.currency >= +this.draggedElement.dataset.buycost) {
      let item = new Item(this.draggedElement.dataset.itemname)

      player.inventory.addItems(item)
      player.currency -= +this.draggedElement.dataset.buycost
      Q("#station-currency-container").innerText = player.currency
      AudioManager.playSFX("cardShimmer")

      let wareCategory = this.draggedElement.dataset.warecategory
      let station = player.ship.dockData.station
      let ware = station.wares[wareCategory].find(ware => ware.name === this.draggedElement.dataset.itemname)
      station.wares[wareCategory].remove(ware)
      station.setStationWares()

      this.draggedElement.remove()
    }

    /* awful rudimentary equip weapon code */
    if(dropTarget.dataset.ondrop === "equip-weapon" && this.draggedElement.dataset.itemtype === "weapon") {
      player.ship.weapons.addWeapon(this.draggedElement.dataset.itemname)
      inventory.refreshInventoryTab()
    }

    this.resetDrag()
  }
  cancelDrag() {
    console.log('cancel drag')

    let placeBeforeIndex
    this.placeholder ? 
    placeBeforeIndex = +this.placeholder.style.order :
    placeBeforeIndex = +this.draggedElement.dataset.order

    this.dragParent.childNodes[placeBeforeIndex] ?
    this.dragParent.childNodes[placeBeforeIndex].before(this.draggedElement) :
    this.dragParent.append(this.draggedElement)

    this.resetDrag()
  }
  resetDrag() {
    /* here do the things to clean up the UI after the dragging operation ended, regardless of its success */
    let changedStyles = this.draggedElement.dataset.changedstyles.split(" ")
    changedStyles.forEach(ch => {
      this.draggedElement.style[ch] = ""
      this.draggedElement.dataset.changedstyles = ""
    })
    Qa('[data-drop]').forEach(drop => drop.style.backgroundColor = drop.dataset.backgroundColor)
    this.removePlaceholderElement()
    this.draggedElement = null
    this.dragParent = null
    this.state.ifrevert("dragging")

    Qa(".inventory-buy-drop-area") .forEach(button => button.classList.remove("active"))
  }
  createPlaceholderElement(target) {
    console.log("create placeholder")

    this.placeholder = target.cloneNode(true)
    this.placeholder.classList.add("placeholder")
    console.log(this.placeholder)
    target.before(this.placeholder)
  }
  removePlaceholderElement() {
    if(!this.placeholder) return

    console.log("remove placeholder")

    this.placeholder.remove()
    this.placeholder = null
  }
  //#endregion
  toggleGameStats() {
    Q(".game-stats").classList.toggle("hidden")
    this.statsVisible = !this.statsVisible
  }
  toggleDevIcons() {
    Qa(".dev-icon").forEach(icon => icon.classList.toggle("hidden"))
  }
  updateStats() {
    if(!this.statsVisible) return
    
    Q('#collision-count').innerText = game.previousCollisions.length
    Q('#zoom-level').innerText = game.camera.currentZoom
    Q("#game-state-view").innerText = game.state.current.capitalize()
    Q("#stage-offset").innerText = "x: " + game.app.stage.position.x.toFixed(0) + " y: " + game.app.stage.position.y.toFixed(0) 
    Q("#fps").innerText = fps.toFixed(0)
  }
  update() {
    this.updateStats()
    this.timers.update()
  }
}
