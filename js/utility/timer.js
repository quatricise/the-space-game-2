class Timer {
  constructor(...timers) {
    this.all = []
    this.add(...timers)
  }
  setToAudioDelta() {
    this.delta = "adt"
  }
  update() {
    for(let timer of this.all) {
      if(!timer.active) return
      
      let delta = this.delta === "adt" ? adt : dt
      timer.currentTime += 1000 * delta
      if(timer.currentTime >= timer.duration) {
        timer.currentTime = 0
        if(!timer.loop) {
          timer.finished = true
          timer.active = false
        }
        timer.onfinish()
      }
    }
  }
  remove(...timers) {
    timers.forEach(timer => {
      let tim = this.all.find(t => t === this[timer])
      this.all.remove(tim)
    })
  }
  add(...timers) {
    timers.forEach(timerData => {
      let options = timerData[2] || {
        loop: false, 
        active: false, 
        onfinish: function () {}
      }

      this[timerData[0]] = {
        active: options.active,
        loop: options.loop,
        currentTime: 0,
      }
      this[timerData[0]].onfinish = options.onfinish
      this[timerData[0]].duration = timerData[1]
      this[timerData[0]].restart = function() {
        this.currentTime = 0
        this.active = true
        this.finished = false
      }
      this[timerData[0]].start = function() {
        this.currentTime = 0
        this.active = true
        this.finished = false
      }
      this[timerData[0]].pause = function() {
        this.active = false
      }
      this[timerData[0]].unpause = function() {
        this.active = true
      }
      this[timerData[0]].toggle = function() {
        this.active = !this.active
      }
      this[timerData[0]].reset = function() {
        this.currentTime = 0
        this.active = false
        this.finished = false
      }
      this[timerData[0]].stop = function() {
        this.currentTime = 0
        this.active = false
        this.finished = false
      }
      this.all.push(this[timerData[0]])
    })
  }
}