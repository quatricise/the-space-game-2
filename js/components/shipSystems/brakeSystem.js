class BrakeSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.strength = data.strength
    this.active = false
    this.auto = true
  }
  brake() {
    this.gameObject.transform.velocity.mult(
      (1 - (this.strength/50) * dt)
    )
    if(this.gameObject.transform.velocity.length() < 0.8)
      this.gameObject.transform.velocity.set(0)
    
    if(this.gameObject.transform.velocity.length() !== 0)
      this.gameObject.sprite.brakeIndicator.renderable = true
    else
      this.gameObject.sprite.brakeIndicator.renderable = false

  }
  notBrake() {
    this.gameObject.sprite.brakeIndicator.renderable = false
  }
  toggleAuto() {
    this.auto = !this.auto
    this.setTargetSpeed()
    Q(`#brakes-off-warning`).classList.toggle("hidden")
  }
  setTargetSpeed() {
    this.targetSpeed = this.gameObject.transform.velocity.length()
  }
  matchVelocityToTargetSpeed() {
    let marginOfError = 5

    if(this.gameObject.transform.velocity.length() < this.targetSpeed - marginOfError) 
      this.gameObject.accelerate()
    else
    if(this.gameObject.transform.velocity.length() > this.targetSpeed + marginOfError) 
      this.gameObject.decelerate()
  }
  update() {
    if(this.active || (this.auto && this.active))
      this.brake()
    else
      this.notBrake()
    
    if(!this.auto)
      this.matchVelocityToTargetSpeed()
  }
}