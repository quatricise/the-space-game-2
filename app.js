let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);
const loader = PIXI.Loader.shared
app.ticker.add((delta) => {
 dt = delta
});

let cw = window.innerWidth
let ch = window.innerHeight

const test_ship = {
  img_sources: {},
  sprites: {
    get all() {
      return this.highlights
    },
    highlights: {
      angle_0: "",
      angle_90: "",
      angle_180: "",
      angle_270: "",
    },
  }
}

let entities = [] //all game objects which exist in the world and need per-frame updating
let rigid = [] // entities that exist in the world and can collide with each other

const ship = {
  img_sources: {
    glow: {
      src: "assets/ship_crown_large/ship_glow.png",
    },
    flame: {
      src: "assets/ship_crown_large/ship_flame.png",
    },
    fill: {
      src: "assets/ship_crown_large/ship_fill.png",
    },
    highlights_0: {
      src: "assets/ship_crown_large/ship_highlights_0.png",
    },
    highlights_90: {
      src: "assets/ship_crown_large/ship_highlights_90.png",
    },
    highlights_180: {
      src: "assets/ship_crown_large/ship_highlights_180.png",
    },
    highlights_270: {
      src: "assets/ship_crown_large/ship_highlights_270.png",
    },
    linework: {
      src: "assets/ship_crown_large/ship_linework.png",
    },
  },
  sprites: [],
  container: new PIXI.Container(),
  sprites_highlights: [],
  animations: [ //todo gonna be solved by using pixiJS AnimatedSprite
    {
      src: "assets/ship_crown_large/anim_json/lights_blue.json",
      sprite: null, // PIXI.AnimatedSprite
      fps: 15,
      repeat: true,
      wait_before_repeat: 5000,
      current_frame: 0,
      current_time: 0,
    },
  ],
  rotation: 0,
  rotation_speed: 210, //degrees per second
  maxSpeed: 20, //some units lol
  vel: {
    x: 0,
    y: 0
  },
  pos: {
    x: cw/2,
    y: ch/2,
  },
  
  addToScene() {
    let sources = Object.keys(this.img_sources)
    //todo, this offset is in pixels, from the top-left corner, i believe, so i need to standardize sprite dimensions 
    // so that the sprite's center is exactly in the center of it's parent container
    console.log(this.container.pivot)
    for (let i = 0; i < sources.length; i++) {
      let sprite = PIXI.Sprite.from(this.img_sources[sources[i]].src);
      sprite.scale.x = 0.8
      sprite.scale.y = 0.8
      // this.sprites.push(sprite)
      // console.log(this.container)
      this.container.addChild(sprite)
      if(sources[i].includes("highlights")) this.sprites_highlights.push(sprite) //todo, put everything inside the sprite container
      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5
      app.stage.addChild(this.container)
    }

//attetmpt 1
    // function setup() {
    //   let sheet = PIXI.Loader.shared.resources["assets/ship_crown_large/anim_json/lights_blue.json"].spritesheet;
    //   animatedSprite = new PIXI.AnimatedSprite(sheet.animations["ship_crown_large"]);
    // }
    
    // PIXI.Loader.shared.add("assets/ship_crown_large/anim_json/lights_blue.json").load(setup);

//attetmpt 2
    // let anim_lights = loader.add("assets/ship_crown_large/anim_json/lights_blue.json")
    // this.animations[0].frames = new PIXI.AnimatedSprite(anim_lights)
//attetmpt 3
// let sheet = PIXI.Loader.shared.resources["assets/ship_crown_large/anim_json/lights_blue.json"].spritesheet;
// this.animations[0].sprite = new PIXI.AnimatedSprite(sheet.animations["ship_the_crown"]);

//attetmpt 4
    let img_sequence = ImgSequence("assets/ship_crown_large/anim_lights_blue/ship_the_crown0000.png", 31)
    let textureArray = []

    for (let i = 0; i < img_sequence.length; i++)
    {
        let texture = PIXI.Texture.from(img_sequence[i]);
        textureArray.push(texture);
    };

    this.animations[0].sprite = new PIXI.AnimatedSprite(textureArray);
    let anim = this.animations[0].sprite
    anim.anchor.x = 0.5
    anim.anchor.y = 0.5
    anim.animationSpeed = 0.1
    anim.play()
    this.container.addChild(anim)
    // app.stage.addChild(this.animations[0].sprite)

    app.ticker.add((delta) => {
      this.update(delta)
    })
  },
  rotate(delta) {
    if(keys.rotateCW) {
      this.rotation += (this.rotation_speed * PI/180) * delta * 0.01
    }
    if(keys.rotateCCW) {
      this.rotation -= (this.rotation_speed * PI/180) * delta * 0.01
    }
    if(this.rotation >= PI*2) this.rotation = 0
    if(this.rotation < 0) this.rotation = PI*2
    this.container.rotation = this.rotation
  },
  updateHighlights() {
    let deg = this.rotation * 180/PI
    for (let i = 0; i < this.sprites_highlights.length; i++) {

      let offsetFromFront = i*90 - deg
      if(offsetFromFront <= -270) offsetFromFront = 360 + offsetFromFront
      offsetFromFront = Math.abs(offsetFromFront)
      this.sprites_highlights[i].alpha = Math.max(0,Math.round((1 - offsetFromFront/90 )*100)/100) //this puts the alpha between 0 and 1 with 0.01 precision
    }
  },
  updateSprite() { //todo all sprites in a ship will be grouped into a container
    // this.sprites.forEach(sprite=> {
    //   sprite.position.x = this.pos.x
    //   sprite.position.y = this.pos.y
    // })

    this.container.position.x = this.pos.x
    this.container.position.y = this.pos.y

  },
  accelerate(delta) {
    if(!keys.accel) return
    let accel = vectorRotate(this.maxSpeed/100, 0, this.rotation)
    accel.y *= -1
    this.vel.x += accel.x * delta
    this.vel.y += accel.y * delta
    
  },
  move(delta) {
    this.pos.x += this.vel.x * delta
    this.pos.y += this.vel.y * delta
  },
  brake(delta) {
    if(keys.accel) return
    this.vel.x *= 0.97 * delta
    this.vel.y *= 0.97 * delta
    if(Math.abs(this.vel.x) < 0.001 && Math.abs(this.vel.y) < 0.001) this.vel.x = this.vel.y = 0
  },
  animate() {

  },
  updateCamera() {
    camera.pos.x = this.pos.x
    camera.pos.y = this.pos.y
  },
  update(delta) {
    this.rotate(delta)
    this.updateHighlights()
    this.accelerate(delta)
    this.move(delta)
    this.brake(delta)
    this.updateSprite()
    this.animate()
  }
}

ship.addToScene()

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

let dt = 0;
function render() {

}


const camera = {
  pos: {
    x: 0,
    y: 0
  },
  lockedToPlayer: true,
  lockToPlayer() {
    //smoothly transition to player
  },
  focusOn(object) {
    //this smoothly transitions the camera from player, to an objects origin
  },
  update() {
    // app.stage.updateLocalTransform() 
    //fucking update the stage translate, so it moves with the ship
  }
}

app.ticker.add((delta) => {
  camera.update()
})

// function FrameSequence(sources = ["assets/something.png"]) {
//   let frames = []
//   sources.forEach(src=> {
//     let img = new Image(); img.src = src
//     frames.push(img)
//   })
//   return frames
// }

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