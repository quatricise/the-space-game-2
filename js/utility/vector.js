class Vector {
  constructor(x = 0, y) {
    this.x = x
    y === undefined ? this.y = x : this.y = y
    this.type = "vector"
  }
  clone() {
    return new Vector(this.x, this.y)
  }
  get copy() {
    return new Vector(this.x, this.y)
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
  fastLength() {
    return Math.abs(this.x) + Math.abs(this.y)
  }
  scaleTo(vector, factor) {
    let relative = this.copy.sub(vector)
    relative.mult(factor)
    this.setFrom(vector).add(relative)
    return this
  }
  distance(vector) {
    let v = new Vector(
      Math.abs(this.x - vector.x),
      Math.abs(this.y - vector.y)
    )
    return v.length()
  }
  fastDistance(vector) {
    return Math.abs(this.x - vector.x) + Math.abs(this.y - vector.y)
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
    if(angle < 0) 
      angle += TAU
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
  /** 6-decimal-point precision rotation */
  rotate(angle) {
    let precision = 6
    let theta = +angle.toFixed(precision)
    let xTemp = this.x;
    let cos = Math.cos(theta)
    let sin = Math.sin(theta)
    this.x = this.x*cos - this.y*sin;
    this.y = xTemp*sin + this.y*cos;
    this.x = +this.x.toFixed(precision - 2)
    this.y = +this.y.toFixed(precision - 2)
    return this
  }
  rotatePrecise(theta) {
    let xTemp = this.x;
    let cos = Math.cos(theta)
    let sin = Math.sin(theta)
    this.x = this.x*cos - this.y*sin;
    this.y = xTemp*sin + this.y*cos;
    return this
  }
  rotateImprecise(angle) {
    let precision = 6
    let theta = +angle.toFixed(precision)
    let xTemp = this.x;
    let cos = Math.cos(theta)
    let sin = Math.sin(theta)
    this.x = this.x*cos - this.y*sin;
    this.y = xTemp*sin + this.y*cos;
    this.x = +this.x.toFixed(precision - 2)
    this.y = +this.y.toFixed(precision - 2)
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
    if(this.length() > length) 
      this.normalize(length)
    return this
  }
  clampWithinBounds(bounds = {minX: 0, minY: 0, maxX: 0, maxY: 0}) {
    if(this.x < bounds.minX) this.x = bounds.minX 
    if(this.y < bounds.minY) this.y = bounds.minY
    if(this.x > bounds.maxX) this.x = bounds.maxX 
    if(this.y > bounds.maxY) this.y = bounds.maxY
  }
  lerp(target, value) {
    return new Vector(this.x + (target.x - this.x) * value, this.y + (target.y - this.y) * value)
  }
  inBoundary(bound) {
    //is it within a square boundary with a = bound * 2
    return  this.x < bound && 
            this.x > -bound && 
            this.y < bound && 
            this.y > -bound
  }
  set(x, y) {
    this.x = x
    if(y === undefined) 
      this.y = x
    else 
      this.y = y
    return this
  }
  setFrom(vec) {
    this.x = vec.x
    this.y = vec.y
    return this
  }
  is(vector) {
    return this.x === vector.x && this.y === vector.y
  }
  isnt(vector) {
    return this.x !== vector.x || this.y !== vector.y
  }
  isClose(margin, vector) {
    return this.distance(vector) <= margin
  }
  closest(...vectors) {
    let distances = vectors.map(v => v.distance(this))
    let closest = Math.min(...distances)
    return vectors[distances.indexOf(closest)]
  }
  isObjectRotationGreaterThanAngleToVector(vector, objectRotation) {
    let [angle, newObjectRotation] = this.wrapAngleAndRotation(vector, objectRotation)
    return angle < newObjectRotation
  }
  wrapAngleAndRotation(vector, objectRotation) {
    let angle = this.angleTo(vector)
    let newObjectRotation = objectRotation
    if((angle >= PI + PI/2 && angle <= TAU)) {
      angle             -= PI
      newObjectRotation -= PI
      if(newObjectRotation < 0)
        newObjectRotation += TAU
    }
    else
    if((angle >= 0 && angle <= PI/2)) {
      angle             += PI
      newObjectRotation += PI
      if(newObjectRotation > TAU)
        newObjectRotation -= TAU
    }
    return [angle, newObjectRotation]
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
  /** Find the mathematical center of a bounding box made of input vectors */
  static center(...vectors) {
    let left = Math.min(...vectors.map(p => p.x))
    let top = Math.min(...vectors.map(p => p.y))
    let right = Math.max(...vectors.map(p => p.x))
    let bottom = Math.max(...vectors.map(p => p.y))
    return new Vector(left + (right - left) / 2, top + (bottom - top) / 2)
  }
  static rotatePlain(obj, rotation) {
    let sin = Math.sin(rotation);
    let cos = Math.cos(rotation);
    return new Vector((cos * obj.x) + (sin * obj.y),(cos * obj.y) - (sin * obj.x))
  }
  static scalePlain(vector, factor) {
    return {
      x: vector.x * factor,
      y: vector.y * factor
    }
  }
  static angle(x, y) {
    return new Vector(x, y).angle()
  }
}

// for(let i = 0; i < 360; i++) {
//   let [v, w] = [new Vector(0), new Vector(100, 0).rotate(i * PI/180)]
//   console.log(v.angleTo(w))
// }