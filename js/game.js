class Game extends GameWorldWindow {
  constructor(title, element) {
    super(title, element)
    this.app.view.style.pointerEvents = "none"
    this.gridSprite = new PIXI.TilingSprite(grid.texture, cw + grid.cellSize*2, ch + grid.cellSize*2)
    this.state = new State(
      "explore",
      "battle",
      "dialogue",
      "mapOpen",
      "loading",
    )
    this.createVignette()
    this.location = null
    this.locations = []
  }
  //#region input
  handleKeydown(event) {
    if(event.code === binds.pause) {
      if(this.app.ticker.started) this.app.ticker.stop()
      else this.app.ticker.start()
    }
    if(event.code === binds.zoomIn) this.camera.zoomInit("in")
    if(event.code === binds.zoomOut) this.camera.zoomInit("out")
    if(event.code === binds.mapOpen) {
      throw "this is too complicated, needs to be an internal function of Map"
      // program.windows.set(map)
      // map.open = !map.open
      // if(map.open) this.state.set("mapOpen")
      // else         this.state.revert()
    }
    if(event.code === binds.dash) player.ship.dashInit()
    if(event.code === binds.toggleAutobrake) player.ship.brakesToggleAuto()
  }
  handleKeyup(event) {
    
  }
  handleMousedown(event) {
    if(event.button === 0) {
      if(event.target === this.element) {
        if(keys.shift || keys.shiftRight) {
          player.ship.skipBegin(mouse.worldPosition)
        }
        else
        if(keys.ctrl || keys.ctrlRight) {
          player.ship.pulseShieldActivate()
        }
        else {
          player.ship.timers.laserCharge.restart()
          player.ship.fire(mouse.worldPosition)
        }
      }
    }
  }
  handleMousemove(event) {
    
  }
  handleMouseup(event) {
    if(event.button === 0) {
      player.ship.timers.laserCharge.reset()
    }
  }
  handleClick(event) {
    
  }
  handleWheel(event) {
    if(this.state.is("explore", "battle")) {
      if(event.deltaY < 0) {
          this.camera.zoomInit("in")
        }
      else
      if(event.deltaY > 0) {
        this.camera.zoomInit("out")
      }
    }
  }
  //#endregion
  updateSecondaryVisuals() {
    this.layers.background.position.set(camera.transform.position.x * 0.5, camera.transform.position.y * 0.5)
    this.layers.background2.position.set(camera.transform.position.x * 0.8, camera.transform.position.y * 0.8)
    this.layers.vignette.position.set(camera.transform.position.x, camera.transform.position.y)
    this.layers.vignette.scale.set(camera.currentZoom)
    this.layers.vignette2.position.set(camera.transform.position.x, camera.transform.position.y)
    this.layers.vignette2.scale.set(camera.currentZoom)
    this.layers.planet.position.set(camera.transform.position.x * 0.98, camera.transform.position.y * 0.98 + ch/5)
    this.layers.planet.scale.set(camera.currentZoom)
  }
  update() {
    let camera = this.camera
    if(keys.brake) 
      player.ship.toggleBrakeIndicator(true)
    else 
      player.ship.toggleBrakeIndicator(false)
    this.updateSecondaryVisuals()
  }
}