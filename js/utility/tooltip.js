class Tooltip {
  constructor(delayDefault) {
    this.timeout = null
    this.delayDefault = delayDefault
    this.createHTML()
  }
  createHTML() {
    this.element =            El("div" , "hidden", [["id", "mouse-tooltip"]])
    this.heading =            El("span", "tooltip-inner-heading")
    this.description =        El("span", "tooltip-inner-text")
    this.cannotSellWarning =  El("div",  "tooltip-item-cannot-sell-warning")
    this.cannotSellText =     El("div",  "tooltip-item-cannot-sell-text")
    this.cannotSellIcon =     El("div",  "cannot-sell-icon ui-graphic")
    this.itemCategory =       El("span", "tooltip-item-item-category")
    this.buyCost =            El("div",  "tooltip-buy-cost")
    this.sellCost =           El("div",  "tooltip-sell-cost")
    
    this.frame =              El("div", "tooltip-frame")
    let frameParts = ["first", "second", "third", "fourth"]
    for(let part of frameParts) {
      this.frame.append(El("div", `tooltip-frame-part ${part}`))
    }

    this.cannotSellWarning.append(this.cannotSellIcon, this.cannotSellText)
    this.element.append(this.frame, this.itemCategory, this.heading, this.description, this.cannotSellWarning, this.buyCost, this.sellCost)
    document.body.append(this.element)
  }
  update() {
    let minInset = 20
    let tooltip = this.element
    let offset = {x: mouse.clientPosition.x + 20, y: mouse.clientPosition.y + 30}
    offset.x =    clamp(offset.x, 0, window.innerWidth - tooltip.offsetWidth - minInset)
    offset.y =    clamp(offset.y, 0, window.innerHeight - tooltip.offsetHeight - minInset)
    tooltip.style.left =  offset.x + "px"
    tooltip.style.top =   offset.y + "px"
  }
  setDataFrom(target) {
    let type = target.dataset.tooltiptype

    /* set data based on the tooltip type attribute */
    switch(type) {
      case "item": {
        let item = data.item[target.dataset.itemname]
        if(!item) throw "bad item reference: " + target.dataset.itemname

        this.heading.innerText =            item.title
        this.description.innerText =        item.description
        this.itemCategory.innerText =       item.category || (item.flags.questItem ? "[Quest item]" : "")
        this.cannotSellText.innerText =     item.flags.canSell ? "" : "Item cannot be sold"
        this.buyCost.innerText =            item.buyCost    ? `COST: ${item.buyCost}` : ""

        this.itemCategory.innerText    ? this.itemCategory.style.display = ""       : this.itemCategory.style.display = "none"
        this.cannotSellText.innerText  ? this.cannotSellWarning.style.display = ""  : this.cannotSellWarning.style.display = "none"
        this.buyCost.innerText         ? this.buyCost.style.display = ""            : this.buyCost.style.display = "none"

        this.heading.style.display =     ""    
        this.description.style.display = ""
        this.sellCost.style.display = "none"
        break
      }
      case "weapon": {
        let item = data.item[target.dataset.itemname]
        if(!item) throw "bad item reference: " + target.dataset.itemname

        this.heading.innerText =            item.title
        this.description.innerText =        item.description
        this.itemCategory.innerText =       "[WEAPON]"
        this.buyCost.innerText =            item.buyCost ? `COST: ${item.buyCost}` : "COST: 0"

        this.heading.style.display =      ""
        this.description.style.display =  ""
        this.buyCost.style.display =      ""
        this.itemCategory.style.display = ""

        this.sellCost.style.display =           "none"
        this.cannotSellWarning.style.display =  "none"
        break
      }
      case "shipSystem": {
        let item = data.item[target.dataset.itemname]
        if(!item) throw "bad item reference: " + target.dataset.itemname

        this.heading.innerText =            item.title
        this.description.innerText =        item.description
        this.itemCategory.innerText =       "[SHIP SYSTEM]"
        this.buyCost.innerText =            item.buyCost ? `COST: ${item.buyCost}` : "COST: 0"

        this.heading.style.display =      ""
        this.description.style.display =  ""
        this.buyCost.style.display =      ""
        this.itemCategory.style.display = ""

        this.sellCost.style.display =           "none"
        this.cannotSellWarning.style.display =  "none"
        break
      }
      default: {
        this.heading.innerText =      target.dataset.tooltip
        this.description.innerText =  target.dataset.tooltipdescription
        
        target.dataset.tooltip              ? this.heading.style.display = ""       : this.heading.style.display = "none"
        target.dataset.tooltipdescription   ? this.description.style.display = ""   : this.description.style.display = "none"

        this.cannotSellWarning.style.display =  "none"
        this.buyCost.style.display =            "none"
        this.sellCost.style.display =           "none"
        this.itemCategory.style.display =       "none"
        break
      }
    }
  }
  static types = [
    "regular",
    "item"
  ]
}