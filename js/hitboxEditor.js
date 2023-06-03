class HitboxEditor extends GameWorldWindow {
  constructor() {
    super("HitboxEditor",  Q('#hitbox-editor'))
    this.canvas = this.app.view
    this.object = null
    this.selectedShapes = []
    this.selectedHitbox = null
    this.selectedVertices = []
    this.controlPoints = []
    this.controlPointRadius = 7
    this.weaponSlots = []
    this.dockingPoints = []
    this.selectedWreckIndex = 0
    this.state = new State(
      "default",
      "definingWeaponSlots",
      "definingDockingPoints",
      "panning",
    )
    this.editMode = new State(
      "hitbox",
      "wreck"
    )
    this.tools = [
      "select",
      "pen-tool",
      "add-shape",
      "add-point",
      "remove-shape",
      "center-shape",
      "object-center",
      "object-cycle-rotation",
      "define-weapon-slots",
      "define-docking-points",
      "select-object",
      "return-to-stage",
      "edit-wreck"
    ]
    this.tool = "add-shape"
    this.generateIcons()
    this.searchBar = {
      cont: Q('#hitbox-editor-search-bar'),
      input: Q('#hitbox-editor-search-input'),
      show: () => {
        this.searchBar.cont.classList.remove('hidden')
        this.deselectAllShapes()
      },
      toggle: () => {
        if(this.searchBar.cont.classList.contains('hidden'))
          this.searchBar.show()
        else
          this.searchBar.hide()
        this.deselectAllShapes()
      },
      hide: () => {
        this.searchBar.cont.classList.add('hidden')
        this.deselectAllShapes()
      },
    }
    this.wreckEditToolbar = Q("#hitbox-editor-edit-wreck-toolbar")
    this.shape = {
      vertices: [],
      color: 0x9900ff,
      reset() {
        this.vertices = []
      },
    }
    this.modifyCamera()
  }
  modifyCamera() {
    this.camera.zoomRange = [0.1, 25]
    this.camera.zoomStep = 0.9
    this.camera.zoom.duration = 10
  }
  generateIcons() {
    this.tools.forEach(t => {
      let cont = El('div', "tool-cont")
      let icon = El('div', "tool-icon " + t)
      cont.append(icon)
      cont.onclick = () => this.setTool(t)
      cont.title = t.replaceAll('-', " ").capitalize()
      cont.dataset.toolname = t
      Q('#hitbox-editor-toolset').append(cont)
    })
  }
  exportHitbox() {
    let data = {}
    data.type = this.object.hitbox.type
    data.color = this.object.hitbox.color
    data.bodies = this.object.hitbox.definition
    exportToJSONFile(data)
  }
  exportWreckHitboxVault() {
    let vault = this.object.wreckHitboxVault.hitboxes.map(hitbox => {
      let h = {
        type: hitbox.type,
        color: hitbox.color,
        bodies: hitbox.definition
      }
      return h
    })
    exportToJSONFile(vault)
  }
  consoleLogWeaponSlots() {
    let string = `weaponSlots: [`
    this.weaponSlots.forEach(slot => {
      string += `{x:${slot.x},y:${slot.y}},`
    })
    string += `],`
    console.log(string)
  }
  consoleLogDockingPoints() {
    let string = `dockingPoints: [`
    this.dockingPoints.forEach(point => {
      string += `{x:${point.x},y:${point.y}},`
    })
    string += `],`
    console.log(string)
  }
  setTool(name) {
    let tool = this.tools.find(t => t === name)
    if(!tool) throw "tool with name: " + name + "doesn't exist"

    this.tool = tool
    Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
    this.element.querySelector('[data-toolname="' + tool + '"').classList.add('active')
  }
  select(object) {
    if(!object) return

    this.deselect()

    //this step is important for returning the object to where it was
    object.previousStage = object.stage
    this.placeObjectInLayer(object)
    this.object = object
    object.transform.reset()
    this.refreshEditWreckToolbar(this.object.wreckHitboxVault?.hitboxes.length)
    this.setTool("select")
  }
  deselect() {
    if(!this.object) return

    //this basically means if the object was created inside this editor, destroy it
    if(this.object.previousStage === this.object.stage)
      GameObject.destroy(this.object)
    else {
      GameObject.addToStage(this.object, this.object.previousStage)
    }
    delete this.object.previousStage
    this.object = null
    this.dockingPoints = []
    this.weaponSlots = []
  }
  createEditWreckToolbarToolIcon(index) {
    let icon = El("div", "toolbar-icon", [["title", "Edit wreck part " + index]])
        icon.dataset.wreckindex = index
    this.wreckEditToolbar.append(icon)
  }
  openEditWreckToolbar() {
    this.wreckEditToolbar.classList.remove("hidden")
  }
  closeEditWreckToolbar() {
    this.wreckEditToolbar.classList.add("hidden")
  }
  toggleEditWreckToolbar() {
    this.deselectAllShapes()
    this.wreckEditToolbar.classList.toggle("hidden")
    if(this.wreckEditToolbar.classList.contains("hidden"))
      setTimeout(() => this.setTool("select"), 100)
  }
  refreshEditWreckToolbar(wreckBodiesCount) {
    console.log(wreckBodiesCount)
    Array.from(this.wreckEditToolbar.querySelectorAll(".toolbar-icon")).forEach(icon => icon.remove())
    for(let i = 0; i < wreckBodiesCount; i++)
      this.createEditWreckToolbarToolIcon(i)
  }

  //#region input
  handleKeydown(event) {
    if(document.activeElement === this.searchBar.input) 
    {
      if(event.code === "Enter") {
        let [type, name] = this.searchBar.input.value.split(" ")
        if(!type || !name)
          return alert("missing name or type")
          
        let gameObject = GameObject.create(type, name, {}, {world: this})
        if(data[type][name].wreck?.hitboxVaultName) {
          gameObject.onWreckHitboxVaultLoad = () => {
            this.select(gameObject)
            this.searchBar.hide()
            this.setTool("select")
          }
        }
        else {
          this.select(gameObject)
          this.searchBar.hide()
          this.setTool("select")
        }
      }
    }
    else 
    { 
      if(event.code === "KeyX") {
        if(this.selectedVertices.length > 0) {
          this.selectedVertices.forEach(vert => {
            let body = this.getVertextFromBody(vert)
            this.selectedHitbox.removePoint(body, vert)
          })
          this.selectedVertices = []
          this.deselectAllShapes() 
          this.generateControlPoints()
        }
        else if(this.selectedShapes.length > 0) {
          this.selectedShapes.forEach(shape => {
            this.selectedHitbox.removeBody(shape)
          })
          this.selectedVertices = []
          this.deselectAllShapes()
          this.generateControlPoints()
        }
      }
      if(event.code === "KeyE") {
        this.exportHitbox()
      }
      if(event.code === "KeyR") {
        this.exportWreckHitboxVault()
      }
      if(event.code === "KeyV") {
        this.setTool("select")
      }
      if(event.code === "KeyD") {
        this.selectedShapes.forEach(shape => {
          let newShape = new Polygon(_.cloneDeep(shape.vertices))
          this.selectedHitbox.addBody(newShape)
        })
      }
      if(event.code === "KeyP") {
        this.setTool("pen-tool")
      }
      if(event.code === "KeyF") {
        if(this.searchBar.input === document.activeElement) {
          this.searchBar.toggle()
        }
        else {
          this.searchBar.show()
          setTimeout(()=> {this.searchBar.input.focus()},40)
        }
      }
      if(event.code === "Escape") {
        if(this.shape.vertices.length > 0) {
          this.deselectAllShapes()
          this.shape.reset()
        }
        if(this.state.is("definingWeaponSlots")) {
          this.setTool("select")
          this.state.set("default")
        }
        if(this.state.is("definingDockingPoints")) {
          this.setTool("select")
          this.state.set("default")
        }
      }
      if(event.code === "Enter") {
        if(this.shape.vertices.length >= 3) {
          let body = new Polygon(this.shape.vertices)
          this.selectedHitbox.addBody(body)
          this.shape.reset()
        }
        if(this.state.is("definingWeaponSlots")) {
          this.consoleLogWeaponSlots()
          this.setTool("select")
          this.state.set("default")
        }
        if(this.state.is("definingDockingPoints")) {
          this.consoleLogDockingPoints()
          this.setTool("select")
          this.state.set("default")
        }
      }
    }
  }
  handleKeyup(event) {

  }
  handleMousedown(event) {
    if(event.button === 0) {
      if(this.object && event.target === this.canvas) {
        this.selectedVertices = []
        if(debug.editor) 
          console.log('cleared selected vertices')
        let shape = this.getClickedShape()
        let handle = this.getClickedHandle()
        if(this.tool === "select") {
          if(handle) 
            this.selectVertex(this.getNearestVertexTo(handle))
          else 
          if(shape)
            this.selectShape(shape)
          else 
            this.deselectAllShapes()
        }
        if(this.state.is("definingWeaponSlots")) {
          let newslot = mouse.hitboxEditorPosition.clone()
          this.weaponSlots.push(newslot)
        }
        if(this.state.is("definingDockingPoints")) {
          this.defineDockingPoint()
        }
        if(this.tool === "add-point") {
          if(shape) 
            this.selectedHitbox.addVertex(shape)
        }
      }
    }
    if(event.button === 1) {
      this.state.set("panning")
    }
  }
  handleMousemove(event) {
    let target = event.target

    if(target === this.canvas) {
      if(this.tool === "select" && this.selectedVertices.length > 0 && mouse.keys.left) {
        this.moveVertices()
      }
      else
      if(this.tool === "select" && this.selectedShapes.length > 0 && mouse.keys.left) {
        this.moveShapes()
      }
    }
    if(this.state.is("panning")) {
      this.cameraAnchor.transform.position.sub(mouse.hitboxEditorMoved)
    }
  }
  handleMouseup(event) {
    if(this.state.is("panning"))
      this.state.revert()
  }
  handleClick(event) {
    let target = event.target
    if(target.closest(".tool-cont")) {
      let toolIcon = target.closest(".tool-cont")
      if(toolIcon.dataset.toolname === "select-object") {
        this.searchBar.toggle()
        this.searchBar.input.focus()
      }
      if(toolIcon.dataset.toolname === "object-center") {
        if(!this.object) return

        this.object.transform.rotation = 0
        this.object.transform.angularVelocity = 0
        this.object.wrapRotation()
        this.object.transform.position.set(0)
        this.object.transform.velocity.set(0)
        setTimeout(()=> {
          this.setTool("select")
        }, 100)
      }
      if(toolIcon.dataset.toolname === "object-cycle-rotation") {
        this.object.transform.rotation += 90 * PI/180
        this.object.wrapRotation()
        setTimeout(() => this.setTool("select"), 100)
      }
      if(toolIcon.dataset.toolname === "return-to-stage") {
        this.deselect()
      }
      if(toolIcon.dataset.toolname === "define-weapon-slots") {
        this.weaponSlots = []
        this.state.set("definingWeaponSlots")
        console.log('Define weapon slots by clicking. [ESCAPE] to cancel, [ENTER] to confirm')
      }
      if(toolIcon.dataset.toolname === "define-docking-points") {
        this.dockingPoints = []
        this.state.set("definingDockingPoints")
        console.log('Define docking points. [ESCAPE] to cancel, [ENTER] to confirm')
      }
      if(toolIcon.dataset.toolname === "edit-wreck") {
        this.toggleWreckEditMode()
      }
      return
    }
    else
    if(target.closest(".toolbar-icon")) {
      let toolbarIcon = target.closest(".toolbar-icon")
      if(toolbarIcon.dataset.wreckindex) {
        this.setSelectedWreck(+toolbarIcon.dataset.wreckindex)
      }
    }
    else
    if(target === this.canvas) {
      if(this.tool === "add-shape") {
        this.addShape()
      }
      if(this.tool === "remove-shape") {
        this.removeShape()
      }
      if(this.tool === "pen-tool") {
        this.addPointToActiveShape()
      }
    }
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
  defineDockingPoint() {
    this.dockingPoints.push(mouse.hitboxEditorPosition.plain())
  }
  addShape(type = "rect") {
    if(!this.object) return
    let pos = new Vector(cw/2, ch/2)
    switch(type) {
      case "rect" : {
        let length = 100
        let verts = [
          {x: 0, y: 0},
          {x: length, y: 0},
          {x: length, y: length},
          {x: 0, y: length}
        ]
        let body = PolygonBuilder.Square(length, {x: mouse.clientPosition.x - cw/2, y: mouse.clientPosition.y - ch/2}, 90)
        this.object.addBody(body)
      }
    }
  }
  addPointToActiveShape() {
    console.log(this.shape)
    this.shape.vertices.push(new Vector(mouse.hitboxEditorPosition.x, mouse.hitboxEditorPosition.y))
  }
  getClickedShape() {
    if(this.editMode.is("hitbox")) return this.getClickedShapeForHitbox()
    if(this.editMode.is("wreck")) return this.getClickedShapeForWreck()
  }
  getClickedShapeForHitbox() {
    let matched = false
    let matchedShape;
    this.object.hitbox.bodies.forEach(body => {
      if(matched) return
      if(Collision.polygonVector(body, mouse.hitboxEditorPosition)) {
        matched = true
        matchedShape = body
      }
    })
    if(Collision.polygonVector(this.shape, mouse.hitboxEditorPosition)) {
      matched = true
      matchedShape = this.shape
    }
    this.selectedHitbox = this.object.hitbox
    console.log(this.selectedHitbox)
    return matchedShape
  }
  getClickedShapeForWreck() {
    let matched = false
    let matchedShape;
    this.object.wreckHitboxVault.hitboxes[this.selectedWreckIndex].bodies.forEach(body => {
      if(matched) return
      if(Collision.polygonVector(body, mouse.hitboxEditorPosition)) {
        matched = true
        matchedShape = body
      }
    })
    if(Collision.polygonVector(this.shape, mouse.hitboxEditorPosition)) {
      matched = true
      matchedShape = this.shape
    }
    this.selectedHitbox = this.object.wreckHitboxVault.hitboxes[this.selectedWreckIndex]
    console.log(this.selectedHitbox)
    return matchedShape
  }
  getClickedHandle() {
    let distances = []
    this.controlPoints.forEach(point => {
      let diff = point.clone().sub(mouse.hitboxEditorPosition)
      distances.push(Math.hypot(diff.x, diff.y))
    })
    let smallest = Math.min(...distances)
    let indexOfSmallest = distances.indexOf(smallest)
    if(smallest < this.controlPointRadius * this.camera.currentZoom) {
      return this.controlPoints[indexOfSmallest]
    }
    else return null
  }
  toggleWreckEditMode() {
    this.editMode.toggle()
    this.toggleEditWreckToolbar()

    if(this.editMode.is("wreck"))
      this.enterWreckEditMode()
    else 
      this.exitWreckEditMode()
  }
  enterWreckEditMode() {
    this.object.sprite.all.forEach(sprite => sprite.renderable = false)
    this.setSelectedWreck(0)
    this.object.sprite.container.addChild(...this.object.sprite.wreck)
  }
  exitWreckEditMode() {
    this.object.sprite.all.forEach(sprite => sprite.renderable = true)
    this.object.sprite.wreck.forEach(sprite => sprite.renderable = false)
  }
  setSelectedWreck(index) {
    if(!this.object) return
    this.deselectAllShapes()
    this.selectedWreckIndex = index
    this.object.sprite.wreck.forEach((sprite, i) => {
      if(i === index) {
        sprite.renderable = true
        sprite.alpha = 1.0
      }
      else {
        sprite.renderable = false
        sprite.alpha = 0.0
      }
    })
  }
  moveShapes() {
    if(!this.object) return
    
    this.selectedShapes.forEach(shape => {
      this.selectedHitbox.offsetBody(shape, mouse.hitboxEditorMoved)
    })
  }
  moveVertices() {
    this.selectedVertices.forEach(point => {
      let vert = this.getNearestVertexTo(point)
      let body = this.getVertextFromBody(vert)
      this.selectedHitbox.movePoint(body, vert, mouse.hitboxEditorMoved)
    })
  }
  deselectShape(shape) {
    this.selectedShapes.splice(this.selectedShapes.indexOf(shape), 1)
    shape.color = colors.hitbox.noCollision
  }
  deselectAllShapes() {
    this.selectedShapes.forEach(shape => {
      shape.color = colors.hitbox.noCollision
    })
    this.selectedShapes = []
    this.generateControlPoints()
  }
  selectShape(shape) {
    if(!shape) return
    if(this.selectedShapes.find(s => s === shape)) {
      if(!keys.shift) this.deselectAllShapes()
      this.deselectShape(shape)
    }
    else {
      if(!keys.shift) this.deselectAllShapes()
      this.selectedShapes.push(shape)
      shape.color = colors.hitbox.shapeSelected
    }
  }
  selectVertex(vertex) {
    if(this.selectedVertices.find(v => v === vertex)) {
      this.selectedVertices.splice(this.selectedVertices.indexOf(vertex), 1)
    }
    else {
      this.selectedVertices.push(vertex)
    }
  }
  generateControlPoints() {
    this.controlPoints = []
    this.selectedShapes.forEach(shape => {
      shape.vertices.forEach(vert => {
        this.controlPoints.push(new Vector(vert.x, vert.y))
      })
    })
  }
  getNearestVertexTo(position) {
    let distances = []
    let verts = []
    this.selectedHitbox.bodies.forEach(body => {
      body.vertices.forEach(vert => {
        let diff = new Vector(vert.x, vert.y).sub(position)
        distances.push(Math.hypot(diff.x, diff.y))
        verts.push(vert)
      })
    })
    let smallest = Math.min(...distances)
    let indexOfSmallest = distances.indexOf(smallest)
    return verts[indexOfSmallest]
  }
  getVertextFromBody(vert) {
    return this.selectedHitbox.bodies.find(body => body.vertices.find(v => v === vert))
  }
  removeShape() {
    let shape = this.getClickedShape()
    this.selectedHitbox.removeBody(shape)
    this.deselectAllShapes()
  }
  drawControlPoints() {
    this.controlPoints.forEach(point => {
      this.graphics.lineStyle(2, colors.hitbox.shapeSelected, 1)
      this.graphics.drawCircle(point.x, point.y, this.controlPointRadius * this.camera.currentZoom)
    })
  }
  drawWeaponSlots() {
    this.weaponSlots.forEach(slot => {
      this.graphics.lineStyle(2, colors.hitbox.weaponSlot, 1)
      this.graphics.drawCircle(slot.x, slot.y, 9)
      this.graphics.closePath()
    })
  }
  drawDockingPoints() {
    this.dockingPoints.forEach(point => {
      this.graphics.lineStyle(2, colors.hitbox.dockingPoint, 1)
      this.graphics.drawCircle(point.x, point.y, 9)
      this.graphics.closePath()
    })
  }
  drawObjectDockingPoints() {
    //these are already set on the object
    this.object.dockingPoints.forEach(point => {
      this.graphics.lineStyle(2, colors.hitbox.dockingPoint, 0.5)
      this.graphics.drawCircle(point.x, point.y, 9)
      this.graphics.closePath()
    })
  }
  drawUnfinishedShape() {
    Hitbox.drawPolygon(this.shape, this.graphics, this.camera.currentZoom)
  }
  drawSelectedWreck() {
    if(this.editMode.isnt("wreck")) return
    if(!this.object) return
    if(!this.object.wreckHitboxVault) return
      Hitbox.drawPolygonHitbox(this.object, this.object.wreckHitboxVault.hitboxes[this.selectedWreckIndex], this.graphics, this.camera.currentZoom)
  }
  update() {
    this.generateControlPoints()
    this.drawWeaponSlots() 
    this.drawDockingPoints() 
    this.drawControlPoints() 
    this.drawUnfinishedShape() 
    this.drawSelectedWreck()
    
    if(this.object)
      Hitbox.draw(this.object, this.graphics, this.camera.currentZoom)
    if(this.object?.dockingPoints)
      this.drawObjectDockingPoints()
  }
}