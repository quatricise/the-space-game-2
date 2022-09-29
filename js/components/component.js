class Component {
  constructor(gameObject) {
    this.gameObject = gameObject
  }
  update() {
    throw "missing Component's update method"
  }
  clone() {
    return _.deepClone(this)
  }
}