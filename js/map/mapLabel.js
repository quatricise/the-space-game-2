class MapLabel extends GameObject {
  constructor(transform, text, color) {
    super(transform)
    let objectData = {hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 100,
        b: 100,
      }
    }}
    this.text = text
    this.color = color
    this.fontWeight = 400
    this.type = "mapLabel"
    this.name = "default"
    this.components = ["hitbox"]
    this.registerComponents(objectData)
    this.addSpriteComponentToMapLabel(text, color)
  }
  updateName(text) {
    GameObject.create("mapLabel", this.name, {transform: this.transform.clone(), text: text, color: this.color}, {world: this.gameWorld})
    GameObject.destroy(this)
  }
  updateColor(color) {
    GameObject.create("mapLabel", this.name, {transform: this.transform.clone(), text: this.text, color: color}, {world: this.gameWorld})
    GameObject.destroy(this)
  }
  scaleUp() {

  }
  scaleDown() {

  }
  setScale() {
    
  }
  update() {
    this.sprite.text.scale.set(this.gameWorld.camera.currentZoom * 0.8)
  }
  destroy() {
    
  }
}