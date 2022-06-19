function load_ship_svg(filename) {
  let svg = SVGEl("svg", "ship-svg")
  svg.dataset.src = "assets/svg/" + filename + ".svg"
  Q('#ship-view').append(svg)
  setTimeout(()=> {
    if(svg.childElementCount === 0) {
      alert("timeout wasn't long enough OR loaded svg is empty")
      return
    }
    svg.querySelector("title").remove()
    let paths = Array.from(svg.querySelectorAll("path"))
    paths.forEach(path => {
      path.style.stroke = "#aaaaaa"
    })
    let circles = Array.from(svg.querySelectorAll("circle"))
    circles.forEach(circle => {
      circle.classList.add('tooltip')
      if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#8FB2FF"){
        circle.dataset.tooltip = "Cargo"
      }
      if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#FFA515"){
        circle.dataset.tooltip = "Engines"
      }
      if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#FF5959"){
        circle.dataset.tooltip = "Weapons"
      }
      if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#3162FF"){
        circle.dataset.tooltip = "Shields"
      }
      if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#FCF683"){
        circle.dataset.tooltip = "Hull"
      }
      if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#873EE5"){
        circle.dataset.tooltip = "Stealth"
      }
      // circle.onmouseover = () => {
      //   //add some fancy code that displays a nice title
      //   //along with some scifi underline thingy
      // }
      circle.dataset.delay = "0"
      circle.style.strokeOpacity = "0.0"
      circle.style.fillOpacity = "0.3"
      circle.style.cursor = "pointer"
      circle.onmouseenter = () => {
        if(circle.dataset.tooltip === "Hull") {
          paths.forEach(path => {
            path.style.stroke = "#dddddd"
          })
        }
        circle.style.fillOpacity = "0.6"
        circle.style.strokeOpacity = "1.0"
      }
      circle.onmouseleave = () => {
        if(circle.dataset.tooltip === "Hull") {
          paths.forEach(path => {
            path.style.stroke = "#aaaaaa"
          })
        }
        circle.style.fillOpacity = "0.3"
        circle.style.strokeOpacity = "0.0"
      }
    })
  },500)
}

class ShipView {
  constructor() {
    this.element = Q('#ship-view')
    this.graphics = new PIXI.Graphics()
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
}