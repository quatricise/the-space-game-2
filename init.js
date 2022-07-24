function init() {
  app.ticker.add(tick)
  map.create_icons()
  game.load_location("test")
  
  ship = new Ship(new Vector(0,0), undefined, undefined, undefined, "wasp_fighter")
  ship.addToScene()
  player = new Player()
  player.ship = ship
  
  camera.lock_to(player.ship)

  ui.windows.set(game)
  load_ship_svg("bluebird_needle")
  local_map.load("test_system")
  attach_listeners()
}

init()