let dt = 0
let dtf = 0
let fps = 0

let cw = window.innerWidth
let ch = window.innerHeight

let session
let player

const loader = PIXI.Loader.shared

const grid = {
  cellSize: 512,
  origin: new Vector(0),
  texture: PIXI.Texture.from("assets/gridCell.png"),
}
const mapGrid = {
  texture: PIXI.Texture.from("assets/mapGrid.png")
}

const game            = new Game("Game", Q("#game"))
const locationEditor  = new LocationEditor("LocationEditor", Q('#location-editor'))
const dialogueEditor  = new DialogueEditor("DialogueEditor", Q('#dialogue-editor'))
const hitboxEditor    = new HitboxEditor("HitboxEditor",  Q('#hitbox-editor'))
const shipView        = new ShipView("ShipView", Q('#ship-view'))
const dialogueScreen  = new DialogueScreen()
const localMap        = new LocalMap("LocalMap", Q('#local-map'))
const inventory       = new InventoryWindow()
const map             = new WorldMap("WorldMap", Q('#map-ui-container'))
const buyMenu         = new BuyMenu()

program.windows.all.push(
  game,
  locationEditor,
  dialogueEditor,
  hitboxEditor, 
  shipView,
  dialogueScreen,
  localMap,
  inventory,
  map,
  buyMenu,
)