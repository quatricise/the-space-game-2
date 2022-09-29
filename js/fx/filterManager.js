class FilterManager {
  constructor() {
    this.filters = []
  }
  update() {
    filterGlitch.red[0] = Math.sin(Date.now()/150) * 3
    filterGlitch.green[1] = Math.sin(Date.now()/300) * 12
    filterGlitch.green[0] = Math.sin(Date.now()/266) - 0.5
    filterGlitch.blue[0] = (Math.sin(Date.now()/180) * 2) - 2
    filterGlitch.blue[1] = Math.sin(Date.now()/60) / 2
    filterDistMap.time = (Math.tan(Date.now()/1000) + 1)/5
  }
}

const filterManager = new FilterManager()


let filterVwb = new PIXI.filters.ColorMatrixFilter()
filterVwb.brightness(0.5)

let filterInvul = new PIXI.filters.ColorMatrixFilter()
filterInvul.saturate(-0.6)

let filterGlitch = new PIXI.filters.GlitchFilter()
filterGlitch.red = [2,2]
filterGlitch.green = [-0,-2]
filterGlitch.blue = [-2,-2]
filterGlitch.slices = 0

let filterDistMap = new PIXI.filters.ShockwaveFilter()
filterDistMap.amplitude = 150
filterDistMap.wavelength = 160
filterDistMap.radius = 5000
filterDistMap.time = 0
filterDistMap.speed = 500

let filters = {
  glitch: filterGlitch
}
