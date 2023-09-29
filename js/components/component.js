class Component {
  constructor(gameObject) {
    /** @type GameObject */
    this.gameObject = gameObject
  }
  update() {
    throw "missing Component's update method"
  }
  clone() {
    return _.cloneDeep(this)
  }
}