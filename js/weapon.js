class Weapon {
  constructor(
    ship,
    weaponItem,
    slot,
    methods = {
      onkeydown,
      onkeyup,
      onmousemove,
      onmousedown,
      onmouseup,
      onclick,
      onwheel,
    }
  ) {
    this.ship = ship
    this.power = weaponItem.power
    this.slot = slot
    this.powered = false
    
    this.onkeydown = methods.onkeydown || new Function()
    this.onkeyup = methods.onkeyup || new Function()
    this.onmousemove = methods.onmousemove || new Function()
    this.onmousedown = methods.onmousedown || new Function()
    this.onmouseup = methods.onmouseup || new Function()
    this.onclick = methods.onclick || new Function()
    this.onwheel = methods.onwheel || new Function()
  }
  handleInput(event) {
    if(program.windows.active !== this) return
    switch(event.type) {
      case "keydown"    : {this.onkeydown(event); break;}
      case "keyup"      : {this.onkeyup(event); break;}
      case "mousemove"  : {this.onmousemove(event); break;}
      case "mousedown"  : {this.onmousedown(event); break;}
      case "mouseup"    : {this.onmouseup(event); break;}
      case "click"      : {this.onclick(event); break;}
      case "wheel"      : {this.onwheel(event); break;}
    }
  }
}

class ShipSystemWeapons {
  constructor(ship) {
    this.weapons = []
    this.level = ship.level
    this.power = 0
  }
  get powerMax() {
    let p = 0
    this.weapons.forEach(w => {
      p += w.power
    })
    return p
  }
}
