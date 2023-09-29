class GameWorldWindow extends GameWindow {
  constructor(title, element) {
    super(title, element)
    this.createApp()
    this.createLayers()
    this.createGameObjectArrays()
    this.createCamera()
    this.createCameraAnchor()
        
    this.locationName = "Location"

    this.gridSprite = new PIXI.TilingSprite(grid.texture, cw + grid.cellSize*2, ch + grid.cellSize*2)
    this.fog = []
    this.previousCollisions = []
    this.markers = []
    this.mode = new State("play", "edit")
    
    this.layers.graphics.addChild(this.graphics)
    this.element.append(this.app.view)
    this.canvas = this.app.view
    this.stats = new GameStats()
  }
  //#region setup 
  createApp() {
    this.app = new PIXI.Application(
      { 
        width: cw, 
        height: ch, 
        backgroundColor: 0x151516,
      }
    )
    this.app.resizeTo = Q("main")
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
  createCameraAnchor() {
    this.cameraAnchor = {
      transform: new Transform()
    }
    this.camera.lockTo(this.cameraAnchor)
  }
  createLayers() {
    this.layers = {
      stars:        new PIXI.Container(),
      planet:       new PIXI.Container(),
      background4:  new PIXI.Container(),
      background3:  new PIXI.Container(),
      background2:  new PIXI.Container(),
      background:   new PIXI.Container(),
      vignette:     new PIXI.Container(),
      ghost:        new PIXI.Container(),
      asteroid:     new PIXI.Container(),
      debris:       new PIXI.Container(),
      projectile:   new PIXI.Container(),
      ship:         new PIXI.Container(),
      vignette2:    new PIXI.Container(),
      fog:          new PIXI.Container(),
      foreground:   new PIXI.Container(),
      foreground2:  new PIXI.Container(),
      foreground3:  new PIXI.Container(),
      overlays:     new PIXI.Container(),
      graphics:     new PIXI.Container(),
    }
    for(let layerName in this.layers)
      this.stage.addChild(this.layers[layerName])
  }
  createGameObjectArrays() {
    this.gameObjects = {
      gameObject: [],
      cluster: [],
      debris: [],
      camera: [],
      projectile: [],
      asteroid: [],
      ship: [],
      station: [],
      satellite: [],
      fragment: [],
      person: [],
      npc: [],
      player: [],
      interactable: [],
      hint: [],
      laser: [],
      ultraportBeacon: [],
      hintGraphic: [],
      gameOverlay: [],
      pickup: [],
      explosion: [],
      particle: [],
      spawner: [],
      decorativeObject: [],
      decoration: [],
      lightSource: [],
      audioEmitter: [],
      mapIcon: [],
      mapImage: [],
      mapLabel: [],
    }
  }
  //#endregion
  //#region cosmetic methods
  createVignette() {
    let 
    vignetteBack = PIXI.Sprite.from("assets/vignette.png")
    vignetteBack.anchor.set(0.5)
    vignetteBack.alpha = 0.5
    this.layers.vignette.addChild(vignetteBack)

    let 
    vignetteFront = PIXI.Sprite.from("assets/vignette.png")
    vignetteFront.anchor.set(0.5)
    vignetteFront.alpha = 0.9
    this.layers.vignette2.addChild(vignetteFront)
  }
  createOrigin() {
    this.origin = PIXI.Sprite.from("assets/origin.png")
    this.origin.anchor.set(0.5)
    this.stage.addChild(this.origin)
  }
  updateGridSprite() {
    this.gridSprite.position.x = Math.floor(this.camera.transform.position.x / grid.cellSize) * grid.cellSize - (grid.cellSize*2)
    this.gridSprite.position.y = Math.floor(this.camera.transform.position.y / grid.cellSize) * grid.cellSize - grid.cellSize
  }
  //#endregion
  //#region GameObject logic
  addGameObject(obj, layer) {
    obj.prototypeChain.forEach(prototype => {
      if(!this.gameObjects[prototype]) console.error("Unrecognized prototype identifier: " + prototype)

      this.gameObjects[prototype].push(obj)
    })
    obj.gameWorld = this
    if(obj.sprite) 
      this.placeObjectInLayer(obj, layer)
  }
  placeObjectInLayer(obj, layerOverride) {
    let layer = null
    let types = data.objectToLayerMap.get(obj.type)

    if(layerOverride)
      layer = layerOverride
    else if(types)
      layer = Random.from(...data.objectToLayerMap.get(obj.type))
    else
      console.error("Object with sprite component doesn't have a layer assigned in data.objectToLayerMap", obj)
    
    obj.layer = layer
    GameObject.addToStage(obj, this.layers[layer])
  }
  removeGameObject(obj) {
    if(obj.destroyed) return

    obj.prototypeChain.forEach(prototype => {
      this.gameObjects[prototype].remove(obj)
    })
    delete obj.gameWorld
  }
  updateGameObjects(forceUpdate = false) {
    /* this shit is a performance bottleneck, for some reason checking instanceof is expensive */
    let alwaysUpdateTypes = [Interactable, Hint]

    let windowMode = this.mode.get()
    for(let obj of this.gameObjects.gameObject) {
      if(
        this === game &&
        player.ship && 
        GameObject.distanceFast(obj, player.ship) > data.updateObjectsWithinThisFastDistanceOfPlayer && 
        !forceUpdate &&
        alwaysUpdateTypes.filter(type => obj instanceof type).length === 0
      ) {
        obj.cull()
        continue
      }
      
      if(forceUpdate)
        obj.sprite?.update()

      GameObject.updateOnAll(obj)
      if(windowMode === "play")
        GameObject.updateOnPlay(obj)
    }
    
    /* update decorations */
    this.gameObjects.decoration.forEach(deco => deco.update())

    /* draw hitboxes */
    if(visible.hitbox) {
      for(let obj of this.gameObjects.gameObject) {
        Hitbox.draw           (obj, this.graphics, this.camera.currentZoom)
        Hitbox.drawProjections(obj, this.graphics, this.camera.currentZoom)
      }
      for(let obj of this.gameObjects.decoration) {
        Hitbox.draw           (obj, this.graphics, this.camera.currentZoom)
        Hitbox.drawProjections(obj, this.graphics, this.camera.currentZoom)
      }
    }
      
  }
  //#endregion
  //#region location loading
  clearLocation() {
    let objects = [...this.gameObjects.gameObject].concat(this.gameObjects.decoration)
    objects.forEach(obj => GameObject.destroy(obj))
    this.interactionsTemplate = null
    this.fogHandlers = []
    this.destroyFog()
  }
  loadLocation(locationName, onFinishCallback = () => {}) {
    this.state.set("loadingLocation")
    gameManager.setWindow(loadingScreen)
    
    /* get title and set it */
    loadingScreen.setTitle(locationName)

    this.clearLocation()
    this.loadObjects(
      locationName, 
      this.loadInteractions.bind(this, locationName),
      this.loadAudio.bind(this, locationName),
      () => setTimeout(() => {this.state.set("default"); gameManager.closeWindow()}, 1000),
      onFinishCallback
    )
  }
  loadObjects(locationName, ...callbackFunctions) {
    readJSONFile("data/locations/" + locationName + "/objects.json", (text) => {
      let rawData = JSON.parse(text)
      let location = SaveConverter.convert("save", "data", rawData)
      this.locationName = location.name
      this.locationRefName = locationName
      location.objects.forEach(obj => {
        let params = {
          transform: Transform.fromPlain(obj.transform),
          id: obj.id,
          pilot: obj.pilot,
        }
        if(obj.type === "camera") {
          params["context"] =  this.stage
          params["lockedTo"] = this === game && player.ship ? player.ship : this.cameraAnchor
        }

        let gameObject = GameObject.create(
          obj.type, 
          obj.name, 
          params,
          {
            world: this,
            layer: obj.layer
          }
        )
        if(obj.type === "camera") {
          this.camera = gameObject
        }
      })

      this.generateBackground()
      this.generateFog(location.fog)
      callbackFunctions.forEach(f => f())
      this.updateGameObjects(true)
    })
  }
  loadInteractions(locationName) {
    if(this !== game) return

    readJSONFile("data/locations/" + locationName + "/interactions.json", (text) => {
      let parsedData = JSON.parse(text)
      let interactions = parsedData.interactions
      let markers = parsedData.markers
      let lightSources = parsedData.lightSources
      let cameraBounds = parsedData.cameraBounds
      let backgroundFilter = parsedData.backgroundFilter

      this.checkInteractionsForDuplicateIds(interactions)
      this.setBoundsOnCamera(cameraBounds)

      interactions.forEach( i => this.createInteraction(i.triggerObjectId, i.interactionData, i.options, i.interactionId))
      markers.forEach     ( m => this.createMarker(m.markerId, m.targetObjectId, m.markerData, m.options))
      lightSources.forEach( l => this.createLightSource(l))

      this.interactionsTemplate = {markers, interactions, lightSources}

      if(backgroundFilter) {
        let layers = ["background4", "background3", "background2", "background", "fog"]
        let filter = new PIXI.filters.ColorMatrixFilter()
        let tint = parseInt(backgroundFilter.tint, 16)
        filter.brightness(backgroundFilter.brightness ?? 1.0)
        filter.tint(tint, false)
        console.log(tint)
        for(let layer of layers) {
          this.layers[layer].filters = [filter]
        }
      }
    })
  }
  loadAudio(locationName) {
    if(this !== game) return
    
    readJSONFile("data/locations/" + locationName + "/audio.json", (text) => {
      let parsedData = JSON.parse(text)
      
      parsedData.audioEmitters.forEach(emitter => {
        Logger.log("emitter")
        GameObject.create(
          "audioEmitter", 
          emitter.audioName, 
          {category: emitter.category, parent: GameObject.byId(this, emitter.parentObjectId), options: emitter.options}, 
          {world: this}
        )
      })
    })
  }
  checkInteractionsForDuplicateIds(interactions) {
    interactions.forEach(interaction => {
      interactions.forEach(other => {
        if(interaction.interactionId === undefined || interaction.interactionId === undefined) return
        if(other.interactionId === interaction.interactionId && other !== interaction)
          throw "duplicate Id's in interactions: " + other.interactionId
      })
    })
  }
  createMarker(id, targetObjectId, markerData, options) {
    if(options.disabled) return
    if(options.conditional) return

    let triggerObject = this.gameObjects.gameObject.find(obj => obj.id === targetObjectId)
    new WorldMarker(id, this, triggerObject, markerData)
  }
  createMarkerById(markerId) {
    let markerRef = this.interactionsTemplate.markers.find(marker => marker.markerId === markerId)
    markerRef.options.conditional = false
    this.createMarker(markerRef.markerId, markerRef.targetObjectId, markerRef.markerData, markerRef.options)
  }
  destroyMarkerById(id) {
    let marker = this.markers.find(m => m.id === id)
    marker.destroy()
  }
  createInteractionById(interactionId) {
    let interactionRef = this.interactionsTemplate.interactions.find(int => int.interactionId === interactionId)
    if(!GameObject.byId(this, interactionRef.triggerObjectId)) return

    interactionRef.options.conditional = false
    this.createInteraction(interactionRef.triggerObjectId, interactionRef.interactionData, interactionRef.options, interactionId)
  }
  createInteraction(triggerObjectId, interactionData, options, interactionId) {
    if(options.disabled)
      return
    if(options.conditional)
      return
    if(options.isAlreadyCreated)
      return

    let triggerObject = this.gameObjects.gameObject.find(obj => obj.id === triggerObjectId)
    let hitbox
    
    if(options.useHostHitbox)
      hitbox = triggerObject.objectData.hitbox
    else
      hitbox = interactionData.hitbox
    
    GameObject.create(
      "interactable", 
      interactionData.interactableDisplayName, 
      {
        transform: new Transform(),
        hitbox: hitbox,
        parent: triggerObject,
        doOnEnter: interactionData.doOnEnter,
        doOnLeave: interactionData.doOnLeave,
        doOnDestroy: interactionData.doOnDestroy,
        interactionData: interactionData,
        interactionId, interactionId
      },
      {
        world: this
      }
    )
    options.isAlreadyCreated = true
  }
  createLightSource(lightData) {
    let parent = GameObject.byId(this, lightData.parentObjectId)
    GameObject.create("lightSource", "unnamed", {lightData: lightData, parent: parent}, {world: this})
  }
  generateFog(fogData) {
    if(!fogData) throw "no fog data"

    fogData.forEach(f => {
      let fog = PIXI.Sprite.from("assets/fogDab.png")
      fog.position.set(f.position.x, f.position.y)
      fog.anchor.set(0.5)
      fog.alpha = f.alpha
      this.fog.push(fog)
      this.layers.fog.addChild(fog)
    })
  }
  updateFog() {
    if(this.mode.isnt("play")) return

    let date = Date.now()
    for(let i = 0; i < this.fog.length; i++) {
      i % 2 == 1 ?
      this.fog[i].rotation = Math.floor(date >> 9) :
      this.fog[i].rotation = Math.floor((date + 1000) >> 9)
    }
  }
  destroyFog() {
    this.fog.forEach(sprite => this.layers.fog.removeChild(sprite))
    this.fog = []
  }
  generateBackground() {
    let objects = []
    let layers = ["background", "background2", "background4"]
    let countPerLayer = [300, 300, 100]
    let variantsPerLayer = [
      {
        "bgMedium0": 6, 
        "bgMedium1": 6, 
        "bgMedium2": 6, 
        "bgMedium3": 6, 
        "bgMedium4": 6, 
        "bgMedium5": 6, 
        "bgLarge0": 1,
        "bgLarge1": 1,
        "bgLarge2": 1,
        "bgLarge3": 1,
        "bgLarge4": 1,
      },
      {
        "bgMedium0": 15, 
        "bgMedium1": 15, 
        "bgMedium2": 15, 
        "bgMedium3": 15, 
        "bgMedium4": 15, 
        "bgMedium5": 15, 
        "bgLarge0": 1,
        "bgLarge1": 1,
        "bgLarge2": 1,
        "bgLarge3": 1,
        "bgLarge4": 1,
      },
      {
        "bgMedium0": 15, 
        "bgMedium1": 15, 
        "bgMedium2": 15, 
        "bgMedium3": 15, 
        "bgMedium4": 15, 
        "bgMedium5": 15,
      },
    ]
    let minDistance = 120
    let attempts = 0

    function newPosition() {
      return new Vector(Random.int(-cw*3, cw*3), Random.int(-ch*3, ch*3))
    }
    generate_bg:
    for(let l = 0; l < layers.length; l++) {
      let count = countPerLayer[l]
      for (let i = 0; i < count; i++) {
        let position;
        let velocity = new Vector(Random.float(-5,5), Random.float(-5,5))
        let rotation = Random.rotation()
        let angularVelocity = Random.float(-PI/8, PI/8) * Random.chance(50)
        let overlapping;
        
        do {
          attempts++
          overlapping = false
          position = newPosition()
          objects.forEach(obj => {
            if(obj.transform.position.distance(position) < minDistance) 
              overlapping = true
          })
          if(attempts > 100_000) {
            console.log(`too many attempts to generate BG (attempts > ${attempts})`)
            break generate_bg
          }
        }
        while(overlapping)

        let gameObject = GameObject.create(
          "decoration", 
          Random.weighted(variantsPerLayer[l]),
          {
            transform: new Transform(
              position,
              velocity,
              rotation,
              angularVelocity,
            ),
            bgType: "asteroid",
          },
          {
            world: this,
            layer: layers[l]
          }
        )
        objects.push(gameObject)
      }
    }
    let 
    planet = PIXI.Sprite.from(`assets/planet/${this.locationRefName}.png`)
    planet.anchor.set(0.5)
    planet.alpha = 1
    this.layers.planet.addChild(planet)

    let 
    stars = PIXI.Sprite.from(`assets/planet/${this.locationRefName}StarTexture.png`)
    stars.anchor.set(0.5)
    stars.alpha = 0.5
    stars.scale.set(0.5)
    this.layers.stars.addChild(stars)
  }
  updateLayers() {
    for(let layername in this.layers) {
      if(GameWorldWindow.layerCounterOffset[layername] !== undefined)
        this.layers[layername].position.set(
          this.camera.transform.position.x * GameWorldWindow.layerCounterOffset[layername], 
          this.camera.transform.position.y * GameWorldWindow.layerCounterOffset[layername]
        )
    }
    this.layers.planet.position.set(this.camera.transform.position.x * 0.98, this.camera.transform.position.y * 0.98 + ch/5)
    for(let layer of GameWorldWindow.scaleLayersWithCamera) {
      this.layers[layer].scale.set(this.camera.currentZoom)
    }
  }
  static layerCounterOffset = {
    background:   0.50,
    background2:  0.80,
    background3:  0.90,
    background4:  0.95,
    vignette:     1.00,
    vignette2:    1.00,
    stars:        1.00,
    fog:          0.00,
    foreground:   1.10,
    foreground2:  1.20,
    foreground3:  1.30,
  }
  static scaleLayersWithCamera = [
    "vignette",
    "vignette2",
    "planet",
    "stars",
  ]
  //#endregion
}
