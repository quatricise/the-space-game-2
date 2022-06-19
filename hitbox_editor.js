class HitboxEditor {
  constructor() {
    this.element = Q('#hitbox-editor')
    this.graphics = new PIXI.Graphics()
    this.app = editor_app
    editor_layer_graphics.addChild(this.graphics)
    this.obj = null
    this.selected_shapes = []
    this.selected_vertices = []
    this.control_points = []
    this.d = {
      control_point_radius: 7,
    }
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
    ]
    this.tool = "add-shape"
    this.generate_icons()
    this.center_canvas()
    this.search_bar = {
      cont: Q('#hitbox-editor-search-bar'),
      input: Q('#hitbox-editor-search-input'),
      show: () => {
        this.search_bar.cont.classList.remove('hidden')
        this.deselect_all_shapes()
      },
      toggle: () => {
        this.search_bar.cont.classList.toggle('hidden')
        this.deselect_all_shapes()
      },
      hide: () => {
        this.search_bar.cont.classList.add('hidden')
        this.deselect_all_shapes()
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

    )
  }
  center_canvas() {
    this.app.stage.position.set(cw/2, ch/2)
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
  generate_icons() {
    this.tools.forEach(t => {
      let cont = El('div', "tool-cont")
      let icon = El('div', "tool-icon " + t)
      cont.append(icon)
      cont.onclick = () => {
        this.set_tool(t)
      }
      cont.title = capitalize(t.replaceAll('-', " "))
      cont.dataset.toolname = t
      // cont.dataset.tooltip = capitalize(t)
      Q('#hitbox-editor-toolset').append(cont)
    })
  }
  export_hitbox() {
    let data = this.obj.hitbox_relative
    exportToJsonFile(data)
  }
  set_tool(name) {
    let tool = this.tools.find(t => t === name)
    if(tool) {
      this.tool = tool
      Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
      this.element.querySelector('[data-toolname="' + tool + '"').classList.add('active')
      // console.log(name)
    }
  }
  select(object) {
    if(!object) return
    this.deselect()
    app.stage.removeChild(object.sprite_container)
    editor_layer_ships.addChild(object.sprite_container)
    this.obj = object
    object.rotation = 0
    object.rotation_velocity = 0
    object.vel.set(0)
    object.pos.set(0)
    this.set_tool("select")
  }
  deselect() {
    if(!this.obj) return
    editor_app.stage.removeChild(this.obj.sprite_container)
    app.stage.addChild(this.obj.sprite_container)
    this.obj = null
  }
  handle_input(event) {
    if(ui.windows.active !== this) return
    switch(event.type) {
      case "keydown"    : {this.handle_keydown(event); break;}
      case "keyup"      : {this.handle_keyup(event); break;}
      case "mousedown"  : {this.handle_mousedown(event); break;}
      case "mousemove"  : {this.handle_mousemove(event); break;}
      case "mouseup"    : {this.handle_mouseup(event); break;}
      case "click"      : {this.handle_click(event); break;}
    }
  }
  handle_keydown(event) {
    if(document.activeElement === this.search_bar.input) {
      if(event.code === "Enter") {
        this.select(eval(this.search_bar.input.value))
        this.search_bar.hide()
        this.set_tool("select")
      }
    }
    if(document.activeElement !== this.search_bar.input) { 
      if(event.code === "KeyX") {
        if(this.selected_vertices.length > 0) {
          this.selected_vertices.forEach(vert => {
            let body = this.get_vertex_body(vert)
            this.obj.remove_point(body, vert)
          })
          this.selected_vertices = []
          this.deselect_all_shapes() 
          this.generate_control_points()
        }
        else if(this.selected_shapes.length > 0) {
          this.selected_shapes.forEach(shape => {
            this.obj.remove_body(shape)
          })
          this.selected_vertices = []
          this.deselect_all_shapes()
          this.generate_control_points()
        }
      }
      if(event.code === "KeyE") {
        this.export_hitbox()
      }
      if(event.code === "KeyV") {
        this.set_tool("select")
      }
      if(event.code === "KeyD") {
        this.selected_shapes.forEach(shape => {
          let new_shape = new Polygon(_.cloneDeep(shape.vertices))
          this.obj.add_body(new_shape)
        })
      }
      if(event.code === "KeyP") {
        this.set_tool("pen-tool")
      }
      if(event.code === "KeyF") {
        if(this.search_bar.input === document.activeElement) {
          this.search_bar.toggle()
        }
        else {
          this.search_bar.show()
          setTimeout(()=> {this.search_bar.input.focus()},40)
        }
      }
      if(event.code === "Escape") {
        if(this.shape.vertices.length > 0) {
          this.deselect_all_shapes()
          this.shape.reset()
        }
      }
      if(event.code === "Enter") {
        if(this.shape.vertices.length >= 3) {
          let body = new Polygon(this.shape.vertices)
          this.obj.add_body(body)
          this.shape.reset()
        }
      }
    }
    
  }
  handle_keyup(event) {

  }
  handle_mousedown(event) {
    if(this.obj && event.target === this.app.view) {
      this.selected_vertices = []
      if(debug.editor) console.log('cleared selected vertices')
      let shape = this.get_clicked_shape()
      let handle = this.get_clicked_handle()
      if(this.tool === "select") {
        if(handle) {
          // this.selected_vertices.push(handle) 
          this.select_vertex(this.get_nearest_vertex_to(handle))
        }
        else 
        if(shape) {
          this.select_shape(shape)
        }
        else {
          this.deselect_all_shapes()
        }
      }
      if(this.tool === "add-point") {
        if(shape) {
          this.obj.add_vertex(shape)
        }
      }
    }
  }
  handle_mousemove(event) {
    if(this.tool === "select" && this.selected_vertices.length > 0 && mouse.keys.left) {
      this.move_vertices()
    }
    else
    if(this.tool === "select" && this.selected_shapes.length > 0 && mouse.keys.left) {
      this.move_shapes()
    }
  }
  handle_mouseup(event) {

  }
  handle_click(event) {
    let target = event.target
    if(target.closest(".tool-cont")) {
      let el = target.closest(".tool-cont")
      if(el.dataset.toolname === "select-object") {
        this.search_bar.toggle()
        this.search_bar.input.focus()
      }
      if(el.dataset.toolname === "object-center") {
        this.obj.rotation = 0
        this.obj.rotation_velocity = 0
        this.obj.wrapRotation()
        this.obj.pos.set(0)
        this.obj.vel.set(0)
        this.set_tool("select")
      }
      if(el.dataset.toolname === "object-cycle-rotation") {
        this.obj.rotation += 90 * PI/180
        this.obj.wrapRotation()
        this.set_tool("select")
      }
      return
    }
    if(this.tool === "add-shape") {
      this.add_shape()
    }
    if(this.tool === "remove-shape") {
      this.remove_shape()
    }
    if(this.tool === "pen-tool") {
      this.add_point_to_active_shape()
    }
  }
  add_shape(type = "rect") {
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
        let body = PolygonBuilder.Square(length, {x: mouse.client_pos.x - cw/2, y: mouse.client_pos.y - ch/2}, 90)
        this.obj.add_body(body)
      }
    }
  }
  add_point_to_active_shape() {
    this.shape.vertices.push(new Vector(mouse.editor_pos.x, mouse.editor_pos.y))
  }
  get_clicked_shape() {
    let matched = false
    let match;
    this.obj.hitbox.bodies.forEach(body => {
      if(matched) return
      // console.log(point)
      if(Collision.polygonPoint(body, mouse.editor_pos)) {
        matched = true
        match = body
      }
    })
    if(Collision.polygonPoint(this.shape, mouse.editor_pos)) {
      matched = true
      match = this.shape
    }
    return match
  }
  get_clicked_handle() {
    let distances = []
    this.control_points.forEach(point => {
      let diff = point.clone().sub(mouse.editor_pos)
      distances.push(Math.hypot(diff.x, diff.y))
    })
    let smallest = Math.min(...distances)
    let index_of_smallest = distances.indexOf(smallest)
    if(smallest < this.d.control_point_radius) {
      return this.control_points[index_of_smallest]
    }
    else return null
  }
  move_shapes() {
    if(!this.obj) return
    this.selected_shapes.forEach(shape => {
      this.obj.offset_body(shape, mouse.client_moved)
    })
  }
  move_vertices() {
    this.selected_vertices.forEach(point => {
      let vert = this.get_nearest_vertex_to(point)
      // this.obj.move_vertex(vert, mouse.client_moved)
      let body = this.get_vertex_body(vert)
      this.obj.move_point(body, vert, mouse.client_moved)
      // this.obj.offset_vertex(vert, mouse.client_moved)
    })
  }
  deselect_shape(shape) {
    this.selected_shapes.splice(this.selected_shapes.indexOf(shape), 1)
    shape.color = debug.colors.hitbox_no_collision
  }
  deselect_all_shapes() {
    this.selected_shapes.forEach(shape => {
      shape.color = debug.colors.hitbox_no_collision
    })
    this.selected_shapes = []
    this.generate_control_points()
  }
  select_shape(shape) {
    if(!shape) return
    if(this.selected_shapes.find(s => s === shape)) {
      if(!keys.shift) this.deselect_all_shapes()
      this.deselect_shape(shape)
    }
    else {
      if(!keys.shift) this.deselect_all_shapes()
      this.selected_shapes.push(shape)
      shape.color = debug.colors.hitbox_shape_selected
    }
  }
  select_vertex(vertex) {
    if(this.selected_vertices.find(v => v === vertex)) {
      this.selected_vertices.splice(this.selected_vertices.indexOf(vertex), 1)
    }
    else {
      this.selected_vertices.push(vertex)
    }
  }
  generate_control_points() {
    this.control_points = []
    this.selected_shapes.forEach(shape => {
      shape.vertices.forEach(vert => {
        this.control_points.push(new Vector(vert.x, vert.y))
      })
    })
  }
  get_nearest_vertex_to(position) {
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
    let index_of_smallest = distances.indexOf(smallest)
    return verts[index_of_smallest]
  }
  get_vertex_body(vert) {
    return this.obj.hitbox.bodies.find(body => body.vertices.find(v => v === vert))
  }
  remove_shape() {
    let shape = this.get_clicked_shape()
    this.obj.remove_body(shape)
    this.deselect_all_shapes()
  }
  draw_control_points() {
    let 
    graphics = this.graphics, 
    control_points = this.control_points

    control_points.forEach(point => {
      graphics.drawCircle(point.x, point.y, this.d.control_point_radius)
    })
  }
  draw_unfinished_shape() {
    HitboxTools.drawPolygon(this.shape)
  }
  update() {
    this.generate_control_points()
    this.draw_control_points() 
    this.draw_unfinished_shape() 
  }
}


function f(id) {
  return entities.find(e => e.id === +id)
}


// let editor_graphics = new PIXI.Graphics()
// editor_app.stage.addChild(editor_graphics)
