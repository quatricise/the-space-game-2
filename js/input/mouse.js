class Mouse {
  constructor() {
    this.worldPosition            = new Vector()
    this.hitboxEditorPosition     = new Vector()
    this.locationEditorPosition   = new Vector()
    this.clientClickOrigin        = new Vector()
    this.clientClickEnd           = new Vector()
    this.mapPosition              = new Vector()
    this.clientPosition           = new Vector()
    this.clientPositionPrev       = new Vector()
    this.clientMoved              = new Vector()
    this.hitboxEditorMoved        = new Vector()
    this.locationEditorMoved      = new Vector()
    this.mapMoved                 = new Vector()
    this.target = null
    this.clickTarget = null
    this.clickedNotMoved = false
    this.travelled = 0
    this.pressure = 1
    this.shipAngle = 0
    this.keys = {
      left: false,
      middle: false,
      right: false,
    }
  }
  //#region 
  handleInput(event) {
    this.updateKeys(event)
    switch(event.type) {
      case "pointerdown"  : {this.handlePointerdown(event); break;}
      case "mousedown"    : {this.handleMousedown(event); break;}
      case "mousemove"    : {this.handleMousemove(event); break;}
      case "pointermove"  : {this.handlePointermove(event); break;}
      case "mouseup"      : {this.handleMouseup(event); break;}
      case "click"        : {this.handleClick(event); break;}
      case "wheel"        : {this.handleWheel(event); break;}
    }
    this.target = event.target
  }
  updateKeys(event) {
    if(event.type === "mousedown") {
      if(event.button === 0) this.keys.left = true
      if(event.button === 1) this.keys.middle = true
      if(event.button === 2) this.keys.right = true
    }
    if(event.type === "mouseup") {
      if(event.button === 0) this.keys.left = false
      if(event.button === 1) this.keys.middle = false
      if(event.button === 2) this.keys.right = false
    }
  }
  handlePointerdown(event) {
    this.updatePressure(event)
  }
  handleMousedown(event) {
    this.updatePressure(event)
    this.clientClickOrigin.set(event.clientX, event.clientY)
    this.clickTarget = event.target
  }
  handleMousemove(event) {
    if(this.travelled > 3) this.clickedNotMoved = false
    this.updateClientPosition(event)
    this.updateTravelledDistance(event)
    this.updateWorldPosition()
  }
  handlePointermove(event) {
    this.updatePressure(event)
  }
  handleMouseup(event) {
    this.clientClickEnd.set(event.clientX, event.clientY)
    if(this.travelled > 3) 
      this.clickedNotMoved = false
    else
      this.clickedNotMoved = true
  }
  handleClick(event) {

  }
  handleWheel(event) {

  }
  //#endregion
  updateShipAngle() {
    // this.shipAngle = Math.atan2(this.worldPosition.y - player.ship.transform.position.y, this.worldPosition.x - player.ship.transform.position.x)
    this.shipAngle = player.ship.transform.position.angleTo(this.worldPosition)
  }
  updateClientPosition(e) {
    this.clientPositionPrev.x = this.clientPosition.x
    this.clientPositionPrev.y = this.clientPosition.y

    this.clientPosition.x = e.clientX
    this.clientPosition.y = e.clientY
    
    this.clientMoved.x = this.clientPosition.x - this.clientPositionPrev.x
    this.clientMoved.y = this.clientPosition.y - this.clientPositionPrev.y

    this.hitboxEditorMoved    .setFrom(this.clientMoved)  .mult(hitboxEditor.camera.currentZoom)
    this.locationEditorMoved  .setFrom(this.clientMoved)  .mult(locationEditor.camera.currentZoom)
    this.mapMoved             .setFrom(this.clientMoved)  .mult(map.camera.currentZoom)
  }
  updateTravelledDistance() {
    if(this.keys.left) 
      this.travelled += this.clientMoved.length()
    else 
      this.travelled = 0
  }
  updatePressure(e) {
    if(e.pointerType !== "pen") return
    this.pressure = e.pressure
  }
  updateWorldPosition() {
    this.updateWorldPositionFor(locationEditor, this.locationEditorPosition)
    this.updateWorldPositionFor(hitboxEditor, this.hitboxEditorPosition)
    this.updateWorldPositionFor(map, this.mapPosition)
    this.updateWorldPositionFor(game, this.worldPosition)
  }
  updateWorldPositionFor(world, position) {
    position.x = Math.round((this.clientPosition.x - cw/2 + (world.camera.transform.position.x / world.camera.currentZoom)) * world.camera.currentZoom)
    position.y = Math.round((this.clientPosition.y - ch/2 + (world.camera.transform.position.y / world.camera.currentZoom)) * world.camera.currentZoom)
  }
}