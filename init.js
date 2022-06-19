function init() {
  camera.lockTo(player.ship)
  app.ticker.add(tick)
  ui.windows.set(game)
  // ui.windows.set(dialogue_editor)
  load_ship_svg("bluebird_needle")
  local_map.load("test_system")
}

init()