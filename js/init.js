(function init() {
  session = new Session()
  map.create_icons()
  game.load_game_world("field")
  game.mode.set("play")
  let ship = GameObject.create(
    "ship", 
    "the_grand_moth", 
    {transform: new Transform()}, 
    {world: game}
  )
  GameObject.create("interactable", "Station XO-1 Store Interface", 
    {
      pos: new Vector(), 
      vel: new Vector(), 
      rotation: 0, 
      rotation_velocity: 0, 
      hitbox: new CircleHitbox(300),
      do_on_enter: ["show_hint"],
      do_on_leave: ["hide_hint"],
      hint_text: "Press [E] to open store",
      parent: game.game_objects.asteroid[0]
    },
    {world: game}
  )
  ship.add_power(ship.brakes)
  ship.add_power(ship.brakes)
  ship.add_power(ship.brakes)
  ship.add_power(ship.engines.main)
  player = new Player()
  player.ship = ship
  
  game.camera.lock_to(player.ship)
  
  program.windows.set(game)
  ship_view.load_svg("needle")
  local_map.load("test_system")
  attach_listeners()
  game.app.ticker.add(tick)
}())
