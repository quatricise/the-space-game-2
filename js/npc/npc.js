class NPC extends Person {
  constructor(name, job_title, location) {
    super(name, job_title. location)
    this.name = name
    this.boxes = []
    this.target = target
    this.priorities = [
      "avoid-obstacles",
      "attack-enemy",
      "follow-leader",
      "patrol",
      "idle",
    ]
    this.priority = new State(
      ...this.priorities
    )
    this.colliding = false
    this.direction = 1
    //#region instance arrow methods
    this.check_collision = () => {
      let ship = this.ship
  
      let iterations = data.pathfinding.projection.iterations
      let timestretch = data.pathfinding.projection.timestretch
      let ship_boxes = this.ship.projections
  
      let other_boxes = []
      let candidates = Collision.broadphaseFilter(ship) 
      candidates.forEach(obj => {
        let bb = obj.hitbox.bb
        let series = []
        for (let i = 0; i < iterations; i++) {
          let dir = obj.vel.clone().mult(dt).mult(timestretch)
          bb.x = Math.round(bb.x + dir.x)
          bb.y = Math.round(bb.y + dir.y)
          bb.w = Math.round(bb.w)
          bb.h = Math.round(bb.h)
          series.push({...bb})
        }
        other_boxes.push(series)
      })
      let count = 0
      this.boxes = ship_boxes.concat(...other_boxes)
      let colliding = []
      ship_boxes.forEach((sb, index) => {
        other_boxes.forEach(series => {
          let box = series[index]
          if(Collision.boxBox(sb, box)) {
            count++
            colliding.push([sb, box])
          }
        })
      })
      if(count > 0 && this.colliding === false) {
        this.decide_direction()
        this.colliding = true
      }
      if(count === 0) {
        this.colliding = false
      }
    }
    this.can_skip = true
    this.fire = () => {
      let pos = this.target.pos.clone()
      pos.x *= rand(0.95,1.05)
      pos.y *= rand(0.95,1.05)
      this.ship.fire(pos)
    }
    this.skip = () => {
      if(!this.can_skip) return
      let pos = this.target.pos.clone()
      pos.x += randR(120, 200) * pickRand([-1,1])
      pos.y += randR(120, 200) * pickRand([-1,1])
      this.ship.skip_begin(pos)
      this.can_skip = false
      this.timers.skip.restart()
    }
    this.reset_skip = () => {
      this.can_skip = true
    }
    //#endregion
    this.timers = new Timer(
      ["check_collision", 500, {loop: true, active: true, onfinish: this.check_collision}],
      ["fire", 2000, {loop: true, active: true, onfinish: this.fire}],
      ["skip", 3000, {loop: false, active: false, onfinish: this.reset_skip}],
    )
  }
  assign_ship(ship) {
    this.ship = ship
  }
  control_ship() {
    let ship = this.ship
    this.aim()
    if(this.colliding) {
      ship.rotate(this.direction)
      ship.accelerate()
      return
    }
    let target = this.target
    if(target) {
      let angle = Math.atan2(ship.pos.y - target.pos.y, ship.pos.x - target.pos.x)
      angle += PI
      let leeway = PI/50
      if(ship.rotation > angle) ship.rotate(-1)
      else
      if(ship.rotation < angle) ship.rotate(1)
    }
    if(target.pos.distance(ship.pos) > 500) {
      ship.accelerate()
    }
    if(target.pos.distance(ship.pos) > 700) {
      this.skip()
    }
    if(target.pos.distance(ship.pos) < 300) {
      ship.brake()
    }
  }
  decide_direction() {
    this.direction = pickRand([-1, 1])
  }
  set_target(target) {
    this.target = target
  }
  aim() {
    this.ship.target_pos = this.target.pos.clone()
  }
  destroy() {

  }
  //#region obstacle avoid subroutine
  detect_obstacle() {
    //if obstacle -> skip over it
    //if fail -> turn left || turn right
    //if fail -> turn the other way
    //if fail -> slow down
    //if fail -> speed up
    //if fail -> go backwards
    //if fail -> shoot the obstacle
    //if fail -> if(shields not active) activate shields
    //if fail -> get hit
  }
  //#endregion
  update() {
    this.control_ship()
  }
}