let scenes = [] //temporary way to store all info relating to one physical world location
let cameras = []
let entities = [] //all game objects which exist in the world and need per-frame updating
let rigids = [] // all rigidbodies with physics
let projectiles = []
let ships = []
let npcs = [] //array of people, they are like the player and can drive ships
let interactables = [] //entities in the world which can trigger events
let hints = []
let lasers = []
let locations = []

let filter_vwb = new PIXI.filters.ColorMatrixFilter()
filter_vwb.brightness(0.5)

let filter_invul = new PIXI.filters.ColorMatrixFilter()
filter_invul.saturate(-0.6)


//background grid
const grid = {
  cell_size: 512,
  origin: new Vector(0),
  texture: PIXI.Texture.from("assets/grid_cell.png"),
}
const map_grid = {
  texture: PIXI.Texture.from("assets/map_grid.png")
}

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

const hitbox_editor = new HitboxEditor()
hitbox_editor.element.append(editor_app.view)

editor_layers.forEach(layer => {
  hitbox_editor.app.stage.addChild(layer)
})


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

render_layers.forEach(layer => {
  game.app.stage.addChild(layer)
})

const ship_view = new ShipView()
const location_editor = new LocationEditor()
const dialogue_editor = new DialogueEditor()
const object_editor = new ObjectEditor()
const inventory = new Inventory()

let dt = 0;
let dtf = 0;


const local_map = new LocalMap()
const map = new WorldMap()

const camera = new Camera(app.stage)
game.camera = camera

ui.windows.all.push(
  hitbox_editor, 
  game,
  dialogue_editor,
  ship_view,
  object_editor,
  location_editor,
  inventory,
  map,
)

let player
let ship

//primitively adding some objects to the scene


// let john = new NPC("john")
// let hms_john = new Ship(new Vector(200, 200), new Vector(0,0), 0, 0, "needle")
// hms_john.addToScene()
// john.assign_ship(hms_john)

// let barbara = new NPC("barbara")
// let hms_barbara = new Ship(new Vector(500, 200), new Vector(0,0), 0, 0, "crimson")
// hms_barbara.addToScene()
// barbara.assign_ship(hms_barbara)

// let leto = new NPC("leto")
// let hms_leto = new Ship(new Vector(500, 200), new Vector(0,0), 0, 0, "crimson")
// hms_leto.addToScene()
// leto.assign_ship(hms_leto)

// john.set_target(hms_barbara)
// barbara.set_target(hms_john)
// leto.set_target(hms_john)

// let debug_station = new Asteroid(new Vector(1000), new Vector(0,0), 0, 0.05, data.asteroids.crimson_station)
// debug_station.addToScene()

// let debug_asteroid_0 = new Asteroid(new Vector(-500), new Vector(0,0), 150, 1.2, data.asteroids.medium_0)
// debug_asteroid_0.addToScene()

// let debug_asteroid_1 = new Asteroid(new Vector(-70), new Vector(0,0), 150, 0.4, data.asteroids.medium_1)
// debug_asteroid_1.addToScene()

// interactables.push(new Interactable(new Vector(1000), new BoxHitbox(600, 600, debug.colors.hitbox_interactable), ["show_hint"], ["hide_hint"], "Press [E] to open store"))

/////////////////////////////////////////////