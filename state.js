let debug = {
  camera: false,
  hitbox: false,
  mouse: false,
  colors: {
    hitbox_no_collision: 0xffff00,
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
  ],
  switchState(value) {
    this.previous = this.current
    let state = this.options.find(state => state === value)
    if(state === undefined) console.log('State not allowed to be set to: ' + value)
    else
    this.current = state
    console.log("state: " + this.current)
  },
  revertState() {
    this.current = this.previous
    console.log("state: " + this.current)
  }
}

let map_open = false

const facts = {
  has_bought_burger: false,
  has_money: false,
  tried_to_steal_burger: false,
}