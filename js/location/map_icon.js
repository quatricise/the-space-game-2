class MapIcon extends Rigid {
  constructor(location, location_name) {
    super(
      new Transform(new Vector(location.x, location.y)),
      new CircleHitbox(20)
    )
    this.type = "map_icon"
    this.name = location.type
    this.title = location_name
    this.hover = false
    this.font_size = 16
    Sprite.construct(this)
    this.create_text()
  }
  create_text() {
    this.text = new PIXI.Text(this.name, {fontFamily: "space", fill: "0xffffff"})
    this.text.position.set(this.transform.position.x + 30, this.transform.position.y - 15)
    map.stage.addChild(this.text)
  }
  show_text() {
    map.stage.addChild(this.text)
    this.text.position.set(this.transform.position.x + 10 + (20 * map.camera.current_zoom), this.transform.position.y -  5 - (5 * map.camera.current_zoom))
    this.text.style.fontSize = this.font_size * map.camera.current_zoom
  }
  hide_text() {
    map.stage.removeChild(this.text)
  }
  update_name(name) {
    throw "issue with naming conventions, obj.name = the specific subtype, and not actually its name"
    if(!name) return
    this.name = name
    this.text.text = name
  }
  destroy() {
    //horrific
    map.icons.remove(this)
    throw "use GameWorldWindow.remove_game_object()"
    this.sprite.destroy()
    this.text.destroy()
  }
}