class ShipSystem extends Component {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.power = 0
    this.powerMax = data.powerMax ?? 1
    this.level = data.level ?? 1
    this.levelMax = data.levelMax ?? 1
    this.powered = false
    this.previousPower = null
  }
  addPower() {
    if(this.power >= this.powerMax) return

    this.power++ 
    this.powered = true
  }
  removePower() {
    if(this.power <= 0) {
      this.powered = false
      this.power = 0
      return
    }
    this.power--
  }
  unpower() {
    if(!this.powered) return

    this.previousPower = this.power
    while(this.powered)
      this.removePower()
    this.onUnpower()
  }
  repower() {
    if(this.powered) return

    while(this.power < this.previousPower)
      this.addPower()
    this.onRepower()
  }
  onUnpower() {
    //custom method for handling additional logic    
  }
  onRepower() {
    //custom method for handling additional logic      
  }
  upgrade() {
    throw "provide a new upgrade method"
  }
}