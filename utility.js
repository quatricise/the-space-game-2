function Q(query) {
  return document.querySelector(query)
}
function Qa(query) {
  return Array.from(document.querySelectorAll(query))
}

function rand(min, max) {
  return Math.random()*(max-min) + min
}
function randR(min, max) {
  return Math.round(Math.random()*(max-min) + min)
}
function randInt(min, max) {
  return Math.round(Math.random()*(max-min) + min)
}
function pickRand(values = [0,1]) {
  let index = Math.round(Math.random()*(values.length - 1))
  return values[index]
}

function sum(values = []) {
  let result = 0
  values.forEach((val)=> {
    result += val
  })
  return result
}

function easeLinear(curTime, valueFrom, valueTo, duration) {
  return (valueTo * curTime) / duration + valueFrom;
}

function mode(arr) {
  return arr.sort((a,b) =>
        arr.filter(v => v === a).length
      - arr.filter(v => v === b).length
  ).pop();
}

const reducer = (accumulator, curr) => accumulator + curr;

// usage: [].reduce(reducer()) or something

function vectorRotate(x, y, rot) {
  var sin = Math.sin(rot);
  var cos = Math.cos(rot);
  var newPos = {
    x: (cos * x) + (sin * y),
    y: (cos * y) - (sin * x)
  }
  return newPos;
}

function vectorScale(vector, factor) {
  var newPos = {
    x: vector.x * factor,
    y: vector.y * factor
  }
  return newPos;
}

function vectorNorm() {
  //normalize vector
}

function weightedRandom(values = {apple: 1, orange: 2}) {
  let weights = []
  let keys = Object.keys(values)

  for (let i = 0; i < keys.length; i++) {
    weights.push(values[keys[i]])
  }

  let thresholds = []
  let value = 0;
  let prevValue = 0;
  for (let i = 0; i < keys.length; i++) {
    value = weights[i] + prevValue
    thresholds.push(value)
    prevValue = value
  }
  let pick;
  let random = randR(0,thresholds[thresholds.length - 1])

  for (let i = 0; i < thresholds.length; i++) {
    if(i === 0) {

      if(random < thresholds[i]) {
        pick = keys[i]
        break
      }

    }
    if(i > 0 && i < (thresholds.length - 1)) {

      if(random > thresholds[i - 1] && random <= thresholds[i]) {
        pick = keys[i]
        break
      }

    }
    if(i == thresholds.length - 1) {

      if(random <= thresholds[i]) {
        pick = keys[i]
        break
      }

    }
  }
  return pick
}


const PI = Math.PI


class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y

    this.length = function () {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    this.distance = function (vector) {
      let v = new Vector(
        Math.abs(this.x - vector.x),
        Math.abs(this.y - vector.y)
      )
      return v.length()
    }

    this.add = function (vector) {
      this.x = this.x + vector.x
      this.y = this.y + vector.y
      return this
    }

    this.sub = function (vector) {
      this.x = this.x - vector.x
      this.y = this.y - vector.y
      return this
    }

    this.mult = function (magnitude) {
      this.x = this.x * magnitude
      this.y = this.y * magnitude
      return this
    }

    this.normalize = function (length) {
      length = length || 1
      let total = this.length()
      this.x = (this.x / total) * length
      this.y = (this.y / total) * length
      return this
    }

    this.toAngle = function () {
      return Math.atan2(this.y, this.x)
    }

    this.result = function () {
      return new Vector(this.x, this.y)
    }
    this.lerp = function (vector, amount) {
      return new Vector(
        this.x + (vector.x - this.x) * amount,
        this.y + (vector.y - this.y) * amount
      )
    }
    this.rotate = function (angle) {
      return new Vector(
        this.x * Math.cos(angle) - this.y * Math.sin(angle),
        this.x * Math.sin(angle) + this.y * Math.cos(angle)
      )
    }
    this.clamp = function (length) {
      if (this.length() > length)
        this.normalize(length)
      return this
    }
    this.lerp = function (target, value) {
      return new Vector(this.x + (target.x - this.x) * value, this.y + (target.y - this.y) * value)
    }
    this.inbound = function (bound) {
      return this.x < bound && this.x > -bound && this.y < bound && this.y > -bound
    }
  }
  static zero() {
    return new Vector(0, 0)
  }
  static fromAngle(rotation) {
    return new Vector(Math.cos(rotation), Math.sin(rotation))
  }
}

// let v = new Vector(10,10)