class Interaction {
  constructor(type) {
    this.type = Interaction.types.findChild(type) ?? console.error("invalid interaction type")
    this.elements = {}
    this.createHTML()
  }
  createHTML() {
    /* these bubbles will be filled by the type-specific methods */
    this.bubbles = {
      small: null,
      big: null,
    }
    this.container = El("div", "interaction-bubble-wrapper")
    this[`create${this.type.capitalize()}HTML`]()
  }
  createHintHTML() {
    /* small bubble */    
    this.bubbles.small = El("div", "interaction-bubble-small")
    let icon = El("div", "interaction-bubble-icon icon-hint")

    /* big bubble */

  }
  createAudioCallHTML() {
    /* small bubble */    
    this.bubbles.small = El("div", "interaction-bubble-small")
    let icon = El("div", "interaction-bubble-icon icon-hint")
    
    /* big bubble */

  }
  createMessageHTML() {
    /* small bubble */      
    this.bubbles.small = El("div", "interaction-bubble-small")
    let icon = El("div", "interaction-bubble-icon icon-hint")

    /* big bubble */

  }
  dismiss() {
    this.onDismiss()
    this.destroy()
  }
  onDismiss() {
    //custom handler method
  }
  maximize() {
    
  }
  minimize() {

  }
  destroy() {
    for(let key in this.elements)
      this.elements[key].remove()
  }
  static types = [
    "hint",
    "audioCall",
    "message",
  ]
}