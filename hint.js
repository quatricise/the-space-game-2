class Hint {
  constructor(parent, text, life_max = 1000, options = {dismissed: false}) {
    this.parent = parent
    this.text = text
    this.pos = world_to_client_pos(game, this.parent.pos)
    this.life_max = life_max
    this.life = life_max
    this.dismissed = options.dismissed
    hints.push(this)
    this.create_html()
  }
  create_html() {
    this.element = El('div', "hint", undefined, this.text )
    this.element.style.filter = "opacity(0)"
    Q('#hints-container').append(this.element)
    this.update_html()
  }
  update_html() {
    let bb = this.element.getBoundingClientRect()
    this.element.style.left = Math.floor( this.pos.x -bb.width/2) + "px"
    this.element.style.top =  Math.floor(this.pos.y -bb.height/2) + "px"
    this.element.style.filter = `opacity(${Math.max(0, this.life/this.life_max)})`
  }
  dismiss() {
    this.dismissed = true
  }
  update() {
    this.pos = world_to_client_pos(game, this.parent.pos)
    this.update_html()
    if(this.dismissed) this.life -= 1000 * dt
    if(this.life <= 0) this.destroy()
  }
  destroy() {
    this.element.remove()
    hints = hints.filter(hint => hint !== this)
  }
}