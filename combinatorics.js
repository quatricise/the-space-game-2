const canvas = document.createElement("canvas"); canvas.style.position = "absolute"; canvas.style.width = "100vw"; canvas.style.height = "100vh";
const ctx = canvas.getContext("2d")
let cw = window.innerWidth
let ch = window.innerHeight
updateCanvasSize()

function updateCanvasSize() {
  canvas.height = window.innerHeight
  canvas.width = window.innerWidth
  cw = window.innerWidth
  ch = window.innerHeight
}

window.onresize = () => {
  updateCanvasSize()
}

let colors = {
  main: "hsl(0,0%,100%)"
}

let colors_default = {
  ...colors
}

const mouse = {
  pos: {
    x: 0,
    y: 0
  },
  getPosition(e) {
    this.pos.x = e.clientX
    this.pos.y = e.clientY
  },
  isOver(point = {x: 0, y: 0}, radius) {
    let dist = Math.hypot(this.pos.y - point.y, this.pos.x - point.x)
    if(dist < radius) {
      return true
    }
    else return false;
  },
}


function render() {
  requestAnimationFrame(render)
  ctx.fillStyle = "black"
  ctx.fillRect(0,0, cw, ch)

  testPointsForHover()
  let isHighlighted = false
  points.forEach(point => {
    if(point.highlighted && !isHighlighted) isHighlighted = true
    else return
  })
  if(isHighlighted) colors.main = "hsl(0,0%,50%)"
  else colors.main = colors_default.main

  renderLines()
  renderPoints()
  renderCursor()
}

let origin = {
  x: cw/2,
  y: ch/2
}

let factions = [
  "Alliance",
  "The Crimson League",
  "The Hive",
  "The Crown",
  "Trader's Union",
  "Player"
]


let point_count = factions.length
let point_radius = 30
let graph_radius = 300
let points = []

{
  let rotation = 0
  let rotation_step = (PI*2) / point_count
  let vector = {x: 0, y: -graph_radius}
  vector = vectorRotate(vector.x, vector.y, rotation)

  for (let i = 0; i < point_count; i++) {
    if(i > 0) vector = vectorRotate(vector.x, vector.y, rotation_step )
    points.push(
      {
        pos: {          
          x: vector.x,
          y: vector.y
        },
        highlighted: false,
      }
    )
  }
}

let lastTime = Date.now()
let dt = 0;

function renderPoints( ) {
  let now = Date.now()
  dt = (now - lastTime) / 1000
  lastTime = now
  ctx.save()
  ctx.translate(origin.x, origin.y)
  for (let i = 0; i < points.length; i++) {
    ctx.save()
    ctx.beginPath()
    // ctx.moveTo(points[0].pos.x, points[0].pos.y)
    ctx.arc(points[i].pos.x, points[i].pos.y, point_radius, 0, PI*2)
    ctx.strokeStyle = colors.main
    ctx.stroke()
    ctx.closePath()
    ctx.font = "20px Arial"
    ctx.fillText(factions[i],points[i].pos.x, points[i].pos.y - 50)
    ctx.restore()
  }
  ctx.restore()
}

let linesdrawn = 0

function renderLines() {
  linesdrawn = 0
  //draw perimeter lines
  ctx.save()
  ctx.translate(origin.x, origin.y)
  ctx.beginPath()
  ctx.moveTo(points[0].pos.x, points[0].pos.y)
  for (let i = 0; i < points.length; i++) {
    ctx.lineTo(points[i].pos.x, points[i].pos.y)
  }
  ctx.lineTo(points[0].pos.x, points[0].pos.y)
  ctx.strokeStyle = colors.main
  ctx.stroke()
  ctx.closePath()
  ctx.restore()
  //draw the rest of the lines
  for (let i = 0; i < points.length; i++) {
    let prevpoint;
    let nextpoint;
    if(i === 0) prevpoint = points[points.length - 1]
    else prevpoint = points[i - 1]
    if(i === points.length - 1) nextpoint = points[0]
    else nextpoint = points[i + 1]
    
    points.forEach(point => {
      if(point === prevpoint || point === nextpoint) {
        return
      }
      linesdrawn++
      ctx.save()
      ctx.translate(origin.x, origin.y)
      ctx.beginPath()

      ctx.moveTo(points[i].pos.x, points[i].pos.y)
      ctx.lineTo(point.pos.x, point.pos.y)
      ctx.strokeStyle = colors.main
      ctx.stroke()
      ctx.closePath()

      ctx.restore()

    })
  }
  // console.log("lines drawn: " + linesdrawn)
}

function testPointsForHover() {
  points.forEach(point => {
    let pos = {
      x: point.pos.x + origin.x,
      y: point.pos.y + origin.y
    }
    if(mouse.isOver(pos, point_radius)) {
      // points = points.filter(p=> p != point)
      //code that makes this point highlighted
      point.highlighted = true
    }
    else point.highlighted = false
  })
}

function renderCursor() {
  ctx.fillStyle = colors.main
  ctx.arc(mouse.pos.x, mouse.pos.y, 2, 0, PI*2, false)
  ctx.fill()
}


function init() {
  document.body.append(canvas)
  render()
}
init()

document.addEventListener("mousemove", function(e) {
  mouse.getPosition(e)
}, false)