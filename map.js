class WorldMap {
  constructor() {
    this.resolution = 1024
    this.physical_size = window.innerHeight * 0.95 //todo this hardcoded value is terrible, it represents the 95vh used in the CSS
    
    this.element = Q('#map-ui-container')
    this.focus = {
      pos: new Vector(0)
    }
    this.app = new PIXI.Application({ width: this.physical_size, height: this.physical_size, backgroundAlpha: 1 });
    this.app.view.id = "map-canvas"
    this.graphics = new PIXI.Graphics()
    this.app.stage.addChild(this.graphics)
    this.stage = this.app.stage
    
    
    let visual_scale_factor =  this.resolution / window.innerHeight * 0.95
    this.camera = new Camera(
      this.stage, 
      new Vector(this.physical_size),
      this.focus,
      visual_scale_factor
    )
    this.state = new State(
      "default",
      "moving_location",
      "moving_image",
    )
    this.tools = [
      "move",
      // "add-icon",
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

    //the camera is just a fucking stupid idea, this class doesn't need a camera object
    // it just needs its own zoom function
    this.create_html()
    this.generate_tool_icons()
    this.add_origin()
    this.add_grid()
    this.load()
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
        new MapImage(img.src, new Vector(img.pos.x, img.pos.y), img.rotation, img.rotation_velocity, img.scale)
      })
    })
  }
  save() {
    let coords = {}
    this.icons.forEach(icon => {
      coords[icon.name] = icon.pos.plain()
      coords[icon.name].type = icon.type
    })
    let map_objects = []
    this.images.forEach(img => {
      let record = {
        src: img.src,
        pos: img.pos.plain(),
        rotation: img.rotation,
        rotation_velocity: img.rotation_velocity,
        scale: img.scale
      }
      map_objects.push(record)
    })
    exportToJsonFile(coords, "location_coordinates")
    exportToJsonFile(map_objects, "worldmap_data")
  }
  add_origin() {
    this.origin = {
      pos: new Vector(0),
      sprite: new PIXI.Sprite.from("assets/origin.png"),
    }
    this.origin.sprite.position.set(this.origin.pos.x, this.origin.pos.y)
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
    this.icons = []
    for(let loc in data.location_coords) {
      new MapIcon(data.location_coords[loc], loc)
    }
  }
  duplicate() {
    this.selected.forEach(obj => {
    let newobj
    if(this.selected[0] instanceof MapIcon) newobj = new MapIcon(obj.pos, obj.name)
    if(this.selected[0] instanceof MapImage) newobj = new MapImage(obj.img.src, obj.pos, obj.rotation, obj.rotation_velocity, obj.scale)
    newobj.pos.x += 30
    newobj.pos.y += 30
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
    if(sources) sources.replaceAll(" ", "").split(",")
    if(sources.length === 0) return
    sources.forEach(src => {
      new MapImage("assets/map/" + src + ".png", new Vector(0), 0, 0)
    })
  }
  zoom(direction = "in" || "out") { 
    if(!this.camera.zoom.active) 
    this.icons.forEach(icon => {
      if(direction === "in") icon.hitbox.radius -= icon.hitbox.radius * (1 -this.camera.zoom_step)
      if(direction === "out") icon.hitbox.radius += icon.hitbox.radius * (1 -this.camera.zoom_step)
    })
    this.camera.zoomInit(direction)
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
      case "wheel"      : {this.handle_wheel(event); break;}
    }
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
        if(Collision.pointCircle(mouse.map_pos, icon.hitbox)) {
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
      this.focus.pos.sub(moved)
    }
    if(mouse.keys.left) {
      if(this.state.is("moving_location")) {
        this.selected.forEach(obj => {
          let moved = mouse.client_moved.clone().mult(this.camera.current_zoom)
          obj.pos.add(moved)
        })
      }
      if(this.state.is("moving_image")) {
        this.selected.forEach(obj => {
          let moved = mouse.client_moved.clone().mult(this.camera.current_zoom)
          obj.pos.add(moved)
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
        if(Collision.pointCircle(mouse.map_pos, icon.hitbox)) {
          this.select(icon)
          match = true
          this.state.set("moving_location")
        }
      })
      this.images.forEach(img => {
        if(this.locked.sprites) return
        if(Collision.boxPoint(img.hitbox.bb, mouse.map_pos)) {
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
    this.icons.forEach(icon => {
      icon.sprite.scale.set(this.camera.current_zoom * (icon.hover/4 + 1))
      icon.sprite.position.set(icon.pos.x, icon.pos.y)
      icon.hitbox.pos.set_from(icon.pos)
    })
    this.images.forEach(img => {
      img.sprite.position.set(img.pos.x, img.pos.y)
      img.hitbox.pos.set_from(img.pos)
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


class MapIcon {
  constructor(location, location_name) {
    this.pos = new Vector(location.x, location.y)
    this.type = location.type
    this.name = location_name
    this.hover = false
    this.hitbox = new CircleHitbox(20)
    this.font_size = 16
    this.create_sprite()
    this.create_text()

    map.icons.push(this)
  }
  create_sprite() {
    if(this.type === "connected") this.sprite = PIXI.Sprite.from("assets/icons/worldmap_star_system_connected.png")
    if(this.type === "outback") this.sprite = PIXI.Sprite.from("assets/icons/worldmap_star_system_outback.png")
    this.sprite.anchor.set(0.5)
    this.sprite.position.set(this.pos.x, this.pos.y)
    map.stage.addChild(this.sprite)
  }
  create_text() {
    this.text = new PIXI.Text(this.name, {fontFamily: "space", fill: "0xffffff"})
    this.text.position.set(this.pos.x + 30, this.pos.y - 15)
    map.stage.addChild(this.text)
  }
  show_text() {
    map.stage.addChild(this.text)
    this.text.position.set(this.pos.x + 10 + (20 * map.camera.current_zoom), this.pos.y -  5 - (5 * map.camera.current_zoom))
    this.text.style.fontSize = this.font_size * map.camera.current_zoom
  }
  hide_text() {
    map.stage.removeChild(this.text)
  }
  update_name(name) {
    if(!name) return
    this.name = name
    this.text.text = name
  }
  destroy() {
    map.icons.splice(map.icons.indexOf(this), 1)
    this.sprite.destroy()
    this.text.destroy()
  }
}

class MapImage {
  constructor(src, pos = new Vector(0), rotation = 0, rotation_velocity = 0, scale = 1) {
    this.src = src
    this.scale = scale
    this.img = new Image()
    this.img.src = src
    this.img.onload = () => {this.hitbox.w = this.img.naturalWidth * this.scale; this.hitbox.h = this.img.naturalHeight * this.scale}

    this.pos = pos.clone()
    this.rotation = rotation
    this.rotation_velocity = rotation_velocity
    this.hitbox = new BoxHitbox(50, 50)
    this.sprite = PIXI.Sprite.from(src)
    this.sprite.anchor.set(0.5)
    this.sprite.position.set(this.pos.x, this.pos.y)
    this.sprite.scale.set(scale)
    map.images.push(this)
    map.stage.addChild(this.sprite)
  }
  scale_down() {
    this.scale = this.sprite.scale.x * this.scale_step
    this.hitbox.w *= this.scale_step
    this.hitbox.h *= this.scale_step
  }
  scale_up() {
    this.scale = this.sprite.scale.x / this.scale_step
    this.hitbox.w /= this.scale_step
    this.hitbox.h /= this.scale_step
  }

  update() {
    this.sprite.position.set(this.pos.x, this.pos.y)
    this.sprite.scale.set(this.scale)
  }
  destroy() {
    map.images.splice(map.images.indexOf(this), 1)
    this.sprite.destroy()
  }
  get scale_step() {
    return 0.9
  }
}