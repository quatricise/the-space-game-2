class WorldMarker {
  constructor(id, world, parentObject, markerData) {
    this.id = id
    this.world = world
    this.world.markers.push(this)
    this.position = new Vector()
    this.parent = parentObject
    this.screenPosition = new Vector()

    this.flashCount = 0
    this.flashing = true

    this.timers = new Timer(
      ["flash", WorldMarker.flashCycleMS, {loop: true, active: true, onfinish: this.updateFlashCount.bind(this)}]
    )

    this.createSprite(markerData.markerIcon)
    this.updateFlashAnimation()
  }
  createSprite(markerIcon) {
    this.sprite = PIXI.Sprite.from("assets/marker/" + markerIcon + ".png")
    this.sprite.anchor.set(0.5)
    this.sprite.alpha = WorldMarker.opacity
    this.world.layers.overlays.addChild(this.sprite)
  }
  getScreenPosition() {
    let shipToMarkerAngle = player.ship.transform.position.angleTo(this.parent.transform.position)
    let shipClientPosition = worldToClientPosition(this.world, player.ship.transform.position)
    let distance = this.parent.transform.position.clone().sub(player.ship.transform.position)

    if(distance.length() < cw / 2)
      this.sprite.renderable = false
    else
      this.sprite.renderable = true

    let factorX = Math.abs((shipClientPosition.x * this.world.camera.currentZoom) / distance.x)
    let factorY = Math.abs((shipClientPosition.y * this.world.camera.currentZoom) / distance.y)

    let smallerFactor = Math.min(factorX, factorY)
    let markerOffset = distance.clone().mult(smallerFactor).mult(WorldMarker.screenInsetFactor)
    
    this.position = player.ship.transform.position.clone()
    this.position.add(markerOffset)

    
    if(debug.markers) {
      this.world.graphics.lineStyle(2, colors.hitbox.collision, 1)

      this.world.graphics.drawCircle(this.position.x, this.position.y, 10)

      this.world.graphics.moveTo(player.ship.transform.position.x, player.ship.transform.position.y)
      this.world.graphics.lineTo(this.parent.transform.position.x, this.parent.transform.position.y)
    }
  }
  updateFlashAnimation() {
    if(!this.flashing) return
    this.sprite.alpha = Ease.InOutAlternate(
      this.timers.flash.currentTime, 
      WorldMarker.opacity, 
      WorldMarker.flashOpacityMax - WorldMarker.opacity, 
      this.timers.flash.duration
    )
  }
  reFlash() {
    this.timers.flash.duration = WorldMarker.flashCycleMS
    this.flashing = true
    this.flashCount = 0
    this.timers.flash.start()
  }
  stopFlashAnimation() {
    this.flashing = false
    this.sprite.alpha = WorldMarker.opacity
    this.timers.flash.reset()
  }
  updateFlashCount() {
    this.flashCount++
    this.timers.flash.duration += 150
    if(this.flashCount >= WorldMarker.flashCount)
      this.stopFlashAnimation()
  }
  updateSprite() {
    this.sprite.position.set(this.position.x, this.position.y)
    this.sprite.scale.set(this.world.camera.currentZoom)
  }
  update() {
    this.timers.update()
    this.getScreenPosition()
    this.updateFlashAnimation()
    this.updateSprite()
  }
  destroy() {
    this.world.markers.remove(this)
    this.world.layers.overlays.removeChild(this.sprite)
  }
  static screenInsetFactor = 0.92
  static opacity = 0.2
  static flashOpacityMax = 1
  static flashCount = 3
  static flashCycleMS = 420
}