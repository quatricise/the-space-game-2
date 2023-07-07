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

class Input {
  /* an array of simplified event representations */
  static record = []            
  /* time difference from the last event recorded */
  static eventRecordTimestamp = 0 
  static get something() {

  }
  static listener(e) {
    if(this.record.length === 0) {
      this.eventRecordTimestamp = Date.now()
      console.log("empty record")
    }
    
    let delay = Date.now() - this.eventRecordTimestamp
    this.eventRecordTimestamp = Date.now()

    let event = {
      type:         e.type,
      targetId:     e.target?.id,
      targetClass:  e.target?.classList[0],
      code:         e.code,
      delay:        delay 
    }
    this.record.push(event)
  }
  static startRecording() {
    this.record = []
    document.addEventListener("keydown", this.listener.bind(this), false)
    document.addEventListener("mousedown", this.listener.bind(this), false)
  }
  static stopRecording() {
    document.removeEventListener("keydown", this.listener)
    document.removeEventListener("mousedown", this.listener)
    this.generateReplayFunction()
  }
  static generateReplayFunction() {
    const createEventFunction = (record) => {
      let text = ""
      switch(record.type) {
        case "keydown": {
          text += `
            let ev = new Event("keydown")
            ev.code = ${record.code}
            document.body.dispatchEvent()
          `
          break
        }
        case "mousedown": {
          text += `Q(${record.targetId ? "#" + record.targetId : "." + record.targetClass}).click()`
          break
        }
        default: {break}
      }
      text += `\n waitFor(${record.delay})`
      return text
    }
    let func = `async () => {
      ${this.record.map(createEventFunction).join("\n")}
    }`
    console.log(func) 
  }
}