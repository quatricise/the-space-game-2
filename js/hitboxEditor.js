class HitboxEditor extends GameWorldWindow {
  constructor(title, element) {
    super(title, element)
    this.canvas = this.app.view
    this.cameraAnchor = {
      transform: new Transform()
    }
    this.camera.lockTo(this.cameraAnchor)
    this.obj = null
    this.selectedShapes = []
    this.selectedVertices = []
    this.controlPoints = []
    this.controlPointRadius = 7
    this.weaponSlots = []
    this.tools = [
      "select",
      "pen-tool",
      "add-shape",
      "add-point",
      "remove-shape",
      "center-shape",
      "select-object",
      "object-center",
      "object-cycle-rotation",
      "defineWeaponSlots",
      "return-to-stage",
    ]
    this.tool = "add-shape"
    this.generateIcons()
    // this.centerCanvas()
    this.searchBar = {
      cont: Q('#hitbox-editor-search-bar'),
      input: Q('#hitbox-editor-search-input'),
      show: () => {
        this.searchBar.cont.classList.remove('hidden')
        this.deselectAllShapes()
      },
      toggle: () => {
        this.searchBar.cont.classList.toggle('hidden')
        this.deselectAllShapes()
      },
      hide: () => {
        this.searchBar.cont.classList.add('hidden')
        this.deselectAllShapes()
      },
    }
    this.shape = {
      vertices: [],
      color: 0x9900ff,
      reset() {
        this.vertices = []
      },
    }
    this.state = new State(
      "default",
      "definingWeaponSlots",
    )
  }
  generateIcons() {
    this.tools.forEach(t => {
      let cont = El('div', "tool-cont")
      let icon = El('div', "tool-icon " + t)
      cont.append(icon)
      cont.onclick = () => {
        this.setTool(t)
      }
      cont.title = capitalize(t.replaceAll('-', " "))
      cont.dataset.toolname = t
      // cont.dataset.tooltip = capitalize(t)
      Q('#hitbox-editor-toolset').append(cont)
    })
  }
  exportHitbox() {
    let data = this.obj.hitboxRelative
    exportToJsonFile(data)
  }
  exportWeaponSlots() {
    let string = `weaponSlots: [`
    this.weaponSlots.forEach(slot => {
      string += `{x:${slot.x},y:${slot.y}},`
    })
    string += `],`
    console.log(string)
  }
  setTool(name) {
    let tool = this.tools.find(t => t === name)
    if(tool) {
      this.tool = tool
      Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
      this.element.querySelector('[data-toolname="' + tool + '"').classList.add('active')
    }
  }
  select(object) {
    if(!object) return
    this.deselect()
    // GameObject.removeFromStage(object)
    // GameObject.addToStage()
    throw "select() not finished"
    //game object -> remove from previous simulation
    //game object -> add into this simulation
    this.obj = object
    object.rotation = 0
    object.rotationVelocity = 0
    object.vel.set(0)
    object.pos.set(0)
    this.setTool("select")
  }
  deselect() {
    if(!this.obj) return
    editorApp.stage.removeChild(this.obj.container)
    app.stage.addChild(this.obj.container)
    this.obj = null
  }
  handleKeydown(event) {
    if(document.activeElement === this.searchBar.input) {
      if(event.code === "Enter") {
        this.select(eval(this.searchBar.input.value))
        this.searchBar.hide()
        this.setTool("select")
      }
    }
    if(document.activeElement !== this.searchBar.input) { 
      if(event.code === "KeyX") {
        if(this.selectedVertices.length > 0) {
          this.selectedVertices.forEach(vert => {
            let body = this.getVertexBody(vert)
            this.obj.removePoint(body, vert)
          })
          this.selectedVertices = []
          this.deselectAllShapes() 
          this.generateControlPoints()
        }
        else if(this.selectedShapes.length > 0) {
          this.selectedShapes.forEach(shape => {
            this.obj.removeBody(shape)
          })
          this.selectedVertices = []
          this.deselectAllShapes()
          this.generateControlPoints()
        }
      }
      if(event.code === "KeyE") {
        this.exportHitbox()
      }
      if(event.code === "KeyV") {
        this.setTool("select")
      }
      if(event.code === "KeyD") {
        this.selectedShapes.forEach(shape => {
          let newShape = new Polygon(_.cloneDeep(shape.vertices))
          this.obj.addBody(newShape)
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
      }
      if(event.code === "Enter") {
        if(this.shape.vertices.length >= 3) {
          let body = new Polygon(this.shape.vertices)
          this.obj.addBody(body)
          this.shape.reset()
        }
        if(this.state.is("definingWeaponSlots")) {
          this.exportWeaponSlots()
          this.setTool("select")
          this.state.set("default")
        }
      }
    }
  }
  handleKeyup(event) {

  }
  handleMousedown(event) {
    if(this.obj && event.target === this.canvas) {
      this.selectedVertices = []
      if(debug.editor) console.log('cleared selected vertices')
      let shape = this.getClickedShape()
      let handle = this.getClickedHandle()
      if(this.tool === "select") {
        if(handle) {
          // this.selectedVertices.push(handle) 
          this.selectVertex(this.getNearestVertexTo(handle))
        }
        else 
        if(shape) {
          this.selectShape(shape)
        }
        else {
          this.deselectAllShapes()
        }
      }
      if(this.state.is("definingWeaponSlots")) {
        let newslot = mouse.editorPos.clone()
        this.weaponSlots.push(newslot)
      }
      if(this.tool === "add-point") {
        if(shape) {
          this.obj.addVertex(shape)
        }
      }
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
  }
  handleMouseup(event) {

  }
  handleClick(event) {
    let target = event.target
    if(target.closest(".tool-cont")) {
      let el = target.closest(".tool-cont")
      if(el.dataset.toolname === "select-object") {
        this.searchBar.toggle()
        this.searchBar.input.focus()
      }
      if(el.dataset.toolname === "object-center") {
        if(!this.obj) return
        this.obj.rotation = 0
        this.obj.rotationVelocity = 0
        this.obj.wrapRotation()
        this.obj.pos.set(0)
        this.obj.vel.set(0)
        setTimeout(()=> {
          this.setTool("select")
        }, 100)
      }
      if(el.dataset.toolname === "object-cycle-rotation") {
        this.obj.rotation += 90 * PI/180
        this.obj.wrapRotation()
        setTimeout(()=> {
          this.setTool("select")
        }, 100)
      }
      if(el.dataset.toolname === "return-to-stage") {
        this.deselect()
      }
      if(el.dataset.toolname === "defineWeaponSlots") {
        this.weaponSlots = []
        this.state.set("definingWeaponSlots")
        console.log('Define weapon slots by clicking. [ESCAPE] to cancel, [ENTER] to confirm')
      }
      return
    }
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
  addShape(type = "rect") {
    if(!this.obj) return
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
        let body = PolygonBuilder.Square(length, {x: mouse.clientPos.x - cw/2, y: mouse.clientPos.y - ch/2}, 90)
        this.obj.addBody(body)
      }
    }
  }
  addPointToActiveShape() {
    console.log(this.shape)
    this.shape.vertices.push(new Vector(mouse.editorPos.x, mouse.editorPos.y))
  }
  getClickedShape() {
    let matched = false
    let match;
    this.obj.hitbox.bodies.forEach(body => {
      if(matched) return
      // console.log(point)
      if(Collision.polygonPoint(body, mouse.editorPos)) {
        matched = true
        match = body
      }
    })
    if(Collision.polygonPoint(this.shape, mouse.editorPos)) {
      matched = true
      match = this.shape
    }
    return match
  }
  getClickedHandle() {
    let distances = []
    this.controlPoints.forEach(point => {
      let diff = point.clone().sub(mouse.editorPos)
      distances.push(Math.hypot(diff.x, diff.y))
    })
    let smallest = Math.min(...distances)
    let indexOfSmallest = distances.indexOf(smallest)
    if(smallest < this.controlPointRadius) {
      return this.controlPoints[indexOfSmallest]
    }
    else return null
  }
  moveShapes() {
    if(!this.obj) return
    this.selectedShapes.forEach(shape => {
      this.obj.offsetBody(shape, mouse.clientMoved)
    })
  }
  moveVertices() {
    this.selectedVertices.forEach(point => {
      let vert = this.getNearestVertexTo(point)
      // this.obj.moveVertex(vert, mouse.clientMoved)
      let body = this.getVertexBody(vert)
      this.obj.movePoint(body, vert, mouse.clientMoved)
      // this.obj.offsetVertex(vert, mouse.clientMoved)
    })
  }
  deselectShape(shape) {
    this.selectedShapes.splice(this.selectedShapes.indexOf(shape), 1)
    shape.color = debug.colors.hitboxNoCollision
  }
  deselectAllShapes() {
    this.selectedShapes.forEach(shape => {
      shape.color = debug.colors.hitboxNoCollision
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
      shape.color = debug.colors.hitboxShapeSelected
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
    this.obj.hitbox.bodies.forEach(body => {
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
  getVertexBody(vert) {
    return this.obj.hitbox.bodies.find(body => body.vertices.find(v => v === vert))
  }
  removeShape() {
    let shape = this.getClickedShape()
    this.obj.removeBody(shape)
    this.deselectAllShapes()
  }
  drawControlPoints() {
    let 
    graphics = this.graphics, 
    controlPoints = this.controlPoints

    controlPoints.forEach(point => {
      graphics.drawCircle(point.x, point.y, this.controlPointRadius)
    })
  }
  drawWeaponSlots() {
    this.weaponSlots.forEach(slot => {
      this.graphics.lineStyle(2, colors.hitbox.weaponSlot, 1)
      this.graphics.drawCircle(slot.x, slot.y, 9)
      this.graphics.closePath()
    })
  }
  drawUnfinishedShape() {
    Hitbox.drawPolygon(this.shape, this.graphics)
  }
  update() {
    this.generateControlPoints()
    this.drawWeaponSlots() 
    this.drawControlPoints() 
    this.drawUnfinishedShape() 
  }
}