class MapIcon extends GameObject {
  constructor(location, locationName) {
    super(new Transform(new Vector(location.x, location.y)))
    this.type = "mapIcon"
    this.name = location.type
    this.title = locationName
    this.hover = false
    this.hitbox = new CircleHitbox(20)
    this.fontSize = 16
    this.sprite = new Sprite(this)
    this.createText()
  }
  createText() {
    this.text = new PIXI.Text(this.name, {fontFamily: "space", fill: "0xffffff"})
    this.text.position.set(this.transform.position.x + 30, this.transform.position.y - 15)
    map.stage.addChild(this.text)
  }
  showText() {
    map.stage.addChild(this.text)
    this.text.position.set(this.transform.position.x + 10 + (20 * map.camera.currentZoom), this.transform.position.y -  5 - (5 * map.camera.currentZoom))
    this.text.style.fontSize = this.fontSize * map.camera.currentZoom
  }
  hideText() {
    map.stage.removeChild(this.text)
  }
  updateName(name) {
    throw "issue with naming conventions, obj.name = the specific subtype, and not actually its name"
    if(!name) return
    this.name = name
    this.text.text = name
  }
  destroy() {
    //horrific
    map.icons.remove(this)
    throw "use GameWorldWindow.removeGameObject()"
    this.sprite.destroy()
    this.text.destroy()
  }
}