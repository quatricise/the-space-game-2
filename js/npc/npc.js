class NPC extends Person {
  constructor(name, jobTitle, location) {
    super(name, jobTitle. location)
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
    this.checkCollision = () => {
      let ship = this.ship
  
      let iterations = data.pathfinding.projection.iterations
      let timestretch = data.pathfinding.projection.timestretch
      let shipBoxes = this.ship.projections
  
      let otherBoxes = []
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
        otherBoxes.push(series)
      })
      let count = 0
      this.boxes = shipBoxes.concat(...otherBoxes)
      let colliding = []
      shipBoxes.forEach((sb, index) => {
        otherBoxes.forEach(series => {
          let box = series[index]
          if(Collision.boxBox(sb, box)) {
            count++
            colliding.push([sb, box])
          }
        })
      })
      if(count > 0 && this.colliding === false) {
        this.decideDirection()
        this.colliding = true
      }
      if(count === 0) {
        this.colliding = false
      }
    }
    this.canSkip = true
    this.fire = () => {
      let pos = this.target.pos.clone()
      pos.x *= rand(0.95,1.05)
      pos.y *= rand(0.95,1.05)
      this.ship.fire(pos)
    }
    this.skip = () => {
      if(!this.canSkip) return
      let pos = this.target.pos.clone()
      pos.x += randR(120, 200) * pickRand([-1,1])
      pos.y += randR(120, 200) * pickRand([-1,1])
      this.ship.skipBegin(pos)
      this.canSkip = false
      this.timers.skip.restart()
    }
    this.resetSkip = () => {
      this.canSkip = true
    }
    //#endregion
    this.timers = new Timer(
      ["checkCollision", 500, {loop: true, active: true, onfinish: this.checkCollision}],
      ["fire", 2000, {loop: true, active: true, onfinish: this.fire}],
      ["skip", 3000, {loop: false, active: false, onfinish: this.resetSkip}],
    )
  }
  assignShip(ship) {
    this.ship = ship
  }
  controlShip() {
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
  decideDirection() {
    this.direction = pickRand([-1, 1])
  }
  setTarget(target) {
    this.target = target
  }
  aim() {
    this.ship.targetPos = this.target.pos.clone()
  }
  destroy() {

  }
  //#region obstacle avoid subroutine
  detectObstacle() {
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
    this.controlShip()
  }
}