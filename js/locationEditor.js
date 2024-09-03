class LocationEditor extends GameWorldWindow {
  constructor() {
    super("LocationEditor", Q('#location-editor'))
    this.app.view.classList.add("location-editor-app")
    this.cameraAnchor = {transform: new Transform()}
    this.contextWindow = Q('#location-editor-context-window')
    this.contextWindowPropertiesContainer = this.contextWindow.querySelector(".object-properties")
    this.locationPosition = new Vector(0)
    this.state = new State(
      "default",
      "addingObj",
      "addingSpawn",
      "panning",
      "rotating",
      "scaling",
      "draggingContextWindow",
      "paintingFog",
      "erasingFog",
      "circleSelecting",
    )
    /** @type String */
    this.tool = "move"
    this.tools = [
      "move",
      "circle-select",
      "rotate",
      "scale",
      "select-object",
      "edit-hitbox",
      "randomize-rotation",
      "fog-paint",
      "fog-eraser",
      "toggle-collision",
      "toggle-spray-mode",
      "use-multi-selection",
    ]
    this.unusedTools = [
      "addSpawn",
      "add-special",
      "moveSpawnsAlong",
    ]
    this.specialObjects = [
      "randomSpawner", 
      "locationRandomizer",
    ]

    /** @type Array<GameObject> */
    this.selected = []

    /** @type HTMLElement */
    this.dragged = null

    /** @type Array<GameObject> */
    this.previousSelected = []

    /** @type Boolean */
    this.isContextWindowOpen = true

    this.sprayMode = {
      active: false,
      spacing: 50,
      scatter: {
        x: 0,
        y: 0
      }
    }
    this.boxSelection = {
      active: false,
      startPoint: new Vector(),
      endPoint: new Vector(),
      begin() {
        this.reset()
        this.active = true
        this.startPoint.setFrom(mouse.locationEditorPosition)
        this.endPoint.setFrom(mouse.locationEditorPosition)
      },
      end() {
        this.active = false
        this.endPoint.setFrom(mouse.locationEditorPosition)
        this.selectObjects()
      },
      selectObjects: () => {
        let topLeftPoint = new Vector()
        topLeftPoint.x = Math.min(this.boxSelection.startPoint.x, this.boxSelection.endPoint.x)
        topLeftPoint.y = Math.min(this.boxSelection.startPoint.y, this.boxSelection.endPoint.y)

        let bottomRightPoint = new Vector()
        bottomRightPoint.x = Math.max(this.boxSelection.startPoint.x, this.boxSelection.endPoint.x)
        bottomRightPoint.y = Math.max(this.boxSelection.startPoint.y, this.boxSelection.endPoint.y)
        
        let box = new BoundingBox(
            topLeftPoint.x,
            topLeftPoint.y,
            bottomRightPoint.x - topLeftPoint.x,
            bottomRightPoint.y - topLeftPoint.y,
        )
        let selectable = this.gameObjects.gameObject.concat(this.gameObjects.decoration)
        selectable.forEach(obj => {
          if(!obj.hitbox) return
          if(Collision.auto(obj.hitbox, box)) 
            this.selectObject(obj)
        })
      },
      reset() {
        this.startPoint.set(0)
        this.endPoint.set(0)
      }
    }
    this.selectDelay = 55
    this.activeObject = {
      name: "small0",
      type: "asteroid",
      extra: []
    }

    /* flags */
    this.limitSelectionToLayer = false
    this.unlockFogSprites = false
    this.circleSelectRadius = 50
    
    /** @type String */
    this.activeLayer = null

    /* add layers here and set each to unlocked */
    this.lockedLayers = {}
    for(let key in this.layers) {
      this.lockedLayers[key] = false
    }

    /** This only works for rotating a single object */
    this.rotationData = {
      /** @type Vector */
      clickOrigin: new Vector(),
      /** @type Float */
      angleStart: 0,
      /** @type Float */
      mouseAngleToCenterPrevious: 0,
      /** @type Float */
      angleNow: 0,
      /** @type Vector */
      pivot: new Vector(),
      /** @type Float - Original rotation */
      orig: 0,
      /** @type Array<GameObject> */
      objects: [],
      /** @type Array<Vector> - Object positions, relative from the pivot */
      positions: [],
    }

    this.multiRotation = {
      
    }

    /* fog stuff */
    this.fogPlaced = 0
    this.fogRemoved = 0
    this.brushSpacing = 50
    this.eraserRadius = 50
    this.fog = []
    
    /** @type Array<GameObject> this is an array of gameObjects that are used to move fog sprites around */
    this.fogHandlers = []

    this.moveSpawnsAlong = false
    this.useCollision = false
    this.useMultiSelection = false
    this.dropdown = this.element.querySelector(".search-dropdown-window")
    this.dropdownSpecial = this.element.querySelector(".special-dropdown-window")
    this.objSelector = this.element.querySelector(".selected-object-cont")
    this.camera.lockTo(this.cameraAnchor)
    
    this.generateIcons()
    this.generateObjectList()
    this.addOrigin()
    this.modifyCamera()
    this.loadSprayModeSpacing()
    this.setActiveObject(this.element.querySelector(".dropdown-item.object"))
    this.generateLayerButtons()
    this.setTool(this.tools[0])
  }
  import() {
    let name = window.prompt("location name", "kaeso")
    if(!name) return
    
    this.clearLocation()

    readJSONFile("data/locations/" + name + "/objects.json", (text) => {
      let rawData = JSON.parse(text)
      let location = SaveConverter.convert("save", "data", rawData)

      /* cosmetic */
      this.locationName = location.name
      Q('#location-editor-name').innerText = this.locationName

      /* fog */
      this.loadFog(location.fog)

      /* objects */
      location.objects.forEach(obj => {

        if(obj.type == "decoration" && obj.name == "empty") return

        let params = {
          transform: Transform.fromPlain(obj.transform),
          id: obj.id,
          pilot: obj.pilot
        }
        if(obj.type === "camera") {
          params["context"] = this.stage
          params["lockedTo"] = this.cameraAnchor
        }

        let gameObject = 
        GameObject.create(
          obj.type, 
          obj.name, 
          params,
          {
            world: this,
            layer: obj.layer
          }
        )
        if(obj.type === "camera")
          this.camera = gameObject
        this.supplyHitboxIfNotPresent(gameObject)
      })

      this.modifyCamera()
    })
  }
  export() {
    let gameLocation = {}
    gameLocation.name = this.locationName
    gameLocation.position = this.locationPosition.plain()

    /* fog */
    gameLocation.fog = this.fog.map(f => {
      return {
        position: {
          x: f.position.x,
          y: f.position.y
        },
        alpha: f.alpha,
      }
    })

    /* objects */
    gameLocation.objects = []
    let exceptions = [NPC, Person, Player, Hint, GameOverlay, HintGraphic]
    let exportedObjects = this.gameObjects.gameObject.concat(this.gameObjects.decoration)

    exportedObjects.forEach(obj => {
      for(let exception of exceptions)
        if(obj instanceof exception) return
      
      if(obj.type == "decoration" && obj.name == "empty") return

      let newobj = {
        id: obj.id, 
        transform: obj.transform.plain,
        type: obj.type,
        name: obj.name,
        layer: obj.layer
      }
      if(obj.pilot)
        newobj.pilot = obj.pilot
      
      gameLocation.objects.push(newobj)
    })

    /* convert to save file */
    let saveFile = SaveConverter.convert("data", "save", gameLocation, {decimals: 0})
    console.log(saveFile)
    exportToJSONFile(saveFile, "location001")
  }
  show() {
    this.element.classList.remove('hidden')
  }
  hide() {
    this.element.classList.add('hidden')
  }
  toggle() {
    this.element.classList.toggle('hidden')
  }
  modifyCamera() {
    this.camera.zoomRange = [0.1, 25]
    this.camera.zoomStep = 0.9
    this.camera.zoom.duration = 10
  }
  addOrigin() {
    this.origin = PIXI.Sprite.from("assets/origin.png")
    this.origin.anchor.x = 0.5
    this.origin.anchor.y = 0.5
    this.stage.addChild(this.origin)
  }
  generateIcons() {
    this.tools.forEach(tool => {
      let cont = El('div', "tool-cont")
      let icon = El('div', "tool-icon " + tool)
      cont.append(icon)
      cont.onclick = () => this.setTool(tool)
      cont.title = tool.replaceAll('-', " ").replaceAll("_", " ").capitalize()
      cont.dataset.toolname = tool
      Q('#location-editor-toolset').append(cont)
    })
  }
  generateObjectList() {
    let regularList =     this.element.querySelector(".search-dropdown-window .dropdown-list.regular")
    let backgroundList =  this.element.querySelector(".search-dropdown-window .dropdown-list.background")
    let specialList =     this.element.querySelector(".search-dropdown-window .dropdown-list.special")
    let names = []
    let types = []

    /* only these objects are placeable, the rest like 'projectiles' wouldn't make sense */
    let typesDef = [
      "ship",
      "asteroid",
      "debris",
      "station",
      "satellite",
      "ultraportBeacon",
      "decoration",
      "spawner"
    ]

    for(let type of typesDef)
      for(let key in data[type]) {
        names.push(key)
        types.push(type)
      }

    names.forEach((n, index) => {
      if(debug.locationEditor) 
        console.log(types[index], names[index], sources.img[types[index]][names[index]])

      let img = new Image()
      types[index].includes("decoration") ? 
      img.src = sources.img[types[index]][names[index]].folder + "linework.png" :
      img.src = sources.img[types[index]][names[index]].folder + "thumbnail.png"
      img.style.position = "absolute"

      let cont = El('div', "dropdown-item object", [["title", "Click to select\nSHIFT + Click to add/remove object from multi-selection \nCTRL + Click to replace selected with this object"]])
      let name = names[index].replaceAll("_", ' ').capitalize()
      let desc = El('div', "dropdown-desc", undefined, name) 
      let imageCont = El('div', "dropdown-image")
      imageCont.append(img)
      cont.dataset.name = names[index]
      cont.dataset.type = types[index]
      cont.append(imageCont, desc)

      if(types[index].includes("decoration"))
        backgroundList.append(cont)
      else if(types[index].includes("spawner"))
        specialList.append(cont)
      else
        regularList.append(cont)
    })
  }
  generateLayerButtons() {
    function createButton(key) {
      let button = El("div", "location-editor-layer-button", undefined, key)
      button.dataset.layer = key
      Q("#location-editor-layer-dropdown").append(button)
    }
    createButton("auto")
    for(let key in this.layers) {
      createButton(key)
    }
  }
  setActiveLayer(layer) {
    Q("#location-editor-layer-selector-text").innerText = layer
    layer == "auto" ? this.activeLayer = null : this.activeLayer = layer
  }
  toggleLayerLock(layer) {
    this.lockedLayers[layer] = !this.lockedLayers[layer]
    this.element.querySelector(`.location-editor-layer-button[data-layer='${layer}']`).classList.toggle("locked")
  }
  toggleLayerDropdown() {
    Q("#location-editor-layer-dropdown").classList.toggle("hidden")
  }
  showLayerDropdown() {
    Q("#location-editor-layer-dropdown").classList.remove("hidden")
  }
  hideLayerDropdown() {
    Q("#location-editor-layer-dropdown").classList.add("hidden")
  }
  toggleDropdownListCategory() {
    throw "s"
    // Q(".dropdown-list.regular").classList.toggle("hidden")
    // Q(".dropdown-list.background").classList.toggle("hidden")
    // Q("#search-dropdown-category-switch-regular").classList.toggle("active")
    // Q("#search-dropdown-category-switch-background").classList.toggle("active")
  }
  setDropdownCategory(/** @type String */ category) {
    Qa(`.dropdown-category-switch`).forEach(s => s.classList.remove("active"))
    Q(`#search-dropdown-category-switch-${category}`).classList.add("active")

    Qa(`.dropdown-list`).forEach(l => l.classList.add("hidden"))
    Q(`.dropdown-list.${category}`).classList.remove("hidden")
  }
  setTool(name, /** If the tool was reverted */ fromRevert = false) {
    let tool = this.tools.find(t => t === name)
    if(!tool) throw "Invalid tool name: " + name

    this.prevTool = this.tool
    this.tool = tool
    Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
    this.element.querySelector(`[data-toolname='${tool}'`).classList.add('active')

    if(!fromRevert) {
      if(tool !== "select-object") {
        this.dropdown.classList.add("hidden")
      }
      else {
        this.dropdown.classList.toggle("hidden")
        this.dropdown.style.left = mouse.clientPosition.x + "px"
        this.dropdown.style.top = mouse.clientPosition.y + "px"
        this.fitInViewport(this.dropdown)
      }
    }

    if(tool === "select-object")
      this.state.set("addingObj")
    else
      this.state.set("default")
  }
  fitInViewport(element) {
    let rect = element.getBoundingClientRect()
    let inset = 20
    if(rect.bottom > ch - inset) {
      let top = ch - rect.height - inset
      element.style.top = top + "px"
    }
    if(rect.right > cw - inset) {
      let left = cw - rect.width - inset
      element.style.left = left + "px"
    }
    if(rect.top < inset) {
      let top = inset
      element.style.top = top + "px"
    }
    if(rect.left < inset) {
      let left = inset
      element.style.left = left + "px"
    }
  }
  addOverrideRow() {
    let row = El("div", "context-window-override-row", undefined, "Click to set override")
    row.dataset.overrideindex = this.selected[0].overrides.length
    this.selected[0].overrides.push("")
    Q("#context-window-overrides-list").append(row)
  }
  setOverride(overrideElement) {
    let overrideIndex = overrideElement.dataset.overrideindex
    let value = window.prompt(`Enter override value(example:'"systems", ["cargo", "engine"]'`, overrideElement.innerText)
    if(!value) return

    this.selected.forEach(obj => obj.overrides[overrideIndex] = eval(`[${value}]`))
    overrideElement.innerText = value
  }
  revertTool() {
    this.setTool(this.prevTool, true)
    if(this.tool === "select-object") 
      this.state.set("addingObj")
  }
  setActiveObject(target) {
    let item = target.closest(".dropdown-item.object")
    let type = item.dataset.type
    let name = item.dataset.name
    if(!keys.shift) {
      this.activeObject.type = type
      this.activeObject.name = name
      this.activeObject.extra = []
      Qa("#location-editor .dropdown-item").forEach(i => i.classList.remove("active"))
      setTimeout(() => this.hideDropdown(), 100)
      
      let imgCont = item.querySelector(".dropdown-image").cloneNode(true)
      Array.from(imgCont.children).forEach(img => img.style = "")
      imgCont.classList.replace("dropdown-image", "selected-object-icon")
      let text = item.querySelector(".dropdown-desc").innerText
      let desc = El("div", "selected-object-desc", undefined, text)
      this.objSelector.innerHTML = ""
      this.objSelector.append(imgCont, desc)
    }
    else
    if(keys.shift) {
      let obj = this.activeObject.extra.find(obj => obj.name === name && obj.type === type)
      if(obj) {
        this.activeObject.extra.remove(obj)
        item.classList.remove("active")
      }
      else {
        this.activeObject.extra.push({name, type})
        item.classList.add("active")
      }
    }
  }
  replaceSelectedWith(type, name) {
    let newObjects = []
    let replaced = [...this.selected]
    this.deselectAll()
    replaced.forEach(obj => {
      let transform = obj.transform.clone()
      newObjects.push(
        GameObject.create(type, name, {transform}, {world: this})
      )
    })
    replaced.forEach(obj => GameObject.destroy(obj))
    this.selected.push(...newObjects)
  }
  contestWindowToggle() {
    if(this.isContextWindowOpen)
      this.contextWindowClose()
    else
      this.contextWindowOpen()
  }
  contextWindowOpen() {
    if(this.selected.length > 1) return

    let obj = this.selected[0]
    this.contextWindow.classList.remove('hidden')
    this.isContextWindowOpen = true
  }
  contextWindowClose() {
    this.contextWindow.classList.add('hidden')
    this.isContextWindowOpen = false
  }
  //this is the inspector window for a selected GameObject
  contextWindowRefresh() {
    if(this.selected.length !== 1) return

    let obj = this.selected[0]
    Array.from(this.contextWindow.querySelectorAll(".temp")).forEach(prop => prop.remove())

    const createProp = (prop) => {
      let cont = El("div", "property temp")
      let key = El("div", "key", undefined, prop + ": ")

      let value
      let isTransformProperty = prop.matchAgainst("position", "velocity", "rotation", "angularVelocity")
      
      if(isTransformProperty)
        value = obj.transform[prop]
      else
        value = obj[prop]

      cont.dataset.property = prop
      cont.dataset.istransformproperty = isTransformProperty ? "true" : "false"
      
      let valueElement = El("div", "value", undefined, value)

      if(prop === "pilot")
        valueElement.classList.add("person-field")

      cont.dataset.datatype = typeof value
      cont.append(key, valueElement)
      this.contextWindowPropertiesContainer.append(cont)
    }

    let props = ["id", "rotation", "angularVelocity"]

    // if(obj instanceof RandomSpawner) {
    //   props.push("radius", "spawnsMin", "spawnsMax")
    //   props.forEach(prop => createProp(prop))
    //   obj.objects.forEach(o => {
    //     obj.generateThumbnail(o.type, o.name, o.src)
    //   })
    // }
    // else
    // if(obj instanceof RandomSpawnerSpawn) {
    //   props.push("weight")
    //   props.forEach(prop => createProp(prop))
    // }
    // else
    if(obj instanceof Asteroid) {
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof Debris) {
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof Ship) {
      props.push("pilot")
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof Decoration) {
      props.push("alpha")
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof Station) {
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof Interactable) {
      props.push("radius")
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof UltraportBeacon) {
      props.forEach(prop => createProp(prop))
    }
  }
  npcSearchCreate() {
    let popup = El("div", "search-popup")
    let input = El("input", "search-popup-input", [["type", "text"]])

    const createField = (prop) => {
      let row = El("div", "search-popup-row")
          row.dataset.datatype = "speaker"
      let name = El("div", "search-popup-name", undefined, prop)
      let img = new Image()
      if(prop.includes("variable")) 
      {
        img.src = "assets/editor/iconSpeaker.png"
      }
      else 
      {
        img.src = "assets/portraits/" + prop + ".png"
      }

      row.append(img, name)
      row.dataset.speaker = prop
      popup.append(row)
    }
    for(let prop in data.person) 
      createField(prop)

    popup.append(input)
    popup.style.left = (mouse.clientPosition.x + 5) + "px"
    popup.style.top = (mouse.clientPosition.y + 5) + "px"
    this.element.append(popup)
    this.npcSearch = popup
  }
  addObject(options = {useScatter: false}) {
    let pos = mouse.locationEditorPosition.clone()
    let vel = new Vector(0,0)
    let rotation = 0
    let angularVelocity = 0
    let type, name
    let objectIndex = Random.int(0, this.activeObject.extra.length - 1)
    if(this.useMultiSelection && this.activeObject.extra.length) {
      type = this.activeObject.extra[objectIndex].type
      name = this.activeObject.extra[objectIndex].name
    }
    else if(this.activeObject.type && this.activeObject.name) {
      type = this.activeObject.type
      name = this.activeObject.name
    }
    else {
      return
    }

    if(options.useScatter) {
      pos.x += Random.int(-this.sprayMode.scatter.x, this.sprayMode.scatter.x)
      pos.y += Random.int(-this.sprayMode.scatter.y, this.sprayMode.scatter.y)
    }

    if(this.randomizeRotation) 
      rotation = Math.random() * PI*2

    let gameObject = GameObject.create(
      type,
      name, 
      {
        transform: new Transform(
          pos, vel, rotation, angularVelocity
        )
      }, 
    {
      world: this,
      layer: this.activeLayer
    })
    if(type === "ship")
      gameObject.pilot = "dummyCaptain"

    this.supplyHitboxIfNotPresent(gameObject)
  }
  addSpecial() {
    throw "Don't use addSpecial()"
  }
  selectObject(obj) {
    if(this.selected.findChild(obj)) return
    if(this.limitSelectionToLayer && this.activeLayer && obj.layer !== this.activeLayer) return
    if(this.lockedLayers[obj.layer]) return

    this.selected.push(obj)
    this.contextWindowRefresh()
  }
  deselectObject(obj) {
    this.selected.remove(obj)
  }
  reselect() {
    [this.selected, this.previousSelected] = [this.previousSelected, this.selected]
  }
  selectAll() {
    this.deselectAll()
    let selectable = this.gameObjects.decoration.concat(this.gameObjects.gameObject)
    selectable.forEach(obj => {
      if(obj === this.camera) return
      if(this.activeLayer && this.limitSelectionToLayer && obj.layer === this.activeLayer)
        this.selectObject(obj)
      else 
      if(this.activeLayer && !this.limitSelectionToLayer)
        this.selectObject(obj)
      else 
      if(!this.activeLayer)
        this.selectObject(obj)
    })
    this.previousSelected = [...this.selected]
  }
  deselectAll() {
    this.selected = []
  }
  resetRotation() {
    this.selected.forEach(o => o.transform.rotation = 0)
  }
  randomizeRotationForAll() {
    this.selected.forEach(obj => obj.transform.rotation = Random.float(0, TAU))
  }
  deleteSelected() {
    let toBeDestroyed = [...this.selected]
    this.deselectAll()
    toBeDestroyed.forEach(obj => {
      if(this.fogHandlers.findChild(obj))
        this.removeFogSprite(obj.attachedFogSprite)
      GameObject.destroy(obj)
    })
  }
  duplicateSelected() {
    let duplicates = []
    this.selected.forEach(obj => {
      let newobj = 
      GameObject.create(
        obj.type, 
        obj.name, 
        {
          transform: obj.transform.clone()
        }, 
        {world: this}
      )
      newobj.transform.position.x += 50
      newobj.transform.position.y += 50
      this.supplyHitboxIfNotPresent(newobj)
      duplicates.push(newobj)
    })
    this.deselectAll()
    duplicates.forEach(dup => this.selectObject(dup))
    this.previousSelected = [...this.selected]
  }
  loadFog(fogArray) {
    fogArray.forEach(f => {
      this.addFog(f.alpha, f.position, true)
    })
  }
  addFog(
    alpha = clamp(mouse.pressure * 3, 0.2, 1.0),
    position = mouse.locationEditorPosition.clone(),
    fromFile = false,
  ) {
    /* if the fog isn't loaded from a file, return if the mouse hasn't moved far enough to place another sprite */
    if(!fromFile && mouse.travelled < Math.floor(this.fogPlaced) * this.brushSpacing) return
    
    let 
    fog = PIXI.Sprite.from("assets/fogDab.png")
    fog.position.set(position.x, position.y)
    fog.anchor.set(0.5)
    fog.alpha = alpha
    fog.rotation = Random.rotation()
    fog.scale.set(0.5 + alpha)

    this.layers.fog.addChild(fog)
    this.fog.push(fog)
    this.fogPlaced++

    /* create a gameobject that holds the fog in reference and then when you move the gameobject, it moves the fog sprite */
    let 
    go = GameObject.create("decoration", "empty", {transform: new Transform(new Vector(position.x, position.y))}, {world: this, layer: "fog"})
    go.attachedFogSprite = fog
    this.fogHandlers.push(go)
    this.supplyHitboxIfNotPresent(go, 0x335aee)
  }
  removeFog() {
    if(mouse.travelled < Math.floor(this.fogRemoved) * this.brushSpacing) return

    let position = mouse.locationEditorPosition.clone()
    for(let i = 0; i < this.fog.length; i++) {
      let fog = this.fog[i]
      let vec = new Vector(fog.position.x, fog.position.y)
      if(vec.isClose(this.eraserRadius, position)) {
        this.removeFogSprite(fog)
        break
      }
    }
    this.fogRemoved++
  }
  removeFogSprite(fog) {
    this.fog.remove(fog)
    this.layers.fog.removeChild(fog)
  }
  loadSprayModeSpacing() {
    this.sprayMode.spacing = +localStorage.getItem("sprayModeSpacing")
    this.sprayMode.scatter.x = +localStorage.getItem("scatterX")
    this.sprayMode.scatter.y = +localStorage.getItem("scatterY")
  }
  setSprayModeParameters() {
    this.sprayMode.spacing =    +window.prompt("Set spacing value", this.sprayMode.spacing)      || this.sprayMode.spacing
    this.sprayMode.scatter.x =  +window.prompt("Set scatter X value", this.sprayMode.scatter.x)  || this.sprayMode.scatter.x
    this.sprayMode.scatter.y =  +window.prompt("Set scatter Y value", this.sprayMode.scatter.y)  || this.sprayMode.scatter.y
    
    localStorage.setItem("sprayModeSpacing",  this.sprayMode.spacing)
    localStorage.setItem("scatterX",          this.sprayMode.scatter.x)
    localStorage.setItem("scatterY",          this.sprayMode.scatter.y)
  }
  //#region input handlers
  handleKeydown(event) {
    /* escape tree of events */
    if(event.code === "Escape" && (keys.shift || keys.shiftRight))
      this.reselect()
    else 
    if(event.code === "Escape" && !this.dropdown.classList.contains("hidden")) {
      this.dropdown.classList.add("hidden")
    }
    if(event.code === "Escape" && this.tool.matchAgainst("circle-select", "rotate", "scale")) {
      this.setTool("move")
    }
    else if(event.code === "Escape") {
      this.deselectAll()
    }

    /* scale */
    if(event.code === "KeyS" && !keys.alt && !keys.shift)     this.setTool("scale")
    
    /* rotate */
    if(event.code === "KeyR" && !keys.alt && !keys.shift)     this.setTool("rotate")
    if(event.code === "KeyR" && keys.alt && !keys.shift)      this.resetRotation()
    if(event.code === "KeyR" && !keys.alt && keys.shift)      this.randomizeRotationForAll()

    /* select object */    
    if(event.code === "KeyA" && !keys.shift)                  this.setTool("select-object")

    if(event.code === "KeyS" && keys.shift)                   this.setSprayModeParameters()
    if(event.code === "KeyD")                                 this.duplicateSelected()
    if(event.code === "KeyV")                                 this.setTool("move")
    if(event.code === "KeyC")                                 this.setTool("circle-select")
    if(event.code === "KeyX")                                 this.deleteSelected()
    if(event.code === "KeyA" && keys.shift)                   this.selectAll()
    if(event.code === "KeyE")                                 this.contestWindowToggle()
    if(event.code === "KeyN")                                 this.state.set("addingSpawn")
  }               
  handleKeyup(event) {

  }
  handleMousemove(event) {
    if(this.state.is("panning")) {
      this.cameraAnchor.transform.position.sub(mouse.locationEditorMoved)
    }

    /* move objects */
    if(
      this.tool === "move" && 
      this.selected.length > 0 && 
      event.target === this.element && 
      mouse.keys.left && 
      this.state.isnt("draggingContextWindow")
    ) {
      this.selected.forEach(obj => {
        obj.transform.position.add(mouse.locationEditorMoved)
        if(this.fogHandlers.findChild(obj))
          obj.attachedFogSprite.position.set(obj.transform.position.x, obj.transform.position.y)
      })
    }

    if(this.state.is("circleSelecting")) {
      let pos = mouse.locationEditorPosition.clone()
      let fakeGameObject = {transform: {position: pos}}
      let fakeCircleHitbox = {type: "circle", radius: this.circleSelectRadius * this.camera.currentZoom, gameObject: fakeGameObject}

      let selectable = this.gameObjects.gameObject.concat(this.gameObjects.decoration)
      selectable.forEach(obj => {
        if(!obj.hitbox) return

        if(!Collision.auto(fakeCircleHitbox, obj.hitbox)) return

        if(mouse.keys.right)
          this.deselectObject(obj)
        else
          this.selectObject(obj)
      })
    }

    if(this.state.is("draggingContextWindow")) {
      let left =  this.contextWindow.getBoundingClientRect().x
      let top =   this.contextWindow.getBoundingClientRect().y
      this.contextWindow.style.left = (left + mouse.clientMoved.x) + "px"
      this.contextWindow.style.top = (top + mouse.clientMoved.y) + "px"
    }

    /* rotate objects */
    if(this.state.is("rotating")) {
      /* single */
      if(this.selected.length === 1) {
        let pos = mouse.locationEditorPosition.clone()
        let obj = this.selected[0]
        let angle = Math.atan2(pos.y - obj.transform.position.y, pos.x - obj.transform.position.x)
        let result = angle - this.rotationData.angleStart
        obj.transform.rotation = this.rotationData.orig + result
      }

      /* multiple */
      else if(this.selected.length > 1) {
        this.selected.forEach(obj => {
          let angleNow = mouse.locationEditorPosition.angleTo(this.rotationData.pivot)
          let offset = angleNow - this.rotationData.mouseAngleToCenterPrevious
          obj.transform.position.rotateAround(this.rotationData.pivot, offset)

          /* this should be made optional but objects' rotation also changes */
          obj.transform.rotation += offset
        })
      }

      /* update previous angle to be now */
      this.rotationData.mouseAngleToCenterPrevious = mouse.locationEditorPosition.angleTo(this.rotationData.pivot)
    }

    /* scale objects */
    if(this.state.is("scaling")) {
      let center = Vector.center(...this.selected.map(obj => obj.transform.position))
      this.scalingBox = {center}

      let prevPos = mouse.locationEditorPosition.copy.sub(mouse.locationEditorMoved)
      let distanceFactor = mouse.locationEditorPosition.distance(center) / prevPos.distance(center)
      this.selected.forEach(obj => {
        obj.transform.position.scaleTo(center, distanceFactor)
      })
    }

    if(this.state.is("addingObj") && this.sprayMode.active && mouse.travelled > this.sprayMode.spacing) {
      mouse.travelled = 0
      this.addObject({useScatter: true})
    }

    if(this.boxSelection.active)      this.boxSelection.endPoint.setFrom(mouse.locationEditorPosition)
    if(this.state.is("paintingFog"))  this.addFog()
    if(this.state.is("erasingFog"))   this.removeFog()
  }
  handleMousedown(event) {
    let target = event.target

    /* left click */
    if(event.button === 0) {
      if(target.closest(".tool-icon.select-object")) {
        this.toggleDropdown(target)
      }
      if(target.closest(".drag-widget")) {
        this.state.set("draggingContextWindow")
      }
      if(target.closest(".thumbnail-container .icon-close-top-right")) {
        if(!(this.selected[0] instanceof RandomSpawner)) return

        let container = target.closest(".context-window-thumbnail")
        let obj = this.selected[0].objects.find(obj => obj.type === container.dataset.type && obj.name === container.dataset.name)
        obj.destroy()
      }
      if(target.closest(".tool-icon.add-special")) {
        throw "this should not get used"
        let el = target.closest(".tool-cont")
        let rect = el.getBoundingClientRect()
        
        this.dropdownSpecial.style.left = rect.x + "px"
        this.dropdownSpecial.style.top = rect.y + rect.height + 10 + "px"
        this.dropdownSpecial.classList.toggle("hidden")
      }
      if(target.closest(".tool-icon.edit-hitbox")) {
        if(this.selected.length > 0) {
          let obj = this.selected[0]
          gameManager.closeWindow()
          gameManager.setWindow(hitboxEditor)
          hitboxEditor.select(obj)
        }
        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".tool-icon.moveSpawnsAlong")) {
        this.moveSpawnsAlong = !this.moveSpawnsAlong
        target.closest(".tool-icon.moveSpawnsAlong").classList.toggle('active')

        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".tool-icon.randomize-rotation")) {
        this.randomizeRotation = !this.randomizeRotation
        target.closest(".tool-icon.randomize-rotation").classList.toggle('active')
        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".tool-icon.toggle-collision")) {
        this.useCollision = !this.useCollision
        target.closest(".tool-icon.toggle-collision").classList.toggle('active')
        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".tool-icon.toggle-spray-mode")) {
        this.sprayMode.active = !this.sprayMode.active
        target.closest(".tool-icon.toggle-spray-mode").classList.toggle('active')
        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".tool-icon.use-multi-selection")) {
        this.useMultiSelection = !this.useMultiSelection
        target.closest(".tool-icon.use-multi-selection").classList.toggle('active')
        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".dropdown-item.object") && !keys.ctrl) {
        this.setActiveObject(target)
        this.state.set("addingObj")
      }
      if(target.closest(".dropdown-item.object") && keys.ctrl) {
        let item = target.closest(".dropdown-item.object")
        let type = item.dataset.type
        let name = item.dataset.name
        this.replaceSelectedWith(type, name)
        this.state.set("addingObj")
      }

      /* layer selection and locking */
      if(target.closest("#location-editor-layer-selector")) {
        if(keys.shift || keys.ctrl)
          this.showLayerDropdown()
        else
          this.toggleLayerDropdown()
      }
      if(target.closest(".location-editor-layer-button") && !keys.shift && !keys.ctrl) {
        let layer = target.closest(".location-editor-layer-button").dataset.layer
        this.setActiveLayer(layer)
      }
      if(target.closest(".location-editor-layer-button") && keys.shift && !keys.ctrl) {
        let layer = target.closest(".location-editor-layer-button").dataset.layer
        this.toggleLayerLock(layer)
      }
      if(target.closest(".location-editor-layer-button") && keys.ctrl && !keys.shift) {
        let layer = target.closest(".location-editor-layer-button").dataset.layer

        for(let key in this.lockedLayers)
          if(!this.lockedLayers[key])
            this.toggleLayerLock(key)
        
        this.toggleLayerLock(layer)
      }
      if(target.closest(".location-editor-layer-button") && keys.ctrl && keys.shift) {
        let layer = target.closest(".location-editor-layer-button").dataset.layer

        let isSoloed = true
        let soloValue = this.lockedLayers[layer]
        for(let key in this.lockedLayers) {
          if(key === layer) continue
          if(this.lockedLayers[key] == soloValue) {
            isSoloed = false
            break
          }
        }
        if(isSoloed) {
          for(let key in this.lockedLayers)
            this.toggleLayerLock(key)
        }
        else {
          for(let key in this.lockedLayers)
            if(!this.lockedLayers[key])
              this.toggleLayerLock(key)
          this.toggleLayerLock(layer)
        }
      }
      /* end of layer selection and locking */

      if(target.closest("#search-dropdown-category-switch")) {
        /* remake this shit */
        let category = target.closest("[data-category]").dataset.category
        this.setDropdownCategory(category)
      }
      if(target.closest("#add-override-button")) {
        this.addOverrideRow()
      }
      if(target.closest(".context-window-override-row")) {
        this.setOverride(target.closest(".context-window-override-row"))
      }

      /* toggles */
      if(target.closest(".location-editor-toggle")) {
        target.closest(".location-editor-toggle").classList.toggle("active")

        switch(target.id) {
          case "limit-selection-to-active-layer": {
            this.limitSelectionToLayer = !this.limitSelectionToLayer
            break
          }
          case "unlock-fog-sprites": {
            this.unlockFogSprites = !this.unlockFogSprites
          }
        }
      }

      /* edit object property in inspector */
      if(target.closest(".property .value")) {
        if(this.selected.length == 0) return
        
        let propertyElement = target.closest(".property")
        let property = propertyElement.dataset.property
        let datatype = propertyElement.dataset.datatype
        let isTransformProperty = propertyElement.dataset.istransformproperty.bool()

        let newValue

        if(keys.alt) {
          newValue = 0
        }
        else {
          if(isTransformProperty)
            newValue = window.prompt("Enter new value for " + property, this.selected[0].transform[property])
          else
            newValue = window.prompt("Enter new value for " + property, this.selected[0][property])
        }

        if(datatype === "number") {
          if(isTransformProperty)
            this.selected[0].transform[property] = +newValue
          else
            this.selected[0][property] = +newValue
        }
        if(datatype === "string") {
          if(isTransformProperty)
            this.selected[0].transform[property] = newValue
          else
            this.selected[0][property] = newValue
        }

        mouse.keys.left = false
        this.contextWindowRefresh()
      }

      if(target.closest(".dropdown-item.special")) {
        this.activeObject.type = target.closest(".dropdown-item.special").dataset.type
        this.activeObject.name = target.closest(".dropdown-item.special").dataset.name
        this.state.set("addingObj")
        this.dropdownSpecial.classList.add("hidden")
      }

      /* adding object and clicking on canvas */
      if(target === this.element && this.state.is("addingObj")) {
        this.dropdown.classList.add("hidden")

        let hit = false
        mouse.travelled = 0
        let selectable = this.gameObjects.gameObject.concat(this.gameObjects.decoration)

        if(!hit) this.addObject()
      }
      if(target.closest('.icon-export')) {
        this.export()
      }
      if(target.closest('.icon-import')) {
        this.import()
      }
      if(target === this.element) {
        if(this.tool === "move") {
          let hasHit = false
          let pos = mouse.locationEditorPosition.clone()

          let selectable = this.gameObjects.gameObject.concat(this.gameObjects.decoration)
          selectable.forEach(obj => {
            if(hasHit) return
            if(!obj.hitbox) return
            
            if(Collision.auto(pos, obj.hitbox)) 
              hasHit = true

            if(hasHit) {
              if(!(keys.shift || keys.shiftRight) && !this.previousSelected.find(o => o === obj)) 
                this.deselectAll()
              
              this.selectObject(obj)
            }
          })
          if(!hasHit && this.selected.length === 0) {
            this.boxSelection.begin()
          }
        }

        if(this.tool === "circle-select") {
          this.state.set("circleSelecting")
        }

        if(this.tool === "addSpawn") {
          if(!(this.selected[0] instanceof LocationRandomizer) || this.selected.length > 1) return
          this.selected[0].addSpawn(mouse.locationEditorPosition)
        }

        if(this.tool === "rotate") {
          if(this.selected.length === 0) return
          this.state.set("rotating")
          this.rotationData.clickOrigin.setFrom(mouse.locationEditorPosition)

          /* single */
          if(this.selected.length === 1) {
            let pos = this.rotationData.clickOrigin
            let obj = this.selected[0]
            this.rotationData.angleStart = Math.atan2(pos.y - obj.transform.position.y, pos.x - obj.transform.position.x)
            this.rotationData.orig = obj.transform.rotation
          }
          /* multiple */
          else if(this.selected.length > 1) {
            this.rotationData.pivot = Vector.center(...this.selected.map(s => s.transform.position))
            this.rotationData.mouseAngleToCenterPrevious = this.rotationData.clickOrigin.angleTo(this.rotationData.pivot)
          }
        }

        if(this.tool === "scale") {
          this.state.set("scaling")
        }

        if(this.tool === "fog-paint") {
          this.addFog()
          this.state.set("paintingFog")
        }
        
        if(this.tool === "fog-eraser") {
          this.removeFog()
          this.state.set("erasingFog")
        }
      }
    }
    if(event.button === 1) {
      if(event.target === this.element)
        this.state.set("panning")
      else
      if(target.closest("#location-editor-layer-selector"))
        this.setActiveLayer("auto")
    }
    if(event.button === 2) {
      if(this.tool === "circle-select") {
        this.state.set("circleSelecting")
      }
    }
  }
  handleMouseup(event) {
    if(this.state.is("panning", "rotating", "scaling", "draggingContextWindow", "paintingFog", "erasingFog", "circleSelecting"))
      this.state.revert()

    this.fogPlaced = 0
    this.fogRemoved = 0

    let selectable = this.gameObjects.gameObject.concat(this.gameObjects.decoration)
    selectable.forEach(obj => {
      if(!obj.hitbox) return
      let hit = false
      let pos = mouse.clientPosition.clone().sub(new Vector(this.stage.position.x, this.stage.position.y))
      if(
        Collision.auto(pos, obj.hitbox) 
        && 
        mouse.clientClickOrigin.isClose(2, mouse.clientClickEnd)
      ) {
        hit = true
      }
      if(hit && this.previousSelected.find(o => o === obj))
        this.deselectObject(obj)
    })

    if(event.button === 0) {
      if(this.boxSelection.active)
        this.boxSelection.end()
    }

    this.previousSelected = [...this.selected]
  }
  handleClick(event) {

  }
  handleWheel(event) {
    if(event.target === this.element)
      this.zoom(event)
  }
  //#endregion
  supplyHitboxIfNotPresent(obj, color = 0xd35a1e) {
    if(obj.hitbox || data[obj.type][obj.name].hitbox) return

    switch(obj.type) {
      case "decoration": {
        /* do some black magic with the decoration to convert it to quasi-gameobject and add hitbox and rigidbody and some other shit */
        obj.components = []
        obj.addComponent = GameObject.prototype.addComponent
        obj.calculateBroadphaseGrowFactor = GameObject.prototype.calculateBroadphaseGrowFactor
        obj.components.push("hitbox", "rigidbody")
        obj.addComponent("hitbox", {
          hitbox: {
            type: "box",
            filename: null,
            definition: {
              a: 50,
              b: 50,
              color
            }
          }
        })
        obj.addComponent("rigidbody", {rigidbody: {}})
        break
      }
      case "camera": {
        console.log("tried to add hitbox to a camera, silly goose...")
        break
      }
      default: {
        obj.components.push("hitbox", "rigidbody")
        obj.addComponent("hitbox", {
          hitbox: {
            type: "box",
            filename: null,
            definition: {
              a: 50,
              b: 50,
              color
            }
          }
        })
        obj.addComponent("rigidbody", {rigidbody: {}})
        break
      }
    }

  }
  toggleDropdown(target) {
    console.log("toggle drop")
    let el = target.closest(".tool-cont")
    let rect = el.getBoundingClientRect()
    if(this.dropdown.classList.contains("hidden"))
      this.showDropdown(rect)
    else
      this.hideDropdown(rect)
  }
  showDropdown(parentBoundingRect) {
    this.dropdown.classList.remove("hidden")
    this.dropdown.style.left = parentBoundingRect.x + "px"
    this.dropdown.style.top = parentBoundingRect.y + parentBoundingRect.height + 10 + "px"
    setTimeout(() => {
      this.dropdown.querySelector("input").focus()
      this.dropdown.scrollTo(0, this.dropdown.scrollTopPrevious)
      console.log("scrolling to" , this.dropdown.scrollTopPrevious)
      console.log(this.dropdown.scrollTopPrevious)
    }, 100)
  }
  hideDropdown() {
    this.dropdown.scrollTopPrevious = this.dropdown.scrollTop
    this.dropdown.classList.add("hidden")
  }
  zoom(event) {
    if(event.deltaY < 0) 
      this.camera.zoomInit("in")
    else
      this.camera.zoomInit("out")
  }
  updateCursorOverlays() {
    if(this.tool === "fog-eraser") {
      this.graphics.lineStyle(2 * this.camera.currentZoom, 0xffffff, 1)
      this.graphics.drawCircle(mouse.locationEditorPosition.x, mouse.locationEditorPosition.y, this.eraserRadius)
      this.graphics.closePath()
    }
    if(this.tool === "circle-select") {
      this.graphics.lineStyle(2 * this.camera.currentZoom, 0xffffff, 1)
      this.graphics.drawCircle(mouse.locationEditorPosition.x, mouse.locationEditorPosition.y, this.circleSelectRadius * this.camera.currentZoom)
      this.graphics.closePath()
    }
  }
  updateHitboxesForDecorations() {
    this.gameObjects.decoration.forEach(obj => {
      let layerOffsetMultiplier = GameWorldWindow.layerCounterOffset[obj.layer] ?? 1
      obj.hitbox.positionOffset.x = this.camera.transform.position.x * layerOffsetMultiplier
      obj.hitbox.positionOffset.y = this.camera.transform.position.y * layerOffsetMultiplier
    })
  }
  drawBoxSelection() {
    if(this.boxSelection.active && this.boxSelection.endPoint.isnt(this.boxSelection.startPoint)) {
      this.graphics.lineStyle(2 * this.camera.currentZoom, colors.hitbox.shapeSelected, 1)
      this.graphics.drawRect(
        this.boxSelection.startPoint.x, 
        this.boxSelection.startPoint.y, 
        this.boxSelection.endPoint.x - this.boxSelection.startPoint.x, 
        this.boxSelection.endPoint.y - this.boxSelection.startPoint.y
      )
      this.graphics.closePath()
    }
  }
  drawSelectedObjects() {
    if(this.state.is("rotating")) return
    this.selected.forEach(obj => {
      Hitbox.drawBoundingBox(obj, this.graphics, this.camera.currentZoom)
    })
  }
  updateGridSpriteNew() {
    this.gridSprite.position.x = Math.floor((0-this.stage.position.x + cw/2) / grid.cellSize) * grid.cellSize - grid.cellSize*2
    this.gridSprite.position.y = Math.floor((0-this.stage.position.y + ch/2) / grid.cellSize) * grid.cellSize - grid.cellSize
  }
  update() {
    this.updateHitboxesForDecorations()
    this.updateCursorOverlays()
    this.drawSelectedObjects()
    this.drawBoxSelection()
    this.updateGridSpriteNew()
    this.updateLayers()

    if(this.state.is("scaling") && this.scalingBox) {
      /* draw the scaling origin */
      this.graphics.lineStyle(2 * this.camera.currentZoom, colors.hitbox.shapeSelected, 1)
      this.graphics.drawCircle(this.scalingBox.center.x, this.scalingBox.center.y, 4)
      this.graphics.closePath()
    }
  }
}