class Cutscene {
  constructor(name) {
    this.pagesLeft = []
    let firstPageOffset = 0
    let keys = Object.keys(Cutscene.scenes[name].pages)
    for(let i = firstPageOffset; i < keys.length; i++) {
      this.pagesLeft.push(Cutscene.scenes[name].pages[keys[i]])
    }
    this.currentPageIndex = -1 + firstPageOffset
    this.cutsceneName = name
    this.currentPage = null
    this.currentPanel = null
    this.currentElement = null
    this.finished = false
    this.finishedPage = false

    /* store the timeout that displays the cutscene window hint in this */
    this.hintTimeout = null

    /* this is used to fast forward the start of an animation of the next element when set to a non-null value */
    this.nextHold = null
  }
  begin() {
    this.nextPage()
    return this
  }
  finishPage() {
    this.finishedPage = true
    let hintType = this.currentPageIndex === 0 ? "full" : "mouse"
    if(this.pagesLeft.length == 0)
      this.finished = true
    this.hintTimeout = setTimeout(() => cutsceneWindow.showHint(hintType), 1500)
  }
  replayPage() {
    
  }
  nextPage() {
    this.finishedPage = false
    cutsceneWindow.hideHint()
    window.clearTimeout(this.hintTimeout)
    this.currentPage = this.pagesLeft.shift()
    this.fadeScene()
    this.currentPageIndex++
  }
  nextPanel() {
    this.currentPanel = this.currentPage.panels.shift()
    if(!this.currentPanel) {
      this.finishPage()
      return
    }
    setTimeout(()=> {
      this.nextElement()
    }, Cutscene.defaultHold)

    /* reset the nextHold so that elements of the next panel animate normally */
    this.nextHold = null
  }
  nextElement() {
    this.currentElement = this.currentPanel.elements.shift()
    if(!this.currentElement) 
      return this.nextPanel()

    let 
    image = new Image()
    image.src = Cutscene.folder + this.cutsceneName + "/page" + this.currentPageIndex + "/" + this.currentElement.src + Cutscene.fileExtension
    image.classList.add("cutscene-element")
    image.style.zIndex = this.currentElement.z ?? 0
    
    this.animateElement(image)
    cutsceneWindow.element.append(image)

    let hold
    if(this.currentElement.hold === "auto") 
      hold = this.currentElement.animation?.duration 
    else 
      hold = this.currentElement.hold ?? Cutscene.defaultHold
    
    setTimeout(() => {
      this.nextElement()
    }, this.nextHold ?? hold * Cutscene.timeStretch)
  }
  nextTextElement() {
    let text = El("div", "cutscene-text-element")
    text.style.left = this.currentElement.position.x + "px"
    text.style.top =  this.currentElement.position.y + "px"
  }
  animateElement(imageElement) {
    let animData = {}
    animData.duration   = (this.currentElement.animation?.duration   ?? Cutscene.defaultAnimation.duration) * Cutscene.timeStretch
    animData.easing     = (this.currentElement.animation?.easing     ?? Cutscene.defaultAnimation.easing)
    animData.translate  = (this.currentElement.animation?.translate  ?? Cutscene.defaultAnimation.translate)

    imageElement.animate([
      {
        transform: `translateX(${animData.translate.x}px) translateY(${animData.translate.y}px)`,
        filter: "opacity(0)",
      },{
        transform: `translateX(0px) translateY(0px)`,
        filter: "opacity(1)",
      },
    ], {
      duration: animData.duration,
      easing: animData.easing,
    })
  }
  fadeScene() {
    cutsceneWindow.element.animate([
      {filter: "opacity(1)", filter: "opacity(0)"}
    ], {duration: Cutscene.pageFadeTime})
    .onfinish = () => {
      this.clearElements()
      this.nextPanel()
      cutsceneWindow.element.style.filter = ""
    }
  }
  clearElements() {
    Qa(".cutscene-element").forEach(element => element.remove())
  }

  static folder = "assets/cutscene/"
  static fileExtension = ".png"
  static defaultHold = 200 //default amount of time that an element sits before the next one starts animating
  static pageFadeTime = 1200
  static timeStretch = 1
  static defaultAnimation = {
    duration: 900, 
    easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
    translate: {x: -25, y: 0},
  }
  static async preloadScenes() {
    let sources = []
    for(let scene in this.scenes) {
      for(let page in this.scenes[scene].pages) {
        for(let panel of this.scenes[scene].pages[page].panels) {
          for(let element of panel.elements) {
            sources.push(`assets/cutscene/${scene}/${page}/${element.src}.png`)
          }
        }
      }
    }
    /* map all sources to promises and wait until an image is loaded */
    await Promise.all(sources.map(source => 
      new Promise(async resolve => {
        let img = new Image()
        img.src = source
        img.onload = resolve(img)
      })
    )).then(data => console.log("Cutscenes loaded."))
  }
}