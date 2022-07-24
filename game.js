class Game {
  constructor() {
    this.element = Q('#game')
    this.graphics = new PIXI.Graphics()
    this.app = app
    this.grid_sprite = new PIXI.TilingSprite(grid.texture, cw + grid.cell_size*2, ch + grid.cell_size*2)
    // layer_debris.addChild(this.grid_sprite)
    layer_graphics.addChild(this.graphics)
    this.state = new State(
      "explore",
      "battle",
      "dialogue",
      "map_open",
      "loading",
    )
    this.loc = null
    this.add_origin()
  }
  load_location(location_id) {
    this.state.set("loading")
    this.loc = new Loc(location_id)
    this.loc.load(location_id)
    this.state.set("explore")
  }
  add_origin() {
    this.origin = PIXI.Sprite.from("assets/origin.png")
    this.origin.anchor.x = 0.5
    this.origin.anchor.y = 0.5
    this.app.stage.addChild(this.origin)
  }
  show() {
    this.element.classList.remove('hidden')
  }
  hide() {
    this.element.classList.add('hidden')
  }
  toggle() {
    this.element.classList.toggle('hidden')
  }
  handle_input(event) {
    if(ui.windows.active !== this) return
    if(this.state.is("loading")) return
    switch(event.type) {
      case "keydown"    : { this.handle_keydown(event); break;}
      case "keyup"      : { this.handle_keyup(event); break;}
      case "mousedown"  : { this.handle_mousedown(event); break;}
      case "mousemove"  : { this.handle_mousemove(event); break;}
      case "mouseup"    : { this.handle_mouseup(event); break;}
      case "click"      : { this.handle_click(event); break;}
      case "wheel"      : { this.handle_wheel(event); break;}
    }
  }
  handle_keydown(event) {
    if(event.code === binds.pause) {
      if(this.app.ticker.started) this.app.ticker.stop()
      else this.app.ticker.start()
    }
    if(event.code === binds.zoom_in) this.camera.zoomInit("in")
    if(event.code === binds.zoom_out) this.camera.zoomInit("out")
    if(event.code === binds.map_open) {
      ui.windows.set(map)
      map.open = !map.open
      if(map.open) this.state.set("map_open")
      else         this.state.set("passive")
    }
    if(event.code === binds.dash) player.ship.dash_init()
    if(event.code === binds.toggle_autobrake) player.ship.brakes_toggle_auto()
  }
  handle_keyup(event) {
    
  }
  handle_mousedown(event) {
    if(event.button === 0) {
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
    if(this.state.is("passive", "battle")) {
      if(event.deltaY > 0) {
          this.camera.zoomInit("in")
        }
      else
      if(event.deltaY < 0) {
        this.camera.zoomInit("out")
      }
    }
  }
  update() {
    let camera = this.camera
    this.grid_sprite.position.x = Math.floor(camera.pos.x / grid.cell_size) * grid.cell_size - grid.cell_size*2
    this.grid_sprite.position.y = Math.floor(camera.pos.y / grid.cell_size) * grid.cell_size - grid.cell_size
    // this.origin.position.set(mouse.world_pos.x, mouse.world_pos.y)
  }
}