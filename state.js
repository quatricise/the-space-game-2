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

const state = {
  current: "passive",
  previous: "none",
  options: [
    "conversation",
    "battle",
    "passive",
    "menu",
    "map_open",
    "dragging_node",
    "dragging_node_connection_point",
    "editing_text_field",
    "resizing_node",
    "panning_dialogue_editor",
    "editing_hitbox",
  ],
  set(value) {
    this.previous = this.current
    let state = this.options.find(state => state === value)
    if(state === undefined) console.log('State not allowed to be set to: ' + value)
    else
    this.current = state
    console.log("state: " + this.current)
    Q('#state-view').innerText = this.current
  },
  is(...values) {
    let match = false
    values.forEach(val => {
      if(val === this.current) match = true
    })
    return match
  },
  any(...values) {
    let match = false
    values.forEach(val => {
      if(val === this.current) match = true
    })
    return match
  },
  isnt(...values) {
    let match = true
    values.forEach(val => {
      if(val === this.current) match = false
    })
    return match
  },

  revertState() {
    this.current = this.previous
    Q('#state-view').innerText = this.current
    console.log("state: " + this.current)
  }
}
