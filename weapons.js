class Weapon {
  constructor(
    ship,
    onkeydown,
    onkeyup,
    onmousemove,
    onmousedown,
    onmouseup,
    onclick,
    onwheel,

  ) {
    this.ship = ship
    this.powered = false
    
    this.onkeydown = onkeydown
    this.onkeyup = onkeyup
    this.onmousemove = onmousemove
    this.onmousedown = onmousedown
    this.onmouseup = onmouseup
    this.onclick = onclick
    this.onwheel = onwheel
  }
  handle_input(event) {
    if(ui.windows.active !== this) return
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
