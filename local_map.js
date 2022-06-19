class LocalMap {
  constructor() {
    this.graphics = new PIXI.Graphics()
    this.element = Q('#local-map')
    this.planets = []
    this.sun = null
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
  update() {

  }
}

LocalMap.prototype.unload = function() {
  this.planets = []
  this.sun = null
}
LocalMap.prototype.load = function(filename) {
  this.unload()
  let svg = SVGEl("svg", "ship-svg")
  svg.dataset.src = "assets/svg/" + filename + ".svg"
  Q('#local-map').append(svg)
  setTimeout(()=> {
    if(svg.childElementCount === 0) {
      alert("timeout wasn't long enough OR loaded svg is empty")
      return
    }
    svg.querySelector("title").remove()
    let paths = Array.from(svg.querySelectorAll("path"))
    let circles = svg.querySelectorAll("circle")
    paths.forEach(path => {
      if(path.style.strokeWidth === "2px" && rgb_to_hex(path.style.stroke).toLocaleUpperCase() === "#FFFFFF") {
        let index = path.style.opacity.replace("0.", "").replace("1.0", "10").substring(0, 2)
        index = +index - 1
        path.dataset.index = index
      }
    })
    circles.forEach(circle => {
      if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#FFBC00") {
        circle.dataset.tooltip = "G-Type main sequence star"
        circle.classList.add('tooltip')
        let parent = circle.parentElement
        circle.remove()
        parent.append(circle)
      }
      if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#FFFFFF") {
        let index = circle.style.opacity.replace("0.", "").replace("1.0", "10").substring(0, 2)
        index = +index - 1

        circle.dataset.index = index
        circle.style.opacity = "1.0"
        let path = paths.find(path => path.dataset.index === circle.dataset.index)
        let d = path.getAttribute("d")
        console.log(d)
        let s = d.lastIndexOf("s")
        let S = d.lastIndexOf("S")
        let last
        if(s === -1) last = S
        else
        if(S === -1) last = s
        else last = Math.max(s, S)
        d = d.substring(0, last)
        {
          let c = d.lastIndexOf("c")
          let C = d.lastIndexOf("C")
          if(c === -1) last = C
          else
          if(C === -1) last = c
          else last = Math.max(c, C)
        }

        let point = d.substring(last)
        point = point.replace("c", "").replace("C", "").replace("Z", "")
        let coords = point.split(",")
        console.log(d)
        // console.log(last)
        console.log(point)
        // console.log(coords)
        // circle.setAttribute("cx", coords[2])
        // circle.setAttribute("cy", coords[3])
      }
    })

  }, 500)
}