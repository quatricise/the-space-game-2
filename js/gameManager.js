class GameManager {
  constructor() {
    this.windows = []
    this.windowHistory = []
    this.activeWindow = null
    this.playerData = {
      shipName: "theGrandMoth",
      shipId: "player_ship"
    }
  }
  newGame() {
    cutsceneWindow.loadCutscene("intro")
    cutsceneWindow.onexit = () => this.loadStartingLocation()
    AudioManager.playLoopedAudio("music", "introCutscene", 0.75)
  }
  loadStartingLocation(name = "kaeso") {
    gameManager.setWindow(game)
    game.loadLocation(name, setup.bind(this))
    function setup() {
      /* player */
      let ship = GameObject.create("ship", this.playerData.shipName, {transform: new Transform(), id: this.playerData.shipId,}, {world: game})
      player = GameObject.create("player", "player", {}, {world: game})
      player.ship = ship
      player.currency = 150

      /* horrible hack, this adds an item into player's inventory for every weapon the ship is instantiated with */
      for(let weapon of ship.weapons.weapons)
        player.inventory.addItems(new Item(weapon.name))

      game.camera.lockTo(player.ship)
      gameUI.updateShipHullUI()
      game.mode.set("play")
      game.app.ticker.add(tick)

      AudioManager.playLoopedAudio("music", "kaesoBackground", 0.7)
  
      /* this hack fast-forwards the ship docking animation so it looks like the ship started docked, even though it didnt */
      setTimeout(() => {
        player.ship.dockBegin()
        player.ship.timers.dock.currentTime += player.ship.timers.dock.duration - 10
      }, 100)

      /* this tries to fix the camera, should be set BEFORE THE ship starts docking */
      setTimeout(() => game.camera.currentZoom = 1.25)
    }
  }
  loadLocation(starSystemName) {
    /* rudimentary bad saving system that only saves the ship and player data */
    let playerInventory = player.inventory
    let shipWeapons = player.ship.weapons.weapons.map(weapon => weapon.name)

    AudioManager.playSFX("ultraportTravel")
    this.removePlayerControl()
    gameManager.setWindow(game)
    console.log(player.ship)
    game.loadLocation(starSystemName, setup.bind(this))
    
    function setup() {
      let entryBeacon = GameObject.byId(game, "entry_beacon")
      let shipOffset = Vector.fromAngle(Random.float(0, TAU)).mult(256)
      let transform = new Transform(entryBeacon.transform.position.clone().add(shipOffset))

      console.warn("Recreated player; inserted previous inventory into player; this is a hack")

      player = GameObject.create("player", "player", {}, {world: game})
      let ship = GameObject.create(
        "ship", 
        this.playerData.shipName, 
        {
          transform,
          id: this.playerData.shipId,
        }, 
        {
          world: game
        }
      )
      console.log(ship.gameWorld)
      player.ship = ship
      game.camera.lockTo(player.ship)

      /* 
      hack player and ship to restore their inventory and weapons, 
      the timeout is necessary because the weapon sprites are added inside a 0ms timeout 
      this timeout technically needs only be 0ms but I wanted to be sure it works
      */
      setTimeout(() => {
        player.inventory = playerInventory
        player.ship.weapons.removeAllWeapons()
        for(let weapon of shipWeapons)
          player.ship.weapons.addWeapon(weapon)
      }, 100)

      setTimeout(() => player.ship.skip.playTravelAnimation(player.ship.transform.position), 1500)

      gameUI.updateShipHullUI()
      gameUI.destroyUIWeaponComponents()
      this.restorePlayerControl()
    }
  }
  togglePause() {
    game.app.ticker.started ? this.pauseGame() : this.unpauseGame()
  }
  pauseGame() {
    game.app.ticker.stop()
    gameManager.setWindow(pauseScreen)
  }
  unpauseGame() {
    game.app.ticker.start()
    gameManager.setWindow(game)
  }
  endGame() {
    setTimeout(() => this.setWindow(gameoverScreen), 2500)
    console.log("game over, unregistering player handlers...")
    this.removePlayerControl()
  }
  removePlayerControl() {
    this.playerHandleInput = player.handleInput
    this.playerUpdate = player.update
    player.handleInput = () => {}
    player.update = () => {}
  }
  restorePlayerControl() {
    player.handleInput = this.playerHandleInput
    player.update = this.playerUpdate
  }
  saveAndQuit() {
    gameManager.setWindow(startScreen)
  }
  setWindow(newWindow) {
    if(!this.windows.find(w => w === newWindow)) return
    if(this.activeWindow === newWindow) return

    this.windows.forEach(otherWindow => {
      if(otherWindow === newWindow) return

      if(newWindow instanceof Game)
        gameUI.show()
      else 
        gameUI.hide()

      if(newWindow instanceof DialogueScreen) {
        game.show()
      }
      else
      if(newWindow instanceof InventoryWindow) {
        game.show()
      }
      else
      if(newWindow instanceof GameoverScreen) {
        game.show()
      }
      else
      if(newWindow instanceof PauseScreen) {
        game.show()
      }
      else
      if(newWindow instanceof ReceivedItemModal) {
        game.show()
        dialogueScreen.show()
      }
      else
      if(newWindow instanceof StarSystemDetail) {
        map.show()
      }
      else {
        otherWindow.hide()
      }
    })
            
    this.activeWindow = newWindow
    this.activeWindow.show()
    this.activeWindow.active = true
    this.windowHistory.push(newWindow)
  }
  closeWindow() {
    this.activeWindow.hide()
    this.activeWindow.active = false
    let prev = this.windowHistory.pop()
    this.setWindow(this.windowHistory.pop())
  }
  handleInput(e) {
    mouse.handleInput(e)
    gameUI.handleInput(e)
    this.activeWindow.handleInput(e)
    this.activeWindow.uiComponents.forEach(comp => comp.handleInput(e))
  }
  update() {
    gameUI.update()
    this.activeWindow.uiComponents.forEach(comp => comp.update())
  }
  loadDeathmatch() {
    this.loadStartingLocation('deathmatch0')
    Q("#ui-left-side-panel").classList.remove("hidden")
    Q("#ui-right-side-panel").classList.remove("hidden")
  }
  loadNextDeathmatchArena() {
    let index = +game.locationName.replace(/[^0-9\.]+/g, '')
    this.loadLocation("deathmatch" + (index + 1))
  }
  preloadImageAssets() {
    /* 
    this function preloads assets by creating a dud gameObject and tries to load a sprite component for it
    it's not perfect but most assets will be requested
    */
    let errors = []
    for(let type in sources.img) {
      for(let name in sources.img[type]) {
        try {
          let 
          gameObject = new GameObject()
          gameObject.name = name
          gameObject.type = type
          gameObject.addComponent("sprite")
        }
        catch(e) {
          errors.push([e, type, name])
        }
      }
    }
    if(errors.length) console.log(errors)
  }
}