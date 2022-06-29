class ShipSystemWeapons extends ShipSystem {
  constructor(system, ship, weapons = []) {
    super(system, ship)
    this.weapons = weapons

  }
}

ShipSystemWeapons.prototype.addPower = ShipSystem.addPower
ShipSystemWeapons.prototype.removePower = ShipSystem.removePower
ShipSystemWeapons.prototype.upgrade = ShipSystem.upgrade

class Weapon extends Item {
  constructor(location, weapon) {
    super(weapon.name, weapon.title, weapon.thumb, weapon.desc, location)
    this.can_fire = false
    this.power = false
    this.charges = weapon.charges
  }
  fire() {

  }
  recharge_tick() {

  }
  recharge() {

  }
}

Weapon.prototype.destroy = Item.destroy
Weapon.prototype.moveTo = Item.moveTo

Weapon.prototype.effects = {
  fire: false,
  stun: false,
  disable_shields: false,

}

Weapon.types = [
  "laser",
  "missile",
  "beam",
  "shrapnell",
]