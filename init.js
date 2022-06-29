function init() {
  camera.lock_to(player.ship)
  app.ticker.add(tick)
  map.create_icons()
  ui.windows.set(game)
  load_ship_svg("bluebird_needle")
  local_map.load("test_system")
}

init()