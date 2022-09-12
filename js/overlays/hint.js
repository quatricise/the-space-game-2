class Hint extends GameObject {
  constructor(
    transform,
    text, 
    fadeout_time = 1000, 
  ) {
    super(transform)
    this.text = text
    this.fadeout_time_max = fadeout_time
    this.fadeout_time = fadeout_time
    this.dismissed = false
    this.create_html()
  }
  create_html() {
    this.element = El('div', "hint", undefined, this.text)
    this.element.style.filter = "opacity(0)"
    Q('#hints-container').append(this.element)
    this.update_html()
  }
  update_html() {
    let bb = this.element.getBoundingClientRect()
    console.log(this.transform)
    this.element.style.left = Math.floor( this.transform.position.x -bb.width/2 ) + "px"
    this.element.style.top =  Math.floor( this.transform.position.y -bb.height/2 ) + "px"
    this.element.style.filter = `opacity(${Math.max(0, this.fadeout_time/this.fadeout_time_max)})`
  }
  dismiss() {
    this.dismissed = true
  }
  update_life() {
    if(this.dismissed) this.fadeout_time -= 1000 * dt
    if(this.fadeout_time <= 0) this.destroyed = true
  }
  destroy() {
    this.element.remove()
  }
}

class StaticHint extends Hint {
  constructor(transform, text, fadeout_time, screen_space_position) {
    //screen_space_position is some kinda CSS shorthand like left: 0, top: 0 or justify-center, justify-left
    super(transform, text, fadeout_time)
  }
  update() {
    this.update_life()
    this.update_html()
  }
}

class DynamicHint extends Hint {
  constructor(transform, text, fadeout_time, parent) {
    super(transform, text, fadeout_time)
    this.parent = parent
    this.fadeout_time_max = fadeout_time
    this.fadeout_time = fadeout_time
  }
  update() {
    this.update_life()
    this.update_html()
    this.set_position_from_parent()
  }
  set_position_from_parent() {
    this.transform.position = world_to_client_pos(this.game_world, this.parent.transform.position)
  }
}