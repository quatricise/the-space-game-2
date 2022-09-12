class ShipView extends GameWindow {
  constructor(title, element) {
    super(title, element)
    this.graphics = new PIXI.Graphics()
  }
  handle_keydown(event) {

  }
  handle_keyup(event) {
    
  }
  handle_mousemove(event) {
    
  }
  handle_mousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".ship-stat")) {
        Array.from(this.element.querySelectorAll(".ship-stat")).forEach(el => el.classList.remove("selected"))
        target.closest(".ship-stat").classList.add("selected")
      }
    }
  }
  handle_mouseup(event) {
    
  }
  handle_click(event) {
    
  }
  update() {
    
  }
  //#region static methods
  load_svg(ship_name) {
    let svg = SVGEl("svg", "ship-svg")
    svg.dataset.src = "assets/svg/" + ship_name + ".svg"
    Q('#ship-view-model').append(svg)
    setTimeout(()=> {
      if(svg.childElementCount === 0) {
        console.warn("timeout wasn't long enough OR loaded svg is empty")
        return
      }
      svg.querySelector("title")?.remove()
      let paths = Array.from(svg.querySelectorAll("path"))
      paths.forEach(path => {
        path.style.stroke = "#aaaaaa"
      })
      let circles = Array.from(svg.querySelectorAll("circle"))
      circles.forEach(circle => {
        circle.classList.add('tooltip')
        circle.dataset.delay = "0"
        circle.style.strokeOpacity = "0.0"
        circle.style.fillOpacity = "0.3"
        circle.style.cursor = "var(--cursor-pointer)"
  
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#8FB2FF") {
          circle.dataset.tooltip = "Cargo"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#FFA515") {
          circle.dataset.tooltip = "Engines"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#35A82C") {
          circle.dataset.tooltip = "Boosters"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#8E1720") {
          circle.dataset.tooltip = "Brakes"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#D14622") {
          circle.dataset.tooltip = "Weapons"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#3162FF") {
          circle.dataset.tooltip = "Shields"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#FCF683") {
          circle.dataset.tooltip = "Hull"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#873EE5") {
          circle.dataset.tooltip = "Stealth"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#FF5959") {
          circle.dataset.tooltip = "Weapon slot 1"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#BC1D1D") {
          circle.dataset.tooltip = "Weapon slot 2"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#961515") {
          circle.dataset.tooltip = "Weapon slot 3"
        }
        if(rgb_to_hex(circle.style.fill).toLocaleUpperCase() === "#7A0C0C") {
          circle.dataset.tooltip = "Weapon slot 4"
        }
        if(circle.dataset.tooltip.includes("Weapon slot")) {
          circle.style.fillOpacity = 0.0
          circle.style.fill = "#FFFFFF"
        }
  
        circle.onmouseenter = () => {
          if(circle.dataset.tooltip === "Hull") {
            paths.forEach(path => {
              path.style.stroke = "#dddddd"
            })
          }
          if(circle.dataset.tooltip.includes("Weapon slot")) {
            circle.style.fillOpacity = "0.3"
          }
          else {
            circle.style.fillOpacity = "0.6"
            circle.style.strokeOpacity = "1.0"
          }
        }
        circle.onmouseleave = () => {
          if(circle.dataset.tooltip === "Hull") {
            paths.forEach(path => {
              path.style.stroke = "#aaaaaa"
            })
          }
          if(circle.dataset.tooltip.includes("Weapon slot")) {
            circle.style.fillOpacity = "0.0"
          }
          else {
            circle.style.fillOpacity = "0.3"
            circle.style.strokeOpacity = "0.0"
          }
        }
      })
    },500)
  }
}