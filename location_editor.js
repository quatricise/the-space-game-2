class LocationEditor {
  constructor() {
    this.element = Q('#location-editor')
    this.app = level_app
    this.app.view.classList.add("location-editor-app")
    this.element.append(this.app.view)
    this.graphics = new PIXI.Graphics()
    this.app.stage.addChild(this.graphics)
    this.grid_sprite = new PIXI.TilingSprite(grid.texture, cw + grid.cell_size*2, ch + grid.cell_size*2)
    this.name = "Location"
    this.objects = []
    this.state = new State(
      "default",
      "adding_obj",
      "panning",
    )
    this.tools = [
      "move",
      "select-object",
    ]
    this.selected = []
    this.active = {
      path: ["array", "of", "strings"],
    }
    this.dropdown = this.element.querySelector(".search-dropdown-window")
    this.obj_selector = this.element.querySelector(".selected-object-cont")
    // this.camera = new Camera()
    this.generated_search = false
    this.generate_icons()
    this.set_tool(this.tools[0])
  }
  import(name) {

  }
  export() {

  }
  new() {
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
  add_origin() {
    let origin = PIXI.Sprite.from("assets/origin.png")
    origin.anchor.x = 0.5
    origin.anchor.y = 0.5
    this.app.stage.addChild(origin)
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
      Q('#location-editor-toolset').append(cont)
    })
  }
  generate_search() {
    let list = this.element.querySelector(".search-dropdown-window .dropdown-list")
    let d = []
    let keys = [] 
    let paths = []
    for(let key in data.ships) {
      d.push(data.ships[key])
      keys.push(key)
      paths.push("ships" + "." + key)
    }
    // temporarily disable asteroids

    for(let key in data.entities.asteroids) {
      d.push(data.entities.asteroids[key])
      keys.push(key)
      paths.push("entities.asteroids" + "." + key)
    }
    d.forEach((data, index) => {
      let images = []
      for(let key in data.sources) {
        let img = new Image(); img.src = data.sources[key].src
        img.style.position = "absolute"
        images.push(img)
      }
      let cont = El('div', "dropdown-item", [["title", "Add to location"]])
      let name = keys[index].replaceAll("_", ' ').cap()
      let desc = El('div', "dropdown-desc", undefined, name) 
      let image_cont = El('div', "dropdown-image")
      image_cont.append(...images)
      cont.dataset.path = paths[index]
      cont.append(image_cont, desc)
      list.append(cont)
    })

    console.log(d)
    this.generated_search = true
  }
  set_tool(name) {
    console.log(name)
    let tool = this.tools.find(t => t === name)
    if(tool) {
      this.tool = tool
      Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
      this.element.querySelector('[data-toolname="' + tool + '"').classList.add('active')
      if(tool !== "select-object") this.element.querySelector('.search-dropdown-window').classList.add("hidden")
      this.state.set("default")
    }
  }
  add_object(path) {
    let loc = data
    let type
    path.forEach(step => {
      loc = loc[step]
      if(step === "asteroids") type = "asteroid"
      if(step === "ships") type = "ship"
    })
    let obj = loc
    let pos = new Vector(-this.app.stage.position.x + mouse.client_pos.x,-this.app.stage.position.y + mouse.client_pos.y),
        vel = new Vector(0,0),
        rot = 0,
        rot_vel = 0
    let object;
    if(type === "asteroid") {
      object = new Asteroid(pos, vel, rot, rot_vel, obj)
    }
    if(type === "ship") {
      object = new Ship(pos, vel, rot, rot_vel, obj)
    }
    console.log(object)
    object.addToScene(this.app.stage)
    this.objects.push(object)
  }
  select_obj(obj) {
    if(this.selected.find(o => o === obj)) {
      this.selected = this.selected.filter(o => o !== obj)
      return
    }
    this.selected.push(obj)
    console.log('selected obj', obj)
  }
  handle_input(event) {
    switch(event.type) {
      case "keydown"    : {this.handle_keydown(event); break;}
      case "keyup"      : {this.handle_keyup(event); break;}
      case "mousemove"  : {this.handle_mousemove(event); break;}
      case "mousedown"  : {this.handle_mousedown(event); break;}
      case "mouseup"    : {this.handle_mouseup(event); break;}
      case "click"      : {this.handle_click(event); break;}
    }
  }
  handle_keydown(event) {

  }
  handle_keyup(event) {

  }
  handle_mousemove(event) {
    if(this.state.is("panning")) {
      this.app.stage.position.x += mouse.client_moved.x
      this.app.stage.position.y += mouse.client_moved.y
    }
  }
  handle_mousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".tool-icon.select-object")) {
        let el = target.closest(".tool-cont")
        let rect = el.getBoundingClientRect()
        
        this.dropdown.style.left = rect.x + "px"
        this.dropdown.style.top = rect.y + rect.height + 10 + "px"
        this.dropdown.classList.toggle("hidden")

        if(this.dropdown.classList.contains("hidden")) setTimeout(()=>{ this.set_tool("move")},100)
        else setTimeout(()=>{this.dropdown.querySelector("input").focus()},100)

        if(!this.generated_search) {
          this.generate_search()
        }
      } 
      if(target.closest(".dropdown-item")) {
        let path = target.closest(".dropdown-item").dataset.path.split(".")
        this.active.path = path
        this.dropdown.classList.add("hidden")
        this.state.set("adding_obj")
        let img_cont = target.closest(".dropdown-item").querySelector(".dropdown-image").cloneNode(true)
        Array.from(img_cont.children).forEach(img => img.style = "")
        img_cont.classList.replace("dropdown-image", "selected-object-icon")
        let text = target.closest(".dropdown-item").querySelector(".dropdown-desc").innerText
        let desc = El("div", "selected-object-desc", undefined, text)
        this.obj_selector.innerHTML = ""
        this.obj_selector.append(img_cont, desc)
      }
      if(target === this.element && this.state.is("adding_obj")) {
        this.add_object(this.active.path)
      }
      if(target === this.element && this.tool === "move") {
        this.objects.forEach(obj => {
          if(obj.hitbox.type === "circle") {
            let pos = mouse.client_pos.clone().sub(new Vector(this.app.stage.position.x, this.app.stage.position.y))
            let circle = {
              x: obj.pos.x,
              y: obj.pos.y,
              radius: obj.hitbox.radius
            }
            if(Collision.pointCircle(pos, circle)) {
              this.select_obj(obj)
            }
          }
          if(obj.hitbox.type === "polygon") {
            let pos = mouse.client_pos.clone().sub(new Vector(this.app.stage.position.x, this.app.stage.position.y))
            obj.hitbox.bodies.forEach(body => {  
              if(Collision.polygonPoint(body, pos)) {
                this.select_obj(obj)
              }
            })
          }
        })
      }
    }
    if(event.button === 1) {
      this.state.set("panning")
    }
  }
  handle_mouseup(event) {
    if(this.state.is("panning")) {
      this.state.revert("default")
    }
  }
  handle_click(event) {

  }
  update() {

  }
}