let dt = 0
let dtf = 0
let fps = 0

let cw = window.innerWidth
let ch = window.innerHeight

let session
let player

const loader = PIXI.Loader.shared

const grid = {
  cell_size: 512,
  origin: new Vector(0),
  texture: PIXI.Texture.from("assets/grid_cell.png"),
}
const map_grid = {
  texture: PIXI.Texture.from("assets/map_grid.png")
}

const game            = new Game("Game", Q("#game"))
const location_editor = new LocationEditor("LocationEditor", Q('#location-editor'))
const dialogue_editor = new DialogueEditor("DialogueEditor", Q('#dialogue-editor'))
const hitbox_editor   = new HitboxEditor("HitboxEditor",  Q('#hitbox-editor'))
const ship_view       = new ShipView("ShipView", Q('#ship-view'))
const dialogue_screen = new DialogueScreen()
const local_map       = new LocalMap("LocalMap", Q('#local-map'))
const inventory       = new InventoryWindow()
const map             = new WorldMap("WorldMap", Q('#map-ui-container'))
const buy_menu        = new BuyMenu()

program.windows.all.push(
  game,
  location_editor,
  dialogue_editor,
  hitbox_editor, 
  ship_view,
  dialogue_screen,
  local_map,
  inventory,
  map,
  buy_menu,
)

function* fibonacci() {
  let current = 0;
  let next = 1;
  while (true) {
    const reset = yield current;
    [current, next] = [next, next + current];
    if(current === 21) throw("21!!!")
    if (reset) {
      current = 0;
      next = 1;
    }
  }
}

const sequence = fibonacci();
