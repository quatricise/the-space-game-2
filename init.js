function init() {
  camera.lockTo(player.ship)
  app.ticker.add(tick)
  ui.windows.set(game)
  ui.windows.set(dialogue_editor)
}

init()