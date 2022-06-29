function tick(delta) {
  dt = app.ticker.deltaMS / 1000
  dtf = delta

  ui.windows.active.graphics.clear()
  ui.windows.active.graphics.alpha = 1.0
  //update
  cameras.forEach(camera => camera.update())
  Q('#zoom-level').innerText = camera.current_zoom
  mouse.update_world_pos()
  entities.forEach(entity => {
    entity.update()
    entity.update_cell_pos()
  })
  rigids.forEach(rigid=> {
    HitboxTools.updateHitbox(rigid)
  })
  npcs.forEach(n => n.update())
  hints.forEach(hint => hint.update())
  player.update()
  
  //collision
  testCollision()
  solveCollision()

  map.icons.forEach(icon => {
    HitboxTools.drawHitbox(icon)
  })

  //draw
  interactables.forEach(interactable => {
    HitboxTools.drawHitbox(interactable)
  })
  rigids.forEach(rigid => {
    HitboxTools.drawHitbox(rigid)
  })
  if(visible.projections) rigids.forEach(r => {
    r.projections.forEach(box => {
      ui.windows.active.graphics.lineStyle(2, 0x111130, 1)
      ui.windows.active.graphics.drawRect(box.x, box.y, box.w, box.h)
    })
  })
  lasers.forEach(laser => {
    ui.windows.active.graphics.alpha = Math.max(0, laser[0].data.health / laser[0].data.health_init)
    ui.windows.active.graphics.lineStyle(16, 0x330000, 1)
    ui.windows.active.graphics.moveTo(laser[0].x, laser[0].y)
    ui.windows.active.graphics.lineTo(laser[1].x, laser[1].y)
    ui.windows.active.graphics.lineStyle(8, 0x770000, 1)
    ui.windows.active.graphics.moveTo(laser[0].x, laser[0].y)
    ui.windows.active.graphics.lineTo(laser[1].x, laser[1].y)
    ui.windows.active.graphics.lineStyle(4, 0xdd1111, 1)
    ui.windows.active.graphics.moveTo(laser[0].x, laser[0].y)
    ui.windows.active.graphics.lineTo(laser[1].x, laser[1].y)
  })
  //shit hull health
  // ships.forEach(ship => {
  //   let pos = ship.pos.clone().sub(new Vector(90,110))
  //   for (let i = 0; i < ship.hull.curr; i++) {
  //     ui.windows.active.graphics.beginFill(0x00aa00)
  //     ui.windows.active.graphics.lineStyle(2, 0x555555, 1)
  //     ui.windows.active.graphics.drawRect(pos.x, pos.y, 15, 10)
  //     pos.x += 20
  //   }
  // })

  ui.update()
  local_map.update()
  hitbox_editor.update()
  dialogue_editor.update()
  location_editor.update()
  game.update()
  map.update()
  lasers.forEach(laser => {
    laser.forEach(v => {
      v.data.health--
    })
    if(laser.find(v => v.data.health <= 0)) {
      lasers = lasers.filter(l => l !== laser)
    }
  })
}