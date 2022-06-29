class Camera  {
  constructor(
    context, 
    context_dim = {x: window.innerWidth, y: window.innerHeight},
    locked_to = null,
    base_zoom = 1,
    // zoom_levels = [ 0.60, 0.70, 0.82, 1, 1.2, 1.4, 1.6 ]
  ) {
    this.context = context
    this.context_dim = context_dim
    this.pos = new Vector(0)
    this.locked_to = locked_to
    this.current_zoom = base_zoom
    // this.zoom_levels = zoom_levels
    this.zoom = {
      start_value: 0, // both values will be set whenever zoomIn or zoomOut is called
      end_value: 0, // both values will be set whenever zoomIn or zoomOut is called
      current_time: 0,
      duration: 350,
      easing_function: easeInOutQuad,
      active: false,
    }
    cameras.push(this)
  }
  lock_to(object) { //any {} that contains a pos Vector
    this.locked_to = object
  }
  updatePosition() {
    // console.log(this.locked_to.pos)
    this.pos.set_from(this.locked_to.pos)
  }
  update() {
    // console.log(this.locked_to)
    this.updatePosition()
    this.context.position.x = (-this.pos.x / this.current_zoom + this.context_dim.x/2)
    this.context.position.y = (-this.pos.y / this.current_zoom + this.context_dim.y/2)
    this.context.scale.set(1/this.current_zoom)
    this.zoom_interpolate()
  }
  zoom_interpolate() {
    if(!this.zoom.active) return

    let zoom_increment = Math.abs(this.zoom.start_value - this.zoom.end_value)

    if(this.zoom.start_value < this.zoom.end_value) this.current_zoom = this.zoom.start_value + this.zoom.easing_function(this.zoom.current_time, 0, zoom_increment, this.zoom.duration)
    if(this.zoom.start_value > this.zoom.end_value) this.current_zoom = this.zoom.start_value - this.zoom.easing_function(this.zoom.current_time, 0, zoom_increment, this.zoom.duration)
    this.zoom.current_time += 1000 * dt
    if(this.zoom.current_time >= this.zoom.duration) {
      this.current_zoom = this.zoom.end_value
      this.zoom.active = false
      this.zoom.current_time = 0
    }
  }
  zoomInit(direction) {
    if(this.zoom.active) return
    this.zoom.start_value = this.current_zoom
    if(direction === "in")  this.zoom.end_value = (this.current_zoom * this.zoom_step)
    if(direction === "out") this.zoom.end_value = (this.current_zoom / this.zoom_step)

    if(debug.camera) console.log("zoom start value: " + this.zoom.start_value)
    if(debug.camera) console.log("zoom end value: " + this.zoom.end_value)

    if(this.zoom.end_value === this.zoom.start_value) return
    this.zoom.active = true
    return this.zoom_step
  }
  position_interpolate() {

  }
  get zoom_step() {
    return 0.85
  }
}
