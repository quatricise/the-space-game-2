class Game extends GameWorldWindow {
  constructor() {
    super("Game", Q("#game"))
    this.app.view.style.pointerEvents = "none"
    this.gridSprite = new PIXI.TilingSprite(grid.texture, cw + grid.cellSize*2, ch + grid.cellSize*2)
    this.state = new State(
      "default",
      "explore",
      "battle",
      "dialogue",
      "mapOpen",
      "loadingLocation",
    )
    this.availableInteraction = null
    this.localMapOpen = false
    this.createVignette()
    this.setupMinimap()
    this.modifyLayers()
    this.location = null
    this.locations = []
    this.timers = new Timer(
      ["spawnFgObjects", 2000, {loop: true, active: true, onfinish: this.spawnFgObjects.bind(this)}]
    )
  }
  setBoundsOnCamera(bounds) {
    this.camera.bounds = bounds ?? this.camera.bounds
    this.camera.zoomRange = [0.25, 5]
    this.camera.zoom.duration = 1600
    this.camera.currentZoom = 1.25
    this.camera.baseZoom = 1.25
  }
  modifyLayers() {
    let filter1 = new PIXI.filters.ColorMatrixFilter()
        filter1.brightness(1)
    let filter2 = new PIXI.filters.ColorMatrixFilter()
        filter2.brightness(0.9)
    let filter3 = new PIXI.filters.ColorMatrixFilter()
        filter3.brightness(0.85)
    let filter4 = new PIXI.filters.ColorMatrixFilter()
        filter4.brightness(0.80)
    let filterFG = new PIXI.filters.ColorMatrixFilter()
        filterFG.brightness(0.75)

    this.layers.background.filters =  [filter1]
    this.layers.background2.filters = [filter2]
    this.layers.background3.filters = [filter3]
    this.layers.background4.filters = [filter4]
    
    this.layers.foreground.filters =  [filterFG]
    this.layers.foreground2.filters = [filterFG]
    this.layers.foreground3.filters = [filterFG]
  }
  setupMinimap() {
    let minimapCSSRule = 
    Array.from(
      Array.from(document.styleSheets)
      .find(sheet => sheet.href.includes("gameOverlays")).cssRules
    ).find(rule => rule.cssText.includes("#minimap"))

    let width =       +minimapCSSRule.style.width.replaceAll("px", "") - 4
    let height =      +minimapCSSRule.style.height.replaceAll("px", "") - 4
    this.minimap =    Q("#minimap")
    this.minimapApp = new PIXI.Application({width, height, backgroundColor: 0x1b1d1f})
    this.minimap.append(this.minimapApp.view)
    this.minimap.dimensions = {width, height}
    this.minimapApp.view.id = "minimap-canvas"
  }
  toggleLocalMap() {
    this.localMapOpen ? this.hideLocalMap() : this.showLocalMap()
  }
  showLocalMap() {
    let panel = Q("#local-map-background-panel")
    let map = Q("#local-map")
    let rect = panel.getBoundingClientRect()

    map.classList.remove("hidden")
    panel.append(this.minimapApp.view)

    this.minimapApp.view.classList.add("big")
    this.minimapApp.resizeTo = panel
    this.localMapOpen = true
  }
  hideLocalMap() {
    Q("#local-map").classList.add("hidden")
    this.minimap.append(this.minimapApp.view)
    this.minimapApp.view.classList.remove("big")
    this.minimapApp.resizeTo = this.minimap
    this.minimapApp.view.width -= 4
    this.minimapApp.view.height -= 4
    this.localMapOpen = false  
    this.minimapApp.stage.scale.set(1)
    this.gameObjects.gameObject.forEach(obj => obj.sprite?.minimapIcon?.scale.set(1))
  }
  //#region input
  handleInput(event) {
    this.handleInputExceptionCases(event)
    if(!this.localMapOpen)
      player.handleInput(event)
    this["handle" + event.type.capitalize()](event)
  }
  handleInputExceptionCases(event) {
    //this prevents shooting and interacting with hints when you click on UI things and not canvas
    if(event.type === "mousedown" && event.target !== this.element) return 
    
    if(!keys.shift && !keys.shiftRight && !keys.ctrl && !keys.ctrlRight && !this.localMapOpen) {
      if(player.ship.weapons)
        player.ship.weapons.activeWeapon?.handleInput(event)
    }
    if(player.ship.shields)
      player.ship.shields.handleInput(event)
    
    this.gameObjects.hintGraphic.forEach(graphic => graphic.handleInput(event))
  }
  handleKeydown(event) {    
    if(event.code === binds.zoomIn)              this.camera.zoomInit("in")
    if(event.code === binds.zoomOut)             this.camera.zoomInit("out")
    if(event.code === binds.resetZoom)           this.camera.resetZoom()
    if(event.code === binds.interact)            this.interact()
    if(event.code === binds.openMap)             this.toggleLocalMap()
    if(event.code === binds.pause)               gameManager.togglePause()
    if(event.code === binds.openInventory)       {gameManager.setWindow(inventory); inventory.viewInventoryTab("inventory")}
    if(event.code === binds.openDialogueScreen)  gameManager.setWindow(dialogueScreen)
    if(event.code === binds.openWorldMap)        gameManager.setWindow(map)
    if(event.code === binds.deathmatchNextArena) gameManager.loadNextDeathmatchArena()
  }
  handleKeyup(event) {

  }
  handleMousedown(event) {
    switch(event.button) {
      case 0: {this.handleLeftDown(event);   break}
      case 1: {this.handleMiddleDown(event); break}
      case 2: {this.handleRightDown(event);  break}
    }
  }
  handleLeftDown(event) {

  }
  handleMiddleDown(event) {

  }
  handleRightDown(event) {

  }
  handleMousemove(event) {
    let target = event.target
    if(mouse.keys.middle || mouse.keys.left) {
      if(target.closest("#local-map")) {
        let position = this.minimapApp.stage.position
        position.set(position.x + mouse.clientMoved.x, position.y + mouse.clientMoved.y)
      }
    }
  }
  handleMouseup(event) {

  }
  handleClick(event) {

  }
  handleWheel(event) {
    let target = event.target

    if(target.closest("#local-map")) {
      let start = performance.now()
      let scale = this.minimapApp.stage.scale._x - (event.deltaY / 1000)
      let inverseScale = 1 / scale
      this.minimapApp.stage.scale.set(scale)
      this.gameObjects.gameObject.forEach(obj => {
        obj.sprite?.minimapIcon?.scale.set(inverseScale)
      })
      console.log(performance.now() - start)
    }
  }
  //#endregion
  interact() {
    if(this.availableInteraction)
      this.availableInteraction()
  }
  updateMinimap() {
    if(this.localMapOpen) return

    this.minimapApp.stage.position.set(
      -this.camera.transform.position.x * Game.minimapScaleFactor + this.minimapApp.view.getBoundingClientRect().width / 2,
      -this.camera.transform.position.y * Game.minimapScaleFactor + this.minimapApp.view.getBoundingClientRect().height / 2
    )
  }
  spawnFgObjects() {
    return
    let count = Random.int(0, 5)
    let types = [
      "fgMedium0",
      "fgMedium1",
      "fgMedium2",
      "fgMedium3",
      "fgMedium4",
      "fgMedium5",
    ];
    let layers = [
      "foreground",
      "foreground2",
      "foreground3",
    ]
    for(let i = 0; i < count; i++) {
      let position = player.ship.transform.position.clone()
      let velocity = new Vector(Random.int(12, 150), Random.int(12, 150))
      let rotation = Random.float(0, TAU)
      let angularVelocity = Random.float(0, 1)
      let offsetFromPlayer = new Vector(Random.int(cw/2, cw) * Random.from(-1, 1), Random.int(ch/2, ch) * Random.from(-1, 1))
      
      position.add(offsetFromPlayer)
      GameObject.create(
        "decoration",
        Random.from(...types), 
        {
          transform: new Transform(position, velocity, rotation, angularVelocity),
          isPermanent: false
        },
        {world: this, layer: Random.from(...layers)}
      )
    }
    this.timers.spawnFgObjects.duration = Random.int(900, 3600)
  }
  update() {
    this.updateLayers()
    this.updateMinimap()
    this.markers.forEach(m => m.update())
    this.timers.update()
  }
  static minimapScaleFactor = 0.028
}