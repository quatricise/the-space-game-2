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
      this[timer[0]].reset = function() {
        this.curr = 0
        this.active = false
      }
      this.all.push(this[timer[0]])
    })
  }
}
// let pathfinding = {
//   projection: {
//     iterations: 14,
//     timestretch: 15, //this is like timescale factor to compute values further in time
//   }
// }