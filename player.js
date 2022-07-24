class Player {
  constructor(ship) {
    this.ships = []
    this.ship = ship
    this.reputation = {} //todo
    this.currency = 0
    this.character = "Deborah"
    this.inventory = [
      {}
    ]
  }
  update() {
    this.control_ship()
    //migrate ship control into game {}
  }
  control_ship() {
    if(ui.windows.active !== game) return
    let ship = this.ship
    if(!(keys.accel || keys.decel) && ship.brakes.auto) ship.brake() 
    if(keys.shift) {
      ship.draw_ghost()
    }
    else ship.hide_ghost()
    ship.target_pos = mouse.world_pos.clone()
    if(keys.accel) ship.accelerate() 
    if(keys.decel) ship.decelerate() 
    if(keys.brake) ship.brake() 
    if(keys.rotateCCW || keys.rotateCW)  ship.steering = true
    if(!keys.rotateCCW && !keys.rotateCW)  ship.steering = false
    if(keys.rotateCW && !keys.rotateCCW)  ship.rotate(1)
    if(keys.rotateCCW && !keys.rotateCC)  ship.rotate(-1)
    
  }
}

//maybe this whole fuckin class is pointless, maybe