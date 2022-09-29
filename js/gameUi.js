class GameUI extends GameWindow {
  constructor() {
    super("GameUI")
    this.tooltip = new Tooltip(Q("#mouse-tooltip", 250 ))
    this.tooltipShip = new Tooltip(Q('#ship-tooltip'), 250, function(
      shipname
    ) {
      let tooltip = this.element
      let ship = data.ships[shipname]
      let shipIcon = El("div", "tooltip-ship-icon")
      let img = new Image; img.src = ship.sources.folder + "thumbnail.png"
      let title = ship.displayName
      shipIcon.append(img)
      tooltip.append(shipIcon)
    })
  }
  handleKeydown(event) {
    if(event.code === binds.hitbox) visible.hitbox = !visible.hitbox
    if(event.code === binds.gameStats) Q(".game-stats").classList.toggle("hidden")
    if(event.code === binds.devIcons) Qa(".dev-icon").forEach(icon => icon.classList.toggle("hidden"))
  }
  handleKeyup(event) {

  }
  handleMousedown(event) {

  }
  handleMousemove(event) {
    let target = event.target
    if(target.closest(".tooltip")) {
      let delay = +target.closest(".tooltip").dataset.delay
      let element = this.tooltip.element
      let innerText = element.querySelector(".tooltip-inner-text")
      if(innerText) {
        innerText.remove()
      }
      window.clearTimeout( this.tooltip.timeout )
      if(typeof delay === "number") {
        this.tooltip.timeout = setTimeout(()=> { 
          element.classList.remove("hidden")
          this.tooltip.update()
        }, delay)
      }
      else {
        this.tooltip.timeout = setTimeout(()=> { 
          element.classList.remove("hidden")
          this.tooltip.update()
        }, this.tooltip.delayDefault)
      }
      let text = El("span", "tooltip-inner-text")
      text.innerText = event.target.closest(".tooltip").dataset.tooltip
      element.append(text)
      this.tooltip.update()
    }
    else this.tooltip.element.classList.add("hidden")
    //ship
    if(target.closest(".tooltip-ship")) {
      let delay = +target.closest(".tooltip-ship").dataset.delay
      let name = target.closest(".tooltip-ship").dataset.name
      let element = this.tooltipShip.element
      let ship = data.ship[name]
      let systems = ship.systems

      element.innerHTML = ""
      let heading = El("div", "ship-tooltip-heading", undefined, ship.displayName)
      let imgCont = El("div","ship-tooltip-image-container")
      let img = new Image(); img.src = data.ship[name].sources.folder + "thumbnail.png"
      imgCont.append(img)
      element.append(heading, imgCont)

      for(let prop in systems) {
        let row = El("div", "ship-prop")
        let key = El("div", "ship-prop-key")
        let level = El("div", "ship-prop-value")
        row.innerText = prop.cap()
        level.innerText = systems[prop].level || 0
        row.append(key, level)
        element.append(row)
      }
      if(typeof delay === "number") {
        this.tooltipShip.timeout = setTimeout(()=> { 
          element.classList.remove("hidden")
          this.tooltipShip.update()
        }, delay)
      }
      else {
        this.tooltipShip.timeout = setTimeout(()=> { 
          element.classList.remove("hidden")
          this.tooltipShip.update()
        }, this.tooltipShip.delayDefault)
      }
    }
    else {
      window.clearTimeout( this.tooltipShip.timeout)
      this.tooltipShip.element.classList.add("hidden")
    }
  }
  handleMouseup(event) {

  }
  handleClick(event) {

  }
  handleWheel(event) {

  }
  update() {
    Q('#ship-hull').innerHTML = ""
    for (let index = 0; index < player.ship.hull.curr; index++) {
      Q('#ship-hull').append(El("div", "ship-hull-point"))
    }
    Q('#zoom-level').innerText = game.camera.currentZoom
    Q("#game-state-view").innerText = game.state.current.cap()
    Q("#stage-offset").innerText = "x: " + game.app.stage.position.x.toFixed(0) + " y: " + game.app.stage.position.y.toFixed(0) 
    Q("#fps").innerText = fps.toFixed(0)
  }
}
