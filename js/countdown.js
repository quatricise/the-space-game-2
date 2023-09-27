class Countdown {
  static begin( /** @type Integer */ seconds) {
    this._current = seconds
    this.timers.decrement.start()
    Q("#countdown-container").classList.remove("hidden")
    this.updateVisuals()
  }
  static _current = 0
  static secondElapsed() {
    this._current--
    this.updateVisuals()
    if(this._current === 0)
    this.finish()
  }
  static updateVisuals() {
    Q("#countdown-number").src = "assets/countdown/" + this._current + ".png"
  }
  static finish() {
    this.timers.decrement.stop()
    Q("#countdown-container").classList.add("hidden")
  }
  static timers = new Timer(
    ["decrement", 1000, {loop: true, active: false, onfinish: () => this.secondElapsed()}]
  )
  static update() {
    this.timers.update()
  }
}