class ContinuousGraphic extends GameObject {
  constructor(transform, width, height) {
    super(transform)
    this.width = width
    this.height = height
    this.loopAlong = "x"
    this.generateSprites()
  }
  generateSprites() {
    let count
    if(this.loopAlong = "x")
      count = window.innerWidth / this.width
    else
      count = window.innerHeight / this.height
  }
  updateSprites() {

  }
  update() {
    this.updateSprites()
  }
  destroy() {
    
  }
}