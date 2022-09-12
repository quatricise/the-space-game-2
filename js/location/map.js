class WorldMap extends GameWorldWindow {
  constructor(title, element) {
    super(title, element)
    this.resolution = 1024
    //this hardcoded value is terrible, it represents the 95vh used in the CSS
    this.physical_size = window.innerHeight * 0.95 
    this.app.view.id = "map-canvas"
    let visual_scale_factor =  this.resolution / window.innerHeight * 0.95
    this.state = new State(
      "default",
      "moving_location",
      "moving_image",
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

    this.create_html()
    this.generate_tool_icons()
    this.add_origin()
    this.add_grid()
    this.load()
  }
  set_tool(name) {
    let tool = this.tools.find(t => t === name)
    if(tool) {
      this.tool = tool
      Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
      this.element.querySelector(`[data-toolname="${tool}"`).classList.add('active')
      this.state.set("default")
    }
  }
  generate_tool_icons() {
    this.tools.forEach(t => {
      let cont = El('div', "tool-cont")
      let icon = El('div', "tool-icon " + t)
      cont.append(icon)
      cont.onclick = () => {
        this.set_tool(t)
      }
      cont.title = capitalize(t.replaceAll('-', " "))
      cont.dataset.toolname = t
      Q('#map-toolset').append(cont)
    })
  }
  load() {
    readTextFile("data/worldmap_data.json", function(text) {
      let images = JSON.parse(text)
      images.forEach(img => {
        GameObject.create("map_image", img.name, {transform: new Transform(), scale: img.scale})
        // new MapImage(
        //   new Transform(
        //     new Vector(img.transform.position.x, img.transform.position.y), 
        //     new Vector(),
        //     img.rotation, 
        //     img.angular_velocity
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
    let map_objects = []
    this.images.forEach(img => {
      let record = {
        src: img.src,
        pos: img.transform.position.plain(),
        rotation: img.rotation,
        angular_velocity: img.angular_velocity,
        scale: img.scale
      }
      map_objects.push(record)
    })
    exportToJsonFile(coords, "location_coordinates")
    exportToJsonFile(map_objects, "worldmap_data")
  }
  add_origin() {
    this.origin = {
      transform: new Transform(),
      sprite: new PIXI.Sprite.from("assets/origin.png"),
    }
    this.origin.sprite.position.set(this.origin.transform.position.x, this.origin.transform.position.y)
    this.origin.sprite.anchor.set(0.5)
    this.app.stage.addChild(this.origin.sprite)
  }
  add_grid() {
    this.grid_sprite = new PIXI.TilingSprite(map_grid.texture, 
      4096,
      4096,
    )
    this.grid_sprite.anchor.set(0.5)
    this.stage.addChild(this.grid_sprite)
  }
  create_html() {
    this.element.prepend(this.app.view)
  }
  create_icons() {
    // this.icons = []
    for(let location_name in data.location_coords) {
      GameObject.create("map_icon", location_name, {location: data.location_coords[location_name]})
      // new MapIcon(data.location_coords[location_name], location_name)
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
      obj.transform.angular_velocity, 
      obj.scale
    )
    newobj.transform.position.x += 30
    newobj.transform.position.y += 30
  })
  }
  select(obj) {
    if(!(keys.shift || keys.shift_right)) this.selected = []
    if(this.selected.find(i => i === obj)) return
    this.selected.push(obj)
  }
  deselect_all() {
    this.selected = []
  }
  rename_selected() {
    this.selected.forEach(icon => {
      icon.update_name(window.prompt("Rename", icon.name))
    })
  }
  delete_selected() {
    this.selected.forEach(obj => {
      obj.destroy()
    })
    this.deselect_all()
  }
  add_sprite() {
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
        if(direction === "in") icon.hitbox.radius -= icon.hitbox.radius * (1 -this.camera.zoom_step)
        if(direction === "out") icon.hitbox.radius += icon.hitbox.radius * (1 -this.camera.zoom_step)
      })
    }
    this.camera.zoomInit(direction)
  }
  handle_keydown(event) {
    if(this.state.is("default")) {
      if(event.code === "KeyE") this.save()
      if(event.code === "KeyD") this.duplicate()
      if(event.code === "KeyA" && keys.shift) this.add_sprite()
      if(event.code === "KeyR") this.rename_selected()
      if(event.code === "KeyX") this.delete_selected()
      if(event.code === "Escape") this.deselect_all()
      if(event.code === "NumpadAdd") this.selected.forEach(obj => obj.scale_up())
      if(event.code === "NumpadSubtract") this.selected.forEach(obj => obj.scale_down())
    }
  }
  handle_keyup(event) {

  }
  handle_mousemove(event) {
    if(!mouse.keys.middle) {
      this.icons.forEach(icon => {
        if(Collision.pointCircle(mouse.map_position, icon.hitbox)) {
          icon.hover = true
          icon.show_text()
        }
        else {
          icon.hover = false
          icon.hide_text()
        }
      })
    }
    if(mouse.keys.middle) {
      let moved = mouse.client_moved.clone().mult(this.camera.current_zoom)
      this.focus.transform.position.sub(moved)
    }
    if(mouse.keys.left) {
      if(this.state.is("moving_location")) {
        this.selected.forEach(obj => {
          let moved = mouse.client_moved.clone().mult(this.camera.current_zoom)
          obj.transform.position.add(moved)
        })
      }
      if(this.state.is("moving_image")) {
        this.selected.forEach(obj => {
          let moved = mouse.client_moved.clone().mult(this.camera.current_zoom)
          obj.transform.position.add(moved)
        })
      }
    }
  } 
  handle_mousedown(event) {
    let target = event.target
    if(event.button === 0) {
      let match = false
      if(!(keys.shift || keys.shift_right)) this.deselect_all()
      this.icons.forEach(icon => {
        if(this.locked.icons) return
        if(Collision.pointCircle(mouse.map_position, icon.hitbox)) {
          this.select(icon)
          match = true
          this.state.set("moving_location")
        }
      })
      this.images.forEach(img => {
        if(this.locked.sprites) return
        if(Collision.boxPoint(img.hitbox.bounding_box, mouse.map_position)) {
          this.select(img) 
          match = true
          this.state.set("moving_image")
        }
      })
      if(!match) this.deselect_all()
      if(keys.ctrl) {
        this.create_icon()
      }
      if(target.closest(".tool-icon.add-sprite")) {
        this.add_sprite()
      }
      if(target.closest(".tool-icon.lock-sprite")) {
        target.closest(".tool-icon.lock-sprite").classList.toggle('active')
        this.locked.sprites = !this.locked.sprites
        setTimeout(()=>{this.set_tool("move")},100)
      }
      if(target.closest(".tool-icon.lock-icon")) {
        target.closest(".tool-icon.lock-icon").classList.toggle('active')
        this.locked.icons = !this.locked.icons
        setTimeout(()=>{this.set_tool("move")},100)
      }
    }
  }
  handle_mouseup(event) {
    this.state.set('default')
  }
  handle_click(event) {

  }
  handle_wheel(event) {
    if(mouse.keys.middle) return
    if(keys.shift || keys.shift_right) {
      if(event.deltaY > 0) {
        this.selected.forEach(obj => obj.scale_up())
      }
      else
      if(event.deltaY < 0) {
        this.selected.forEach(obj => obj.scale_down())
      }
    }
    if(!(keys.shift || keys.shift_right)) {
      if(event.deltaY > 0) {
        this.zoom("out")
      }
      else
      if(event.deltaY < 0) {
        this.zoom("in")
      }
    }
  }
    
  update_objects() {
    this.game_objects.map_icon.forEach(icon => {
      icon.container.scale.set(this.camera.current_zoom * (icon.hover / 4 + 1))
      icon.container.position.set(icon.transform.position.x, icon.transform.position.y)
      icon.hitbox.transform.position.set_from(icon.transform.position)
    })
    this.game_objects.map_image.forEach(img => {
      img.container.position.set(img.transform.position.x, img.transform.position.y)
      img.hitbox.transform.position.set_from(img.transform.position)
    })
  }
  update() {
    this.selected.forEach(obj => {
      HitboxTools.draw_bounding_box(obj)
    })
    this.update_objects()
    this.images.forEach(img => img.update())
  }
}