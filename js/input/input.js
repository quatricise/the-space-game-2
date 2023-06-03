const keys = {}
for(let key in binds)
  keys[key] = false

function updateKeys(event) {
  if(event.type !== "keyup" && event.type !== "keydown") return

  let bindKeys = Object.keys(binds)
  for (let i = 0; i < bindKeys.length; i++) {
    if(event.code === binds[bindKeys[i]] && event.type === "keyup") {
      keys[bindKeys[i]] = false
    }
    if(event.code === binds[bindKeys[i]] && event.type === "keydown") {
      keys[bindKeys[i]] = true
    }
  }

  if(event.altKey) 
    keys.alt = true
  else 
    keys.alt = false
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
    if(e.button === 1) 
      e.preventDefault()
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
  gameManager.handleInput(e)
}