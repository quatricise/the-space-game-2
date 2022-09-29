class RigidBody extends Component {
  constructor(gameObject, mass) {
    super(gameObject)
    this.mass = mass || 1
  }
}