class Station extends GameObject {
  constructor(transform, name) {
    super(transform)
    let objectData = data.station[name]
    this.type = "station"
    this.name = name
    this.mass = objectData.mass         ?? console.error("object mass (: number) missing", this)
    this.stationType = objectData.type  ?? console.error("missing station type")
    this.dockingPoints = []
    for(let point of objectData.dockingPoints)
      this.dockingPoints.push(new Vector(point.x, point.y))
    this.dockingPointsDefinition = _.cloneDeep(this.dockingPoints)
    this.wares = _.cloneDeep(objectData.wares)
    this.state = new State(
      "default",
      "player-docked"
    )
    this.components = [
      "sprite",
      "hitbox",
      "rigidbody",
    ]
    this.registerComponents(objectData)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  updateDockingPoints() {
    //rotate the docking points based on rotation
    this.dockingPoints.forEach((point, index) => {
      point.setFrom(this.dockingPointsDefinition[index])
      point.rotate(this.transform.rotation)

      if(visible.hitbox) {
        this.gameWorld.graphics.lineStyle(2, 0x00ff00, 1)
        this.gameWorld.graphics.drawCircle(point.x + this.transform.position.x, point.y + this.transform.position.y, 9)
      }
    })
  }
  onPlayerDock() {
    if(Fact.testForFact("should_show_station_overlays")) 
      this.setOverlayMenu(GameObject.create("gameOverlay", "overlayOpenStationMenu", {parent: player.ship}, {world: this.gameWorld}))

    AudioManager.playSFX("cardShimmer")
    this.setStationWares()
    inventory.enableStationTab()
    this.state.set("player-docked")
  }
  onPlayerUndock() {
    if(Fact.testForFact("should_show_station_overlays"))
      this.destroyOverlayMenu()
    
    inventory.disableStationTab()
    this.state.ifrevert("player-docked")
  }
  setOverlayMenu(newMenu) {
    if(!Fact.testForFact("should_show_station_overlays")) return
    
    this.destroyOverlayMenu()
    this.gameOverlayMenu = newMenu
  }
  destroyOverlayMenu() {
    if(!Fact.testForFact("should_show_station_overlays")) return
    
    if(this.gameOverlayMenu)      
      GameObject.destroy(this.gameOverlayMenu)
    this.gameOverlayMenu = null
  }
  updateDockOptionOverlay() {
    if(!Fact.testForFact("should_show_station_overlays")) return
    
    if(this.state.is("player-docked")) return
    if(this.gameWorld !== game) return
    let overlayName = "overlayDockIntoStation"
    let targetPoint
    let playerDistance
    for(let dockingPoint of this.dockingPoints) {
      let point = dockingPoint.clone().add(this.transform.position)
      let distance = point.distance(player.ship.transform.position)
      if(distance < Ship.maxDistanceToDock) {
        playerDistance = distance
        targetPoint = point
        break
      }
    }
    if(!targetPoint) {
      this.destroyOverlayMenu()
      return
    }
    
    if(!this.gameOverlayMenu || this.gameOverlayMenu.name === overlayName)
      this.setOverlayMenu(
        GameObject.create("gameOverlay", overlayName, {transform: new Transform(targetPoint)}, {world: this.gameWorld})
      )

    let ramp = 1.8
    let opacity = ramp - (playerDistance / (1 / ramp)) / Ship.maxDistanceToDock
    this.gameOverlayMenu.setOpacity(opacity)
  }
  setStationWares() {
    for(let category in this.wares)
      Q(`#station-row-items-${category}`).innerHTML = ""

    for(let category in this.wares) {
      let itemCount = +Q(`#station-row-items-${category}`).dataset.inventoryitemcount
      for(let i = 0; i < itemCount; i++) {
        let itemData = this.wares[category][i]

        let item
        if(itemData)  {
          item = Item.createItemElement(data.item[itemData.name], {enableDrag: true})
          item.dataset.warecategory = category
          item.dataset.isstationware = "true"
        } 
        else item = Item.createEmptyItemElement()

        Q(`#station-row-items-${category}`).append(item)
      }
    }
  }
  update() {
    this.move()
    this.updateDockingPoints()
    this.updateDockOptionOverlay()
  }
}