function tick(deltaFactor) {
  setDelta(deltaFactor)
  //#region update
  player.update()
  program.update()
  mouse.updateShipAngle()
  mouse.updateWorldPosition()
  program.windows.all.forEach(w => {
    if(w.graphics) {
      w.graphics.clear()
      w.graphics.alpha = 1.0
    }
    if(w instanceof GameWorldWindow) {
      w.updateGameObjects()
      w.updateStats()
      w.updateGridSprite()
      w.updateFog()
    }
    w.update()
  })
  //#endregion

  //#region interact
  CollisionDetector.detect(game)
  //#endregion
}

function setDelta(deltaFactor) {
  dt = game.app.ticker.deltaMS / 1000
  if(dt > 500) 
    dt = 0
  dtf = deltaFactor
  fps = 1000 / game.app.ticker.deltaMS
}