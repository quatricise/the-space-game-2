class EngineSystem extends ShipSystem {
  constructor(gameObject, systemData) {
    super(gameObject, systemData)
    this.maxSpeed = systemData.maxSpeed
    this.acceleration = systemData.acceleration
    this.glideReduction = systemData.glideReduction
    this.angularVelocity = systemData.angularVelocity
    this.targetSpeed = 0
  }
  updateEngineSprite() {
    if(!this.powered) {
      Sprite.updateFlames(this.gameObject, null)
      return
    }

    let speed = this.gameObject.transform.velocity.length()
    if(speed >= this.maxSpeed * 0.6) {
      Sprite.updateFlames(this.gameObject, "high")
    }
    else
    if(speed >= this.maxSpeed * 0.3) {
      Sprite.updateFlames(this.gameObject, "medium")
    }
    else 
    {
      Sprite.updateFlames(this.gameObject, "low")
    }
  }
  onRepower() {
    if(this.gameObject === player?.ship)
      AudioManager.playLoopedAudio("SFX", "shipEngine")
  }
  onUnpower() {
    if(this.gameObject === player?.ship)
      AudioManager.stopLoopedAudio("SFX", "shipEngine")
  }
  update() {
    this.updateEngineSprite()
  }
}