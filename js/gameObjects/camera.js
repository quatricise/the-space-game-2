class Camera extends GameObject {
  constructor(
    transform,
    context, 
    contextDim = new Vector(window.innerWidth, window.innerHeight),
    lockedTo = null,
    baseZoom = 1,
    zoomRange,
    options = {zoomDurationMS: 500}
  ) {
    super(transform)
    this.type = "camera"
    this.name = "camera"
    this.context = context
    this.contextDim = contextDim
    this.lockedTo = lockedTo
    this.target = null
    this.bounds = {
      minX: -Infinity,
      minY: -Infinity,
      maxX: Infinity, 
      maxY: Infinity,
    }
    this.currentZoom = baseZoom
    this.baseZoom = baseZoom
    this.zoomRange = zoomRange ?? Camera.zoomRange
    this.zoomStep = Camera.zoomStep
    this.zoom = {
      startValue: 0,
      endValue: 0,
      currentTime: 0,
      duration: options.zoomDurationMS ?? Camera.zoomDurationMS,
      active: false,
      direction: "in" || "out"
    }
    this.easeFunction = Ease.InOut
    this.state = new State(
      "default",
      "transitioning",
    )

    this.positionOffset = new Vector()
    this.transitionTimeMin = 500
    this.timers = new Timer(
      ["transition", Camera.transitionDurationMS, {loop: false, active: false, onfinish: this.transitionEnd.bind(this)}]
    )
  }
  transitionEnd() {
    this.lockTo(this.target)
    this.target = null
    this.state.ifrevert("transitioning")
  }
  lockTo(object) {
    if(!object.transform) throw "Can't lock camera to object without transform component"
    this.lockedTo = object
  }
  transitionBegin(object) {
    if(this.state.is("transitioning")) return
    this.target = object
    let distance = this.lockedTo.transform.position.distance(object.transform.position)
    this.timers.transition.duration = this.transitionTimeMin + distance*0.75
    this.timers.transition.restart()
    this.state.set("transitioning")
  }
  positionUpdate() {
    if(this.state.is("default")) {
      this.transform.position.setFrom(this.lockedTo.transform.position).add(this.positionOffset)
      this.transform.position.x = clamp(this.transform.position.x, this.bounds.minX, this.bounds.maxX)
      this.transform.position.y = clamp(this.transform.position.y, this.bounds.minY, this.bounds.maxY)
    }
    else
    if(this.state.is("transitioning")) {
      let diff = this.target.transform.position.clone().sub(this.lockedTo.transform.position)
      this.transform.position.x = this.easeFunction(this.timers.transition.currentTime, this.lockedTo.transform.position.x, diff.x, this.timers.transition.duration)
      this.transform.position.y = this.easeFunction(this.timers.transition.currentTime, this.lockedTo.transform.position.y, diff.y, this.timers.transition.duration)
    }
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
    this.zoom.direction = direction
    if(direction === "in")
      this.zoom.endValue = (this.currentZoom * this.zoomStep)
    if(direction === "out") 
      this.zoom.endValue = (this.currentZoom / this.zoomStep)

    this.zoom.endValue = clamp(this.zoom.endValue, this.zoomRange[0], this.zoomRange[1])

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
    this.onZoomEnd()
  }
  onZoomEnd() {
    //empty method used for custom handling
  }
  resetZoom() {
    this.currentZoom = this.baseZoom
  }
  shake(shakeIntensityMultiplier = 1) {
    let iterationTime = 50
    let iterations = 8
    let shakeIntensity = 4 * shakeIntensityMultiplier
    const stopShake = () => {
      this.positionOffset.set(0)
    }
    const scheduleOffset = (iteration = 0) => {
      if(iteration > iterations) {
        stopShake()
        return
      }
      let offset = new Vector(Random.int(0, shakeIntensity), Random.int(0, shakeIntensity))
      this.positionOffset.setFrom(offset)
      setTimeout(() => scheduleOffset(++iteration), iterationTime)
    }

    scheduleOffset()
  }
  static zoomRange = [0.5, 2]
  static zoomStep = 0.75
  static zoomDurationMS = 500
  static transitionDurationMS = 1000
}
