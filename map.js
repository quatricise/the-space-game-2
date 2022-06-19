class WorldMap {
  constructor() {
    this.resolution = 1024
    this.physical_size = window.innerHeight * 0.95 //todo this hardcoded value is terrible, it represents the 95vh used in the CSS
    this.visual_scale_factor =  this.resolution / window.innerHeight * 0.95
    this.origin = {
      pos: new Vector(this.resolution/2,this.resolution/2)
    }
    //the pixi app
    this.canvas = new PIXI.Application({ width: this.physical_size, height: this.physical_size, backgroundAlpha: 1 });
    this.canvas.view.id = "map-canvas"
    this.canvas.stage.pivot.set(this.origin.pos.x, this.origin.pos.y)
    //graphics renderer
    this.graphics = new PIXI.Graphics()
    this.canvas.stage.addChild(this.graphics)
    this.stage = this.canvas.stage
    //add view to the DOM
    this.parent = Q('#map-ui-container')
    this.parent.prepend(this.canvas.view)
    //add a camera to this
    this.camera = new Camera(
      "map_camera", 
      this.stage, 
      { x: this.physical_size, y: this.physical_size }, 
      this.visual_scale_factor, this.origin
    )

    this.open = false

    //the camera is just a fucking stupid idea, this class doesn't need a camera object
    // it just needs its own zoom function

    this.locations = data.locations
    this.sprites = []
    for (let prop in this.locations) {
      let sprite = PIXI.Sprite.from("assets/icons/worldmap_star_system_connected.png")
      sprite.anchor.set(0.5)
      sprite.position.set(this.locations[prop].pos.x, this.locations[prop].pos.y)
      this.sprites.push(sprite)
      this.stage.addChild(sprite)
    }
  }
  zoom(direction = "in" || "out") {
    this.camera.zoomInit(direction)
  }

  draw() {
    if(state.current !== "map_open") return
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
  updateSprites() {
    this.sprites.forEach(sprite => {
      sprite.scale.set(this.camera.current_zoom)
    })
  }
  update() {
    this.updateSprites()
    this.draw()
  }
  toggleVisibility() {
    this.parent.classList.toggle("hidden")
  }
}
