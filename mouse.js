const mouse = {
  world_pos: new Vector(0),
  editor_pos: new Vector(0),
  location_editor_pos: new Vector(0),
  client_click_origin: new Vector(0),
  client_click_end: new Vector(0),
  click_target: {},
  map_pos: new Vector(0),
  client_pos: new Vector(0),
  client_pos_prev: new Vector(0),
  client_moved: new Vector(0),
  ship_angle: 0,
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
  update_ship_angle() {
    this.ship_angle = Math.atan2(this.world_pos.y - player.ship.pos.y, this.world_pos.x - player.ship.pos.x)
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
    this.world_pos.x = Math.round((this.client_pos.x - cw/2 + (camera.pos.x / camera.current_zoom)) * camera.current_zoom)
    this.world_pos.y = Math.round((this.client_pos.y - ch/2 + (camera.pos.y / camera.current_zoom)) * camera.current_zoom)

    this.editor_pos.x = this.client_pos.x - cw/2
    this.editor_pos.y = this.client_pos.y - ch/2

    this.location_editor_pos.x = -location_editor.scene.position.x + this.client_pos.x
    this.location_editor_pos.y = -location_editor.scene.position.y + this.client_pos.y
  },
  update_map_pos(e) {
    let camera = map.camera
    this.map_pos.x = Math.round((this.client_pos.x - cw/2 + (camera.pos.x / camera.current_zoom)) * camera.current_zoom)
    this.map_pos.y = Math.round((this.client_pos.y - ch/2 + (camera.pos.y / camera.current_zoom)) * camera.current_zoom)
  },
  update_cursor() {
    //update css cursor based on conditions like weapons
  }
}