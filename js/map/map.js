class WorldMap extends GameWorldWindow {
  constructor(title, element) {
    super(title, element)
    this.resolution = 1024
    //this hardcoded value is terrible, it represents the 95vh used in the CSS
    this.physicalSize = window.innerHeight * 0.95 
    this.app.view.id = "map-canvas"
    let visualScaleFactor =  this.resolution / window.innerHeight * 0.95
    this.state = new State(
      "default",
      "movingLocation",
      "movingImage",
    )
    this.tools = [
      "move",
      "add-sprite",
      "lock-sprite",
      "lock-icon",
    ]
    this.locked = {
      sprites: false,
      icons: false
    }
    this.images = []
    this.selected = []
    this.open = false

    this.createHtml()
    this.generateToolIcons()
    this.addOrigin()
    this.addGrid()
    this.load()
  }
  setTool(name) {
    let tool = this.tools.find(t => t === name)
    if(tool) {
      this.tool = tool
      Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
      this.element.querySelector(`[data-toolname="${tool}"`).classList.add('active')
      this.state.set("default")
    }
  }
  generateToolIcons() {
    this.tools.forEach(t => {
      let cont = El('div', "tool-cont")
      let icon = El('div', "tool-icon " + t)
      cont.append(icon)
      cont.onclick = () => {
        this.setTool(t)
      }
      cont.title = capitalize(t.replaceAll('-', " "))
      cont.dataset.toolname = t
      Q('#map-toolset').append(cont)
    })
  }
  load() {
    readTextFile("data/worldmapData.json", function(text) {
      let images = JSON.parse(text)
      images.forEach(img => {
        GameObject.create("mapImage", img.name, {transform: new Transform(), scale: img.scale})
        // new MapImage(
        //   new Transform(
        //     new Vector(img.transform.position.x, img.transform.position.y), 
        //     new Vector(),
        //     img.rotation, 
        //     img.angularVelocity
        //   ),
        //   img.src, 
        //   img.scale
        //   )
      })
    })
  }
  save() {
    let coords = {}
    this.icons.forEach(icon => {
      coords[icon.name] = icon.transform.position.plain()
      coords[icon.name].type = icon.type
    })
    let mapObjects = []
    this.images.forEach(img => {
      let record = {
        src: img.src,
        pos: img.transform.position.plain(),
        rotation: img.rotation,
        angularVelocity: img.angularVelocity,
        scale: img.scale
      }
      mapObjects.push(record)
    })
    exportToJsonFile(coords, "locationCoordinates")
    exportToJsonFile(mapObjects, "worldmapData")
  }
  addOrigin() {
    this.origin = {
      transform: new Transform(),
      sprite: new PIXI.Sprite.from("assets/origin.png"),
    }
    this.origin.sprite.position.set(this.origin.transform.position.x, this.origin.transform.position.y)
    this.origin.sprite.anchor.set(0.5)
    this.app.stage.addChild(this.origin.sprite)
  }
  addGrid() {
    this.gridSprite = new PIXI.TilingSprite(mapGrid.texture, 
      4096,
      4096,
    )
    this.gridSprite.anchor.set(0.5)
    this.stage.addChild(this.gridSprite)
  }
  createHtml() {
    this.element.prepend(this.app.view)
  }
  createIcons() {
    // this.icons = []
    for(let locationName in data.locationCoords) {
      GameObject.create("mapIcon", locationName, {location: data.locationCoords[locationName]})
      // new MapIcon(data.locationCoords[locationName], locationName)
    }
  }
  duplicate() {
    this.selected.forEach(obj => {
    let newobj
    if(obj instanceof MapIcon) newobj = new MapIcon(
      obj, 
      obj.name
    )
    if(obj instanceof MapImage) newobj = new MapImage(
      obj.img.src, 
      obj.transform.position, 
      obj.transform.rotation, 
      obj.transform.angularVelocity, 
      obj.scale
    )
    newobj.transform.position.x += 30
    newobj.transform.position.y += 30
  })
  }
  select(obj) {
    if(!(keys.shift || keys.shiftRight)) this.selected = []
    if(this.selected.find(i => i === obj)) return
    this.selected.push(obj)
  }
  deselectAll() {
    this.selected = []
  }
  renameSelected() {
    this.selected.forEach(icon => {
      icon.updateName(window.prompt("Rename", icon.name))
    })
  }
  deleteSelected() {
    this.selected.forEach(obj => {
      obj.destroy()
    })
    this.deselectAll()
  }
  addSprite() {
    let sources = window.prompt("Sprite name", "nebula1")
    if(sources) sources = sources.replaceAll(" ", "").split(",")
    if(sources.length === 0) return
    sources.forEach(src => {
      new MapImage("assets/map/" + src + ".png", new Vector(0), 0, 0)
    })
  }
  zoom(direction = "in" || "out") { 
    if(!this.camera.zoom.active) {
      this.icons.forEach(icon => {
        if(direction === "in") icon.hitbox.radius -= icon.hitbox.radius * (1 -this.camera.zoomStep)
        if(direction === "out") icon.hitbox.radius += icon.hitbox.radius * (1 -this.camera.zoomStep)
      })
    }
    this.camera.zoomInit(direction)
  }
  handleKeydown(event) {
    if(this.state.is("default")) {
      if(event.code === "KeyE") this.save()
      if(event.code === "KeyD") this.duplicate()
      if(event.code === "KeyA" && keys.shift) this.addSprite()
      if(event.code === "KeyR") this.renameSelected()
      if(event.code === "KeyX") this.deleteSelected()
      if(event.code === "Escape") this.deselectAll()
      if(event.code === "NumpadAdd") this.selected.forEach(obj => obj.scaleUp())
      if(event.code === "NumpadSubtract") this.selected.forEach(obj => obj.scaleDown())
    }
  }
  handleKeyup(event) {

  }
  handleMousemove(event) {
    if(!mouse.keys.middle) {
      this.icons.forEach(icon => {
        if(Collision.pointCircle(mouse.mapPosition, icon.hitbox)) {
          icon.hover = true
          icon.showText()
        }
        else {
          icon.hover = false
          icon.hideText()
        }
      })
    }
    if(mouse.keys.middle) {
      let moved = mouse.clientMoved.clone().mult(this.camera.currentZoom)
      this.focus.transform.position.sub(moved)
    }
    if(mouse.keys.left) {
      if(this.state.is("movingLocation")) {
        this.selected.forEach(obj => {
          let moved = mouse.clientMoved.clone().mult(this.camera.currentZoom)
          obj.transform.position.add(moved)
        })
      }
      if(this.state.is("movingImage")) {
        this.selected.forEach(obj => {
          let moved = mouse.clientMoved.clone().mult(this.camera.currentZoom)
          obj.transform.position.add(moved)
        })
      }
    }
  } 
  handleMousedown(event) {
    let target = event.target
    if(event.button === 0) {
      let match = false
      if(!(keys.shift || keys.shiftRight)) this.deselectAll()
      this.icons.forEach(icon => {
        if(this.locked.icons) return
        if(Collision.pointCircle(mouse.mapPosition, icon.hitbox)) {
          this.select(icon)
          match = true
          this.state.set("movingLocation")
        }
      })
      this.images.forEach(img => {
        if(this.locked.sprites) return
        if(Collision.boxPoint(img.hitbox.boundingBox, mouse.mapPosition)) {
          this.select(img) 
          match = true
          this.state.set("movingImage")
        }
      })
      if(!match) this.deselectAll()
      if(keys.ctrl) {
        this.createIcon()
      }
      if(target.closest(".tool-icon.add-sprite")) {
        this.addSprite()
      }
      if(target.closest(".tool-icon.lock-sprite")) {
        target.closest(".tool-icon.lock-sprite").classList.toggle('active')
        this.locked.sprites = !this.locked.sprites
        setTimeout(()=>{this.setTool("move")},100)
      }
      if(target.closest(".tool-icon.lock-icon")) {
        target.closest(".tool-icon.lock-icon").classList.toggle('active')
        this.locked.icons = !this.locked.icons
        setTimeout(()=>{this.setTool("move")},100)
      }
    }
  }
  handleMouseup(event) {
    this.state.set('default')
  }
  handleClick(event) {

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
      }
      else
      if(event.deltaY < 0) {
        this.zoom("in")
      }
    }
  }
    
  updateObjects() {
    this.gameObjects.mapIcon.forEach(icon => {
      icon.container.scale.set(this.camera.currentZoom * (icon.hover / 4 + 1))
      icon.container.position.set(icon.transform.position.x, icon.transform.position.y)
      icon.hitbox.transform.position.setFrom(icon.transform.position)
    })
    this.gameObjects.mapImage.forEach(img => {
      img.container.position.set(img.transform.position.x, img.transform.position.y)
      img.hitbox.transform.position.setFrom(img.transform.position)
    })
  }
  update() {
    this.selected.forEach(obj => {
      HitboxTools.drawBoundingBox(obj)
    })
    this.updateObjects()
    this.images.forEach(img => img.update())
  }
}