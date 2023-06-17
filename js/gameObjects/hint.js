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
    /* create hint */
    this.element = El('div', "hint tooltip-popup")
    this.element.dataset.tooltip = "Click to dismiss ~bind=dismissHint~"
    this.element.dataset.tooltipattachment = "top"
    this.element.dataset.setmaxwidthtotriggerelement = "true"
    this.element.dataset.parentelementid = this.id
    this.element.dataset.playsfx = ""
    this.element.dataset.sounds = "buttonHover buttonClick"
    this.element.dataset.playonevents = "mouseover mousedown"

    let richText = createRichText(this.hintText)

    /* put the innerHTML inside the hint element */
    this.element.innerHTML = "<div class='hint-content'>" + richText + "</div>"

    /* create miniature */
    this.miniature = El('div', "hint-miniature tooltip-popup")
    this.miniature.dataset.tooltip = "Maximize [Click]"
    this.miniature.dataset.delay = 300
    this.miniature.dataset.tooltipattachment = "top"
    this.miniature.dataset.parentelementid = this.id
    this.miniature.dataset.playsfx = ""
    this.miniature.dataset.sounds = "buttonHover buttonClick"
    this.miniature.dataset.playonevents = "mouseover mousedown"

    /* create wrapper element */
    this.hintWrapper = El('div', "hint-wrapper")
    this.hintWrapper.append(this.element, this.miniature)

    /* turns other hints into a miniature and displays this hint */
    this.miniature.onclick = () => this.maximize()

    /* do periodic hint flashing */
    this.timers.add(
      ["flash", 6500, {loop: true, active: true, onfinish: this.periodicFlash.bind(this, 3, 180)}]
    )

    if(Qa('#interaction-container *:not(.hidden)').length > 0)
      this.element.classList.add("hidden")
    else
      this.miniature.classList.add("hidden")

    if(this.hintText != "") 
      Q('#interaction-container').append(this.hintWrapper)

    this.element.style.filter = "opacity(0)"
    this.element.onclick = () => this.complete()
    this.updateHtml()
  }
  maximize() {
    this.minimizeOtherInteractions()
    this.element.classList.remove("hidden")
    this.miniature.classList.add("hidden")
  }
  minimize() {
    this.element.classList.add("hidden")
    this.miniature.classList.remove("hidden")
  }
  minimizeOtherInteractions() {
    game.gameObjects.hint.forEach(hint => hint.minimize())
    gameUI.minimizeAudioCallPanel()
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
    this shitty function checks whether a specific requirement for the hint completion has been fulfilled
    so far it only accepts gameEvent and destroyGameObject 

    this is called periodically EVERY 100ms or so as long as the hint is active
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
  periodicFlash(iterations, durationMS) {
    /* this function exists solely to check whether the hint is a miniature, in that case the flashing isn't applied */
    if(this.element.classList.contains("hidden")) return
    this.flash(iterations, durationMS)
  }
  async flash(iterations = 3, durationMS = 125) {
    /* choose whether to animate the full element or miniature */
    let element, image
    if(this.element.classList.contains("hidden")) {
      element = this.miniature
      image = "hintMiniature"
    }
    else {
      element = this.element
      image = "hintContainer"
    }

    for(let i = 0; i < iterations; i++) {
      element.style.backgroundImage = `url("assets/ui/${image}Hover.png")`

      if(this.hintText)
        AudioManager.playSFX("buttonNoAction", Random.decimal(0.05, 0.15, 2))

      await waitFor(durationMS)
      element.style.backgroundImage = `url("assets/ui/${image}.png")`
      await waitFor(durationMS)
    }
    element.style.backgroundImage = ""
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
    this.hintWrapper.remove()
    //console.log("destroyed hint", this)
  }
  static async preloadAssets() {
    /* preload images just in case */
    let images = ["assets/ui/hintContainerHover.png", "assets/ui/hintContainer.png"]

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