class GameDebugStats {
  constructor() {
    this.fields = {}
    this.fields.zoom = El("div", "game-stat-zoom")
    this.fields.state = El("div", "game-stat-state")
    this.fields.reactor = El("div", "game-stat-reactor")
    this.fields.currency = El("div", "game-stat-currency")
    this.fields.stage_offset = El("div", "game-stat-stage_offset")
    this.fields.fps = El("div", "game-stat-fps")
    this.fields.collision_count = El("div", "game-stat-collision_count")
  }
}