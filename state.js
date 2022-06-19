let debug = {
  camera: false,
  hitbox: false,
  mouse: false,
  editor: false,
  dialogue_editor: false,
  colors: {
    hitbox_no_collision: 0xffff00,
    hitbox_shape_selected: 0x0000ff,
    hitbox_collision: 0xff0000,
    hitbox_interactable: 0x00ff00,
  },
}

let visible = {
  hitbox: true,
  sprite: true,
  particles: true,
}

let cw = window.innerWidth
let ch = window.innerHeight

const location_coords = {
  tauri_b: [500,400],
  crown_capital: [600,400]
}

class State {
  constructor(...values) {
    this.values = values
    this.current =  values[0]
    this.previous = values[0]
  }
  set(value) {
    let val = this.values.find(v => v === value)
    if(val) {
      this.previous = this.current
      this.current = val
      // console.log("state: "  + this.current)
    }
    else {
      console.log('invalid value')
    }
  }
  revert() {
    this.current = this.previous
  }
  is(...values) {
    let match = false
    values.forEach(val => {
      if(this.current === val) match = true
    })
    return match
  }
  isnt(...values) {
    let match = true
    values.forEach(val => {
      if(this.current === val) match = false
    })
    return match
  }
}