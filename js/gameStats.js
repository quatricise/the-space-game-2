class GameStats {
  constructor() {
    this.fields = {}
    this.fields.zoom =            El("div", "game-stat-zoom")
    this.fields.state =           El("div", "game-stat-state")
    this.fields.reactor =         El("div", "game-stat-reactor")
    this.fields.currency =        El("div", "game-stat-currency")
    this.fields.stageOffset =     El("div", "game-stat-stageOffset")
    this.fields.fps =             El("div", "game-stat-fps")
    this.fields.collisionCount =  El("div", "game-stat-collisionCount")
  }
}