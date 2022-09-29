const binds = {
  rotateCW: "KeyD",
  rotateCCW: "KeyA",
  accel: "KeyW",
  decel: "KeyS",
  brake: "KeyV",
  toggleAutobrake: "KeyB",
  dash: "Space",
  mapOpen: "KeyM",
  zoomIn: "Digit1",
  zoomOut: "Digit2",
  hitbox: "Digit3",
  gameStats: "Digit4",
  devIcons: "Digit5",
  cancel: "Escape",
  confirm: "Enter",
  pause: "KeyP",
  shift: "ShiftLeft",
  shiftRight: "ShiftRight",
  ctrl: "ControlLeft",
  ctrlRight: "ControlRight",
  alt: "alt",
}
const keys = {}
{
  let bindKeys = Object.keys(binds)
  for (let i = 0; i < bindKeys.length; i++) {
    Object.defineProperty(
      keys, 
      bindKeys[i], 
      {value: false, writable: true}
    )
  }
}

function updateKeys(event) {
  if(event.type !== "keyup" && event.type !== "keydown") return
  let bindPropertyNames = Object.keys(binds)

  for (let i = 0; i < bindPropertyNames.length; i++) {
    if(event.code === binds[bindPropertyNames[i]] && event.type === "keyup") {
      keys[bindPropertyNames[i]] = false
    }
    if(event.code === binds[bindPropertyNames[i]] && event.type === "keydown") {
      keys[bindPropertyNames[i]] = true
    }
  }
  if(event.altKey) keys.alt = true
  else keys.alt = false
}

function attachListeners() {
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault()
  })
  document.addEventListener("keydown", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("keyup", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("mousemove", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("pointermove", function(e) {
    handleGlobalInput(e)
  })
  document.addEventListener("mousedown", function (e) {
    if(e.button === 1) {
      e.preventDefault()
    }
    handleGlobalInput(e)
  })
  document.addEventListener("mouseup", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("click", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("wheel", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("pointerdown", function (e) {
    handleGlobalInput(e)
  })
}

function handleGlobalInput(e) {
  updateKeys(e)
  program.handleInput(e)
}