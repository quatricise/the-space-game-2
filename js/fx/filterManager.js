class FilterManager {
  constructor() {
    this.filters = filters
    this.setupFilters()
  }
  setupFilters() {
    filters.vwb =             new PIXI.filters.ColorMatrixFilter()
    filters.unpoweredWeapon = new PIXI.filters.ColorMatrixFilter()
    filters.invulnerable =    new PIXI.filters.ColorMatrixFilter()
    filters.laserHit =        new PIXI.filters.ColorMatrixFilter()
    filters.glitch =          new PIXI.filters.GlitchFilter()
    filters.distMap =         new PIXI.filters.ShockwaveFilter()

    filters.vwb.brightness(0.5)
    
    filters.invulnerable.tint(0xffc197, false)

    filters.laserHit.browni(4)

    filters.unpoweredWeapon.desaturate(1)
    
    filters.glitch.slices = 0
    filters.glitch.scaleFactor = 1
    
    filters.distMap.amplitude = 150
    filters.distMap.wavelength = 160
    filters.distMap.radius = 5000
    filters.distMap.time = 0
    filters.distMap.speed = 500
  }
  scaleGlitchFilter(factor) {
    filters.glitch.scaleFactor = factor
  }
  update() {
    let date = Date.now()

    filters.glitch.red[0] = Math.sin(date/250) * 20             * filters.glitch.scaleFactor
    filters.glitch.red[1] = Math.sin(date/150) * 20             * filters.glitch.scaleFactor
    filters.glitch.green[1] = Math.sin(date/300) * 12           * filters.glitch.scaleFactor
    filters.glitch.green[0] = (Math.sin(date/266) - 0.5) * 8    * filters.glitch.scaleFactor
    filters.glitch.blue[0] = ((Math.sin(date/180) * 2) - 2) * 8 * filters.glitch.scaleFactor
    filters.glitch.blue[1] = (Math.sin(date/60) / 2) * 8        * filters.glitch.scaleFactor

    filters.distMap.time = (Math.tan(date/1000) + 1)/5
  }
  updateInvulnerablilityFilter(dateNow) {
    //this should produce a flashing effect, if i recall correctly
    filters.invulnerable.saturate(
      (Math.round((Math.sin(dateNow/75) - 1) / 2) / 2) - 0.5
    )
  }
  updateGameWorldFilters() {
    gameWorld.filters.forEach(filter => {
      filter
    })
  }
}
