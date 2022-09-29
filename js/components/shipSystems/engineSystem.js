class EngineSystem extends ShipSystem {
  constructor(gameObject, systemData) {
    super(gameObject)
    this.glideReduction = systemData.glideReduction
    this.angularVelocityBase = systemData.angularVelocityBase
  }
}