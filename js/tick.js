function tick(deltaFactor) {
  setDelta(deltaFactor)

  //#region update
  mouse.updateShipAngle()
  mouse.updateWorldPosition()
  filterManager.update()
  gameManager.update()
  gameManager.windows.forEach(win => {
    if(win.graphics) {
      win.graphics.clear()
      win.graphics.alpha = 1.0
    }
    if(win instanceof GameWorldWindow && gameManager.activeWindow === win) {
      win.updateGameObjects()
      win.updateGridSprite()
      win.updateFog()
    }
    win.update()
  })
  //#endregion
  
  //#region interact
  collisionChecksPerFrame = 0
  broadphaseCallsPerFrame = 0
  if(gameManager.activeWindow === game)
    Collision.detect(game)
  if(locationEditor.useCollision)
    Collision.detect(locationEditor)
  //#endregion
}

function setDelta(deltaFactor) {
  dt = game.app.ticker.deltaMS / 1000
  if(dt > 500) 
    dt = 0
  dtf = deltaFactor
  fps = 1000 / game.app.ticker.deltaMS
}

let collisionChecksPerFrame = 0
let broadphaseCallsPerFrame = 0