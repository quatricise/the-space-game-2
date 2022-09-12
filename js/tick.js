function tick(deltaFactor) {
  set_delta(deltaFactor)
  //#region update
  player.update()
  program.update()
  mouse.update_ship_angle()
  mouse.update_world_position()
  program.windows.all.forEach(w => {
    if(w.graphics) {
      w.graphics.clear()
      w.graphics.alpha = 1.0
    }
    if(w instanceof GameWorldWindow) {
      w.update_game_objects()
      w.update_stats()
      w.update_grid_sprite()
      w.update_fog()
    }
    w.update()
  })
  //#endregion

  //#region interact
  CollisionDetector.detect(game)
  //#endregion
}

function set_delta(deltaFactor) {
  dt = game.app.ticker.deltaMS / 1000
  if(dt > 500) dt = 0
  dtf = deltaFactor
  fps = 1000 / game.app.ticker.deltaMS
}