class GameWorldWindow extends GameWindow {
  constructor(title, element) {
    super(title, element)
    this.createApp()
    this.createLayers()
    this.createGameObjects()
    this.createCamera()
    this.gridSprite = new PIXI.TilingSprite(grid.texture, cw + grid.cellSize*2, ch + grid.cellSize*2)
    this.stats = new GameDebugStats()
    this.interactionManager = new InteractionManager()
    this.mode = new Switch("edit", "play")
    this.fog = []
    this.previousCollisions = []
    this.locationName = "Location"

    this.gameObjects.camera.push(this.camera)
    this.layers.graphics.addChild(this.graphics)
    this.element.append(this.app.view)
  }
  //#region setup 
  createApp() {
    this.app = new PIXI.Application(
      { 
        width: cw, 
        height: ch, 
        backgroundColor: 0x151516
      }
    )
    this.stage = this.app.stage
  }
  createCamera() {
    this.camera = GameObject.create(
      "camera", 
      "mainCamera", 
      {
        transform: new Transform(),
        context: this.stage
      }, 
      {world: this}
    )
  }
  createLayers() {
    this.layers = {
      planet: new PIXI.Container(),
      background: new PIXI.Container(),
      background2: new PIXI.Container(),
      vignette: new PIXI.Container(),
      asteroid: new PIXI.Container(),
      debris: new PIXI.Container(),
      ship: new PIXI.Container(),
      projectile: new PIXI.Container(),
      vignette2: new PIXI.Container(),
      fog: new PIXI.Container(),
      graphics: new PIXI.Container(),
      overlays: new PIXI.Container(),
      get all() {
        let layers = [
          this.planet,
          this.background,
          this.background2,
          this.asteroid,
          this.vignette,
          this.debris,
          this.ship,
          this.projectile,
          this.vignette2,
          this.fog,
          this.graphics,
          this.overlays,
        ]
        if(layers.length !== Object.keys(this).length - 1) throw 'probably not all layers were got using get all()'
        return layers
      }
    }
    this.layers.all.forEach(layer => this.stage.addChild(layer))
  }
  createGameObjects() {
    this.gameObjects = {
      gameObject: [],
      cluster: [],
      rigid: [],
      debris: [],
      camera: [],
      projectile: [],
      asteroid: [],
      ship: [],
      persons: [],
      interactable: [],
      hint: [],
      laser: [],
      ultraportBeacon: [],
      locationRandomizer: [],
      randomSpawner: [],
      bgObject: [],
      mapIcon: [],
      mapImage: [],
    }
  }
  //#endregion
  //#region cosmetic optional methods
  createVignette() {    
    let vignette = PIXI.Sprite.from("assets/vignette.png")
    vignette.anchor.set(0.5)
    vignette.alpha = 0.7
    this.layers.vignette.addChild(vignette)

    let vignette2 = PIXI.Sprite.from("assets/vignette.png")
    vignette2.anchor.set(0.5)
    vignette2.alpha = 0.5
    this.layers.vignette2.addChild(vignette2)
  }
  addOrigin() {
    this.origin = PIXI.Sprite.from("assets/origin.png")
    this.origin.anchor.set(0.5)
    this.stage.addChild(this.origin)
  }
  updateGridSprite() {
    this.gridSprite.position.x = Math.floor(this.camera.transform.position.x / grid.cellSize) * grid.cellSize - (grid.cellSize*2)
    this.gridSprite.position.y = Math.floor(this.camera.transform.position.y / grid.cellSize) * grid.cellSize - grid.cellSize
  }
  updateStats() {

  }
  updateFog() {
    if(this.mode.is("play")) {
      this.location.fog.forEach(f => {
        f.rotation = Math.floor(Date.now()/450)
      })
    }
  }
  //#endregion

  //#region GameObject logic
  addGameObject(obj) {
    obj.prototypeChain.forEach(prototype => {
      this.gameObjects[prototype].push(obj)
    })
    obj.gameWorld = this
    let layername = GameObject.getLayerForObject(obj)
    if(layername) GameObject.addToStage(obj, this.layers[layername])
  }
  removeGameObject(obj) {
    obj.prototypeChain.forEach(prototype => {
      this.gameObjects[prototype].remove(obj)
    })
    obj.gameWorld = null
    if(obj.container) obj.stage.removeChild(obj.container)
  }
  // updateGameObjects() {
  //   this.gameObjects.gameObject.forEach(obj => {
  //     if(obj.destroyed) this.destroyGameObject(obj)
  //   })
  //   this.gameObjects.gameObject.forEach(obj => {
  //     if(this.mode.is("play")) {
  //       obj.updateTimers()
  //       obj.update()
  //       obj.floorAngularVelocity()
  //       obj.applyInertia()
  //     }
  //     obj.updateCellPosition()
  //     obj.autoCull()
  //     Hitbox.update(obj)
  //     Hitbox.draw(obj, this.graphics)
  //     Hitbox.drawProjections(obj, this.graphics)
  //     Sprite.update(obj)
  //   })
  // }
  updateGameObjects() {
    this.gameObjects.gameObject.forEach(obj => {
      if(obj.destroyed)
        this.destroyGameObject(obj)
    })
    this.gameObjects.gameObject.forEach(obj => {
      GameObject.updateOnAll(obj)
      if(this.mode.is("play"))
        GameObject.updateOnPlay(obj)
      Hitbox.update(obj)
      Hitbox.draw(obj, this.graphics)
      Hitbox.drawProjections(obj, this.graphics)
    })
  }
  //#endregion
  
  //#region location loading
  unloadGameWorld() {
    //hide all sprites, music and heavy stuff, push this scene into the background, only keep a reference to this somewhere
    this.layers.fog.forEach(sprite => sprite.renderable = false)
    this.gameObjects.forEach(obj => {
      obj.hide()
    })
  }
  loadGameWorld(locationId) {
    this.location = new GameLocation(locationId, this)
    this.location.load()
  }
  loadLocation(locationName) {
    this.state.set("loading")
    readTextFile("data/locations/" + locationName + ".json", (text) => {
      let d = JSON.parse(text)
      d.objects.forEach(obj => {
        GameObject.create(obj.type, obj.name, obj, {world: this})
      })
      this.generateBackground()
      this.generateFog(d.fog)
      this.state.revert()
    })
    if(!this.generated) 
      this.generate()
  }
  //#endregion
}
