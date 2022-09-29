class LocalMap extends GameWindow {
  constructor(title, element) {
    super(title, element)
    this.graphics = new PIXI.Graphics()
    this.planets = []
    this.orbits = []
    this.ymax = null
    this.ymin = null
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
  addPlanet(element) {
    let planet = {
      element: element,
      offset: 0,
      freq: +element.dataset.freq,
      pos: new Vector(element.getAttribute("cx"), element.getAttribute("cy"))
    }
    this.planets.push(planet)
    // console.log('added planet', planet.freq)
  }
  update() {
    this.planets.forEach((planet, index) => {
      let orbit =   this.orbits[index]
      let length =  orbit.getTotalLength()
      let point =   orbit.getPointAtLength(length*(planet.offset/100))
      planet.pos.set(point.x, point.y)
      planet.offset += planet.freq / 1.5
      let scale = planet.pos.y / this.ymax
      planet.element.setAttribute("transform", `translate(${planet.pos.x} ${planet.pos.y}) scale(${scale + 0.3}) `)
      if(planet.offset > 100) {
        planet.offset = 0
      }
    })
  }
}

LocalMap.prototype.unload = function() {
  this.planets = []
  this.orbits = []
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
    let viewbox = svg.getAttribute("viewBox")
    let ymin = 0
    let ymax = +viewbox.substring(viewbox.lastIndexOf(" "))
    this.ymin = ymin
    this.ymax = ymax
    let paths = Array.from(svg.querySelectorAll("path"))
    let circles = svg.querySelectorAll("circle")
    let newpaths = []
    function compareIndexes(a, b) {
      if (a.dataset.index < b.dataset.index) {
        return -1;
      }
      if (a.dataset.index > b.dataset.index) {
        return 1;
      }
      return 0;
    }
    paths.forEach(path => {
      if(path.style.strokeWidth === "2px" && rgbToHex(path.style.stroke).toLocaleUpperCase() === "#FFFFFF") {
        let index = path.style.opacity.replace("0.", "")
        index = +index - 1
        // console.log('path index', index)
        path.dataset.index = index
        path.dataset.type = "orbit"
        this.orbits.push(path)
        path.style.opacity = "1.0"
        path.style.strokeWidth = "1px"
        newpaths.push(path.cloneNode())
        this.orbits.sort(compareIndexes)
      }
    })
    newpaths.forEach(path => {
      path.dataset.type = ""
      path.style.strokeWidth = "10px"
      path.style.opacity = "0.0"
      path.onmouseover = () => {
        path.style.opacity = "0.16"
      }
      path.onmouseout = () => {
        path.style.opacity = "0.0"
      }
      path.style.cursor = "pointer"
      path.style.fill = ""
    })
    newpaths.sort(compareIndexes)
    newpaths.reverse()
    newpaths.forEach(path => {
      svg.append(path)
    })
    circles.forEach(circle => {
      if(rgbToHex(circle.style.fill).toLocaleUpperCase() === "#FFBC00") {
        circle.dataset.tooltip = "G-Type main sequence star"
        circle.classList.add('tooltip')
        let parent = circle.parentElement
        circle.remove()

        let newcircle = circle.cloneNode()
        newcircle.setAttribute("r", +newcircle.getAttribute("r") + 5)
        newcircle.style.opacity = "0.0"
        circle.onmouseover = () => {
          newcircle.style.opacity = "0.2"
        }
        circle.onmouseout = () => {
          newcircle.style.opacity = "0.0"
        }

        parent.append(newcircle, circle)
      }
      if(rgbToHex(circle.style.fill).toLocaleUpperCase() === "#FFFFFF") {
        let index = circle.style.opacity.replace("0.", "")
        index = +index - 1
        // console.log(index)
        // console.log(circle.style.opacity)
        circle.dataset.index = index
        circle.style.opacity = "1.0"
        circle.dataset.type = "planet"
        let stroke = circle.style.stroke
        let red = stroke.substring(stroke.indexOf("(") + 1, stroke.indexOf(","))
        if(!red) red = 255 
        circle.dataset.freq = red/255
        circle.style.stroke = ""
        this.addPlanet(circle)
        circle.setAttribute("cx", "0")
        circle.setAttribute("cy", "0")
      }
    })

  }, 500)
}
