const binds = {
  rotateCW: "KeyD",
  rotateCCW: "KeyA",
  accel: "KeyW",
  decel: "KeyS",
  dash: "Space",
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
  hitbox: "Digit4",
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
  ui.handle_input(e)
  editor.handle_input(e)
  dialogue_editor.handle_input(e)
  location_editor.handle_input(e)

  //localize this inside some UI class, which will have overview on which windows are and can be opened
  //+ will have many more features and will probably take care of overlays like ship hull health

  if(e.code === binds.map_open) {
    ui.map.toggleVisibility()
    ui.map.open = !ui.map.open
    if(ui.map.open) {
      game.state.set("map_open")
    }
    else game.state.set("passive")
  }


  if(e.code === binds.zoom_in) camera.zoomInit("in")
  if(e.code === binds.zoom_out) camera.zoomInit("out")
  if(e.code === binds.dash) {
    player.ship.dash_init()
  }
})
document.addEventListener("keyup", function (e) {
  updateKeys(e, "keyup")
  ui.handle_input(e)
  editor.handle_input(e)
  dialogue_editor.handle_input(e)
  location_editor.handle_input(e)
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
  editor.handle_input(e)
  dialogue_editor.handle_input(e)
  location_editor.handle_input(e)
  if(game.state.is("map_open")) {
    if(e.deltaY > 0) {
      ui.map.zoom("in")
    }
    else
    if(e.deltaY < 0) {
      ui.map.zoom("out")
    }
  }
  if(game.state.is("passive", "battle")) {
    if(e.deltaY > 0) {
        camera.zoomInit("in")
      }
    else
    if(e.deltaY < 0) {
      camera.zoomInit("out")
    }
  }
})



document.addEventListener("mousedown", function (e) {
  ui.handle_input(e)
  editor.handle_input(e)
  dialogue_editor.handle_input(e)
  location_editor.handle_input(e)
  if(e.button === 1) {
    e.preventDefault()
  }
  mouse.client_click_origin.set(e.clientX, e.clientY)
  mouse.click_target = e.target
  mouse.update_keys(e, "down")

  if(game.state.is("battle")) player.ship.fire()
  if(e.target === map.canvas.view) console.log(mouse.map_pos)
  let rect = e.target.getBoundingClientRect();
  let pos = {
    x: e.pageX - rect.left,
    y: e.pageY - rect.top
  }
  if(e.target === map.canvas.view) {
    console.log("map canvas HTML elem. position - x: " + pos.x + " y: " + pos.y)
  }

})



document.addEventListener("click", function (e) {
  ui.handle_input(e)
  editor.handle_input(e)
  dialogue_editor.handle_input(e)
  location_editor.handle_input(e)
})



document.addEventListener("mousemove", function (e) {
  ui.handle_input(e)
  editor.handle_input(e)
  dialogue_editor.handle_input(e)
  location_editor.handle_input(e)
  mouse.update_pos(e)
})



document.addEventListener("mouseup", function (e) {
  ui.handle_input(e)
  editor.handle_input(e)
  dialogue_editor.handle_input(e)
  location_editor.handle_input(e)
  mouse.update_keys(e, "up")
})