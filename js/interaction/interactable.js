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

    if(!parent) console.log("parent object not found, probably destroyed or wrong parent id was input")
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
    gameUI.openAudioCallPanel(this.interactionData.audioCallCaller, this.interactionData.audioCallMessage, this.interactionData.audioCallName)
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
    else
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
  setGameObjectData() {
    let data = this.interactionData.gameObjectData
    data.forEach(datablock => {
      let objects = [...this.gameWorld.gameObjects.gameObject]

      /* filter by gameObject type */
      if(datablock.filter.type) {
        objects = objects.filter(obj => obj.type === datablock.filter.type)
      }

      /* filter further by allowed ids */
      if(datablock.filter.ids) {
        objects = objects.filter(obj => datablock.filter.ids.findChild(obj.id))
      }

      objects.forEach(obj => {
        let accessPoint = obj
        if(datablock.path) {
          for(let property of datablock.path) {

            /* exit entirely if the next property cannot be accessed */
            if(!accessPoint) return
            
            accessPoint = accessPoint[property]
          }
        }
        for(let key in datablock.data) {
          accessPoint[key] = typeof datablock.data[key] === "object" ? _.cloneDeep(datablock.data[key]) : datablock.data[key]
        }
      })
    })
  }
  turnAllShipsHostile() {
    for(let npc of this.gameWorld.gameObjects.npc) {
      npc.stateMachine.setStateByName("attackEnemy")
    }
  }
  createGameObjects() {
    let data = this.interactionData.gameObjectData
    data.forEach(datablock => {
      /* placement */
      if(datablock.placement) {
        if(datablock.placement.special === "near-player") {
          datablock.params.transform = new Transform(player.ship.transform.position.copy)
          datablock.params.transform.position.add(new Vector(Random.int(300, 350), 0).rotate(Random.rotation()))
        }
      }

      /* parent */
      if(datablock.parentId) {
        let parent = GameObject.byId(this.gameWorld, datablock.parentId)
        datablock.params.parent = parent
      }

      /* particle before the object appears */
      if(datablock.particleBefore) {
        let particle = GameObject.create("particle", datablock.particleBefore.name, {transform: datablock.params.transform}, {world: this.gameWorld})
        particle.onDestroy = () => createGameObject()

        if(datablock.particleBefore.name === "beaconAppear") {
          AudioManager.playSFX("beaconAppear", 0.8)
        }
      }
      else {
        createGameObject()
      }
      function createGameObject() {GameObject.create(datablock.type, datablock.name, datablock.params, datablock.options)}
    })
  }
  destroyGameObjects() {
    let data = this.interactionData.gameObjectData
    data.forEach(datablock => {
      datablock.filter.ids?.forEach(id => {
        let obj = GameObject.byId(this.gameWorld, id)
        if(obj) GameObject.destroy(obj)
      })
      datablock.filter.types?.forEach(type => {
        let objects = [...this.gameWorld.gameObjects[type]]
        objects.forEach(obj => GameObject.destroy(obj))
      })
    })
  }
  beginCountdown() {
    Countdown.begin(this.interactionData.countdown)
  }
  showModal() {
    gameManager.setWindow(modal)
    let data = this.interactionData.modal
    Q("#modal-title").innerHTML = createRichText(data.title)
    Q("#modal-description").innerHTML = createRichText(data.description)

    /* options parse */
    for(let key in data.options) {
      Q(`#modal-button-${key}`).innerText = data.options[key].text

      /* parse onclick event */
      data.options[key].onclick.forEach(click => {
        switch(click.action) {
          case "createInteractions": {
            modal.addClickForButton(key, () => {
              for(let id of click.data.interactions) {
                this.gameWorld.createInteractionById(id)
              }
            })
            break
          }
          case "openWindow": {
            let window = eval(click.data.window)
            modal.addClickForButton(key, () => {
              setTimeout(() => gameManager.setWindow(window), 10)
            })
            break
          }
          default: {throw `Couldn't find onclick event: ${click.action}`}
        }
      })
    }
  }
  //#endregion
}