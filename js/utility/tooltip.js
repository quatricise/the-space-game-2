class Tooltip {
  constructor(element, delayDefault, contentUpdate = function(){}) {
    this.timeout = null
    this.element = element
    this.delayDefault = delayDefault
    this.contentUpdate = contentUpdate
  }
  update() {
    let tooltip = this.element
    let offset = {x: mouse.clientPosition.x + 20, y: mouse.clientPosition.y + 30}
    offset.x = clamp(offset.x, 0, window.innerWidth - tooltip.offsetWidth - 10)
    offset.y = clamp(offset.y, 0, window.innerHeight - tooltip.offsetHeight - 10)
    tooltip.style.left = offset.x + "px"
    tooltip.style.top = offset.y + "px"
  }
}