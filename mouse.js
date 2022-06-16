let mouse = {
  world_pos: new Vector(0),
  editor_pos: new Vector(0),
  client_click_origin: new Vector(0),
  click_target: {
    
  },
  map_pos:new Vector(0),
  client_pos: new Vector(0),
  client_pos_prev: new Vector(0),
  client_moved: new Vector(0),
  keys: {
    left: false,
    middle: false,
    right: false,
  },
  update_keys(e, eventType = "up" || "down") {
    if(eventType === "down") {
      if(e.button === 0) this.keys.left = true
      if(e.button === 1) this.keys.middle = true
      if(e.button === 2) this.keys.right = true
    }
    if(eventType === "up") {
      if(e.button === 0) this.keys.left = false
      if(e.button === 1) this.keys.middle = false
      if(e.button === 2) this.keys.right = false
    }
  },
  update_pos(e) {
    this.client_pos_prev.x = this.client_pos.x
    this.client_pos_prev.y = this.client_pos.y

    this.client_pos.x = e.clientX
    this.client_pos.y = e.clientY
    
    this.client_moved.x = this.client_pos.x - this.client_pos_prev.x
    this.client_moved.y = this.client_pos.y - this.client_pos_prev.y
  },
  update_world_pos() {
    this.world_pos.x = Math.round(this.client_pos.x + camera.current_zoom * camera.pos.x - cw/2)
    this.world_pos.y = Math.round(this.client_pos.y + camera.current_zoom * camera.pos.y - ch/2)

    this.editor_pos.x = this.client_pos.x - cw/2
    this.editor_pos.y = this.client_pos.y - ch/2
  },
  update_map_pos(e) {
    let camera = ui.map.camera
    let rect = e.target.getBoundingClientRect();
    //todo this is broken as shit
    this.map_pos.x = Math.round(e.pageX * camera.current_zoom)
    this.map_pos.y = 0
    // this.map_pos.x = Math.round(((e.pageX - rect.left) * camera.current_zoom + (camera.current_zoom * camera.pos.x ) - (map.physical_size/2*camera.current_zoom*camera.current_zoom*map.visual_scale_factor)) / map.visual_scale_factor )
    // this.map_pos.y = Math.round(((e.pageY - rect.top) * camera.current_zoom + (camera.current_zoom * camera.pos.y  ) - (map.physical_size/2*camera.current_zoom*camera.current_zoom*map.visual_scale_factor)) /  map.visual_scale_factor )
  },
  updateCursor() {
    //update css cursor based on conditions like weapons
  }
}