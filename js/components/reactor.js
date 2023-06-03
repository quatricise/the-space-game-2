class Reactor extends Component {
  constructor(gameObject, data) {
    super(gameObject)
    this.power = data.power //the power it can provide
    this.powerMax = data.powerMax //maximum power this can provide upon upgrading
    this.powerFree = this.power
  }
  upgrade() {
    if(this.power >= this.powerMax) return
    this.power++
    this.powerFree++
  }
  unpower() {
    for(let system of this.gameObject.shipSystems) {
      this.gameObject[system].unpower()
    }
  }
  repower() {
    for(let system of this.gameObject.shipSystems) {
      this.gameObject[system].repower()
    }
  }
  update() {
    
  }
}