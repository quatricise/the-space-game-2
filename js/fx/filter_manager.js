class FilterManager {
  constructor() {
    this.filters = []
  }
  update() {
    filter_glitch.red[0] = Math.sin(Date.now()/150) * 3
    filter_glitch.green[1] = Math.sin(Date.now()/300) * 12
    filter_glitch.green[0] = Math.sin(Date.now()/266) - 0.5
    filter_glitch.blue[0] = (Math.sin(Date.now()/180) * 2) - 2
    filter_glitch.blue[1] = Math.sin(Date.now()/60) / 2
    filter_dist_map.time = (Math.tan(Date.now()/1000) + 1)/5
  }
}

const filter_manager = new FilterManager()


let filter_vwb = new PIXI.filters.ColorMatrixFilter()
filter_vwb.brightness(0.5)

let filter_invul = new PIXI.filters.ColorMatrixFilter()
filter_invul.saturate(-0.6)

let filter_glitch = new PIXI.filters.GlitchFilter()
filter_glitch.red = [2,2]
filter_glitch.green = [-0,-2]
filter_glitch.blue = [-2,-2]
filter_glitch.slices = 0

let filter_dist_map = new PIXI.filters.ShockwaveFilter()
filter_dist_map.amplitude = 150
filter_dist_map.wavelength = 160
filter_dist_map.radius = 5000
filter_dist_map.time = 0
filter_dist_map.speed = 500

let filters = {
  glitch: filter_glitch
}
