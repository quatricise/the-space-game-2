class ShipSystem {
  constructor(system, ship) {
    this.level = system.level
    this.level_max = system.level_max
    this.power = 0
    this.power_max = system.power_max
    this.stat_increment = system.stat_increment
    this.ship = ship //ship reference
    if(this.ship.reactor.power_distribution.free >= this.level) this.ship.reactor.addPower(this, this.level)
  }
  static addPower(power) {
    if(this.power >= this.power_max) return
    this.power += power
  }
  static removePower() {
    if(this.power <= 0) return
    this.power--
  }
  static upgrade() {
    if(this.level >= this.level_max) return
    this.level++
    this.incrementStats()
  }
}

class ShipSystemBrakes extends ShipSystem {
  constructor(system, ship) {
    super(system, ship)
    //we should also somehow indicate that a system is possible to be installed on a ship
  }
  toggleAuto() {

  }
  incrementStats() {

  }
}

ShipSystemBrakes.prototype.addPower = ShipSystem.addPower
ShipSystemBrakes.prototype.removePower = ShipSystem.removePower
ShipSystemBrakes.prototype.upgrade = ShipSystem.upgrade


class ShipSystemReactor extends ShipSystem {
  constructor(system, ship) {
    super(system, ship)
    //we should also somehow indicate that a system is possible to be installed on a ship
  }
  addPowerTo(system, amount = 1) {
    if(this.power_free <= 0) return
    if(system.power >= system.level || system.power <= 0) return
    system.power += amount
  }
  removePowerFrom(system, amount = 1) {
    if(this.power_free <= 0) return
    if(system.power >= system.level || system.power <= 0) return
    system.power -= amount
  }
}

ShipSystemReactor.prototype.addPower = ShipSystem.addPower
ShipSystemReactor.prototype.removePower = ShipSystem.removePower
ShipSystemReactor.prototype.upgrade = ShipSystem.upgrade

