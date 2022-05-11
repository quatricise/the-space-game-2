const binds = {
  rotateCW: "KeyD",
  rotateCCW: "KeyA",
  accel: "KeyW",
  decel: "KeyS",
  map_open: "KeyM",
  zoom_in: "Digit1",
  zoom_out: "Digit2",
  toggle_dialogue_editor: "Digit3",
  cancel: "Escape",
  confirm: "Enter",
  shift: "ShiftLeft",
  shift_right: "ShiftRight",
  ctrl: "ControlLeft",
  ctrl_right: "ControlRight",
}
const keys = {}
{
  let bind_keys = Object.keys(binds)
  for (let i = 0; i < bind_keys.length; i++) {
    Object.defineProperty(
      keys, 
      bind_keys[i], 
      {value: false, writable: true}
    )
  }
}

document.addEventListener("contextmenu", function(e) {
  e.preventDefault()
})

document.addEventListener("keydown", function (e) {
  updateKeys(e, "keydown")

  if(state.current === "editing_text_field") {
    if(keys.shift || keys.shift_right) return
    if(e.code === binds.cancel) {
      if(state.current === "editing_text_field") {
        ui.dialogue_editor.cancelEdit()
      }
    }
    if(e.code === binds.confirm) {
      if(state.current === "editing_text_field") {
        ui.dialogue_editor.confirmEdit()
      }
    }
    return
  }

  //localize this inside some UI class, which will have overview on which windows are and can be opened
  //+ will have many more features and will probably take care of overlays like ship hull health

  if(e.code === binds.map_open) {
    ui.map.toggleVisibility()
    ui.map.open = !ui.map.open
    if(ui.map.open) {
      state.switchState("map_open")
    }
    else state.switchState("passive")
  }


  if(e.code === binds.zoom_in) camera.zoomInit("in")
  if(e.code === binds.zoom_out) camera.zoomInit("out")

  if(e.code === binds.toggle_dialogue_editor) {
    ui.dialogue_editor.toggle_visibility()
  }
})
document.addEventListener("keyup", function (e) {
  updateKeys(e, "keyup")
})

function updateKeys(event, eventType = "keydown" || "keyup") {
  let bind_property_names = Object.keys(binds)

  for (let i = 0; i < bind_property_names.length; i++) {
    if(event.code === binds[bind_property_names[i]] && eventType === "keyup") {
      keys[bind_property_names[i]] = false
    }
    if(event.code === binds[bind_property_names[i]] && eventType === "keydown") {
      keys[bind_property_names[i]] = true
    }
  }
}

let mouse = {
  world_pos: {
    x: 0,
    y: 0,
  },
  client_click_origin: {
    x: 0,
    y: 0
  },
  click_target: {},
  map_pos: {
    x: 0,
    y: 0,
  },
  client_pos: {
    x: 0,
    y: 0,
  },
  client_pos_prev: {
    x: 0,
    y: 0,
  },
  client_moved: {
    x: 0,
    y: 0,
  },
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

document.addEventListener("wheel", function (e) {
  if(state.current === "map_open") {
    if(e.deltaY > 0) {
      ui.map.zoom("in")
    }
    else
    if(e.deltaY < 0) {
      ui.map.zoom("out")
    }
  }
  if(state.current === "passive" || state.current === "battle") {
    if(e.deltaY > 0) {
        camera.zoomInit("in")
      }
    else
    if(e.deltaY < 0) {
      camera.zoomInit("out")
    }

    //change engine level - allowing for smooth velocity control
  }
})



document.addEventListener("mousedown", function (e) {
  
  mouse.client_click_origin.x = e.clientX
  mouse.client_click_origin.y = e.clientY
  mouse.click_target = e.target
  mouse.update_keys(e, "down")

  if(state.current === "battle") player.ship.fire()
  if(e.target === map.canvas.view) console.log(mouse.map_pos)
  let rect = e.target.getBoundingClientRect();
  let pos = {
    x: e.pageX - rect.left,
    y: e.pageY - rect.top
  }
  if(e.target === map.canvas.view) console.log("map canvas HTML elem. position - x: " + pos.x + " y: " + pos.y)

})



document.addEventListener("click", function (e) {

  if(
    e.target === ui.dialogue_editor.element && 
    e.button === 0 && 
    state.current !== "dragging_node_connection_point" &&
    Math.abs(mouse.client_click_origin.x - mouse.client_pos.x) < 6 &&
    Math.abs(mouse.client_click_origin.y - mouse.client_pos.y) < 6
  ) {
    new DialogueNode(undefined, e.clientX, e.clientY)
  }
  if(e.target.dataset.editable === "true") {
    ui.dialogue_editor.editObject(e.target)
  }
})



document.addEventListener("mousemove", function (e) {

  mouse.update_pos(e)
  if(e.target === map.canvas.view) mouse.update_map_pos(e)

  if(state.current === "dragging_node") {
    ui.dialogue_editor.active_object.drag(e)
  }
  if(state.current === "dragging_node_connection_point") {
    ui.dialogue_editor.active_object.drag(e)
  }
  if(mouse.keys.left && mouse.click_target === ui.dialogue_editor.element) {
    ui.dialogue_editor.update_selection()
  }
  if(state.current === "resizing_node") {
    ui.dialogue_editor.active_object.resize(e)
  }

  node_connections.forEach(conn=> conn.updateVisual())
})



document.addEventListener("mouseup", function (e) {
  if(e.target === ui.dialogue_editor.element && e.button === 0 && state.current === "dragging_node_connection_point") {
    new DialogueNode(undefined, e.clientX, e.clientY, undefined, ui.dialogue_editor.active_object )
    state.revertState()
  }
  if(state.current === "resizing_node") {
    ui.dialogue_editor.active_object.resizeEnd()
  }
  if(
    (e.target !== ui.dialogue_editor.element || !e.target.classList.contains("dialogue-node-socket")) && 
    state.current === "dragging_node_connection_point"
  ) {
    ui.dialogue_editor.active_object.connections.forEach(conn => conn.remove())
    ui.dialogue_editor.returnActiveObject().visual.remove()

    state.revertState()
  }
  mouse.update_keys(e, "up")
})