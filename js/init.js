(function init() {
  map.createIcons()
  game.loadGameWorld("empty")
  game.mode.set("play")

  let ship = GameObject.create(
    "ship", 
    "theGrandMoth", 
    {transform: new Transform()}, 
    {world: game}
  )
  ship.addPower(ship.brakes)
  ship.addPower(ship.brakes)
  ship.addPower(ship.brakes)
  ship.addPower(ship.engines.main)
  player = new Player()
  player.ship = ship

  game.camera.lockTo(player.ship)
  
  GameObject.create("interactable", "Station XO-1 Store Interface", 
    {
      transform: new Transform(),
      hitbox: new CircleHitbox(300),
      doOnEnter: ["showHint"],
      doOnLeave: ["hideHint"],
      hintText: "Press [E] to open store",
      parent: game.gameObjects.asteroid[0]
    },
    {world: game}
  )
  
  program.windows.set(game)
  console.log(program.windows.active)
  shipView.loadSVG("needle")
  localMap.load("testSystem")
  attachListeners()
  game.app.ticker.add(tick)
})();
