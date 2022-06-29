class LocationEditor {
  constructor() {
    this.element = Q('#location-editor')
    this.app = level_app
    this.scene = this.app.stage
    this.app.view.classList.add("location-editor-app")
    this.element.append(this.app.view)
    this.graphics = new PIXI.Graphics()
    this.scene.addChild(this.graphics)
    this.grid_sprite = new PIXI.TilingSprite(grid.texture, cw + grid.cell_size*2, ch + grid.cell_size*2)
    this.scene.addChild(this.grid_sprite)
    this.name = "Location"
    this.objects = []
    this.state = new State(
      "default",
      "adding_obj",
      "panning",
      "rotating",
    )
    this.tools = [
      "move",
      "select-object",
      "add-special",
      "rotate",
      "edit-hitbox",
    ]
    this.special_objects = [
      "random_spawner", //select a spawn pool, add min and max spawns, add object weights, randomize velocity, rotation
      "pick_location", //spawn one object, but let the game decide from multiple places where it can put it
    ]
    this.selected = []
    this.previous_selected = []
    this.select_delay = 55
    this.active = {
      path: ["array", "of", "strings"],
    }
    this.rotation_data = {
      click_origin: new Vector(0),
      angle_start: 0,
      angle_now: 0,
      orig: 0,
    }
    this.vp_offset = new Vector(0)
    this.dropdown = this.element.querySelector(".search-dropdown-window")
    this.dropdown_special = this.element.querySelector(".special-dropdown-window")
    this.obj_selector = this.element.querySelector(".selected-object-cont")
    // this.camera = new Camera()
    this.generated_search = false
    this.generate_icons()
    this.generate_special()
    this.set_tool(this.tools[0])
    this.add_origin()
  }
  import() {
    let name = window.prompt("location name", "location001")
    this.objects = []
    readTextFile("data/locations/" + name + ".json", (text) => {
      let d = JSON.parse(text)
      d.forEach(obj => {
        let newobj
        let pos = new Vector(obj.pos.x, obj.pos.y)
        let vel = new Vector(obj.vel.x, obj.vel.y)
        let rotation = obj.rotation
        let rotation_velocity = obj.rotation_velocity
        console.log(`hitboxes aren't saved correctly, only references to json files work so far`)
        if(obj.type === "ship") newobj = new Ship(pos, vel, rotation, rotation_velocity, obj.dataref)
        if(obj.type === "asteroid") newobj = new Asteroid(pos, vel, rotation, rotation_velocity, obj.dataref)

        if(newobj) {
          this.objects.push(newobj)
          newobj.addToScene(this.scene)
        }
      })
    })
  }
  export() {
    let d = []
    this.objects.forEach(obj => {
      let newobj = {
        pos: {x: obj.pos.x, y: obj.pos.y},
        vel: {x: obj.vel.x, y: obj.vel.y},
        rotation: obj.rotation,
        rotation_velocity: obj.rotation_velocity,
        dataref: obj.dataref, //absolutely disgusting
      }
      if(obj instanceof Ship) newobj.type = "ship"
      if(obj instanceof Asteroid) newobj.type = "asteroid"
      d.push(newobj)
    })
    exportToJsonFile(d, "location001")
  }
  new_location() {
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
    this.origin = PIXI.Sprite.from("assets/origin.png")
    this.origin.anchor.x = 0.5
    this.origin.anchor.y = 0.5
    this.scene.addChild(this.origin)
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
  generate_special() {
    let list = this.element.querySelector(".special-dropdown-window .dropdown-list")
    this.special_objects.forEach(obj => {
      let el = El("div", "blbblblb", undefined, obj.replaceAll("_", ' ').cap())
      list.append(el)
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
    d.forEach((d, index) => {
      console.log(d)
      let img = new Image(); img.src = d.sources.folder + "thumbnail.png"
      img.style.position = "absolute"
      let cont = El('div', "dropdown-item", [["title", "Add to location"]])
      let name = keys[index].replaceAll("_", ' ').cap()
      let desc = El('div', "dropdown-desc", undefined, name) 
      let image_cont = El('div', "dropdown-image")
      image_cont.append(img)
      cont.dataset.path = paths[index]
      cont.append(image_cont, desc)
      list.append(cont)
    })

    console.log(d)
    this.generated_search = true
  }
  set_tool(name) {
    let tool = this.tools.find(t => t === name)
    if(tool) {
      this.tool = tool
      Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
      this.element.querySelector('[data-toolname="' + tool + '"').classList.add('active')
      if(tool !== "select-object") this.element.querySelector('.search-dropdown-window').classList.add("hidden")
      if(tool !== "add-special") this.element.querySelector('.special-dropdown-window').classList.add("hidden")
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
    let pos = new Vector(-this.scene.position.x + mouse.client_pos.x,-this.scene.position.y + mouse.client_pos.y),
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
    if(debug.location_editor) console.log(object)
    object.addToScene(this.scene)
    this.objects.push(object)
  }
  select_obj(obj) {
    if(this.selected.find(o => o === obj)) return
    setTimeout(()=> {
      this.selected.push(obj)
      if(debug.location_editor) console.log('selected obj', obj)
    },this.select_delay)
  }
  deselect_obj(obj) {
    this.selected = this.selected.filter(o => o !== obj)
    if(debug.location_editor) console.log("deselected obj", obj)
  }
  reselect() {
    this.selected = [...this.previous_selected]
  }
  select_all() {
    this.deselect_all()
    this.objects.forEach(obj => this.select_obj(obj))
    this.previous_selected = [...this.selected]
  }
  deselect_all() {
    this.selected = []
  }
  delete_selected() {
    let objs = this.selected
    this.deselect_all()
    objs.forEach(obj => obj.destroy())
  }
  duplicate_selected() {
    let duplicates = []
    this.selected.forEach(obj => {
      let newobj
      if(obj instanceof Ship) newobj = new Ship(obj.pos.clone(), obj.vel.clone(),obj.rotation, obj.rotation_velocity, obj.dataref)
      if(obj instanceof Asteroid) newobj = new Asteroid(obj.pos.clone(), obj.vel.clone(),obj.rotation, obj.rotation_velocity, obj.dataref)
      newobj.pos.x += 50
      newobj.pos.y += 50
      newobj.addToScene(this.scene)
      this.objects.push(newobj)
      duplicates.push(newobj)
    })
    this.deselect_all()
    duplicates.forEach(dup => this.select_obj(dup))
    setTimeout(()=> {this.previous_selected = [...this.selected]}, this.select_delay + 10)
  }
  handle_input(event) {
    if(ui.windows.active !== this) return
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
    if(event.code === "Escape" && (keys.shift || keys.shift_right)) this.reselect()
    else
    if(event.code === "Escape") this.deselect_all()

    if(event.code === "KeyD") this.duplicate_selected()
    if(event.code === "KeyV") this.set_tool("move")
    if(event.code === "KeyR") this.set_tool("rotate")
    if(event.code === "KeyS") this.set_tool("select-object")
    if(event.code === "KeyX") this.delete_selected()
    if(event.code === "KeyA") this.select_all()
  }
  handle_keyup(event) {

  }
  handle_mousemove(event) {
    if(this.state.is("panning")) {
      this.vp_offset.x += mouse.client_moved.x
      this.vp_offset.y += mouse.client_moved.y
    }
    if(this.tool === "move" && this.selected.length > 0 && mouse.keys.left) {
      this.selected.forEach(obj => {
        obj.pos.add(mouse.client_moved)
      })
    }
    if(this.state.is("rotating")) {
      let pos = mouse.client_pos.clone()
      pos.sub(this.vp_offset)
      let obj = this.selected[0]
      let angle = Math.atan2(pos.y - obj.pos.y, pos.x - obj.pos.x)
      let result = angle - this.rotation_data.angle_start
      // console.log(result)
      obj.rotation = this.rotation_data.orig + result
      // if(keys.shift || keys.shift_right) obj.rotation = this.rotation_data.orig + Math.floor((result*180/PI)/90) * 90
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
      if(target.closest(".tool-icon.add-special")) {
        let el = target.closest(".tool-cont")
        let rect = el.getBoundingClientRect()
        
        this.dropdown_special.style.left = rect.x + "px"
        this.dropdown_special.style.top = rect.y + rect.height + 10 + "px"
        this.dropdown_special.classList.toggle("hidden")
      }
      if(target.closest(".tool-icon.edit-hitbox")) {
        if(this.selected.length > 0) {
          let obj = this.selected[0]
          ui.windows.close()
          ui.windows.set(hitbox_editor)
          hitbox_editor.select(obj)
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
      if(target.closest('.icon-export')) {
        this.export()
      }
      if(target.closest('.icon-import')) {
        this.import()
      }
      if(target === this.element && this.tool === "move") {
        let hit = false
        let pos = mouse.client_pos.clone().sub(this.vp_offset)
        this.objects.forEach(obj => {
          if(hit) return
          if(obj.hitbox.type === "circle") {
            if(Collision.pointCircle(pos, obj.hitbox)) hit = true
          }
          if(obj.hitbox.type === "polygon") {
            obj.hitbox.bodies.forEach(body => {
              if(Collision.polygonPoint(body, pos)) hit = true
            })
          }
          if(hit) {
            if(!(keys.shift || keys.shift_right) && !this.previous_selected.find(o => o === obj)) this.deselect_all()
            this.select_obj(obj)
          }
        })
      }
      if(target === this.element && this.tool === "rotate") {
        if(this.selected.length === 0) return
        this.state.set("rotating")
        this.rotation_data.click_origin = mouse.client_pos.clone().sub(this.vp_offset)
        let pos = this.rotation_data.click_origin
        let obj = this.selected[0]
        this.rotation_data.angle_start = Math.atan2(pos.y - obj.pos.y, pos.x - obj.pos.x)
        this.rotation_data.orig = obj.rotation
      }
    }
    if(event.button === 1) {
      this.state.set("panning")
    }
  }
  handle_mouseup(event) {
    if(this.state.is("panning", "rotating")) {
      this.state.revert()
    }
    this.objects.forEach(obj => {
      let hit = false
      let pos = mouse.client_pos.clone().sub(new Vector(this.scene.position.x, this.scene.position.y))
      if(obj.hitbox.type === "circle") {
        if(Collision.pointCircle(pos, obj.hitbox)) {
          if(mouse.client_click_origin.isClose(2, mouse.client_click_end)) hit = true
        }
      }
      if(obj.hitbox.type === "polygon") {
        obj.hitbox.bodies.forEach(body => {
          if(Collision.polygonPoint(body, pos)) {
            if(mouse.client_click_origin.isClose(2, mouse.client_click_end)) hit = true
          }
        })
      }
      if(hit && this.previous_selected.find(o => o === obj)) {
        this.deselect_obj(obj)
        if(debug.location_editor) console.log("removed because it was selected previously")
      }
    })
    this.previous_selected = [...this.selected]
  }
  handle_click(event) {

  }
  update() {
    this.selected.forEach(obj => {
      HitboxTools.draw_bounding_box(obj)
    })
    this.grid_sprite.position.x = Math.floor((0-this.scene.position.x + cw/2) / grid.cell_size) * grid.cell_size - grid.cell_size*2
    this.grid_sprite.position.y = Math.floor((0-this.scene.position.y + ch/2) / grid.cell_size) * grid.cell_size - grid.cell_size

    this.scene.position.set(this.vp_offset.x, this.vp_offset.y)
  }
}