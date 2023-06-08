class Hint extends GameObject {
  constructor(transform, hintData, fadeoutTime = 520, parent) {
    super(transform)
    this.type = "hint"
    this.name = "Hint"
    this.parent = parent
    this.fadeoutTimeMax = fadeoutTime
    this.fadeTime = fadeoutTime
    this.dismissed = false
    this.id = uniqueIDString(12)
    this.timers = new Timer()
    for(let key in hintData)
      this[key] = hintData[key]

    this.createHtml()
    this.registerCompleteMethods()
    this.fade(0, 1, this.flash.bind(this))
  }
  createHtml() {
    this.element = El('div', "hint tooltip-popup", [["id", this.id]], this.hintText)
    this.element.dataset.tooltip = "Click to dismiss hint [H]"
    this.element.dataset.tooltipattachment = "top"
    this.element.dataset.setmaxwidthtotriggerelement = "true"
    this.element.dataset.parentelementid = this.id
    this.element.dataset.playsfx = ""
    this.element.dataset.sounds = "buttonHover buttonClick"
    this.element.dataset.playonevents = "mouseover mousedown"

    /* do periodic hint flashing */
    this.timers.add(
      ["flash", 6500, {loop: true, active: true, onfinish: this.flash.bind(this, 3, 180)}]
    )

    if(this.hintText != "")
      Q('#interaction-container').append(this.element)

    this.element.style.filter = "opacity(0)"
    this.element.onclick = () => this.complete()
    this.updateHtml()
  }
  registerCompleteMethods() {
    if(!this.hintComplete) {
      this.onComplete = () => {}
      return
    }
    this.onComplete = () => this[this.hintComplete.onComplete]()
    this.hintComplete.eventListeners = []

    /* register event listeners for all the requirements for hint completion */
    for(let [index, req] of this.hintComplete.requirements.entries())
      this.registerRequirementCompleteMethod(req, index)
  }
  registerRequirementCompleteMethod(requirement, index) {
    switch(requirement.method) {
      case "UIevent": {
        let eventType = requirement.eventType
        let handlerMethod = (event) => {
          let eventBind = requirement.eventBind
          if(eventBind) {
            if(event.code === binds[eventBind])
              this.completeRequirement(index)
          }
          else {
            this.completeRequirement(index)
          }
        }
        
        let targetElement
        if(!requirement.elementSelector)
          targetElement = document
        else
          targetElement = Q(requirement.elementSelector)

        targetElement.addEventListener(eventType, handlerMethod)

        this.hintComplete.eventListeners.push({ targetElement, eventType, handlerMethod })
        break
      }
      case "gameEvent": {
        switch(requirement.eventType) {
          case "destroyGameObject": {
            this.timers.add(
              ["requirementCheck" + index, 100, {loop: true, active: true, onfinish: this.requirementCheck.bind(this, index)}]
            )
            break
          }
        }
        break
      }
    }
  }
  unregisterRequirementCompleteMethod(index) {
    switch(this.hintComplete.requirements[index].method) {
      case "UIevent": {
        let listenerData = this.hintComplete.eventListeners[index]
        listenerData.targetElement.removeEventListener(listenerData.eventType, listenerData.handlerMethod)
        break
      }
      case "gameEvent": {
        this.timers.remove("requirementCheck" + index)
        break
      }
    }
  }
  requirementCheck(index) {
    /* 
    this is called periodically every 100ms or so as long as the hint is active, it checks the state of the world

    this shitty function checks whether a specific requirement for the hint completion has been fulfilled
    so far it only accepts gameEvent and destroyGameObject 
    */
    let requirement = this.hintComplete.requirements[index]
    switch(requirement.method) {
      case "gameEvent": {
        switch(requirement.eventType) {
          case "destroyGameObject": {
            if(!GameObject.byId(this.gameWorld, requirement.gameObjectId)) {
              this.completeRequirement(index)
              console.log("completed destroygameobject requirement")
            }
            break
          }
        }
        break
      }
    }
  }
  //#region hintType specific methods
  static() {
    /* this does nothing */
  }
  dynamic() {
    let boundingBox = this.element.getBoundingClientRect()
    this.element.style.left = Math.floor( this.transform.position.x -boundingBox.width/2 ) + "px"
    this.element.style.top =  Math.floor( this.transform.position.y -boundingBox.height/2 ) + "px"
    this.transform.position = worldToClientPosition(this.gameWorld, this.parent.transform.position)
  }
  //#endregion
  //#region animations
  fade(fromOpacity, toOpacity, onFinish) {
    this.element.animate([
      {
        filter: `opacity(${fromOpacity})`
      },
      {
        filter: `opacity(${toOpacity})`
      },
    ], {
      duration: this.fadeoutTimeMax
    })
    .onfinish = () => {
      this.element.style.filter = ""
      if(onFinish && !this.destroyed)
        onFinish()
    }
  }
  async flash(iterations = 3, durationMS = 125) {
    /* flash animation */
    for(let i = 0; i < iterations; i++) {
      setTimeout(() => this.element.style.backgroundImage = 'url("/assets/ui/hintContainerHover.png")')

      if(this.hintText)
        AudioManager.playSFX("buttonNoAction", Random.decimal(0.05, 0.15, 2))

      await waitFor(durationMS)
      setTimeout(() => this.element.style.backgroundImage = 'url("/assets/ui/hintContainer.png")')
      await waitFor(durationMS)
    }
    this.element.style.backgroundImage = ""
  }
  //#endregion
  //#region onComplete commands
  destroyInteractable() {
    console.log("destroyed interactable")
    GameObject.destroy(this.parent)
  }
  none() {
    //useless method that does nothing but needs to be here in case I need some hint to do "none"
  }
  //#endregion
  updateHtml() {
    this.element.style.filter = `opacity(${this.opacity})`
  }
  updateLife() {
    if(this.dismissed) 
      this.fadeTime -= 1000 * dt
    if(this.fadeTime <= 0) 
      GameObject.destroy(this)
  }
  update() {
    this.updateLife()
    this.updateHtml()
    if(!this[this.hintType]) 
      console.error("Missing hintType on hint:", this, "HintType is required and has two values: dynamic, static")
    this[this.hintType]()
    this.transform.position.setFrom(this.parent.transform.position)
  }
  dismiss() {
    this.dismissed = true
    this.fade(1, 0)
  }
  completeRequirement(index) {
    this.hintComplete.requirements[index].complete = true
    this.unregisterRequirementCompleteMethod(index)
    if(this.hintComplete.requirements.find(req => req.complete !== true)) return
    this.complete()
  }
  complete() {
    this.dismiss()
    this.onComplete()
  }
  destroy() {
    this.element.remove()
    console.log("destroyed hint", this)
  }
  static async preloadAssets() {
    /* preload images just in case */
    let images = ["/assets/ui/hintContainerHover.png", "/assets/ui/hintContainer.png"]

    await Promise.all(images.map(src => {
      new Promise(resolve => {
        let img = new Image()
        img.src = src
        img.onload = resolve()
      })
    }))
    console.log("Hint assets loaded.")
  }
}