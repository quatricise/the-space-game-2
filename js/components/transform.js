class Transform extends Component {
  constructor(
    position = new Vector(), 
    velocity = new Vector(), 
    rotation = 0, 
    angular_velocity = 0,
    cell_position = new Vector(),
  ) {
    super()
    this.position = position
    this.velocity = velocity
    this.rotation = rotation
    this.angular_velocity = angular_velocity
    this.cell_position = cell_position
  }
}