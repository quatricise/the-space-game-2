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
  hitbox: false,
  sprite: true,
  particles: true,
  projections: false,
}

let devmode = true

let cw = window.innerWidth
let ch = window.innerHeight

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
  get() {
    return this.current
  }
}

class Timer {
  constructor(...timers) {
    this.all = []
    this.add(...timers)
  }
  update() {
    this.all.forEach(timer => {
      if(!timer.active) return
      timer.curr += 1000 * dt
      if(timer.curr >= timer.duration) {
        timer.curr = 0
        timer.onfinish()
        if(!timer.loop) timer.active = false
      }
    })
  }
  add(...timers) {
    timers.forEach(timer => {
      let options = timer[2] || {loop: false, active: false, onfinish: function () {}}
      this[timer[0]] = {
        active: options.active,
        loop: options.loop,
        curr: 0,
      }
      this[timer[0]].onfinish = options.onfinish
      this[timer[0]].duration = timer[1]
      this[timer[0]].restart = function() {
        this.curr = 0
        this.active = true
      }
      this[timer[0]].start = function() {
        this.curr = 0
        this.active = true
      }
      this[timer[0]].pause = function() {
        this.active = false
      }
      this[timer[0]].unpause = function() {
        this.active = true
      }
      this[timer[0]].toggle = function() {
        this.active = !this.active
      }
      this.all.push(this[timer[0]])
    })
  }
}
let pathfinding = {
  projection: {
    iterations: 14,
    timestretch: 15, //this is like timescale factor to compute values further in time
  }
}