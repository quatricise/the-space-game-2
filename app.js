let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, });
document.body.appendChild(app.view);

let debug_app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
// document.body.appendChild(debug_app.view);

let graphics = new PIXI.Graphics()
app.stage.addChild(graphics)

const loader = PIXI.Loader.shared


let cw = window.innerWidth
let ch = window.innerHeight

let entities = [] //all game objects which exist in the world and need per-frame updating
let rigids = [] // entities that exist in the world and can collide with each other
let ships = []

let characters = [] //array of people, they are like the player and can drive ships

let layer_debris = new PIXI.Container()
let layer_ships = new PIXI.Container()

let render_layers = [ 
  //sequential order of render layers
  layer_debris,
  layer_ships,
]

render_layers.forEach(layer => {
  app.stage.addChild(layer)
})

const binds = {
  rotateCW: "KeyD",
  rotateCCW: "KeyA",
  accel: "KeyW"
}
const keys = {}
{
  let bind_keys = Object.keys(binds)
  for (let i = 0; i < bind_keys.length; i++) {
    Object.defineProperty(
      keys, 
      bind_keys[i], 
      {value: false, writable: true}
    )
  }
}

document.addEventListener("keydown", function (e) {
  updateKeys(e, "keydown")
  //one-shot events, perhaps like "ship.fire()" or something
})
document.addEventListener("keyup", function (e) {
  updateKeys(e, "keyup")
})

function updateKeys(event, eventType = "keydown") {
  let bind_property_names = Object.keys(binds)

  for (let i = 0; i < bind_property_names.length; i++) {
    if(event.code === binds[bind_property_names[i]] && eventType === "keyup") {
      keys[bind_property_names[i]] = false
    }
    if(event.code === binds[bind_property_names[i]] && eventType === "keydown") {
      keys[bind_property_names[i]] = true
    }
  }
}


const camera = {
  pos: {
    x: 0,
    y: 0
  },
  lockedTo: null,

  lockTo(object) { //object === player or some point of interest
    //this smoothly transitions the camera from player, to an objects origin
    this.lockedTo = object
  },
  updatePosition() {
    this.pos.x = this.lockedTo.pos.x
    this.pos.y = this.lockedTo.pos.y
  },
  update() {
    this.updatePosition()
    app.stage.position.x = -this.pos.x + cw/2
    app.stage.position.y = -this.pos.y + ch/2 //maybe like this
    grid.sprite.position.x = Math.floor(this.pos.x / grid.cell_size) * grid.cell_size - grid.cell_size*2
    grid.sprite.position.y = Math.floor(this.pos.y / grid.cell_size) * grid.cell_size - grid.cell_size
  }
}

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

let debug_ship = new Ship(data.ships.asf100, new Vector(cw/2, ch/2), 0)
debug_ship.addToScene()

let player = new Player()
player.ship = debug_ship


let debug_asteroid_0 = new Asteroid(data.entities.asteroids.medium_0, new Vector(100,100), new Vector(0,0), 150, 1.2)
debug_asteroid_0.addToScene()
// let debug_asteroid_1 = new Asteroid(data.entities.asteroids.medium_1, new Vector(15,15), new Vector(0,0), 150, 0.4)
// debug_asteroid_1.addToScene()


let dt = 0;
let dtf = 0;


function tick(delta) {
  dt = app.ticker.deltaMS / 1000
  dtf = delta

  camera.update()
  entities.forEach(entity => {
    entity.update()
    entity.cell_pos.x = Math.floor(entity.pos.x / grid.cell_size)
    entity.cell_pos.y = Math.floor(entity.pos.y / grid.cell_size)
  })
  HitboxTools.drawPolygonHitbox(player.ship.hitbox)
  testCollision()
  player.update()

}

function tickAI() { //function called less often, used to update enemy ai, including obstacle avoidance, which should be really expensive to calculate

}

function init() {
  camera.lockTo(player.ship)
  app.ticker.add(tick)
}

let texture = PIXI.Texture.from("assets/grid_cell.png")
const grid = {
  sprite: null,
  cell_size: 512,
  origin: Vector.zero(), //not gonna mess with this, just wanna point out that the grid origin is in the app.stage origin
}
grid.sprite = new PIXI.TilingSprite(texture, cw + grid.cell_size*2, ch + grid.cell_size*2)
layer_debris.addChild(grid.sprite)

let circle = PIXI.Sprite.from("assets/circle.png")
circle.anchor.x = 0.5
circle.anchor.y = 0.5
app.stage.addChild(circle)


function testCollision() { //run per-frame on all rigids[]
  let collision_successful = false //temporary shit 
  rigids.forEach(rigid => {
    //broadphase
    let candidates = rigids.filter(candidate => 
      candidate.cell_pos.x >= rigid.cell_pos.x - 1 &&
      candidate.cell_pos.x <= rigid.cell_pos.x + 1 &&
      candidate.cell_pos.y >= rigid.cell_pos.y - 1 &&
      candidate.cell_pos.y <= rigid.cell_pos.y + 1
    )
    //second phase
    candidates.forEach(candidate => {
      //rule out self-collision
      if(candidate === rigid) return

      if(rigid.hitbox.type === "circle" && candidate.hitbox.type === "circle") {
        let circle1 = {
          pos: {
            x: rigid.pos.x,
            y: rigid.pos.y,
          },
          radius: rigid.hitbox.radius
        }
        let circle2 = {
          pos: {
            x: candidate.pos.x,
            y: candidate.pos.y,
          },
          radius: candidate.hitbox.radius
        }
        let haveCollided = Collision.circleCircle(circle1, circle2)
        if(haveCollided) collision_successful = true
        //todo, implement the physics handling somewhere
      }
      if(
        (rigid.hitbox.type === "polygon" && candidate.hitbox.type === "circle") ||
        (rigid.hitbox.type === "circle" && candidate.hitbox.type === "polygon") 
      ) {
        let circular;
        let polygonal;
        if(rigid.hitbox.type === "circle") {
          circular = rigid
          polygonal = candidate
        }
        else {
          circular = candidate
          polygonal = rigid
        }
        let circle = {
          pos: {
            x: circular.pos.x,
            y: circular.pos.y,
          },
          radius: circular.hitbox.radius
        }
        polygonal.hitbox.bodies.forEach(body => {
          //make the hitbox coordinates absolute
          let haveCollided = Collision.polygonCircle(body, circle)
          if(haveCollided) collision_successful = true
        })
      }
    })
  })
  if(collision_successful) color = color_yes
  else color = color_no
}


let color_no = 0xffff00

let color_yes = 0xff0000

let color = color_no