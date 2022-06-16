class Camera  {
  constructor(
    type = "world_camera", 
    context = app.stage, 
    context_dim = {x: window.innerWidth, y: window.innerHeight},
    visual_scale_factor = 1, 
    focus = null
  ) {
    this.type = type
    this.context = context
    this.context_dim = context_dim
    this.context_visual_scale_factor = visual_scale_factor
    this.pos = {
      x: 0,
      y: 0
    }
    this.lockedTo = focus
    this.current_zoom = 1
    this.zoom_levels = [ 0.60, 0.70, 0.82, 1, 1.2, 1.4, 1.6 ]
    this.zoom_step = 0.85 //this is the ratio between zoom levels, use this instead of zoom_levels[]
    this.zoom = {
      start_value: 0, // both values will be set whenever zoomIn or zoomOut is called
      end_value: 0, // both values will be set whenever zoomIn or zoomOut is called
      current_time: 0, // ms
      duration: 400, // ms
      easing_function: easeInOutQuad,
      active: false,
    }
    cameras.push(this)
  }
  lockTo(object) { //any Entity
    //this smoothly transitions the camera from player, to an objects origin
    this.lockedTo = object
  }
  updatePosition() {
    this.pos.x = this.lockedTo.pos.x
    this.pos.y = this.lockedTo.pos.y
  }
  update() {
    this.updatePosition()
    this.context.position.x = (-this.pos.x / this.current_zoom + this.context_dim.x/2) * this.context_visual_scale_factor
    this.context.position.y = (-this.pos.y / this.current_zoom + this.context_dim.y/2) * this.context_visual_scale_factor
    this.context.scale.set(1/this.current_zoom * this.context_visual_scale_factor)

    grid.sprite.position.x = Math.floor(this.pos.x / grid.cell_size) * grid.cell_size - grid.cell_size*2
    grid.sprite.position.y = Math.floor(this.pos.y / grid.cell_size) * grid.cell_size - grid.cell_size

    this.zoom_interpolate()
  }
  zoom_interpolate() {
    if(!this.zoom.active) return

    let zoom_increment = Math.abs(this.zoom.start_value - this.zoom.end_value)

    if(this.zoom.start_value < this.zoom.end_value) this.current_zoom = this.zoom.start_value + this.zoom.easing_function(this.zoom.current_time, 0, zoom_increment, this.zoom.duration)
    if(this.zoom.start_value > this.zoom.end_value) this.current_zoom = this.zoom.start_value - this.zoom.easing_function(this.zoom.current_time, 0, zoom_increment, this.zoom.duration)
    this.zoom.current_time += 1000 * dt
    // console.log("current zoom: " + this.current_zoom)
    if(this.zoom.current_time >= this.zoom.duration) {
      this.current_zoom = this.zoom.end_value
      this.zoom.active = false
      this.zoom.current_time = 0
    }
  }
  zoomInit(direction) {
    if(this.zoom.active) return

    let match = this.zoom_levels.find(number => number === this.current_zoom)
    let index = this.zoom_levels.indexOf(match)
    this.zoom.start_value = this.current_zoom
    if(direction === "in") this.zoom.end_value = this.zoom_levels[Math.min(index + 1, this.zoom_levels.length - 1)]
    if(direction === "out") this.zoom.end_value = this.zoom_levels[Math.max(0, index - 1)]
    
    if(debug.camera) console.log("zoom starting value: " + this.zoom.start_value)
    if(debug.camera) console.log("zoom end value: " + this.zoom.end_value)

    if(this.zoom.end_value === this.zoom.start_value) return
    this.zoom.active = true
  }
  position_interpolate() {

  }
}
