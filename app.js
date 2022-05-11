let scenes = [] //temporary way to store all info relating to one physical world location
let cameras = []
let entities = [] //all game objects which exist in the world and need per-frame updating
let rigids = [] // all rigidbodies with physics
let ships = []
let characters = [] //array of people, they are like the player and can drive ships
let interactables = [] //entities in the world which can trigger events

let app = new PIXI.Application({ width: cw, height: ch, });
document.body.appendChild(app.view);

let debug_app = new PIXI.Application({ width: cw, height: ch, });
// document.body.appendChild(debug_app.view);

let graphics = new PIXI.Graphics()
app.stage.addChild(graphics)

const loader = PIXI.Loader.shared

//render layers //todo, currently not implemented
let layer_debris = new PIXI.Container()
let layer_ships = new PIXI.Container()

let render_layers = [ 
  layer_debris,
  layer_ships,
]
render_layers.forEach(layer => {
  app.stage.addChild(layer)
})

//background grid
let texture = PIXI.Texture.from("assets/grid_cell.png")
const grid = {
  sprite: null,
  cell_size: 512,
  origin: Vector.zero(),
}
grid.sprite = new PIXI.TilingSprite(texture, cw + grid.cell_size*2, ch + grid.cell_size*2)
layer_debris.addChild(grid.sprite)

let circle = PIXI.Sprite.from("assets/circle.png")
circle.anchor.x = 0.5
circle.anchor.y = 0.5
app.stage.addChild(circle)

function ImgSequence(src = "path/to/file0000.png", frames_total = 5) {
  let str = src.slice(0, src.length - 8)
  let sequence = []
    for (let i = 0; i < frames_total; i++) {
      let src;
      if(i > 999) src = str + "" + i + ".png"
      else
      if(i > 99) src = str + "0" + i + ".png"
      else
      if(i > 9) src = str + "00" + i + ".png"
      else src = str + "000" + i + ".png"
      sequence.push(src)
    }
    return sequence
}

function AnimatedSprite(first_image = "assets/file0000.png", image_count) {
  let img_sequence = ImgSequence(first_image, image_count)
  let textureArray = []

  for (let i = 0; i < img_sequence.length; i++)
  {
      let texture = PIXI.Texture.from(img_sequence[i]);
      textureArray.push(texture);
  };
  let sprite = new PIXI.AnimatedSprite(textureArray);
  return sprite
}

let debug_ship = new Ship(new Vector(cw/2, ch/2), undefined, undefined, undefined, data.ships.crimson_fighter)
debug_ship.addToScene()

let player = new Player()
player.ship = debug_ship

let debug_station = new Asteroid(new Vector(1000, 1000), new Vector(0,0), 0, 0.2, data.entities.asteroids.crimson_station)
debug_station.addToScene()

let debug_fighter = new Asteroid(new Vector(500, 500), new Vector(0,0), 0, 0, data.entities.asteroids.crimson_fighter)
debug_fighter.addToScene()

let debug_asteroid_0 = new Asteroid(new Vector(-5,-5), new Vector(0,0), 150, 1.2, data.entities.asteroids.medium_0)
debug_asteroid_0.addToScene()

let debug_asteroid_1 = new Asteroid(new Vector(-70,-70), new Vector(0,0), 150, 0.4, data.entities.asteroids.medium_1)
debug_asteroid_1.addToScene()

interactables.push(new Interactable(new Vector(200, 200)))

let dt = 0;
let dtf = 0;


function tick(delta) {
  dt = app.ticker.deltaMS / 1000
  dtf = delta

  graphics.clear()

  cameras.forEach(camera => camera.update())
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
  
  testCollision()
  solveCollision()

  interactables.forEach(interactable => {
    HitboxTools.drawHitbox(interactable)
  })
  rigids.forEach(rigid => {
    HitboxTools.drawHitbox(rigid)
  })

  ui.map.update()

  graphics.lineStyle(2, 0x0000FF, 1);
  graphics.arc(rigids[0].pos.x, rigids[0].pos.y, 150, rigids[0].rotation + 1, rigids[0].rotation + PI - 1)
  graphics.closePath()
  graphics.arc(rigids[0].pos.x, rigids[0].pos.y, 150, rigids[0].rotation + PI + 1, rigids[0].rotation - 1)
  graphics.closePath()
}


ui.map = new WorldMap()
let map = ui.map
const camera = new Camera("world_camera")

function init() {
  camera.lockTo(player.ship)
  app.ticker.add(tick)
}
