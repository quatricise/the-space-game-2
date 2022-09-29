class Vector {
  constructor(x = 0, y, data = {}) {
    this.x = x
    if(y === undefined) this.y = x
    else this.y = y
    if(data === true) this.data = {}
    else this.data = _.cloneDeep(data)
  }
  clone(discardData = false) {
    return new Vector(this.x, this.y, discardData || this.data)
  }
  plain() {
    return {x: this.x, y: this.y}
  }
  add(vector) {
    this.x = this.x + vector.x
    this.y = this.y + vector.y
    return this
  }
  sub(vector) {
    this.x = this.x - vector.x
    this.y = this.y - vector.y
    return this
  }
  mult(magnitude) {
    this.x = this.x * magnitude
    this.y = this.y * magnitude
    return this
  }
  div(divider) {
    this.x = this.x / divider
    this.y = this.y / divider
    return this
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  distance(vector) {
    let v = new Vector(
      Math.abs(this.x - vector.x),
      Math.abs(this.y - vector.y)
    )
    return v.length()
  }
  invert() {
    this.x *= -1
    this.y *= -1
    return this
  }
  normalize(length) {
    length = length || 1
    let total = this.length()
    this.x = (this.x / total) * length
    this.y = (this.y / total) * length
    return this
  }
  angle() {
    return Math.atan2(this.y, this.x)
  }
  angleTo(vector) {
    let angle = Math.atan2(vector.y - this.y, vector.x - this.x)
    if(angle < 0) angle += TAU
    return angle
  }
  result() {
    return new Vector(this.x, this.y)
  }
  lerp(vector, amount) {
    return new Vector(
      this.x + (vector.x - this.x) * amount,
      this.y + (vector.y - this.y) * amount
    )
  }
  rotate(angle) {
    this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
    this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
    return this
  }
  rotateAround(vector, rotation) {
    this.sub(vector)
    .rotate(rotation)
    .add(vector)
    return this
  }
  floor() {
    this.x = Math.floor(this.x)
    this.y = Math.floor(this.y)
    return this
  }
  round() {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
    return this
  }
  clamp(length) {
    if(this.length() > length) this.normalize(length)
    return this
  }
  lerp(target, value) {
    return new Vector(this.x + (target.x - this.x) * value, this.y + (target.y - this.y) * value)
  }
  inbound(bound) {
    //is it within a square boundary with a = bound * 2
    return  this.x < bound && 
            this.x > -bound && 
            this.y < bound && 
            this.y > -bound
  }
  set(x, y) {
    this.x = x
    if(y === undefined) this.y = x
    else this.y = y
    return this
  }
  setFrom(vec) {
    this.x = vec.x
    this.y = vec.y
  }
  is(vector) {
    return this.x === vector.x && this.y === vector.y
  }
  isClose(margin, vector) {
    return this.distance(vector) <= margin
  }
  static zero() {
    return new Vector(0, 0)
  }
  static fromAngle(rotation) {
    return new Vector(Math.cos(rotation), Math.sin(rotation))
  }
  static avg(...vectors) {
    let x = [],y = []
    vectors.map(vec => {x.push(vec.x); y.push(vec.y)})
    return new Vector(avg(...x), avg(...y))
  }
}