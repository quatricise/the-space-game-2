const binds = {
  rotateCW: "KeyD",
  rotateCCW: "KeyA",
  accel: "KeyW",
  decel: "KeyS",
  brake: "KeyV",
  toggle_autobrake: "KeyB",
  dash: "Space",
  map_open: "KeyM",
  zoom_in: "Digit1",
  zoom_out: "Digit2",
  hitbox: "Digit3",
  cancel: "Escape",
  confirm: "Enter",
  shift: "ShiftLeft",
  shift_right: "ShiftRight",
  ctrl: "ControlLeft",
  ctrl_right: "ControlRight",
  pause: "KeyP",
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

function attach_listeners() {
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault()
  })
  
  document.addEventListener("keydown", function (e) {
    updateKeys(e, "keydown")
  
    ui.handle_input(e)
    hitbox_editor.handle_input(e)
    dialogue_editor.handle_input(e)
    location_editor.handle_input(e)
    object_editor.handle_input(e)
    game.handle_input(e)
    map.handle_input(e)
  
    //localize this inside some UI class, which will have overview on which windows are and can be opened
    //+ will have many more features and will probably take care of overlays like ship hull health
  
  })
  document.addEventListener("keyup", function (e) {
    updateKeys(e, "keyup")
  
    ui.handle_input(e)
    hitbox_editor.handle_input(e)
    dialogue_editor.handle_input(e)
    location_editor.handle_input(e)
    object_editor.handle_input(e)
    game.handle_input(e)
    map.handle_input(e)
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
  
  document.addEventListener("wheel", function (e) {
    ui.handle_input(e)
    hitbox_editor.handle_input(e)
    dialogue_editor.handle_input(e)
    location_editor.handle_input(e)
    object_editor.handle_input(e)
    game.handle_input(e)
    map.handle_input(e)
  })
  
  
  
  document.addEventListener("mousedown", function (e) {
    if(e.button === 1) {
      e.preventDefault()
    }
    mouse.update_keys(e, "down")
    mouse.client_click_origin.set(e.clientX, e.clientY)
    mouse.click_target = e.target
  
    ui.handle_input(e)
    hitbox_editor.handle_input(e)
    dialogue_editor.handle_input(e)
    location_editor.handle_input(e)
    object_editor.handle_input(e)
    game.handle_input(e)
    map.handle_input(e)
  })
  
  
  
  document.addEventListener("click", function (e) {
    ui.handle_input(e)
    hitbox_editor.handle_input(e)
    dialogue_editor.handle_input(e)
    location_editor.handle_input(e)
    object_editor.handle_input(e)
    game.handle_input(e)
    map.handle_input(e)
  })
  
  
  
  document.addEventListener("mousemove", function (e) {
    mouse.update_pos(e)
    mouse.update_map_pos(e)
  
    ui.handle_input(e)
    hitbox_editor.handle_input(e)
    dialogue_editor.handle_input(e)
    location_editor.handle_input(e)
    object_editor.handle_input(e)
    game.handle_input(e)
    map.handle_input(e)
  })
  
  
  
  document.addEventListener("mouseup", function (e) {
    mouse.update_keys(e, "up")
    mouse.client_click_end.set(e.clientX, e.clientY)
  
    ui.handle_input(e)
    hitbox_editor.handle_input(e)
    dialogue_editor.handle_input(e)
    location_editor.handle_input(e)
    object_editor.handle_input(e)
    game.handle_input(e)
    map.handle_input(e)
  })
}
