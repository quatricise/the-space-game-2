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
  game_stats: "Digit4",
  dev_icons: "Digit5",
  cancel: "Escape",
  confirm: "Enter",
  pause: "KeyP",
  shift: "ShiftLeft",
  shift_right: "ShiftRight",
  ctrl: "ControlLeft",
  ctrl_right: "ControlRight",
  alt: "alt",
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

function update_keys(event) {
  if(event.type !== "keyup" && event.type !== "keydown") return
  let bind_property_names = Object.keys(binds)

  for (let i = 0; i < bind_property_names.length; i++) {
    if(event.code === binds[bind_property_names[i]] && event.type === "keyup") {
      keys[bind_property_names[i]] = false
    }
    if(event.code === binds[bind_property_names[i]] && event.type === "keydown") {
      keys[bind_property_names[i]] = true
    }
  }
  if(event.altKey) keys.alt = true
  else keys.alt = false
}

function attach_listeners() {
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault()
  })
  document.addEventListener("keydown", function (e) {
    handle_global_input(e)
  })
  document.addEventListener("keyup", function (e) {
    handle_global_input(e)
  })
  document.addEventListener("mousemove", function (e) {
    handle_global_input(e)
  })
  document.addEventListener("pointermove", function(e) {
    handle_global_input(e)
  })
  document.addEventListener("mousedown", function (e) {
    if(e.button === 1) {
      e.preventDefault()
    }
    handle_global_input(e)
  })
  document.addEventListener("mouseup", function (e) {
    handle_global_input(e)
  })
  document.addEventListener("click", function (e) {
    handle_global_input(e)
  })
  document.addEventListener("wheel", function (e) {
    handle_global_input(e)
  })
  document.addEventListener("pointerdown", function (e) {
    handle_global_input(e)
  })
}

function handle_global_input(e) {
  update_keys(e)
  program.handle_input(e)
}