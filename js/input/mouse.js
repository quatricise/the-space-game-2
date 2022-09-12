class Mouse {
  constructor() {
    this.world_position           = new Vector(0)
    this.editor_position          = new Vector(0)
    this.location_editor_position = new Vector(0)
    this.client_click_origin      = new Vector(0)
    this.client_click_end         = new Vector(0)
    this.map_position             = new Vector(0)
    this.client_position          = new Vector(0)
    this.client_position_prev     = new Vector(0)
    this.client_moved             = new Vector(0)
    this.click_target = null
    this.travelled = 0
    this.pressure = 1
    this.ship_angle = 0
    this.keys = {
      left: false,
      middle: false,
      right: false,
    }
  }
  //#region 
  handle_input(event) {
    this.update_keys(event)
    switch(event.type) {
      case "pointerdown"  : {this.handle_pointerdown(event); break;}
      case "mousedown"    : {this.handle_mousedown(event); break;}
      case "mousemove"    : {this.handle_mousemove(event); break;}
      case "pointermove"  : {this.handle_pointermove(event); break;}
      case "mouseup"      : {this.handle_mouseup(event); break;}
      case "click"        : {this.handle_click(event); break;}
      case "wheel"        : {this.handle_wheel(event); break;}
    }
  }
  update_keys(event) {
    if(event.type === "mousedown") {
      if(event.button === 0) this.keys.left = true
      if(event.button === 1) this.keys.middle = true
      if(event.button === 2) this.keys.right = true
    }
    if(event.type === "mouseup") {
      if(event.button === 0) this.keys.left = false
      if(event.button === 1) this.keys.middle = false
      if(event.button === 2) this.keys.right = false
    }
  }
  handle_pointerdown(event) {
    this.update_pressure(event)
  }
  handle_mousedown(event) {
    this.update_pressure(event)
    this.client_click_origin.set(event.clientX, event.clientY)
    this.click_target = event.target
  }
  handle_mousemove(event) {
    this.update_client_position(event)
    this.update_travelled_distance(event)
    this.update_world_position()
  }
  handle_pointermove(event) {
    this.update_pressure(event)
  }
  handle_mouseup(event) {
    this.client_click_end.set(event.clientX, event.clientY)
  }
  handle_click(event) {

  }
  handle_wheel(event) {

  }
  //#endregion
  update_ship_angle() {
    this.ship_angle = Math.atan2(this.world_position.y - player.ship.transform.position.y, this.world_position.x - player.ship.transform.position.x)
  }
  update_client_position(e) {
    this.client_position_prev.x = this.client_position.x
    this.client_position_prev.y = this.client_position.y

    this.client_position.x = e.clientX
    this.client_position.y = e.clientY
    
    this.client_moved.x = this.client_position.x - this.client_position_prev.x
    this.client_moved.y = this.client_position.y - this.client_position_prev.y
  }
  update_travelled_distance(e) {
    if(this.keys.left) {
      this.travelled += this.client_moved.length()
    }
    else this.travelled = 0
  }
  update_pressure(e) {
    if(e.pointerType !== "pen") return
    this.pressure = e.pressure
  }
  update_world_position() {
    this.update_world_position_for(location_editor, this.location_editor_position)
    this.update_world_position_for(hitbox_editor, this.editor_position)
    this.update_world_position_for(map, this.map_position)
    this.update_world_position_for(game, this.world_position)
  }
  update_world_position_for(world, position) {
    position.x = Math.round((this.client_position.x - cw/2 + (world.camera.transform.position.x / world.camera.current_zoom)) * world.camera.current_zoom)
    position.y = Math.round((this.client_position.y - ch/2 + (world.camera.transform.position.y / world.camera.current_zoom)) * world.camera.current_zoom)
  }
  update_map_position(e) {
    throw "Shouldn't be used"
    let camera = map.camera
    this.map_position.x = Math.round((this.client_position.x - cw/2 + (camera.transform.position.x / camera.current_zoom)) * camera.current_zoom)
    this.map_position.y = Math.round((this.client_position.y - ch/2 + (camera.transform.position.y / camera.current_zoom)) * camera.current_zoom)
  }
}

const mouse = new Mouse()