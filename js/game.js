class Game extends GameWorldWindow {
  constructor(title, element) {
    super(title, element)
    this.app.view.style.pointerEvents = "none"
    this.grid_sprite = new PIXI.TilingSprite(grid.texture, cw + grid.cell_size*2, ch + grid.cell_size*2)
    this.state = new State(
      "explore",
      "battle",
      "dialogue",
      "map_open",
      "loading",
    )
    this.create_vignette()
    this.location = null
    this.locations = []
  }
  //#region input
  handle_keydown(event) {
    if(event.code === binds.pause) {
      if(this.app.ticker.started) this.app.ticker.stop()
      else this.app.ticker.start()
    }
    if(event.code === binds.zoom_in) this.camera.zoomInit("in")
    if(event.code === binds.zoom_out) this.camera.zoomInit("out")
    if(event.code === binds.map_open) {
      throw "this is too complicated, needs to be an internal function of Map"
      // program.windows.set(map)
      // map.open = !map.open
      // if(map.open) this.state.set("map_open")
      // else         this.state.revert()
    }
    if(event.code === binds.dash) player.ship.dash_init()
    if(event.code === binds.toggle_autobrake) player.ship.brakes_toggle_auto()
  }
  handle_keyup(event) {
    
  }
  handle_mousedown(event) {
    if(event.button === 0) {
      if(event.target === this.element) {
        if(keys.shift || keys.shift_right) {
          player.ship.skip_begin(mouse.world_pos)
        }
        else
        if(keys.ctrl || keys.ctrl_right) {
          player.ship.pulse_shield_activate()
        }
        else {
          player.ship.timers.laser_charge.restart()
          player.ship.fire(mouse.world_pos)
        }
      }
    }
  }
  handle_mousemove(event) {
    
  }
  handle_mouseup(event) {
    if(event.button === 0) {
      player.ship.timers.laser_charge.reset()
    }
  }
  handle_click(event) {
    
  }
  handle_wheel(event) {
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
  update_secondary_visuals() {
    this.layers.background.position.set(camera.transform.position.x * 0.5, camera.transform.position.y * 0.5)
    this.layers.background2.position.set(camera.transform.position.x * 0.8, camera.transform.position.y * 0.8)
    this.layers.vignette.position.set(camera.transform.position.x, camera.transform.position.y)
    this.layers.vignette.scale.set(camera.current_zoom)
    this.layers.vignette2.position.set(camera.transform.position.x, camera.transform.position.y)
    this.layers.vignette2.scale.set(camera.current_zoom)
    this.layers.planet.position.set(camera.transform.position.x * 0.98, camera.transform.position.y * 0.98 + ch/5)
    this.layers.planet.scale.set(camera.current_zoom)
  }
  update() {
    let camera = this.camera
    if(keys.brake) 
      player.ship.toggle_brake_indicator(true)
    else 
      player.ship.toggle_brake_indicator(false)
    this.update_secondary_visuals()
  }
}