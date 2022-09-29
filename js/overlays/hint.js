class Hint extends GameObject {
  constructor(
    transform,
    text, 
    fadeoutTime = 1000, 
  ) {
    super(transform)
    this.text = text
    this.fadeoutTimeMax = fadeoutTime
    this.fadeoutTime = fadeoutTime
    this.dismissed = false
    this.createHtml()
  }
  createHtml() {
    this.element = El('div', "hint", undefined, this.text)
    this.element.style.filter = "opacity(0)"
    Q('#hints-container').append(this.element)
    this.updateHtml()
  }
  updateHtml() {
    let bb = this.element.getBoundingClientRect()
    console.log(this.transform)
    this.element.style.left = Math.floor( this.transform.position.x -bb.width/2 ) + "px"
    this.element.style.top =  Math.floor( this.transform.position.y -bb.height/2 ) + "px"
    this.element.style.filter = `opacity(${Math.max(0, this.fadeoutTime/this.fadeoutTimeMax)})`
  }
  dismiss() {
    this.dismissed = true
  }
  updateLife() {
    if(this.dismissed) this.fadeoutTime -= 1000 * dt
    if(this.fadeoutTime <= 0) this.destroyed = true
  }
  destroy() {
    this.element.remove()
  }
}

class StaticHint extends Hint {
  constructor(transform, text, fadeoutTime, screenSpacePosition) {
    //screenSpacePosition is some kinda CSS shorthand like left: 0, top: 0 or justify-center, justify-left
    super(transform, text, fadeoutTime)
  }
  update() {
    this.updateLife()
    this.updateHtml()
  }
}

class DynamicHint extends Hint {
  constructor(transform, text, fadeoutTime, parent) {
    super(transform, text, fadeoutTime)
    this.parent = parent
    this.fadeoutTimeMax = fadeoutTime
    this.fadeoutTime = fadeoutTime
  }
  update() {
    this.updateLife()
    this.updateHtml()
    this.setPositionFromParent()
  }
  setPositionFromParent() {
    this.transform.position = worldToClientPos(this.gameWorld, this.parent.transform.position)
  }
}