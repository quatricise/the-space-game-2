class StarSystemDetail extends GameWindow {
  constructor() {
    super("StarSystemDetail", Q('#star-system-detail'))
    this.windowType = "overlay"
    this.initialize()
  }
  show() {
    this.element.classList.remove('hidden')
  }
  hide() {
    this.element.classList.add('hidden')
  }
  loadStarSystem(starSystemName) {
    this.initialize()

    this.element.querySelector("#star-system-detail-content")

    this.starSystemName = starSystemName
    this.setHTML()
  }
  setHTML() {

  }
  addPlanet() {

  }
  initialize() {
    this.planets = []
    this.orbits = []

    this.ymax = null
    this.ymin = null
    this.sun = null
    this.starSystemName = null
  }
  updateDescription(starSystemName) {
    let location = data.starSystem[starSystemName]
    Q("#star-system-location-title-text").innerText =   location.planets[0].name
    Q("#star-system-location-description").innerText =  location.planets[0].description ?? "Planet description missing"
    Q("#location-detail-planet-image").src =            `assets/locationThumbnails/${location.planets[0].name.decapitalize()}.png`
    Q("#star-system-title").innerText =                 starSystemName.splitCamelCase()
  }
  update() {
    /* maybe keep this function, the planets gonna be moving somehow */
    return
    let speedMultiplier = 25
    this.planets.forEach((planet, index) => {
      let orbit =   this.orbits[index]
      let length =  orbit.getTotalLength()
      let point =   orbit.getPointAtLength(length*(planet.offset/100))
      planet.pos.set(point.x, point.y)
      planet.offset += planet.freq * speedMultiplier * dt
      let scale = planet.pos.y / this.ymax
      planet.element.setAttribute("transform", `translate(${planet.pos.x} ${planet.pos.y}) scale(${scale + 0.3}) `)
      if(planet.offset > 100)
        planet.offset = 0
    })
  }
  handleKeydown(e) {
    if(e.code === "Escape") gameManager.closeWindow()
  }
}
