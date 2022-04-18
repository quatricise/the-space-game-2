// const canvas = Q('#canvas')
// const ctx = canvas.getContext("2d")


// function resizeCanvas() {
//   canvas.width = window.innerWidth
//   canvas.height = window.innerHeight
// }

// resizeCanvas()
// window.onresize = () => {
//   resizeCanvas()
// }

// function render() {
//   requestAnimationFrame(render)

// }

// let game_objects = []
// let rigid_bodies = [] // ? not sure




//pixi stuff




let app = new PIXI.Application({ width: 640, height: 360 });
document.body.appendChild(app.view);

let sprite = PIXI.Sprite.from('assets/heart.png');
app.stage.addChild(sprite);

let elapsed = 0.0;
  // Tell our application's ticker to run a new callback every frame, passing
  // in the amount of time that has passed since the last tick
  app.ticker.add((delta) => {
    // Add the time to our total elapsed time
    elapsed += delta;
    sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
  });

let ship = {
  render() {
    
  }
}
app.ticker.add(ship.render)