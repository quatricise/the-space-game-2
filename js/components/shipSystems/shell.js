/** Creates a long-lasting protective layer around the ship for 4-5 seconds. */
class Shell extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.invulnerable = false
    this.timers = new Timer(
      ["depower", 5000, {loop: false, active: false, onfinish: this.deactivate.bind(this)}]
    )
  }
  absorbShock(/** @type CollisionEvent */ collisionEvent) {

  }
  activate() {
    this.timers.depower.start()
    this.invulnerable = true
  }
  deactivate() {
    this.invulnerable = false
  }
}