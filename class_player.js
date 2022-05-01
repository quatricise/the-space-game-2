class Player {
  constructor() {
    this.ships = []
    this.ship = {
      // instance of Ship class
    }
    this.reputation = {} //todo
  }
  update() {
    this.controlShip()
  }

  controlShip() {
    let ship = this.ship
    if(!keys.accel && ship.brakes.auto) ship.brake() 
    if(keys.accel) ship.accelerate() 
    if(keys.rotateCCW || keys.rotateCW) {
      ship.steering = true
    }
    if(!keys.rotateCCW && !keys.rotateCW) {
      ship.steering = false
    }
    if(keys.rotateCW) {
      ship.rotateCW()
    }
    if(keys.rotateCCW) {
      ship.rotateCCW()
    }
  }
}