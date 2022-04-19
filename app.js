
let app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight });
document.body.appendChild(app.view);


// let elapsed = 0;
//   // Tell our application's ticker to run a new callback every frame, passing
//   // in the amount of time that has passed since the last tick
//   app.ticker.add((delta) => {
//     // Add the time to our total elapsed time
//     elapsed += delta;
//     sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
//   });
app.ticker.add((delta) => {
 dt = delta
});

const ship = {
  img_sources: {
    glow: {
      src: "assets/ship_glow.png",
    },
    flame: {
      src: "assets/ship_flame.png",
    },
    fill: {
      src: "assets/ship_fill.png",
    },
    highlights_0: {
      src: "assets/ship_highlights_0.png",
    },
    highlights_90: {
      src: "assets/ship_highlights_90.png",
    },
    highlights_180: {
      src: "assets/ship_highlights_180.png",
    },
    highlights_270: {
      src: "assets/ship_highlights_270.png",
    },
    linework: {
      src: "assets/ship_linework.png",
    },
  },
  sprites: [],
  sprites_highlights: [],
  rotation: 0,
  rotation_speed: 240, //degrees per second
  maxSpeed: 1, //some units lol
  vel: {
    x: 0,
    y: 0
  },
  pos: {
    x: 200,
    y: 100,
  },
  
  addToScene() {
    let sources = Object.keys(this.img_sources)
    for (let i = 0; i < sources.length; i++) {
      let sprite = PIXI.Sprite.from(this.img_sources[sources[i]].src);
      this.sprites.push(sprite)
      if(sources[i].includes("highlights")) this.sprites_highlights.push(sprite)
      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5
      sprite.position.x = 200
      sprite.position.y = 200
      app.stage.addChild(sprite)

      app.ticker.add((delta) => {
        this.update(delta)
      })
    }
  },
  rotate(delta) {
    if(keys.rotateCW) {
      this.rotation += (this.rotation_speed * PI/180) * delta * 0.001
    }
    if(keys.rotateCCW) {
      this.rotation -= (this.rotation_speed * PI/180) * delta * 0.001
    }
    if(this.rotation >= PI*2) this.rotation = 0
    if(this.rotation < 0) this.rotation = PI*2
    this.sprites.forEach(sprite=> {
      sprite.rotation = this.rotation
    })
  },
  updateHighlights() {
    let deg = this.rotation * 180/PI
    for (let i = 0; i < 4; i++) {

      let offsetFromFront = i*90 - deg
      if(offsetFromFront <= -270) offsetFromFront = 360 + offsetFromFront
      offsetFromFront = Math.abs(offsetFromFront)
      this.sprites_highlights[i].alpha = Math.max(0,Math.round((1 - offsetFromFront/90 )*100)/100) //this puts the alpha between 0 and 1 with 0.01 precision
      
    }
  },
  updateSpritePosition() {
    this.sprites.forEach(sprite=> {
      sprite.position.x = this.pos.x
      sprite.position.y = this.pos.y
    })
  },
  accelerate(delta) {
    if(!keys.accel) return
    let accel = vectorRotate(this.maxSpeed/1000, 0, this.rotation)
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
    this.vel.x *= 0.997 * delta
    this.vel.y *= 0.997 * delta
    if(Math.abs(this.vel.x) < 0.001 && Math.abs(this.vel.y) < 0.001) this.vel.x = this.vel.y = 0
  },
  update(delta) {
    this.rotate(delta)
    this.updateHighlights()
    this.accelerate(delta)
    this.move(delta)
    this.brake(delta)
    this.updateSpritePosition()
  }
}

ship.addToScene()

let dt = 0;
const binds = {
  rotateCW: "ArrowRight",
  rotateCCW: "ArrowLeft",
  accel: "ArrowUp"
}
const keys = {}
{
  let bind_keys = Object.keys(binds)
  for (let i = 0; i < bind_keys.length; i++) {
    Object.defineProperty(keys, bind_keys[i], {value: false, writable: true})
  }
}

document.addEventListener("keydown", function (e) {
  updateKeys(e, "keydown")
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

function render() {

}