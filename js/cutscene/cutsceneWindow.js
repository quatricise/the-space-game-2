class CutsceneWindow extends GameWindow {
  constructor() {
    super("CutsceneWindow", Q('#cutscene-window'))
    this.cutscene = null
    this.hint =       Q('#cutscene-window').querySelector(".cutscene-hint")
    this.hintFull =   Q('#cutscene-window').querySelector(".cutscene-skip-options.full")
    this.hintMouse =  Q('#cutscene-window').querySelector(".cutscene-skip-options.mouse")
    this.imageSprites = []
    this.tickId = null
  }
  show() {
    this.animationTick()
    this.element.classList.remove("hidden")
    this.element.animate([
      {
        filter: "opacity(0)"
      },
      {
        filter: "opacity(1)"          
      },
    ], {
      duration: 1000,
    })
    .onfinish = () => this.element.style.filter = ""
  }
  hide() {
    if(!this.active) {
      this.element.classList.add("hidden")
      return
    }
    this.animationTickStop()
    this.element.animate([
      {
        filter: "opacity(1)"
      },
      {
        filter: "opacity(0)"
      },
    ], {
      duration: 1000,
    })
    .onfinish = () => this.element.classList.add("hidden")
  }
  loadCutscene(name) {
    this.cutscene = new Cutscene(name)
    this.cutscene.begin()
    gameManager.setWindow(this)
    Qa(".cutscene-element").forEach(e => e.remove())
  }
  handleKeydown(e) {
    if(e.code === binds.skipCutscene)
      this.exit()
    else
    if(e.code === binds.replayPage)
      this.cutscene.replayPage()
    else
    if(this.cutscene && this.cutscene.finished)
      this.exit()
    else
    if(this.cutscene && this.cutscene.finishedPage)
      this.cutscene.nextPage()
  }
  handleMousedown(e) {
    if(this.cutscene && this.cutscene.finished)
      this.exit()
    else
    if(this.cutscene && this.cutscene.finishedPage)
      this.cutscene.nextPage()
  }
  exit() {
    this.hideHint()
    this.cutscene = null
    this.onexit()
  }
  onexit() {
    //custom method used by GameManager to attach some event to the eventual completion of the cutscene
  }
  showHint(type = "full") {
    if(type === "full")
      this.hintFull.classList.remove("hidden")
    if(type === "mouse")
      this.hintMouse.classList.remove("hidden")

    this.hint.classList.remove("hidden")
  }
  hideHint() {
    this.hintFull.classList.add("hidden")
    this.hintMouse.classList.add("hidden")
    this.hint.classList.add("hidden")
  }
  update() {

  }
  animationTick() {
    let now = Date.now()
    cdt = (now - cLastTime ) / 1000
    cLastTime = now

    this.imageSprites.forEach(anim => anim.update())
    
    this.tickId = window.requestAnimationFrame(this.animationTick.bind(this))
  }
  animationTickStop() {
    window.cancelAnimationFrame(this.tickId)
  }
}