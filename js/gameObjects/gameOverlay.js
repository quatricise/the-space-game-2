class GameOverlay extends GameObject {
  constructor(transform, name, parent, /** @type Vector */ offset) {
    super(transform)
    let objectData = data.gameOverlay[name]
    this.name = name
    this.type = "gameOverlay"
    this.parent = parent
    this.offset = offset ?? null
    this.onFinishPlaying = objectData.onFinishPlaying
    this.onFinishPlayingDelayMS = objectData.onFinishPlayingDelayMS

    /* If there is a limit to how many can exist, handle that inefficiently here. */
    if(objectData.maxOnScreen) {
      let objects = GameObject.filter(game, this.type, this.name)
      if(objects.length >= objectData.maxOnScreen) {
        switch(objectData.onLimitReach) {
          case "destroyThis": {
            throw "This isn't supposed to be here, because it could flash for one frame before being destroyed, do not use unless I properly implement the limiting"
            break
          }
          case "destroyOthers": {
            objects.forEach(o => GameObject.destroy(o))
            break
          }
        }
      }
    }

    /* There is an assumption that the gameWorld is game, otherwise throw error. Other windows are not currently supposed to use this class. */
    setTimeout(() => {
      if(this.gameWorld && this.gameWorld !== game) throw "GameOverlay not in game, that is not designed to happen."
    }, 20)
    
    this.finished = false
    this.components = ["sprite"]
    this.registerComponents(objectData)

    this.timers = new Timer(
      ["refreshSprite", objectData.refreshSpriteFrequencyMS, {loop: true, active: true, onfinish: this.updateSprite.bind(this)}],
      ["waitForDelay", objectData.onFinishPlayingDelayMS,    {loop: false, active: false, onfinish: this[this.onFinishPlaying]?.bind(this)}],
    )

    /* these prevent the sprite from showing in the wrong location for 1 frame */
    this.update()
    this.sprite.update()
  }
  updateSprite() {
    if(this.finished) return

    for(let sprite of this.sprite.all) {
      /* do nothing if the sprite is not animated */
      if(!sprite.textures || sprite.textures.length === 1) continue

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
      this[this.onFinishPlaying]?.()
  }
  //#region onFinishPlaying commands
  destroyOverlay() {
    GameObject.destroy(this)
  }
  destroy() {
    
  }
  //#endregion
  update() {
    if(this.parent)
      this.transform.position.setFrom(this.parent.transform.position)
    if(this.offset)
      this.transform.position.add(this.offset)
  }
}