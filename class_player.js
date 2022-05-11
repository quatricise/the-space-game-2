class Player {
  constructor() {
    this.ships = []
    this.ship = {
      // instance of Ship class
    }
    this.reputation = {} //todo
    this.currency = 0
  }
  update() {
    this.controlShip()
  }
  controlShip() {
    let ship = this.ship
    if(!keys.accel && ship.brakes.auto) ship.brake() 
    if(keys.accel) ship.accelerate() 
    if(keys.decel) ship.decelerate() 
    if(keys.rotateCCW || keys.rotateCW) {
      ship.steering = true
    }
    if(!keys.rotateCCW && !keys.rotateCW) {
      ship.steering = false
    }
    if(keys.rotateCW && !keys.rotateCCW) {
      ship.rotate(1)
    }
    if(keys.rotateCCW && !keys.rotateCC) {
      ship.rotate(-1)
    }
  }
}