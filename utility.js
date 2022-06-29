function Q(query) {
  return document.querySelector(query)
}
function Qa(query) {
  return Array.from(document.querySelectorAll(query))
}

function El(
  element_tag_name = "div", 
  css_class = "words separated by spaces", 
  attributes = [] /* = [["key", "value"]] */,
  inner_text = "",
) {
  let element = document.createElement(element_tag_name)
  let css_classes = css_class.split(' ')
  attributes.forEach(attr=> {
    element.setAttribute(attr[0], attr[1])
  })
  css_classes.forEach(cls => {
    element.classList.add(cls)
  })
  element.innerText = inner_text
  return element
}

El.special = (name) => {
  if(name === "node-socket-out") return El('div', "dialogue-node-socket out", [["title", "Drag to connect to other sockets"]])
  if(name === "node-socket-in") return El('div', "dialogue-node-socket in", [["title", "Drag to connect to other sockets"]])
}

El.has_all_classes = (element, classes = []) => {
  let predicate = true
  classes.forEach(cls => {
    if(element.classList.contains(cls) === false) predicate = false 
  })
  return predicate
}

function SVGEl(
  element_tag_name = "svg", 
  css_class = "words separated by spaces", 
  attributes = [] /* = [["key", "value"]] */,
  inner_text = "",
) {
  let element = document.createElementNS("http://www.w3.org/2000/svg", element_tag_name)
  let css_classes = css_class.split(' ')
  attributes.forEach(attr=> {
    element.setAttribute(attr[0], attr[1])
  })
  css_classes.forEach(cls => {
    element.classList.add(cls)
  })
  element.innerText = inner_text
  return element
}

function getChildIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.childNodes, node)
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
function clamp(value, min, max) {
  let val = value
  if(val <= min) val = min
  if(val >= max) val = max
  return val
}

function sum(values = []) {
  let result = 0
  values.forEach((val)=> {
    result += val
  })
  return result
}

function uniqueID(array) {
  let id = randR(0, 1_000_000)
  let isUnique = false
  while(!isUnique) {
    isUnique = true
    array.forEach(item => {
      if(item.id === id) {
        isUnique = false
        id = randR(0, 1_000_000)
      }
    })
  }
  return id
}
function stringToBool(string) {
  if(string === "true") return true
  if(string === "false") return false
  else alert(`not "false" or "true"`)
}
//valueTo is more accurately an ADD value to the valueFrom - if valueFrom = 900, valueTo = 100, the resulting value = 1000
function easeLinear(curTime, valueFrom, valueAdd, duration) {
  return (valueAdd * curTime) / duration + valueFrom;
}

function easeInOutQuad(curTime, valueFrom, valueAdd, duration) {
  if ((curTime /= duration / 2) < 1) {
    return (valueAdd / 2) * curTime * curTime + valueFrom;
  } else {
    return (-valueAdd / 2) * (--curTime * (curTime - 2) - 1) + valueFrom;
  }
}

function easeOutQuad(curTime, valueFrom, valueAdd, duration) {
  return -valueAdd * (curTime /= duration) * (curTime - 2) + valueFrom;
}

function easeInQuad(curTime, valueFrom, valueAdd, duration) {
  return valueAdd * (curTime /= duration) * curTime + valueFrom;
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
  constructor(x, y, data = {}) {
    this.x = x
    if(y === undefined) this.y = x
    else this.y = y
    if(data === true) this.data = {}
    else this.data = _.cloneDeep(data)

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
    this.dot = function(vector) {

    }
    this.sub = function (vector) {
      this.x = this.x - vector.x
      this.y = this.y - vector.y
      return this
    }
    this.clone = function (discard_data) {
      return new Vector(this.x, this.y, discard_data || this.data)
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
    this.set = function (x, y) {
      this.x = x
      if(y === undefined) this.y = x
      else this.y = y
    }
    this.set_from = function (vec) {
      this.x = vec.x
      this.y = vec.y
    }
    this.is = function (vector) {
      return this.x === vector.x && this.y === vector.y
    }
    this.isClose = function (margin, vector) {
      return this.distance(vector) <= margin
    }
    this.floor = function () {
      this.x = Math.floor(this.x)
      this.y = Math.floor(this.y)
      return this
    }
    this.round = function () {
      this.x = Math.round(this.x)
      this.y = Math.round(this.y)
      return this
    }
  }
  static zero() {
    return new Vector(0, 0)
  }
  static fromAngle(rotation) {
    return new Vector(Math.cos(rotation), Math.sin(rotation))
  }
}

function world_to_client_pos(window, pos) {
  return pos.clone().sub(window.camera.pos).add(new Vector(cw/2, ch/2))
}

function capitalize(string) {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1)
}

function rgb_to_hex(rgb) {
  var a = rgb.split("(")[1].split(")")[0]
  a = a.split(",")
  var b = a.map((x) => {              //For each array element
    x = parseInt(x).toString(16)      //Convert to a base16 string
    return (x.length==1) ? "0"+x : x  //Add zero if we get only one character
  })
  return "#" + b[0] + b[1] + b[2]
}

String.prototype.cap = function() {
  return this.charAt(0).toLocaleUpperCase() + this.slice(1)
}
String.prototype.rev = function() {
  let array = this.split('')
  let string = array.reverse().join('')
  return string
}

String.prototype.bool = function() {
  if(this.includes("false")) return false
  if(this.includes("true")) return true
}

String.prototype.bob = function () {
  return this.replaceAll("bo","bob").replaceAll("mo","bob").replaceAll("do","bob").replaceAll("ko","bob").replaceAll("no","bob").replaceAll("lo","lobob")
}