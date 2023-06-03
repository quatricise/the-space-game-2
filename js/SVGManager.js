class SVGManager {
  static loadShipSVG(shipName, appendTo) {
    let svg = SVGEl("svg", "ship-svg")
    svg.dataset.src = "assets/svg/" + shipName + ".svg"
    setTimeout(() => this.processShipSVG(svg), 100)
    appendTo.append(svg)
  }
  static processShipSVG(svg, attemptNumber = 0) {
    if(svg.childElementCount === 0) {
      setTimeout(() => this.processShipSVG(svg, ++attemptNumber), 100)
      return
    }
    if(attemptNumber > 10) {
      console.warn("taking too long to load svg, maybe it's empty")
    }

    svg.querySelector("title")?.remove()

    let 
    paths = Array.from(svg.querySelectorAll("path"))
    paths = paths.concat(
      Array.from(svg.querySelectorAll("polyline")), 
      Array.from(svg.querySelectorAll("line"))
    )

    paths.forEach(path => {
      path.style.stroke = "#555555"
    })
    let circles = Array.from(svg.querySelectorAll("circle"))
    circles.forEach(circle => {
      circle.style.opacity = 1.0
      circle.style.strokeOpacity = "0.0"
      circle.style.stroke = "#FFFFFF"
      circle.style.strokeWidth = 2
      circle.style.fillOpacity = "0.2"
      circle.style.cursor = "var(--cursor-pointer)"

      circle.classList.add('tooltip')
      circle.dataset.delay = "0"
    
      let hex = rgbToHex(circle.style.fill).toLocaleUpperCase()

      if(hex === "#8FB2FF") {
        circle.dataset.tooltip = "Cargo"
        circle.dataset.tooltipdescription = "Your ship's cargo capacity. Each item you acquire takes up one slot, regardless of weight, because this is a videogame."
      }
      if(hex === "#FFA515") {
        circle.dataset.tooltip = "Engines"
        circle.dataset.tooltipdescription = "Engines determine your maximum speed, how fast you can rotate and how fast you accelerate."
      }
      if(hex === "#35A82C") {
        circle.dataset.tooltip = "Boosters"
        circle.dataset.tooltipdescription = "Special type of engine that allows you to drift sideways."
      }
      if(hex === "#8E1720") {
        circle.dataset.tooltip = "Brakes"
        circle.dataset.tooltipdescription = "Live fast and die young. You don't need brakes."
      }
      if(hex === "#D14622") {
        circle.dataset.tooltip = "Weapons"
        circle.dataset.tooltipdescription = "The weapon system itself. It cannot be upgraded, and it also shouldn't even appear here."
      }
      if(hex === "#3162FF") {
        circle.dataset.tooltip = "Shields"
        circle.dataset.tooltipdescription = `A protective mechanism against projectiles or environmental hazards. There are 4 types: pulse, hard-light, force and bubble.`
      }
      if(hex === "#FCF683") {
        circle.dataset.tooltip = "Hull"
        circle.dataset.tooltipdescription = "The metal carapace often referred to as 'hull' is like the shell of a hermit crab. Without it, the crab will die soon, probably."
      }
      if(hex === "#873EE5") {
        circle.dataset.tooltip = "Stealth"
        circle.dataset.tooltipdescription = "A small module that turns your ship invisible, sort of."
      }
      if(hex === "#FF5959") {
        circle.dataset.tooltip = "Weapon slot 1"
        circle.dataset.tooltipdescription = ""
      }
      if(hex === "#BC1D1D") {
        circle.dataset.tooltip = "Weapon slot 2"
        circle.dataset.tooltipdescription = ""
      }
      if(hex === "#961515") {
        circle.dataset.tooltip = "Weapon slot 3"
        circle.dataset.tooltipdescription = ""
      }
      if(hex === "#7A0C0C") {
        circle.dataset.tooltip = "Weapon slot 4"
        circle.dataset.tooltipdescription = ""
      }

      if(circle.dataset.tooltip.includes("Weapon"))
        circle.dataset.tooltipdescription = "A slot for a weapon. Your ship has a limited number of slots and more cannot be purchased. This was done for balancing."
      circle.dataset.tooltipdescription += "\n \n Click to view system details."

      circle.style.fill = "#FFFFFF"

      circle.onmouseenter = () => {
        if(circle.dataset.tooltip === "Hull") {
          paths.forEach(path => {
            path.style.stroke = "#999999"
          })
        }
        circle.style.fillOpacity = "0.5"
        circle.style.strokeOpacity = "1.0"

      }
      circle.onmouseleave = () => {
        if(circle.dataset.tooltip === "Hull") {
          paths.forEach(path => {
            path.style.stroke = "#555555"
          })
        }
        circle.style.fillOpacity = "0.2"
        circle.style.strokeOpacity = "0.0"
      }
    })
  }
}