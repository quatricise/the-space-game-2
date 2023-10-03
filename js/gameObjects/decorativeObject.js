/** (Deprecated) Simple-ish object that doesn't collide with anything. Deprecated by Decoration for performance reasons. */
class DecorativeObject extends GameObject {
  constructor(transform, name, isPermanent = true, opacity = 1) {
    super(transform)
    this.type = "decorativeObject"
    this.name = name
    this.isPermanent = isPermanent
    this.opacity = opacity

    this.update()
    this.components = [
      "sprite"
    ]
    this.registerComponents({})
    if(isPermanent) {
      this.opacity = opacity
    }
    else {
      this.opacityInitial = Random.decimal(0.2, 0.4, 1)
      this.sprite.container.alpha = this.opacityInitial
    }
    this.sprite.update()
    this.timers = new Timer(
      ["tickLife", Random.int(5000, 15000), {loop: false, active: !isPermanent, onfinish: this.fadeOutBegin.bind(this)}],
      ["fadeOut", DecorativeObject.fadeTime, {loop: false, active: false, onfinish: this.kill.bind(this)}],
    )
    throw "do not use this class"
  }
  fadeOutBegin() {
    this.dying = true
    this.timers.fadeOut.start()
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  updateOpacity() {
    let alpha = +clamp((1 - this.timers.fadeOut.currentTime / DecorativeObject.fadeTime) * this.opacityInitial, 0, 1)
    this.sprite.container.alpha = alpha
  }
  update() {
    this.move()
    if(this.dying)
      this.updateOpacity()
  }
  destroy() {

  }
  kill() {
    GameObject.destroy(this)
  }
  static fadeTime = 4000
}