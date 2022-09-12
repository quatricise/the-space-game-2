class Tooltip {
  constructor(element, delay_default, content_update = function(){}) {
    this.timeout = null
    this.element = element
    this.delay_default = delay_default
    this.content_update = content_update
  }
  update() {
    let tooltip = this.element
    let offset = {x: mouse.client_position.x + 20, y: mouse.client_position.y + 30}
    offset.x = clamp(offset.x, 0, window.innerWidth - tooltip.offsetWidth - 10)
    offset.y = clamp(offset.y, 0, window.innerHeight - tooltip.offsetHeight - 10)
    tooltip.style.left = offset.x + "px"
    tooltip.style.top = offset.y + "px"
  }
}