class Transform extends Component {
  constructor(
    position = new Vector(), 
    velocity = new Vector(), 
    rotation = 0, 
    angularVelocity = 0,
    cellPosition = new Vector(),
  ) {
    super()
    this.position = position
    this.velocity = velocity
    this.rotation = rotation
    this.angularVelocity = angularVelocity
    this.cellPosition = cellPosition
  }
}