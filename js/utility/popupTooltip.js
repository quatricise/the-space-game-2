class PopupTooltip {
  constructor(triggerElement, attachment, hintData = {}, options = {}) {
    this.triggerElement = triggerElement
    this.attachment = attachment
    this.hintData = hintData
    this.visible = false

    this.options = {}
    this.options.setMaxWidthToTriggerElement =  options.setMaxWidthToTriggerElement   ?? false
    this.options.setMaxHeightToTriggerElement = options.setMaxHeightToTriggerElement  ?? false
    this.options.centerTooltipText =            options.centerTooltipText             ?? false
    this.options.attachmentOffset =             options.attachmentOffset              ?? null
    this.options.allowPointerEvents =           options.allowPointerEvents            ?? false
    this.options.useBackground =                options.useBackground                 ?? false

    this.createHTML()
    this.show()
    Logger.log("tooltip popup create!")
  }
  createHTML() {
    this.element =  El("div", "popup-tooltip ui-graphic ui-button-minimal-filled hidden")
    this.arrow =    El("div", "popup-tooltip-arrow" + this.attachment)
    this.title =    El("div", "popup-tooltip-title", undefined)
    this.text =     El("div", "popup-tooltip-text", undefined)

    this.title.innerHTML = createRichText(this.hintData.title)
    this.text.innerHTML = createRichText(this.hintData.text)

    this.parentElement = Q(`#${this.triggerElement.dataset.parentelementid}`) ?? this.triggerElement
    
    if(this.hintData.title)
      this.element.append(this.title)
    if(this.hintData.text)
      this.element.append(this.text)

    if(this.options.setMaxWidthToTriggerElement)
      this.element.style.width = this.parentElement.getBoundingClientRect().width + "px"
    if(this.options.setMaxHeightToTriggerElement)
      this.element.style.height = this.parentElement.getBoundingClientRect().height + "px"
    if(this.options.centerTooltipText)
      this.element.style.textAlign = "center"
    if(this.options.allowPointerEvents)
      this.element.style.pointerEvents = "all"

    if(this.options.useBackground) {
      this.background = El("div", "tooltip-background")
      this.background.animate(
        [{filter: "opacity(0)"}, {filter: "opacity(1)"}],
        {duration: 500}
      )
      document.body.append(this.background)
    }

    document.body.append(this.element)
  }
  show() {
    if(this.visible) return

    this.visible = true
    this.element.classList.remove("hidden")

    this.elementRect =  this.element.getBoundingClientRect()
    this.arrowRect =    this.arrow.getBoundingClientRect()
    this.parentRect =   this.parentElement.getBoundingClientRect()

    let inset = {top: null, bottom: null, left: null, right: null}
    let distance = 8

    if(this.attachment == "right") {
      inset.left = distance + this.parentRect.x + this.parentRect.width
      inset.top =  this.parentRect.y + this.parentRect.height/2 - this.elementRect.height/2
    }
    else
    if(this.attachment == "left") {
      inset.right = distance + (cw - this.parentRect.x)
      inset.top =  this.parentRect.y + this.parentRect.height/2 - this.elementRect.height/2
    }
    else
    if(this.attachment == "top") {
      inset.left = this.parentRect.x + this.parentRect.width/2 - this.elementRect.width/2
      inset.bottom = distance + (window.innerHeight - this.parentRect.y)
    }
    else
    if(this.attachment == "bottom") {
      inset.left = this.parentRect.x + this.parentRect.width/2 - this.elementRect.width/2
      inset.top = distance + this.parentRect.y + this.parentRect.height
    }
    else
    if(this.attachment == "center") {
      inset.left = this.parentRect.width/2 - this.elementRect.width/2
      inset.top = this.parentRect.height/2 - this.elementRect.height/2
    }

    const alignElement = () => {
      for(let prop in inset) {
        if(inset[prop] === null) continue

        let value = inset[prop]
        if(this.options.attachmentOffset)
          value += (this.options.attachmentOffset[prop])
          
        this.element.style[prop] = value + "px"
      }
    }
    alignElement()

    let elementRectBeforeClamp = this.element.getBoundingClientRect()

    if(elementRectBeforeClamp.x < 0 + PopupTooltip.insetBorder)
      inset.left += Math.abs(elementRectBeforeClamp.x - PopupTooltip.insetBorder)

    if(elementRectBeforeClamp.right > window.innerWidth - PopupTooltip.insetBorder)
      inset.right += Math.abs(elementRectBeforeClamp.right - window.innerWidth + PopupTooltip.insetBorder)

    alignElement()
  }
  hide() {
    if(!this.visible) return

    this.visible = false
    this.element.classList.add("hidden")
  }
  placeArrow() {
    if(this.attachment === "right") {
      this.arrow.style.left = "-20px"
    }
    if(this.attachment === "left") {
      this.arrow.style.right = "-20px"
    }
    if(this.attachment === "top") {
      this.arrow.style.bottom = "-20px"
      this.arrow.style.left = this.elementRect.width/2 - this.arrowRect.width/2 + "px"
    }
    if(this.attachment === "bottom") {
      this.arrow.style.top = "-20px"
      this.arrow.style.left = this.elementRect.width/2 - this.arrowRect.width/2 + "px"
    }
  }
  destroy() {
    this.element.remove()
    this.background?.remove()
  }
  static insetBorder = 20
}