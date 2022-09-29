class LocationEditor extends GameWorldWindow {
  constructor(title, element) {
    super(title, element)
    this.app.view.classList.add("location-editor-app")
    this.cameraAnchor = {
      transform: new Transform()
    }
    this.contextWindow = Q('#location-editor-context-window')
    this.locPos = new Vector(0)
    this.state = new State(
      "default",
      "addingObj",
      "addingSpawn",
      "panning",
      "rotating",
      "draggingContextWindow",
      "paintingFog",
      "erasingFog",
    )
    this.tools = [
      "move",
      "select-object",
      "add-special",
      "rotate",
      "edit-hitbox",
      "addSpawn",
      "randomize-rotation",
      "moveSpawnsAlong",
      "fog-paint",
      "fog-eraser",
    ]
    this.specialObjects = [
      "randomSpawner", //select a spawn pool, add min and max spawns, add object weights, randomize velocity, rotation
      "locationRandomizer", //spawn one object, but let the game decide from multiple places where it can put it
      "interactable",
      "ultraportBeacon",
    ]
    this.selected = []
    this.dragged = null
    this.previousSelected = []
    this.selectDelay = 55
    this.activeObject = {
      // path: ["array", "of", "strings"],
      name: null,
      type: "object"
    }
    this.rotationData = {
      clickOrigin: new Vector(),
      angleStart: 0,
      angleNow: 0,
      pivot: new Vector(),
      orig: 0,
    }
    this.fogPlaced = 0
    this.fogRemoved = 0
    this.brushSpacing = 50
    this.eraserRadius = 50
    this.fog = []
    this.moveSpawnsAlong = false
    this.dropdown = this.element.querySelector(".search-dropdown-window")
    this.dropdownSpecial = this.element.querySelector(".special-dropdown-window")
    this.objSelector = this.element.querySelector(".selected-object-cont")
    this.camera.lockTo(this.cameraAnchor)
    this.generatedObjectList = false
    this.generateIcons()
    this.generateSpecialList()
    this.setTool(this.tools[0])
    this.addOrigin()
  }
  import() {
    let name = window.prompt("location name", "location001")
    this.objects = []
    readTextFile("data/locations/" + name + ".json", (text) => {
      let loc = JSON.parse(text)
      this.locationName = loc.name
      this.locPos = new Vector(loc.pos.x, loc.pos.y)
      loc.objects.forEach(obj => {
        let newobj
        let pos = new Vector(obj.pos.x, obj.pos.y)
        let vel = new Vector(obj.vel.x, obj.vel.y)
        let rotation = obj.transform.rotation
        let angularVelocity = obj.transform.angularVelocity
        console.log(`hitboxes aren't saved correctly, only references to json files work so far`)
        if(obj.type === "ship") newobj = new Ship(pos, vel, rotation, angularVelocity, obj.name)
        if(obj.type === "asteroid") newobj = new Asteroid(pos, vel, rotation, angularVelocity, obj.name)
        if(obj.type === "debris") newobj = new Debris(pos, vel, rotation, angularVelocity, obj.name)

        if(newobj) {
          this.objects.push(newobj)
          newobj.addToStage(this.stage)
        }
      })
      this.loadFog(loc.fog)
      Q('#location-editor-name').innerText = this.locationName
    })
  }
  export() {
    let loc = {}
    loc.name = this.locationName
    loc.pos = this.locPos.plain()
    loc.fog = this.fog.map(f => {
      return {
        pos: {
          x: f.position.x, 
          y: f.position.y
        },
        alpha: f.alpha,
      }
    })
    console.log(loc.fog)
    loc.objects = []
    this.objects.forEach(obj => {
      let newobj = {
        pos: {x: obj.pos.x, y: obj.pos.y},
        vel: {x: obj.vel.x, y: obj.vel.y},
        rotation: obj.rotation,
        angularVelocity: obj.angularVelocity,
        name: obj.name,
        dataref: obj.dataref, //absolutely disgusting
      }
      if(obj instanceof Ship) newobj.type = "ship"
      if(obj instanceof Asteroid) newobj.type = "asteroid"
      if(obj instanceof Debris) newobj.type = "debris"
      if(obj instanceof Interactable) newobj.type = "debris"
      loc.objects.push(newobj)
    })
    exportToJsonFile(loc, "location001")
  }
  newLocation() {
    this.objects.forEach(obj => obj.destroy())
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
  addOrigin() {
    this.origin = PIXI.Sprite.from("assets/origin.png")
    this.origin.anchor.x = 0.5
    this.origin.anchor.y = 0.5
    this.stage.addChild(this.origin)
  }
  generateIcons() {
    this.tools.forEach(t => {
      let cont = El('div', "tool-cont")
      let icon = El('div', "tool-icon " + t)
      cont.append(icon)
      cont.onclick = () => {
        this.setTool(t)
      }
      cont.title = t.replaceAll('-', " ").replaceAll("_", " ").cap()
      cont.dataset.toolname = t
      Q('#location-editor-toolset').append(cont)
    })
  }
  generateSpecialList() {
    console.warn("generateSpecialList() merge with generateObjectList() and ")
    let list = this.element.querySelector(".special-dropdown-window .dropdown-list")
    this.specialObjects.forEach(obj => {
      let el = El("div", "dropdown-item special", undefined, obj.replaceAll("_", ' ').cap())
      el.dataset.name = obj
      el.dataset.type = obj
      list.append(el)
    })
  }
  generateObjectList() {
    console.warn("generateObjectList() needs refactor")
    let list = this.element.querySelector(".search-dropdown-window .dropdown-list")
    let d = []
    let keys = [] 
    let paths = []
    let names = []
    let types = []

    for(let key in data.ship) {
      d.push(data.ship[key])
      keys.push(key)
      paths.push("ship" + "." + key)
      names.push(key)
      types.push("ship")
    }
    for(let key in data.asteroid) {
      d.push(data.asteroid[key])
      keys.push(key)
      paths.push("asteroid" + "." + key)
      names.push(key)
      types.push("asteroid")
    }
    for(let key in data.debris) {
      d.push(data.debris[key])
      keys.push(key)
      paths.push("debris" + "." + key)
      names.push(key)
      types.push("debris")
    }

    d.forEach((d, index) => {
      if(debug.locationEditor) console.log(d)
      let img = new Image(); img.src = d.sources.folder + "thumbnail.png"
      img.style.position = "absolute"
      let cont = El('div', "dropdown-item object", [["title", "Add to location"]])
      let name = keys[index].replaceAll("_", ' ').cap()
      let desc = El('div', "dropdown-desc", undefined, name) 
      let imageCont = El('div', "dropdown-image")
      imageCont.append(img)
      // cont.dataset.path = paths[index]
      cont.dataset.name = names[index]
      cont.dataset.type = types[index]
      cont.append(imageCont, desc)
      list.append(cont)
    })

    if(debug.locationEditor) console.log(d)
    this.generatedObjectList = true
  }
  setTool(name) {
    let tool = this.tools.find(t => t === name)
    if(tool) {
      this.prevTool = this.tool
      this.tool = tool
      Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
      this.element.querySelector('[data-toolname="' + tool + '"').classList.add('active')
      if(tool !== "select-object") this.dropdown.classList.add("hidden")
      if(tool !== "add-special") this.dropdownSpecial.classList.add("hidden")
      this.state.set("default")
    }
  }
  revertTool() {
    this.setTool(this.prevTool)
    if(this.tool === "select-object") this.state.set("addingObj")
    if(this.tool === "add-special") this.state.set("addingObj")
  }
  contextWindowOpen() {
    if(this.selected.length > 1) return
    let obj = this.selected[0]
    this.contextWindow.classList.remove('hidden')
  }
  contextWindowClose() {
    this.contextWindow.classList.add('hidden')
  }
  contextWindowRefresh() {
    if(this.selected.length !== 1) return
    let obj = this.selected[0]
    Array.from(this.contextWindow.querySelectorAll(".temp")).forEach(prop => prop.remove())

    const createProp = (prop) => {
      let cont = El("div", "property temp")
      let key = El("div", "key", undefined, prop + ": ")
      let value = El("div", "value", undefined, obj[prop])
      cont.dataset.property = prop
      cont.dataset.datatype = typeof obj[prop]
      cont.append(key, value)
      this.contextWindow.append(cont)
    }
    if(obj instanceof RandomSpawner) {
      let props = ["radius", "spawnsMin", "spawnsMax"]
      props.forEach(prop => createProp(prop))
      obj.objects.forEach(o => {
        obj.generateThumbnail(o.type, o.name, o.src)
      })
    }
    if(obj instanceof RandomSpawnerSpawn) {
      let props = ["weight"]
      props.forEach(prop => createProp(prop))
    }
    if(obj instanceof Asteroid) {
      let props = ["rotation", "angularVelocity"]
      props.forEach(prop => createProp(prop))
    }
    if(obj instanceof Ship) {
      let props = ["rotation", "angularVelocity", "pilot"]
      props.forEach(prop => createProp(prop))
    }
    if(obj instanceof Interactable) {
      let props = ["radius"]
      props.forEach(prop => createProp(prop))
    }
    
  }  
  addObject(name, type) {
    let pos = mouse.locationEditorPosition.clone()
    let vel = new Vector(0,0)
    let rotation = 0
    let angularVelocity = 0
    if(this.randomizeRotation) rotation = Math.random() * PI*2
    let obj = GameObject.create(
      type,
      name, 
      {
        pos: pos, 
        vel: vel, 
        rotation: rotation, 
        angularVelocity: angularVelocity 
      }, {world: this})
  }
  addSpecial() {
    throw "Don't use addSpecial()"
    if(this.activeObject.type !== "special") return
    let pos = mouse.locationEditorPosition.clone()
    let object = GameObject.create("specialObject", this.activeObject.name, {pos: pos})
    // if(this.activeObject.name === "locationRandomizer") {
    //   object = new LocationRandomizer(pos)
    // }
    // if(this.activeObject.name === "interactable") {
    //   object = new Interactable(pos, new BoxHitbox(300, 300), ["showHint"], ["hideHint"], "Investigate", null)
    // }
    // if(this.activeObject.name === "randomSpawner") {
    //   object = new RandomSpawner(pos, {type: "circle", radius: 50}, 250)
    // }
    // if(this.activeObject.name === "ultraportBeacon") {
    //   object = new UltraportBeacon(pos)
    // }
    if(!object) throw "No object was chosen by addSpecial()"
  }
  selectObj(obj) {
    if(this.selected.find(o => o === obj)) return
    setTimeout(()=> 
    {
      this.selected.push(obj)
      if(debug.locationEditor) console.log('selected obj', obj)
      this.contextWindowRefresh()
    },
    this.selectDelay)
  }
  deselectObj(obj) {
    this.selected = this.selected.filter(o => o !== obj)
    if(debug.locationEditor) console.log("deselected obj", obj)
  }
  reselect() {
    this.selected = [...this.previousSelected]
  }
  selectAll() {
    this.deselectAll()
    this.objects.forEach(obj => this.selectObj(obj))
    this.previousSelected = [...this.selected]
  }
  deselectAll() {
    this.selected = []
  }
  resetRotation() {
    console.log('f')
    this.selected.forEach(o => o.rotation = 0)
  }
  deleteSelected() {
    let objs = this.selected
    this.deselectAll()
    objs.forEach(obj => obj.destroy())
    this.objects = this.objects.filter(obj => 
      objs.find(o => o === obj) == null
    )
  }
  duplicateSelected() {
    let duplicates = []
    this.selected.forEach(obj => {
      let newobj
      if(obj instanceof Ship) newobj = new Ship(obj.pos.clone(), obj.vel.clone(),obj.rotation, obj.angularVelocity, obj.name)
      if(obj instanceof Asteroid) newobj = new Asteroid(obj.pos.clone(), obj.vel.clone(),obj.rotation, obj.angularVelocity, obj.name)
      newobj.pos.x += 50
      newobj.pos.y += 50
      newobj.addToStage(this.stage)
      this.objects.push(newobj)
      duplicates.push(newobj)
    })
    this.deselectAll()
    duplicates.forEach(dup => this.selectObj(dup))
    setTimeout(()=> {this.previousSelected = [...this.selected]}, this.selectDelay + 10)
  }
  addFog(
    alpha = clamp(mouse.pressure * 3, 0.2, 1.0),
    position = mouse.locationEditorPosition.clone(),
    fromFile = false,
  ) {
    if(!fromFile && mouse.travelled < Math.floor(this.fogPlaced) * this.brushSpacing) return
    let fog = PIXI.Sprite.from("assets/fogDab.png")
    fog.position.set(position.x, position.y)
    fog.anchor.set(0.5)
    fog.alpha = alpha
    fog.rotation = rand(0, TAU)
    fog.scale.set(0.5 + alpha)
    this.stage.addChild(fog)
    this.fog.push(fog)
    this.fogPlaced++
  }
  removeFog() {
    if(mouse.travelled < Math.floor(this.fogRemoved) * this.brushSpacing) return
    let pos = mouse.locationEditorPosition.clone()
    for(let i = 0; i < this.fog.length; i++) {
      let f = this.fog[i]
      let vec = new Vector(f.position.x, f.position.y)
      if(vec.isClose(this.eraserRadius, pos)) {
        this.fog.remove(f)
        this.stage.removeChild(f)
        break
      }
    }
    this.fogRemoved++
  }
  loadFog(fogArray) {
    fogArray.forEach(f => {
      this.addFog(f.alpha, f.pos, true)
    })
  }
  //#region input handlers
  handleKeydown(event) {
    if(event.code === "Escape" && (keys.shift || keys.shiftRight)) this.reselect()
    else if(event.code === "Escape") this.deselectAll()

    if(event.code === "KeyD") this.duplicateSelected()
    if(event.code === "KeyV") this.setTool("move")
    if(event.code === "KeyR" && !keys.alt) this.setTool("rotate")
    if(event.code === "KeyR" && keys.alt) this.resetRotation()
    if(event.code === "KeyS") this.setTool("select-object")
    if(event.code === "KeyX") this.deleteSelected()
    if(event.code === "KeyA") this.selectAll()
    if(event.code === "KeyE") this.contextWindowOpen()
    if(event.code === "KeyN") this.state.set("addingSpawn")
  }
  handleKeyup(event) {

  }
  handleMousemove(event) {
    let localMoved = mouse.clientMoved.clone().mult(this.camera.currentZoom)
    if(this.state.is("panning")) {
      this.cameraAnchor.pos.sub(localMoved)
      // console.log(this.camera.pos)
    }
    if(this.tool === "move" && this.selected.length > 0 && mouse.keys.left && this.state.isnt("draggingContextWindow")) {
      this.selected.forEach(obj => {
        obj.pos.add(localMoved)
        if(obj instanceof LocationRandomizer && this.moveSpawnsAlong) {
          obj.spawns.forEach(spawn => spawn.pos.add(localMoved))
        }
        if(obj instanceof RandomSpawner) {
          obj.objects.forEach(o => o.pos.add(localMoved))
        }
      })
    }
    if(this.state.is("draggingContextWindow")) {
      let left = this.contextWindow.getBoundingClientRect().x
      let top = this.contextWindow.getBoundingClientRect().y
      this.contextWindow.style.left = (left + mouse.clientMoved.x) + "px"
      this.contextWindow.style.top = (top + mouse.clientMoved.y) + "px"
    }
    if(this.state.is("rotating")) {
      if(this.selected.length === 1) {
        let pos = mouse.locationEditorPosition.clone()
        let obj = this.selected[0]
        let angle = Math.atan2(pos.y - obj.pos.y, pos.x - obj.pos.x)
        let result = angle - this.rotationData.angleStart
        obj.rotation = this.rotationData.orig + result
      }
      if(this.selected.length > 1) {
        let pos = mouse.locationEditorPosition.clone()
        let pivot = this.rotationData.pivot
        let angle = Math.atan2(pos.y - this.rotationData.pivot.y, pos.x - this.rotationData.pivot.x)
        let result = angle - this.rotationData.angleStart
        this.rotationData.angleStart = angle
        console.log(pos, pivot, angle, result)
        this.selected.forEach(obj => {
          obj.pos.rotateAround(pivot, result)
        })
      }
      //i tried making rotation snap to 90deg intervals
      // if(keys.shift || keys.shiftRight) obj.rotation = this.rotationData.orig + Math.floor((result*180/PI)/90) * 90
    }
    if(this.state.is("paintingFog")) this.addFog()
    if(this.state.is("erasingFog")) this.removeFog()
  }
  handleMousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".tool-icon.select-object")) {
        let el = target.closest(".tool-cont")
        let rect = el.getBoundingClientRect()
        
        this.dropdown.style.left = rect.x + "px"
        this.dropdown.style.top = rect.y + rect.height + 10 + "px"
        this.dropdown.classList.toggle("hidden")

        if(this.dropdown.classList.contains("hidden")) setTimeout(()=>{ this.setTool("move")},100)
        else setTimeout(()=>{this.dropdown.querySelector("input").focus()},100)

        if(!this.generatedObjectList) this.generateObjectList()
      } 
      if(target.closest(".drag-widget")) {
        let dragged = target.closest(".draggable")
        this.state.set("draggingContextWindow")
      }
      if(target.closest(".thumbnail-container .icon-close-top-right")) {
        if(!(this.selected[0] instanceof RandomSpawner)) return
        let container = target.closest(".context-window-thumbnail")
        let obj = this.selected[0].objects.find(obj => obj.type === container.dataset.type && obj.name === container.dataset.name)
        obj.destroy()
      }
      if(target.closest(".tool-icon.add-special")) {
        let el = target.closest(".tool-cont")
        let rect = el.getBoundingClientRect()
        
        this.dropdownSpecial.style.left = rect.x + "px"
        this.dropdownSpecial.style.top = rect.y + rect.height + 10 + "px"
        this.dropdownSpecial.classList.toggle("hidden")
      }
      if(target.closest(".tool-icon.edit-hitbox")) {
        if(this.selected.length > 0) {
          let obj = this.selected[0]
          program.windows.close()
          program.windows.set(hitboxEditor)
          hitboxEditor.select(obj)
        }
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
      if(target.closest(".dropdown-item.object")) {
        let item = target.closest(".dropdown-item.object")
        // let path = item.dataset.path.split(".")
        this.activeObject.type = item.dataset.type
        this.activeObject.name = item.dataset.name
        // this.activeObject.path = path
        this.dropdown.classList.add("hidden")
        let imgCont = item.querySelector(".dropdown-image").cloneNode(true)
        Array.from(imgCont.children).forEach(img => img.style = "")
        imgCont.classList.replace("dropdown-image", "selected-object-icon")
        let text = item.querySelector(".dropdown-desc").innerText
        let desc = El("div", "selected-object-desc", undefined, text)
        this.objSelector.innerHTML = ""
        this.objSelector.append(imgCont, desc)

        this.state.set("addingObj")
      }
      if(target.closest(".property .value")) {
        let prop = target.closest(".property").dataset.property
        let datatype = target.closest(".property").dataset.datatype
        let newval = window.prompt("Enter new value for " + prop, this.selected[0][prop])
        if(datatype === "number") this.selected[0][prop] = +newval
        if(datatype === "string") this.selected[0][prop] = newval
        mouse.keys.left = false
        this.contextWindowRefresh()
      }
      if(target.closest(".context-window-thumbnail")) {
        let cont = this.contextWindow.querySelector(".object-properties")
        //if basically this is RandomSpawnerSpawn, then we generate some specific properties
      }
      if(target.closest(".dropdown-item.special")) {
        this.activeObject.type = target.closest(".dropdown-item.special").dataset.type
        this.activeObject.name = target.closest(".dropdown-item.special").dataset.name
        this.state.set("addingObj")
        this.dropdownSpecial.classList.add("hidden")
      }
      if(target === this.element && this.state.is("addingObj")) {
        let hit = false
        this.gameObjects.all.forEach(obj => {
          if(!(obj instanceof LocationRandomizer) && !(obj instanceof RandomSpawner)) return
          if(Collision.pointCircle(mouse.locationEditorPosition, obj.hitbox)) {
            if(obj instanceof LocationRandomizer) {
              hit = true
              obj.setObject(this.activeObject.type, this.activeObject.name)
            }
            if(obj instanceof RandomSpawner) {
              hit = true
              obj.addObject(this.activeObject.type, this.activeObject.name, 0, 0, 1)
            }
          }
        })
        if(!hit) this.addObject(this.activeObject.name, this.activeObject.type)
      }
      if(target.closest('.icon-export')) {
        this.export()
      }
      if(target.closest('.icon-import')) {
        this.import()
      }
      if(target === this.element) {
        if(this.tool === "move") {
          let hit = false
          let pos = mouse.locationEditorPosition.clone()
          // this.objects.forEach(obj => {
          //   if(hit) return
          //   if(obj.hitbox.type === "circle") {
          //     if(Collision.pointCircle(pos, obj.hitbox)) hit = true
          //   }
          //   if(obj.hitbox.type === "polygon") {
          //     obj.hitbox.bodies.forEach(body => {
          //       if(Collision.polygonPoint(body, pos)) hit = true
          //     })
          //   }
          //   if(obj.hitbox.type === "box") {
          //     if(Collision.boxPoint(obj.hitbox.bb, pos)) hit = true
          //   }
          //   if(hit) {
          //     if(!(keys.shift || keys.shiftRight) && !this.previousSelected.find(o => o === obj)) this.deselectAll()
          //     this.selectObj(obj)
          //   }
          // })
          this.gameObjects.all.forEach(obj => {
            if(hit) return
            if(!obj.hitbox) return
            if(Collision.auto(pos, obj.hitbox)) hit = true
            if(hit) {
              if(!(keys.shift || keys.shiftRight) && !this.previousSelected.find(o => o === obj)) this.deselectAll()
              this.selectObj(obj)
            }
          })
        }
        if(this.tool === "addSpawn") {
          if(!(this.selected[0] instanceof LocationRandomizer) || this.selected.length > 1) return
          this.selected[0].addSpawn(mouse.locationEditorPosition)
        }
        if(this.tool === "rotate") {
          if(this.selected.length === 0) return
          this.state.set("rotating")
          this.rotationData.clickOrigin = mouse.locationEditorPosition.clone()
          if(this.selected.length === 1) {
            let pos = this.rotationData.clickOrigin
            let obj = this.selected[0]
            this.rotationData.angleStart = Math.atan2(pos.y - obj.pos.y, pos.x - obj.pos.x)
            this.rotationData.orig = obj.rotation
          }
          else {
            let pos = this.rotationData.clickOrigin
            let positions = this.selected.map(s => s.pos)
            let pivot = Vector.avg(...positions)
            this.rotationData.pivot = pivot
            this.rotationData.angleStart = Math.atan2(pos.y - pivot.y, pos.x - pivot.x)
          }

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
      this.state.set("panning")
    }
  }
  handleMouseup(event) {
    if(this.state.is("panning", "rotating", "draggingContextWindow", "paintingFog", "erasingFog")) {
      this.state.revert()
    }
    this.fogPlaced = 0
    this.fogRemoved = 0
    // this.objects.forEach(obj => {
    //   let hit = false
    //   let pos = mouse.clientPos.clone().sub(new Vector(this.stage.position.x, this.stage.position.y))
    //   if(obj.hitbox.type === "circle") {
    //     if(Collision.pointCircle(pos, obj.hitbox)) {
    //       if(mouse.clientClickOrigin.isClose(2, mouse.clientClickEnd)) hit = true
    //     }
    //   }
    //   if(obj.hitbox.type === "polygon") {
    //     obj.hitbox.bodies.forEach(body => {
    //       if(Collision.polygonPoint(body, pos)) {
    //         if(mouse.clientClickOrigin.isClose(2, mouse.clientClickEnd)) hit = true
    //       }
    //     })
    //   }
    //   if(hit && this.previousSelected.find(o => o === obj)) {
    //     this.deselectObj(obj)
    //     if(debug.locationEditor) console.log("removed because it was selected previously")
    //   }
    // })
    this.gameObjects.all.forEach(obj => {
      if(!obj.hitbox) return
      let hit = false
      let pos = mouse.clientPos.clone().sub(new Vector(this.stage.position.x, this.stage.position.y))
      if(
        Collision.auto(pos, obj.hitbox) 
        && 
        mouse.clientClickOrigin.isClose(2, mouse.clientClickEnd)
      ) {
        hit = true
      }
      if(hit && this.previousSelected.find(o => o === obj)) {
        this.deselectObj(obj)
      }
    })
    this.previousSelected = [...this.selected]
  }
  handleClick(event) {

  }
  handleWheel(event) {
    if(event.deltaY < 0) {
      this.camera.zoomInit("in")
    }
    else
    if(event.deltaY > 0) {
      this.camera.zoomInit("out")
    }
  }
  //#endregion
  updateCursorOverlays() {
    let mpos = mouse.locationEditorPosition.clone()
    if(this.tool === "fog-eraser") {
      this.graphics.lineStyle(2, 0xffffff, 1);
      this.graphics.drawCircle(mpos.x, mpos.y, this.eraserRadius)
      this.graphics.closePath();
    }
  }
  update() {
    this.updateCursorOverlays()
    this.selected.forEach(obj => {
      Hitbox.drawBoundingBox(obj, this.graphics)
      if(obj instanceof RandomSpawner) {
        this.graphics.lineStyle(2, debug.colors.hitboxNoCollision, 1);
        this.graphics.drawCircle(obj.pos.x, obj.pos.y, obj.radius)
        this.graphics.closePath();
      }
    })
    // this.objects.forEach(obj => {
    //   Hitbox.draw(obj, this.graphics)
    //   if(obj instanceof LocationRandomizer) obj.spawns.forEach(spawn => Hitbox.draw(spawn, this.graphics))
    // })
    this.gridSprite.position.x = Math.floor((0-this.stage.position.x + cw/2) / grid.cellSize) * grid.cellSize - grid.cellSize*2
    this.gridSprite.position.y = Math.floor((0-this.stage.position.y + ch/2) / grid.cellSize) * grid.cellSize - grid.cellSize
  }
}