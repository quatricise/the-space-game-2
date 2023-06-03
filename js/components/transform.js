class Transform extends Component {
  constructor(
    position = new Vector(), 
    velocity = new Vector(), 
    rotation = 0, 
    angularVelocity = 0,
  ) {
    super()
    this.position = position
    this.velocity = velocity
    this.rotation = rotation
    this.angularVelocity = angularVelocity
    this.cellPosition = new Vector()
    this.navCellPosition = new Vector()
    this.update()
  }
  update() {
    this.updateCellPosition()
    this.updateNavCellPosition()
  }
  updateCellPosition() {
    this.cellPosition.x = Math.floor(this.position.x / grid.cellSize)
    this.cellPosition.y = Math.floor(this.position.y / grid.cellSize)
  }
  updateNavCellPosition() {
    this.navCellPosition.x = Math.floor(this.position.x / navMeshGrid.cellSize)
    this.navCellPosition.y = Math.floor(this.position.y / navMeshGrid.cellSize)
  }
  clone() {
    return Transform.fromPlain(this.plain)
  }
  reset() {
    this.position.set(0)
    this.velocity.set(0)
    this.angularVelocity = 0
    this.rotation = 0
    this.cellPosition.set(0)
  }
  get plain() {
    return {
      position: this.position.plain(),
      velocity: this.velocity.plain(),
      rotation: this.rotation,
      angularVelocity: this.angularVelocity,
      cellPosition: this.cellPosition.plain()
    }
  }
  static fromPlain(obj) {
    return new Transform(
      new Vector(obj.position.x, obj.position.y),
      new Vector(obj.velocity.x, obj.velocity.y),
      obj.rotation, 
      obj.angularVelocity,
      new Vector(obj.cellPosition.x, obj.cellPosition.y)
    )
  }
}