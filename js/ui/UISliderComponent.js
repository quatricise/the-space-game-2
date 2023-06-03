class UISliderComponent extends UIComponent {
  constructor(gameWindow, appendTo, hookedObject, propertyOnObject, sliderData = {range: [0, 100], steps: 100, onchange: null}) {
    super(gameWindow)
    this.gameWindow = gameWindow
    this.range = sliderData.range ?? [0, 100]
    this.steps = sliderData.steps ?? 100
    this.onchange = sliderData.onchange ?? function() { AudioManager.playSFX("buttonHover") }
    this.value = 0
    this.previousValue = 0
    this.hookedObject = hookedObject
    this.propertyOnObject = propertyOnObject
    this.active = false
    this.createHTML(appendTo)
  }
  createHTML(appendTo) {
    this.elementId = uniqueIDString()
    this.slider = El("div", "ui-slider-component", [["id", this.elementId]])
    this.sliderHandle = El("div", "ui-slider-handle")
    this.sliderTrack = El("div", "ui-slider-track")
    this.sliderTrackBackground = El("div", "ui-slider-track-background")
    for(let i = 0; i < this.steps; i++) {
      let backgroundCell = El("div", "ui-slider-background-cell inactive")
      this.sliderTrackBackground.append(backgroundCell)
    }

    this.slider.append(this.sliderHandle, this.sliderTrack, this.sliderTrackBackground)
    this.element = this.slider
    appendTo.append(this.element)
  }
  //#region input
  handleMousedown(event) {
    if(event.target.closest("#" + this.elementId)) {
      this.active = true
      this.updateValue(event)
      this.updateHookedObject()
    }
  }
  handleMousemove(event) {
    if(!this.active) return
    this.updateValue(event)
    this.updateHookedObject()
  }
  handleMouseup(event) {
    this.active = false
  }
  //#endregion
  getMouseOffset(event) {
    let boundingRect = this.element.getBoundingClientRect()
    let mouseRelativePosition = new Vector(event.clientX - boundingRect.left, event.clientY - boundingRect.top)
    let elementWidth = boundingRect.width
    let mouseOffset = (mouseRelativePosition.x / elementWidth)
    return mouseOffset
  }
  updateValue(event) {
    let offset = this.getMouseOffset(event)
    let stepSize = (this.range[1] - this.range[0]) / (this.steps)
    let valueBeforeRounding = ((this.range[1] - this.range[0]) * offset) + this.range[0]
        valueBeforeRounding = clamp(valueBeforeRounding, this.range[0], this.range[1])
    // this.value = Math.round(valueBeforeRounding)
    this.value = Math.round(valueBeforeRounding / stepSize) * stepSize

    if(this.value !== this.previousValue)
      this.onchange()

    this.updateVisual(offset)
    this.previousValue = this.value  
  }
  updateVisual(offset) {
    let sliderHandleWidth = this.sliderHandle.getBoundingClientRect().width
    this.sliderHandle.style.left = `calc(${clamp(offset * 100, 0, 100)}% - ${sliderHandleWidth/2}px)`

    //update background cells
    Array.from(this.element.querySelectorAll(".ui-slider-background-cell"))
    .forEach(element => element.classList.replace("active", "inactive"))
    
    for(let i = 0; i < this.steps * offset; i++) {
      this.element.querySelector(".ui-slider-background-cell.inactive")?.classList.replace("inactive", "active")
    }

    this.sliderTrack.style.width = clamp(offset * 100, 0, 100) + "%"
  }
  updateHookedObject() {
    this.hookedObject[this.propertyOnObject] = this.value
  }
  update() {

  }
  destroy() {

  }
}