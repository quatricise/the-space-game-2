function tick(delta) {
  dt = app.ticker.deltaMS / 1000
  dtf = delta

  ui.windows.active.graphics.clear()

  //update
  cameras.forEach(camera => camera.update())
  Q('#zoom-level').innerText = camera.current_zoom
  mouse.update_world_pos()
  entities.forEach(entity => {
    entity.update()
    entity.cell_pos.x = Math.floor(entity.pos.x / grid.cell_size)
    entity.cell_pos.y = Math.floor(entity.pos.y / grid.cell_size)
  })
  rigids.forEach(rigid=> {
    HitboxTools.updateHitbox(rigid)
  })
  player.update()
  
  //collision
  testCollision()
  solveCollision()

  //draw
  interactables.forEach(interactable => {
    HitboxTools.drawHitbox(interactable)
  })
  rigids.forEach(rigid => {
    HitboxTools.drawHitbox(rigid)
  })

  ui.map.update()
  editor.update()
  ui.local_map.update()
}