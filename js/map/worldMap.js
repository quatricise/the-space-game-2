class WorldMap extends GameWorldWindow {
  constructor() {
    super("WorldMap", Q('#world-map'))
    this.app.view.id = "map-canvas"
    this.app.view.width = window.innerWidth
    this.app.view.height = window.innerHeight

    this.state = new State(
      "default",
      "panning",
      "movingObject",
    )
    this.tools = [
      "move",
      "add-star-system",
      "add-star-system-outback",
      "add-sprite",
      "lock-icon",
      "lock-sprite",
      "toggle-window-mode"
    ]

    this.editMode = new State(
      false,
      true,
    )

    this.locked = {
      mapImage: false,
      mapIcon: false,
      mapLabel: false,
    }
    this.images = []
    this.selected = []

    this.createHtml()
    this.generateToolIcons()
    this.createOrigin()
    this.modifyCamera()
  }
  show() {
    this.element.classList.remove("hidden")
    gameUI.beginUIHintSequence("map")
  }
  generateToolIcons() {
    this.tools.forEach(t => {
      let cont = El('div', "tool-cont dev-icon")
      let icon = El('div', "tool-icon " + t)
      cont.append(icon)
      cont.onclick = () => {
        this.setTool(t)
      }
      cont.title = t.replaceAll('-', " ").capitalize()
      cont.dataset.toolname = t
      Q('#map-toolset').append(cont)
    })
  }
  modifyCamera() {
    this.camera.zoomRange = [0.25, 1.25]
    this.camera.onZoomEnd = () => {
      this.adjustCameraBounds()
      this.gameObjects.mapIcon.forEach(icon => {
        if(this.camera.zoom.direction === "in") 
          icon.hitbox.radius = icon.hitbox.radiusDefault * this.camera.currentZoom
        if(this.camera.zoom.direction === "out") 
          icon.hitbox.radius = icon.hitbox.radiusDefault * this.camera.currentZoom
      })
    }
    this.adjustCameraBounds()
  }
  adjustCameraBounds() {
    /* bounds are adjusted according to camera zoom so you can pan to the edge when zoomed in */
    let multiplier = this.camera.zoomRange[1] - this.camera.currentZoom
    let xMultiplier = cw / ch
    let yMultiplier = ch / cw
    this.camera.bounds = {
      minX: -50  - (cw/2) * xMultiplier * multiplier,
      maxX:  50  + (cw/2) * xMultiplier * multiplier,
      minY: -500 - (ch/2) * yMultiplier * multiplier,
      maxY:  500 + (ch/2) * yMultiplier * multiplier,
    }
  }
  load() {
    readJSONFile("data/worldmapData.json", (text) => {
      let mapData = JSON.parse(text)
      mapData.forEach(obj => {
        GameObject.create(
          obj.type, 
          obj.name,
          {
            transform: Transform.fromPlain(obj.transform),
            scale: obj.scale,
            locationReference: obj.locationReference,
            text: obj.text,
            color: obj.color
          }, 
          {
            world: this
          }
        )
      })
    })
  }
  export() {
    let mapObjects = []
    this.gameObjects.mapImage.forEach(obj => {
      if(obj.name.includes("questOverlay")) return
      let plain = {
        name: obj.name,
        type: obj.type,
        transform: obj.transform.plain,
        scale: obj.scale
      }
      mapObjects.push(plain)
    })
    this.gameObjects.mapIcon.forEach(obj => {
      let plain = {
        name: obj.name,
        type: obj.type,
        transform: obj.transform.plain,
        locationReference: obj.locationReference,
      }
      mapObjects.push(plain)
    })
    this.gameObjects.mapLabel.forEach(obj => {
      let plain = {
        name: obj.name,
        type: obj.type,
        text: obj.text,
        color: obj.color,
        transform: obj.transform.plain,
        locationReference: obj.locationReference,
      }
      mapObjects.push(plain)
    })
    exportToJSONFile(mapObjects, "worldmapData")
  }
  createOrigin() {
    if(!debug.map) return
    this.origin = {
      transform: new Transform(),
      sprite: new PIXI.Sprite.from("assets/origin.png"),
    }
    this.origin.sprite.position.set(this.origin.transform.position.x, this.origin.transform.position.y)
    this.origin.sprite.anchor.set(0.5)
    this.app.stage.addChild(this.origin.sprite)
  }
  createHtml() {
    this.element.prepend(this.app.view)
  }
  addGrid() {
    this.gridSprite = new PIXI.TilingSprite(mapGrid.texture, 
      4096,
      4096,
    )
    this.gridSprite.anchor.set(0.5)
    this.stage.addChild(this.gridSprite)
  }
  //#region input
  handleKeydown(event) {
    if(this.state.is("default")) {
      if(event.code === "KeyE")                   this.export()
      if(event.code === "KeyD")                   this.duplicate()
      if(event.code === "KeyA" && keys.shift)     this.addMapImage()
      if(event.code === "KeyR")                   this.renameSelected()
      if(event.code === "KeyC")                   this.recolorSelected()
      if(event.code === "KeyX")                   this.deleteSelected()
      if(event.code === "Escape")                 this.deselectAll()
      if(event.code === "NumpadAdd")              this.selected.forEach(obj => obj.scaleUp())
      if(event.code === "NumpadSubtract")         this.selected.forEach(obj => obj.scaleDown())
      if(event.code === binds.openWorldMap)       gameManager.closeWindow()
    }
  }
  handleKeyup(event) {

  }
  handleMousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(this.editMode.is(true) && target === this.canvas) {
        let match = false
        let matchingObjects = []

        if(!(keys.shift || keys.shiftRight)) 
          this.deselectAll()

        this.gameObjects.gameObject.forEach(obj => {
          for(let key in this.locked)
            if(this.locked[key] && obj.type === key)
              return

          if(Collision.auto(mouse.mapPosition, obj.hitbox)) {
            matchingObjects.push(obj)
            match = true
            this.state.set("movingObject")
          }
        })


        if(match)
          this.select(GameObject.closestToPoint(mouse.mapPosition, ...matchingObjects))
        else
          this.deselectAll()
      }
      else
      if(this.editMode.is(false)) {
        
      }

      if(keys.ctrl) {
        this.createIcon()
      }
      if(target.closest(".tool-icon.add-sprite")) {
        this.addMapImage()
      }
      if(target.closest(".tool-icon.add-star-system")) {
        this.addMapIcon("connected")
      }
      if(target.closest(".tool-icon.add-star-system-outback")) {
        this.addMapIcon("outback")
      }
      if(target.closest(".tool-icon.toggle-window-mode")) {
        this.editMode.toggle()
        if(this.editMode.is(false))
          this.deselectAll()
        setTimeout(() => this.setTool("move"), 100)
      }
      if(target.closest(".tool-icon.lock-sprite")) {
        target.closest(".tool-icon.lock-sprite").classList.toggle('active')
        this.locked.mapImage = !this.locked.mapImage
        setTimeout(() => this.setTool("move"), 100)
      }
      if(target.closest(".tool-icon.lock-icon")) {
        target.closest(".tool-icon.lock-icon").classList.toggle('active')
        this.locked.mapIcon = !this.locked.mapIcon
        setTimeout(() => this.setTool("move"), 100)
      }
    }
  }
  handleMousemove(event) {
    if(mouse.keys.middle || (mouse.keys.left && this.editMode.is(false))) {
      this.pan()
    }
    else {
      this.gameObjects.mapIcon.forEach(icon => {
        if(Collision.auto(mouse.mapPosition, icon.hitbox)) {
          icon.hover = true
          icon.showText()
        }
        else {
          icon.hover = false
          icon.hideText()
        }
      })
    }

    if(mouse.keys.left) {
      if(this.state.is("movingObject")) {
        this.selected.forEach(obj => {
          let offsetVector = mouse.clientMoved.clone().mult(this.camera.currentZoom)
          obj.transform.position.add(offsetVector)
        })
      }
    }
  } 
  handleMouseup(event) {
    this.state.set('default')
  }
  handleClick(event) {
    if(this.mode.is("play") && this.editMode.is(false)) {
      this.gameObjects.mapIcon.forEach(icon => {
        if(Collision.vectorCircle(mouse.mapPosition, icon.hitbox)) {
          this.openStarSystemDetail(icon.locationReference)
        }
      })
    }
  }
  handleWheel(event) {
    if(mouse.keys.middle) return
    if(keys.shift || keys.shiftRight) {
      if(event.deltaY > 0) {
        this.selected.forEach(obj => obj.scaleUp())
      }
      else
      if(event.deltaY < 0) {
        this.selected.forEach(obj => obj.scaleDown())
      }
    }
    if(!(keys.shift || keys.shiftRight)) {
      if(event.deltaY > 0) {
        this.zoom("out")
        console.log("out")
      }
      else
      if(event.deltaY < 0) {
        this.zoom("in")
        console.log("in")
      }
    }
  }
  //#endregion
  setTool(name) {
    let tool = this.tools.find(t => t === name)
    if(!tool) return

    this.tool = tool
    Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
    this.element.querySelector(`[data-toolname="${tool}"`).classList.add('active')
    this.state.set("default")
  }
  duplicate() {
    this.selected.forEach(obj => {
      let newobj = GameObject.create(obj.type, obj.name, {
          transform: Transform.fromPlain(obj.transform.plain)
        },
        {
          world: this
        }
      )
      
      newobj.transform.position.x += 30
      newobj.transform.position.y += 30
      newobj.setScale(obj.scale)
    })
  }
  select(obj) {
    console.log("selecting object: ", obj)

    if(!(keys.shift || keys.shiftRight)) 
      this.selected = []
    if(this.selected.find(object => object === obj)) return
    this.selected.push(obj)
    console.log("after selection: ", this.selected)
  }
  deselectAll() {
    this.selected = []
  }
  renameSelected() {
    this.selected.forEach(obj => {
      obj.updateName(window.prompt("Rename", obj.name))
    })
  }
  recolorSelected() {
    this.selected.forEach(obj => {
      obj.updateColor(window.prompt("Rename", obj.color))
    })
  }
  deleteSelected() {
    this.selected.forEach(obj => {
      GameObject.destroy(obj)
    })
    this.deselectAll()
  }
  addMapImage() {
    let names = window.prompt("Sprite name", "nebula1") || ""
    if(names) 
      names = names.replaceAll(" ", "").split(",")
    if(names.length === 0) 
      return

    names.forEach(name => {
      if(data.mapImage[name] == null) return

      GameObject.create(
        "mapImage", 
        name, 
        {
          transform: new Transform()
        }, 
        {
          world: this
        }
      )
    })
    setTimeout(() => this.setTool("move"), 100)
  }
  addMapIcon(locationType) {
    let locationReference = window.prompt("Location reference: ", "")
    if(!locationReference) {
      setTimeout(() => this.setTool("move"), 100)
      return
    }

    GameObject.create(
      "mapIcon", 
      locationType, 
      {
        transform: new Transform(),
        locationReference
      }, 
      {
        world: this
      }
    )
    setTimeout(() => this.setTool("move"), 100)
  }
  zoom(direction = "in" || "out") { 
    if(this.camera.zoom.active) return
    this.camera.zoomInit(direction)
  }
  pan() {
    let 
    position = this.cameraAnchor.transform.position
    position.sub(mouse.mapMoved)
    position.clampWithinBounds(this.camera.bounds)
  }
  updateObjects() {
    this.gameObjects.mapIcon.forEach(icon => {
      /* the sprite is actually scaled down because it's a workaround for the imprecision of photoshop exporting wonky sprites */
      /* these icons rotate and they have to rotate nicely, therefore the sprite is originally 4 times larger the actual side */

      let scaleDownFactor = 0.25
      icon.sprite.container.scale.set((this.camera.currentZoom * (icon.hover / 4 + 1)) * scaleDownFactor)
      icon.sprite.container.position.set(icon.transform.position.x, icon.transform.position.y)
      icon.transform.position.setFrom(icon.transform.position)
    })
    this.gameObjects.mapImage.forEach(img => {
      img.sprite.container.position.set(img.transform.position.x, img.transform.position.y)
      img.transform.position.setFrom(img.transform.position)
    })
  }
  drawHitboxForSelected() {
    this.selected.forEach(obj => {
      Hitbox.drawBoundingBox(obj, this.graphics, this.camera.currentZoom)
    })
  }
  openStarSystemDetail(systemName) {
    gameManager.setWindow(starSystemDetail)
    starSystemDetail.updateDescription(systemName)
  }
  update() {
    this.drawHitboxForSelected()
    this.updateObjects()
    this.images.forEach(img => img.update())
  }
}