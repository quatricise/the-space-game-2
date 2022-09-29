class Player extends Person {
  constructor() {
    super("player", "player")
  }
  update() {
    this.controlShip()
    Q("#ship-reactor-view")
      .innerText = this.ship.reactor.powerFree + "/" + this.ship.reactor.power
    Q("#currency-view")
      .innerText = this.currency
  }
  controlShip() {
    if(program.windows.active !== game) return
    if(!this.ship) return
    this.ship.targetPosition = mouse.worldPosition.clone()
    
    if(keys.shift) 
      this.ship.drawGhost()
    else 
      this.ship.hideGhost()
    
    if(!(keys.accel || keys.decel) && this.ship.brakes.auto)
      this.ship.brake()
    if(keys.accel) 
      this.ship.accelerate() 
    if(keys.decel) 
      this.ship.decelerate() 
    if(keys.brake) 
      this.ship.brake() 
    if(keys.rotateCCW || keys.rotateCW)  
      this.ship.steering = true
    if(!keys.rotateCCW && !keys.rotateCW)  
      this.ship.steering = false
    if(keys.rotateCW && !keys.rotateCCW)  
      this.ship.rotate(1)
    if(keys.rotateCCW && !keys.rotateCC)  
      this.ship.rotate(-1)
  }
}
