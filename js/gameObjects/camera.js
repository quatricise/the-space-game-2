class Camera extends GameObject {
  constructor(
    transform,
    context, 
    contextDim = new Vector(window.innerWidth, window.innerHeight),
    lockedTo = null,
    baseZoom = 1,
  ) {
    super(transform)
    this.context = context
    this.contextDim = contextDim
    this.lockedTo = lockedTo
    this.target = null
    this.currentZoom = baseZoom
    this.zoomStep = 0.85
    this.zoom = {
      startValue: 0,
      endValue: 0,
      currentTime: 0,
      duration: 350,
      active: false,
    }
    this.easeFunction = Ease.InOut
    this.state = new State(
      "default",
      "transitioning",
    )
    this.transitionEnd = () => {
      this.lockTo(this.target)
      this.target = null
      this.state.ifrevert("transitioning")
    }
    this.transitionTimeMin = 500
    this.timers = new Timer(
      ["transition", 1000, {loop: false, active: false, onfinish: this.transitionEnd}]
    )
  }
  lockTo(object) {
    if(!object.transform) 
      throw "Can't lock camera to object without transform component"
    this.lockedTo = object
  }
  positionUpdate() {
    if(this.state.is("default")) this.transform.position.setFrom(this.lockedTo.transform.position)
    else
    if(this.state.is("transitioning")) {
      let diff = this.target.pos.clone().sub(this.lockedTo.pos)
      this.transform.position.x = this.easeFunction(this.timers.transition.curr, this.lockedTo.pos.x, diff.x, this.timers.transition.duration)
      this.transform.position.y = this.easeFunction(this.timers.transition.curr, this.lockedTo.pos.y, diff.y, this.timers.transition.duration)
    }
  }
  transitionBegin(object) {
    if(this.state.is("transitioning")) return
    this.target = object
    let distance = this.lockedTo.pos.distance(object.pos)
    this.timers.transition.duration = this.transitionTimeMin + distance*0.75
    this.timers.transition.restart()
    this.state.set("transitioning")
  }
  update() {
    this.positionUpdate()
    this.updateWorldOffset()
    this.zoomInterpolate()
  }
  updateWorldOffset() {
    this.context.position.x = (-this.transform.position.x / this.currentZoom + this.contextDim.x/2)
    this.context.position.y = (-this.transform.position.y / this.currentZoom + this.contextDim.y/2)
    this.context.scale.set(1 / this.currentZoom)
  }
  zoomInterpolate() {
    if(!this.zoom.active) return

    let zoomIncrement = Math.abs(this.zoom.startValue - this.zoom.endValue)

    if(this.zoom.startValue < this.zoom.endValue) 
      this.currentZoom = this.zoom.startValue + this.easeFunction(this.zoom.currentTime, 0, zoomIncrement, this.zoom.duration)
    if(this.zoom.startValue > this.zoom.endValue) 
      this.currentZoom = this.zoom.startValue - this.easeFunction(this.zoom.currentTime, 0, zoomIncrement, this.zoom.duration)

    this.zoom.currentTime += 1000 * dt

    if(this.zoom.currentTime >= this.zoom.duration)
      this.zoomEnd()
  }
  zoomInit(direction) {
    if(this.zoom.active) return
    this.zoom.startValue = this.currentZoom
    if(direction === "in")
      this.zoom.endValue = (this.currentZoom * this.zoomStep)
    if(direction === "out") 
      this.zoom.endValue = (this.currentZoom / this.zoomStep)

    if(debug.camera) 
      console.log("zoom start value: " + this.zoom.startValue)
    if(debug.camera) 
      console.log("zoom end value: " + this.zoom.endValue)

    if(this.zoom.endValue === this.zoom.startValue) return
    this.zoom.active = true
    return this.zoomStep
  }
  zoomEnd() {
    this.currentZoom = this.zoom.endValue
    this.zoom.active = false
    this.zoom.currentTime = 0
  }
}
