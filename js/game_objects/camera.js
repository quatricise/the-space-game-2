class Camera extends GameObject {
  constructor(
    transform,
    context, 
    context_dim = new Vector(window.innerWidth, window.innerHeight),
    locked_to = null,
    base_zoom = 1,
  ) {
    super(transform)
    this.context = context
    this.context_dim = context_dim
    this.locked_to = locked_to
    this.target = null
    this.current_zoom = base_zoom
    this.zoom = {
      start_value: 0,
      end_value: 0,
      current_time: 0,
      duration: 350,
      active: false,
    }
    this.ease_function = Ease.InOut
    this.state = new State(
      "default",
      "transitioning",
    )
    this.transition_end = () => {
      this.lock_to(this.target)
      this.target = null
      this.state.ifrevert("transitioning")
    }
    this.transition_time_min = 500
    this.timers = new Timer(
      ["transition", 1000, {loop: false, active: false, onfinish: this.transition_end}]
    )
  }
  lock_to(object) {
    if(!object.transform) throw "Can't lock camera to object without transform component"
    this.locked_to = object
  }
  position_update() {
    if(this.state.is("default")) this.transform.position.set_from(this.locked_to.transform.position)
    else
    if(this.state.is("transitioning")) {
      let diff = this.target.pos.clone().sub(this.locked_to.pos)
      this.transform.position.x = this.ease_function(this.timers.transition.curr, this.locked_to.pos.x, diff.x, this.timers.transition.duration)
      this.transform.position.y = this.ease_function(this.timers.transition.curr, this.locked_to.pos.y, diff.y, this.timers.transition.duration)
    }
  }
  transition_begin(object) {
    if(this.state.is("transitioning")) return
    this.target = object
    let distance = this.locked_to.pos.distance(object.pos)
    this.timers.transition.duration = this.transition_time_min + distance*0.75
    this.timers.transition.restart()
    this.state.set("transitioning")
  }
  update() {
    this.timers.update()
    this.position_update()
    this.update_world_offset()
    this.zoom_interpolate()
  }
  update_world_offset() {
    this.context.position.x = (-this.transform.position.x / this.current_zoom + this.context_dim.x/2)
    this.context.position.y = (-this.transform.position.y / this.current_zoom + this.context_dim.y/2)
    this.context.scale.set(1 / this.current_zoom)
  }
  zoom_interpolate() {
    if(!this.zoom.active) return

    let zoom_increment = Math.abs(this.zoom.start_value - this.zoom.end_value)

    if(this.zoom.start_value < this.zoom.end_value) this.current_zoom = this.zoom.start_value + this.ease_function(this.zoom.current_time, 0, zoom_increment, this.zoom.duration)
    if(this.zoom.start_value > this.zoom.end_value) this.current_zoom = this.zoom.start_value - this.ease_function(this.zoom.current_time, 0, zoom_increment, this.zoom.duration)
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
  get zoom_step() {
    return 0.85
  }
}
