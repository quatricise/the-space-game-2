class WorldMap {
  constructor() {
    this.resolution = 1024
    this.physical_size = window.innerHeight * 0.95 //todo this hardcoded value is terrible, it represents the 95vh used in the CSS
    
    this.element = Q('#map-ui-container')
    this.origin = {
      pos: new Vector(0),
      sprite: new PIXI.Sprite.from("assets/origin.png"),
    }
    this.focus = {
      pos: new Vector(0)
    }
    this.origin.sprite.position.set(this.origin.pos.x, this.origin.pos.y)

    this.app = new PIXI.Application({ width: this.physical_size, height: this.physical_size, backgroundAlpha: 1 });
    this.app.view.id = "map-canvas"
    this.graphics = new PIXI.Graphics()
    this.app.stage.addChild(this.graphics)
    this.app.stage.addChild(this.origin.sprite)
    this.stage = this.app.stage
    
    
    let visual_scale_factor =  this.resolution / window.innerHeight * 0.95
    this.camera = new Camera(
      this.stage, 
      new Vector(this.physical_size),
      this.focus,
      visual_scale_factor
    )

    this.open = false

    //the camera is just a fucking stupid idea, this class doesn't need a camera object
    // it just needs its own zoom function
    this.create_html()
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
  create_html() {
    this.element.prepend(this.app.view)
  }
  create_icons() {
    this.icons = []
    // this.locations.forEach(loc => {
    //   let sprite = PIXI.Sprite.from("assets/icons/worldmap_star_system_connected.png")
    //   sprite.anchor.set(0.5)
    //   sprite.position.set(loc.pos.x, loc.pos.y)
    //   this.stage.addChild(sprite)
    //   loc.sprite = sprite
    // })
    for(let loc in data.locations) {
      new MapIcon(data.locations[loc])
    }
    // for (let prop in this.locations) {
    //   let sprite = PIXI.Sprite.from("assets/icons/worldmap_star_system_connected.png")
    //   sprite.anchor.set(0.5)
    //   sprite.position.set(this.locations[prop].pos.x, this.locations[prop].pos.y)
    //   this.sprites.push(sprite)
    //   this.stage.addChild(sprite)
    // }
  }
  zoom(direction = "in" || "out") { 
    if(!this.camera.zoom.active) 
    this.icons.forEach(icon => {
      if(direction === "in") icon.hitbox.radius -= icon.hitbox.radius * (1 -this.camera.zoom_step)
      if(direction === "out") icon.hitbox.radius += icon.hitbox.radius * (1 -this.camera.zoom_step)
    })
    this.camera.zoomInit(direction)
  }
  draw() {
    if(game.state.isnt("map_open")) return
    let graphics = this.graphics
    graphics.clear()

    graphics.lineStyle(2, 0xff00ff, 1);
    graphics.drawCircle(this.origin.pos.x, this.origin.pos.y, 10 * this.camera.current_zoom)
    graphics.closePath();
    graphics.lineStyle(2, 0xffff00, 1);
    graphics.drawCircle(this.stage.position.x, this.stage.position.y, 10 * this.camera.current_zoom)
    graphics.closePath();

    //the real deal - draw the mouse position
    graphics.lineStyle(2, 0x9900ff, 1);
    graphics.drawCircle(mouse.map_pos.x, mouse.map_pos.y, 10 * this.camera.current_zoom)
    graphics.closePath();
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

  }
  handle_keyup(event) {

  }
  handle_mousemove(event) {
    if(!mouse.keys.middle) {
      this.icons.forEach(icon => {
        if(Collision.pointCircle(mouse.map_pos, icon.hitbox)) {
          icon.hover = true
        }
        else icon.hover = false
      })
    }
    if(mouse.keys.middle) {
      let moved = mouse.client_moved.clone().mult(this.camera.current_zoom)
      this.focus.pos.sub(moved)
    }
  } 
  handle_mousedown(event) {
    if(event.button === 0) {
      this.icons.forEach(icon => {
        if(Collision.pointCircle(mouse.map_pos, icon.hitbox)) {
          console.log('hit')
        }
      })
    }
  }
  handle_mouseup(event) {

  }
  handle_click(event) {

  }
  handle_wheel(event) {
    if(event.deltaY > 0) {
      this.zoom("out")
    }
    else
    if(event.deltaY < 0) {
      this.zoom("in")
    }
  }
  updateSprites() {
    // this.origin.sprite.position.set(mouse.map_pos.x, mouse.map_pos.y)
  }
  update_icons() {
    this.icons.forEach(icon => {
      icon.sprite.scale.set(this.camera.current_zoom * (icon.hover/4 + 1))
      icon.hitbox.pos.set_from(icon.pos)
    })
  }
  update() {
    this.updateSprites()
    this.update_icons()
    this.draw()
  }
}


class MapIcon {
  constructor(location) {
    this.pos = new Vector(location.pos.x, location.pos.y)
    this.name = location.name
    this.hover = false
    this.hitbox = new CircleHitbox(20)
    this.create_sprite()
    map.icons.push(this)
  }
  create_sprite() {
    this.sprite = PIXI.Sprite.from("assets/icons/worldmap_star_system_connected.png")
    this.sprite.anchor.set(0.5)
    this.sprite.position.set(this.pos.x, this.pos.y)
    map.stage.addChild(this.sprite)
  }

}