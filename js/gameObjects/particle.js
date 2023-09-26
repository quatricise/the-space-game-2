class Particle extends GameObject {
  constructor(transform, name) {
    super(transform, name)
    let objectData = data.particle[name]
    this.type = "particle"
    this.name = name
    this.destroyAfterPlay = objectData.destroyAfterPlay
    this.components = ["sprite"]
    this.registerComponents({})

    let haveFinishedPlaying = 0
    
    this.sprite.update()
    this.sprite.all.forEach(sprite => {
      sprite.loop = false
      sprite.onComplete = () => {
        if(this.destroyed) return
        haveFinishedPlaying++
        if(haveFinishedPlaying === this.sprite.all.length && this.destroyAfterPlay) {
          this?.onDestroy()
          GameObject.destroy(this)
        }
      }
    })
  }
  /** Replace for callback method */
  onDestroy() {}
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  update() {
    this.move()
  }
}