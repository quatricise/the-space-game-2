class GameOverlay extends GameObject {
  constructor(transform, name, parent) {
    super(transform)
    let objectData = data.gameOverlay[name]
    this.name = name
    this.type = "gameOverlay"
    this.parent = parent
    this.onFinishPlaying = objectData.onFinishPlaying
    this.onFinishPlayingDelayMS = objectData.onFinishPlayingDelayMS
    this.finished = false
    this.components = ["sprite"]
    this.registerComponents(objectData)

    this.timers = new Timer(
      ["refreshSprite", objectData.refreshSpriteFrequencyMS, {loop: true, active: true, onfinish: this.updateSprite.bind(this)}],
      ["waitForDelay", objectData.onFinishPlayingDelayMS,    {loop: false, active: false, onfinish: this[this.onFinishPlaying]?.bind(this)}],
    )
    this.update()
    this.sprite.update()
  }
  updateSprite() {
    if(this.finished) return

    for(let sprite of this.sprite.all) {
      sprite.gotoAndStop(sprite.currentFrame + 1)
      if(sprite.currentFrame === sprite.totalFrames - 1) {
        this.finished = true
        setTimeout(() => {
          this.doOnFinishPlaying()
        }, this.timers.refreshSprite.duration)
      }
    }
  }
  setOpacity(value) {
    this.sprite.container.alpha = clamp(value, 0, 1)
  }
  doOnFinishPlaying() {
    if(this.onFinishPlayingDelayMS)
      this.timers.waitForDelay.start()
    else
      this[this.onFinishPlaying]()
  }
  //#region onFinishPlaying commands
  destroyOverlay() {
    GameObject.destroy(this)
  }
  //#endregion
  update() {
    if(this.parent)
      this.transform.position.setFrom(this.parent.transform.position)
  }
}