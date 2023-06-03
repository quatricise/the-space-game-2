class ImageSprite {
  constructor(startingFrameName, frameCount, position, options = {fps: 3, loop: false, fileExtension: "png", parentWindow: null}) {
    this.ready = false
    this.position = position ?? new Vector()

    this.currentFrame = null
    this.currentTimeMS = 0
    this.currentFrameNumber = 0
    this.frameCount = frameCount
    this.startingFrameName = startingFrameName

    this.stepSizeMS = 1000 / (options.fps ?? 3)
    this.loop =               options.loop ?? false
    this.fileExtension =      options.fileExtension ?? "png"
    this.parentWindow =       options.parentWindow ?? console.error("No parent element supplied")
    this.createFrames(startingFrameName, frameCount)
    this.parentWindow.imageSprites.push(this)
  }
  createFrames() {
    this.frames = []
    for(let i = 0; i < this.frameCount; i++) {
      let frame = new Image()
      frame.style.zIndex = 1000
      frame.src = `${this.startingFrameName}000${i}.${this.fileExtension ?? "png"}`
      frame.classList.add("cutscene-element")
      frame.onload = () => this.registerFrame(frame)
    }
  }
  registerFrame(frame) {
    this.frames.push(frame)
    if(this.frames.length === this.frameCount) {
      this.ready = true
      this.setFrame()
    }
  }
  setFrame(index) {
    if(this.currentFrame)
      this.currentFrame.replaceWith(this.frames[this.currentFrameNumber])
    else
      this.parentWindow.element.append(this.frames[index])

    this.currentFrame = this.frames[index]
    console.log("set frame", this.currentFrameNumber)
  }
  updateFrame() {
    if(this.destroyed) return

    let frameNumber = Math.floor(this.currentTimeMS / this.stepSizeMS)
    if(this.currentFrameNumber == frameNumber) return

    this.currentFrameNumber = frameNumber

    if(this.currentFrameNumber >= this.frameCount)
      return this.onComplete()
    else
      this.setFrame(frameNumber)
  }
  onComplete() {
    if(this.loop) {
      this.currentTimeMS = 0
      this.updateFrame()
    }
    else {
      this.destroy()
    }
  }
  update() {
    if(this.destroyed) return

    this.currentTimeMS += 1000 * cdt
    this.updateFrame()
  }
  destroy() {
    this.destroyed = true
    this.frames.forEach(f => f.remove())
    this.parentWindow.imageSprites.remove(this)
  }
}