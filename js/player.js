class Player extends Person {
  constructor() {
    super("player", "player")
  }
  update() {
    this.control_ship()
    Q("#ship-reactor-view").innerText = this.ship.reactor.power_free + "/" + this.ship.reactor.power
    Q("#currency-view").innerText = this.currency
  }
  control_ship() {
    if(program.windows.active !== game) return
    if(!this.ship) return
    this.ship.target_position = mouse.world_position.clone()
    
    if(keys.shift) this.ship.draw_ghost()
    else this.ship.hide_ghost()
    
    if(!(keys.accel || keys.decel) && this.ship.brakes.auto) this.ship.brake()
    if(keys.accel) this.ship.accelerate() 
    if(keys.decel) this.ship.decelerate() 
    if(keys.brake) this.ship.brake() 
    if(keys.rotateCCW || keys.rotateCW)  this.ship.steering = true
    if(!keys.rotateCCW && !keys.rotateCW)  this.ship.steering = false
    if(keys.rotateCW && !keys.rotateCCW)  this.ship.rotate(1)
    if(keys.rotateCCW && !keys.rotateCC)  this.ship.rotate(-1)
  }
}
