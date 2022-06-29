class Player {
  constructor() {
    this.ships = []
    this.ship = {
      // instance of Ship class
    }
    this.reputation = {} //todo
    this.currency = 0
    this.character = "Deborah"
    this.inventory = [
      //Item {} instances
      {},
      {},
    ]
  }
  update() {
    this.control_ship()
    //migrate ship control into game {}
  }
  control_ship() {
    if(ui.windows.active !== game) return
    let ship = this.ship
    if(!keys.accel && ship.brakes.auto) ship.brake() 
    if(keys.shift) {
      ship.draw_ghost()
    }
    else ship.hide_ghost()
    this.ship.target_pos = mouse.world_pos.clone()
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

//maybe this whole fuckin class is pointless, maybe