class LocationEditor extends GameWorldWindow {
  constructor(title, element) {
    super(title, element)
    this.app.view.classList.add("location-editor-app")
    this.camera_anchor = {
      transform: new Transform()
    }
    this.context_window = Q('#location-editor-context-window')
    this.loc_pos = new Vector(0)
    this.state = new State(
      "default",
      "adding_obj",
      "adding_spawn",
      "panning",
      "rotating",
      "dragging_context_window",
      "painting_fog",
      "erasing_fog",
    )
    this.tools = [
      "move",
      "select-object",
      "add-special",
      "rotate",
      "edit-hitbox",
      "add_spawn",
      "randomize-rotation",
      "move_spawns_along",
      "fog-paint",
      "fog-eraser",
    ]
    this.special_objects = [
      "random_spawner", //select a spawn pool, add min and max spawns, add object weights, randomize velocity, rotation
      "location_randomizer", //spawn one object, but let the game decide from multiple places where it can put it
      "interactable",
      "ultraport_beacon",
    ]
    this.selected = []
    this.dragged = null
    this.previous_selected = []
    this.select_delay = 55
    this.active_object = {
      // path: ["array", "of", "strings"],
      name: null,
      type: "object"
    }
    this.rotation_data = {
      click_origin: new Vector(),
      angle_start: 0,
      angle_now: 0,
      pivot: new Vector(),
      orig: 0,
    }
    this.fog_placed = 0
    this.fog_removed = 0
    this.brush_spacing = 50
    this.eraser_radius = 50
    this.fog = []
    this.move_spawns_along = false
    this.dropdown = this.element.querySelector(".search-dropdown-window")
    this.dropdown_special = this.element.querySelector(".special-dropdown-window")
    this.obj_selector = this.element.querySelector(".selected-object-cont")
    this.camera.lock_to(this.camera_anchor)
    this.generated_object_list = false
    this.generate_icons()
    this.generate_special_list()
    this.set_tool(this.tools[0])
    this.add_origin()
  }
  import() {
    let name = window.prompt("location name", "location001")
    this.objects = []
    readTextFile("data/locations/" + name + ".json", (text) => {
      let loc = JSON.parse(text)
      this.location_name = loc.name
      this.loc_pos = new Vector(loc.pos.x, loc.pos.y)
      loc.objects.forEach(obj => {
        let newobj
        let pos = new Vector(obj.pos.x, obj.pos.y)
        let vel = new Vector(obj.vel.x, obj.vel.y)
        let rotation = obj.transform.rotation
        let angular_velocity = obj.transform.angular_velocity
        console.log(`hitboxes aren't saved correctly, only references to json files work so far`)
        if(obj.type === "ship") newobj = new Ship(pos, vel, rotation, angular_velocity, obj.name)
        if(obj.type === "asteroid") newobj = new Asteroid(pos, vel, rotation, angular_velocity, obj.name)
        if(obj.type === "debris") newobj = new Debris(pos, vel, rotation, angular_velocity, obj.name)

        if(newobj) {
          this.objects.push(newobj)
          newobj.add_to_stage(this.stage)
        }
      })
      this.load_fog(loc.fog)
      Q('#location-editor-name').innerText = this.location_name
    })
  }
  export() {
    let loc = {}
    loc.name = this.location_name
    loc.pos = this.loc_pos.plain()
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
        angular_velocity: obj.angular_velocity,
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
    this.stage.addChild(this.origin)
  }
  generate_icons() {
    this.tools.forEach(t => {
      let cont = El('div', "tool-cont")
      let icon = El('div', "tool-icon " + t)
      cont.append(icon)
      cont.onclick = () => {
        this.set_tool(t)
      }
      cont.title = t.replaceAll('-', " ").replaceAll("_", " ").cap()
      cont.dataset.toolname = t
      Q('#location-editor-toolset').append(cont)
    })
  }
  generate_special_list() {
    console.warn("generate_special_list() merge with generate_object_list() and ")
    let list = this.element.querySelector(".special-dropdown-window .dropdown-list")
    this.special_objects.forEach(obj => {
      let el = El("div", "dropdown-item special", undefined, obj.replaceAll("_", ' ').cap())
      el.dataset.name = obj
      el.dataset.type = obj
      list.append(el)
    })
  }
  generate_object_list() {
    console.warn("generate_object_list() needs refactor")
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
      if(debug.location_editor) console.log(d)
      let img = new Image(); img.src = d.sources.folder + "thumbnail.png"
      img.style.position = "absolute"
      let cont = El('div', "dropdown-item object", [["title", "Add to location"]])
      let name = keys[index].replaceAll("_", ' ').cap()
      let desc = El('div', "dropdown-desc", undefined, name) 
      let image_cont = El('div', "dropdown-image")
      image_cont.append(img)
      // cont.dataset.path = paths[index]
      cont.dataset.name = names[index]
      cont.dataset.type = types[index]
      cont.append(image_cont, desc)
      list.append(cont)
    })

    if(debug.location_editor) console.log(d)
    this.generated_object_list = true
  }
  set_tool(name) {
    let tool = this.tools.find(t => t === name)
    if(tool) {
      this.prev_tool = this.tool
      this.tool = tool
      Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
      this.element.querySelector('[data-toolname="' + tool + '"').classList.add('active')
      if(tool !== "select-object") this.dropdown.classList.add("hidden")
      if(tool !== "add-special") this.dropdown_special.classList.add("hidden")
      this.state.set("default")
    }
  }
  revert_tool() {
    this.set_tool(this.prev_tool)
    if(this.tool === "select-object") this.state.set("adding_obj")
    if(this.tool === "add-special") this.state.set("adding_obj")
  }
  context_window_open() {
    if(this.selected.length > 1) return
    let obj = this.selected[0]
    this.context_window.classList.remove('hidden')
  }
  context_window_close() {
    this.context_window.classList.add('hidden')
  }
  context_window_refresh() {
    if(this.selected.length !== 1) return
    let obj = this.selected[0]
    Array.from(this.context_window.querySelectorAll(".temp")).forEach(prop => prop.remove())

    const create_prop = (prop) => {
      let cont = El("div", "property temp")
      let key = El("div", "key", undefined, prop + ": ")
      let value = El("div", "value", undefined, obj[prop])
      cont.dataset.property = prop
      cont.dataset.datatype = typeof obj[prop]
      cont.append(key, value)
      this.context_window.append(cont)
    }
    if(obj instanceof RandomSpawner) {
      let props = ["radius", "spawns_min", "spawns_max"]
      props.forEach(prop => create_prop(prop))
      obj.objects.forEach(o => {
        obj.generate_thumbnail(o.type, o.name, o.src)
      })
    }
    if(obj instanceof RandomSpawnerSpawn) {
      let props = ["weight"]
      props.forEach(prop => create_prop(prop))
    }
    if(obj instanceof Asteroid) {
      let props = ["rotation", "angular_velocity"]
      props.forEach(prop => create_prop(prop))
    }
    if(obj instanceof Ship) {
      let props = ["rotation", "angular_velocity", "pilot"]
      props.forEach(prop => create_prop(prop))
    }
    if(obj instanceof Interactable) {
      let props = ["radius"]
      props.forEach(prop => create_prop(prop))
    }
    
  }  
  add_object(name, type) {
    let pos = mouse.location_editor_position.clone()
    let vel = new Vector(0,0)
    let rotation = 0
    let angular_velocity = 0
    if(this.randomize_rotation) rotation = Math.random() * PI*2
    let obj = GameObject.create(
      type,
      name, 
      {
        pos: pos, 
        vel: vel, 
        rotation: rotation, 
        angular_velocity: angular_velocity 
      }, {world: this})
  }
  add_special() {
    throw "Don't use add_special()"
    if(this.active_object.type !== "special") return
    let pos = mouse.location_editor_position.clone()
    let object = GameObject.create("special_object", this.active_object.name, {pos: pos})
    // if(this.active_object.name === "location_randomizer") {
    //   object = new LocationRandomizer(pos)
    // }
    // if(this.active_object.name === "interactable") {
    //   object = new Interactable(pos, new BoxHitbox(300, 300), ["show_hint"], ["hide_hint"], "Investigate", null)
    // }
    // if(this.active_object.name === "random_spawner") {
    //   object = new RandomSpawner(pos, {type: "circle", radius: 50}, 250)
    // }
    // if(this.active_object.name === "ultraport_beacon") {
    //   object = new UltraportBeacon(pos)
    // }
    if(!object) throw "No object was chosen by add_special()"
  }
  select_obj(obj) {
    if(this.selected.find(o => o === obj)) return
    setTimeout(()=> 
    {
      this.selected.push(obj)
      if(debug.location_editor) console.log('selected obj', obj)
      this.context_window_refresh()
    },
    this.select_delay)
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
  reset_rotation() {
    console.log('f')
    this.selected.forEach(o => o.rotation = 0)
  }
  delete_selected() {
    let objs = this.selected
    this.deselect_all()
    objs.forEach(obj => obj.destroy())
    this.objects = this.objects.filter(obj => 
      objs.find(o => o === obj) == null
    )
  }
  duplicate_selected() {
    let duplicates = []
    this.selected.forEach(obj => {
      let newobj
      if(obj instanceof Ship) newobj = new Ship(obj.pos.clone(), obj.vel.clone(),obj.rotation, obj.angular_velocity, obj.name)
      if(obj instanceof Asteroid) newobj = new Asteroid(obj.pos.clone(), obj.vel.clone(),obj.rotation, obj.angular_velocity, obj.name)
      newobj.pos.x += 50
      newobj.pos.y += 50
      newobj.add_to_stage(this.stage)
      this.objects.push(newobj)
      duplicates.push(newobj)
    })
    this.deselect_all()
    duplicates.forEach(dup => this.select_obj(dup))
    setTimeout(()=> {this.previous_selected = [...this.selected]}, this.select_delay + 10)
  }
  add_fog(
    alpha = clamp(mouse.pressure * 3, 0.2, 1.0),
    position = mouse.location_editor_position.clone(),
    from_file = false,
  ) {
    if(!from_file && mouse.travelled < Math.floor(this.fog_placed) * this.brush_spacing) return
    let fog = PIXI.Sprite.from("assets/fog_dab.png")
    fog.position.set(position.x, position.y)
    fog.anchor.set(0.5)
    fog.alpha = alpha
    fog.rotation = rand(0, TAU)
    fog.scale.set(0.5 + alpha)
    this.stage.addChild(fog)
    this.fog.push(fog)
    this.fog_placed++
  }
  remove_fog() {
    if(mouse.travelled < Math.floor(this.fog_removed) * this.brush_spacing) return
    let pos = mouse.location_editor_position.clone()
    for(let i = 0; i < this.fog.length; i++) {
      let f = this.fog[i]
      let vec = new Vector(f.position.x, f.position.y)
      if(vec.isClose(this.eraser_radius, pos)) {
        this.fog.remove(f)
        this.stage.removeChild(f)
        break
      }
    }
    this.fog_removed++
  }
  load_fog(fog_array) {
    fog_array.forEach(f => {
      this.add_fog(f.alpha, f.pos, true)
    })
  }
  //#region input handlers
  handle_keydown(event) {
    if(event.code === "Escape" && (keys.shift || keys.shift_right)) this.reselect()
    else if(event.code === "Escape") this.deselect_all()

    if(event.code === "KeyD") this.duplicate_selected()
    if(event.code === "KeyV") this.set_tool("move")
    if(event.code === "KeyR" && !keys.alt) this.set_tool("rotate")
    if(event.code === "KeyR" && keys.alt) this.reset_rotation()
    if(event.code === "KeyS") this.set_tool("select-object")
    if(event.code === "KeyX") this.delete_selected()
    if(event.code === "KeyA") this.select_all()
    if(event.code === "KeyE") this.context_window_open()
    if(event.code === "KeyN") this.state.set("adding_spawn")
  }
  handle_keyup(event) {

  }
  handle_mousemove(event) {
    let local_moved = mouse.client_moved.clone().mult(this.camera.current_zoom)
    if(this.state.is("panning")) {
      this.camera_anchor.pos.sub(local_moved)
      // console.log(this.camera.pos)
    }
    if(this.tool === "move" && this.selected.length > 0 && mouse.keys.left && this.state.isnt("dragging_context_window")) {
      this.selected.forEach(obj => {
        obj.pos.add(local_moved)
        if(obj instanceof LocationRandomizer && this.move_spawns_along) {
          obj.spawns.forEach(spawn => spawn.pos.add(local_moved))
        }
        if(obj instanceof RandomSpawner) {
          obj.objects.forEach(o => o.pos.add(local_moved))
        }
      })
    }
    if(this.state.is("dragging_context_window")) {
      let left = this.context_window.getBoundingClientRect().x
      let top = this.context_window.getBoundingClientRect().y
      this.context_window.style.left = (left + mouse.client_moved.x) + "px"
      this.context_window.style.top = (top + mouse.client_moved.y) + "px"
    }
    if(this.state.is("rotating")) {
      if(this.selected.length === 1) {
        let pos = mouse.location_editor_position.clone()
        let obj = this.selected[0]
        let angle = Math.atan2(pos.y - obj.pos.y, pos.x - obj.pos.x)
        let result = angle - this.rotation_data.angle_start
        obj.rotation = this.rotation_data.orig + result
      }
      if(this.selected.length > 1) {
        let pos = mouse.location_editor_position.clone()
        let pivot = this.rotation_data.pivot
        let angle = Math.atan2(pos.y - this.rotation_data.pivot.y, pos.x - this.rotation_data.pivot.x)
        let result = angle - this.rotation_data.angle_start
        this.rotation_data.angle_start = angle
        console.log(pos, pivot, angle, result)
        this.selected.forEach(obj => {
          obj.pos.rotate_around(pivot, result)
        })
      }
      //i tried making rotation snap to 90deg intervals
      // if(keys.shift || keys.shift_right) obj.rotation = this.rotation_data.orig + Math.floor((result*180/PI)/90) * 90
    }
    if(this.state.is("painting_fog")) this.add_fog()
    if(this.state.is("erasing_fog")) this.remove_fog()
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

        if(!this.generated_object_list) this.generate_object_list()
      } 
      if(target.closest(".drag-widget")) {
        let dragged = target.closest(".draggable")
        this.state.set("dragging_context_window")
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
        
        this.dropdown_special.style.left = rect.x + "px"
        this.dropdown_special.style.top = rect.y + rect.height + 10 + "px"
        this.dropdown_special.classList.toggle("hidden")
      }
      if(target.closest(".tool-icon.edit-hitbox")) {
        if(this.selected.length > 0) {
          let obj = this.selected[0]
          program.windows.close()
          program.windows.set(hitbox_editor)
          hitbox_editor.select(obj)
        }
      }
      if(target.closest(".tool-icon.move_spawns_along")) {
        this.move_spawns_along = !this.move_spawns_along
        target.closest(".tool-icon.move_spawns_along").classList.toggle('active')

        setTimeout(()=> {this.revert_tool()},100)
      }
      if(target.closest(".tool-icon.randomize-rotation")) {
        this.randomize_rotation = !this.randomize_rotation
        target.closest(".tool-icon.randomize-rotation").classList.toggle('active')
        setTimeout(()=> {this.revert_tool()},100)
      }
      if(target.closest(".dropdown-item.object")) {
        let item = target.closest(".dropdown-item.object")
        // let path = item.dataset.path.split(".")
        this.active_object.type = item.dataset.type
        this.active_object.name = item.dataset.name
        // this.active_object.path = path
        this.dropdown.classList.add("hidden")
        let img_cont = item.querySelector(".dropdown-image").cloneNode(true)
        Array.from(img_cont.children).forEach(img => img.style = "")
        img_cont.classList.replace("dropdown-image", "selected-object-icon")
        let text = item.querySelector(".dropdown-desc").innerText
        let desc = El("div", "selected-object-desc", undefined, text)
        this.obj_selector.innerHTML = ""
        this.obj_selector.append(img_cont, desc)

        this.state.set("adding_obj")
      }
      if(target.closest(".property .value")) {
        let prop = target.closest(".property").dataset.property
        let datatype = target.closest(".property").dataset.datatype
        let newval = window.prompt("Enter new value for " + prop, this.selected[0][prop])
        if(datatype === "number") this.selected[0][prop] = +newval
        if(datatype === "string") this.selected[0][prop] = newval
        mouse.keys.left = false
        this.context_window_refresh()
      }
      if(target.closest(".context-window-thumbnail")) {
        let cont = this.context_window.querySelector(".object-properties")
        //if basically this is RandomSpawnerSpawn, then we generate some specific properties
      }
      if(target.closest(".dropdown-item.special")) {
        this.active_object.type = target.closest(".dropdown-item.special").dataset.type
        this.active_object.name = target.closest(".dropdown-item.special").dataset.name
        this.state.set("adding_obj")
        this.dropdown_special.classList.add("hidden")
      }
      if(target === this.element && this.state.is("adding_obj")) {
        let hit = false
        this.game_objects.all.forEach(obj => {
          if(!(obj instanceof LocationRandomizer) && !(obj instanceof RandomSpawner)) return
          if(Collision.pointCircle(mouse.location_editor_position, obj.hitbox)) {
            if(obj instanceof LocationRandomizer) {
              hit = true
              obj.set_object(this.active_object.type, this.active_object.name)
            }
            if(obj instanceof RandomSpawner) {
              hit = true
              obj.add_object(this.active_object.type, this.active_object.name, 0, 0, 1)
            }
          }
        })
        if(!hit) this.add_object(this.active_object.name, this.active_object.type)
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
          let pos = mouse.location_editor_position.clone()
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
          //     if(!(keys.shift || keys.shift_right) && !this.previous_selected.find(o => o === obj)) this.deselect_all()
          //     this.select_obj(obj)
          //   }
          // })
          this.game_objects.all.forEach(obj => {
            if(hit) return
            if(!obj.hitbox) return
            if(Collision.auto(pos, obj.hitbox)) hit = true
            if(hit) {
              if(!(keys.shift || keys.shift_right) && !this.previous_selected.find(o => o === obj)) this.deselect_all()
              this.select_obj(obj)
            }
          })
        }
        if(this.tool === "add_spawn") {
          if(!(this.selected[0] instanceof LocationRandomizer) || this.selected.length > 1) return
          this.selected[0].add_spawn(mouse.location_editor_position)
        }
        if(this.tool === "rotate") {
          if(this.selected.length === 0) return
          this.state.set("rotating")
          this.rotation_data.click_origin = mouse.location_editor_position.clone()
          if(this.selected.length === 1) {
            let pos = this.rotation_data.click_origin
            let obj = this.selected[0]
            this.rotation_data.angle_start = Math.atan2(pos.y - obj.pos.y, pos.x - obj.pos.x)
            this.rotation_data.orig = obj.rotation
          }
          else {
            let pos = this.rotation_data.click_origin
            let positions = this.selected.map(s => s.pos)
            let pivot = Vector.avg(...positions)
            this.rotation_data.pivot = pivot
            this.rotation_data.angle_start = Math.atan2(pos.y - pivot.y, pos.x - pivot.x)
          }

        }
        if(this.tool === "fog-paint") {
          this.add_fog()
          this.state.set("painting_fog")
        }
        if(this.tool === "fog-eraser") {
          this.remove_fog()
          this.state.set("erasing_fog")
        }
      }
    }
    if(event.button === 1) {
      this.state.set("panning")
    }
  }
  handle_mouseup(event) {
    if(this.state.is("panning", "rotating", "dragging_context_window", "painting_fog", "erasing_fog")) {
      this.state.revert()
    }
    this.fog_placed = 0
    this.fog_removed = 0
    // this.objects.forEach(obj => {
    //   let hit = false
    //   let pos = mouse.client_pos.clone().sub(new Vector(this.stage.position.x, this.stage.position.y))
    //   if(obj.hitbox.type === "circle") {
    //     if(Collision.pointCircle(pos, obj.hitbox)) {
    //       if(mouse.client_click_origin.isClose(2, mouse.client_click_end)) hit = true
    //     }
    //   }
    //   if(obj.hitbox.type === "polygon") {
    //     obj.hitbox.bodies.forEach(body => {
    //       if(Collision.polygonPoint(body, pos)) {
    //         if(mouse.client_click_origin.isClose(2, mouse.client_click_end)) hit = true
    //       }
    //     })
    //   }
    //   if(hit && this.previous_selected.find(o => o === obj)) {
    //     this.deselect_obj(obj)
    //     if(debug.location_editor) console.log("removed because it was selected previously")
    //   }
    // })
    this.game_objects.all.forEach(obj => {
      if(!obj.hitbox) return
      let hit = false
      let pos = mouse.client_pos.clone().sub(new Vector(this.stage.position.x, this.stage.position.y))
      if(
        Collision.auto(pos, obj.hitbox) 
        && 
        mouse.client_click_origin.isClose(2, mouse.client_click_end)
      ) {
        hit = true
      }
      if(hit && this.previous_selected.find(o => o === obj)) {
        this.deselect_obj(obj)
      }
    })
    this.previous_selected = [...this.selected]
  }
  handle_click(event) {

  }
  handle_wheel(event) {
    if(event.deltaY < 0) {
      this.camera.zoomInit("in")
    }
    else
    if(event.deltaY > 0) {
      this.camera.zoomInit("out")
    }
  }
  //#endregion
  update_cursor_overlays() {
    let mpos = mouse.location_editor_position.clone()
    if(this.tool === "fog-eraser") {
      this.graphics.lineStyle(2, 0xffffff, 1);
      this.graphics.drawCircle(mpos.x, mpos.y, this.eraser_radius)
      this.graphics.closePath();
    }
  }
  update() {
    this.update_cursor_overlays()
    this.selected.forEach(obj => {
      Hitbox.draw_bounding_box(obj, this.graphics)
      if(obj instanceof RandomSpawner) {
        this.graphics.lineStyle(2, debug.colors.hitbox_no_collision, 1);
        this.graphics.drawCircle(obj.pos.x, obj.pos.y, obj.radius)
        this.graphics.closePath();
      }
    })
    // this.objects.forEach(obj => {
    //   Hitbox.draw(obj, this.graphics)
    //   if(obj instanceof LocationRandomizer) obj.spawns.forEach(spawn => Hitbox.draw(spawn, this.graphics))
    // })
    this.grid_sprite.position.x = Math.floor((0-this.stage.position.x + cw/2) / grid.cell_size) * grid.cell_size - grid.cell_size*2
    this.grid_sprite.position.y = Math.floor((0-this.stage.position.y + ch/2) / grid.cell_size) * grid.cell_size - grid.cell_size
  }
}