class Line {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint
    this.endPoint = endPoint
    this.points = [startPoint, endPoint]
    this.type = "line"
  }
  get angle() {
    return this.startPoint.angleTo(this.endPoint)
  }
}