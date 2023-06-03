class Interactable extends GameObject {
  constructor(
    transform,
    name,
    hitbox,
    doOnEnter = [],
    doOnLeave = [],
    doOnDestroy = [],
    parent = null,
    interactionData,
    interactionId
  ) {
    super(transform)
    this.type = "interactable"
    this.name = name
    this.parent = parent
    this.triggered = false
    this.triggerers = new Set()
    this.doOnEnter = doOnEnter
    this.doOnLeave = doOnLeave
    this.doOnDestroy = doOnDestroy

    this.components = ["hitbox"]
    this.registerComponents({hitbox})

    this.interactionData = interactionData
    this.interactionId = interactionId
    this.hint = null

    if(!parent)
      console.log("parent object not found, probably destroyed or wrong parent id was input")
  }
  checkTriggererValidity(triggerer) {
    if(this.interactionData.trigger.allowedTypes.find(t => t === triggerer.type))
      return true
    if(this.interactionData.trigger.allowedIds.find(id => id === triggerer.id))
      return true
    if(this.interactionData.trigger.allowAll)
      return true
  }
  trigger(triggerer) {
    if(this.triggerers.has(triggerer)) 
      return
    if(this.checkTriggererValidity(triggerer))
      this.enter(triggerer)
  }
  enter(triggerer) {
    this.triggerers.add(triggerer)
    this.triggered = !!this.triggerers.size

    if(this.interactionData.interactionDelay) {
      setTimeout(() => {
        this.doOnEnter.forEach(command => this[command]())
      }, this.interactionData.interactionDelay)
    }
    else {
      this.doOnEnter.forEach(command => this[command]())
    }
  }
  leave(triggerer) {
    this.triggerers.delete(triggerer)
    this.triggered = !!this.triggerers.size
    this.doOnLeave.forEach(
      command => this[command]()
    )
  }
  updatePosition() {
    this.transform.position.setFrom(this.parent.transform.position)
  }
  update() {
    if(this.parent.destroyed)
      GameObject.destroy(this)

    this.updatePosition()
    this.triggerers.forEach(object => {
      if(!Collision.auto(this.hitbox, object.hitbox))
        this.leave(object)
    })
  }
  destroy() {
    if(this.gameWorld.state.is("loadingLocation")) return
    
    this.doOnDestroy.forEach(command => this[command]())
    this.hintGraphic?.dismiss()
    let interaction = this.gameWorld.interactionsTemplate.interactions.find(i => i.interactionId === this.interactionId)
    interaction.options.isAlreadyCreated = false
  }
  //#region interaction commands
  showHint() {
    if(this.hint) return

    let hintData = {}
    for(let key in this.interactionData.hintData)
      hintData[key] = this.interactionData.hintData[key]

    this.hint = GameObject.create(
      "hint", 
      "Hint", 
      {
        transform: new Transform(), 
        hintData: hintData,
        parent: this, 
      },
      {
        world: this.gameWorld
      }
    )
  }
  hideHint() {
    if(!this.hint) return

    this.hint.dismiss()
    this.hint = null
  }
  triggerAudioCall() {
    gameUI.openAudioCallPanel(this.interactionData.audioCallCaller, this.interactionData.audioCallMessage, this.interactionData.audioCallName, )
  }
  createMarker() {
    this.gameWorld.createMarkerById(this.interactionData.newMarkerId)
  }
  destroyMarker() {
    this.gameWorld.destroyMarkerById(this.interactionData.newMarkerId)
  }
  createInteraction() {
    this.gameWorld.createInteractionById(this.interactionData.newInteractionId)
  }
  createHintGraphic() {
    this.hintGraphic = GameObject.create(
      "hintGraphic", 
      this.interactionData.hintGraphicData.name, 
      {
        parent: GameObject.byId(this.gameWorld, this.interactionData.hintGraphicData.parentGameObject)
      },
      {world: this.gameWorld}
    )
  }
  destroyHintGraphic() {
    if(this.hintGraphic)
      GameObject.destroy(this.hintGraphic)
    this.hintGraphic = null
  }
  destroyInteractable() {
    GameObject.destroy(this)
  }
  activateShipSystem() {
    this.parent[this.interactionData.shipSystemName].activate()
  }
  deactivateShipSystem() {
    this.parent[this.interactionData.shipSystemName].deactivate()
  }
  fireWeapon() {
    if(!this.parent.weapons) throw "cannot fire a weapon if gameObject doesn't have a weapon system"

    let weapon = this.parent.weapons.weapons.find(w => w.name === this.interactionData.firedWeaponName)
    this.parent.weapons.setActiveWeapon(weapon)
    weapon.fire()
  }
  highlightUIElement() {
    gameUI.highlightUIElement(this.interactionData.highlightedElementId)
  }
  setUIElementVisibility() {
    switch(this.interactionData.uiElementAnimation) {
      case "fade": {
        let element = Q(`#${this.interactionData.uiElementId}`)
        let endValue = this.interactionData.uiElementVisibility === "show" ? 1 : 0
        let startValue = 1 - endValue
        
        if(startValue === 0)
          element.classList.remove("hidden")

        let anim = element.animate(
          [{filter: `opacity(${startValue})`},{filter: `opacity(${endValue})`}],
          {duration: 1000}
        )
        anim.onfinish = () => {
          element.style.filter = `opacity(${endValue})`
          if(endValue === 1)
            element.style.filter = ""
          if(endValue === 0)
            element.classList.add("hidden")
        }
        break
      }
      default: {
        this.interactionData.uiElementVisibility === "show" ?
        Q(`#${this.interactionData.uiElementId}`).classList.remove("hidden") : 
        Q(`#${this.interactionData.uiElementId}`).classList.add("hidden") 
      }
    }
  }
  async showQuestPanel() {
    let questPanel = Q("#quest-panel")
    Q("#quest-panel-quest-name").innerText = this.interactionData.questData.name

    await waitFor(1700)
    questPanel.animate([
      {filter: "opacity(0)", transform: "scale(0.99)"},
      {filter: "opacity(1)", transform: "scale(1.0)"},
    ], {duration: 1500, easing: "ease-in-out"})
    .onfinish = () => {
      questPanel.style.filter = "opacity(1)"
      setTimeout(hideQuestPanel, 2350)
    }
    function hideQuestPanel() {
      questPanel.animate([
        {filter: "opacity(1)", transform: "scale(1.0)"},
        {filter: "opacity(0)", transform: "scale(1.03)"},
      ], {duration: 1500, easing: "ease-in-out"})
      .onfinish = () => questPanel.style.filter = "opacity(0)"
    }
  }
  async showThankYouPanel() {
    let 
    thankYouPanel = Q("#thank-you-panel")
    thankYouPanel.style.filter = "opacity(0)"
    thankYouPanel.classList.remove("hidden")

    await waitFor(1500)

    thankYouPanel.animate([
      {filter: "opacity(0)", transform: "scale(0.98)"},
      {filter: "opacity(1)", transform: "scale(1.0)"},
    ], {duration: 1500, easing: "ease-in-out"})
    .onfinish = () => thankYouPanel.style.filter = ""
  }
  setFacts() {
    for(let fact of this.interactionData.facts)
      Fact.setFact(fact.identifier, fact.value)
  }
  createFacts() {
    for(let fact of this.interactionData.facts)
      Fact.create(undefined, fact.identifier, fact.value)
  }
  addUIHandler() {
    this.hookedElement = Q(this.interactionData.UIHandlerData.elementSelector)
    this.UIhandler = () => game.createInteractionById(this.interactionData.UIHandlerData.interactionId)
    this.hookedElement.addEventListener(this.interactionData.UIHandlerData.eventType, this.UIhandler)
  }
  removeUIHandler() {
    this.hookedElement?.removeEventListener(this.interactionData.UIHandlerData.eventType, this.UIhandler)
  }
  createTooltip() {
    let tooltip = this.interactionData.tooltipData
    if(tooltip.type === "popup") {
      this.tooltip = new PopupTooltip(
        Q(`#${tooltip.parentElementId}`),
        tooltip.attachment,
        {title: tooltip.title, text: tooltip.text},
        tooltip.options
      )
    }
    if(tooltip.type === "regular") {
      //do nothing really cos the regular tooltip isn't useful for this
    }
  }
  destroyTooltip() {
    this.tooltip?.destroy()
    this.tooltip = null      
  }
  setNPCState() {
    for(let npc of this.interactionData.npcStateData.NPCs) {
      let NPC = this.gameWorld.gameObjects.npc.find(NPC => NPC.name === npc)
      NPC.stateMachine.setStateByName(this.interactionData.npcStateData.stateName)
    }
  }
  //#endregion
}