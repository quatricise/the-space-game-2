let scenes = [] //temporary way to store all info relating to one physical world location
let cameras = []
let entities = [] //all game objects which exist in the world and need per-frame updating
let rigids = [] // all rigidbodies with physics
let projectiles = []
let ships = []
let characters = [] //array of people, they are like the player and can drive ships
let interactables = [] //entities in the world which can trigger events

//background grid
const grid = {
  cell_size: 512,
  origin: new Vector(0),
  texture: PIXI.Texture.from("assets/grid_cell.png")
}
// grid.sprite = new PIXI.TilingSprite(grid.texture, cw + grid.cell_size*2, ch + grid.cell_size*2)
// layer_debris.addChild(grid.sprite)

// grid.sprite = new PIXI.TilingSprite(grid.texture, cw + grid.cell_size*2, ch + grid.cell_size*2)

const loader = PIXI.Loader.shared

let editor_app = new PIXI.Application({ width: cw, height: ch, });
editor_app.view.classList.add('editor-app')

let app = new PIXI.Application({ width: cw, height: ch, });
document.body.appendChild(app.view);

let level_app = new PIXI.Application({ width: cw, height: ch, });


let editor_layer_debris = new PIXI.Container()
let editor_layer_ships = new PIXI.Container()
let editor_layer_graphics = new PIXI.Container()

let editor_layers = [
  editor_layer_debris,
  editor_layer_ships,
  editor_layer_graphics,
]

const editor = new HitboxEditor()
editor.element.append(editor_app.view)

editor_layers.forEach(layer => {
  editor.app.stage.addChild(layer)
})


class Game {
  constructor() {
    this.element = Q('#game')
    this.graphics = new PIXI.Graphics()
    this.app = app
    this.origin = origin
    this.grid_sprite = new PIXI.TilingSprite(grid.texture, cw + grid.cell_size*2, ch + grid.cell_size*2)
    layer_debris.addChild(this.grid_sprite)
    layer_graphics.addChild(this.graphics)
    this.state = new State(
      "explore",
      "battle",
      "dialogue",
      "map_open",
    )
    this.add_origin()
  }
  add_origin() {
    let origin = PIXI.Sprite.from("assets/origin.png")
    origin.anchor.x = 0.5
    origin.anchor.y = 0.5
    this.app.stage.addChild(origin)
  }
  show() {
    this.element.classList.remove('hidden')
  }
  hide() {
    this.element.classList.add('hidden')
  }
  toggle() {
    this.element.classList.toggle('hidden')
  }
}

//render layers //todo, currently not very implemented
let layer_debris = new PIXI.Container()
let layer_projectiles = new PIXI.Container()
let layer_ships = new PIXI.Container()
let layer_graphics = new PIXI.Container()

let render_layers = [ 
  layer_debris,
  layer_projectiles,
  layer_ships,
  layer_graphics,
]

const game = new Game()

const ship_view = new ShipView()

const location_editor = new LocationEditor()

render_layers.forEach(layer => {
  game.app.stage.addChild(layer)
})

const dialogue_editor = new DialogueEditor()


//primitively adding some objects to the scene
let debug_ship = new Ship(new Vector(0,0), undefined, undefined, undefined, data.ships.crimson_fighter)
debug_ship.addToScene()

let player = new Player()
player.ship = debug_ship

let debug_station = new Asteroid(new Vector(1000, 1000), new Vector(0,0), 0, 0.2, data.entities.asteroids.crimson_station)
debug_station.addToScene()

let debug_fighter = new Asteroid(new Vector(500, 500), new Vector(0,0), 0, 0, data.entities.asteroids.crimson_fighter)
debug_fighter.addToScene()

let debug_asteroid_0 = new Asteroid(new Vector(-500,-500), new Vector(0,0), 150, 1.2, data.entities.asteroids.medium_0)
debug_asteroid_0.addToScene()

let debug_asteroid_1 = new Asteroid(new Vector(-70,-70), new Vector(0,0), 150, 0.4, data.entities.asteroids.medium_1)
debug_asteroid_1.addToScene()

interactables.push(new Interactable(new Vector(200, 200)))

/////////////////////////////////////////////

let dt = 0;
let dtf = 0;

ui.map = new WorldMap()
ui.local_map = new LocalMap()
let map = ui.map
let local_map = ui.local_map
const camera = new Camera("world_camera", app.stage)
game.camera = camera

ui.windows.all.push(editor)
ui.windows.all.push(game)
ui.windows.all.push(dialogue_editor)
ui.windows.all.push(ship_view)
ui.windows.all.push(location_editor)
