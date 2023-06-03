class StealthSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.active = false
    this.previouslyVisible = []
  }
  activate() {
    if(this.active) return
    this.active = true
    this.previouslyVisible = this.gameObject.sprite.all.filter(s => s.renderable)
    this.setSpritesVisibility(true)
  }
  deactivate() {
    if(!this.active) return
    this.active = false 
    this.setSpritesVisibility(false)
  }
  toggle() {
    this.active ? this.deactivate() : this.activate()
  }
  setSpritesVisibility(stealthActive) {
    this.gameObject.sprite.all.forEach(sprite => {
      sprite.alpha = 1.0 * !stealthActive
    })
    StealthSystem.visibleSpriteTypes.forEach(sprite => {
      this.gameObject.sprite[sprite].renderable = stealthActive
      this.gameObject.sprite[sprite].alpha = 1.0 * stealthActive
    })
  }
  update() {
    
  }
  static visibleSpriteTypes = ["stealthLinework", "stealthFill", "minimapIcon"]
}