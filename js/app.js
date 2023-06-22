async function loadFonts(callback) {
  let fonts = [
    {family: "space",       url: "./fonts/space_grotesk_variable.ttf"},
    {family: "big-t-comic", url: "./fonts/big-t-comic.ttf"},
  ]
  for(let font of fonts) {
    let fontFace = new FontFace(font.family, `url('${font.url}')`, {style: "normal", weight: 400})
    await fontFace.load()
    document.fonts.add(fontFace)
  }
  callback()
}
const PI =      +Math.PI.toFixed(12)
const TAU =     +Math.PI.toFixed(12)*2
const halfPI =  +(Math.PI / 2).toFixed(12)
const PI_16 =   +(Math.PI / 16).toFixed(12)
const PI_32 =   +(Math.PI / 32).toFixed(12)
const SQRT2 =   Math.SQRT2
const emptyObject = {}
class Range {
  constructor(from, to, value) {
    this.from = +from
    this.to = +to
    value ? this.value = value : this._value = from
  }
  set value(value) {
    this._value = value
    if(this._value < this.from) this._value = this.from
    else
    if(this.value > this.to)    this._value = this.to
    
    return this._value
  }
  offset(value) {
    this.value = this._value + value
  }
  get value() {
    return this._value
  }
}
class MathUtils {
  static clamp(value, min, max) {
    let val = value
    if(val <= min) val = min
    else
    if(val >= max) val = max
    return val
  }
  static sum(...values) {
    let result = 0
    values.forEach(val => result += val)
    return result
  }
  static avg(...numbers) {
    let sum = 0
    numbers.map(num => sum += num)
    return sum / numbers.length
  }
}
class Random {
  static float(from = 0, to = 1) {
    return Math.random()*(to - from) + from
  }
  static int(from = 0, to = 1) {
    return Math.round(this.float(from, to))
  }
  static decimal(from = 0, to = 1, decimalPoints = 1) {
    return +this.float(from, to).toFixed(decimalPoints)
  }
  static intArray(from, to, count) {
    let ints = []
    for(let i = 0; i < count; i++) {
      ints.push(this.int(from, to))
    }
    return ints
  }
  static rotation() {
    return this.float(0, TAU)
  }
  static bool() {
    return !!this.int(0, 1)
  }
  static chance(chance) {
    return this.int(0, 100) < chance
  }
  static from(...array) {
    return array[Math.round(Math.random()*(array.length - 1))]
  }
  static dataFrom(...array) {
    let i = this.int(0, array.length - 1)
    return array[i]
  }
  static weighted(values = {apple: 1, orange: 2}) {
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
    let random = this.int(0,thresholds[thresholds.length - 1])
  
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
  /* mess of functions adding IDs */
  static id(length = 10) {
    let num = Math.random() * 1_000_000_000
    return num.toFixed(length)
  }
  static idFor(objects) {
    let id = this.id()
    let isUnique = false
    while(!isUnique) {
      isUnique = true
      objects.forEach(item => {
        if(item.id === id) {
          isUnique = false
          id = this.id()
        }
      })
    }
    return id
  }
  static uniqueID(array) {
    let id = this.int(0, 1_000_000_000_000)
    if(!array)
      return id
  
    let isUnique = false
    while(!isUnique) {
      isUnique = true
      array.forEach(item => {
        if(item.id === id) {
          isUnique = false
          id = this.int(0, 1_000_000)
        }
      })
    }
    return id
  }
  static uniqueIDHEX(size = 16) {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  
    for (let n = 0; n < size; n++)
      result.push(hexRef[Math.floor(Math.random() * 16)])
      
    return result.join('');
  }
  static uniqueIDString(size = 16) {
    let result = [];
    let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  
    for (let n = 0; n < size; n++)
      result.push(alphabet[Math.floor(Math.random() * 16)])
      
    return result.join('');
  }
}

String.prototype.capitalize = function() {
  return this.charAt(0).toLocaleUpperCase() + this.slice(1)
}
String.prototype.decapitalize = function() {
  return this.charAt(0).toLocaleLowerCase() + this.slice(1)
}
String.prototype.reverse = function() {
  return this.split('').reverse().join('')
}
String.prototype.bool = function() {
  if(this.includes("false")) return false
  if(this.includes("true")) return true
}
String.prototype.matchAgainst = function(...strings) {
  let match = false
  strings.forEach(str => {
    if(str == this) 
      match = true
  })
  return match
}
String.prototype.includesAny = function(...strings) {
  for(let str of strings)
    if(this.includes(str))
      return true
}
String.prototype.splitCamelCase = function() {
  return this.replace(/([a-z])([A-Z])/g, '$1 $2')
}
String.prototype.camelCaseToArray = function() {
  return this.splitCamelCase().toLocaleLowerCase()
}

Array.prototype.remove = function(...children) {
  children.forEach(child => {
    if(this.find(c => c === child) === undefined)
      return
    this.splice(this.indexOf(child), 1)
  })
}
Array.prototype.findChild = function(child) {
  return this.find(obj => obj === child)
}
Array.prototype.last = function() {
  return this[this.length - 1]
}
Array.prototype.removeAt = function(index) {
  return this.splice(index, 1)
}
Array.prototype.empty = function() {
  while(this.length)
    this.pop()
}

function Q(query) {
  return document.querySelector(query)
}
function Qa(query) {
  return Array.from(document.querySelectorAll(query))
}
function El(
  elementTagName = "div", 
  cssClass = "words separated by spaces", 
  attributes = [] /* = [["key", "value"]] */,
  innerText = "",
  dataset = [],
) {
  let element = document.createElement(elementTagName)
  let cssClasses = cssClass.split(' ')
  attributes.forEach(attr=> {
    element.setAttribute(attr[0], attr[1])
  })
  cssClasses.forEach(cls => {
    element.classList.add(cls)
  })
  dataset.forEach(attribute => {
    element.dataset[attribute[0]] = attribute[1] 
  })
  element.innerText = innerText
  return element
}

El.special = (name) => {
  if(name === "node-socket-out") return El('div', "dialogue-node-socket out", [["title", "Drag to connect to other sockets"]])
  if(name === "node-socket-in") return El('div', "dialogue-node-socket in", [["title", "Drag to connect to other sockets"]])
}

El.hasAllClasses = (element, classes = []) => {
  let predicate = true
  classes.forEach(cls => {
    if(element.classList.contains(cls) === false) predicate = false 
  })
  return predicate
}

function SVGEl(
  elementTagName = "svg", 
  cssClass = "words separated by spaces", 
  attributes = [] /* = [["key", "value"]] */,
  innerText = "",
) {
  let element = document.createElementNS("http://www.w3.org/2000/svg", elementTagName)
  let cssClasses = cssClass.split(' ')
  attributes.forEach(attr=> {
    element.setAttribute(attr[0], attr[1])
  })
  cssClasses.forEach(cls => {
    element.classList.add(cls)
  })
  element.innerText = innerText
  return element
}

function getChildIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.childNodes, node)
}
function getChildIndexForElement(node) {
  return Array.prototype.indexOf.call(node.parentElement.childNodes, node)
}

class Rotation {
  constructor(value) {
    this._value = value
  }
  set value(value) {
    value = +value.toFixed(12)
    while(value < 0)
      value += TAU
    while(value > TAU)
      value -= TAU
    this._value = value
  }
  get degrees() {
    return Math.round(this._value * 180/PI)
  }
  get value() {
    return this._value
  }
}
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
  rotate(theta) {
    this.rotateImprecise(theta)
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
class Ease {
  static InOut(curTime, valueFrom, valueAdd, duration) {
    if ((curTime /= duration / 2) < 1) {
      return (valueAdd / 2) * curTime * curTime + valueFrom;
    } else {
      return (-valueAdd / 2) * (--curTime * (curTime - 2) - 1) + valueFrom;
    }
  }
  static InOutAlternate(curTime, valueFrom, valueAdd, duration) {
    let halfDuration = duration / 2
    let maxValue = valueFrom + valueAdd
    if(curTime <= halfDuration)
      return this.InOut(curTime, valueFrom, valueAdd, halfDuration)
    else
      return maxValue - this.InOut(curTime - halfDuration, valueFrom, valueAdd - valueFrom, halfDuration)
  }
  static In(curTime, valueFrom, valueAdd, duration) {
    return valueAdd * (curTime /= duration) * curTime + valueFrom
  }
  static Out(curTime, valueFrom, valueAdd, duration) {
    return -valueAdd * (curTime /= duration) * (curTime - 2) + valueFrom;
  }
  static Linear(curTime, valueFrom, valueAdd, duration) {
    return (valueAdd * curTime) / duration + valueFrom;
  }
  static LinearAlternate(curTime, valueFrom, valueAdd, duration) {
    let halfDuration = duration / 2
    let maxValue = valueFrom + valueAdd
    if(curTime <= halfDuration)
      return this.Linear(curTime, valueFrom, valueAdd, halfDuration)
    else
      return maxValue - this.Linear(curTime - halfDuration, valueFrom, valueAdd - valueFrom, halfDuration)
  }
}
let debug = {
  camera: false,
  hitbox: false,
  mouse: false,
  editor: false,
  map: false,
  dialogueEditor: false,
  locationEditor: false,
  markers: false,
}

let devmode = true
let colors = {
  hitbox: {
    noCollision: 0xffff00,
    shapeSelected: 0x0000ff,
    collision: 0xff0000,
    interactable: 0x00ff00,
    dockingPoint: 0x00ff00,
    weaponSlot: 0xffaa00,
    projection: 0x111160,
    shields: 0x1e54e7
  }
}
let visible = {
  hitbox: false,
  navMesh: false,
  origin: true,
  sprite: true,
  particles: true,
  projections: false,
}

function exportToJSONFile(data, filename) {
  let dataStr = JSON.stringify(data, null, 2);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  let defaultName = filename || 'data.json';

  if(filename) defaultName += ".json"

  let 
  linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', defaultName);
  linkElement.click();
}

function readJSONFile(file, callback) {
  var request = new XMLHttpRequest();
  request.overrideMimeType("application/json");
  request.open("GET", file, true);
  request.onreadystatechange = function() {
    if(request.readyState === 4 && request.status == "200") {
      callback(request.responseText);
    }
  }
  request.send(null);
}


function exportToUTF8(text, filename) {     
  let dataStr = text
  let dataUri = 'data:text/javascript;charset=utf-8,'+ encodeURIComponent(dataStr);
  let defaultName = filename || 'file.js';

  let 
  linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', defaultName);
  linkElement.click();
} 
function clamp(value, min, max) {
  let val = value
  if(val <= min) val = min
  if(val >= max) val = max
  return val
}

function sum(...values) {
  let result = 0
  values.forEach(val => result += val)
  return result
}

function avg(...numbers) {
  let sum = 0
  numbers.map(num => sum += num)
  return sum / numbers.length
}

function uniqueID(array) {
  let id = Random.int(0, 1_000_000_000_000)
  if(!array)
    return id

  let isUnique = false
  while(!isUnique) {
    isUnique = true
    array.forEach(item => {
      if(item.id === id) {
        isUnique = false
        id = Random.int(0, 1_000_000)
      }
    })
  }
  return id
}

function uniqueIDHEX(size = 16) {
  let result = [];
  let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

  for (let n = 0; n < size; n++)
    result.push(hexRef[Math.floor(Math.random() * 16)])
    
  return result.join('');
}

function uniqueIDString(size = 16) {
  let result = [];
  let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

  for (let n = 0; n < size; n++)
    result.push(alphabet[Math.floor(Math.random() * 16)])
    
  return result.join('');
}

function stringToBool(string) {
  if(string === "true") return true
  if(string === "false") return false
  else throw `not "false" or "true"`;
}

function boolToString(bool) {
  return bool ? "true" : "false"
}

function mode(arr) {
  return arr.sort((a,b) =>
        arr.filter(v => v === a).length
      - arr.filter(v => v === b).length
  ).pop();
}

// usage: [].reduce(reducer()) or something
const reducer = (accumulator, curr) => accumulator + curr;

function worldToClientPosition(gameWindow, position) {
  return position.clone().sub(gameWindow.camera.transform.position).add(new Vector(cw/2, ch/2))
}

function getLocalMousePositionForElement(mouseEvent, element) {
  let rect = element.getBoundingClientRect()
  return new Vector(mouseEvent.clientX - rect.left, mouseEvent.clientY - rect.top)
}

function rgbToHex(rgbString) {
  let values = rgbString.split("(")[1].split(")")[0]
  values = values.split(",")
  let b = values.map((x) => {               //For each array element
    x = parseInt(x).toString(16)            //Convert to a base16 string
    return (x.length == 1) ? "0"+ x : x     //Add zero if we get only one character
  })
  return "#" + b[0] + b[1] + b[2]
}

async function asyncForEachInner(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
const asyncForEach = async (array, func) => {
  await asyncForEachInner(array, (child) => func(child));
}

function waitFor(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, time);
  });
}

function getDataType(data) {
  if(Array.isArray(data))
    return "array"
  else
  if(typeof data == "object" && data)
    return "object"
  else
  if(typeof data == "object" && data == null)
    return "null"
  else
  if(typeof data == "number" && !data && data !== 0)
    return "NaN"
  else
    return typeof data
}

function createRichText(inputText) {
  /* 
  this function creates HTML elements based on a tilde (~) based commands so the text can be loaded from JSON 
  */

  if(!inputText) return ""

  let regex = /~/gi
  let text = inputText
  let result = ""
  let indices = []
  while ((result = regex.exec(text))) {
    indices.push(result.index);
  }
  if(indices.length % 2 !== 0) throw "invalid '~' count, check the source text for errors"
  
  let pairs = indices.map((i, index) => {
    if(index % 2) return [indices[index - 1], indices[index]] 
  })
  pairs = pairs.filter(p => p)

  let commands = pairs.map(pair => inputText.substring(pair[0] + 1, pair[1]))

  /* split the text so commands can be converted into elements */
  let remainingText = inputText

  /* replace every other "~" with nothing */
  let firstIndices = pairs.map(p => p[0]).reverse()

  /* remove the last one to properly split the string for my purposes */
  firstIndices.forEach(index => {
    remainingText = remainingText.substring(0, index) + remainingText.substring(index + 1)
  })

  /* replace the commands with nothing */
  commands.forEach(command => {
    remainingText = remainingText.replace(command, "~")
  })

  let splitText = remainingText.split("~")

  let insertionOffset = 1
  commands.forEach((command, index) => {
    let [name, value] = command.split("=")
    switch(name) {
      case "bind": {
        let text = binds[value]
        text = text.replace("Key", "")
        splitText[index + insertionOffset] = 
        `<span class="keyboard-key" data-bind="${value}">${text.capitalize()}<span class="keyboard-key-bg-left"></span><span class="keyboard-key-bg-right"></span></span>`
        break
      }
      case "highlight": {
        splitText[index + insertionOffset] = `<span class="highlighted-text">${value}</span>`
        break
      }
      case "white": {
        splitText[index + insertionOffset] = `<span class="white-text">${value}</span>`
        break
      }
      case "larger": {
        splitText[index + insertionOffset] = `<span class="larger-text">${value}</span>`
        break
      }
    }
    insertionOffset++
  })

  return splitText.join("").replaceAll("\n", "<br>")
}
class State {
  constructor(...values) {
    this.values = values
    this.current =  values[0]
    this.previous = values[0]
  }
  add(value) {
    if(this.values.find(v => v === value)) throw "value already inside State: " + value
    this.values.push(value)
  }
  set(value) {
    this.validate(value)
    this.previous = this.current
    this.current = value
  }
  revert() {
    let prev = this.current
    this.current = this.previous
  }
  ifrevert(val) {
    this.validate(val)
    if(this.is(val)) 
      this.revert()
  }
  ifthen(val, val2) {
    this.validate(val, val2)
    if(this.is(val)) {
      this.set(val2)
      return true
    }
    else
      return false
  }
  is(...values) {
    this.validate(...values)
    let match = false
    values.forEach(val => {
      if(this.current === val) match = true
    })
    return match
  }
  isnt(...values) {
    this.validate(...values)
    let match = true
    values.forEach(val => {
      if(this.current === val) 
        match = false
    })
    return match
  }
  toggle() {
    if(this.values.length > 2) throw "cannot toggle more than 2 values"
    
    let other = this.values.find(v => v !== this.current)
    this.set(other)
  }
  validate(...values) {
    values.forEach(val => {
      if(this.values.find(v => v === val) === undefined) {
        throw ("invalid value: " + val + ", only accepting: [" + this.values.join(", ") + "]")
      }
    })
  }
  get() {
    return this.current
  }
}
class Switch {
  constructor(mode1, mode2) {
    this.value = mode1
    this.modes = [mode1, mode2]
  }
  switch() {
    this.value === this.modes[0] ? this.value = this.modes[1] : this.value = this.modes[0]
  }
  set(val) {
    if(val === this.modes[0] || val === this.modes[1]) 
      this.value = val
    else 
      console.log('invalid value')
  }
  is(val) {
    if(this.value === val) return true
    else return false
  }
}
class Timer {
  constructor(...timers) {
    this.all = []
    this.add(...timers)
  }
  setToAudioDelta() {
    this.delta = "adt"
  }
  update() {
    for(let timer of this.all) {
      if(!timer.active) return
      
      timer.currentTime += 1000 * (this.delta == "adt" ? adt : dt)
      if(timer.currentTime >= timer.duration) {
        timer.currentTime = 0
        timer.onfinish()
        if(!timer.loop) {
          timer.finished = true
          timer.active = false
        }
      }
    }
  }
  remove(...timers) {
    timers.forEach(timer => {
      let tim = this.all.find(t => t === this[timer])
      this.all.remove(tim)
    })
  }
  add(...timers) {
    timers.forEach(timerData => {
      let options = timerData[2] || {
        loop: false, 
        active: false, 
        onfinish: function () {}
      }

      this[timerData[0]] = {
        active: options.active,
        loop: options.loop,
        currentTime: 0,
      }
      this[timerData[0]].onfinish = options.onfinish
      this[timerData[0]].duration = timerData[1]
      this[timerData[0]].restart = function() {
        this.currentTime = 0
        this.active = true
        this.finished = false
      }
      this[timerData[0]].start = function() {
        this.currentTime = 0
        this.active = true
        this.finished = false
      }
      this[timerData[0]].pause = function() {
        this.active = false
      }
      this[timerData[0]].unpause = function() {
        this.active = true
      }
      this[timerData[0]].toggle = function() {
        this.active = !this.active
      }
      this[timerData[0]].reset = function() {
        this.currentTime = 0
        this.active = false
        this.finished = false
      }
      this[timerData[0]].stop = function() {
        this.currentTime = 0
        this.active = false
        this.finished = false
      }
      this.all.push(this[timerData[0]])
    })
  }
}
class Tooltip {
  constructor(delayDefault) {
    this.timeout = null
    this.delayDefault = delayDefault
    this.createHTML()
  }
  createHTML() {
    this.element =            El("div" , "hidden", [["id", "mouse-tooltip"]])
    this.heading =            El("span", "tooltip-inner-heading")
    this.description =        El("span", "tooltip-inner-text")
    this.cannotSellWarning =  El("div",  "tooltip-item-cannot-sell-warning")
    this.cannotSellText =     El("div",  "tooltip-item-cannot-sell-text")
    this.cannotSellIcon =     El("div",  "cannot-sell-icon ui-graphic")
    this.itemCategory =       El("span", "tooltip-item-item-category")
    this.buyCost =            El("div",  "tooltip-buy-cost")
    this.sellCost =           El("div",  "tooltip-sell-cost")
    
    this.frame =              El("div", "tooltip-frame")
    let frameParts = ["first", "second", "third", "fourth"]
    for(let part of frameParts) {
      this.frame.append(El("div", `tooltip-frame-part ${part}`))
    }

    this.cannotSellWarning.append(this.cannotSellIcon, this.cannotSellText)
    this.element.append(this.frame, this.itemCategory, this.heading, this.description, this.cannotSellWarning, this.buyCost, this.sellCost)
    document.body.append(this.element)
  }
  update() {
    let minInset = 20
    let tooltip = this.element
    let offset = {x: mouse.clientPosition.x + 20, y: mouse.clientPosition.y + 30}
    offset.x =    clamp(offset.x, 0, window.innerWidth - tooltip.offsetWidth - minInset)
    offset.y =    clamp(offset.y, 0, window.innerHeight - tooltip.offsetHeight - minInset)
    tooltip.style.left =  offset.x + "px"
    tooltip.style.top =   offset.y + "px"
  }
  setDataFrom(target) {
    let type = target.dataset.tooltiptype

    /* set data based on the tooltip type attribute */
    switch(type) {
      case "item": {
        let item = data.item[target.dataset.itemname]
        if(!item) throw "bad item reference: " + target.dataset.itemname

        this.heading.innerHTML =            item.title
        this.description.innerHTML =        item.description
        this.itemCategory.innerHTML =       item.category || (item.flags.questItem ? "[Quest item]" : "")
        this.cannotSellText.innerHTML =     item.flags.canSell ? "" : "Item cannot be sold"
        this.buyCost.innerHTML =            item.buyCost    ? `COST: ${item.buyCost}` : ""

        this.itemCategory.innerHTML    ? this.itemCategory.style.display = ""       : this.itemCategory.style.display = "none"
        this.cannotSellText.innerHTML  ? this.cannotSellWarning.style.display = ""  : this.cannotSellWarning.style.display = "none"
        this.buyCost.innerHTML         ? this.buyCost.style.display = ""            : this.buyCost.style.display = "none"

        this.heading.style.display =     ""    
        this.description.style.display = ""
        this.sellCost.style.display = "none"
        break
      }
      case "weapon": {
        let item = data.item[target.dataset.itemname]
        if(!item) throw "bad item reference: " + target.dataset.itemname

        this.heading.innerHTML =            item.title
        this.description.innerHTML =        item.description
        this.itemCategory.innerHTML =       "[WEAPON]"
        this.buyCost.innerHTML =            item.buyCost ? `COST: ${item.buyCost}` : "COST: 0"

        this.heading.style.display =      ""
        this.description.style.display =  ""
        this.buyCost.style.display =      ""
        this.itemCategory.style.display = ""

        this.sellCost.style.display =           "none"
        this.cannotSellWarning.style.display =  "none"
        break
      }
      case "shipSystem": {
        let item = data.item[target.dataset.itemname]
        if(!item) throw "bad item reference: " + target.dataset.itemname

        this.heading.innerHTML =            item.title
        this.description.innerHTML =        item.description
        this.itemCategory.innerHTML =       "[SHIP SYSTEM]"
        this.buyCost.innerHTML =            item.buyCost ? `COST: ${item.buyCost}` : "COST: 0"

        this.heading.style.display =      ""
        this.description.style.display =  ""
        this.buyCost.style.display =      ""
        this.itemCategory.style.display = ""

        this.sellCost.style.display =           "none"
        this.cannotSellWarning.style.display =  "none"
        break
      }
      default: {
        this.heading.innerHTML =      target.dataset.tooltip
        this.description.innerHTML =  target.dataset.tooltipdescription
        
        target.dataset.tooltip              ? this.heading.style.display = ""       : this.heading.style.display = "none"
        target.dataset.tooltipdescription   ? this.description.style.display = ""   : this.description.style.display = "none"

        this.cannotSellWarning.style.display =  "none"
        this.buyCost.style.display =            "none"
        this.sellCost.style.display =           "none"
        this.itemCategory.style.display =       "none"
        break
      }
    }
  }
  static types = [
    "regular",
    "item"
  ]
}
class PopupTooltip {
  constructor(triggerElement, attachment, hintData = {}, options = {}) {
    this.triggerElement = triggerElement
    this.attachment = attachment
    this.hintData = hintData
    this.visible = false

    this.options = {}
    this.options.setMaxWidthToTriggerElement =  options.setMaxWidthToTriggerElement   ?? false
    this.options.setMaxHeightToTriggerElement = options.setMaxHeightToTriggerElement  ?? false
    this.options.centerTooltipText =            options.centerTooltipText             ?? false
    this.options.attachmentOffset =             options.attachmentOffset              ?? null
    this.options.allowPointerEvents =           options.allowPointerEvents            ?? false
    this.options.useBackground =                options.useBackground                 ?? false

    this.createHTML()
    this.show()
    Logger.log("tooltip popup create!")
  }
  createHTML() {
    this.element =  El("div", "popup-tooltip ui-graphic ui-button-minimal-filled hidden")
    this.arrow =    El("div", "popup-tooltip-arrow" + this.attachment)
    this.title =    El("div", "popup-tooltip-title", undefined)
    this.text =     El("div", "popup-tooltip-text", undefined)

    this.title.innerHTML = createRichText(this.hintData.title)
    this.text.innerHTML = createRichText(this.hintData.text)

    this.parentElement = Q(`#${this.triggerElement.dataset.parentelementid}`) ?? this.triggerElement
    
    if(this.hintData.title)        
      this.element.append(this.title)
    if(this.hintData.text)          
      this.element.append(this.text)

    if(this.options.setMaxWidthToTriggerElement)
      this.element.style.width = this.parentElement.getBoundingClientRect().width + "px"
    if(this.options.setMaxHeightToTriggerElement)
      this.element.style.height = this.parentElement.getBoundingClientRect().height + "px"
    if(this.options.centerTooltipText)
      this.element.style.textAlign = "center"
    if(this.options.allowPointerEvents)
      this.element.style.pointerEvents = "all"

    if(this.options.useBackground) {
      this.background = El("div", "tooltip-background")
      this.background.animate(
        [{filter: "opacity(0)"}, {filter: "opacity(1)"}],
        {duration: 500}
      )
      document.body.append(this.background)
    }

    document.body.append(this.element)
  }
  show() {
    if(this.visible) return

    this.element.classList.remove("hidden")
    this.visible = true
    this.elementRect =  this.element.getBoundingClientRect()
    this.arrowRect =    this.arrow.getBoundingClientRect()
    this.parentRect =   this.parentElement.getBoundingClientRect()

    let inset = {top: null, bottom: null, left: null, right: null}
    let distance = 8

    if(this.attachment == "right") {
      inset.left = distance + this.parentRect.x + this.parentRect.width
      inset.top =  this.parentRect.y + this.parentRect.height/2 - this.elementRect.height/2
    }
    else
    if(this.attachment == "left") {
      inset.right = distance + (cw - this.parentRect.x)
      inset.top =  this.parentRect.y + this.parentRect.height/2 - this.elementRect.height/2
    }
    else
    if(this.attachment == "top") {
      inset.left = this.parentRect.x + this.parentRect.width/2 - this.elementRect.width/2
      inset.bottom = distance + (window.innerHeight - this.parentRect.y)
    }
    else
    if(this.attachment == "bottom") {
      inset.left = this.parentRect.x + this.parentRect.width/2 - this.elementRect.width/2
      inset.top = distance + this.parentRect.y + this.parentRect.height
    }
    else
    if(this.attachment == "center") {
      inset.left = this.parentRect.width/2 - this.elementRect.width/2
      inset.top = this.parentRect.height/2 - this.elementRect.height/2
    }

    const alignElement = () => {
      for(let prop in inset) {
        if(inset[prop] === null) continue

        let value = inset[prop]
        if(this.options.attachmentOffset)
          value += (this.options.attachmentOffset[prop])
          
        this.element.style[prop] = value + "px"
      }
    }
    alignElement()

    let elementRectBeforeClamp = this.element.getBoundingClientRect()
    if(elementRectBeforeClamp.x < 0 + PopupTooltip.insetBorder)
      inset.left += Math.abs(elementRectBeforeClamp.x - PopupTooltip.insetBorder)
    if(elementRectBeforeClamp.right > window.innerWidth - PopupTooltip.insetBorder)
      inset.right += Math.abs(elementRectBeforeClamp.right - window.innerWidth + PopupTooltip.insetBorder)
    alignElement()
  }
  hide() {
    if(!this.visible) return

    this.visible = false
    this.element.classList.add("hidden")
  }
  placeArrow() {
    if(this.attachment === "right") {
      this.arrow.style.left = "-20px"
    }
    if(this.attachment === "left") {
      this.arrow.style.right = "-20px"
    }
    if(this.attachment === "top") {
      this.arrow.style.bottom = "-20px"
      this.arrow.style.left = this.elementRect.width/2 - this.arrowRect.width/2 + "px"
    }
    if(this.attachment === "bottom") {
      this.arrow.style.top = "-20px"
      this.arrow.style.left = this.elementRect.width/2 - this.arrowRect.width/2 + "px"
    }
  }
  destroy() {
    this.element.remove()
    this.background?.remove()
  }
  static insetBorder = 20
}
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
class GameWindow {
  constructor(title, element) {
    this.title = title
    this.element = element
    this.windowType = "solid"
    this.graphics = new PIXI.Graphics()
    this.uiComponents = []
    this.active = false
    this.visible = false
  }
  show() {
    this.visible = true
    this.element.classList.remove('hidden')
  }
  hide() {
    this.visible = false
    this.element.classList.add('hidden')
  }
  toggle() {
    this.element.classList.toggle('hidden')
  }
  handleInput(event) {
    this["handle" + event.type.capitalize()](event)
    this.handleSecondaryInput(event)
  }
  handleSecondaryInput(event) {

  }
  handleKeydown(event) {

  }
  handleKeyup(event) {

  }
  handleMousedown(event) {

  }
  handleMousemove(event) {

  }
  handleMouseup(event) {

  }
  handleClick(event) {

  }
  handleWheel(event) {

  }
  handlePointerdown(event) {

  }
  handlePointermove(event) {

  }
  handlePointerup(event) {

  }
  update() {

  }
}
class GameWorldWindow extends GameWindow {
  constructor(title, element) {
    super(title, element)
    this.createApp()
    this.createLayers()
    this.createGameObjectArrays()
    this.createCamera()
    this.createCameraAnchor()
        
    this.locationName = "Location"

    this.gridSprite = new PIXI.TilingSprite(grid.texture, cw + grid.cellSize*2, ch + grid.cellSize*2)
    this.fog = []
    this.previousCollisions = []
    this.markers = []
    this.mode = new State("play", "edit")
    
    this.layers.graphics.addChild(this.graphics)
    this.element.append(this.app.view)
    this.canvas = this.app.view
    this.stats = new GameStats()
  }
  //#region setup 
  createApp() {
    this.app = new PIXI.Application(
      { 
        width: cw, 
        height: ch, 
        backgroundColor: 0x151516
      }
    )
    this.app.resizeTo = Q("main")
    this.stage = this.app.stage
  }
  createCamera() {
    this.camera = GameObject.create(
      "camera", 
      "mainCamera", 
      {
        transform: new Transform(),
        context: this.stage
      }, 
      {world: this}
    )
  }
  createCameraAnchor() {
    this.cameraAnchor = {
      transform: new Transform()
    }
    this.camera.lockTo(this.cameraAnchor)
  }
  createLayers() {
    this.layers = {
      stars:        new PIXI.Container(),
      planet:       new PIXI.Container(),
      background4:  new PIXI.Container(),
      background3:  new PIXI.Container(),
      background2:  new PIXI.Container(),
      background:   new PIXI.Container(),
      vignette:     new PIXI.Container(),
      ghost:        new PIXI.Container(),
      asteroid:     new PIXI.Container(),
      debris:       new PIXI.Container(),
      projectile:   new PIXI.Container(),
      ship:         new PIXI.Container(),
      vignette2:    new PIXI.Container(),
      fog:          new PIXI.Container(),
      foreground:   new PIXI.Container(),
      foreground2:  new PIXI.Container(),
      foreground3:  new PIXI.Container(),
      overlays:     new PIXI.Container(),
      graphics:     new PIXI.Container(),
    }
    for(let layerName in this.layers)
      this.stage.addChild(this.layers[layerName])
  }
  createGameObjectArrays() {
    this.gameObjects = {
      gameObject: [],
      cluster: [],
      debris: [],
      camera: [],
      projectile: [],
      asteroid: [],
      ship: [],
      station: [],
      satellite: [],
      fragment: [],
      person: [],
      npc: [],
      player: [],
      interactable: [],
      hint: [],
      laser: [],
      ultraportBeacon: [],
      hintGraphic: [],
      gameOverlay: [],
      explosion: [],
      particle: [],
      locationRandomizer: [],
      randomSpawner: [],
      decorativeObject: [],
      decoration: [],
      lightSource: [],
      audioEmitter: [],
      mapIcon: [],
      mapImage: [],
      mapLabel: [],
    }
  }
  //#endregion
  //#region cosmetic methods
  createVignette() {
    let 
    vignetteBack = PIXI.Sprite.from("assets/vignette.png")
    vignetteBack.anchor.set(0.5)
    vignetteBack.alpha = 0.5
    this.layers.vignette.addChild(vignetteBack)

    let 
    vignetteFront = PIXI.Sprite.from("assets/vignette.png")
    vignetteFront.anchor.set(0.5)
    vignetteFront.alpha = 0.9
    this.layers.vignette2.addChild(vignetteFront)
  }
  createOrigin() {
    this.origin = PIXI.Sprite.from("assets/origin.png")
    this.origin.anchor.set(0.5)
    this.stage.addChild(this.origin)
  }
  updateGridSprite() {
    this.gridSprite.position.x = Math.floor(this.camera.transform.position.x / grid.cellSize) * grid.cellSize - (grid.cellSize*2)
    this.gridSprite.position.y = Math.floor(this.camera.transform.position.y / grid.cellSize) * grid.cellSize - grid.cellSize
  }
  //#endregion
  //#region GameObject logic
  addGameObject(obj, layer) {
    obj.prototypeChain.forEach(prototype => {
      if(!this.gameObjects[prototype]) console.error(prototype)

      this.gameObjects[prototype].push(obj)
    })
    obj.gameWorld = this
    if(obj.sprite) 
      this.placeObjectInLayer(obj, layer)
  }
  placeObjectInLayer(obj, layerOverride) {
    let layer = null
    let types = data.objectToLayerMap.get(obj.type)

    if(layerOverride)
      layer = layerOverride
    else if(types)
      layer = Random.from(...data.objectToLayerMap.get(obj.type))
    else
      console.error("Object with sprite component doesn't have a layer assigned in data.objectToLayerMap", obj)
    
    obj.layer = layer
    GameObject.addToStage(obj, this.layers[layer])
  }
  removeGameObject(obj) {
    if(obj.destroyed) return

    obj.prototypeChain.forEach(prototype => {
      this.gameObjects[prototype].remove(obj)
    })
    delete obj.gameWorld
  }
  updateGameObjects(forceUpdate = false) {
    /* this shit is a performance bottleneck, for some reason checking instanceof is expensive */
    let alwaysUpdateTypes = [Interactable, Hint]

    let windowMode = this.mode.get()
    for(let obj of this.gameObjects.gameObject) {
      if(
        this === game &&
        player.ship && 
        GameObject.distanceFast(obj, player.ship) > data.updateObjectsWithinThisFastDistanceOfPlayer && 
        !forceUpdate &&
        alwaysUpdateTypes.filter(type => obj instanceof type).length === 0
      ) {
        obj.cull()
        continue
      }
      
      if(forceUpdate)
        obj.sprite?.update()

      GameObject.updateOnAll(obj)
      if(windowMode === "play")
        GameObject.updateOnPlay(obj)
    }
    
    /* update decorations */
    this.gameObjects.decoration.forEach(deco => deco.update())

    /* draw hitboxes */
    if(visible.hitbox) {
      for(let obj of this.gameObjects.gameObject) {
        Hitbox.draw           (obj, this.graphics, this.camera.currentZoom)
        Hitbox.drawProjections(obj, this.graphics, this.camera.currentZoom)
      }
      for(let obj of this.gameObjects.decoration) {
        Hitbox.draw           (obj, this.graphics, this.camera.currentZoom)
        Hitbox.drawProjections(obj, this.graphics, this.camera.currentZoom)
      }
    }
      
  }
  //#endregion
  //#region location loading
  clearLocation() {
    let objects = [...this.gameObjects.gameObject].concat(this.gameObjects.decoration)
    objects.forEach(obj => GameObject.destroy(obj))
    this.interactionsTemplate = null
    this.fogHandlers = []
    this.destroyFog()
  }
  loadLocation(locationName, onFinishCallback = () => {}) {
    this.state.set("loadingLocation")
    gameManager.setWindow(loadingScreen)
    this.clearLocation()
    this.loadObjects(
      locationName, 
      this.loadInteractions.bind(this, locationName),
      this.loadAudio.bind(this, locationName),
      () => setTimeout(() => {this.state.set("default"); gameManager.closeWindow()}, 1000),
      onFinishCallback
    )
  }
  loadObjects(locationName, ...callbackFunctions) {
    readJSONFile("data/locations/" + locationName + "/objects.json", (text) => {
      let rawData = JSON.parse(text)
      let location = SaveConverter.convert("save", "data", rawData)
      this.locationName = location.name
      this.locationRefName = locationName
      location.objects.forEach(obj => {
        let params = {
          transform: Transform.fromPlain(obj.transform),
          id: obj.id,
          pilot: obj.pilot,
        }
        if(obj.type === "camera") {
          params["context"] =  this.stage
          params["lockedTo"] = this === game && player.ship ? player.ship : this.cameraAnchor
        }

        let gameObject = GameObject.create(
          obj.type, 
          obj.name, 
          params,
          {
            world: this,
            layer: obj.layer
          }
        )
        if(obj.type === "camera") {
          this.camera = gameObject
        }
      })

      this.generateBackground()
      this.generateFog(location.fog)
      callbackFunctions.forEach(f => f())
      this.updateGameObjects(true)
    })
  }
  loadInteractions(locationName) {
    if(this !== game) return

    readJSONFile("data/locations/" + locationName + "/interactions.json", (text) => {
      let parsedData = JSON.parse(text)
      let interactions = parsedData.interactions
      let markers = parsedData.markers
      let lightSources = parsedData.lightSources
      let cameraBounds = parsedData.cameraBounds
      let backgroundFilter = parsedData.backgroundFilter

      this.checkInteractionsForDuplicateIds(interactions)
      this.setBoundsOnCamera(cameraBounds)

      interactions.forEach( i => this.createInteraction(i.triggerObjectId, i.interactionData, i.options, i.interactionId))
      markers.forEach     ( m => this.createMarker(m.markerId, m.targetObjectId, m.markerData, m.options))
      lightSources.forEach( l => this.createLightSource(l))

      this.interactionsTemplate = {markers, interactions, lightSources}

      if(backgroundFilter) {
        let layers = ["background4", "background3", "background2", "background", "fog"]
        let filter = new PIXI.filters.ColorMatrixFilter()
        let tint = parseInt(backgroundFilter.tint, 16)
        filter.brightness(backgroundFilter.brightness ?? 1.0)
        filter.tint(tint, false)
        console.log(tint)
        for(let layer of layers) {
          this.layers[layer].filters = [filter]
        }
      }
    })
  }
  loadAudio(locationName) {
    if(this !== game) return
    
    readJSONFile("data/locations/" + locationName + "/audio.json", (text) => {
      let parsedData = JSON.parse(text)
      
      parsedData.audioEmitters.forEach(emitter => {
        Logger.log("emitter")
        GameObject.create(
          "audioEmitter", 
          emitter.audioName, 
          {category: emitter.category, parent: GameObject.byId(this, emitter.parentObjectId), options: emitter.options}, 
          {world: this}
        )
      })
    })
  }
  checkInteractionsForDuplicateIds(interactions) {
    interactions.forEach(interaction => {
      interactions.forEach(other => {
        if(interaction.interactionId === undefined || interaction.interactionId === undefined) return
        if(other.interactionId === interaction.interactionId && other !== interaction)
          throw "duplicate Id's in interactions: " + other.interactionId
      })
    })
  }
  createMarker(id, targetObjectId, markerData, options) {
    if(options.disabled) return
    if(options.conditional) return

    let triggerObject = this.gameObjects.gameObject.find(obj => obj.id === targetObjectId)
    new WorldMarker(id, this, triggerObject, markerData)
  }
  createMarkerById(markerId) {
    let markerRef = this.interactionsTemplate.markers.find(marker => marker.markerId === markerId)
    markerRef.options.conditional = false
    this.createMarker(markerRef.markerId, markerRef.targetObjectId, markerRef.markerData, markerRef.options)
  }
  destroyMarkerById(id) {
    let marker = this.markers.find(m => m.id === id)
    marker.destroy()
  }
  createInteractionById(interactionId) {
    let interactionRef = this.interactionsTemplate.interactions.find(int => int.interactionId === interactionId)
    if(!GameObject.byId(this, interactionRef.triggerObjectId)) return

    interactionRef.options.conditional = false
    this.createInteraction(interactionRef.triggerObjectId, interactionRef.interactionData, interactionRef.options, interactionId)
  }
  createInteraction(triggerObjectId, interactionData, options, interactionId) {
    if(options.disabled)
      return
    if(options.conditional)
      return
    if(options.isAlreadyCreated)
      return

    let triggerObject = this.gameObjects.gameObject.find(obj => obj.id === triggerObjectId)
    let hitbox
    
    if(options.useHostHitbox)
      hitbox = triggerObject.objectData.hitbox
    else
      hitbox = interactionData.hitbox
    
    GameObject.create(
      "interactable", 
      interactionData.interactableDisplayName, 
      {
        transform: new Transform(),
        hitbox: hitbox,
        parent: triggerObject,
        doOnEnter: interactionData.doOnEnter,
        doOnLeave: interactionData.doOnLeave,
        doOnDestroy: interactionData.doOnDestroy,
        interactionData: interactionData,
        interactionId, interactionId
      },
      {
        world: this
      }
    )
    options.isAlreadyCreated = true
  }
  createLightSource(lightData) {
    let parent = GameObject.byId(this, lightData.parentObjectId)
    GameObject.create("lightSource", "unnamed", {lightData: lightData, parent: parent}, {world: this})
  }
  generateFog(fogData) {
    if(!fogData) throw "no fog data"

    fogData.forEach(f => {
      let fog = PIXI.Sprite.from("assets/fogDab.png")
      fog.position.set(f.position.x, f.position.y)
      fog.anchor.set(0.5)
      fog.alpha = f.alpha
      this.fog.push(fog)
      this.layers.fog.addChild(fog)
    })
  }
  updateFog() {
    if(this.mode.isnt("play")) return

    let date = Date.now()
    for(let i = 0; i < this.fog.length; i++) {
      i % 2 == 1 ?
      this.fog[i].rotation = Math.floor(date >> 9) :
      this.fog[i].rotation = Math.floor((date + 1000) >> 9)
    }
  }
  destroyFog() {
    this.fog.forEach(sprite => this.layers.fog.removeChild(sprite))
    this.fog = []
  }
  generateBackground() {
    let objects = []
    let layers = ["background", "background2", "background4"]
    let countPerLayer = [300, 300, 100]
    let variantsPerLayer = [
      {
        "bgMedium0": 6, 
        "bgMedium1": 6, 
        "bgMedium2": 6, 
        "bgMedium3": 6, 
        "bgMedium4": 6, 
        "bgMedium5": 6, 
        "bgLarge0": 1,
        "bgLarge1": 1,
        "bgLarge2": 1,
        "bgLarge3": 1,
        "bgLarge4": 1,
      },
      {
        "bgMedium0": 15, 
        "bgMedium1": 15, 
        "bgMedium2": 15, 
        "bgMedium3": 15, 
        "bgMedium4": 15, 
        "bgMedium5": 15, 
        "bgLarge0": 1,
        "bgLarge1": 1,
        "bgLarge2": 1,
        "bgLarge3": 1,
        "bgLarge4": 1,
      },
      {
        "bgMedium0": 15, 
        "bgMedium1": 15, 
        "bgMedium2": 15, 
        "bgMedium3": 15, 
        "bgMedium4": 15, 
        "bgMedium5": 15,
      },
    ]
    let minDistance = 120
    let attempts = 0

    function newPosition() {
      return new Vector(Random.int(-cw*3, cw*3), Random.int(-ch*3, ch*3))
    }
    generate_bg:
    for(let l = 0; l < layers.length; l++) {
      let count = countPerLayer[l]
      for (let i = 0; i < count; i++) {
        let position;
        let velocity = new Vector(Random.float(-5,5), Random.float(-5,5))
        let rotation = Random.rotation()
        let angularVelocity = Random.float(-PI/8, PI/8) * Random.chance(50)
        let overlapping;
        
        do {
          attempts++
          overlapping = false
          position = newPosition()
          objects.forEach(obj => {
            if(obj.transform.position.distance(position) < minDistance) 
              overlapping = true
          })
          if(attempts > 100_000) {
            console.log(`too many attempts to generate BG (attempts > ${attempts})`)
            break generate_bg
          }
        }
        while(overlapping)

        let gameObject = GameObject.create(
          "decoration", 
          Random.weighted(variantsPerLayer[l]),
          {
            transform: new Transform(
              position,
              velocity,
              rotation,
              angularVelocity,
            ),
            bgType: "asteroid",
          },
          {
            world: this,
            layer: layers[l]
          }
        )
        objects.push(gameObject)
      }
    }
    let 
    planet = PIXI.Sprite.from(`assets/planet/${this.locationRefName}.png`)
    planet.anchor.set(0.5)
    planet.alpha = 1
    this.layers.planet.addChild(planet)

    let 
    stars = PIXI.Sprite.from(`assets/planet/${this.locationRefName}StarTexture.png`)
    stars.anchor.set(0.5)
    stars.alpha = 0.5
    stars.scale.set(0.5)
    this.layers.stars.addChild(stars)
  }
  updateLayers() {
    for(let layername in this.layers) {
      if(GameWorldWindow.layerCounterOffset[layername] !== undefined)
        this.layers[layername].position.set(
          this.camera.transform.position.x * GameWorldWindow.layerCounterOffset[layername], 
          this.camera.transform.position.y * GameWorldWindow.layerCounterOffset[layername]
        )
    }
    this.layers.planet.position.set(this.camera.transform.position.x * 0.98, this.camera.transform.position.y * 0.98 + ch/5)
    for(let layer of GameWorldWindow.scaleLayersWithCamera) {
      this.layers[layer].scale.set(this.camera.currentZoom)
    }
  }
  static layerCounterOffset = {
    background:   0.50,
    background2:  0.80,
    background3:  0.90,
    background4:  0.95,
    vignette:     1.00,
    vignette2:    1.00,
    stars:        1.00,
    fog:          0.00,
    foreground:   1.10,
    foreground2:  1.20,
    foreground3:  1.30,
  }
  static scaleLayersWithCamera = [
    "vignette",
    "vignette2",
    "planet",
    "stars",
  ]
  //#endregion
}

class GameObject {
  constructor(transform = new Transform(), id) {
    this.transform = transform
    this.transform.gameObject = this
    this.id = id ?? Random.uniqueIDHEX()
    this.type = "gameObject"

    this.components = []
    this.overrides = []
    this.npcs = []
    this.statusEffects = []
    this.performanceData = {}
    
    this.gameWorld = null
    this.timers = null

    /* flags */
    this.loaded = false //unused currently
    this.vwb = false
    this.canCollide = true
    this.immovable = false
    this.visible = true
    this.steering = false
    this.braking = false
    this.colliding = false
    this.stuck = false
    this.wrecked = false
    this.destroyed = false
    this.dying = false

    this.broadphaseGrowFactor = 1
  }
  //#region instance methods
  clone() {
    return _.cloneDeep(this)
  }
  onHitboxLoad() {
    //use this to attach some custom methods for handling the loading of the hitbox, by default it's empty
  }
  onWreckHitboxVaultLoad() {
    //use this to attach some custom methods for handling the loading of the hitboxVault, by default it's empty
  }
  calculateBroadphaseGrowFactor() {
    if(!this.hitbox?.boundingBox) 
      console.error("growFactor calculation fail:", this)
    this.broadphaseGrowFactor = Math.ceil(this.hitbox.boundingBox.w / grid.cellSize) ?? 1
  }
  cull() {
    if(!this.sprite) return
    if(this instanceof DecorativeObject) return
    
    let offsetFromCamera = this.transform.position.clone().sub(this.gameWorld.camera.transform.position)
    if(offsetFromCamera.fastLength() > (cw + (grid.cellSize * this.broadphaseGrowFactor)) * this.gameWorld.camera.currentZoom)
      this.hide()
    else
      this.show()
  }
  hide() {
    if(!this.sprite) return
    this.sprite.container.visible = false
    this.sprite.container.renderable = false
    this.visible = false
  }
  show() {
    if(!this.sprite) return
    this.sprite.container.visible = true
    this.sprite.container.renderable = true
    this.visible = true
  }
  enterVoid() {
    this.vwb = true
    this.canCollide = false
  }
  exitVoid() {
    this.vwb = false
    this.canCollide = true
  }
  setAsImmovable() {
    this.immovable = true
  }
  unsetAsImmovable() {
    this.immovable = false
  }
  resetVelocityIfImmovable() {
    if(!this.immovable) return
    this.transform.velocity.set(0)
  }
  clampVelocity() {
    this.transform.velocity.clamp(data.maxObjectVelocity)
  }
  applyInertia() {
    throw "inertia id deprecated"
    if(this.brakes && this.brakes.auto == false) return
    if(this instanceof Projectile) return
    if(this instanceof DecorativeObject) return

    this.transform.velocity.mult(data.inertia)
  }
  updateRotation() {
    if(this.gameWorld !== game) return
    
    this.transform.rotation += this.transform.angularVelocity * dt
    if(this.engine && !this.steering)
      this.transform.angularVelocity *= (1 - this.engine.glideReduction)
    if(Math.abs(this.transform.angularVelocity) < 0.01) 
      this.transform.angularVelocity = 0
  }
  wrapRotation() {
    if(this.transform.rotation > TAU) 
      this.transform.rotation -= TAU
    if(this.transform.rotation < 0) 
      this.transform.rotation += TAU
  }
  updateTimers() {
    this.timers?.update()
  }
  updateStatusEffects() {
    for(let effect of this.statusEffects)
      effect.update()
  }
  setPerformanceData() {
    this.performanceData.previousRotation = this.transform.rotation
    this.performanceData.previousPosition = this.transform.position.clone()
  }
  update() {
    console.error("supply a new update method", this)
  }
  handleImpact(collisionEvent) {
    //custom method for handling impacts of descendant objects
  }
  destroy() {
    //custom method for handling the destruction of descendant objects
  }
  //#endregion
  //#region component methods
  registerComponents(objData = []) {
    if(objData.systems)
      for(let systemName of objData.systems)
        this.components.push(systemName)
    for(let component of this.components)
      this.addComponent(component, objData)
  }
  updateComponents() {
    for(let comp of this.components) {
      if(!this[comp]) return

      this[comp].update()
      this[comp].timers?.update()
    }
  }
  addSpriteComponentToFragment(fragmentIndex) {
    Sprite.createForFragment(this, fragmentIndex)
    this.components.push("sprite")
  }
  addSpriteComponentToMapLabel(text, color) {
    Sprite.createForMapLabel(this, text, color)
    this.components.push("sprite")
  }
  addComponent(name, objData) {
    switch(name) {
      case "hitbox": {
        if(objData.hitbox.filename === undefined || objData.hitbox.type === undefined || objData.hitbox.definition === undefined)
          throw "invalid hitbox data structure" + this.type + ", " + this.name
        
        this.objectData = { hitbox: objData.hitbox }

        if(objData.hitbox.filename) {
          readJSONFile(`data/hitboxes/${objData.hitbox.filename}.json`, (text) => {
            let hitboxData = JSON.parse(text)
            if(hitboxData.type !== "polygonHitbox") throw "only polygon hitboxes can be loaded from JSON" + this.type + ", " + this.name

            let bodies = hitboxData.bodies.map(body => new Polygon(body.vertices))
            this.hitbox = new PolygonHitbox(this, bodies, hitboxData.color)
            this.onHitboxLoad()
            this.transform.update()
            Hitbox.recalculatePolygonHitbox(this, this.hitbox)
            this.calculateBroadphaseGrowFactor()
          })
        }
        else {
          let def = objData.hitbox.definition

          if(objData.hitbox.type === "polygonHitbox") 
            this.hitbox = new PolygonHitbox(this, def.definition, def.color)
          if(objData.hitbox.type === "circle") 
            this.hitbox = new CircleHitbox(this, def.radius, def.color)
          if(objData.hitbox.type === "box") 
            this.hitbox = new BoxHitbox(this, def.a, def.b, def.color)
            
          this.calculateBroadphaseGrowFactor()
          
          if(objData.hitbox.type === "polygonHitbox" && this.type === "interactable") 
            console.log(this.hitbox)
        }
        break
      }
      case "rigidbody": {
        this.rigidbody = new RigidBody(this, objData.rigidbody)
        break
      }
      case "wreckHitboxVault" : {
        if(objData.wreck.hitboxVaultName) {
          readJSONFile(`data/hitboxes/wreckHitboxVault/${objData.wreck.hitboxVaultName}.json`, (text) => {
            let hitboxVaultData = JSON.parse(text)
            this.wreckHitboxVault = new HitboxVault(this)
            for(let hitbox of hitboxVaultData) {
              let bodies = hitbox.bodies.map(body => new Polygon(body.vertices))
              this.wreckHitboxVault.addHitbox(new PolygonHitbox(this, bodies, hitbox.color))
            }
            this.onWreckHitboxVaultLoad()
          })
        }
        else {
          this.wreckHitboxVault = new HitboxVault(this)
          for(let i = 0; i < objData.wreck.count; i++)
            this.wreckHitboxVault.addHitbox(PolygonHitbox.default(this))
        }
        break
      }
      case "sprite" : {
        Sprite.createDefault(this)
        break
      }
      case "reactor" : {
        this.reactor = new Reactor(this, objData.reactor)
        break
      }
      case "hull" : {
        this.hull = new HullSystem(this, objData.hull)
        break
      }
      case "shields" : {
        this.shields = new ShieldSystem(this, objData.shields)
        break
      }
      case "stealth" : {
        this.stealth = new StealthSystem(this, objData.stealth)
        break
      }
      case "weapons" : {
        this.weapons = new WeaponSystem(this, objData.weapons)
        break
      }
      case "engine" : {
        this.engine = new EngineSystem(this, objData.engine)
        break
      }
      case "boosters" : {
        this.boosters = new BoosterSystem(this, objData.boosters)
        break
      }
      case "brakes" : {
        this.brakes = new BrakeSystem(this, objData.brakes)
        break
      }
      case "cargo" : {
        this.cargo = new CargoSystem(this, objData.cargo)
        break
      }
      case "skip" : {
        this.skip = new SkipSystem(this, objData.skip)
        break
      }
      case "wreck" : {
        this.wreck = new Wreck(this, objData.wreck)
        break
      }
      case "coater" : {
        this.coater = new Coater(this, objData.coater)
        break
      }
    }
  }
  //#endregion
  //#region static methods
  static updateOnPlay(gameObject) {
    gameObject.updateStatusEffects()
    gameObject.update()
    gameObject.updateRotation()
    gameObject.wrapRotation()
    gameObject.updateTimers()
    gameObject.resetVelocityIfImmovable()
    gameObject.clampVelocity()
  }
  static updateOnAll(gameObject) {
    gameObject.updateComponents()
    gameObject.transform.update()
    gameObject.setPerformanceData()
    gameObject.cull()
  }
  static create(type, name, params = {}, options = {world: game, layer: null}) {
    let obj
    if(type === "camera")                   obj = new Camera(params.transform, params.context, params.contextDim, params.lockedTo, params.baseZoom, params.zoomRange)
    if(type === "asteroid")                 obj = new Asteroid(params.transform, name)
    if(type === "ship")                     obj = new Ship(params.transform, name, params.pilot)
    if(type === "station")                  obj = new Station(params.transform, name)
    if(type === "satellite")                obj = new Satellite(params.transform, name)
    if(type === "debris")                   obj = new Debris(params.transform, name)
    if(type === "interactable")             obj = new Interactable(params.transform, name, params.hitbox, params.doOnEnter, params.doOnLeave, params.doOnDestroy, params.parent, params.interactionData, params.interactionId)
    if(type === "hint")                     obj = new Hint(params.transform, params.hintData, params.fadeoutTime, params.parent)
    if(type === "projectile")               obj = new Projectile(params.transform, name, params.owner, params.target)
    if(type === "cluster")                  obj = new Cluster(params.transform)
    if(type === "fragment")                 obj = new Fragment(params.transform, name, params.parent, params.fragmentData)
    if(type === "ultraportBeacon")          obj = new UltraportBeacon(params.transform, name)
    if(type === "hintGraphic")              obj = new HintGraphic(params.transform, name, params.parent)
    if(type === "gameOverlay")              obj = new GameOverlay(params.transform, name, params.parent)
    if(type === "explosion")                obj = new Explosion(params.transform, name, params.SFXName)
    if(type === "particle")                 obj = new Particle(params.transform, name)
    if(type === "mapIcon")                  obj = new MapIcon(params.transform, name, params.locationReference)
    if(type === "mapImage")                 obj = new MapImage(params.transform, params.scale, name)
    if(type === "mapLabel")                 obj = new MapLabel(params.transform, params.text, params.color)
    if(type === "npc")                      obj = new NPC(name, params.jobTitle, params.location)
    if(type === "player")                   obj = new Player()
    if(type === "lightSource")              obj = new LightSource(params.transform, name, params.parent, params.lightData)
    if(type === "audioEmitter")             obj = new AudioEmitter(params.category, name, params.parent, params.options)
    
    /* unfinished objects */
    if(type === "locationRandomizer")       throw "location randomizer not finished"
    if(type === "randomSpawner")            throw "random spawner not finished"

    /* exception for decoration objects */
    if(type === "decoration") obj = new Decoration(params.transform, name)

    if(!options.world)
      console.error("A GameObject needs to be placed inside a GameWorldWindow.", type, name, params, options)
    if(obj === undefined) 
      throw `GameObject is undefined, incorrect type or name: ${type}, ${name}`

    obj.prototypeChain = []
    
    if(params.id)             obj.id = params.id
    if(params.collisionGroup) obj.collisionGroup = params.collisionGroup

    if(obj instanceof GameObject)           obj.prototypeChain.push("gameObject")
    if(obj instanceof Camera)               obj.prototypeChain.push("camera")
    if(obj instanceof Station)              obj.prototypeChain.push("station")
    if(obj instanceof Satellite)            obj.prototypeChain.push("satellite")
    if(obj instanceof Asteroid)             obj.prototypeChain.push("asteroid")
    if(obj instanceof Debris)               obj.prototypeChain.push("debris")
    if(obj instanceof Cluster)              obj.prototypeChain.push("cluster")
    if(obj instanceof Interactable)         obj.prototypeChain.push("interactable")
    if(obj instanceof Ship)                 obj.prototypeChain.push("ship")
    if(obj instanceof Fragment)             obj.prototypeChain.push("fragment")
    if(obj instanceof Projectile)           obj.prototypeChain.push("projectile")
    if(obj instanceof UltraportBeacon)      obj.prototypeChain.push("ultraportBeacon")
    if(obj instanceof Explosion)            obj.prototypeChain.push("explosion")
    if(obj instanceof Particle)             obj.prototypeChain.push("particle")
    if(obj instanceof Hint)                 obj.prototypeChain.push("hint")
    if(obj instanceof HintGraphic)          obj.prototypeChain.push("hintGraphic")
    if(obj instanceof GameOverlay)          obj.prototypeChain.push("gameOverlay")
    if(obj instanceof LocationRandomizer)   obj.prototypeChain.push("locationRandomizer")
    if(obj instanceof RandomSpawner)        obj.prototypeChain.push("randomSpawner")
    if(obj instanceof MapIcon)              obj.prototypeChain.push("mapIcon")
    if(obj instanceof MapImage)             obj.prototypeChain.push("mapImage")
    if(obj instanceof MapLabel)             obj.prototypeChain.push("mapLabel")
    if(obj instanceof Person)               obj.prototypeChain.push("person")
    if(obj instanceof NPC)                  obj.prototypeChain.push("npc")
    if(obj instanceof Player)               obj.prototypeChain.push("player")
    if(obj instanceof LightSource)          obj.prototypeChain.push("lightSource")
    if(obj instanceof AudioEmitter)         obj.prototypeChain.push("audioEmitter")

    /* special exception for the Decoration object, which has less overheads when updating */
    if(obj instanceof Decoration)           obj.prototypeChain.push("decoration")

    options.world.addGameObject(obj, options.layer)
    return obj
  }
  static destroy(obj) {
    if(obj.destroyed) return
    
    obj.destroy()
    switch(obj.type) {
      case "decoration": {break}
      default: {
        this.removeFromStage(obj)
        if(obj.sprite) {
          obj.sprite.container?.destroy()
          if(obj.sprite.minimapIcon)
            game.minimapApp.stage.removeChild(obj.sprite.minimapIcon)
        }
        obj.components.forEach(comp => {
          delete obj[comp].gameObject
          delete obj[comp]
        })

        obj.npcs.forEach(npc => GameObject.destroy(npc))
        obj.gameWorld.removeGameObject(obj)
        obj.destroyed = true
      }
    }

    GameEvent.create("destroyGameObject", {obj})
  }
  static addToStage(obj, stage) {
    obj.stage = stage

    /* Decoration objects are simpler so they need some custom handling */
    switch(obj.type) {
      case "decoration" : {
        obj.stage.addChild(obj.sprite)
        break
      }
      default: {
        obj.stage.addChild(obj.sprite.container)
        obj.show()
      }
    }
  }
  static removeFromStage(obj) {
    obj.stage?.removeChild(obj.sprite?.container)
    obj?.hide()
  }
  //#endregion
  //#region utility methods
  static distance(obj1, obj2) {
    return obj1.transform.position.distance(obj2.transform.position)
  }
  static distanceFast(obj1, obj2) {
    return Math.abs(obj2.transform.position.x - obj1.transform.position.x) + Math.abs(obj2.transform.position.y - obj1.transform.position.y) - (obj1.broadphaseGrowFactor >> 1) * grid.cellSize - (obj2.broadphaseGrowFactor >> 1) * grid.cellSize
  }
  static closest(target, ...objects) {
    let closestVector = target.transform.position.closest(...objects.map(obj => obj.transform.position))
    return objects.find(obj => obj.transform.position.is(closestVector))
  }
  static closestToPoint(vector, ...objects) {
    let closestVector = vector.closest(...objects.map(t => t.transform.position))
    return objects.find(obj => obj.transform.position.is(closestVector))
  }
  static angle(obj1, obj2) {
    return obj1.transform.position.angleTo(obj2.transform.position)
  }
  static byId(world, id) {
    return world.gameObjects.gameObject.find(obj => obj.id === id)
  }
  //#endregion
}

class GameEvent {
  constructor(type, ...params) {
    this.type = type
    for(let key in params)
      this[key] = params[key]
  }
  static create(type, params = {}) {
    let event = new GameEvent(type, params)

    /* 
    go through some potential handlers to process the event 
    the event isn't referenced anywhere to allow GC to devour the related data
    */
   this.handlers.forEach(handler => {
    if(handler.eventType === event.type || handler.eventType === "any")
      handler.function(event)
   })
  }
  static attachHandler(handler = {eventType: "destroyGameObject", function: () => {}}) {
    this.handlers.push(handler)
  }
  static handlers = []
}
let sources = {
  img: {
    ship: {
      theGrandMoth: {
        folder: "./assets/ship/theGrandMoth/",
        auto: [
          "thumbnail",
          "glow",
          "boostersGlow",
          "shieldHardLightFront",
          "shieldForceField",
          "shieldBubble",
          "shieldPulse8",
          "vwbOutline",
          "coatingLayer3",
          "flameLow4",
          "flameMedium4",
          "flameHigh4",
          "ghost",
          "weapons",
          "fill",
          "stealthFill4",
          "highlights",
          "shieldChargeIndicator",
          "boostersIndicator",
          "brakeIndicator",
          "hullInvulnerableAnimation10",
          "linework",
          "stealthLinework",
          "skip5",
          "wreck6",
          "travelAnimationSubmerge",
          "travelAnimationEmerge",
        ],
      },
      waspFighter: {
        folder: "./assets/ship/waspFighter/",
        auto: [
          "thumbnail",
          "shieldHardLightFront",
          "vwbOutline",
          "glow",
          "flameLow4",
          "flameMedium4",
          "flameHigh4",
          "ghost",
          "weapons",
          "fill",
          "stealthFill4",
          "laserChargeProgress5",
          "shieldChargeIndicator",
          "boostersIndicator",
          "brakeIndicator",
          "highlights",
          "hullInvulnerableAnimation8",
          "linework",
          "stealthLinework",
          "skip5",
          "wreck6",
          "travelAnimationSubmerge",
          "travelAnimationEmerge",
        ],
      },
      waspFighterII: {
        folder: "./assets/ship/waspFighterII/",
        auto: [
          "thumbnail",
          "shieldHardLightFront",
          "vwbOutline",
          "glow",
          "flameLow4",
          "flameMedium4",
          "flameHigh4",
          "ghost",
          "weapons",
          "fill",
          "stealthFill4",
          "laserChargeProgress5",
          "shieldChargeIndicator",
          "boostersIndicator",
          "brakeIndicator",
          "highlights",
          "hullInvulnerableAnimation8",
          "linework",
          "stealthLinework",
          "skip5",
          "wreck6",
          "travelAnimationSubmerge",
          "travelAnimationEmerge",
        ],
      },
      starBee: {
        folder: "./assets/ship/starBee/",
        auto: [
          "thumbnail",
          "flameLow4",
          "flameMedium4",
          "flameHigh4",
          "weapons",
          "fill",
          "brakeIndicator",
          "highlights",
          "hullInvulnerableAnimation8",
          "linework",
          "skip5",
          "travelAnimationSubmerge",
          "travelAnimationEmerge",
        ],
      },
    },
    station: {
      crimson: {
        folder: "./assets/station/crimsonLeagueStation/",
        auto: [
          "thumbnail",
          "fill",
          "highlights",
          "lights",
          "lightsOverlay",
          "linework",
        ],
      },
      crownDockingStationLarge: {
        folder: "./assets/station/crownDockingStationLarge/",
        auto: [
          "thumbnail",
          "linework",
        ],
      },
      introDepotStation: {
        folder: "./assets/station/introDepotStation/",
        auto: [
          "thumbnail",
          "linework",
        ],
      },
      crownOrbitalHive: {
        folder: "./assets/station/crownOrbitalHive/",
        auto: [
          "thumbnail",
          "fill",
          "highlights",
          "linework",
        ],
      },
    },
    satellite: {
      weatherSatelliteSmall: {
        folder: "./assets/satellite/weatherSatelliteSmall/",
        auto: [
          "thumbnail",
          "fill",
          "highlights",
          "linework",
          "wreck5"
        ],
      },
    },
    asteroid: {
      small0: {
        folder: "./assets/asteroid/small0/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death5"],
      },
      small1: {
        folder: "./assets/asteroid/small1/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death4"],
      },
      small2: {
        folder: "./assets/asteroid/small2/",
        auto: ["thumbnail", "fill", "highlights", "linework"],
      },
      small3: {
        folder: "./assets/asteroid/small3/",
        auto: ["thumbnail", "fill", "highlights", "linework"],
      },
      medium0: {
        folder: "./assets/asteroid/medium0/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death6"],
      },
      medium1: {
        folder: "./assets/asteroid/medium1/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death3"],
      },
      medium2: {
        folder: "./assets/asteroid/medium2/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death3"],
      },
      large0: {
        folder: "./assets/asteroid/large0/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death9"],
      },
      large1: {
        folder: "./assets/asteroid/large1/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death7"],
      },
      copperLarge0: {
        folder: "./assets/asteroid/copperLarge0/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death9"],
      },
      copperMedium0: {
        folder: "./assets/asteroid/copperMedium0/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death5"],
      },
      copperMedium1: {
        folder: "./assets/asteroid/copperMedium1/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death5"],
      },
      clayLarge0: {
        folder: "./assets/asteroid/clayLarge0/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death7"],
      },
      clayMedium0: {
        folder: "./assets/asteroid/clayMedium0/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death6"],
      },
      clayMedium1: {
        folder: "./assets/asteroid/clayMedium1/",
        auto: ["thumbnail", "fill", "highlights", "linework", "death5"],
      },
      overgrownMedium0: {
        folder: "./assets/asteroid/overgrownMedium0/",
        auto: ["thumbnail", "linework"],
      },
      overgrownMedium1: {
        folder: "./assets/asteroid/overgrownMedium1/",
        auto: ["thumbnail", "linework"],
      },
      overgrownLarge0: {
        folder: "./assets/asteroid/overgrownLarge0/",
        auto: ["thumbnail", "fill", "linework"],
      },
      overgrownLarge1: {
        folder: "./assets/asteroid/overgrownLarge1/",
        auto: ["thumbnail", "fill", "highlights", "linework"],
      },
      overgrownLarge2: {
        folder: "./assets/asteroid/overgrownLarge2/",
        auto: ["thumbnail", "linework"],
      },
      overgrownLarge3: {
        folder: "./assets/asteroid/overgrownLarge3/",
        auto: ["thumbnail", "linework"],
      },
      overgrownLarge4: {
        folder: "./assets/asteroid/overgrownLarge4/",
        auto: ["thumbnail", "linework"],
      },
      overgrownLarge5: {
        folder: "./assets/asteroid/overgrownLarge5/",
        auto: ["thumbnail", "linework"],
      },
    },
    debris: {
      crimsonFighterWreck: {
        folder: "./assets/debris/crimsonFighterWreck/",
        auto: ["thumbnail", "linework"],
      },
      hiveBattleshipWreck: {
        folder: "./assets/debris/hiveBattleshipWreck/",
        auto: ["thumbnail", "linework"],
      },
      hiveFreighterWreck: {
        folder: "./assets/debris/hiveFreighterWreck/",
        auto: ["thumbnail", "linework"],
      },
      debris0: {
        folder: "./assets/debris/generic0/",
        auto: ["thumbnail", "fill", "highlights", "linework"],
      },
      debris1: {
        folder: "./assets/debris/generic1/",
        auto: ["thumbnail", "fill", "highlights", "linework"],
      },
      debris2: {
        folder: "./assets/debris/generic2/",
        auto: ["thumbnail", "fill", "highlights", "linework"],
      },
      debris3: {
        folder: "./assets/debris/generic3/",
        auto: ["thumbnail", "fill", "highlights", "linework"],
      },
      debris4: {
        folder: "./assets/debris/generic4/",
        auto: ["thumbnail", "fill", "highlights", "linework"],
      },
    },
    projectile: {
      missileHelios: {
        folder: "./assets/projectile/missileHelios/",
        auto: ["linework"],
      },
      plasmaShotI: {
        folder: "./assets/projectile/plasmaShotI/",
        auto: ["linework"],
      },
      trapMissile: {
        folder: "./assets/projectile/trapMissile/",
        auto: ["linework"],
      },
      debris: {
        folder: "./assets/projectile/debris/",
        auto: ["linework"],
      },
    },
    ultraportBeacon: {
      default: {
        folder: "./assets/ultraportBeacon/default/",
        auto: ["thumbnail", "glow", "fill", "overlayFill", "linework", "particles6"],
      },
    },
    hintGraphic: {
      rotateShip: {
        folder: "./assets/hintGraphic/rotateShip/",
        auto: ["linework13"],
      },
      moveShip: {
        folder: "./assets/hintGraphic/moveShip/",
        auto: ["linework11"],
      },
      shipMovement: {
        folder: "./assets/hintGraphic/shipMovement/",
        auto: ["linework19"],
      },
      skipRecharge: {
        folder: "./assets/hintGraphic/skipRecharge/",
        auto: ["linework44"],
      },
    },
    decoration: {
      empty: {
        folder: "assets/decorativeObject/_empty/",
        auto: [],
      },
      bgMedium0: {
        folder: "assets/decorativeObject/asteroid/bgMedium0/",
        auto: ["linework"],
      },
      bgMedium1: {
        folder: "assets/decorativeObject/asteroid/bgMedium1/",
        auto: ["linework"],
      },
      bgMedium2: {
        folder: "assets/decorativeObject/asteroid/bgMedium2/",
        auto: ["linework"],
      },
      bgMedium3: {
        folder: "assets/decorativeObject/asteroid/bgMedium3/",
        auto: ["linework"],
      },
      bgMedium4: {
        folder: "assets/decorativeObject/asteroid/bgMedium4/",
        auto: ["linework"],
      },
      bgMedium5: {
        folder: "assets/decorativeObject/asteroid/bgMedium5/",
        auto: ["linework"],
      },
      bgLarge0: {
        folder: "assets/decorativeObject/asteroid/bgLarge0/",
        auto: ["linework"],
      },
      bgLarge1: {
        folder: "assets/decorativeObject/asteroid/bgLarge1/",
        auto: ["linework"],
      },
      bgLarge2: {
        folder: "assets/decorativeObject/asteroid/bgLarge2/",
        auto: ["linework"],
      },
      bgLarge3: {
        folder: "assets/decorativeObject/asteroid/bgLarge3/",
        auto: ["linework"],
      },
      bgLarge4: {
        folder: "assets/decorativeObject/asteroid/bgLarge4/",
        auto: ["linework"],
      },
      bgOvergrownMedium0: {
        folder: "assets/decorativeObject/asteroid/bgOvergrownMedium0/",
        auto: ["linework"],
      },
      crownOrbitalHive: {
        folder: "assets/decorativeObject/crownOrbitalHive/",
        auto: ["linework"],
      },
      crownDockingStation: {
        folder: "assets/decorativeObject/crownDockingStation/",
        auto: ["linework"],
      },
      starBee: {
        folder: "assets/decorativeObject/starBee/",
        auto: ["linework"],
      },
      shipWreckTU: {
        folder: "assets/decorativeObject/shipWreckTU/",
        auto: ["linework"],
      },
      largeDebrisPlate: {
        folder: "assets/decorativeObject/largeDebrisPlate/",
        auto: ["linework"],
      },
      fgMedium0: {
        folder: "assets/asteroid/fgMedium0/",
        auto: ["linework"],
      },
      fgMedium1: {
        folder: "assets/asteroid/fgMedium1/",
        auto: ["linework"],
      },
      fgMedium2: {
        folder: "assets/asteroid/fgMedium2/",
        auto: ["linework"],
      },
      fgMedium3: {
        folder: "assets/asteroid/fgMedium3/",
        auto: ["linework"],
      },
      fgMedium4: {
        folder: "assets/asteroid/fgMedium4/",
        auto: ["linework"],
      },
      fgMedium5: {
        folder: "assets/asteroid/fgMedium5/",
        auto: ["linework"],
      },
      largeFog0: {
        folder: "assets/decorativeObject/fog/largeFog0/",
        auto: ["linework"],
      },
      largeFog1: {
        folder: "assets/decorativeObject/fog/largeFog1/",
        auto: ["linework"],
      },
      largeFog2: {
        folder: "assets/decorativeObject/fog/largeFog2/",
        auto: ["linework"],
      },
      largeFog3: {
        folder: "assets/decorativeObject/fog/largeFog3/",
        auto: ["linework"],
      },
      largeFog4: {
        folder: "assets/decorativeObject/fog/largeFog4/",
        auto: ["linework"],
      },
      mediumFog0: {
        folder: "assets/decorativeObject/fog/mediumFog0/",
        auto: ["linework"],
      },
      mediumFog1: {
        folder: "assets/decorativeObject/fog/mediumFog1/",
        auto: ["linework"],
      },
      mediumFog2: {
        folder: "assets/decorativeObject/fog/mediumFog2/",
        auto: ["linework"],
      },
    },
    mapIcon: {
      connected: {
        folder: "assets/mapIcon/connected/",
        auto: [
          "star",
          "orbit1",
          "orbit2",
          "orbit3",
        ]
      },
      outback: {
        folder: "assets/mapIcon/outback/",
        auto: [
          "star",
          "orbit1",
          "orbit2",
          "orbit3",
        ]
      },
    },
    mapImage: {
      mapBackground: {
        folder: "assets/mapImage/mapBackground/", auto: ["linework"],
      },
      nebula0: {
        folder: "assets/mapImage/nebula0/", auto: ["linework"],
      },
      nebula1: {
        folder: "assets/mapImage/nebula1/", auto: ["linework"],
      },
      nebula2: {
        folder: "assets/mapImage/nebula2/", auto: ["linework"],
      },
      nebula3: {
        folder: "assets/mapImage/nebula3/", auto: ["linework"],
      },
      nebula4: {
        folder: "assets/mapImage/nebula4/", auto: ["linework"],
      },
      nebula5: {
        folder: "assets/mapImage/nebula5/", auto: ["linework"],
      },
      nebula6: {
        folder: "assets/mapImage/nebula6/", auto: ["linework"],
      },
      nebula7: {
        folder: "assets/mapImage/nebula7/", auto: ["linework"],
      },
      nebula8: {
        folder: "assets/mapImage/nebula8/", auto: ["linework"],
      },
      nebula9: {
        folder: "assets/mapImage/nebula9/", auto: ["linework"],
      },
      nebulaBlueFull: {
        folder: "assets/mapImage/nebulaBlueFull/", auto: ["linework"],
      },
      nebulaMagentaFull: {
        folder: "assets/mapImage/nebulaMagentaFull/", auto: ["linework"],
      },
      nebulaPurpleFull: {
        folder: "assets/mapImage/nebulaPurpleFull/", auto: ["linework"],
      },
      nebulaPurple2Full: {
        folder: "assets/mapImage/nebulaPurple2Full/", auto: ["linework"],
      },
      nebulaBlue0: {
        folder: "assets/mapImage/nebulaBlue0/", auto: ["linework"],
      },
      nebulaBlue1: {
        folder: "assets/mapImage/nebulaBlue1/", auto: ["linework"],
      },
      nebulaBlue2: {
        folder: "assets/mapImage/nebulaBlue2/", auto: ["linework"],
      },
      nebulaBlue3: {
        folder: "assets/mapImage/nebulaBlue3/", auto: ["linework"],
      },
      nebulaBlue4: {
        folder: "assets/mapImage/nebulaBlue4/", auto: ["linework"],
      },
      nebulaBlue5: {
        folder: "assets/mapImage/nebulaBlue5/", auto: ["linework"],
      },
      bgFog1: {
        folder: "assets/mapImage/bgFog1/", auto: ["linework"],
      },
      bgStars1: {
        folder: "assets/mapImage/bgStars1/", auto: ["linework"],
      },
      asteroids1: {
        folder: "assets/mapImage/asteroids1/", auto: ["linework"],
      },
      asteroids2: {
        folder: "assets/mapImage/asteroids2/", auto: ["linework"],
      },
      asteroids3: {
        folder: "assets/mapImage/asteroids3/", auto: ["linework"],
      },
      asteroids4: {
        folder: "assets/mapImage/asteroids4/", auto: ["linework"],
      },
      questOverlay_theLostPrincess_searchRadius: {
        folder: "assets/mapImage/questOverlay_theLostPrincess_searchRadius/", auto: ["linework"],
      },
    },
    explosion: {
      default: {
        folder: "./assets/explosion/default/",
        auto: ["linework12"],
      },
      plasma: {
        folder: "./assets/explosion/plasma/",
        auto: ["linework5"],
      },
    },
    particle: {
      theGrandMothHullDamage: {
        folder: "./assets/ship/theGrandMoth/",
        auto: ["hullDamage4"],
      },
      waspFighterHullDamage: {
        folder: "./assets/ship/waspFighter/",
        auto: ["hullDamage4"],
      },
      waspFighterIIHullDamage: {
        folder: "./assets/ship/waspFighter/",
        auto: ["hullDamage4"],
      },
      starBeeHullDamage: {
        folder: "./assets/ship/theGrandMoth/",
        auto: ["hullDamage4"],
      },
      laserHit: {
        folder: "./assets/particle/laserHit/",
        auto: ["particles7"],
      },
      debris: {
        folder: "./assets/particle/debris/",
        auto: ["particles4"],
      },
      asteroidRock: {
        folder: "./assets/particle/asteroidRock/",
        auto: ["particles3"],
      },
      asteroidClay: {
        folder: "./assets/particle/asteroidClay/",
        auto: ["particles4"],
      },
      asteroidCopper: {
        folder: "./assets/particle/asteroidCopper/",
        auto: ["particles4"],
      },
      explosionHit: {
        folder: "./assets/particle/explosionHit/",
        auto: ["particles3"],
      },
    },
    gameOverlay: {
      movementTrap: {
        folder: "./assets/gameOverlay/movementTrap/",
        auto: ["gameOverlay5"],
      },
      overlayOpenStationMenu: {
        folder: "./assets/gameOverlay/overlayOpenStationMenu/",
        auto: ["gameOverlay"],
      },
      overlayOpenMap: {
        folder: "./assets/gameOverlay/overlayOpenMap/",
        auto: ["gameOverlay"],
      },
      overlayOpenMapAndUseKey: {
        folder: "./assets/gameOverlay/overlayOpenMapAndUseKey/",
        auto: ["gameOverlay"],
      },
      overlayDockIntoStation: {
        folder: "./assets/gameOverlay/overlayDockIntoStation/",
        auto: ["gameOverlay"],
      },
      targetSmall: {
        folder: "./assets/gameOverlay/targetSmall/",
        auto: ["gameOverlay"],
      },
      scrapDebris: {
        folder: "./assets/gameOverlay/scrapDebris/",
        auto: ["gameOverlay"],
      },
      weaponSelect: {
        folder: "./assets/gameOverlay/weaponSelect/",
        auto: ["gameOverlay3"],
      },
      weaponNotCharged: {
        folder: "./assets/gameOverlay/weaponNotCharged/",
        auto: ["gameOverlay5"],
      },
    },
  },
  audio: {
    music: [
      "mainTheme loop",
      "introCutscene loop",
      "kaesoBackground loop",
    ],
    SFX: [
      "buttonHover",
      "buttonClick",
      "buttonNoAction",
      "cardShimmer",
      "dialogueLetter1",
      "dialogueLetter2",
      "dialogueLetter3",
      "receivedItem",
      "asteroidDamage",
      "asteroidDestroySmall",
      "asteroidDestroyMedium",
      "asteroidDestroyLarge",
      "explosionDefault",
      "explosionPlasma1",
      "explosionPlasma2",
      "hullDamage",
      "speakerLeaveDialogue",
      "dialogueOptionsShow",
      "dialogueOptionsHide",
      "plasmaWeaponFire",
      "rocketWeaponFire",
      "shipEngine loop",
      "stationAmbience loop",
      "ultraportAmbience loop",
      "ultraportTravel",
      "tightbeamCall loop",
      "shipEngineStart",
      "shipEngineStop",
    ]
  }
};
let data = {}

data.weaponTypes = {
  missile: {
    codeColor: "#dba03b"
  },
  plasma: {
    codeColor: "#3cb329"
  },
  solidProjectile: {
    codeColor: "#9e9e9e"
  },
  laser: {
    codeColor: "#da291f"
  },
  deathbeam: {
    codeColor: "#857eb8"
  },
}

data.shieldTypes = [
  "bubble",
  "pulse",
  "force",
  "hardLight",
]

data.shieldTemplates = [
  {
    type: "forceField",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      strength: 60,
      effectiveDistance: 60
    }
  },
  {
    type: "hardLight",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      disposition: "flank",
      distance: 250,
    }
  },
  {
    type: "pulse",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      distance: 250,
      pulseStrength: 400,
      arcLength: PI/2, 
      rechargeTimeMS: 1500,
    }
  },
]

data.starTypes = {
  redDwarf: {
    displayName: "Red Dwarf",
    hexColor: "#A81411",
    description: "A small star at the end of its lifetime, it emits barely enough light to support life on it's surrounding planets."
  },
  mainSequenceGType: {
    displayName: "Main sequence G-Type star",
    hexColor: "#FFF2BD",
    description: "A regular sized star, similar to Earth's sun. It's one of the most common star types."
  },
  mainSequenceBType: {
    displayName: "Main sequence B-Type star",
    hexColor: "#48A0FF",
    description: "Rather small star, emitting very luminous blue light."
  },
  neutronStar: {
    displayName: "Neutron Star",
    hexColor: "#99E0FF",
    description: "Tiny in size, but extremely dense, made up almost exclusively of tightly packed neutrons. It emits light blue color."
  },
}

data.ability = [
  "transferItems",
  "transferCurrency",
  "travel", //can exit current vehicle && travel to different orbits or systems
  "controlShip",
  "talk",
  "command", //can be followed by others on a battlefield
]

data.jobTitle = {
  "player": {
    ability: [ "transferItems", "transferCurrency", "travel", "controlShip", "talk", "command" ]
  },
  "captain": {
    ability: [ "transferItems", "transferCurrency", "travel", "controlShip", "talk", "command" ]
  },
  "crewman": {
    ability: [ "travel", "talk", ]
  },
  "merchant": {
    ability: [ "transferItems", "transferCurrency", "travel", "controlShip" ]
  },
  "communicator": {
    ability: [ "transferCurrency", "talk", "command" ]
  },
  "king": {
    ability: [ "transferItems", "transferCurrency", "travel", "controlShip", "talk", "command" ]
  },
  "princess": {
    ability: [ "transferItems", "transferCurrency", "travel", "controlShip", "talk", "command" ]
  },
}

data.faction = {
  crimsonLeague: {
    ships: [],
    personnel: [],
    territories: [
      //...list of locations
    ],
  },
}


data.pathfinding = {
  projection: {
    iterations: 14,
    timestretch: 12, //used to compute values further in time, each iteration takes this many frames, therefore allowing you to compute many seconds ahead
  }
}

data.maxObjectVelocity = 1200
data.inertia = 0.998 //multiplies velocity of all objects on per-frame basis, with a few exceptions; I might remove this feature
data.detectCollisionWithinThisFastDistanceOfPlayer = 2000
data.updateObjectsWithinThisFastDistanceOfPlayer = 2000
data.npcLineOfSightDistance = 2200
data.objectToLayerMap = new Map()

data.objectToLayerMap.set("asteroid",         ["asteroid"])
data.objectToLayerMap.set("ultraportBeacon",  ["ship"])
data.objectToLayerMap.set("hintGraphic",      ["overlays"])
data.objectToLayerMap.set("gameOverlay",      ["overlays"])
data.objectToLayerMap.set("station",          ["asteroid"])
data.objectToLayerMap.set("satellite",        ["asteroid"])
data.objectToLayerMap.set("debris",           ["debris"])
data.objectToLayerMap.set("ship",             ["ship"])
data.objectToLayerMap.set("projectile",       ["projectile"])
data.objectToLayerMap.set("fragment",         ["asteroid"])
data.objectToLayerMap.set("explosion",        ["overlays"])
data.objectToLayerMap.set("particle",         ["overlays"])
data.objectToLayerMap.set("mapIcon",          ["overlays"])
data.objectToLayerMap.set("mapImage",         ["overlays"])
data.objectToLayerMap.set("mapLabel",         ["overlays"])
data.objectToLayerMap.set("decorativeObject", ["background", "background2", "background3", "background4", "foreground", "foreground2", "foreground3"])
data.objectToLayerMap.set("decoration",       ["background", "background2", "background3", "background4", "foreground", "foreground2", "foreground3"])


data.item = {
  princessWristband: {
    //"name" must match the key under which the datablock is stored, because I'm stupid
    //"thumbnail" can be anything, the game will look for a PNG with that name, this is mostly going to be the same value as "name"
    name: "princessWristband",
    title: "Princess's wristband",
    thumbnail: "princessWristband",
    description: 
    `A personal security wristband worn by all high-ranking persons of the Crown. This one belongs to the princess Livie Valois.`,
    flags: {canSell: false, questItem: true, canSellOnBlackMarket: true}
  },
  princessHandkerchief: {
    name: "princessHandkerchief",
    title: "Princess's handkerchief",
    thumbnail: "princessHandkerchief",
    description: 
    `This handkerchief was found in her room. We can use the DNA to track her across public records, if her identity were to be changed.`,
    flags: {canSell: false, questItem: true, canSellOnBlackMarket: true}
  },
  mysteriousOldShipment: {
    name: "mysteriousOldShipment",
    title: "Mysterious Old Shipment",
    thumbnail: "mysteriousOldShipment",
    description: 
    `This crate has been sitting on this ship for ages. Who knows what's in it.`,
    sellValue: 25,
    flags: {canSell: false, questItem: true, canSellOnBlackMarket: true}
  },
  datadrive: {
    name: "datadrive",
    title: "Datadrive with Princess's ship signature",
    thumbnail: "datadrive",
    description: 
    `Using the data found on this drive, it's possible to decipher the destination of the departing ship.
    However, that won't be enough without access to a beacon interface.`,
    flags: {canSell: false, questItem: true, canSellOnBlackMarket: true}
  },
  debris: {
    name: "debris",
    title: "A bit of debris.",
    thumbnail: "debris",
    description: 
    `bit of debris from a man-made object. Contains mostly steel, copper, gold and rubber.`,
    sellValue: 1,
    flags: {canSell: true, questItem: false, canSellOnBlackMarket: true}
  },
  microchipX1: {
    name: "microchipX1",
    title: "Microship X-1",
    thumbnail: "microchipX1",
    description: 
    `Very low power requirements and cheap to produce, these disposable chips are as abundant as dirt was on Earth. Named after the famous blackhole Cygnus X-1.`,
    sellValue: 5,
    buyCost: 7,
    flags: {canSell: true, questItem: false, canSellOnBlackMarket: true}
  },
  beaconAccessKey: {
    name: "beaconAccessKey",
    title: "Kaeso Beacon Access Key",
    thumbnail: "beaconAccessKey",
    description: 
    `Special device that allows access to the internals of an Ultraport beacon. Only works for a specific beacon.

    This one is configured for the exit beacon around planet Kaeso.`,
    flags: {canSell: false, questItem: true, canSellOnBlackMarket: true}
  },
  electronicsShipment: {
    name: "electronicsShipment",
    title: "Electronics shipment",
    thumbnail: "electronicsShipment",
    description: 
    `Shipment of electronic parts. For confidential reasons the contents aren't disclosed on the box.`,
    sellValue: 50,
    blackSellValue: 150,
    buyCost: 75,
    flags: {canSell: true, questItem: false, canSellOnBlackMarket: true}
  },
  forceFieldShields: {
    name: "forceFieldShields",
    title: "Force-field Shields",
    thumbnail: "forceFieldShields",
    description: 
    `These shields repel any object that gets close to it. It's not effective enough to stop projectiles but may prevent accidentally bumping into things.`,
    sellValue: 54,
    buyCost: 75,
    itemType: "shipSystem",
    flags: {canSell: true, questItem: false, canSellOnBlackMarket: true}
  }
}
data.quest = {
  theLostPrincess: {
    note: 
    `Summary:
    Livie Valois disappeared on March 13th 2675, 05:30. All evidence we have is a cruiser sighting and its approximate destination. 
    
    Plan:
    I reckon searching the locations within the trace radius one by one is the appropriate strategy. Starting with the dangerous solar systems might be my best bet until I can identify any traces of her ship. I don’t think any of the major players would risk a move like this, so this leaves us with the fanatic tribes of the outback, or perhaps the Hive.
    
    There’s too many questions waiting to be answered...`,
    options: [
      "Start looking for her in one of the destinations.",
      "Ask around carefully whether somebody's seen a crown cruiser, make up some excuse like a drug cartel investigation.",
      "",
    ]
  },
  outbackNegotiations: {
    note: 
    `Summary:
    A negotiation will be taking place on the topic of bordering communist and crown regions, and which government should take hold of those. Sensitive topic. Historically they were all autonomous regious until the crown took over and then the communist government formed swiftly within the next 20 years.
    
    Options:
    I don’t know for sure, information on this topic is scarce, I might need to poke around in the archives to find out more.

    [find in archive] 
    Poverty used to be a larger issue before the Crown, for sure, and as supply transports became more common so did the overall quality of life improve. However the regions are being exploited for resources.

    [reveals after first round of negotiations]
    `,
    options: [
      `Tank the negotiation by accident by revealing the existence of [some secret] crown documents.`,
      `Help argue Crown’s case that a central government will bring prosperity and unity to the regions.`,
      `Argue that neither government should take over and that the regions should be freed.`,
    ],
  },
  hiveArmsDeal: {
    note: 
    `Summary:
    The general assigned me as the Crown delegate on a mission to negotiate the purchase of some of the latest Hive technology such as ship-class weapons, personal weapons and a few experimental ship designs.
    I don’t think it’s a trap, they’d be really stupid to do that. I think I’ll go there first to find out more about the technology. Ideally bring aboard one of our top engineers to make sure we aren’t getting subpar products.
    
    Plan:
    Get Brady Cornell from Emna station, then travel to Hive main.`,
    options: [
      "",
      "",
    ]
  },
  piratesArrAProblem: {
    note: 
    `Summary:
    It’s another one of those annoying pirate hunts. I hate these. A new group of pirates took residence in the infamous octopus nebula, and apparently they had been attacking in the near systems.
    
    Plan:
    Get in, destroy their shit, get out. I wish there was some permanent solution to piracy, instead of having to play this relentless game of cat and mouse with them.`,
    options: [
      "",
      "",
    ]
  },
  waterTroubles: {
    note: 
    `Summary:
    The so called “WASP” tribe has been having a rough time with the Trader’s Union [TU], again, apparently... They had been spotted drilling deep wells on the planet in the main aquifer-rich regions, depriving the population of the much needed resource. Then they began selling the water back to the inhabitants. Very distasteful.
    
    I’m not sure how to approach this situation without completely sinking Crown’s tense relationship with TU. A covert sabotage could work. I just need to find the right people for the job. Cannot risk showing myself near the planet.
    
    I cannot tell what will come of this. Perhaps I can get these fanatics on the Crown’s side, or at least mine...`,
    options: [
      "",
      "",
    ]
  },
  governmentInfiltration: {
    note: 
    `Summary:
    The Hive wants to get their person inside the Communist government. I have to transport them to the capital and vouch for them in some way. His identity had been designed by entities smarter than me, so that is taken care of.
    
    The reason for this infiltration is not exactly clear to me, but I feel like I should play along and see what we can get out of this relationship. The Hive is probably playing its own game of 4D chess while the rest of us are stuck reading the manual.`,
    options: [
      "",
      "",
    ]
  },
  cobaltMinesBusiness: {
    note: 
    `Summary:
    Negotiate with the Naurw society of [some earth-like planet]. Apparently the Communists want to make peace with them to secure some resources on their planet.
    
    I’m rather convinced this is going to go poorly. What do I even offer to these people, they have a stable local economy and do not wish to mingle with the rest of the galaxy’s, especially all the bad TU business.
    
    I could try to swindle them somehow, but that could backfire quite horribly. Perhaps I can find something they’d be willing to trade for...`,
    options: [
      "",
      "",
    ]
  },
  pilgrimageMappingAssistance: {
    note: 
    `Summary:
    A group of religious pilgrims messaged me about helping them gather some satellite shots of terrain on Araen. Apparently there is a 20 000 m. tall mountain they’re planning to climb.
    
    These shots are difficult to take on Araen, mainly due to dust storms. But they must exist somewhere, maybe I can bribe my way to some photos or scans from the weather committee surveying this region of space.
    
    What’s in this for me? Maybe nothing, but time will tell.`,
    options: [
      "",
      "",
    ]
  },
  hereComesTheGun: {
    note: 
    `Summary:
    Fanatic leader of an outback colony prophesizes the coming of a great gun to shoot everyone at the end of the world; to punish us for our trespasses, or something. The guy’s nuts. Trouble is, his followers are causing trouble on the planet and it’s putting TU on the edge. One of their large freighters got scratched by a rogue missile and now they refuse to send another aid shipment there until the situation calms.
    
    There is little reason I would have to engage in this, but maybe I can help somehow. If it helps the Crown's standing with TU, then it's well worth it.`,
    options: [
      "",
      "",
    ]
  },
  questStructure: {
    note: ``,
    factionsInvolved: [
      "crown",
      "communist",
      "outback",
      "alliance",
      "hive",
      "tradersUnion",
    ],
    options: [
      "",
      "",
    ],
    startingLocation: {
      system: "Some system",
      planet: "Some planet"
    },
    trigger: {
      method: "dialogue",
      dialogueOption: ""
    },
    treeRef: "questTree0"
  },
}

/* this is a rough idea of how the quest branching could work */
data.interactionSets = {
  theLostPrincessBranch0: [
    "someInteractionId0",
    "someInteractionId1",
    "someInteractionId2",
  ]
}
data.person = {
  "dummyCaptain": {
    displayName: "Dummy Captain",
    addressAs: null,
    race: "none",
    sex: "none",
    description: "Placeholder captain that does nothing but exist to patch holes in my terrible code.",
    inventory: [],
    jobTitle: "captain",
  },
  "player": {
    displayName: "Ada Covett",
    addressAs: null,
    race: "human",
    sex: "female",
    description: "Crown's most precious diplomat and investigator, she's faced with a new challenge as the sole force behind the quest to rescue Livie Valois, the royal heir of the Crown throne, daughter of Reuben Valois.",
    inventory: [],
    jobTitle: "player",
  },
  "aiAssistant": {
    displayName: "Gerald",
    addressAs: null,
    race: "ai",
    sex: "binary",
    description: "Ada's AI assistant. Always helpful.",
    inventory: [],
    jobTitle: "assistant",
  },
  "king": {
    displayName: "Reuben Valois",
    addressAs: "the King",
    race: "human",
    sex: "male",
    description: "Current ruler of the Crown. Needs better description. Real name is Reuben Valois.",
    inventory: [],
    jobTitle: "king",
  },
  "alSimon": {
    displayName: "Al Simon",
    addressAs: null,
    race: "human",
    sex: "male",
    inventory: [],
    description: "A young space pirate. Partner of Betty Simon. They broke away from their family to pursue a life on the edge. He has a sharp personality, kind of cocky and disrespectful to anyone who doesn't align with his ideals. He has a moral code of his own and he follows that, difficult to reason with. His real name is Ludwig Bohm. He works for a smugglers organization of unknown origin.",
    jobTitle: "captain",
  },
  "bettySimon": {
    displayName: "Betty Simon",
    addressAs: null,
    race: "human",
    sex: "female",
    inventory: [],
    description: "A young space pirate. Partner of Al Simon. They broke away from their family to pursue a life on the edge. Her real name is Alexia Jones. Along with Ludwig Bohm, she works for a smugglers organization.",
    jobTitle: "captain",
  },
  "bigT": {
    displayName: "Biggego Trev Aji",
    addressAs: null,
    race: "human",
    sex: "male",
    inventory: [],
    description: "Monk and thinker, dedicated his life to philosophy. Lives in a deist monastery on Flua, in the ${Communist} cluster. Used to work as a ship interface designer before getting bored of the job and the company of his colleagues so he pursued other things, eventually becoming a monk.",
    jobTitle: "captain",
  },
  "admiralBobocka": {
    displayName: "Admiral Bobocka",
    addressAs: null,
    race: "human",
    sex: "male",
    inventory: [],
    description: "Admiral of the Crown fleet. His expertise in ship combat and leadership is paralleled by next to none.",
    jobTitle: "captain",
  },
}
data.weapon = {
  missileHelios: {
    displayName: "Helios Missile Launcher Mk. I",
    displayNameShort: "Helios I",
    description: "Homing missile that does serious damage and causes internal fires. Standard weapon of the Crown fleet.",
    spriteCount: 5,
    buyCost: 90,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 1,
      type: "missile",
      projectile: "missileHelios",
      chargeDurationMS: 3800, 
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }

        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed / 4)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: this.target,
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("rocketWeaponFire")
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      findTarget() {
        if(!this.ready) return
        let foundTarget = false
        if(this.gameObject === player.ship) {
          game.gameObjects.ship.forEach(ship => {
            if(!Collision.auto(mouse.worldPosition, ship.hitbox)) return
            if(ship === player.ship) return
            foundTarget = true
            if(ship === this.target) return
            this.setTarget(ship)
          })
        }

        if(!foundTarget)
          this.unsetTarget()
      },
      setTarget(target) {
        AudioManager.playSFX("buttonNoAction", 0.4)
        this.target = target
        this.targetOverlay = GameObject.create("gameOverlay", "targetSmall", {parent: target}, {world: this.gameObject.gameWorld})
      },
      unsetTarget() {
        if(this.targetOverlay)
          GameObject.destroy(this.targetOverlay)
        this.targetOverlay = null
        this.target = null
      },
      updateSpecific() {
        if(!this.powered) return

        this.findTarget()
        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  trapMissile: {
    displayName: "Movement Trap Missile",
    displayNameShort: "Trap M.",
    description: "A unique weapon designed to jam target's engine. It prevents targets from moving for several seconds. It does no physical damage.",
    buyCost: 80,
    spriteCount: 6,
    iconColor: "#d42519",
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 1,
      type: "missile",
      projectile: "trapMissile",
      chargeDurationMS: 7500, 
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }

        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: null,
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("rocketWeaponFire")
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  pushBomb: {
    displayName: "Push Bomb",
    displayNameShort: "Push Bomb",
    description: "Weapon designed to fling a target in a specific direction. It does no physical damage.",
    buyCost: 45,
    spriteCount: 7,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      aimMethod: "mouseup",
      canBeDismounted: true,
      power: 1,
      type: "bomb",
      projectile: "missileHelios",
      chargeDurationMS: 4000,
      target: null,
      targetOverlay: null,
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.findTarget()
      },
      onmouseup(event) {
        if(this.target)
          this.fire()
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      findTarget() {
        if(!this.ready) return
        let foundTarget = false
        if(this.gameObject === player.ship) {
          game.gameObjects.ship.forEach(ship => {
            if(!Collision.auto(mouse.worldPosition, ship.hitbox)) return
            foundTarget = true
            if(ship == this.target) return
            if(ship == player.ship) return
            
            this.setTarget(ship)
          })
        }
        if(!foundTarget)
          this.unsetTarget()
      },
      setTarget(target) {
        AudioManager.playSFX("buttonNoAction", 0.4)
        this.target = target
        this.targetOverlay = GameObject.create("gameOverlay", "targetSmall", {parent: target}, {world: this.gameObject.gameWorld})
      },
      unsetTarget() {
        if(this.targetOverlay)
          GameObject.destroy(this.targetOverlay)
        this.targetOverlay = null
        this.target = null
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }

        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: null,
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("rocketWeaponFire")
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  plasmaCannonI: {
    displayName: "Plasma Cannon Mk. I",
    displayNameShort: "Plasma I",
    description: "A very standard plasma cannon. Does very small damage with no special effects.",
    buyCost: 60,
    spriteCount: 7,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 1,
      type: "plasma",
      projectile: "plasmaShotI",
      chargeDurationMS: 1800,
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }
        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: null,
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("plasmaWeaponFire")
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  plasmaCannonII: {
    displayName: "Plasma Cannon Mk. II",
    displayNameShort: "Plasma II",
    description: "A more powerful plasma cannon, that charges up to two standard plasma shots, which allows for more flexibility in combat.",
    buyCost: 75,
    spriteCount: 8,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 2,
      type: "plasma",
      projectile: "plasmaShotI",
      chargeDurationMS: 1800,
      chargesMax: 2,
      charges: 0,
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      recharge() {
        this.ready = true
        this.charges = Math.min(this.chargesMax, this.charges + 1)
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(this.charges)
        if(this.charges < this.chargesMax)
          this.timers.recharge.start()
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(this.charges + 1)
          sprite.onComplete = () => sprite.gotoAndStop(this.charges)
        }
        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: null,
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.charges--
        this.charges > 0 ? this.ready = true : this.ready = false
        
        this.timers.recharge.start()
        AudioManager.playSFX("plasmaWeaponFire")
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()

        if(!this.timers.recharge.active && this.charges < this.chargesMax)
          this.timers.recharge.start()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  },
  plasmaChain: {
    displayName: "Plasma Chain Cannon",
    displayNameShort: "Plasma C.",
    description: "A more powerful plasma cannon, that charges up to 6 standard plasma shots, which are all fired in a burst. \n Very good at spamming a smaller fleet of ships.",
    buyCost: 70,
    spriteCount: 7,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 3,
      type: "plasma",
      projectile: "plasmaShotI",
      chargeDurationMS: 850,
      nextShotDelay: 120,
      charges: 0,
      chargesMax: 6,
      collisionGroup: uniqueIDString()
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready && this.charges == this.chargesMax)
          this.fireNextShot()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      recharge() {
        this.charges = Math.min(this.chargesMax, this.charges + 1)
        if(this.charges < this.chargesMax)
          this.timers.recharge.start()
        else {
          this.ready = true
          this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
        }
      },
      scheduleNextShot() {
        this.ready = false
        if(this.charges) {
          this.timers.fireNextShot.start()
        }
        else {
          this.timers.fireNextShot.reset()
          this.timers.recharge.start()
        }
      },
      fireNextShot() {
        this.fire()
        this.scheduleNextShot()
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }
        let position = this.gameObject.transform.position.clone()
        let projectileOffsetToMatchSlotPosition = new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        )
        .rotate(this.gameObject.transform.rotation)
        position.add(projectileOffsetToMatchSlotPosition)

        let angleToShipTargetPosition = position.angleTo(this.gameObject.targetPosition)
        let velocity = Vector.fromAngle(angleToShipTargetPosition).mult(data.projectile[this.projectile].speed)

        GameObject.create(
          "projectile", 
          this.projectile, 
          {
            transform: new Transform(
              position,
              velocity,
            ),
            owner: this.gameObject,
            target: null,
            collisionGroup: this.collisionGroup
          },
          {
            world: this.gameObject.gameWorld
          }
        )
        this.charges--
        AudioManager.playSFX("plasmaWeaponFire")
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()

        if(!this.timers.recharge.active && this.charges < this.chargesMax && !this.isFiring)
          this.timers.recharge.start()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}],
          ["fireNextShot", this.nextShotDelay, {loop: true, active: false, onfinish: this.fireNextShot.bind(this)}],
        )
      }
    }
  },
  forkLaserI: {
    displayName: "Fork Laser Mk. I",
    displayNameShort: "Fork Laser",
    description: "Unusually designed laser weapon - it shoots one powerful beam, which is split by a prism into two less powerful beams. If your target is large enough, both beams usually hit.",
    buyCost: 60,
    spriteCount: 1,
    weaponData: {
      canBeDismounted: false,
      power: 1,
      type: "laser",
      chargeDurationMS: 1500,
      damagePerBeam: 1,
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      fire() {
        
      },
      updateSpecific() {
        if(!this.powered) return


      },
      setup() {
        
      }
    }
  },
  burstLaser: {
    displayName: "Burst Laser Mk. I",
    displayNameShort: "Burst L. I",
    description: "Poorly designed but powerful weapon. Suffers from slight inaccuracy. Shoots three consecutive layers, each with a 50% chance to do damage.",
    buyCost: 80,
    spriteCount: 1,
    weaponData: {
      chargeMethod: "auto",
      fireMethod: "mousedown",
      canBeDismounted: true,
      power: 1,
      type: "laser",
      chargeDurationMS: 3000,
      charges: 0,
      chargesMax: 3,
      damagePerBeam: 1,
      chanceToDamage: 0.5,
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      recharge() {
        this.charges = this.chargesMax
        this.ready = true
      },
      fire() {
        
      },
      updateSpecific() {
        if(!this.powered) return


      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}],
          ["fireNextShot", this.nextShotDelay, {loop: true, active: false, onfinish: this.fireNextShot.bind(this)}],
        )
      }
    }
  },
  waspLaserFront: {
    displayName: "Wasp Fighter Front Laser",
    displayNameShort: "Wasp L.",
    description: "Powerful and unwieldy, a special laser used by the Wasp tribe. It takes a while to charge and it's hard to aim, but does serious damage.",
    buyCost: null,
    spriteCount: 1,
    weaponData: {
      chargeMethod: "mousedown",
      fireMethod: "mouseup",
      canBeDismounted: false,
      type: "laser",
      power: 1,
      damagePerCharge: 1,
      chargesMax: 4,
      charges: 0,
      chargeCurrent: 0,
      charging: false,
      chargeDurationMS: 1000,
      previousDamage: 0,
      weaponOrigin: {x: 80, y: 0},
      sprites: [],
      prefireSprites: [],
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        this.charging = true
        this.generateLaserPrefireSprites()
      },
      onmouseup(event) {
        this.charging = false
        if(this.ready)
          this.fire()
        this.destroyLaserPrefireSprites()
      },
      onclick(event) {
        
      },
      onwheel(event) {
        
      },
      fire() {
        this.ready = false
        let laserDamage = this.charges * this.damagePerCharge
        this.previousDamage = laserDamage

        this.charges = 0
        this.chargeCurrent = 0
        
        this.line = new Line(
          this.getWeaponFireOrigin(),
          this.getWeaponFireOrigin().add(Vector.fromAngle(this.gameObject.transform.rotation).mult(100000))
        )
        this.line.endPoint.sub(this.line.startPoint).mult(50)

        let targets = []
        let laserDistance
        this.gameObject.gameWorld.gameObjects.gameObject.forEach(obj => {
          if(!obj.hitbox) return
          if(!obj.rigidbody) return
          if(obj === this.gameObject) return
          if(obj instanceof Interactable) return
          
          if(Collision.auto(obj.hitbox, this.line))
            targets.push(obj)
        })
        if(targets.length) {
          let closest = GameObject.closest(this.gameObject, ...targets)
          let protoCollisionEvent = {impactSpeed: 100000, impactDamage: laserDamage}
          this.createHitParticles(closest, laserDamage)
          closest.sprite.container.filters = [filters.laserHit]
          setTimeout(() => {
            if(closest.destroyed) return
            closest.sprite.container.filters = []
          }, 250)
          closest.handleImpact(protoCollisionEvent)
          laserDistance = GameObject.distance(this.gameObject, closest)
        }
        this.generateLaserSprite(laserDistance, laserDamage)
        this.createFireParticles(laserDamage)
        this.gameObject.gameWorld.camera.shake(1 + laserDamage / 8)
        this.pushGameObject(Vector.fromAngle(this.gameObject.transform.rotation).invert().mult(25 * laserDamage))
        AudioManager.playSFX("plasmaWeaponFire")
      },
      pushGameObject(pushVector) {
        this.gameObject.transform.velocity.add(pushVector)
      },
      createHitParticles(target, laserDamage) {
        let count = Random.int(Math.ceil(laserDamage / 1.5), Math.ceil(laserDamage / 1.5) * 1.5)
        let spawnAttempts = 0
        let successfulSpawns = 0
        for(let i = 0; i < count; i++) {
          spawnAttempts++
          if(spawnAttempts > 50) break

          let position = target.transform.position.clone()
          if(i > 0) 
            position.add(new Vector(...Random.intArray(-120, 120, 2))) 
          if(!Collision.auto(position, target.hitbox)) {
            i--
            continue
          }
          let velocity = new Vector()
          let rotation = Random.rotation()
          let particle = GameObject.create(
            "particle", 
            "laserHit", 
            {transform: new Transform(position, velocity, rotation)}, 
            {world: target.gameWorld}
          )
          particle.sprite.container.scale.set(Random.decimal(0.4 + laserDamage / 8, 0.9 + laserDamage / 8, 1))
          successfulSpawns++
        }
      },
      createFireParticles(laserDamage) {
        let position = this.getWeaponFireOrigin()
        let rotation = Random.rotation()
        let particle = GameObject.create(
          "particle", 
          "laserHit", 
          {transform: new Transform(position, undefined, rotation)}, 
          {world: this.gameObject.gameWorld}
        )
        particle.sprite.container.scale.set(Random.decimal(0.4 + laserDamage / 8, 0.9 + laserDamage / 8, 1))
      },
      getWeaponFireOrigin() {
        let weaponOffsetVector = new Vector(this.weaponOrigin.x, this.weaponOrigin.y).rotate(this.gameObject.transform.rotation)
        return this.gameObject.transform.position.clone().add(weaponOffsetVector)
      },
      generateLaserSprite(distance = 2000, brightnessMultiplier) {
        this.destroyLaserSprite()
        let spriteSize = 64
        let angle = this.line.angle
        let offsetVector = Vector.fromAngle(angle).mult(spriteSize)
        let startingPosition = this.getWeaponFireOrigin()
        let iterationCount = Math.floor(distance / spriteSize)
        let filter = new PIXI.filters.ColorMatrixFilter()
            filter.brightness(0.9 + brightnessMultiplier/10)

        for(let i = 0; i < iterationCount; i++) {
          let position = startingPosition.clone().add(offsetVector.clone().mult(i))
          let sprite
          if(i === iterationCount - 1)
            sprite = new PIXI.Sprite.from(`assets/weaponFX/laserFireThickCap000${Random.int(0, 1)}.png`)
          else
            sprite = new PIXI.Sprite.from(`assets/weaponFX/laserFireThick000${Random.int(0, 3)}.png`)
          sprite.anchor.set(0.5)
          sprite.position.set(position.x, position.y)
          sprite.rotation = angle
          sprite.filters = [filter]

          if(Random.bool() && i < iterationCount - 1)
            sprite.rotation += PI
          
          this.gameObject.gameWorld.layers.overlays.addChild(sprite)
          this.sprites.push(sprite)
        }
      },
      destroyLaserSprite() {
        this.sprites.forEach(sprite => this.gameObject.gameWorld.layers.overlays.removeChild(sprite))
        this.sprites = []
      },
      updateWeaponSprite() {
        this.gameObject.sprite.laserChargeProgress.gotoAndStop(this.charges)
      },
      updateLaserSprite() {
        if(this.charging)
          this.updateLaserPrefireSprites()
        if(this.sprites)
          this.updateLaserFireSprite()
      },
      updateLaserFireSprite() {
        for(let sprite of this.sprites) {
          sprite.alpha -= (2 - this.previousDamage/(this.damagePerCharge * this.chargesMax + 1)) * dt
          if(sprite.alpha <= 0) {
            this.destroyLaserSprite()
            break
          }
        }
      },
      destroyLaserPrefireSprites() {
        this.prefireSprites.forEach(sprite => this.gameObject.gameWorld.layers.overlays.removeChild(sprite))
        this.prefireSprites = []
      },
      generateLaserPrefireSprites() {
        this.destroyLaserPrefireSprites()

        let spriteSize = 64
        let angle = this.gameObject.transform.rotation
        let offsetVector = Vector.fromAngle(angle).mult(spriteSize)
        let startingPosition = this.getWeaponFireOrigin()

        for(let i = 0; i < 20; i++) {
          let position = startingPosition.clone().add(offsetVector.clone().mult(i))
          let sprite = new PIXI.Sprite.from(`assets/weaponFX/laserFirePrefire.png`)
              sprite.anchor.set(0.5)
              sprite.position.set(position.x + offsetVector.x / 2, position.y + offsetVector.y / 2)
              sprite.rotation = angle
          Random.bool() ? sprite.rotation += PI : null
          this.gameObject.gameWorld.layers.overlays.addChild(sprite)
          this.prefireSprites.push(sprite)
        }
      },
      updateLaserPrefireSprites() {
        let spriteSize = 64
        let angle = this.gameObject.transform.rotation + Random.float(-0.01 * (this.charges / this.chargesMax), 0.01 * (this.charges / this.chargesMax))
        let offsetVector = Vector.fromAngle(angle).mult(spriteSize)
        let startingPosition = this.getWeaponFireOrigin()
        let alpha = ((this.chargeCurrent / this.chargeDurationMS) / this.chargesMax) + this.charges / this.chargesMax + Random.float(-0.05, 0.05)

        this.prefireSprites.forEach((sprite, i) => {
          let position = startingPosition.clone().add(offsetVector.clone().mult(i))
          sprite.alpha = alpha
          sprite.rotation = angle
          sprite.position.set(position.x + offsetVector.x/2, position.y + offsetVector.y / 2)
        })
      },
      updateCharge() {
        if(this.charges === 0 && !this.charging) return
        if(this.charges === this.chargesMax && this.charging) return

        this.charging ? this.chargeCurrent += 1000 * dt : this.chargeCurrent -= 1000 * dt

        this.chargeCurrent = Math.max(0, this.chargeCurrent)

        if(this.chargeCurrent > this.chargeDurationMS) {
          this.charges++
          this.chargeCurrent = 0
        }
        else
        if(this.chargeCurrent <= 0) {
          this.charges--
          this.chargeCurrent = this.chargeDurationMS
        }

        this.charges > 0 ? this.ready = true : this.ready = false
      },
      updateSpecific() {
        if(!this.powered) return

        this.updateCharge()
        this.updateWeaponSprite()
        this.updateLaserSprite()
      },
      setup() {
        
      }
    }
  },
  debrisGun: {
    displayName: "Debris Gun",
    displayNameShort: "Debris",
    description: "A garbage weapon. Literally. Drains collected debris from ship's cargo to function.",
    buyCost: 60,
    spriteCount: 7,
    weaponData: {
      canBeDismounted: true,
      power: 1,
      type: "solid",
      projectile: "debris",
      chargeDurationMS: 3000, 
    },
    methods: {
      onkeydown(event) {

      },
      onkeyup(event) {
        
      },
      onmousemove(event) {
        
      },
      onmousedown(event) {
        if(this.ready)
          this.fire()
      },
      onmouseup(event) {
        
      },
      onclick(event) {

      },
      onwheel(event) {
        
      },
      fire() {
        let sprite = this.gameObject.sprite.weapons.children[this.slotIndex]
        if(sprite) {
          sprite.gotoAndPlay(2)
          sprite.onComplete = () => sprite.gotoAndStop(0)
        }
        let projectileOffset = new Vector(this.gameObject.weaponSlots[this.slotIndex].x, this.gameObject.weaponSlots[this.slotIndex].y,)
        .rotate(this.gameObject.transform.rotation)

        let basePosition = this.gameObject.transform.position.clone().add(projectileOffset)
        let projectileCount = Random.int(3, 7)
        let collisionGroup = uniqueIDString()

        for(let i = 0; i < projectileCount; i++) {
          if(!this.gameObject.cargo.removeItemByName("debris")) break

          let position = basePosition.clone()
          .add(
            new Vector(
              Random.int(-25, 25), 
              Random.int(-25, 25)
            )
          )
          let angleToShipTargetPosition = basePosition.angleTo(this.gameObject.targetPosition) + Random.float(-0.10, 0.10)
          let velocity = Vector.fromAngle(angleToShipTargetPosition)
          .mult(data.projectile[this.projectile].speed)
          .mult(Random.float(0.90, 1.05))
          let angularVelocity = Random.float(0, PI/2)
          let rotation = Random.float(0, TAU)

          GameObject.create(
            "projectile", 
            this.projectile,
            {
              transform: new Transform(
                position,
                velocity,
                rotation,
                angularVelocity,
              ),
              owner: this.gameObject,
              target: null,
              collisionGroup,
            },
            {
              world: this.gameObject.gameWorld
            }
          )
        }
        this.ready = false
        this.timers.recharge.start()
        AudioManager.playSFX("rocketWeaponFire")
      },
      recharge() {
        this.ready = true
        this.gameObject.sprite.weapons.children[this.slotIndex]?.gotoAndStop(1)
      },
      updateSpecific() {
        if(!this.powered) return

        this.timers.update()
      },
      setup() {
        this.timers = new Timer(
          ["recharge", this.chargeDurationMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}]
        )
      }
    }
  }
}

data.ship = {}

data.ship["theGrandMoth"] = {
  displayName: "The Grand Moth",
  designation: "cruiser",
  hitbox: {
    type: "polygonHitbox",
    filename: "theGrandMoth",
    definition: null,
  },
  weaponSlots: [
    { x: 55, y: -45 },
    { x: 55, y: 45 },
    { x: 0, y: -75 },
    { x: 0, y: 75 },
  ],
  mass: 55,
  systems: [
    "boosters",
    "brakes",
    "cargo",
    "engine",
    "shields",
    "stealth",
    "weapons",
    "coater",
  ],
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    rechargeTime: 500,
    strength: 750,
    onupgrade: {
      acceleration: 0.5,
    },
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,
    strength: 100,
    auto: true,
  },
  cargo: {
    capacity: 50,
    items: [],
  },
  engine: {
    angularVelocity: (135 * PI) / 180,
    glideReduction: 0.07,
    acceleration: 8,
    maxSpeed: 400,
    skipRechargeTime: 2800,
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    onupgrade: {
      angularVelocity: (10 * PI) / 180,
      glideReduction: 0.01,
      acceleration: 1,
      maxSpeed: 40,
    },
  },
  hull: {
    level: 15,
    levelMax: 20,
    current: 15,
    impactResistance: 100,
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "pulse",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      distance: 250,
      pulseStrength: 1000,
      arcLength: PI/2, 
      rechargeTimeMS: 1800,
    }
  },
  skip: {},
  stealth: {
    type: "visualCloak",
  },
  coater: {
    layersMax: 2
  },
  weapons: {
    slots: 4,
    power: 0,
    weapons: [
      "missileHelios",
      // "plasmaCannonI",
      // "trapMissile",
      // "debrisGun",
    ],
  },
  wreck: {
    count: 6,
    hitboxVaultName: "theGrandMoth",
  },
}
data.ship["waspFighter"] = {
  displayName: "Wasp Fighter I",
  designation: "fighter",
  hitbox: {
    type: "polygonHitbox",
    filename: "waspFighter",
    definition: null,
  },
  weaponSlots: [
    { x: 80, y:  0 },
    { x: 38, y: -32 },
    { x: 38, y:  32 },
  ],
  mass: 35,
  systems: [
    "boosters",
    "brakes",
    "cargo",
    "engine",
    "shields",
    "stealth",
    "weapons",
  ],
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    strength: 400,
    onupgrade: {
      strength: 0.5,
    },
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,
    strength: 75,
    auto: true,
  },
  cargo: {
    capacity: 20,
    items: [],
  },
  engine: {
    angularVelocity: (90 * PI) / 180,
    glideReduction: 0.03,
    acceleration: 8,
    maxSpeed: 650,
    skipRechargeTime: 3500,
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    onupgrade: {
      angularVelocity: (6 * PI) / 180,
      glideReduction: 0.01,
      acceleration: 1,
      maxSpeed: 40,
    },
  },
  hull: {
    level: 8,
    levelMax: 20,
    current: 12,
    impactResistance: 80,
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "hardLight",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      disposition: "front",
      distance: 250,
    }
  },
  skip: {},
  stealth: {
    type: "visualCloak",
  },
  weapons: {
    slots: 3,
    power: 0,
    weapons: [
      "waspLaserFront",
      "trapMissile",
      "plasmaCannonI",
    ],
  },
  wreck: {
    count: 6,
    hitboxVaultName: "waspFighter"
  }
}
data.ship["waspFighterII"] = {
  displayName: "Wasp Fighter II",
  designation: "fighter",
  hitbox: {
    type: "polygonHitbox",
    filename: "waspFighterII",
    definition: null,
  },
  weaponSlots: [
    { x: 25, y: -54 },
    { x: 25, y:  54 },
  ],
  mass: 35,
  systems: [
    "boosters",
    "brakes",
    "cargo",
    "engine",
    "shields",
    "stealth",
    "weapons",
  ],
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    strength: 400,
    onupgrade: {
      strength: 0.5,
    },
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,
    strength: 75,
    auto: true,
  },
  cargo: {
    capacity: 20,
    items: [],
  },
  engine: {
    angularVelocity: (90 * PI) / 180,
    glideReduction: 0.03,
    acceleration: 8,
    maxSpeed: 650,
    skipRechargeTime: 3500,
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,

    onupgrade: {
      angularVelocity: (6 * PI) / 180,
      glideReduction: 0.01,
      acceleration: 1,
      maxSpeed: 40,
    },
  },
  hull: {
    level: 10,
    levelMax: 20,
    current: 12,
    impactResistance: 150,
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "hardLight",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      disposition: "front",
      distance: 250,
    }
  },
  skip: {},
  stealth: {
    type: "visualCloak",
  },
  weapons: {
    slots: 4,
    power: 0,
    weapons: [
      "plasmaCannonI",
      "plasmaCannonI",
    ],
  },
  wreck: {
    count: 6,
    hitboxVaultName: "waspFighter"
  }
}
data.ship["starBee"] = {
  displayName: "Star Bee",
  designation: "scout",
  hitbox: {
    type: "polygonHitbox",
    filename: "starBee",
    definition: null,
  },
  weaponSlots: [
    { x: 32, y: 23 },
    { x: 32, y: -23 },
  ],
  mass: 35,
  systems: [
    "cargo",
    "engine",
    "brakes",
  ],
  boosters: {
    type: "continuous",
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    strength: 400,
    onupgrade: {
      strength: 0.5,
    },
  },
  brakes: {
    level: 3,
    levelMax: 4,
    power: 0,
    strength: 75,
    auto: true,
  },
  cargo: {
    capacity: 20,
    items: [],
  },
  engine: {
    angularVelocity: (90 * PI) / 180,
    glideReduction: 0.03,
    acceleration: 8,
    maxSpeed: 360,
    skipRechargeTime: 3500,
    level: 1,
    levelMax: 5,
    power: 0,
    powerMax: 5,
    onupgrade: {
      angularVelocity: (6 * PI) / 180,
      glideReduction: 0.01,
      acceleration: 1,
      maxSpeed: 40,
    },
  },
  hull: {
    level: 6,
    levelMax: 20,
    current: 12,
    impactResistance: 60,
  },
  reactor: {
    power: 20,
    powerFree: 20,
    powerMax: 40,
    powerDistribution: [],
  },
  shields: {
    type: "hardLight",
    level: 1,
    levelMax: 5,
    power: 0,
    shieldData: {
      disposition: "front",
      distance: 250,
    }
  },
  skip: {},
  stealth: {
    type: "visualCloak",
  },
  weapons: {
    slots: 2,
    weapons: [
      "plasmaCannonI",
      "plasmaCannonI",
    ]
  },
  wreck: {
    count: 6,
    hitboxVaultName: "waspFighter"
  }
}
data.asteroid = {
  small0: {
    mass: 10, 
    health: 1,
    material: "rock",
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 20
      }
    }
  },
  small1: {
    mass: 10, 
    health: 1,
    material: "rock",
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 25
      }
    }
  },
  small2: {
    mass: 4, 
    health: 1,
    material: "rock",
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 11
      }
    }
  },
  small3: {
    mass: 6, 
    health: 1,
    material: "rock",
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 12
      }
    }
  },
  medium0: {
    mass: 50, 
    health: 2,
    material: "rock",
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 45
      }
    }
  },
  medium1: {
    mass: 50, 
    health: 3,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidMedium1",
      definition: null,
    }
  },
  medium2: {
    mass: 50, 
    health: 3,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidMedium2",
      definition: null,
    }
  },
  large0: {
    mass: 120, 
    health: 7,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidLarge0",
      definition: null,
    }
  },
  large1: {
    mass: 120, 
    health: 7,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidLarge1",
      definition: null,
    }
  },
  copperLarge0: {
    mass: 220, 
    health: 9,
    material: "copper",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidCopperLarge0",
      definition: null,
    }
  },
  copperMedium0: {
    mass: 50, 
    health: 4,
    material: "copper",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidCopperMedium0",
      definition: null,
    }
  },
  copperMedium1: {
    mass: 50, 
    health: 4,
    material: "copper",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidCopperMedium1",
      definition: null,
    }
  },
  clayLarge0: {
    mass: 110, 
    health: 6,
    material: "clay",
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 88,
      },
    }
  },
  clayMedium0: {
    mass: 50, 
    health: 3,
    material: "clay",
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 50,
      },
    }
  },
  clayMedium1: {
    mass: 50, 
    health: 3,
    material: "clay",
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 50,
      },
    }
  },
  overgrownMedium0: {
    mass: 200, 
    health: 5,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidOvergrownMedium0",
      definition: null
    }
  },
  overgrownMedium1: {
    mass: 200, 
    health: 5,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidOvergrownMedium1",
      definition: null
    }
  },
  overgrownLarge0: {
    mass: 200,
    health: 16,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidOvergrownLarge0",
      definition: null
    }
  },
  overgrownLarge1: {
    mass: 128, 
    health: 12,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidOvergrownLarge1",
      definition: null
    }
  },
  overgrownLarge2: {
    mass: 128, 
    health: 10,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidOvergrownLarge2",
      definition: null
    }
  },
  overgrownLarge3: {
    mass: 128, 
    health: 10,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidOvergrownLarge3",
      definition: null
    }
  },
  overgrownLarge4: {
    mass: 128, 
    health: 10,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidOvergrownLarge4",
      definition: null
    }
  },
  overgrownLarge5: {
    mass: 128, 
    health: 10,
    material: "rock",
    hitbox: {
      type: "polygonHitbox",
      filename: "asteroidOvergrownLarge5",
      definition: null
    }
  },
}
data.camera = {
  camera: {
    
  }
}
data.debris = {
  debris0: {
    mass: 5, 
    health: 1,
    scrappable: true,
    debrisYield: {min: 15, max: 20},
    material: "iron",
    hitbox: {
      type: "polygonHitbox",
      filename: "debris0",
      definition: null
    }
  },
  debris1: {
    mass: 15, 
    health: 1,
    scrappable: true,
    debrisYield: {min: 10, max: 20},
    material: "iron",
    hitbox: {
      type: "polygonHitbox",
      filename: "debris1",
      definition: null
    }
  },
  debris2: {
    mass: 15, 
    health: 1,
    scrappable: true,
    debrisYield: {min: 10, max: 20},
    material: "iron",
    hitbox: {
      type: "polygonHitbox",
      filename: "debris2",
      definition: null
    }
  },
  debris3: {
    mass: 15, 
    health: 1,
    scrappable: true,
    debrisYield: {min: 10, max: 20},
    material: "iron",
    hitbox: {
      type: "polygonHitbox",
      filename: "debris3",
      definition: null
    }
  },
  debris4: {
    mass: 15, 
    health: 1,
    scrappable: true,
    debrisYield: {min: 10, max: 20},
    material: "iron",
    hitbox: {
      type: "polygonHitbox",
      filename: "debris4",
      definition: null
    }
  },
  crimsonFighterWreck: {
    mass: 120, 
    health: 8,
    scrappable: false,
    material: "iron",
    hitbox: {
      type: "polygonHitbox",
      filename: "crimsonFighterWreck",
      definition: null
    }
  },
  hiveBattleshipWreck: {
    mass: 360, 
    health: 12,
    scrappable: false,
    material: "iron",
    hitbox: {
      type: "polygonHitbox",
      filename: "hiveBattleshipWreck",
      definition: null
    }
  },
  hiveFreighterWreck: {
    mass: 3000, 
    health: 100,
    scrappable: false,
    material: "iron",
    hitbox: {
      type: "polygonHitbox",
      filename: "hiveFreighterWreck",
      definition: null
    }
  },
}
data.station = {
  crownDockingStationLarge: {
    displayName: "Crown Service Station St. Francis",
    type: "repair",
    mass: 100000,
    dockingPoints: [{x: 150, y: 12}],
    hitbox: {
      type: "polygonHitbox",
      filename: "crownDockingStationLarge",
      definition: null,
    },
    wares: {weapons: [], systems: [], misc: []},
  },
  introDepotStation: {
    displayName: "Crown Depot Station",
    type: "repair",
    mass: 4500,
    dockingPoints: [{x: 266, y: 0}],
    hitbox: {
      type: "polygonHitbox",
      filename: "introDepotStation",
      definition: null,
    },
    wares: {
      weapons: [
        {name: "missileHelios"},
        {name: "trapMissile"},
        {name: "debrisGun"},
        {name: "plasmaChain"},
        {name: "plasmaCannonI"},
        {name: "plasmaCannonII"},
      ],
      systems: [
        {name: "forceFieldShields"}
      ],
      misc: [
        {name: "electronicsShipment"}
      ]
    },
  },
  crownOrbitalHive: {
    displayName: "Hive City",
    type: "civilian",
    mass: 8000,
    dockingPoints: [],
    hitbox: {
      type: "polygonHitbox",
      filename: "crownOrbitalHive",
      definition: null,
    },
    wares: {
      weapons: [],
      systems: [],
      misc: [],
    },
  },
}

data.satellite = {
  weatherSatelliteSmall: {
    displayName: "Small Weather Satellite",
    hitbox: {
      type: "polygonHitbox",
      filename: "weatherSatelliteSmall",
      definition: null,
    },
    systems: [
      "cargo"
    ],
    mass: 20,
    health: 3,
    cargo: {
      capacity: 50,
      items: [
        "microchipX1"
      ],
    },
    wreck: {
      count: 5,
      hitboxVaultName: "weatherSatelliteSmall",
    },
  }
}
data.starSystem = {
  kalatusI: {
    displayName: "Kalatus I",
    planets: [
      {
        name:         "Kaeso",
        description:  "Small terrestrial world. This planet is the central hub and home of Crown's government and fleet. The Royal Palace can be found here in the capital city Claritas."
      },
      {
        name: "Unnamed"
      },
      {
        name: "Unnamed"
      },
      {
        name: "Unnamed"
      },
      {
        name: "Unnamed"
      },
      {
        name: "Unnamed"
      },
      {
        name: "Unnamed"
      },
      {
        name: "Unnamed"
      },
    ]
  },
  kreos: {
    displayName: "Kreos",
    planets: [
      {
        name:         "Mantu",
        description:  "Desolate planet with little to no life. Rocky terrain and heavy dust storms make this the perfect place for pirate outposts."
      },
      {
        name: "Moraz"
      },
      {
        name: "Howe"
      },
      {
        name: "Squre"
      },
      {
        name: "Andson"
      },
    ]
  },
  neptum: {
    displayName: "Neptum",
    planets: [
      {
        name: "XY"
      },
      {
        name: "α"
      },
      {
        name: "XY"
      },
      {
        name: "XY"
      },
    ]
  },
  kalatusII: {
    displayName: "Kalatus II",
    planets: [
      {
        name: "Lavron"
      },
      {
        name: "Vultum"
      },
    ]
  },
  fria: {
    displayName: "Fria",
    planets: [
      {
        name: "Dria"
      },
      {
        name: "Mia"
      },
    ]
  },
  fernet: {
    displayName: "Fernet",
    planets: [
      {
        name: "Bozkov"
      },
      {
        name: "Becher"
      },
    ]
  },
  birm: {
    displayName: "Birm",
    planets: [
      {
        name: "Briosk"
      },
      {
        name: "Baramont"
      },
    ]
  },
  finnsi: {
    displayName: "Finnsi",
    planets: [
      {
        name: "Unnamed"
      },
      {
        name: "Unnamed"
      },
    ]
  },
}
data.mapImage = {
  mapBackground: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebula0: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebula1: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebula2: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebula3: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebula4: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebula5: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebula6: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebula7: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebula8: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebula9: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    }  
  },
  nebulaPurpleFull: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  nebulaMagentaFull: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  nebulaPurple2Full: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  nebulaBlueFull: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  nebulaBlue0: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  nebulaBlue1: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  nebulaBlue2: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  nebulaBlue3: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  nebulaBlue4: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  nebulaBlue5: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  bgFog1: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  bgStars1: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  asteroids1: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  asteroids2: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  asteroids3: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  asteroids4: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
  questOverlay_theLostPrincess_searchRadius: {
    hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 50,
        b: 50
      }
    } 
  },
}
data.mapIcon = {
  connected: {
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 30
      }
    }
  },
  outback: {
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 30
      }
    }
  },
}
data.projectile = {
  missileHelios: {
    speed: 500,
    mass: 6,
    impactDamage: 3,
    life: 30000,
    effects: [
      {
        type: "fire",
        chance: 0.5,
      }
    ],
    hitbox: {
      type: "polygonHitbox",
      filename: "projectileMissileHelios",
      definition: null
    },
    projectileData: {
      onHit: "explode",
      explosionSize: 500,
    }
  },
  debris: {
    speed: 550,
    mass: 8,
    impactDamage: 1,
    life: 30000,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 16,
      }
    },
    projectileData: {
      onHit: "dieAndCreateParticles",
      particleName: "debris",
    }
  },
  waspLaserFront: {

  },
  plasmaShotI: {
    speed: 680,
    mass: 2.5,
    impactDamage: 1,
    life: 10000,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 9,
      }
    },    
    projectileData: {
      onHit: "plasmaExplode",
    }
  },
  fireball: {
    speed: 440,
    mass: 5,
    impactDamage: 2,
    life: 12000, 
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 9,
      }
    },    
    mass: 1,
  },
  blackhole: {
    speed: 320,
    mass: 1000000,
    impactDamage: 3,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 7,
      }
    },    
    life: 12000, 
  },
  trapMissile: {
    speed: 820,
    mass: 2,
    impactDamage: 0,
    hitbox: {
      type: "circle",
      filename: null,
      definition: {
        radius: 8,
      }
    },    
    life: 10000,
    projectileData: {
      onHit: "trapTarget",
    }
  }
}
data.ultraportBeacon = {
  default: {
    hitbox: {
      type: "polygonHitbox",
      filename: "ultraportBeaconDefault",
      // filename: "interactableAsteroidWall",
      definition: null,
    }
  }
}

data.hintGraphic = {
  rotateShip: {
    loopSprite: false,
    autoplaySprite: true,
    deleteAfterPlay: false,
  },
  moveShip: {
    loopSprite: false,
    autoplaySprite: true,
    deleteAfterPlay: false,
  },
  shipMovement: {
    loopSprite: false,
    autoplaySprite: true,
    deleteAfterPlay: false,
  },
  skipRecharge: {
    loopSprite: false,
    autoplaySprite: true,
    deleteAfterPlay: false,
  },
}
data.explosion = {
  default: {
    strength: 3000,
    effectRadius: 256,
  },
  plasma: {
    strength: 800,
    effectRadius: 50
  }
}
data.particle = {
  theGrandMothHullDamage: {
    destroyAfterPlay: true
  },
  waspFighterHullDamage: {
    destroyAfterPlay: true
  },
  waspFighterIIHullDamage: {
    destroyAfterPlay: true
  },
  starBeeHullDamage: {
    destroyAfterPlay: true
  },
  laserHit: {
    destroyAfterPlay: true
  },
  debris: {
    destroyAfterPlay: true
  },
  asteroidRock: {
    destroyAfterPlay: true
  },
  asteroidClay: {
    destroyAfterPlay: true
  },
  asteroidCopper: {
    destroyAfterPlay: true
  },
  explosionHit: {
    destroyAfterPlay: true
  },
}
data.gameOverlay = {
  movementTrap: {
    overlayType: "statusEffectIndicator",
    onSetup: "addStatusEffectToParent",
    statusEffectName: "movementTrap",
    refreshSpriteFrequencyMS: 1000,
    effectDurationMS: 5000,
    onFinishPlaying: "destroyOverlay"
  },
  overlayOpenStationMenu: {
    overlayType: "gameContextMenu",
    onFinishPlaying: ""
  },
  overlayOpenMap: {
    overlayType: "gameContextMenu",
    onFinishPlaying: ""
  },
  overlayOpenMapAndUseKey: {
    overlayType: "gameContextMenu",
    onFinishPlaying: ""
  },
  overlayDockIntoStation: {
    overlayType: "gameContextMenu",
    onFinishPlaying: ""
  },
  targetSmall: {
    overlayType: "gameOverlay",
    onFinishPlaying: ""
  },
  scrapDebris: {
    overlayType: "gameOverlay",
    onFinishPlaying: ""
  },
  weaponSelect: {
    overlayType: "gameOverlay",
    refreshSpriteFrequencyMS: 1000 / 24,
    onFinishPlaying: "destroyOverlay",
    onFinishPlayingDelayMS: 200,
  },
  weaponNotCharged: {
    overlayType: "gameOverlay",
    refreshSpriteFrequencyMS: 1000 / 30,
    onFinishPlaying: "destroyOverlay",
  },
}
data.decoration = {
  empty: {},

  /* background asteroids */
  bgMedium0: {},
  bgMedium1: {},
  bgMedium2: {},
  bgMedium3: {},
  bgMedium4: {},
  bgMedium5: {},
  bgLarge0: {},
  bgLarge1: {},
  bgLarge2: {},
  bgLarge3: {},
  bgLarge4: {},

  /* small foreground asteroids */
  fgMedium0: {},
  fgMedium1: {},
  fgMedium2: {},
  fgMedium3: {},
  fgMedium4: {},
  fgMedium5: {},

  /* fog */
  largeFog0: {},
  largeFog1: {},
  largeFog2: {},
  largeFog3: {},
  largeFog4: {},
  mediumFog0: {},
  mediumFog1: {},
  mediumFog2: {},
  
  /* various */
  bgOvergrownMedium0: {},
  crownOrbitalHive: {},
  crownDockingStation: {},
  starBee: {},
  shipWreckTU: {},
  largeDebrisPlate: {},
};

data.statusEffect = {
  movementTrap: {
    durationMS: 5000,
  }
}
data.UIHintSequence = {
  inventory: {
    finished: false,
    hintSequence: [
      {
        parentElementId: "inventory-window",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 360, left: 0},
          allowPointerEvents: true,
        },
        title: "This is the Inventory.",
        text: 
        `It has three tabs: <b>Inventory, Station and Quests</b>. 
        Let's quickly go over them.
        <br>
        ~bind=forwardSequence~ <b>Continue</b>&nbsp;&nbsp;&nbsp;~bind=cancel~ <b>Cancel hint</b>.
        </b>
        `,
        actions: []
      },
      {
        parentElementId: "inventory-window",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 360, left: 0},
          allowPointerEvents: true,
        },
        title: "This tab contains the player inventory.",
        text: 
        `Here you can manage your ship's ~highlight=weapons~ and inspect or sell ~highlight=items~. 
        <br>
        ~highlight=Selling items is only available when docked in a station~.`,
        actions: [
          {
            actionName: "clickElement",
            elementId: "inventory-switch-inventory"
          }
        ]
      },
      {
        parentElementId: "inventory-window",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 360, left: 0},
          allowPointerEvents: true,
        },
        title: "This tab contains the station interface.",
        text: 
        `Here you can ~highlight=purchase~ things or ~highlight=upgrade~ your ship.
        <br>
        This tab is ~highlight=only accessible when you dock into a station~. If the icon is grayed out, it means it isn't available.
        `,
        actions: [
          {
            actionName: "clickElement",
            elementId: "inventory-switch-station"
          }
        ]
      },
      {
        parentElementId: "inventory-window",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 360, left: 0},
          allowPointerEvents: true,
        },
        title: "This tab contains the Journal.",
        text:
        `Inside you find info about your ~highlight=current quests~. 
        <br>
        When you start a new quest, a journal entry will be created for it.
        <br>
        Progressing on a quest will ~highlight=update its description~. You can check your journal anytime you're not sure what to do, and need a hint.
        `,
        actions: [
          {
            actionName: "clickElement",
            elementId: "inventory-switch-quest"
          }
        ]
      },
      {
        parentElementId: "inventory-window",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 360, left: 0},
          allowPointerEvents: true,
        },
        title: "Tour over",
        text:
        `That's it, now go buy some weapons.`,
        actions: [
          {
            actionName: "clickElement",
            elementId: "inventory-switch-station"
          }
        ]
      },
    ]
  },
  map: {
    finished: false,
    hintSequence: [
      {
        parentElementId: "world-map",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 200, left: 0},
          allowPointerEvents: true,
        },
        title: "~larger=This is the Galaxy map~",
        text: 
        `Here you can see the entire breadth of the game's world.
        <br>
        ~bind=forwardSequence~&nbsp;<b>Take tour</b>&nbsp;&nbsp;&nbsp;~bind=cancel~&nbsp;<b>Cancel tour</b>.
        `,
        actions: []
      },
      {
        parentElementId: "world-map",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 200, left: 0},
          allowPointerEvents: true,
        },
        title: "~larger=Territories~",
        text: 
        `The map is divided into ~highlight=territories~.
        <br>
        Each territory is controlled by a somewhat independent government.
        <br>
        You're free to travel all places marked by ~white=white~ icons, ~white=without spending fuel~.
        <br>
        All ~highlight=outback~ (orange) icons cost ~highlight=1 unit of heavy fuel~ to travel there.
        `,
        actions: []
      },
      {
        parentElementId: "map-legend-button",
        hintPlacement: "top",
        options: {
          useBackground: true,
          allowPointerEvents: true,
        },
        title: "~larger=Legend~",
        text: 
        `At last, you can view the ~highlight=map legend~ here if you need it.`,
        actions: [
          {
            actionName: "addClass",
            elementId:  "map-legend-button",
            classes: ["active"]
          },
        ]
      },
      {
        parentElementId: "world-map",
        hintPlacement: "center",
        options: {
          useBackground: true,
          attachmentOffset: {top: 200, left: 0},
          allowPointerEvents: true,
        },
        title: "~larger=That's all folks~",
        text: 
        `The map tour hours are over.`,
        actions: [
          {
            actionName: "removeClass",
            elementId:  "map-legend-button",
            classes: ["active"]
          },
        ]
      },
    ]
  }
}
data.quotes = [
  {
    authorRef: "bigT",
    text: "I am this flesh and the mind that lives within it. There is nothing more to me, no point in searching for a concrete definition of my selfhood."
  },
  {
    authorRef: "bigT",
    text: "I do not exist, but then, why does that bother me?"
  },
  {
    authorRef: "bigT",
    text: "There exist many things I could use to define myself by, but they're external. I am but a lonely island drifting uncontrollably through the matrix of events, occasionally meeting other lonely islands and waving at them."
  },
  {
    authorRef: "bigT",
    text: "Whenever you explore into the true unknown, there is danger. You can mitigate the danger at the same rate as you mitigate the exploration, but you can never be truly safe. True safety means standing still but dying the worst death - of the spirit."
  },
  {
    authorRef: "bigT",
    text: "To avoid danger, we tend to do one of two things - become dangerous ourselves, or avoid exploration. One isn't particularly healthy for the individual, and the other for society. We must strike a compromise."
  },
  {
    authorRef: "bigT",
    text: "People invest their time into the most meaningless things, just to satisfy a desire they let themselves be controlled by. True happiness comes from realizing all your dreams have been manufactured and rejecting them."
  },
  {
    authorRef: "bigT",
    text: "With time there will come understanding of the total futility of trying. If you have to try, you have already failed. To truly succeed means to accept the inevitability of failure prematurely. Then you can begin to see whether it's still worth pursuing your goal. Most times you will find it isn't, but you have nothing better to do."
  },
  {
    authorRef: "bigT",
    text: "With time there will come understanding of the total futility of trying. If you have to try, you have already failed."
  },
  {
    authorRef: "bigT",
    text: "People who put their trust in others to deliver their truths will taste the bitter price of their gullibility."
  },
  {
    authorRef: "king",
    text: "The past decisions of people you never knew will catch up with you."
  },
  {
    authorRef: "admiralBobocka",
    text: "A weak man may overpower a strong man, if he knows how to use his body. Same goes for ships, learn the ins and outs of your craft and you may take on entire fleets."
  },
]
const preferences = {
  allProjectilesDoSingularPointOfDamage: true
}
class StateMachine {
  constructor(gameObject) {
    this.gameObject = gameObject
    this.states = []
  }
  addState(state) {
    state.stateMachine = this
    state.gameObject = this.gameObject
    
    this.states.push(state)
    this.current || this.setState(state)
  }
  removeState(state) {
    state.stateMachine = null
    this.states.remove(state)
    this.setState(this.states.last())
  }
  setState(state) {
    this.current = state
  }
  setStateByName(name) {
    let state = this.states.find(s => s.name === name)
    if(state) this.setState(state)
  }
  update() {
    this.current.update()
  }
  destroy() {
    delete this.gameObject
  }
}
class StateObject {
  constructor(name) {
    this.name = name
  }
  assignMethods(methods) {
    this.methods = methods
  }
  update() {
    for(let method of this.methods) 
      method()
    if(this.timers)
      this.timers.update()  
  }
}
class Cutscene {
  constructor(name) {
    this.pagesLeft = []
    let firstPageOffset = 0
    let keys = Object.keys(Cutscene.scenes[name].pages)
    for(let i = firstPageOffset; i < keys.length; i++) {
      this.pagesLeft.push(Cutscene.scenes[name].pages[keys[i]])
    }
    this.currentPageIndex = -1 + firstPageOffset
    this.cutsceneName = name
    this.currentPage = null
    this.currentPanel = null
    this.currentElement = null
    this.finished = false
    this.finishedPage = false

    /* store the timeout that displays the cutscene window hint in this */
    this.hintTimeout = null

    /* this is used to fast forward the start of an animation of the next element when set to a non-null value */
    this.nextHold = null
  }
  begin() {
    this.nextPage()
    return this
  }
  finishPage() {
    this.finishedPage = true
    let hintType = this.currentPageIndex === 0 ? "full" : "mouse"
    if(this.pagesLeft.length == 0)
      this.finished = true
    this.hintTimeout = setTimeout(() => cutsceneWindow.showHint(hintType), 1500)
  }
  replayPage() {
    
  }
  nextPage() {
    this.finishedPage = false
    cutsceneWindow.hideHint()
    window.clearTimeout(this.hintTimeout)
    this.currentPage = this.pagesLeft.shift()
    this.fadeScene()
    this.currentPageIndex++
  }
  nextPanel() {
    this.currentPanel = this.currentPage.panels.shift()
    if(!this.currentPanel) {
      this.finishPage()
      return
    }
    setTimeout(()=> {
      this.nextElement()
    }, Cutscene.defaultHold)

    /* reset the nextHold so that elements of the next panel animate normally */
    this.nextHold = null
  }
  nextElement() {
    this.currentElement = this.currentPanel.elements.shift()
    if(!this.currentElement) 
      return this.nextPanel()

    let 
    image = new Image()
    image.src = Cutscene.folder + this.cutsceneName + "/page" + this.currentPageIndex + "/" + this.currentElement.src + Cutscene.fileExtension
    image.classList.add("cutscene-element")
    image.style.zIndex = this.currentElement.z ?? 0
    
    this.animateElement(image)
    cutsceneWindow.element.append(image)

    let hold
    if(this.currentElement.hold === "auto") 
      hold = this.currentElement.animation?.duration 
    else 
      hold = this.currentElement.hold ?? Cutscene.defaultHold
    
    setTimeout(() => {
      this.nextElement()
    }, this.nextHold ?? hold * Cutscene.timeStretch)
  }
  nextTextElement() {
    let text = El("div", "cutscene-text-element")
    text.style.left = this.currentElement.position.x + "px"
    text.style.top =  this.currentElement.position.y + "px"
  }
  animateElement(imageElement) {
    let animData = {}
    animData.duration   = (this.currentElement.animation?.duration   ?? Cutscene.defaultAnimation.duration) * Cutscene.timeStretch
    animData.easing     = (this.currentElement.animation?.easing     ?? Cutscene.defaultAnimation.easing)
    animData.translate  = (this.currentElement.animation?.translate  ?? Cutscene.defaultAnimation.translate)

    imageElement.animate([
      {
        transform: `translateX(${animData.translate.x}px) translateY(${animData.translate.y}px)`,
        filter: "opacity(0)",
      },{
        transform: `translateX(0px) translateY(0px)`,
        filter: "opacity(1)",
      },
    ], {
      duration: animData.duration,
      easing: animData.easing,
    })
  }
  fadeScene() {
    cutsceneWindow.element.animate([
      {filter: "opacity(1)", filter: "opacity(0)"}
    ], {duration: Cutscene.pageFadeTime})
    .onfinish = () => {
      this.clearElements()
      this.nextPanel()
      cutsceneWindow.element.style.filter = ""
    }
  }
  clearElements() {
    Qa(".cutscene-element").forEach(element => element.remove())
  }

  static folder = "assets/cutscene/"
  static fileExtension = ".png"
  static defaultHold = 200 //default amount of time that an element sits before the next one starts animating
  static pageFadeTime = 1200
  static timeStretch = 1
  static defaultAnimation = {
    duration: 900, 
    easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
    translate: {x: -25, y: 0},
  }
  static async preloadScenes() {
    let sources = []
    for(let scene in this.scenes) {
      for(let page in this.scenes[scene].pages) {
        for(let panel of this.scenes[scene].pages[page].panels) {
          for(let element of panel.elements) {
            sources.push(`assets/cutscene/${scene}/${page}/${element.src}.png`)
          }
        }
      }
    }
    /* map all sources to promises and wait until an image is loaded */
    await Promise.all(sources.map(source => 
      new Promise(async resolve => {
        let img = new Image()
        img.src = source
        img.onload = resolve(img)
      })
    )).then(data => console.log("Cutscenes loaded."))
  }
}
class ImageSprite {
  constructor(startingFrameName, frameCount, position, options = {fps: 3, loop: false, fileExtension: "png", parentWindow: null}) {
    this.ready = false
    this.position = position ?? new Vector()

    this.currentFrame = null
    this.currentTimeMS = 0
    this.currentFrameNumber = 0
    this.frameCount = frameCount
    this.startingFrameName = startingFrameName

    this.stepSizeMS = 1000 / (options.fps ?? 3)
    this.loop =               options.loop ?? false
    this.fileExtension =      options.fileExtension ?? "png"
    this.parentWindow =       options.parentWindow ?? console.error("No parent element supplied")
    this.createFrames(startingFrameName, frameCount)
    this.parentWindow.imageSprites.push(this)
  }
  createFrames() {
    this.frames = []
    for(let i = 0; i < this.frameCount; i++) {
      let frame = new Image()
      frame.style.zIndex = 1000
      frame.src = `${this.startingFrameName}000${i}.${this.fileExtension ?? "png"}`
      frame.classList.add("cutscene-element")
      frame.onload = () => this.registerFrame(frame)
    }
  }
  registerFrame(frame) {
    this.frames.push(frame)
    if(this.frames.length === this.frameCount) {
      this.ready = true
      this.setFrame()
    }
  }
  setFrame(index) {
    if(this.currentFrame)
      this.currentFrame.replaceWith(this.frames[this.currentFrameNumber])
    else
      this.parentWindow.element.append(this.frames[index])

    this.currentFrame = this.frames[index]
    console.log("set frame", this.currentFrameNumber)
  }
  updateFrame() {
    if(this.destroyed) return

    let frameNumber = Math.floor(this.currentTimeMS / this.stepSizeMS)
    if(this.currentFrameNumber == frameNumber) return

    this.currentFrameNumber = frameNumber

    if(this.currentFrameNumber >= this.frameCount)
      return this.onComplete()
    else
      this.setFrame(frameNumber)
  }
  onComplete() {
    if(this.loop) {
      this.currentTimeMS = 0
      this.updateFrame()
    }
    else {
      this.destroy()
    }
  }
  update() {
    if(this.destroyed) return

    this.currentTimeMS += 1000 * cdt
    this.updateFrame()
  }
  destroy() {
    this.destroyed = true
    this.frames.forEach(f => f.remove())
    this.parentWindow.imageSprites.remove(this)
  }
}
class CutsceneWindow extends GameWindow {
  constructor() {
    super("CutsceneWindow", Q('#cutscene-window'))
    this.cutscene = null
    this.hint =       Q('#cutscene-window').querySelector(".cutscene-hint")
    this.hintFull =   Q('#cutscene-window').querySelector(".cutscene-skip-options.full")
    this.hintMouse =  Q('#cutscene-window').querySelector(".cutscene-skip-options.mouse")
    this.imageSprites = []
    this.tickId = null
  }
  show() {
    this.animationTick()
    this.element.classList.remove("hidden")
    this.element.animate([
      {
        filter: "opacity(0)"
      },
      {
        filter: "opacity(1)"          
      },
    ], {
      duration: 1000,
    })
    .onfinish = () => this.element.style.filter = ""
  }
  hide() {
    if(!this.active) {
      this.element.classList.add("hidden")
      return
    }
    this.animationTickStop()
    this.element.animate([
      {
        filter: "opacity(1)"
      },
      {
        filter: "opacity(0)"
      },
    ], {
      duration: 1000,
    })
    .onfinish = () => this.element.classList.add("hidden")
  }
  loadCutscene(name) {
    this.cutscene = new Cutscene(name)
    this.cutscene.begin()
    gameManager.setWindow(this)
    Qa(".cutscene-element").forEach(e => e.remove())
  }
  handleKeydown(e) {
    if(e.code === binds.skipCutscene)
      this.exit()
    else
    if(e.code === binds.replayPage)
      this.cutscene.replayPage()
    else
    if(this.cutscene && this.cutscene.finished)
      this.exit()
    else
    if(this.cutscene && this.cutscene.finishedPage)
      this.cutscene.nextPage()
  }
  handleMousedown(e) {
    if(this.cutscene && this.cutscene.finished)
      this.exit()
    else
    if(this.cutscene && this.cutscene.finishedPage)
      this.cutscene.nextPage()
    else
    if(this.cutscene)
      this.cutscene.nextHold = 100
  }
  exit() {
    this.hideHint()
    this.cutscene = null
    this.onexit()
  }
  onexit() {
    //custom method used by GameManager to attach some event to the eventual completion of the cutscene
  }
  showHint(type = "full" | "mouse") {
    this["hint" + type.capitalize()].classList.remove("hidden")
    this.hint.classList.remove("hidden")
  }
  hideHint() {
    this.hintFull.classList.add("hidden")
    this.hintMouse.classList.add("hidden")
    this.hint.classList.add("hidden")
  }
  update() {

  }
  animationTick() {
    let now = Date.now()
    cdt = (now - cLastTime ) / 1000
    cLastTime = now

    this.imageSprites.forEach(anim => anim.update())
    
    this.tickId = window.requestAnimationFrame(this.animationTick.bind(this))
  }
  animationTickStop() {
    window.cancelAnimationFrame(this.tickId)
  }
}
Cutscene.scenes = {
  intro: {
    name: "Game intro cutscene",
    pages: {
      page0: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
                hold: 1800,
                animation: {
                  duration: 1200, 
                  easing: "cubic-bezier(0.5, 0, 0.5, 1.0)",
                  translate: {x: 0, y: 0},
                },
              },
              {
                src: "panel0_element1",
                hold: "auto",
                animation: {
                  duration: 1800, 
                  easing: "cubic-bezier(0.5, 0, 0.5, 1.0)",
                  translate: {x: 0, y: 0},
                },
              },
              {
                src: "panel0_element2",
                hold: "auto",
                animation: {
                  duration: 1500, 
                  easing: "cubic-bezier(0.5, 0, 0.5, 1.0)",
                  translate: {x: 0, y: 0},
                },
              },
            ]
          }
        ]
      },
      page1: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
                hold: 750,
              },
              {
                src: "panel0_element1",
                hold: 300,
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 40},
                }
              },
              {
                src: "panel0_element2",
                hold: 1000,
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel0_element3",
                hold: 1200,
                animation: {
                  duration: 1200, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel0_element4",
                hold: 750,
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
              },
              {
                src: "panel1_element1",
                hold: 200,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel1_element2",
                hold: 1200,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel1_element3",
                animation: {
                  duration: 700, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel1_element4",
                hold: 500,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel1_element5",
                animation: {
                  duration: 1000, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
        ]
      },
      page2: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
              },
              {
                src: "panel0_element1",
                hold: 1000,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel0_element2",
                hold: 1200,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
              },
              {
                src: "panel1_element1",
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel1_element2",
                hold: 2500,
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel1_element3",
                hold: 1000,
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel2_element0",
                hold: 300,
              },
              {
                src: "panel2_element1",
                hold: 300,
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel2_element2",
                hold: 1500,
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel2_element3",
                hold: 300,
                animation: {
                  duration: 550, 
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel2_element4",
                hold: 300,
                animation: {
                  duration: 550, 
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel2_element5",
                hold: 1000,
                animation: {
                  duration: 650, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
        ]
      },
      page3: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
                z: 0,
                hold: 1600,
                animation: {
                  duration: 1200,
                }
              },
              {
                src: "panel0_element1",
                z: 1,
                hold: 600,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.5, 0, 0.5, 1.0)",
                  translate: {x: 0, y: 0},
                },
              },
              {
                src: "panel0_element3",
                z: 3,
                hold: 600,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.5, 0, 0.5, 1.0)",
                  translate: {x: 0, y: 0},
                },
              },
              {
                src: "panel0_element2",
                z: 2,
                hold: 1200,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.5, 0, 0.5, 1.0)",
                  translate: {x: 0, y: 0},
                },
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
                hold: 1000,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.5, 0, 0.5, 1.0)",
                  translate: {x: 0, y: 0},
                },
              },
              {
                src: "panel1_element1",
                hold: 500,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.5, 0, 0.5, 1.0)",
                  translate: {x: 0, y: 0},
                },
              },
              {
                src: "panel1_element2",
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.5, 0, 0.5, 1.0)",
                  translate: {x: 0, y: 0},
                },
              },
            ]
          },
        ]
      },
      page4: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
              },
              {
                src: "panel0_element1",
                hold: 750,
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 10},
                }
              },
              {
                src: "panel0_element2",
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
              },
              {
                src: "panel1_element1",
                hold: 200,
                animation: {
                  duration: 750, 
                  easing: "cubic-bezier(0.6, 0, 0.4, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel1_element2",
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel1_element3",
                hold: 800,
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel2_element0",
              },
              {
                src: "panel2_element1",
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel2_element2",
                animation: {
                  duration: 500, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0)",
                  translate: {x: -10, y: -5},
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel3_element0",
                hold: 1200
              },
              {
                src: "panel3_element1",
                hold: "auto",
                animation: {
                  duration: 700, 
                  easing: "cubic-bezier(0.50, 0, 0.50, 1.0)",
                  translate: {x: 10, y: 0},
                }
              },
              {
                src: "panel3_element2",
                animation: {
                  duration: 1500, 
                  easing: "cubic-bezier(0.35, 0, 0.35, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
        ]
      },
      page5: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
              },
              {
                src: "panel0_element1",
                animation: {
                  duration: 850, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0)",
                  translate: {x: 0, y: 10},
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
                z: 0,
              },
              {
                src: "panel1_element1",
                z: 2,
                hold: "auto",
                animation: {
                  duration: 1200, 
                  easing: "cubic-bezier(0.5, 0, 0.5, 1.0)",
                  translate: {x: -10, y: 10},
                }
              },
              {
                src: "panel1_element2",
                z: 1,
                hold: 500,
                animation: {
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel2_element0",
              },
              {
                src: "panel2_element1",
                hold: 1500,
                animation: {
                  duration: 1200, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
              {
                src: "panel2_element2",
                animation: {
                  duration: 1500, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0)",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
        ]
      },
      page6: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
                hold: 400,
              },
              {
                src: "panel0_element1",
                hold: 400,
                animation: {
                  translate: {x: -20, y: 0}
                }
              },
              {
                src: "panel0_element2",
                hold: 1000,
                animation: {
                  translate: {x: 10, y: 0}
                }
              },
              {
                src: "panel0_element3",
                animation: {
                  translate: {x:5, y: 0}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
                hold: 400,
              },
              {
                src: "panel1_element1",
                hold: 400,
                animation: {
                  translate: {x: -10, y: 0}
                }
              },
              {
                src: "panel1_element2",
                hold: 1000,
                animation: {
                  translate: {x: 10, y: 0}
                }
              },
              {
                src: "panel1_element3",
                hold: 400,
                animation: {
                  duration: 500,
                  translate: {x:10, y: 0}
                }
              },
              {
                src: "panel1_element4",
                animation: {
                  duration: 600,
                  easing: "ease-out",
                  translate: {x: 20, y: 0}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel2_element0",
              },
              {
                src: "panel2_element2",
                hold: 500,
                animation: {
                  duration: 1800,
                  translate: {x: 10, y: 0}
                }
              },
              {
                src: "panel2_element1",
                hold: 1500,
                animation: {
                  duration: 1200,
                  translate: {x: 0, y: 5}
                }
              },
              {
                src: "panel2_element3",
                hold: "auto",
                animation: {
                  duration: 1600,
                  translate: {x: 20, y: 0}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel3_element0",
                hold: 800,
                animation: {
                  duration: 1200,
                }
              },
              {
                src: "panel3_element1",
                hold: 500,
                animation: {
                  duration: 1600,
                  translate: {x:-15, y: 15}
                }
              },
              {
                src: "panel3_element2",
                hold: "auto",
                animation: {
                  duration: 1800,
                  translate: {x:0, y: 10}
                }
              },
            ]
          },
        ]
      },
      page7: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
              },
              {
                src: "panel0_element1",
                hold: 1500,
                animation: {
                  translate: {x: 0, y:20}
                }
              },
              {
                src: "panel0_element2",
                hold: 1800,
                animation: {
                  duration: 900, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
              },
              {
                src: "panel1_element1",
                hold: 1200,
                animation: {
                  duration: 1500
                }
              },
              {
                src: "panel1_element2",
                hold: 500,
                animation: {
                  duration: 900, 
                  easing: "cubic-bezier(0.25, 0, 0.75, 1.0",
                  translate: {x: 0, y: 0},
                }
              },
            ]
          },
        ]
      },
      page8: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
                
              },
              {
                src: "panel0_element1",
                animation: {
                  translate: {x: 0, y: 10}
                }
              },
              {
                src: "panel0_element2",
                animation: {
                  duration: 1200,
                  translate: {x: 0, y: -10}
                }
              },
              {
                src: "panel0_element3",
                hold: "auto",
                animation: {
                  duration: 1100,
                  translate: {x: -20, y: 0}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
                z: 0,
              },
              {
                src: "panel1_element1",
                z: 2,
                animation: {
                  translate: {x: 0, y: 15}
                }
              },
              {
                src: "panel1_element2",
                z: 1,
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
              {
                src: "panel1_element3",
                z: 2,
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel2_element0",
                z: 0,
              },
              {
                src: "panel2_element1",
                z: 2,
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
              {
                src: "panel2_element2",
                z: 1,
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
              {
                src: "panel2_element3",
                z: 2,
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel3_element0",
              },
              {
                src: "panel3_element1",
                animation: {
                  duration: 1500,
                  translate: {x: 0, y: -10}
                }
              },
              {
                src: "panel3_element2",
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
              {
                src: "panel3_element3",
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel4_element0",
              },
              {
                src: "panel4_element1",
                hold: "auto",
                animation: {
                  duration: 1200,
                  translate: {x: 0, y: 10}
                }
              },
              {
                src: "panel4_element2",
                hold: 1200,
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel5_element0",
              },
              {
                src: "panel5_element1",
                hold: 800,
                animation: {
                  duration: 1000,
                  translate: {x: 0, y: 10}
                }
              },
              {
                src: "panel5_element2",
                hold: 1500,
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
            ]
          },
        ]
      },
      page9: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
              },
              {
                src: "panel0_element1",
                animation: {
                  translate: {x: 0, y: 10}
                }
              },
              {
                src: "panel0_element2",
                hold: 1500,
                animation: {
                  translate: {x: 0, y: 10}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
              },
              {
                src: "panel1_element1",
              },
              {
                src: "panel1_element2",
                hold: 2000,
                animation: {
                  duration: 1000,
                  translate: {x: 0, y: 0}
                }
              },
              {
                src: "panel1_element3",
                hold: 1700,
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
              {
                src: "panel1_element4",
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
            ]
          },
        ]
      },
      page10: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
              },
              {
                src: "panel0_element1",
                hold: 1500,
                animation: {
                  translate: {x: -5, y: 0}
                }
              },
              {
                src: "panel0_element2",
                animation: {
                  hold: 1200,
                  duration: 1200,
                  translate: {x: 5, y: 0}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
              },
              {
                src: "panel1_element1",
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
              {
                src: "panel1_element2",
                hold: "auto",
                animation: {
                  duration: 1500,
                  translate: {x: -10, y: 0}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel2_element0",
              },
              {
                src: "panel2_element1",
                animation: {
                  translate: {x: 0, y: 5}
                }
              },
              {
                src: "panel2_element2",
                hold: 1100,
                animation: {
                  translate: {x: 0, y: -5}
                }
              },
            ]
          },
          {
            elements: [
              {
                src: "panel3_element0",
              },
              {
                src: "panel3_element1",
                hold: 1100,
                animation: {
                  duration: 850,
                  translate: {x: 0, y: 0}
                }
              },
              {
                src: "panel3_element2",
                hold: 1200,
                animation: {
                  translate: {x: 0, y: 0}
                }
              },
            ]
          },
        ]
      },
      page11: {
        panels: [
          {
            elements: [
              {
                src: "panel0_element0",
              },
              {
                src: "panel0_element1",
                animation: {translate: {x: 0, y: 0}}
              },
              {
                src: "panel0_element2",
                animation: {hold: 1200, duration: 1200, translate: {x: 5, y: 0}}
              },
              {
                src: "panel0_element3",
                animation: {hold: 1200, duration: 1200, translate: {x: 5, y: 0}}
              },
            ]
          },
          {
            elements: [
              {
                src: "panel1_element0",
              },
              {
                src: "panel1_element1",
                animation: {translate: {x: 0, y: 0}}
              },
              {
                src: "panel1_element2",
                hold: "auto",
                animation: {duration: 1500, translate: {x: -10, y: 0}}
              },
            ]
          },
          {
            elements: [
              {
                src: "panel2_element0",
              },
              {
                src: "panel2_element1",
                animation: {translate: {x: 0, y: 5}}
              },
              {
                src: "panel2_element2",
                hold: 1100,
                animation: {translate: {x: 0, y: -5}}
              },
            ]
          },
        ]
      },
    }
  }
}
class Interaction {
  constructor(type) {
    this.type = Interaction.types.findChild(type) ?? console.error("invalid interaction type")
    this.elements = {}
    this.createHTML()
  }
  createHTML() {
    /* these bubbles will be filled by the type-specific methods */
    this.bubbles = {
      small: null,
      big: null,
    }
    this.container = El("div", "interaction-bubble-wrapper")
    this[`create${this.type.capitalize()}HTML`]()
  }
  createHintHTML() {
    /* small bubble */    
    this.bubbles.small = El("div", "interaction-bubble-small")
    let icon = El("div", "interaction-bubble-icon icon-hint")

    /* big bubble */

  }
  createAudioCallHTML() {
    /* small bubble */    
    this.bubbles.small = El("div", "interaction-bubble-small")
    let icon = El("div", "interaction-bubble-icon icon-hint")
    
    /* big bubble */

  }
  createMessageHTML() {
    /* small bubble */      
    this.bubbles.small = El("div", "interaction-bubble-small")
    let icon = El("div", "interaction-bubble-icon icon-hint")

    /* big bubble */

  }
  dismiss() {
    this.onDismiss()
    this.destroy()
  }
  onDismiss() {
    //custom handler method
  }
  maximize() {
    
  }
  minimize() {

  }
  destroy() {
    for(let key in this.elements)
      this.elements[key].remove()
  }
  static types = [
    "hint",
    "audioCall",
    "message",
  ]
}
class Collision {
  //#region detect
  static testedObjects = []
  static detect(world) {
    if(world === game && !player.ship) return

    this.testedObjects = []
    let collisionEvents = []
    let interactionEvents = []

    for(let obj of world.gameObjects.gameObject) {
      if(!obj.rigidbody) 
        continue
      if(!obj.hitbox) 
        continue
      if(world === game && GameObject.distanceFast(obj, player.ship) > data.detectCollisionWithinThisFastDistanceOfPlayer) 
        continue
      if(!obj.canCollide) 
        continue

      let others = Collision.broadphase(world, obj, {exclude: [Interactable]})
      for(let other of others) {
        if(!other.rigidbody) 
          continue
        if(world === game && GameObject.distanceFast(other, player.ship) > data.detectCollisionWithinThisFastDistanceOfPlayer) 
          continue
        if(Collision.isOwnerWithProjectileCollision(obj, other)) 
          continue
        if(this.testedObjects.findChild(other)) 
          continue

        if(Collision.auto(obj.hitbox, other.hitbox)) 
          collisionEvents.push(new CollisionEvent(obj, other))
      }
      this.testedObjects.push(obj)
    }

    for(let obj of world.gameObjects.interactable) {
      if(obj.interactionData.trigger.allowedIds.length === 1 && obj.interactionData.trigger.allowedIds[0] === "player_ship") {
        if(Collision.auto(obj.hitbox, player.ship.hitbox))
          interactionEvents.push(new TriggerEvent(obj, player.ship))
        continue
      }
      for(let other of world.gameObjects.gameObject) {
        if(other instanceof Interactable) continue
        if(Collision.auto(obj.hitbox, other.hitbox))
          interactionEvents.push(new TriggerEvent(obj, other))
      }
    }
    Collision.solve(world, collisionEvents, world.previousCollisions)
    Collision.solve(world, interactionEvents, world.previousInteractions)

    world.previousCollisions = collisionEvents
    world.previousInteractions = interactionEvents
  }

  static broadphase(world, gameObject, options = {exclude: [], solo: [], grid: grid}) {
    broadphaseCallsPerFrame++

    let searchGrowFactor = 1
    let usedGrid = options.grid ?? grid
    let cellPosition = usedGrid === navMeshGrid ? "navCellPosition" : "cellPosition"

    let objects = []
    main_broadphase:
    for(let i = 0; i < world.gameObjects.gameObject.length; i++) {
      let other = world.gameObjects.gameObject[i]
      if(!other.hitbox)     continue main_broadphase
      if(!other.canCollide) continue main_broadphase
      if(options.exclude?.length)
        for(let type of options.exclude)
          if(other instanceof type)
            continue main_broadphase

      let matchesSolo = true
      if(options.solo?.length) {
        solo:
        for(let type of options.solo) {
          matchesSolo = false
          if(other instanceof type) {
            matchesSolo = true
            break solo
          }
        }
      }
      if(!matchesSolo) continue main_broadphase

      searchGrowFactor = Math.max(gameObject.broadphaseGrowFactor, other.broadphaseGrowFactor) || 1
      
      if(
        other.transform[cellPosition].x >= gameObject.transform[cellPosition].x - searchGrowFactor &&
        other.transform[cellPosition].x <= gameObject.transform[cellPosition].x + searchGrowFactor &&
        other.transform[cellPosition].y >= gameObject.transform[cellPosition].y - searchGrowFactor &&
        other.transform[cellPosition].y <= gameObject.transform[cellPosition].y + searchGrowFactor &&
        other !== gameObject
      )
      objects.push(other)
    }
    return objects
  }
  static broadphaseForVector(world, vector, options = {exclude: [], solo: [], grid: grid}) {
    let obj = {transform: new Transform(vector)}
    return this.broadphase(world, obj, options)
  }
  static auto(hitbox1, hitbox2) {
    if(!hitbox1 || !hitbox2)
      return
    collisionChecksPerFrame++
    if(this[hitbox1.type + hitbox2.type.capitalize()])
      return this[hitbox1.type + hitbox2.type.capitalize()](hitbox1, hitbox2)
    else if(this[hitbox2.type + hitbox1.type.capitalize()])
      return this[hitbox2.type + hitbox1.type.capitalize()](hitbox2, hitbox1)
    else {
      console.error("auto collision solving fail", hitbox1, hitbox2)
      game.app.ticker.stop()
    }  
  }
  static isWithinRadiusAndAngle(hitbox, angleMin, angleMax, targetObject) {

  }
  static lineCircle(line, circle) {
    if(line instanceof Line === false)
      throw "only accept Line instances in" + this
    return Intersects.lineCircle(line.startPoint.x, line.startPoint.y, line.endPoint.x, line.endPoint.y, circle.gameObject.transform.position.x, circle.gameObject.transform.position.y, circle.radius)
  }
  static linePolygon(line, polygon) {
    if(line instanceof Line === false)
      throw "only accept Line instances in" + this
    let verts = []
    for(let vert of polygon.vertices) {
      verts.push(vert.x, vert.y)
    }
    let tolerance = 0
    return Intersects.linePolygon(line.startPoint.x, line.startPoint.y, line.endPoint.x, line.endPoint.y, verts, tolerance)
  }
  static linePolygonHitbox(line, hitbox) {
    if(line instanceof Line === false)
      throw "only accept Line instances in" + this
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.linePolygon(line, body)) 
        collided = true
    })
    return collided
  }
  static lineBox(line, box) {
    let boundingBox = box instanceof BoundingBox ? box : box.boundingBox
    return Intersects.lineBox(line.startPoint.x, line.startPoint.y, line.endPoint.x, line.endPoint.y, boundingBox.x, boundingBox.y, boundingBox.w, boundingBox.h)
  }
  static polygonHitboxPolygonHitbox(hitbox1, hitbox2) {
    let collided = false
    let checkedBodies = []
    for(let body1 of hitbox1.bodies) {
      for(let body2 of hitbox2.bodies) {
        if(checkedBodies.find(b => b === body2)) 
          continue
        if(this.polygonPolygon(body1, body2)) 
          collided = true
      }
      checkedBodies.push(body1)
    }
    return collided
  }
  static polygonHitboxVector(hitbox, vector) {
    let collided = false
    for(let body of hitbox.bodies) {
      if(this.polygonVector(body, vector)) 
        return true
    }
    return collided
  }
  static polygonHitboxCircle(hitbox, circle) {
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.polygonCircle(body, circle)) 
        collided = true
    })
    return collided
  }
  static polygonCircle(polygon, circle) {
    let verts = []
    for(let vert of polygon.vertices) {
      verts.push(vert.x, vert.y)
    }
    return Intersects.polygonCircle(
      verts,
      circle.gameObject.transform.position.x,
      circle.gameObject.transform.position.y,
      circle.radius,
    )
  }
  static polygonVector(polygon, vector) {
    let verts = []
    for(let vert of polygon.vertices) {
      verts.push(vert.x, vert.y)
    }
    return Intersects.polygonPoint(
      verts,
      vector.x,
      vector.y,
    )
  }
  static polygonPolygon(polygon1, polygon2) {
    let verts1 = []
    let verts2 = []
    for(let vert of polygon1.vertices) {
      verts1.push(vert.x, vert.y)
    }
    for(let vert of polygon2.vertices) {
      verts2.push(vert.x, vert.y)
    }
    return Intersects.polygonPolygon(
      verts1,
      verts2,
    )
  }
  static polygonBox(polygon, box) {
    let verts = []
    let boundingBox = box instanceof BoundingBox ? box : box.boundingBox
    for(let vert of polygon.vertices) {
      verts.push(vert.x, vert.y)
    }
    return Intersects.polygonBox(
      verts,
      boundingBox.x,
      boundingBox.y,
      boundingBox.w,
      boundingBox.h,
    )
  }
  static circleCircle(circle1, circle2) {
    return Intersects.circleCircle(
      circle1.gameObject.transform.position.x, circle1.gameObject.transform.position.y, circle1.radius,
      circle2.gameObject.transform.position.x, circle2.gameObject.transform.position.y, circle2.radius,
    )
  }
  static vectorCircle(vector, circle) {
    return Intersects.pointCircle(
      vector.x, vector.y,
      circle.gameObject.transform.position.x, circle.gameObject.transform.position.y, circle.radius
    )
  }
  static boxBox(box1, box2) {
    let [boundingBox1, boundingBox2] = [box1 instanceof BoundingBox ? box1 : box1.boundingBox, box2 instanceof BoundingBox ? box2 : box2.boundingBox]
    return Intersects.boxBox(
      boundingBox1.x, boundingBox1.y, boundingBox1.w, boundingBox1.h, 
      boundingBox2.x, boundingBox2.y, boundingBox2.w, boundingBox2.h 
    )
  }
  static boxVector(box, vector) {
    let boundingBox = box instanceof BoundingBox ? box : box.boundingBox
    return Intersects.boxPoint(
      boundingBox.x, boundingBox.y, boundingBox.w, boundingBox.h, 
      vector.x, vector.y
    )
  }
  static boxCircle(box, circle) {
    let boundingBox = box instanceof BoundingBox ? box : box.boundingBox
    return Intersects.boxCircle(
      boundingBox.x,
      boundingBox.y,
      boundingBox.w,
      boundingBox.h,
      circle.gameObject.transform.position.x, circle.gameObject.transform.position.y, circle.radius
    )
  }
  static boxPolygonHitbox(box, hitbox) {
    let collided = false
    hitbox.bodies.forEach(body => {
      if(this.polygonBox(body, box))
        collided = true
    })
    return collided
  }
  //#endregion detect
  //#region solve
  static solve(world, events, previousEvents) {
    for(let event of events) {
      if(this.isSameCollisionGroup(event.obj1, event.obj2)) return
      
      if(event instanceof CollisionEvent)
        this.solveCollision(world, event, previousEvents)
      if(event instanceof TriggerEvent) 
        this.solveTrigger(world, event, previousEvents)
      if(event instanceof LightEvent) 
        this.solveLightEvent(world, event, previousEvents)
    }
  }
  static solveCollision(world, event, previousEvents) {
      if(event.obj1.destroyed || event.obj2.destroyed) return

      let obj1 = event.obj1
      let obj2 = event.obj2

      this.distributeVelocity(obj1, obj2)
      this.repelObjects(event.obj1, event.obj2, event.impactSpeed)

      obj1.handleImpact(event)
      obj2.handleImpact(event)

      if(obj1 instanceof Projectile || obj2 instanceof Projectile) 
      {
        this.solveProjectileCollision(obj1, obj2)
      }
      if(this.isCollisionContinuous(event, previousEvents)) 
      {
        //hamper interlocking objects' angular velocities
        obj1.transform.angularVelocity *= 0.8
        obj2.transform.angularVelocity *= 0.8
      }
      else
      {
       this.affectRotationByImpact(obj1, obj2)
      }
  }
  static solveProjectileCollision(obj1, obj2) {
    if(obj1 instanceof Projectile && obj2 instanceof Projectile) return

    let [projectile, other] = [obj1, obj2]
    if(!(projectile instanceof Projectile)) 
      [projectile, other] = [other, projectile]
  }
  static solveTrigger(world, event, previousEvents) {
    if(event.obj1.destroyed || event.obj2.destroyed) return

    let [interactable, triggerer] = [event.obj1, event.obj2]
    if(event.obj2 instanceof Interactable) 
      [interactable, triggerer] = [triggerer, interactable]
    interactable.trigger(triggerer)
  }
  static solveLightEvent(world, event, previousEvents) {
    if(!event.visibleObject.sprite) return
    let distance = GameObject.distance(event.light, event.visibleObject)
    if(distance > event.light.radius) return
    
    let intensity = 1 - (distance / event.light.radius)
    let inverseIntensity = 1 - intensity

    let colorNumber = parseInt(event.light.color.toString(16), 16)
    let finalDecimalColor = (colorNumber * intensity + 16777215 * inverseIntensity)
    let tintVal = parseInt(finalDecimalColor.toString(16), 16)
    event.visibleObject.sprite.colorFilter.tint(tintVal, false)
  }
  static distributeVelocity(obj1, obj2) {
    let mass1 = obj1.mass
    let mass2 = obj2.mass

    if(!mass1 || !mass2)
      console.error("one or both objects are missing mass", obj1, obj2)

    let massFraction = 1 / (mass1 + mass2)

    let finalVelocity = obj1.transform.velocity.clone()
    .mult(massFraction * mass1)
    .add(
      obj2.transform.velocity.clone().mult(massFraction * mass2)
    )
    obj1.transform.velocity.set(0)
    obj2.transform.velocity.set(0)

    if(!obj1.immovable)
      obj1.transform.velocity.setFrom(finalVelocity)
    if(!obj2.immovable)
      obj2.transform.velocity.setFrom(finalVelocity)
  }
  static repelObjects(obj1, obj2, collisionImpactSpeed = 0) {
    let repelStrength = 1
    if(obj1 instanceof Fragment && obj2 instanceof Fragment)
      repelStrength = 0.2

    let v1 = Vector.fromAngle(GameObject.angle(obj2, obj1)).mult((collisionImpactSpeed * 0.2 * dt) + 30 * dt).mult(repelStrength)
    let v2 = Vector.fromAngle(GameObject.angle(obj1, obj2)).mult((collisionImpactSpeed * 0.2 * dt) + 30 * dt).mult(repelStrength)

    //this part (in theory) should make sure that heavier objects get pushed very little by this interaction
    let v1Multiplier = clamp(obj2.mass / obj1.mass, 0, 1)
    let v2Multiplier = clamp(obj1.mass / obj2.mass, 0, 1)
    v1.mult(v1Multiplier)
    v2.mult(v2Multiplier)

    if(!obj1.immovable) {
      obj1.transform.position.add(v1)
      obj1.transform.velocity.add(v1)
    }
      
    if(!obj2.immovable) {
      obj2.transform.position.add(v2)
      obj2.transform.velocity.add(v2)
    }
      
  }
  static affectRotationByImpact(obj1, obj2) {
    let angleDifference = 0
    let angleBetweenObjects = obj1.transform.position.angleTo(obj2.transform.position)
    let vel = obj1.transform.velocity.clone().add(obj2.transform.velocity)
    let velAngle = vel.angle()
    angleDifference = angleBetweenObjects - velAngle
    obj1.transform.angularVelocity += angleDifference * obj1.transform.velocity.length() * 0.009 * dt
    obj2.transform.angularVelocity -= angleDifference * obj2.transform.velocity.length() * 0.009 * dt
  }
  //#endregion
  static isCollisionContinuous(event, previousEvents) {
    return previousEvents.find(ev => 
      (ev.obj1 === event.obj1 && ev.obj2 === event.obj2)
      || 
      (ev.obj2 === event.obj2 && ev.obj1 === event.obj1)
      )
  }
  static isOwnerWithProjectileCollision(obj, other) {
    return (other.owner === obj || obj.owner === other)
  }
  static isSameCollisionGroup(obj1, obj2) {
    return (obj1.collisionGroup && obj2.collisionGroup) && obj1.collisionGroup == obj2.collisionGroup
  }
}
class InteractionEvent {
  constructor(obj1, obj2) {
    this.obj1 = obj1
    this.obj2 = obj2
  }
}
class CollisionEvent extends InteractionEvent {
  constructor(obj1, obj2, collisionData) {
    super(obj1, obj2)
    this.collisionData = collisionData
    
    if(preferences.allProjectilesDoSingularPointOfDamage) {
      if(obj1 instanceof Projectile)
        this.impactDamage = obj1.impactDamage
      if(obj2 instanceof Projectile)
        this.impactDamage = obj2.impactDamage
      else
        this.impactDamage = 1
    }
    else {
      this.impactDamage = 1
    }

    if(obj1 instanceof Projectile) {
      this.collisionPoint = obj1.transform.position.clone()
      this.collisionType = "projectile"
    }
    else
    if(obj2 instanceof Projectile) {
      this.collisionPoint = obj2.transform.position.clone()
      this.collisionType = "projectile"
    }
    else {
      this.collisionType = "impact"
    }

    this.impactSpeed = obj1.transform.velocity.clone().sub(obj2.transform.velocity).length()
  }
  static fakeEvent(impactDamage, impactSpeed) {
    return {
      obj1: null,
      obj2: null,
      collisionType: "impact",
      impactDamage, 
      impactSpeed,
    }
  }
}

class TriggerEvent extends InteractionEvent {
  constructor(obj1, obj2) {
    super(obj1, obj2)
  }
}

class LightEvent extends InteractionEvent {
  constructor(light, visibleObject) {
    super(light, visibleObject)
    this.visibleObject = visibleObject
    this.light = light
  }
}
class InteractionManager {
  constructor() {
    this.interactions = []
    this.currentInteraction = null
  }
  createInteraction() {
    let interaction = new Interaction()
    if(interaction.type === "one of the types that display shit in the UI")
      interaction.createHTML()
  }
}
class PolygonBuilder {
  static TriangleRight(dim = {x: 100, y: 100}, offset = {x: 0, y: 0}, flipHorizontal = false, flipVertical = false, rotationDeg = 0 ) {
    let rotation = rotationDeg * PI/180
    let pivot = {x: dim.x/2, y: dim.y/2}
    let vertices = [
      {x: 0, y: 0},
      {x: dim.x, y: dim.y},
      {x: 0 , y: dim.y},
    ]
    if(flipHorizontal) {
      vertices.forEach((vertex) => {
        let offset = pivot.x - vertex.x
        vertex.x += offset*2
      })
    }
    if(flipVertical) {
      vertices.forEach((vertex) => {
        let offset = pivot.y - vertex.y
        vertex.y += offset*2
      })
    }
    this.rotateVertices(vertices, rotation)
    this.offsetVertices(vertices, offset)
    return new Polygon(vertices)
  }
  static Rectangle(a, b, offset = {x: 0, y: 0}, rotationDeg = 0) {
    let rotation = rotationDeg * PI/180
    let vertices = [
      {x: 0, y: 0},
      {x: a, y: 0},
      {x: a , y: b},
      {x: 0 , y: b},
    ]
    this.rotateVertices(vertices, rotation)
    this.offsetVertices(vertices, offset)
    return new Polygon(vertices)
  }
  static Square(a, offset = {x: 0, y: 0}, rotationDeg = 0) {
    let rotation = rotationDeg * PI/180
    let vertices = [
      {x: 0, y: 0},
      {x: a, y: 0},
      {x: a , y: a},
      {x: 0 , y: a},
    ]
    this.rotateVertices(vertices, rotation)
    this.offsetVertices(vertices, offset)
    return new Polygon(vertices)
  }
  static Polygon(edgeCount, dimensions = { x: 100, y: 100 }, offset = {x: 0, y: 0}, rotationDeg = 0) {

  }
  static Trapezoid(a, b, skewFactor, skewMidpoint, offset = {x: 0, y: 0}, rotationDeg = 0) {
    //skew midpoint is the point along the top edge that the edge will be scaled towards

  }
  static Custom(vertices = [{x:0, y:0}], offset = {x: 0, y: 0}, rotationDeg = 0) {

  }
}

class Polygon {
  constructor(vertices) {
    this.vertices = vertices
    this.color = colors.hitbox.noCollision
  }
  rotate(rotation) {
    this.vertices.forEach(vertex => {
      let newPos = Vector.rotatePlain(vertex, rotation)
      vertex.x = newPos.x
      vertex.y = newPos.y
    })
  }
}
class Interactable extends GameObject {
  constructor(
    transform,
    name,
    hitbox,
    doOnEnter = [],
    doOnLeave = [],
    doOnDestroy = [],
    parent = null,
    interactionData,
    interactionId
  ) {
    super(transform)
    this.type = "interactable"
    this.name = name
    this.parent = parent
    this.triggered = false
    this.triggerers = new Set()
    this.doOnEnter = doOnEnter
    this.doOnLeave = doOnLeave
    this.doOnDestroy = doOnDestroy

    this.components = ["hitbox"]
    this.registerComponents({hitbox})

    this.interactionData = interactionData
    this.interactionId = interactionId
    this.hint = null

    if(!parent)
      console.log("parent object not found, probably destroyed or wrong parent id was input")
  }
  checkTriggererValidity(triggerer) {
    if(this.interactionData.trigger.allowedTypes.find(t => t === triggerer.type))
      return true
    if(this.interactionData.trigger.allowedIds.find(id => id === triggerer.id))
      return true
    if(this.interactionData.trigger.allowAll)
      return true
  }
  trigger(triggerer) {
    if(this.triggerers.has(triggerer)) 
      return
    if(this.checkTriggererValidity(triggerer))
      this.enter(triggerer)
  }
  enter(triggerer) {
    this.triggerers.add(triggerer)
    this.triggered = !!this.triggerers.size

    if(this.interactionData.interactionDelay) {
      setTimeout(() => {
        this.doOnEnter.forEach(command => this[command]())
      }, this.interactionData.interactionDelay)
    }
    else {
      this.doOnEnter.forEach(command => this[command]())
    }
  }
  leave(triggerer) {
    this.triggerers.delete(triggerer)
    this.triggered = !!this.triggerers.size
    this.doOnLeave.forEach(
      command => this[command]()
    )
  }
  updatePosition() {
    this.transform.position.setFrom(this.parent.transform.position)
  }
  update() {
    if(this.parent.destroyed)
      GameObject.destroy(this)

    this.updatePosition()
    this.triggerers.forEach(object => {
      if(!Collision.auto(this.hitbox, object.hitbox))
        this.leave(object)
    })
  }
  destroy() {
    if(this.gameWorld.state.is("loadingLocation")) return
    
    this.doOnDestroy.forEach(command => this[command]())
    this.hintGraphic?.dismiss()
    let interaction = this.gameWorld.interactionsTemplate.interactions.find(i => i.interactionId === this.interactionId)
    interaction.options.isAlreadyCreated = false
  }
  //#region interaction commands
  showHint() {
    if(this.hint) return

    let hintData = {}
    for(let key in this.interactionData.hintData)
      hintData[key] = this.interactionData.hintData[key]

    this.hint = GameObject.create(
      "hint", 
      "Hint", 
      {
        transform: new Transform(), 
        hintData: hintData,
        parent: this, 
      },
      {
        world: this.gameWorld
      }
    )
  }
  hideHint() {
    if(!this.hint) return

    this.hint.dismiss()
    this.hint = null
  }
  triggerAudioCall() {
    gameUI.openAudioCallPanel(this.interactionData.audioCallCaller, this.interactionData.audioCallMessage, this.interactionData.audioCallName)
  }
  createMarker() {
    this.gameWorld.createMarkerById(this.interactionData.newMarkerId)
  }
  destroyMarker() {
    this.gameWorld.destroyMarkerById(this.interactionData.newMarkerId)
  }
  createInteraction() {
    this.gameWorld.createInteractionById(this.interactionData.newInteractionId)
  }
  createHintGraphic() {
    this.hintGraphic = GameObject.create(
      "hintGraphic", 
      this.interactionData.hintGraphicData.name, 
      {
        parent: GameObject.byId(this.gameWorld, this.interactionData.hintGraphicData.parentGameObject)
      },
      {world: this.gameWorld}
    )
  }
  destroyHintGraphic() {
    if(this.hintGraphic)
      GameObject.destroy(this.hintGraphic)
    this.hintGraphic = null
  }
  destroyInteractable() {
    GameObject.destroy(this)
  }
  activateShipSystem() {
    this.parent[this.interactionData.shipSystemName].activate()
  }
  deactivateShipSystem() {
    this.parent[this.interactionData.shipSystemName].deactivate()
  }
  fireWeapon() {
    if(!this.parent.weapons) throw "cannot fire a weapon if gameObject doesn't have a weapon system"

    let weapon = this.parent.weapons.weapons.find(w => w.name === this.interactionData.firedWeaponName)
    this.parent.weapons.setActiveWeapon(weapon)
    weapon.fire()
  }
  highlightUIElement() {
    gameUI.highlightUIElement(this.interactionData.highlightedElementId)
  }
  setUIElementVisibility() {
    switch(this.interactionData.uiElementAnimation) {
      case "fade": {
        let element = Q(`#${this.interactionData.uiElementId}`)
        let endValue = this.interactionData.uiElementVisibility === "show" ? 1 : 0
        let startValue = 1 - endValue
        
        if(startValue === 0)
          element.classList.remove("hidden")

        let anim = element.animate(
          [{filter: `opacity(${startValue})`},{filter: `opacity(${endValue})`}],
          {duration: 1000}
        )
        anim.onfinish = () => {
          element.style.filter = `opacity(${endValue})`
          if(endValue === 1)
            element.style.filter = ""
          if(endValue === 0)
            element.classList.add("hidden")
        }
        break
      }
      default: {
        this.interactionData.uiElementVisibility === "show" ?
        Q(`#${this.interactionData.uiElementId}`).classList.remove("hidden") : 
        Q(`#${this.interactionData.uiElementId}`).classList.add("hidden") 
      }
    }
  }
  async showQuestPanel() {
    let questPanel = Q("#quest-panel")
    Q("#quest-panel-quest-name").innerText = this.interactionData.questData.name

    await waitFor(1700)
    questPanel.animate([
      {filter: "opacity(0)", transform: "scale(0.99)"},
      {filter: "opacity(1)", transform: "scale(1.0)"},
    ], {duration: 1500, easing: "ease-in-out"})
    .onfinish = () => {
      questPanel.style.filter = "opacity(1)"
      setTimeout(hideQuestPanel, 2350)
    }
    function hideQuestPanel() {
      questPanel.animate([
        {filter: "opacity(1)", transform: "scale(1.0)"},
        {filter: "opacity(0)", transform: "scale(1.03)"},
      ], {duration: 1500, easing: "ease-in-out"})
      .onfinish = () => questPanel.style.filter = "opacity(0)"
    }
  }
  async showThankYouPanel() {
    let 
    thankYouPanel = Q("#thank-you-panel")
    thankYouPanel.style.filter = "opacity(0)"
    thankYouPanel.classList.remove("hidden")

    await waitFor(1500)

    thankYouPanel.animate([
      {filter: "opacity(0)", transform: "scale(0.98)"},
      {filter: "opacity(1)", transform: "scale(1.0)"},
    ], {duration: 1500, easing: "ease-in-out"})
    .onfinish = () => thankYouPanel.style.filter = ""
  }
  setFacts() {
    for(let fact of this.interactionData.facts)
      Fact.setFact(fact.identifier, fact.value)
  }
  createFacts() {
    for(let fact of this.interactionData.facts)
      Fact.create(undefined, fact.identifier, fact.value)
  }
  addUIHandler() {
    this.hookedElement = Q(this.interactionData.UIHandlerData.elementSelector)
    this.UIhandler = () => game.createInteractionById(this.interactionData.UIHandlerData.interactionId)
    this.hookedElement.addEventListener(this.interactionData.UIHandlerData.eventType, this.UIhandler)
  }
  removeUIHandler() {
    this.hookedElement?.removeEventListener(this.interactionData.UIHandlerData.eventType, this.UIhandler)
  }
  createTooltip() {
    let tooltip = this.interactionData.tooltipData
    if(tooltip.type === "popup") {
      this.tooltip = new PopupTooltip(
        Q(`#${tooltip.parentElementId}`),
        tooltip.attachment,
        {title: tooltip.title, text: tooltip.text},
        tooltip.options
      )
    }
    if(tooltip.type === "regular") {
      //do nothing really cos the regular tooltip isn't useful for this
    }
  }
  destroyTooltip() {
    this.tooltip?.destroy()
    this.tooltip = null      
  }
  setNPCState() {
    for(let npc of this.interactionData.npcStateData.NPCs) {
      let NPC = this.gameWorld.gameObjects.npc.find(NPC => NPC.name === npc)
      NPC.stateMachine.setStateByName(this.interactionData.npcStateData.stateName)
    }
  }
  //#endregion
}
class Component {
  constructor(gameObject) {
    this.gameObject = gameObject
  }
  update() {
    throw "missing Component's update method"
  }
  clone() {
    return _.cloneDeep(this)
  }
}
class Transform extends Component {
  constructor(
    position = new Vector(), 
    velocity = new Vector(), 
    rotation = 0, 
    angularVelocity = 0,
  ) {
    super()
    this.position = position
    this.velocity = velocity
    this.rotation = rotation
    this.angularVelocity = angularVelocity
    this.cellPosition = new Vector()
    this.navCellPosition = new Vector()
    this.update()
  }
  update() {
    this.updateCellPosition()
    this.updateNavCellPosition()
  }
  updateCellPosition() {
    this.cellPosition.x = Math.floor(this.position.x / grid.cellSize)
    this.cellPosition.y = Math.floor(this.position.y / grid.cellSize)
  }
  updateNavCellPosition() {
    this.navCellPosition.x = Math.floor(this.position.x / navMeshGrid.cellSize)
    this.navCellPosition.y = Math.floor(this.position.y / navMeshGrid.cellSize)
  }
  clone() {
    return Transform.fromPlain(this.plain)
  }
  reset() {
    this.position.set(0)
    this.velocity.set(0)
    this.angularVelocity = 0
    this.rotation = 0
    this.cellPosition.set(0)
  }
  get plain() {
    return {
      position: this.position.plain(),
      velocity: this.velocity.plain(),
      rotation: this.rotation,
      angularVelocity: this.angularVelocity,
      cellPosition: this.cellPosition.plain()
    }
  }
  static fromPlain(obj) {
    return new Transform(
      new Vector(obj.position.x, obj.position.y),
      new Vector(obj.velocity.x, obj.velocity.y),
      obj.rotation, 
      obj.angularVelocity,
      new Vector(obj.cellPosition.x, obj.cellPosition.y)
    )
  }
}
class Sprite extends Component {
  constructor(gameObject) {
    super(gameObject)
  }
  update() {
    Sprite.updateGeneric(this)
    if(this.highlights)   Sprite.updateHighlights(this)
    if(this.minimapIcon)  Sprite.updateMinimapIcon(this)
  }
  //#region static methods
  static createDefault(gameObject) {
    let spriteComponent = new Sprite(gameObject)

    spriteComponent.container = new PIXI.Container()
    spriteComponent.all = []
    spriteComponent.highlights = []
    spriteComponent.flames = {}
    spriteComponent.wreck = []
    spriteComponent.orbits = []

    let newSources = []
    let objectSources = _.cloneDeep(sources.img[gameObject.type][gameObject.name])
    let folder = objectSources["folder"]
    delete objectSources["folder"]

    objectSources.auto.forEach((src) => {
      let length = src.replace(/[^0-9\.]+/g, '') || 1
      if(src.includes("thumbnail")) 
        return
      else 
      if(src.includes("linework")) {
        length <= 1 ? newSources.push({src: "linework.png", length: length}) : newSources.push({src: "linework0000.png", length: length}) 
      }
      else 
      if(src.includes("fill")) {
        newSources.push({src: "fill.png", length: length})
      }
      else
      if(src.includes("highlights")) {
        newSources.push(
          {src: "highlights0.png", length: length}, 
          {src: "highlights90.png", length: length}, 
          {src: "highlights180.png", length: length}, 
          {src: "highlights270.png", length: length}
        )
      }
      else 
      if(src.includes("coatingLayer")) {
        newSources.push({src: "coatingLayer0000.png", length: length})
      }
      else 
      if(src.includes("shieldCharge")) {
        newSources.push({src: "shieldChargeIndicator.png", length: length})
      }      
      else 
      if(src.includes("shieldForceField")) {
        newSources.push({src: "shieldForceField.png", length: length})
      }      
      else 
      if(src.includes("shieldBubble")) {
        newSources.push({src: "shieldBubble.png", length: length})
      }
      else 
      if(src.includes("shieldPulse")) {
        length <= 1 ? newSources.push({src: "shieldPulse.png", length: length}) : newSources.push({src: "shieldPulse0000.png", length: length}) 
      }
      else
      if(src.includes("shieldHardLightFront")) {
        length <= 1 ? newSources.push({src: "shieldHardLightFront.png", length: length}) : newSources.push({src: "shieldHardLightFront0000.png", length: length}) 
      }
      else
      if(src.includes("boostersIndicator")) {
        newSources.push({src: "boostersIndicator.png", length: length})
      }      
      else
      if(src.includes("brakeIndicator")) {
        newSources.push({src: "brakeIndicator.png", length: length})
      }      
      else
      if(src.includes("laserChargeProgress")) {
        newSources.push({src: "laserChargeProgress0000.png", length: length})
      }
      else
      if(src.includes("vwbOutline")) {
        newSources.push({src: "vwbOutline.png", length: length})
      }      
      else
      if(src.includes("glow")) {
        newSources.push({src: "glow.png", length: length})
      }
      else
      if(src.includes("boostersGlow")) {
        newSources.push({src: "boostersGlow.png", length: length})
      }
      else
      if(src.includes("wreck")) {
        newSources.push({src: "wreck0000.png", length: length})
      }
      else
      if(src.includes("ghost")) {
        newSources.push({src: "ghost.png", length: length})
      }      
      else
      if(src.includes("skip")) {
        newSources.push({src: "skip0000.png", length: length})
      }          
      else
      if(src.includes("flameLow")) {
        newSources.push({src: "flameLow0000.png", length: length})
      }  
      else
      if(src.includes("flameMedium")) {
        newSources.push({src: "flameMedium0000.png", length: length})
      }  
      else
      if(src.includes("flameHigh")) {
        newSources.push({src: "flameHigh0000.png", length: length})
      }  
      else
      if(src.includes("star")) {
        newSources.push({src: "star.png", length: 1})
      }
      else
      if(src.includes("orbit1")) {
        newSources.push({src: "orbit1.png", length: 1})
      }
      else
      if(src.includes("orbit2")) {
        newSources.push({src: "orbit2.png", length: 1})
      }
      else
      if(src.includes("orbit3")) {
        newSources.push({src: "orbit3.png", length: 1})
      }    
      else
      if(src.includes("stealthFill")) {
        newSources.push({src: "stealthFill.png", length: length})
      }
      else
      if(src.includes("stealthLinework")) {
        newSources.push({src: "stealthLinework.png", length: length})
      }
      else
      if(src.includes("overlayFill")) {
        newSources.push({src: "overlayFill.png", length: length})
      }
      else
      if(src.includes("particles")) {
        newSources.push({src: "particles0000.png", length: length})
      }
      else
      if(src.includes("death")) {
        newSources.push({src: "death.png", length: length})
      }
      else
      if(src.includes("hullDamage")) {
        newSources.push({src: "hullDamage0000.png", length: length})
      }
      else
      if(src.includes("hullInvulnerableAnimation")) {
        newSources.push({src: "hullInvulnerableAnimation0000.png", length: length})
      }
      else
      if(src.includes("weapons")) {
        newSources.push({src: "weapons", length: length})
      }
      else
      if(src.includes("gameOverlay")) {
        newSources.push({src: "gameOverlay.png", length: length})
      }
      else
      if(src.includes("travelAnimationSubmerge")) {
        newSources.push({src: "travelAnimationSubmerge.png", length: length})
      }
      else
      if(src.includes("travelAnimationEmerge")) {
        newSources.push({src: "travelAnimationEmerge.png", length: length})
      }
    })

    /* minimap sprite insertion */
    if(gameObject.type.includesAny("asteroid", "debris", "ship", "station", "ultraportBeacon", "satellite"))
      newSources.push({src: "minimapIcon.png", length: 1})
    
    newSources.forEach((source) => {
      let url = folder + source.src
      let name = source.src
      let length = source.length
      let sprite

      /* some modifications and exceptions */
      if(name.includes("skip")) {
        url = "assets/skipAnimation/skip0000.png"
      }
      else
      if(name.includes("travelAnimation")) {
        url = "assets/travelAnimation/travelAnimation0000.png"
        length = 13
      }
      else
      if(name.includes("weapons")) {
        spriteComponent.weapons = new PIXI.Container()
        spriteComponent.container.addChild(spriteComponent.weapons)
        return
      }
      else
      if(name.includes("minimapIcon")) {
        /* awful hack that changes ship icon for the player ship only */
        gameObject.type === "ship" && gameObject.name === "theGrandMoth" ?
        url = "assets/minimapIcon/playerShip.png" :
        url = "assets/minimapIcon/" + gameObject.type + ".png"
      }

      //create either regular or animated sprite based on various conditions
      if(length > 1 && !name.includes("wreck")) 
      {
        sprite = Sprite.animatedSprite(url, length)
        if(name.includesAny("skip", "flame", "stealth", "particles", "hullDamage", "hullInvulnerableAnimation", "travelAnimation")) 
        {
          if(name.includes("stealth"))
            sprite.animationSpeed = 0.05
          else if(name.includes("travelAnimation"))
            sprite.animationSpeed = 0.2
          else
            sprite.animationSpeed = 0.1
          sprite.play()
        }
      }
      else
      if(name.includes("wreck"))
      {
        for (let i = 0; i < length; i++) {
          sprite = PIXI.Sprite.from(folder + "wreck/wreck000" + i + ".png")
          spriteComponent.all.push(sprite)
          sprite.anchor.set(0.5)
          sprite.alpha = 0.0
          sprite.renderable = false
          spriteComponent.wreck.push(sprite)
        }
      }
      else
      if(name.includes("minimapIcon")) {
        sprite = PIXI.Sprite.from(url)
        game.minimapApp.stage.addChild(sprite)
      }
      else
      {
        sprite = PIXI.Sprite.from(url)
      }

      if(name.includes("highlights"))                 spriteComponent.highlights.push(sprite)
      if(name.includes("orbit"))                      spriteComponent.orbits.push(sprite)
      if(name.includes("ghost"))                      spriteComponent.ghost = sprite
      if(name.includes("skip"))                       spriteComponent.skip = sprite
      if(name.includes("glow"))                       spriteComponent.glow = sprite
      if(name.includes("boostersGlow"))               spriteComponent.boostersGlow = sprite
      if(name.includes("flame"))                      spriteComponent.flame = sprite
      if(name.includes("fill"))                       spriteComponent.fill = sprite
      if(name.includes("coatingLayer"))               spriteComponent.coatingLayer = sprite
      if(name.includes("linework"))                   spriteComponent.linework = sprite
      if(name.includes("shieldCharge"))               spriteComponent.shieldCharge = sprite
      if(name.includes("shieldForceField"))           spriteComponent.shieldForceField = sprite
      if(name.includes("shieldBubble"))               spriteComponent.shieldBubble = sprite
      if(name.includes("shieldPulse"))                spriteComponent.shieldPulse = sprite
      if(name.includes("shieldHardLightFront"))       spriteComponent.shieldHardLightFront = sprite
      if(name.includes("vwbOutline"))                 spriteComponent.vwbOutline = sprite
      if(name.includes("boostersIndicator"))          spriteComponent.boostersIndicator = sprite
      if(name.includes("brakeIndicator"))             spriteComponent.brakeIndicator = sprite
      if(name.includes("laserChargeProgress"))        spriteComponent.laserChargeProgress = sprite
      if(name.includes("stealthFill"))                spriteComponent.stealthFill = sprite
      if(name.includes("stealthLinework"))            spriteComponent.stealthLinework = sprite
      if(name.includes("overlayFill"))                spriteComponent.overlayFill = sprite
      if(name.includes("particles"))                  spriteComponent.particles = sprite
      if(name.includes("death"))                      spriteComponent.death = sprite
      if(name.includes("minimapIcon"))                spriteComponent.minimapIcon = sprite
      if(name.includes("hullInvulnerableAnimation"))  spriteComponent.hullInvulnerableAnimation = sprite
      if(name.includes("travelAnimationSubmerge"))    spriteComponent.travelAnimationSubmerge = sprite
      if(name.includes("travelAnimationEmerge"))      spriteComponent.travelAnimationEmerge = sprite
      
      sprite.anchor.set(0.5)

      if(name.includesAny("shield", "stealth", "death", "hullInvulnerableAnimation", "travelAnimation")) 
      {
        sprite.renderable = false
      }
      if(name.includes("flame")) 
      {
        if(name.includes("Low"))                  spriteComponent.flames.low = sprite
        if(name.includes("Medium"))               spriteComponent.flames.medium = sprite
        if(name.includes("High"))                 spriteComponent.flames.high = sprite
      }

      spriteComponent.all.push(sprite)
      
      //this is to prevent adding certain sprites to the container, they're not supposed to be bound to the GameObject's position
      if(name.includesAny("skip", "ghost", "shieldPulse", "minimapIcon", "travelAnimation"))
        return
      spriteComponent.container.addChild(sprite)
    })

    gameObject.sprite = spriteComponent
  }
  static createForFragment(gameObject, fragmentIndex) {
    let spriteComponent = new Sprite(gameObject)
    gameObject.sprite = spriteComponent

    spriteComponent.container = new PIXI.Container()
    spriteComponent.all = []

    let url = `assets/${gameObject.parent.type}/${gameObject.parent.name}/wreck/wreck000${fragmentIndex}.png`
    let 
    sprite = PIXI.Sprite.from(url)
    sprite.anchor.set(0.5)

    spriteComponent.all.push(sprite)
    spriteComponent.container.addChild(sprite)
  }
  static createForMapLabel(gameObject, text, color = "ffffff") {
    let spriteComponent = new Sprite(gameObject)
    gameObject.sprite = spriteComponent

    spriteComponent.container = new PIXI.Container()
    spriteComponent.all = []

    let 
    sprite = new PIXI.Text(text, {fontFamily: "big-t-comic", fill: "0x" + color, letterSpacing: -2})
    sprite.anchor.set(0.5)

    spriteComponent.all.push(sprite)
    spriteComponent.text = sprite
    spriteComponent.container.addChild(sprite)
  }
  static updateGeneric(sprite) {
    let transform = sprite.gameObject.transform
    sprite.container.position.set(transform.position.x, transform.position.y)
    sprite.container.rotation = transform.rotation
  }
  static updateHighlights(sprite) {
    if(sprite.gameObject.transform.rotation === sprite.gameObject.performanceData.previousRotation) return
    if(sprite.gameObject.stealth?.active) return
    if(sprite.gameObject.wrecked) return
    if(sprite.gameObject.dying) return

    let deg = sprite.gameObject.transform.rotation * 180/PI
    for (let [index, image] of sprite.highlights.entries()) {

      //offset in degrees from the facing direction of the object
      let offsetFromFront = index * 90 - deg
      if(offsetFromFront <= -270) 
        offsetFromFront += 360
      offsetFromFront = Math.abs(offsetFromFront)
      
      //this puts the alpha between 0 and 1 with 0.01 precision
      image.alpha = Math.max(0, Math.round((1 - offsetFromFront/90 )*100)/100) 
      image.alpha <= 0 ? image.renderable = false : image.renderable = true
    }
  }
  static updateFlames(gameObject, intensity) {
    for(let key in gameObject.sprite.flames)
      gameObject.sprite.flames[key].renderable = false

    if(intensity === null) return

    gameObject.sprite.flames[intensity].renderable = true
  }
  static updateOrbits(gameObject) {
    gameObject.sprite.orbits.forEach((orbit, index) => {
      orbit.rotation += gameObject.orbitalVelocities[index] * dt
    })
  }
  static updateMinimapIcon(sprite) {
    sprite.minimapIcon.position.set(sprite.gameObject.transform.position.x * Game.minimapScaleFactor, sprite.gameObject.transform.position.y * Game.minimapScaleFactor)
    sprite.minimapIcon.rotation = sprite.gameObject.transform.rotation
  }
  static imgSequence(src = "path/to/file0000.png", framesTotal = 5) {
    let str = src.replaceAll("0000", "").replaceAll(".png", "")
    let sequence = []
      for (let i = 0; i < framesTotal; i++) {
        let src;
        if(i > 999) src = str + "" + i + ".png"
        else
        if(i > 99) src = str + "0" + i + ".png"
        else
        if(i > 9) src = str + "00" + i + ".png"
        else src = str + "000" + i + ".png"
        sequence.push(src)
      }
      return sequence
  }
  static animatedSprite(firstImage = "assets/file0000.png", imageCount) {
    let imgSequence = this.imgSequence(firstImage, imageCount)
    let textureArray = []
  
    for (let i = 0; i < imgSequence.length; i++)
    {
        let texture = PIXI.Texture.from(imgSequence[i]);
        textureArray.push(texture);
    };
    let sprite = new PIXI.AnimatedSprite(textureArray);
    return sprite
  }
  //#endregion
}
class Hitbox extends Component {
  constructor(gameObject, color) {
    super(gameObject)
    if(!gameObject) 
      console.error("hitbox must have a reference to its gameobject: ", this)
    this.color = color || colors.hitbox.noCollision
    this.projections = []
    this.timers = new Timer(
      ["project", 500, {loop: true, active: true, onfinish: this.projectPosition.bind(this)}]
    )
  }
  projectPosition() {
    this.projections = []
    let boundingBox = this.boundingBox
    let iterations = data.pathfinding.projection.iterations
    let timestretch = data.pathfinding.projection.timestretch
    for (let i = 0; i < iterations; i++) {
      let offsetPerIteration = this.gameObject.transform.velocity.clone()
      .mult(timestretch)
      .mult(dt)

      boundingBox.x += offsetPerIteration.x
      boundingBox.y += offsetPerIteration.y
      this.projections.push(_.cloneDeep(boundingBox))
    }
  }
  projectPositionInDifferentAngle(gameObjectRotationOffset, velocity = this.gameObject.transform.velocity) {
    let projections = []
    let boundingBox = this.boundingBox
    let iterations = data.pathfinding.projection.iterations
    let timestretch = data.pathfinding.projection.timestretch
    for (let i = 0; i < iterations; i++) {
      let offsetPerIteration = velocity.clone().rotate(gameObjectRotationOffset)
      .mult(timestretch)
      .mult(dt)
      
      boundingBox.x += offsetPerIteration.x
      boundingBox.y += offsetPerIteration.y
      projections.push(_.cloneDeep(boundingBox))
    }
    return projections
  }
  update() {
    throw "supply update() method"
  }
  //#region static draw methods
  static draw(gameObject, graphics, widthMultiplier = 1) {
    if(!visible.hitbox)
      return
    if(!gameObject.hitbox) 
      return
      
    let color = gameObject.hitbox.color

    if(gameObject instanceof Interactable) 
      color = colors.hitbox.interactable
      
    if(gameObject.triggered) 
      color = colors.hitbox.collision

    if(gameObject.hitbox.type === "circle") {
      this.drawCircle(gameObject, gameObject.hitbox, graphics, widthMultiplier, color)
    }
    if(gameObject.hitbox.type === "polygonHitbox") {
      this.drawPolygonHitbox(gameObject, gameObject.hitbox, graphics, widthMultiplier, color)
    }
    if(gameObject.hitbox.type === "box") {
      this.drawBox(gameObject, gameObject.hitbox, graphics, widthMultiplier, color)
    }
    if(visible.origin)
      this.drawOrigin(gameObject, graphics, color, widthMultiplier)
  }
  static drawBox(gameObject, hitbox, graphics, widthMultiplier, color) {
    let pos = gameObject.transform.position
    let positionOffset = hitbox.positionOffset ?? {x: 0, y: 0}
    graphics.lineStyle(2 * widthMultiplier, color, 1);
    graphics.drawRect(
      pos.x - hitbox.w/2 + positionOffset.x, 
      pos.y - hitbox.h/2 + positionOffset.y, 
      hitbox.w, 
      hitbox.h
    )
    graphics.closePath()
  }
  static drawCircle(gameObject, hitbox, graphics, widthMultiplier, color) {
    graphics.lineStyle(2 * widthMultiplier, color, 1);
      graphics.drawCircle(
        gameObject.transform.position.x, 
        gameObject.transform.position.y, 
        hitbox.radius
      )
      graphics.closePath();
  }
  static drawPolygonHitbox(gameObject, hitbox, graphics, widthMultiplier, color) {
    hitbox.bodies.forEach((body) => {
      this.drawPolygon(body, graphics, widthMultiplier)
    }) 
  }
  static drawPolygon(body, graphics, widthMultiplier = 1) {
    let color = body.color
    graphics.lineStyle(2 * widthMultiplier, color, 1);
    body.vertices.forEach((vertex, index) => {
      graphics.moveTo(vertex.x, vertex.y);
      
      if(index === body.vertices.length - 1)
      graphics.lineTo(body.vertices[0].x, body.vertices[0].y);
      else
      graphics.lineTo(body.vertices[index + 1].x, body.vertices[index + 1].y);
    })
  graphics.closePath();
  }
  static drawBoundingBox(object, graphics, widthMultiplier = 1) {
    if(!object.hitbox) return

    let bb = object.hitbox.boundingBox
    graphics.lineStyle(2 * widthMultiplier, 0x0011dd, 1);
    graphics.drawRect(
      bb.x, 
      bb.y, 
      bb.w, 
      bb.h
    )
  }
  static drawProjections(obj, graphics, widthMultiplier = 1) {
    if(!visible.projections) return
    if(obj instanceof Interactable) return
    if(!obj.hitbox) return
    if(!obj.hitbox.projections) return

    obj.hitbox.projections.forEach(box => {
      graphics.lineStyle(2 * widthMultiplier, colors.hitbox.projection, 1)
      graphics.drawRect(
        box.x, 
        box.y, 
        box.w, 
        box.h
      )
    })
  }
  static drawOrigin(gameObject, graphics, color, widthMultiplier = 1) {
    let layerOffsetMultiplier = GameWorldWindow.layerCounterOffset[gameObject.layer] ?? 1
    graphics.lineStyle(2 * widthMultiplier, color, 1);
    graphics.drawCircle(
      gameObject.transform.position.x + (gameObject.gameWorld.camera.transform.position.x * layerOffsetMultiplier),
      gameObject.transform.position.y + (gameObject.gameWorld.camera.transform.position.y * layerOffsetMultiplier),
      4
    )
    graphics.closePath();
  }
  //#endregion
  //#region static update methods
  static updatePolygonHitbox(object, hitbox) {
    if(object.performanceData.previousRotation === object.transform.rotation && object.gameWorld === game && !(object instanceof Interactable) && !object.vwb)
      this.offsetPolygonHitbox(object, hitbox)
    else
      this.recalculatePolygonHitbox(object, hitbox)
  }
  static offsetPolygonHitbox(object, hitbox) {
    let offset = object.transform.position.clone().sub(object.performanceData.previousPosition)
    for(let body of hitbox.bodies) {
      for(let vertex of body.vertices) {
        vertex.x += offset.x
        vertex.y += offset.y
      }
    }
  }
  static recalculatePolygonHitbox(object, hitbox) {
    /* resets position to the hitbox definition */
    for(let i = 0; i < hitbox.bodies.length; i++) {
      for(let j = 0; j < hitbox.bodies[i].vertices.length; j++) {
        hitbox.bodies[i].vertices[j].x = object.transform.position.x + hitbox.definition[i].vertices[j].x
        hitbox.bodies[i].vertices[j].y = object.transform.position.y + hitbox.definition[i].vertices[j].y
      }
    }
    /* rotate and return to the object's position */
    for(let b = 0; b < hitbox.bodies.length; b++) {
      for(let v = 0; v < hitbox.bodies[b].vertices.length; v++) {
        hitbox.bodies[b].vertices[v].x = hitbox.definition[b].vertices[v].x
        hitbox.bodies[b].vertices[v].y = hitbox.definition[b].vertices[v].y
      }
      hitbox.bodies[b].rotate(-object.transform.rotation)
      for(let v = 0; v < hitbox.bodies[b].vertices.length; v++) {
        hitbox.bodies[b].vertices[v].x += object.transform.position.x
        hitbox.bodies[b].vertices[v].y += object.transform.position.y
      }
    }
  }
  //#endregion
}

class HitboxVault extends Component {
  constructor(gameObject, hitboxes = []) {
    super(gameObject)
    this.hitboxes = hitboxes ?? []
  }
  addHitbox(hitbox) {
    this.hitboxes.push(hitbox)
  }
  update() {
    for(let hitbox of this.hitboxes)
      hitbox.update()
  }
}

class CircleHitbox extends Hitbox {
  constructor(gameObject, radius, color) {
    super(gameObject, color)
    this.type = "circle"
    this.radius = radius
    this.radiusDefault = radius
  }
  clone(gameObject) {
    return new CircleHitbox(gameObject, this.radius, this.color)
  }
  update() {
    
  }
  get boundingBox() {
    return new BoundingBox(
      this.gameObject.transform.position.x - this.radius,
      this.gameObject.transform.position.y - this.radius,
      this.radius * 2,
      this.radius * 2,
    )
  }
}

class PolygonHitbox extends Hitbox {
  constructor(gameObject, bodies, color) {
    super(gameObject, color)
    this.type = "polygonHitbox"
    this.bodies = bodies
    this.definition = _.cloneDeep(this.bodies)
    Hitbox.recalculatePolygonHitbox(gameObject, this)
  }
  clone(attachTo) {
    return new PolygonHitbox(attachTo, _.cloneDeep(this.definition), this.color)
  }
  //#region hitbox manipulation methods
  addBody(body) {
    if(!body)
      console.error('please specify body')
    this.bodies.push(body)
    this.definition.push(_.cloneDeep(body))
  }
  offsetBody(body, offset) {
    let [indexB, indexV] = this.getIndices(body, null)
    this.definition[indexB].vertices.forEach(vert => {
      this.offsetVertex(vert, offset)
    })
  }
  removeBody(body) {
    let index = this.bodies.indexOf(body)
    this.definition.splice(index, 1)
    this.bodies = _.cloneDeep(this.definition)
  }
  addVertex(body) {
    let ind = this.bodies.indexOf(body)
    let b = this.definition[ind]
    let first = b.vertices[0]
    let second = b.vertices[1]

    let diff = new Vector(first.x - second.x, first.y - second.y)
    diff.mult(0.5)
    b.vertices.push(
      {
        x: first.x + diff.x,
        y: first.y + diff.y
      }
    )
    this.bodies = _.cloneDeep(this.definition)
  }
  offsetVertex(vert, offset) {
    vert.x += offset.x
    vert.y += offset.y
  }
  movePoint(body, point, offset) {
    console.log(body, point, offset)
    let [indexB, indexV] = this.getIndices(body, point)
    let vert = this.definition[indexB].vertices[indexV]
    this.offsetVertex(vert, offset)
  }
  getIndices(body, point) {
    return [this.bodies.indexOf(body), body.vertices.indexOf(point)]
  }
  removePoint(body, point) {
    if(body.vertices.length <= 3) return
    let [indexB, indexV] = this.getIndices(body, point)
    let vert = this.definition[indexB].vertices[indexV]
    this.definition[indexB].vertices.splice(indexV, 1)
    this.bodies = _.cloneDeep(this.definition)
  }
  //#endregion
  update() {
    Hitbox.updatePolygonHitbox(this.gameObject, this)
  }
  get boundingBox() {
    let arrayX = []
    let arrayY = []
    this.bodies.forEach(body => {
      body.vertices.forEach(vert => {
        arrayX.push(vert.x)
        arrayY.push(vert.y)
      })
    })
    let left = Math.min(...arrayX)
    let top  = Math.min(...arrayY)
    let right = Math.max(...arrayX) - left
    let bottom = Math.max(...arrayY) - top

    return new BoundingBox(
      left,
      top,
      right,
      bottom,
    )
  }
  static default(gameObject) {
    return new PolygonHitbox(gameObject, 
      [
        PolygonBuilder.Square(50, {x: -25, y: -25})
      ]
    )
  }
}

class BoxHitbox extends Hitbox {
  constructor(gameObject, w, h, color) {
    super(gameObject, color)
    this.type = "box"
    this.positionOffset = new Vector()
    this.w = w
    this.h = h
  }
  clone(attachTo) {
    return new BoxHitbox(attachTo, this.w, this.h, this.color)
  }
  update() {
    this.x = this.gameObject.transform.position.x + this.positionOffset.x
    this.y = this.gameObject.transform.position.y + this.positionOffset.y
  }
  get boundingBox() {
    return new BoundingBox(
      this.gameObject.transform.position.x - this.w/2 + this.positionOffset.x,
      this.gameObject.transform.position.y - this.h/2 + this.positionOffset.y,
      this.w,
      this.h
    )
  }
  static default() {
    return new BoxHitbox(50, 50)
  }
}

class FastCircleHitbox extends Hitbox {
  constructor(gameObject, radius, color) {
    super(gameObject, color)
    this.type = "fastCircle"
    this.radius = radius
    this.radiusDefault = radius
  }
  clone(attachTo) {
    return new FastCircleHitbox(attachTo, this.radius, this.color)
  }
  update() {

  }
  testAgainstVector(testVector) {
    let hitboxPosition = this.gameObject.transform.position
    let necessaryDistance = this.radius
    let vectorRelativePosition = testVector.copy.sub(hitboxPosition)
    let absoluteOffsetValues = [Math.abs(vectorRelativePosition.x), Math.abs(vectorRelativePosition.y)]
    let [smaller, larger] = [Math.min(...absoluteOffsetValues), Math.max(...absoluteOffsetValues)]
    
    //if the vector is inside the fast-distance "diamond shape" the collision is successful either way
    if(testVector.fastDistance(hitboxPosition) < necessaryDistance) 
      return true
    
    //increase the necessary distance by multiplying it by a value between 1 and SQRT2, based on how close the larger and smaller testVector offset dimensions are
    necessaryDistance *= 1 + (smaller / larger) * SQRT2 
    
    if(testVector.fastDistance(hitboxPosition) < necessaryDistance)
      return true
    
    return false
  }
  get boundingBox() {
    return new BoundingBox(
      this.gameObject.transform.position.x - this.radius,
      this.gameObject.transform.position.y - this.radius,
      this.radius * 2,
      this.radius * 2,
    )
  }
}

class BoundingBox {
  constructor(x, y, w, h) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.type = "box"
    this.positionOffset = new Vector()
  }
  expand(amount) {
    this.w += amount * 2
    this.h += amount * 2
    this.x -= amount
    this.y -= amount
    return this
  }
  get position() {
    return new Vector(this.x - this.w/2, this.y - this.h/2)
  }
}

class RigidBody extends Component {
  constructor(gameObject) {
    super(gameObject)
  }
  update() {
    
  }
}
class Reactor extends Component {
  constructor(gameObject, data) {
    super(gameObject)
    this.power = data.power //the power it can provide
    this.powerMax = data.powerMax //maximum power this can provide upon upgrading
    this.powerFree = this.power
  }
  upgrade() {
    if(this.power >= this.powerMax) return
    this.power++
    this.powerFree++
  }
  unpower() {
    for(let system of this.gameObject.shipSystems) {
      this.gameObject[system].unpower()
    }
  }
  repower() {
    for(let system of this.gameObject.shipSystems) {
      this.gameObject[system].repower()
    }
  }
  update() {
    
  }
}
class Wreck extends Component {
  constructor(gameObject, objData) {
    super(gameObject, objData)
    this.fragmentCount = objData.count
    this.fragments = []
  }
  activate() {
    this.generateFragments()
    this.createExplosion()
    
    setTimeout(() => GameObject.destroy(this.gameObject), 0)
    
    if(this.gameObject === player.ship)
      gameManager.endGame()
  }
  createExplosion() {
    let transform = this.gameObject.transform.clone()
        transform.angularVelocity = 0
        transform.velocity.set(0)
    GameObject.create("explosion", "default", {transform, SFXName: "explosionDefault"}, {world: this.gameObject.gameWorld})
  }
  generateFragments() {
    let createPopupForWreckByIndex = Random.int(0, this.fragmentCount - 1)
    
    for(let i = 0; i < this.fragmentCount; i++) {
      let fragment = this.createFragment(i)
      if(i === createPopupForWreckByIndex && this.gameObject !== player.ship) {
        new UILootingPopupComponent(game, fragment, this.gameObject.cargo)
      }
        
    }
  }
  createFragment(index) {
    let hitbox = this.gameObject.wreckHitboxVault.hitboxes[index]
    let transform = this.gameObject.transform.clone()
        transform.angularVelocity += Random.float(-1.0, 1.0)
    let fragment = GameObject.create(
      "fragment", 
      "name", 
      {
        transform,
        parent: this.gameObject,
        fragmentData: {
          hitbox, 
          index
        }
      },
      {world: this.gameObject.gameWorld}
    )
    this.fragments.push(fragment)
    return fragment
  }
  update() {
    
  }
}
class ShipSystem extends Component {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.power = 0
    this.powerMax = data.powerMax ?? 1
    this.level = data.level ?? 1
    this.levelMax = data.levelMax ?? 1
    this.powered = false
    this.previousPower = null
  }
  addPower() {
    if(this.power >= this.powerMax) return

    this.power++ 
    this.powered = true
  }
  removePower() {
    if(this.power <= 0) {
      this.powered = false
      this.power = 0
      return
    }
    this.power--
  }
  unpower() {
    if(!this.powered) return

    this.previousPower = this.power
    while(this.powered)
      this.removePower()
    this.onUnpower()
  }
  repower() {
    if(this.powered) return

    while(this.power < this.previousPower)
      this.addPower()
    this.onRepower()
  }
  onUnpower() {
    //custom method for handling additional logic    
  }
  onRepower() {
    //custom method for handling additional logic      
  }
  upgrade() {
    throw "provide a new upgrade method"
  }
}
class HullSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.level = data.level
    this.levelMax = data.levelMax
    this.current = data.level
    this.impactResistance = data.impactResistance

    this.coatingLayers = 0

    this.timers = new Timer(
      ["invulnerableWindow", 1500, {loop: false, active: false, onfinish: this.toggleInvulnerability.bind(this)}]
    )
  }
  upgrade() {
    if(this.level >= this.levelMax) return
    this.level++
    this.current = this.level
  }
  repair() {
    if(this.current >= this.level) return
    this.current++
    if(this.gameObject === player.ship)
      this.handlePlayerShipHullRepair()
  }
  toggleInvulnerability() {
    this.invulnerable = !this.invulnerable
    this.setSpriteInvulnerableState()
  }
  setSpriteInvulnerableState() {
    if(this.invulnerable) {
      this.gameObject.sprite.hullInvulnerableAnimation.renderable = true
      this.gameObject.sprite.hullInvulnerableAnimation.alpha = 1
      this.gameObject.sprite.hullInvulnerableAnimation.loop = false
      this.gameObject.sprite.hullInvulnerableAnimation.gotoAndPlay(0)
      this.gameObject.sprite.container.filters = [filters.invulnerable]
    }
    else {
      this.gameObject.sprite.hullInvulnerableAnimation.renderable = false
      this.gameObject.sprite.container.filters = []
    }
  }
  damage(collisionEvent) {
    if(this.invulnerable) return

    if(this.coatingLayers)
      this.processCoatingDamage()
    else
      this.processHullDamage(collisionEvent.impactDamage)

    this.createParticles(collisionEvent)
  }
  processCoatingDamage() {
    this.coatingLayers--
    this.gameObject.sprite.coatingLayer.gotoAndStop(this.coatingLayers)
  }
  processHullDamage(amount) {
    this.current -= amount
    if(this.current <= 0)
      this.gameObject.wreck.activate()
    
    this.toggleInvulnerability()
    
    if(this.gameObject === player.ship) 
      this.handlePlayerShipHullDamage()
      
    this.timers.invulnerableWindow.start()
  }
  handlePlayerShipHullDamage() {
    gameUI.animateHullDamage()
    game.camera.shake()
    gameUI.updateShipHullUI()
    AudioManager.playSFX("hullDamage")
  }
  handlePlayerShipHullRepair() {
    gameUI.animateHullRepair()
    gameUI.updateShipHullUI()
    AudioManager.playSFX("hullRepair")
  }
  handleImpact(collisionEvent) {
    if(collisionEvent.impactSpeed > this.impactResistance)
      this.damage(collisionEvent)
  }
  updateInvulnerableAnimation() {
    let offsetFromEnd = 500
    let startValueAbsolute = this.timers.invulnerableWindow.duration - offsetFromEnd
    if(this.timers.invulnerableWindow.currentTime >= startValueAbsolute) {
      let alphaRedux = Ease.InOut(this.timers.invulnerableWindow.currentTime - startValueAbsolute, 0, 1, offsetFromEnd)
      this.gameObject.sprite.hullInvulnerableAnimation.alpha = 1 - alphaRedux
    }
  }
  createParticles(collisionEvent) {
    let particleOrigin = this.setParticleOrigin(collisionEvent)

    let particleCount = Random.int(1, Math.min(Math.ceil(collisionEvent.impactSpeed / 100), 5))
    collisionEvent.impactDamage ? 
    particleCount = particleCount : 
    particleCount = 1
    
    let firstParticleVelocity = 
    Vector.fromAngle(
      this.gameObject.transform.position.angleTo(particleOrigin)
    )
    .mult(Random.int(1, 80))

    let spawnAttempts = 0
    let maxSpawnAttempts = 30

    let transforms = [
      new Transform(particleOrigin, firstParticleVelocity, Random.float(0, TAU))
    ]
    createTransforms:
    for(let i = 0; i < particleCount; i++) {
      spawnAttempts++
      let position = particleOrigin.clone().add(
        new Vector(
          Random.int(30, 60) * Random.from(-1, 1), 
          Random.int(30, 60) * Random.from(-1, 1)
        )
      )
      if(spawnAttempts > maxSpawnAttempts) {
        console.warn("> 50 attempts to spawn particles, breaking loop prematurely")
        break
      }
      if(!Collision.auto(position, this.gameObject.hitbox)) {
        i--
        continue
      }

      let velocity = Vector.fromAngle(this.gameObject.transform.position.angleTo(position)).mult(Random.int(4, 40))
      let rotation = Random.float(0, TAU)
      transforms.push(
        new Transform(
          position, 
          velocity,
          rotation
        )
      )
    }
    spawnParticles:
    for(let transform of transforms) {
      GameObject.create(
        "particle",
        this.gameObject.name + "HullDamage",
        {
          transform
        },
        {world: this.gameObject.gameWorld}
      )
    }
  }
  setParticleOrigin(collisionEvent) {
    let particleOrigin
    if(collisionEvent.collisionPoint) {
      particleOrigin = collisionEvent.collisionPoint.clone()
    }
    else {
      let otherObject = 
      collisionEvent.obj1 === this.gameObject ? 
      collisionEvent.obj2 : 
      collisionEvent.obj1

      if(!otherObject)
        return particleOrigin = this.gameObject.transform.position.clone()
        
      let angle = GameObject.angle(this.gameObject, otherObject)
      let positionOffset = 
      Vector.fromAngle(angle)
        .mult(
          Math.min(
            this.gameObject.hitbox.boundingBox.w/2, 
            this.gameObject.hitbox.boundingBox.h/2
          )
        )
      particleOrigin = this.gameObject.transform.position.clone().add(positionOffset)
    }
    return particleOrigin
  }
  update() {
    this.updateInvulnerableAnimation()
  }
}
class StealthSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.active = false
    this.previouslyVisible = []
  }
  activate() {
    if(this.active) return
    this.active = true
    this.previouslyVisible = this.gameObject.sprite.all.filter(s => s.renderable)
    this.setSpritesVisibility(true)
  }
  deactivate() {
    if(!this.active) return
    this.active = false 
    this.setSpritesVisibility(false)
  }
  toggle() {
    this.active ? this.deactivate() : this.activate()
  }
  setSpritesVisibility(stealthActive) {
    this.gameObject.sprite.all.forEach(sprite => {
      sprite.alpha = 1.0 * !stealthActive
    })
    StealthSystem.visibleSpriteTypes.forEach(sprite => {
      this.gameObject.sprite[sprite].renderable = stealthActive
      this.gameObject.sprite[sprite].alpha = 1.0 * stealthActive
    })
  }
  update() {
    
  }
  static visibleSpriteTypes = ["stealthLinework", "stealthFill", "minimapIcon"]
}
class EngineSystem extends ShipSystem {
  constructor(gameObject, systemData) {
    super(gameObject, systemData)
    this.maxSpeed = systemData.maxSpeed
    this.acceleration = systemData.acceleration
    this.glideReduction = systemData.glideReduction
    this.angularVelocity = systemData.angularVelocity
    this.targetSpeed = 0
  }
  updateEngineSprite() {
    if(!this.powered) {
      Sprite.updateFlames(this.gameObject, null)
      return
    }

    let speed = this.gameObject.transform.velocity.length()
    if(speed >= this.maxSpeed * 0.6) {
      Sprite.updateFlames(this.gameObject, "high")
    }
    else
    if(speed >= this.maxSpeed * 0.3) {
      Sprite.updateFlames(this.gameObject, "medium")
    }
    else 
    {
      Sprite.updateFlames(this.gameObject, "low")
    }
  }
  onRepower() {
    if(this.gameObject === player?.ship)
      AudioManager.playLoopedAudio("SFX", "shipEngine")
  }
  onUnpower() {
    if(this.gameObject === player?.ship)
      AudioManager.stopLoopedAudio("SFX", "shipEngine")
  }
  update() {
    this.updateEngineSprite()
  }
}
class SkipSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.ready = true
    this.active = false
    this.positionStart = new Vector()
    this.positionAdd = new Vector()

    this.timers = new Timer(
      ["recharge", SkipSystem.rechargeTimeMS, {loop: false, active: false, onfinish: this.recharge.bind(this)}],
      ["skip", SkipSystem.skipDurationMin,    {loop: false, active: false, onfinish: this.finish.bind(this)}],
    )
  }
  activate(destination) {
    if(!this.ready) return
    if(this.gameObject.state.is("docking", "docked", "undocking")) return

    this.active = true
    this.ready = false
    
    let distance = destination.clone().sub(this.gameObject.transform.position)
    let duration = Math.max(SkipSystem.skipDurationMin, distance.length())

    this.timers.skip.duration = duration
    this.positionStart = this.gameObject.transform.position.clone()
    this.positionAdd = distance
    this.gameObject.state.set("skipping")
    this.gameObject.transform.velocity.set(0)
    this.gameObject.enterVoid()
    this.gameObject.sprite.vwbOutline.renderable = false
    this.playTravelAnimation(destination)
    this.gameObject.sprite.container.filters = [filters.vwb, filters.glitch]

    this.timers.recharge.start()
    this.timers.skip.start()
  }
  playTravelAnimation(destination) {
    let [submerge, emerge] = [this.gameObject.sprite.travelAnimationSubmerge, this.gameObject.sprite.travelAnimationEmerge]
    let layer = this.gameObject.gameWorld.layers.overlays
    let alpha = 0.3
    layer.addChild(submerge)
    layer.addChild(this.gameObject.sprite.travelAnimationEmerge)
    
    submerge.rotation = this.gameObject.transform.rotation
    submerge.renderable = true
    submerge.loop = false
    submerge.alpha = alpha
    submerge.position.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y)
    submerge.gotoAndPlay(0)
    submerge.onComplete = () => {
      submerge.renderable = false
      layer.removeChild(submerge)
    }

    emerge.rotation = this.gameObject.transform.rotation
    emerge.position.set(destination.x, destination.y)
    emerge.onFrameChange = () => {
      if(emerge.currentFrame < 5) {
        emerge.alpha = clamp((emerge.currentFrame / 5 * alpha), 0, 1)
      }
      if(emerge.currentFrame === 0) {
        emerge.renderable = false
        layer.removeChild(emerge)
      }
    }
    setTimeout(() => {
      emerge.animationSpeed = submerge.animationSpeed * -1
      emerge.renderable = true
      emerge.loop = false
      emerge.alpha = alpha
      emerge.gotoAndPlay(emerge.totalFrames - 1)
    }, Math.max(0, this.timers.skip.duration - 450))
  }
  onActive() {
    this.moveGameObject()
    this.scaleGlitchFilter()
  }
  finish() {
    this.active = false
    this.gameObject.exitVoid()
    this.gameObject.sprite.container.filters = []
    this.gameObject.transform.velocity.set(0)
    Hitbox.recalculatePolygonHitbox(this.gameObject, this.gameObject.hitbox)
    setTimeout(() => {
      this.gameObject.state.ifrevert("skipping")
    }, SkipSystem.shipImmobilizeTime)
  }
  moveGameObject() {
    this.gameObject.transform.position.set(
      Ease.InOut(this.timers.skip.currentTime, this.positionStart.x, this.positionAdd.x, this.timers.skip.duration),
      Ease.InOut(this.timers.skip.currentTime, this.positionStart.y, this.positionAdd.y, this.timers.skip.duration),
    )
  }
  scaleGlitchFilter() {
    let halfwayPoint = this.timers.skip.duration / 2
    let scale = Ease.Linear(this.timers.skip.currentTime, 0, 1, this.timers.skip.duration)

    if(this.timers.skip.currentTime > halfwayPoint)
      scale = 1 - scale
    filterManager.scaleGlitchFilter(scale)
  }
  async recharge() {
    this.ready = true
    this.gameObject.sprite.vwbOutline.renderable = true
    await waitFor(125)
    this.gameObject.sprite.vwbOutline.renderable = false
    await waitFor(125)
    this.gameObject.sprite.vwbOutline.renderable = true
    await waitFor(125)
    this.gameObject.sprite.vwbOutline.renderable = false
    await waitFor(125)
    this.gameObject.sprite.vwbOutline.renderable = true
  }
  updateUISkipCharge() {
    let chargePercentage
    if(this.ready)
      chargePercentage = 100
    else
      chargePercentage = (this.timers.recharge.currentTime / SkipSystem.rechargeTimeMS) * 100

    let uiGraphicStateCount = 6
    let chargeStep = Math.floor(chargePercentage / (100 / uiGraphicStateCount))
    Q("#ship-skip-charge-icon").style.backgroundImage = `url(assets/ui/skipCharge/skipChargeGraphic000${chargeStep}.png)`
  }
  update() {
    if(this.active)
      this.onActive()
    if(this.gameObject === player.ship)
      this.updateUISkipCharge()
  }
  static skipDurationMin = 480 
  static shipImmobilizeTime = 150
  static rechargeTimeMS = 4500
}
class BoosterSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.strength = data.strength
    this.rechargeTime = data.rechargeTime
    this.type = data.type
    this.ready = true
    this.active = false
  }
  activate() {
    if(!this.powered) return
    this.active = true
    this["activate" + this.type.capitalize()]()
  }
  deactivate() {
    this.active = false
  }
  //#region type specific methods
  activateContinuous() {
    this.active = true
  }
  continuous() {
    if(!this.active) return

    let angle = this.gameObject.transform.position.angleTo(mouse.worldPosition)
    let v = Vector.fromAngle(angle).mult(this.strength * dt)
    this.gameObject.transform.velocity.add(v)
  }
  activatePulse() {

  }
  pulse() {
    let vel = this.gameObject.transform.velocity
    .clone()
    .normalize()
    .mult(this.strength)

    this.gameObject.transform.velocity.setFrom(vel)
  }
  //#endregion
  updateSprite() {
    this.active ? this.gameObject.sprite.boostersIndicator.renderable = true : this.gameObject.sprite.boostersIndicator.renderable = false
    if(!this.gameObject.sprite.boostersGlow) return
    this.active ? this.gameObject.sprite.boostersGlow.renderable = true : this.gameObject.sprite.boostersGlow.renderable = false
  }
  update() {
    this[this.type]()
    this.updateSprite()
  }
}
class BrakeSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.strength = data.strength
    this.active = false
    this.auto = true
  }
  brake() {
    this.gameObject.transform.velocity.mult(
      (1 - (this.strength/50) * dt)
    )
    if(this.gameObject.transform.velocity.length() < 0.8)
      this.gameObject.transform.velocity.set(0)
    
    if(this.gameObject.transform.velocity.length() !== 0)
      this.gameObject.sprite.brakeIndicator.renderable = true
    else
      this.gameObject.sprite.brakeIndicator.renderable = false

  }
  notBrake() {
    this.gameObject.sprite.brakeIndicator.renderable = false
  }
  toggleAuto() {
    this.auto = !this.auto
    this.setTargetSpeed()
    Q(`#brakes-off-warning`).classList.toggle("hidden")
  }
  setTargetSpeed() {
    this.targetSpeed = this.gameObject.transform.velocity.length()
  }
  matchVelocityToTargetSpeed() {
    let marginOfError = 5

    if(this.gameObject.transform.velocity.length() < this.targetSpeed - marginOfError) 
      this.gameObject.accelerate()
    else
    if(this.gameObject.transform.velocity.length() > this.targetSpeed + marginOfError) 
      this.gameObject.decelerate()
  }
  update() {
    if(this.active || (this.auto && this.active))
      this.brake()
    else
      this.notBrake()
    
    if(!this.auto)
      this.matchVelocityToTargetSpeed()
  }
}
class CargoSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.capacity = data.capacity
    this.items = []
    for(let item of data.items)
      this.addItems(new Item(item))
  }
  removeItems(...items) {
    items.forEach(i => this.items.remove(i))
  }
  removeItemByName(name) {
    let item = this.findItemByName(name)
    if(item) {
      this.removeItems(item)
      return true
    }
    else {
      return false
    }
  }
  transferItem(item) {
    this.removeItems(item)
    return item
  }
  addItems(...items) {
    for(let item of items) {
      if(this.isFull) {
        this.displayFullWarning()
        break
      }
      this.items.push(item)
    }
  }
  displayFullWarning() {
    console.warn("Ship cargo is full. Any overflowing items have been lost to the void.")
  }
  findItemByName(name) {
    return this.items.find(i => i.name === name) || null
  }
  update() {

  }
  get isFull() {
    return this.items.length === this.capacity
  }
}
class ShieldSystem extends ShipSystem {
  constructor(gameObject, data) {
    super(gameObject, data)
    this.type = data.type
    this.ready = false
    this.active = false
    this.shieldData = data.shieldData

    if(this.gameObject.hitbox)
      this.setupShield.bind(this)
    else
      this.gameObject.onHitboxLoad = this.setupShield.bind(this)

    this.timers = new Timer()
  }
  //#region setup
  setupShield() {
    this[`setup${this.type.capitalize()}Shield`]()
  }
  setupBubbleShield() {
    let radius = this.gameObject.hitbox.boundingBox.w/2 + this.shieldData.sizeGrowth
    this.hitbox = new CircleHitbox(this.gameObject, radius, colors.hitbox.shields)
  }
  setupHardLightShield() {
    let radius = this.gameObject.hitbox.boundingBox.w/2 + 50
    this.hitbox = new CircleHitbox(this.gameObject, radius, colors.hitbox.shields)
  }
  setupForceFieldShield() {
    this.hitbox = this.gameObject.hitbox.clone(this.gameObject)
    if(this.hitbox.type === "circle") {
      this.hitbox.radius += this.shieldData.effectiveDistance * 2
    }
    if(this.hitbox.type === "polygonHitbox") {
      this.hitbox.definition.forEach(body => {
        body.vertices.forEach(vert => {
          let angle = new Vector(vert.x, vert.y).angle()
          let direction = Vector.fromAngle(angle)

          direction.mult(this.shieldData.effectiveDistance)
          vert.x += direction.x
          vert.y += direction.y
        })
      })
    }
    if(this.hitbox.type === "box") {
      this.hitbox.w += this.shieldData.effectiveDistance * 2
      this.hitbox.h += this.shieldData.effectiveDistance * 2
    }
  }
  setupPulseShield() {
    this.timers.add(
      ["pulseRecharge", this.shieldData.rechargeTimeMS, {loop: false, active: true, onfinish: this.pulseRecharge.bind(this)}]
    )
    this.hitbox = new CircleHitbox(this.gameObject, this.shieldData.distance, colors.hitbox.shields)
  }
  //#endregion
  activate() {
    this[this.type + "Activate"]()
  }
  //#region shield type specific methods
  pulse() {
    
  }
  pulseActivate() {
    if(!this.ready) return

    this.ready = false
    this.pulseUpdateSprites()
    this.pulseTestCollision()
    this.timers.pulseRecharge.start()
  }
  pulseUpdateSprites() {
    this.gameObject.sprite.shieldCharge.renderable = false

    let sprite = this.gameObject.sprite.shieldPulse
    this.gameObject.gameWorld.layers.overlays.addChild(sprite)
    sprite.position.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y)
    sprite.anchor.set(0.5)
    sprite.renderable = true
    sprite.animationSpeed = 0.25
    sprite.gotoAndPlay(0)
    sprite.loop = false
    sprite.rotation = mouse.shipAngle
    sprite.onComplete = () => sprite.renderable = false
  }
  pulseTestCollision() {
    let minAngle = mouse.shipAngle - this.shieldData.arcLength/2
    let maxAngle = mouse.shipAngle + this.shieldData.arcLength/2

    let targets = Collision.broadphase(this.gameObject.gameWorld, this.gameObject, {exclude: [Interactable]})
    targets.forEach(target => {
      let hasHit = false
      let isWithinHitbox = false
      let isWithinAngle = false

      let endPointOffset1 = new Vector(this.shieldData.distance, 0).rotate(mouse.shipAngle)
      let endPointOffset2 = endPointOffset1.clone()

      endPointOffset1.rotate(-this.shieldData.arcLength/2)
      endPointOffset2.rotate(this.shieldData.arcLength/2)

      let line1 = new Line(
        this.gameObject.transform.position.clone(),
        this.gameObject.transform.position.clone().add(endPointOffset1)
      )
      let line2 = new Line(
        this.gameObject.transform.position.clone(),
        this.gameObject.transform.position.clone().add(endPointOffset2)
      )
      let angle = GameObject.angle(this.gameObject, target)

      if(Collision.auto(target.hitbox, this.hitbox))
        isWithinHitbox = true
      if(angle > minAngle && angle < maxAngle)
        isWithinAngle = true
      if(Collision.auto(target.hitbox, line1))
        hasHit = true
      if(Collision.auto(target.hitbox, line2))
        hasHit = true
      if((isWithinAngle && isWithinHitbox) || hasHit)
        this.pulseParseCollision(target)
    })
  }
  pulseParseCollision(object) {
    let angle = GameObject.angle(this.gameObject, object)
    let distance = GameObject.distance(this.gameObject, object)
    let strength = ((this.shieldData.pulseStrength / distance ) / object.mass) * 1000
    let velocity = Vector.fromAngle(angle).mult(strength).clamp(1000)

    if(this.gameObject.vwb) {
      velocity.mult(5)
      object.handleImpact(CollisionEvent.fakeEvent(1, 100))
    }

    if(object instanceof Projectile)
      object.owner = null

    object.transform.velocity.add(velocity)
  }
  pulseRecharge() {
    this.ready = true
    this.gameObject.sprite.shieldCharge.renderable = true
  }
  hardLight() {
    this.hardLightTestCollision()
  }
  hardLightActivate() {
    this.active = !this.active
    this.active ? this.gameObject.sprite.shieldHardLightFront.renderable = true : this.gameObject.sprite.shieldHardLightFront.renderable = false
    this.active ? this.gameObject.sprite.shieldCharge.renderable = true         : this.gameObject.sprite.shieldCharge.renderable = false
  }
  hardLightTestCollision() {
    //assume that the disposition is set to front
    let arcLength = PI/2

    let minAngle = this.gameObject.transform.rotation - arcLength/2
    let maxAngle = this.gameObject.transform.rotation + arcLength/2

    let targets = Collision.broadphase(this.gameObject.gameWorld, this.gameObject, {solo: [Projectile]})
    targets.forEach(target => {
      let isWithinRadius = false
      let isWithinAngle = false
      
      let angle = GameObject.angle(this.gameObject, target)

      if(Collision.auto(target.hitbox, this.hitbox))
        isWithinRadius = true
      if(angle > minAngle && angle < maxAngle)
        isWithinAngle = true
      if(isWithinAngle && isWithinRadius)
        this.hardLightParseCollision(target)
    })
  }
  hardLightParseCollision(object) {
    object.handleImpact(CollisionEvent.fakeEvent(1, 0))
  }
  hardLightSetDisposition(disposition) {
    if(!disposition.matchAgainst("front", "flank", "sides")) throw "disposition: " + disposition + "not valid"

  }
  forceField() {
    let targets = Collision.broadphase(this.gameObject.gameWorld, this.gameObject, {exclude: [Interactable]})
    targets.forEach(target => {
      if(Collision.auto(target.hitbox, this.hitbox)) {
        if(Collision.isOwnerWithProjectileCollision(target, this.gameObject)) return

        Collision.repelObjects(target, this.gameObject, this.shieldData.strength)
      }
    })
  }
  forceFieldActivate() {
    this.active = !this.active
    this.active ? this.gameObject.sprite.shieldForceField.renderable = true : this.gameObject.sprite.shieldForceField.renderable = false

    //sets sprite scale to match the actual hitbox growth, and take into consideration that for polygon hitbox the growth is * 2
    let spriteScale = ((this.shieldData.effectiveDistance + this.shieldData.effectiveDistance * (this.hitbox instanceof PolygonHitbox)) / this.hitbox.boundingBox.w) + 1 
    this.gameObject.sprite.shieldForceField.scale.set(spriteScale)
    console.log(this.hitbox)
  }
  bubble() {

  }
  bubbleActivate() {
    this.active = !this.active
    this.active ? this.gameObject.sprite.shieldBubble.renderable = true : this.gameObject.sprite.shieldBubble.renderable = false

    let spriteScale = ((this.shieldData.sizeGrowth + this.shieldData.sizeGrowth * (this.hitbox instanceof PolygonHitbox)) / this.hitbox.boundingBox.w) + 1 
    this.gameObject.sprite.shieldBubble.scale.set(spriteScale)
  }
  //#endregion
  //#region input
  handleInput(event) {
    // if(!this.powered) return
    switch(event.type) {
      case "keydown"    : {this.onkeydown(event);    break}
      case "keyup"      : {this.onkeyup(event);      break}
      case "mousemove"  : {this.onmousemove(event);  break}
      case "mousedown"  : {this.onmousedown(event);  break}
      case "mouseup"    : {this.onmouseup(event);    break}
      case "click"      : {this.onclick(event);      break}
      case "wheel"      : {this.onwheel(event);      break}
    }
  }
  onkeydown(event) {
    if(event.code === binds.activateShields)
      this.activate()
  }
  onkeyup(event) {

  }
  onmousemove(event) {

  }
  onmousedown(event) {

  }
  onmouseup(event) {

  }
  onclick(event) {

  }
  onwheel(event) {

  }
  //#endregion
  drawHitbox() {
    Hitbox["draw" + this.hitbox.type.capitalize()]
    (this.gameObject, this.hitbox, this.gameObject.gameWorld.graphics, 1, colors.hitbox.noCollision)
  }
  update() {
    if(this.active)
      this[this.type]()

    if(this.hitbox) {
      this.hitbox.update()
      if(visible.hitbox)
        this.drawHitbox()
    }
  }
  static dispositionToAngleMaxAndMin() {
    if(disposition === "front") return
    if(disposition === "flank") return
    if(disposition === "sides") return
  }
}
class WeaponSystem extends ShipSystem {
  constructor(gameObject, systemData) {
    super(gameObject, systemData)
    this.powerFree = this.power
    this.createWeaponSlots(systemData.slots)
    this.weapons = []
    this.activeWeapon = null
    for(let weaponName of systemData.weapons)
      this.addWeapon(weaponName)
  }
  createWeaponSlots(slotCount) {
    this.slots = {}
    for(let i = 0; i < slotCount; i++)
      this.slots[i] = null
  }
  addWeapon(weaponName) {
    let weapon = new Weapon(this.gameObject, weaponName)
    this.weapons.push(weapon)

    let firstEmptySlot
    for(let key in this.slots) {
      if(this.slots[key] === null) {
        firstEmptySlot = key
        break
      }
    }
    if(firstEmptySlot === "0")
      this.activeWeapon = weapon
    if(firstEmptySlot === undefined)
      console.error("weapon cannot be added, all slots are taken")

    this.slots[firstEmptySlot] = weapon
    weapon.slotIndex = +firstEmptySlot
    
    setTimeout(() => {
      this.editShipSpriteWeapons(weapon, firstEmptySlot)
      if(this.gameObject === player.ship)
        gameUI.createUIWeaponComponent(weapon, this)
    }, 0)
  }
  editShipSpriteWeapons(weapon, slotIndex) {
    let sprite
    if(data.weapon[weapon.name].spriteCount) {
      if(weapon.canBeDismounted) 
        sprite = Sprite.animatedSprite("assets/weaponSprite/" + weapon.name + "0000.png", data.weapon[weapon.name].spriteCount)
      else
        sprite = Sprite.animatedSprite("assets/weaponSprite/_empty0000.png", 1)
      sprite.animationSpeed = 0.1
      sprite.loop = false
      sprite.gotoAndStop(0)
    }
    
    sprite.anchor.set(0.5)
    sprite.position.set(this.gameObject.weaponSlots[slotIndex].x, this.gameObject.weaponSlots[slotIndex].y)
    
    if(this.gameObject.weaponSlots[weapon.slotIndex].y > 0)
      sprite.scale.set(1, -1)

    this.gameObject.sprite.weapons.addChild(sprite)
    this.gameObject.sprite.all.push(sprite)
  }
  setActiveWeapon(weapon) {
    this.activeWeapon = weapon

    if(this.gameObject === player?.ship) 
      this.createWeaponSelectOverlay(this.weapons.indexOf(this.activeWeapon))
  }
  cycleActiveWeapon(direction) {
    let weaponIndex = this.weapons.indexOf(this.activeWeapon)
    if(direction === 1) 
      weaponIndex === this.weapons.length - 1 ? this.setActiveWeapon(this.weapons[0])     : this.setActiveWeapon(this.weapons[weaponIndex + 1])
    else 
      weaponIndex === 0                       ? this.setActiveWeapon(this.weapons.last()) : this.setActiveWeapon(this.weapons[weaponIndex - 1])
  }
  removeAllWeapons() {
    let indexOffset = 0
    let indices = []
    this.weapons.forEach((weapon, index) => {
      if(!weapon.canBeDismounted) return indexOffset--

      for(let key in this.slots)
        if(this.slots[key] === weapon)
          this.slots[key] = null

      indices.push(index + indexOffset)
    })
    this.gameObject.sprite.weapons.children = this.gameObject.sprite.weapons.children.filter((c, i) => indices.findChild(i) == null)
    this.weapons = this.weapons.filter(weapon => !weapon.canBeDismounted)
    console.log(this.weapons, this.slots)
  }
  removeWeapon(weapon) {
    throw "unfinished function"
  }
  powerWeapon(weapon) {
    weapon.powered = true
  }
  unpowerWeapon(weapon) {
    weapon.powered = false
  }
  toggleArmWeapons() {
    if(this.weapons.find(w => w.powered))
      this.disarmWeapons()
    else
      this.armWeapons()

    AudioManager.playSFX("buttonNoAction", 0.3)
  }
  disarmWeapons() {
    if(!this.weapons.find(w => w.powered)) return

    this.weapons.forEach(w => {
      w.powered = false
      w.ready = false
      w.charges = 0
      w.timers?.recharge?.reset()
      this.gameObject.sprite.weapons.children[w.slotIndex]?.gotoAndStop(0)
    })
    this.adjustWeaponSprites(-10, false)
  }
  armWeapons() {
    if(this.weapons.find(w => w.powered)) return

    this.weapons.forEach(w => {
      w.powered = true
      w.timers?.recharge?.start()
    })
    this.adjustWeaponSprites(10, true)
  }
  adjustWeaponSprites(shiftAmount, setToPowered) {
    let indexOffset = 0
    this.weapons.forEach((w, index) => {
      if(!w.canBeDismounted) return
      
      let sprite = this.gameObject.sprite.weapons.children[index + indexOffset]
      this.gameObject.weaponSlots[index].y > 0 ?
      sprite.position.set(sprite.position.x, sprite.position.y + shiftAmount) :
      sprite.position.set(sprite.position.x, sprite.position.y - shiftAmount)
      setToPowered ? sprite.filters = [] : sprite.filters = [filters.unpoweredWeapon]
    })
  }
  createWeaponSelectOverlay(slotIndex) {
    if(this.weapons.length === 0) return

    this.destroyWeaponSelectOverlay()
    this.weaponSelectOverlay = GameObject.create("gameOverlay", "weaponSelect", {}, {world: this.gameObject.gameWorld})
    this.weaponSelectOverlay.slotIndex = slotIndex
    this.updateWeaponSelectOverlay()

    AudioManager.playSFX("buttonNoAction", 0.15)
  }
  updateWeaponSelectOverlay() {
    if(this.weapons.length === 0)            return
    if(this.weaponSelectOverlay?.destroyed) return this.weaponSelectOverlay = null
    if(!this.weaponSelectOverlay)           return

    this.weaponSelectOverlay.transform.position.setFrom(
      this.gameObject.transform.position.clone().add(
        new Vector(
          this.gameObject.weaponSlots[this.weaponSelectOverlay.slotIndex].x,
          this.gameObject.weaponSlots[this.weaponSelectOverlay.slotIndex].y,
        ).rotate(this.gameObject.transform.rotation)
      )
    )
    this.weaponSelectOverlay.transform.rotation = this.gameObject.transform.rotation
  }
  destroyWeaponSelectOverlay() {
    if(this.weaponSelectOverlay) {
      GameObject.destroy(this.weaponSelectOverlay)
      this.weaponSelectOverlay = null
    }
  }
  onUnpower() {
    this.disarmWeapons()
  }
  onRepower() {
    this.armWeapons()
  }
  update() {
    let weaponPowerReduction = sum(...this.weapons.map(w => {
      if(w.powered)
        return w.power
      else
        return 0
    }))
    this.powerFree = this.power - weaponPowerReduction
    this.weapons.forEach(w => w.update())
    this.updateWeaponSelectOverlay()
  }
}
class Weapon extends Component {
  constructor(
    gameObject,
    name,
  ) {
    super(gameObject)
    let objectData = data.weapon[name]
    this.name = name
    this.displayName = objectData.displayName
    this.displayNameShort = objectData.displayNameShort

    for(let key in objectData.weaponData)
      this[key] = objectData.weaponData[key]
      
    for(let key in objectData.methods)
      this[key] = objectData.methods[key]
      
    this.powered = true
    this.ready = true
    this.slotIndex = null
    this.weaponNotReadyOverlay = null
    this.setup()
  }
  handleInput(event) {
    if(!this.powered) return
    this.showNotReadyOverlay(event.type)
    switch(event.type) {
      case "keydown"    : {this.onkeydown(event);    break}
      case "keyup"      : {this.onkeyup(event);      break}
      case "mousemove"  : {this.onmousemove(event);  break}
      case "mousedown"  : {this.onmousedown(event);  break}
      case "mouseup"    : {this.onmouseup(event);    break}
      case "click"      : {this.onclick(event);      break}
      case "wheel"      : {this.onwheel(event);      break}
    }
  }
  showNotReadyOverlay(type) {
    if(type !== this.fireMethod || this.ready) return
    this.destroyNotReadyOverlay()
    this.weaponNotReadyOverlay = GameObject.create(
      "gameOverlay",
      "weaponNotCharged",
      {},
      {world: this.gameObject.gameWorld}
    )
    AudioManager.playSFX("buttonNoAction", 0.1)
  }
  updateNotReadyOverlay() {
    this.weaponNotReadyOverlay?.transform.position.setFrom(
      this.gameObject.transform.position.clone().add(
        new Vector(
          this.gameObject.weaponSlots[this.slotIndex].x,
          this.gameObject.weaponSlots[this.slotIndex].y,
        ).rotate(this.gameObject.transform.rotation)
      )
    )
    if(this.weaponNotReadyOverlay?.destroyed)
      this.weaponNotReadyOverlay = null
  }
  destroyNotReadyOverlay() {
    if(this.weaponNotReadyOverlay)
      GameObject.destroy(this.weaponNotReadyOverlay)
    this.weaponNotReadyOverlay = null
  }
  update() {
    this.updateSpecific()
    this.updateNotReadyOverlay()
  }
}
class Coater extends ShipSystem {
  constructor(gameObject, objectData) {
    super(gameObject, objectData)
    this.active = false
    this.layersMax = objectData.layersMax
    this.timers = new Timer(
      ["coat", 4000, {loop: false, active: false, onfinish: this.completeCoating.bind(this)}]
    )
  }
  beginCoating() {
    if(this.active) return
    if(this.gameObject.hull.coatingLayers >= this.layersMax) return

    this.active = true
    this.gameObject.reactor.unpower()
    this.timers.coat.start()
  }
  cancelCoating() {
    if(!this.active) return
    
    this.onCoatingEnd()
    this.timers.coat.reset()
  }
  completeCoating() {
    this.onCoatingEnd()
    this.gameObject.hull.coatingLayers++
    this.gameObject.sprite.coatingLayer.gotoAndStop(this.gameObject.hull.coatingLayers)
  }
  onCoatingEnd() {
    this.active = false
    this.gameObject.reactor.repower()
  }
  update() {
    this.timers.update()
  }
}
class UIComponent {
  constructor(gameWindow) {
    gameWindow.uiComponents.push(this)
    this.gameWindow = gameWindow
    UIComponent.list.push(this)
  }
  handleInput(event) {
    this["handle" + event.type.capitalize()](event)
  }
  handleKeydown() {

  }
  handleKeyup() {

  }
  handleMousedown() {

  }
  handleMousemove() {

  }
  handleMouseup() {

  }
  handleClick() {

  }
  handleWheel() {

  }
  handlePointerdown() {

  }
  handlePointerup() {

  }
  handlePointermove() {

  }
  update() {
    
  }
  destroy() {

  }
  static list = []
  static destroy(component) {
    component.gameWindow.uiComponents.remove(component)
    this.list.remove(this)
    component.destroy()
  }
}
class UISliderComponent extends UIComponent {
  constructor(gameWindow, appendTo, hookedObject, propertyOnObject, sliderData = {range: [0, 100], steps: 100, onchange: null}) {
    super(gameWindow)
    this.gameWindow = gameWindow
    this.range = sliderData.range ?? [0, 100]
    this.steps = sliderData.steps ?? 100
    this.onchange = sliderData.onchange ?? function() { AudioManager.playSFX("buttonHover") }
    this.value = 0
    this.previousValue = 0
    this.hookedObject = hookedObject
    this.propertyOnObject = propertyOnObject
    this.active = false
    this.createHTML(appendTo)
  }
  createHTML(appendTo) {
    this.elementId = uniqueIDString()
    this.slider = El("div", "ui-slider-component", [["id", this.elementId]])
    this.sliderHandle = El("div", "ui-slider-handle")
    this.sliderTrack = El("div", "ui-slider-track")
    this.sliderTrackBackground = El("div", "ui-slider-track-background")
    for(let i = 0; i < this.steps; i++) {
      let backgroundCell = El("div", "ui-slider-background-cell inactive")
      this.sliderTrackBackground.append(backgroundCell)
    }

    this.slider.append(this.sliderHandle, this.sliderTrack, this.sliderTrackBackground)
    this.element = this.slider
    appendTo.append(this.element)
  }
  //#region input
  handleMousedown(event) {
    if(event.target.closest("#" + this.elementId)) {
      this.active = true
      this.updateValue(event)
      this.updateHookedObject()
    }
  }
  handleMousemove(event) {
    if(!this.active) return
    this.updateValue(event)
    this.updateHookedObject()
  }
  handleMouseup(event) {
    this.active = false
  }
  //#endregion
  getMouseOffset(event) {
    let boundingRect = this.element.getBoundingClientRect()
    let mouseRelativePosition = new Vector(event.clientX - boundingRect.left, event.clientY - boundingRect.top)
    let elementWidth = boundingRect.width
    let mouseOffset = (mouseRelativePosition.x / elementWidth)
    return mouseOffset
  }
  updateValue(event) {
    let offset = this.getMouseOffset(event)
    let stepSize = (this.range[1] - this.range[0]) / (this.steps)
    let valueBeforeRounding = ((this.range[1] - this.range[0]) * offset) + this.range[0]
        valueBeforeRounding = clamp(valueBeforeRounding, this.range[0], this.range[1])
    // this.value = Math.round(valueBeforeRounding)
    this.value = Math.round(valueBeforeRounding / stepSize) * stepSize

    if(this.value !== this.previousValue)
      this.onchange()

    this.updateVisual(offset)
    this.previousValue = this.value  
  }
  updateVisual(offset) {
    let sliderHandleWidth = this.sliderHandle.getBoundingClientRect().width
    this.sliderHandle.style.left = `calc(${clamp(offset * 100, 0, 100)}% - ${sliderHandleWidth/2}px)`

    //update background cells
    Array.from(this.element.querySelectorAll(".ui-slider-background-cell"))
    .forEach(element => element.classList.replace("active", "inactive"))
    
    for(let i = 0; i < this.steps * offset; i++) {
      this.element.querySelector(".ui-slider-background-cell.inactive")?.classList.replace("inactive", "active")
    }

    this.sliderTrack.style.width = clamp(offset * 100, 0, 100) + "%"
  }
  updateHookedObject() {
    this.hookedObject[this.propertyOnObject] = this.value
  }
  update() {

  }
  destroy() {

  }
}
class UIWeaponComponent extends UIComponent {
  constructor(gameWindow, appendTo, playerWeaponReference, weaponSystem) {
    super(gameWindow)
    this.weapon = playerWeaponReference
    this.weaponSystem = weaponSystem
    this.chargeBars = []
    this.chargesMax = this.weapon.chargesMax ?? this.weapon.chargeLevelMax ?? 1
    this.createHTML(appendTo)
  }
  createHTML(parentElement) {
    this.elementId = uniqueIDString()

    /* elements for the weapon selector */
    this.element =                El("div", "ui-weapon-container tooltip-popup", [["id", this.elementId]])
    this.icon =                   El("div", `weapon-icon`)
    this.titleElement =           El("div", "weapon-title", undefined, this.weapon.displayNameShort)
    this.weaponChargeContainer =  El("div", "selected-weapon-charge-state tooltip-popup")
    this.chargeIndicator =        El("div", `ui-weapon-container-charge-indicator ${this.weapon.type}`)

    this.icon.style.backgroundImage = `url(assets/weaponIcon/${this.weapon.name}.png)`
    this.titleElement.style.color = data.weapon[this.weapon.name].iconColor || `var(--color-${this.weapon.type})`
    
    /* element tooltip setup */
    this.element.dataset.parentelementid =      "ship-hull-and-weapon-panel"
    this.element.dataset.tooltipattachment =    "right"
    this.element.dataset.tooltip =              "Selected weapon"
    this.element.dataset.tooltipdescription =   "This weapon fires if you click somewhere."

    /* create charge bars */
    for(let i = 0; i < this.chargesMax; i++) {
      let bar = El("div", `selected-weapon-charge-bar ${this.weapon.type}`)
      this.weaponChargeContainer.append(bar)
      this.chargeBars.push(bar)
    }

    /* weapon slots for the ship graphic */
    this.weaponChargeContainer.dataset.parentelementid =    "ship-hull-and-weapon-panel"
    this.weaponChargeContainer.dataset.tooltipattachment =  "right"
    this.weaponChargeContainer.dataset.tooltip =            "Charges"
    this.weaponChargeContainer.dataset.tooltipdescription = "Current number of charges for this weapon."

    let weaponSlotYPositionGreaterThanZero = this.weaponSystem.gameObject.weaponSlots[+this.weapon.slotIndex].y > 0

    this.weaponSlot =                 El("div", `weapon-slot weapon-slot-${this.weapon.slotIndex}`)
    this.weaponSlotChargeIndicator =  El("div", `weapon-charge-indicator ${weaponSlotYPositionGreaterThanZero ? "right" : "left"}`)
    this.weaponChargeProgressBar =    El("div", "weapon-charge-progress-bar")
    this.weaponSlotIcon =             this.icon.cloneNode(true)

    this.weaponSlot.dataset.weaponcomponentid = this.elementId
    this.weaponSlot.dataset.playsfx = ""
    this.weaponSlot.dataset.sounds = "buttonClick"
    this.weaponSlot.dataset.playonevents = "mousedown"
    this.weaponSlot.onmouseenter = () => this.weaponSystem.createWeaponSelectOverlay(this.weapon.slotIndex)

    /* append stuff together */
    this.weaponSlot.append(this.weaponSlotIcon, this.weaponSlotChargeIndicator)
    
    this.weaponSlotChargeIndicator.append(this.weaponChargeProgressBar)
    Q("#ship-graphic").append(this.weaponSlot)

    this.element.append(this.chargeIndicator, this.icon, this.titleElement, this.weaponChargeContainer)
    parentElement.append(this.element)
  }
  handleMousedown(event) {
    if(event.target.closest("#" + this.elementId))
      player.ship.weapons.setActiveWeapon(this.weapon)
    if(event.target.closest(`.weapon-slot[data-weaponcomponentid='${this.elementId}'`))
      player.ship.weapons.setActiveWeapon(this.weapon)
  }
  toggleActiveState() {
    if(this.weaponSystem.activeWeapon !== this.weapon) return

    Qa(".ui-weapon-container").forEach(w => w.classList.remove("active"))
    this.element.classList.add("active")
  }
  toggleChargedState() {
    if(this.weapon.ready) {
      this.element.classList.add("charged")
      this.weaponSlot.classList.add("ready")
    }
    else {
      this.element.classList.remove("charged")
      this.weaponSlot.classList.remove("ready")
    }
  }
  updateWeaponChargePercentage() {
    if(!this.weapon.timers?.recharge) return

    let percentage = (this.weapon.timers.recharge.currentTime / this.weapon.chargeDurationMS) * 100
    let cssValue
    if(!this.weapon.ready && !this.weapon.charges && !percentage)
      cssValue = 0
    else
      cssValue = percentage || 100
    this.chargeIndicator.style.width =          cssValue + "%"
    this.weaponChargeProgressBar.style.height = cssValue + "%"
  }
  updateWeaponCharges() {
    let charges = this.weapon.charges ?? 1
    if(this.weapon.ready && !this.weapon.charges)
      charges = 1
    if(!this.weapon.ready && this.weapon.charges === 0)
      charges = 0

    for(let i = 0; i < this.chargeBars.length; i++) {
      if(charges > i)
        this.chargeBars[i].classList.add("active")
      else
        this.chargeBars[i].classList.remove("active")
    }
  }
  update() {
    this.updateWeaponCharges()
    this.updateWeaponChargePercentage()
    this.toggleActiveState()
    this.toggleChargedState()
  }
  destroy() {
    this.element.remove()
    this.weaponSlot.remove()
  }
}
class UILootingPopupComponent extends UIComponent {
  constructor(gameWindow, gameObject, cargoSystem) {
    super(gameWindow)
    this.gameObject = gameObject
    this.visible = {
      popup: false,
      indicator: false,
    }
    this.items = [...cargoSystem.items]
    this.createPopup()
    this.createIndicator()
  }
  createPopup() {
    this.element =  El("div", "looting-popup-container hidden")
    this.itemGrid = El("div", "looting-popup-item-grid")
    this.title =    El("div", "looting-popup-title", undefined, "Cargo")

    let slotCount = 6
    for(let i = 0; i < slotCount; i++) {
      let item
      if(this.items[i]) {
        item = Item.createItemElement(data.item[this.items[i].name], {smallItem: true})
        item.onclick = () => {
          player.ship.cargo.addItems(this.items[i])
          this.items.remove(this.items[i])
          item.replaceWith(Item.createEmptyItemElement({smallItem: true}))
        }
      }
      else 
      {
        item = Item.createEmptyItemElement({smallItem: true})
      }
      this.itemGrid.append(item)
    }

    this.element.append(this.title, this.itemGrid)
    Q("#game-ui").append(this.element)
  }
  showPopup() {
    if(this.visible.popup) return

    this.visible.popup = true
    this.element.classList.remove("hidden")
    this.element.animate(
      [{filter: "opacity(0)"}, {filter: "opacity(1)"}], 
      {duration: 500, easing: "ease-in-out"})
    .onfinish = () => this.element.style.filter = ""
  }
  hidePopup() {
    if(!this.visible.popup) return
    
    this.visible.popup = false
    this.element.animate([
      {filter: "opacity(1)"}, {filter: "opacity(0)"}
    ], {duration: 500, easing: "ease-in-out"})
    .onfinish = () => {
      this.element.classList.add("hidden")
      this.destroyIfNoCargo()
    }
  }
  update() {
    this.updateIndicator()
    this.updatePopup()
    this.updateVisibility()

    if(this.gameObject.destroyed)
      UIComponent.destroy(this)
  }
  updateVisibility() {
    let playerShipDistance = GameObject.distance(this.gameObject, player.ship)

    if(playerShipDistance < UILootingPopupComponent.maxDistanceToLoot) {
      this.showPopup()
      this.hideIndicator()
    }
    else {
      this.hidePopup()
      this.showIndicator()
    }
  }
  updatePopup() {
    let rect = this.element.getBoundingClientRect()
    let position = worldToClientPosition(game, this.gameObject.transform.position)
    position.x -= rect.width/2 + 120
    position.y -= rect.height/2 + 120

    position.x = clamp(position.x, UILootingPopupComponent.elementViewportInset, window.innerWidth - rect.width - UILootingPopupComponent.elementViewportInset)
    position.y = clamp(position.y, UILootingPopupComponent.elementViewportInset, window.innerHeight - rect.height - UILootingPopupComponent.elementViewportInset)

    this.element.style.left = position.x + "px"
    this.element.style.top = position.y + "px"
  }
  createIndicator() {    
    this.indicator = El("div", "looting-popup-indicator hidden")
    let text = El("div", "looting-popup-text", undefined, "Cargo left")
    let icon = El("img", "looting-popup-indicator-icon", [["src", "assets/icons/iconWarning.png"]])
    this.indicator.append(icon, text)
    Q("#game-ui").append(this.indicator)
  }
  showIndicator() {
    if(this.visible.indicator) return
    if(!this.items.length) return

    this.visible.indicator = true
    this.indicator.classList.remove("hidden")
    this.indicator.animate([
      {filter: "opacity(0)"}, {filter: "opacity(1)"}
    ], {duration: 500, easing: "ease-in-out"})
    .onfinish = () => this.indicator.style.filter = ""
  }
  hideIndicator() {
    if(!this.visible.indicator) return
    this.visible.indicator = false
    this.indicator.animate([
      {filter: "opacity(1)"}, {filter: "opacity(0)"}
    ], {duration: 500, easing: "ease-in-out"})
    .onfinish = () => this.indicator.classList.add("hidden")
  }
  updateIndicator() {
    let position = worldToClientPosition(game, this.gameObject.transform.position)
    this.indicator.style.left = position.x + "px"
    this.indicator.style.top = position.y + "px"
  }
  destroyIfNoCargo() {
    if(!this.items.length) 
      UIComponent.destroy(this)
  }
  destroy() {
    console.log("looting popup removed")
    this.element.remove()
    this.indicator.remove()
  }
  static elementViewportInset = 100
  static maxDistanceToLoot = 250
}
class Projectile extends GameObject {
  constructor(transform, name, owner, target) {
    super(transform)
    let objectData = data.projectile[name]
    this.type = "projectile"
    this.name = name

    this.impactDamage = objectData.impactDamage
    this.speed = objectData.speed
    this.owner = owner
    this.target = target

    this.mass = objectData.mass
    this.lifeMax = objectData.life
    this.life = objectData.life

    this.projectileData = objectData.projectileData

    this.components = [
      "sprite",
      "hitbox",
      "rigidbody"
    ]
    this.registerComponents(objectData)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  rotateToTarget() {
    if(!this.target) return
    //this is too overpowered, should just find out if to turn left or right, this makes it not fun

    let angle = GameObject.angle(this, this.target)

    this.transform.rotation = angle
    let vec = Vector.fromAngle(angle).mult(this.speed)
    this.transform.velocity.set(vec.x, vec.y)
  }
  matchRotationToVelocity() {
    this.transform.rotation = this.transform.velocity.angle()
  }
  //#region methods specific per projectile name
  updateBlackhole() {
    let objs = Collision.broadphase(game, this)
    objs.forEach(obj => {
      let distanceMax = 800
      let distance = this.transform.position.distance(obj.transform.position)
          distance = Math.max(distanceMax - distance, 0)

      let angle = this.transform.position.angleTo(obj.transform.position)
      let strength = 120
      let vec = Vector.fromAngle(angle)
      .mult(strength)
      .mult(distance / distanceMax)
      .mult(dt)

      if(distance < distanceMax) 
        obj.transform.velocity.add(vec)
    })
  }
  updateFireball() {

  }
  updateMissileHelios() {
    this.rotateToTarget()
    this.matchRotationToVelocity()
    let currentSpeed = this.transform.velocity.length()
    if(currentSpeed < this.speed)
      this.transform.velocity.mult(1 + 1.2 * dt * (this.speed / currentSpeed))
    else
      this.transform.velocity.mult(1 + 0.1 * dt)
  }
  updatePlasmaShotI() {
    this.matchRotationToVelocity()
  }
  updateTrapMissile() {
    this.matchRotationToVelocity()
  }
  updateDebris() {

  }
  updateSnakeMissile() {
    let offsetVector = 
    new Vector(
      0,
      Math.sin(Date.now() / 100) * 400 * dt, 
    ).rotate(this.transform.rotation)
    this.transform.position.add(offsetVector)
  }
  //#endregion
  handleImpact(event) {
    this[this.projectileData.onHit](event)
  }
  //#region onHit methods
  plasmaExplode(event) {
    GameObject.create(
      "explosion", 
      "plasma", 
      {
        transform: new Transform(
          this.transform.position.clone()
        ),
        SFXName: "explosionPlasma" + Random.int(1, 2),
        collisionGroup: this.collisionGroup
      },
      {
        world: this.gameWorld,
      }
    )
    GameObject.destroy(this)
  }
  explode(event) {
    GameObject.create(
      "explosion", 
      "default", 
      {
        transform: new Transform(
          this.transform.position.clone(),
          new Vector(Random.int(-5, 5), Random.int(-5, 5)),
          Random.float(0, TAU),
          0
        ),
        SFXName: "explosionDefault"
      },
      {
        world: this.gameWorld
      }
    )
    GameObject.destroy(this)
  }
  trapTarget(event) {
    let target
    event.obj1 === this ? target = event.obj2 : target = event.obj1
    if(target instanceof Ship) {
      GameObject.create("gameOverlay", "movementTrap", {parent: target}, {world: this.gameWorld})
      new StatusEffect(target, "movementTrap")
    }
    GameObject.destroy(this)
  }
  dieAndCreateParticles(event) {
    GameObject.create(
      "particle", 
      this.projectileData.particleName, 
      {
        transform: new Transform(
          this.transform.position.clone().add(new Vector(...Random.intArray(-8, 8, 2))),
          this.transform.velocity.clone().normalize(Random.int(2, 25)),
          Random.rotation(),
          Random.float(-PI/2, PI/2)
        )
      },
      {
        world: this.gameWorld
      }
    )
    GameObject.destroy(this)
  }
  //#endregion
  updateLife() {
    this.life -= 1000 * dt
    if(this.life <= 0) 
      GameObject.destroy(this)
  }
  deleteIfFarFromPlayer() {
    if(GameObject.distanceFast(this, player.ship) > data.detectCollisionWithinThisFastDistanceOfPlayer)
      GameObject.destroy(this)
  }
  update() {
    this["update" + this.name.capitalize()]()
    this.move()
    this.updateLife()
    this.deleteIfFarFromPlayer()
  }
}
class Station extends GameObject {
  constructor(transform, name) {
    super(transform)
    let objectData = data.station[name]
    this.type = "station"
    this.name = name
    this.mass = objectData.mass         ?? console.error("object mass (: number) missing", this)
    this.stationType = objectData.type  ?? console.error("missing station type")
    this.dockingPoints = []
    for(let point of objectData.dockingPoints)
      this.dockingPoints.push(new Vector(point.x, point.y))
    this.dockingPointsDefinition = _.cloneDeep(this.dockingPoints)
    this.wares = _.cloneDeep(objectData.wares)
    this.state = new State(
      "default",
      "player-docked"
    )
    this.components = [
      "sprite",
      "hitbox",
      "rigidbody",
    ]
    this.registerComponents(objectData)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  updateDockingPoints() {
    //rotate the docking points based on rotation
    this.dockingPoints.forEach((point, index) => {
      point.setFrom(this.dockingPointsDefinition[index])
      point.rotate(this.transform.rotation)

      if(visible.hitbox) {
        this.gameWorld.graphics.lineStyle(2, 0x00ff00, 1)
        this.gameWorld.graphics.drawCircle(point.x + this.transform.position.x, point.y + this.transform.position.y, 9)
      }
    })
  }
  onPlayerDock() {
    if(Fact.testForFact("should_show_station_overlays")) 
      this.setOverlayMenu(GameObject.create("gameOverlay", "overlayOpenStationMenu", {parent: player.ship}, {world: this.gameWorld}))

    AudioManager.playSFX("cardShimmer")
    this.setStationWares()
    inventory.enableStationTab()
    this.state.set("player-docked")
  }
  onPlayerUndock() {
    if(Fact.testForFact("should_show_station_overlays"))
      this.destroyOverlayMenu()
    
    inventory.disableStationTab()
    this.state.ifrevert("player-docked")
  }
  setOverlayMenu(newMenu) {
    if(!Fact.testForFact("should_show_station_overlays")) return
    
    this.destroyOverlayMenu()
    this.gameOverlayMenu = newMenu
  }
  destroyOverlayMenu() {
    if(!Fact.testForFact("should_show_station_overlays")) return
    
    if(this.gameOverlayMenu)      
      GameObject.destroy(this.gameOverlayMenu)
    this.gameOverlayMenu = null
  }
  updateDockOptionOverlay() {
    if(!Fact.testForFact("should_show_station_overlays")) return
    
    if(this.state.is("player-docked")) return
    if(this.gameWorld !== game) return
    let overlayName = "overlayDockIntoStation"
    let targetPoint
    let playerDistance
    for(let dockingPoint of this.dockingPoints) {
      let point = dockingPoint.clone().add(this.transform.position)
      let distance = point.distance(player.ship.transform.position)
      if(distance < Ship.maxDistanceToDock) {
        playerDistance = distance
        targetPoint = point
        break
      }
    }
    if(!targetPoint) {
      this.destroyOverlayMenu()
      return
    }
    
    if(!this.gameOverlayMenu || this.gameOverlayMenu.name === overlayName)
      this.setOverlayMenu(
        GameObject.create("gameOverlay", overlayName, {transform: new Transform(targetPoint)}, {world: this.gameWorld})
      )

    let ramp = 1.8
    let opacity = ramp - (playerDistance / (1 / ramp)) / Ship.maxDistanceToDock
    this.gameOverlayMenu.setOpacity(opacity)
  }
  setStationWares() {
    for(let category in this.wares)
      Q(`#station-row-items-${category}`).innerHTML = ""

    for(let category in this.wares) {
      let itemCount = +Q(`#station-row-items-${category}`).dataset.inventoryitemcount
      for(let i = 0; i < itemCount; i++) {
        let itemData = this.wares[category][i]

        let item
        if(itemData)  {
          item = Item.createItemElement(data.item[itemData.name], {enableDrag: true})
          item.dataset.warecategory = category
          item.dataset.isstationware = "true"
        } 
        else item = Item.createEmptyItemElement()

        Q(`#station-row-items-${category}`).append(item)
      }
    }
  }
  update() {
    this.move()
    this.updateDockingPoints()
    this.updateDockOptionOverlay()
  }
}
class Satellite extends GameObject {
  constructor(transform, name) {
    super(transform)
    let objectData = data.satellite[name]
    this.type = "satellite"
    this.name = name
    this.mass = objectData.mass ?? console.error("object mass (: number) missing", this)
    this.health = objectData.health
    this.components = [
      "sprite",
      "hitbox",
      "rigidbody",
      "wreckHitboxVault",
      "wreck",
    ]
    this.shipSystems = _.cloneDeep(objectData.systems)
    this.registerComponents(objectData)
    this.update()
  }
  takeDamage(amount) {
    this.health -= amount
    if(this.health <= 0)
      this.wreck.activate()
  }
  handleImpact(event) {
    this.takeDamage(event.impactDamage)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  update() {
    this.move()
  }
}
class Ship extends GameObject {
  constructor(transform, name, pilot) {
    super(transform)
    let objectData = data.ship[name]
    this.type = "ship"
    this.name = name
    this.pilot = pilot
    this.weaponSlots = objectData.weaponSlots
    this.mass = objectData.mass ?? console.error("object doesn't have mass")
    this.state = new State(
      "default",
      "skipping",
      "docking",
      "docked",
      "undocking",
    )
    this.components = [
      "hitbox",
      "wreckHitboxVault",
      "rigidbody",
      "sprite",
      "reactor",
      "hull",
      "skip",
      "wreck",
    ]
    this.shipSystems = _.cloneDeep(objectData.systems)
    this.registerComponents(objectData)

    this.dockData = {
      offset: new Vector(),
      origin: new Vector(),
      rotationInitial: 0,
      rotationOffset: 0,
      durationMin: 1500,
      station: null,
    }
    this.targetPosition = new Vector()

    this.timers = new Timer(
      ["dock", Ship.dockDurationMS, {loop: false, active: false, onfinish: this.dockFinish.bind(this)}],
    )
    this.autoPowerSystems(objectData.systems)
    setTimeout(() => this.createCaptain(pilot))
    //#endregion
  }
  rotate(direction) {
    if(!direction) throw "specify direction"
    if(this.state.is("docking", "docked", "undocking")) return
    if(!this.engine.powered) return
    if(this.stuck) return

    let max = this.engine.angularVelocity
    this.transform.angularVelocity += (max * direction) * this.engine.glideReduction
    if(this.transform.angularVelocity * direction > max) 
      this.transform.angularVelocity = max * direction
  }
  accelerate() {
    if(this.state.is("skipping", "docked", "docking", "undocking")) return
    if(!this.engine.powered) return
        
    let accel = new Vector(this.engine.acceleration, 0)
    .rotate(this.transform.rotation)

    this.transform.velocity.add(accel.mult(dtf))
  }
  decelerate() {
    if(this.state.is("skipping")) return
    if(!this.engine.powered) return
    
    let accel = new Vector(this.engine.acceleration, 0)
    .rotate(this.transform.rotation)
    
    this.transform.velocity.sub(accel.mult(dtf))
  }
  move() {
    if(this.state.is("default") && this.transform.velocity.length() === 0) return
    if(this.state.is("skipping", "docking", "undocking", "docked")) return
    
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
    
    if(!this.boosters?.active)
      this.reduceGlide()

    /* softly clamp the max speed, without causing bumpy behaviour */
    let speed = this.transform.velocity.length()
    let maxSpeed = this.engine.maxSpeed
    if(speed > maxSpeed) 
      this.transform.velocity.mult(
        (maxSpeed / speed) * 0.1
        +
        0.9
      )
  }
  reduceGlide() {
    let glideReduction = this.engine.glideReduction
    let directionalVelocity = new Vector(this.transform.velocity.length(), 0)
        directionalVelocity.rotate(this.transform.rotation)
        directionalVelocity.mult(glideReduction)
    this.transform.velocity.mult(1 - glideReduction)
    this.transform.velocity.add(directionalVelocity)
  }
  toggleBrakeIndicator() {
    
  }
  drawGhost() {
    let ghost = this.sprite.ghost
    let skip = this.sprite.skip

    this.gameWorld.layers.ghost.addChild(ghost, skip)

    ghost.position.set(mouse.worldPosition.x, mouse.worldPosition.y)
    skip.position.set(mouse.worldPosition.x, mouse.worldPosition.y)
    ghost.alpha = 0.2
    ghost.rotation = this.transform.rotation
  }
  hideGhost() {
    this.gameWorld.layers.ghost.removeChild(this.sprite.ghost)
    this.gameWorld.layers.ghost.removeChild(this.sprite.skip)
  }
  toggleDockState() {
    this.state.is("docked") ? this.undockBegin() : this.dockBegin()
  }
  //#region docking logic
  dockBegin() {
    if(this.state.is("docking", "undocking", "skipping")) return

    let stationPoints = this.gameWorld.gameObjects.station.map(station => {
      let points = station.dockingPoints.map(p => p.clone())
      points.forEach(p => {
        p.add(station.transform.position)
        p.stationReference = station
      })
      return points
    })
    .flat()

    if(!stationPoints || stationPoints.length === 0) return

    let destinationPoint = this.transform.position.closest(...stationPoints)
    if(this.transform.position.distance(destinationPoint) > Ship.maxDistanceToDock) return

    this.dockData.station = destinationPoint.stationReference
    delete destinationPoint.stationReference
    let angleDifference = this.dockData.station.transform.rotation - this.transform.rotation

    this.dockData.origin.setFrom(this.transform.position)
    this.dockData.offset.setFrom(destinationPoint).sub(this.transform.position)
    this.dockData.rotationInitial = this.transform.rotation
    this.dockData.rotationOffset = angleDifference

    this.timers.dock.duration = this.dockData.durationMin + destinationPoint.distance(this.transform.position) * 3.75

    this.state.set("docking")
    this.timers.dock.start()

    /* camera zoom in */
    if(this.gameWorld.camera.lockedTo === this)
      this.gameWorld.camera.zoomInit("in")

    AudioManager.playSFX("shipEngineStop")
  }
  dockTick() {
    if(this.state.isnt("docking", "undocking")) return

    this.transform.position.set(
      Ease.InOut(this.timers.dock.currentTime, this.dockData.origin.x, this.dockData.offset.x, this.timers.dock.duration),
      Ease.InOut(this.timers.dock.currentTime, this.dockData.origin.y, this.dockData.offset.y, this.timers.dock.duration),
    )
    this.transform.rotation = Ease.InOut(this.timers.dock.currentTime, this.dockData.rotationInitial, this.dockData.rotationOffset, this.timers.dock.duration)
  }
  dockFinish() {
    this.state.ifthen("docking", "docked")
    this.state.ifthen("undocking", "default")

    if(this.state.is("docked")) {
      this.engine.unpower()
      this.weapons.disarmWeapons()
      this.dockData.station.onPlayerDock()
    }
    else {
      this.engine.repower()
      this.weapons.armWeapons()
      this.dockData.station = null
    }
  }
  undockBegin() {
    if(this.state.is("undocking")) return

    this.dockData.station.onPlayerUndock()
    this.dockData.origin.setFrom(this.transform.position)
    this.dockData.offset = Vector.fromAngle(this.transform.rotation).mult(100)
    this.dockData.rotationInitial = this.transform.rotation
    this.dockData.rotationOffset = 0

    this.timers.dock.duration = this.dockData.durationMin
    this.state.set("undocking")
    this.timers.dock.start()

    AudioManager.playSFX("shipEngineStart")

    /* camera zoom out */
    if(this.gameWorld.camera.lockedTo === this)
      this.gameWorld.camera.zoomInit("out")
  }
  //#endregion
  handleImpact(collisionEvent) {
    this.hull.handleImpact(collisionEvent)
  }
  autoPowerSystems(systems) {
    for(let sys of systems)
      this[sys].addPower()
  }
  createCaptain(pilotName) {
    if(pilotName === undefined) return
    if(this.gameWorld !== game) return
    if(!data.person[pilotName]) throw "pilot: " + pilotName + " doesn't exist"

    let 
    pilot = GameObject.create("npc", pilotName, {}, {world: this.gameWorld})
    pilot.assignShip(this)
  }
  update() {
    this.move()
    this.dockTick()

    /* move with station, for hacky purposes I assume the station only has one docking point, otherwise this code breaks */
    if(this.state.is("docked")) {
      this.transform.position.setFrom(this.dockData.station.dockingPoints[0].clone().add(this.dockData.station.transform.position))
    }
  }
  static maxDistanceToDock = 500
  static dockDurationMS = 1600
}
class DecorativeObject extends GameObject {
  constructor(transform, name, isPermanent = true, opacity = 1) {
    super(transform)
    this.type = "decorativeObject"
    this.name = name
    this.isPermanent = isPermanent
    this.opacity = opacity

    this.update()
    this.components = [
      "sprite"
    ]
    this.registerComponents({})
    if(isPermanent) {
      this.opacity = opacity
    }
    else {
      this.opacityInitial = Random.decimal(0.2, 0.4, 1)
      this.sprite.container.alpha = this.opacityInitial
    }
    this.sprite.update()
    this.timers = new Timer(
      ["tickLife", Random.int(5000, 15000), {loop: false, active: !isPermanent, onfinish: this.fadeOutBegin.bind(this)}],
      ["fadeOut", DecorativeObject.fadeTime, {loop: false, active: false, onfinish: this.kill.bind(this)}],
    )
  }
  fadeOutBegin() {
    this.dying = true
    this.timers.fadeOut.start()
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  updateOpacity() {
    let alpha = +clamp((1 - this.timers.fadeOut.currentTime / DecorativeObject.fadeTime) * this.opacityInitial, 0, 1)
    this.sprite.container.alpha = alpha
  }
  update() {
    this.move()
    if(this.dying)
      this.updateOpacity()
  }
  destroy() {

  }
  kill() {
    GameObject.destroy(this)
  }
  static fadeTime = 4000
}
class Decoration {
  constructor(transform, name) {
    this.transform = transform || new Transform()
    this.type = "decoration"
    this.name = name

    /* 
    get sprite source to avoid having to create a sprite component 
    the sprite source is ALWAYS linework.png
    */
    let folder = sources.img.decoration[name].folder
    let src = folder + "linework.png"

    this.sprite = PIXI.Sprite.from(src)
    this.sprite.anchor.set(0.5)
    this.sprite.rotation = this.transform.rotation
  }
  update() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
    this.transform.rotation += this.transform.angularVelocity * dt
    this.sprite.position.set(this.transform.position.x, this.transform.position.y)
    this.sprite.rotation = this.transform.rotation
  }
  destroy() {
    this.stage.removeChild(this.sprite)
  }
}
class Asteroid extends GameObject {
  constructor(transform, name) {
    super(transform)
    let objectData = data.asteroid[name]
    this.type = "asteroid"
    this.name = name
    this.mass = objectData.mass
    this.health = objectData.health
    this.material = objectData.material

    this.components = [
      "hitbox",
      "rigidbody",
      "sprite",
    ]
    this.registerComponents(objectData)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  handleImpact(event) {
    if(event.impactSpeed < Asteroid.minImpactSpeedToDamage) return
    this.takeDamage(event.impactDamage)
    
    if(this.health)
      this.createParticles(event.impactDamage)
  }
  takeDamage(impactDamage) {
    this.health -= impactDamage
    if(this.health <= 0) {
      this.die()
      return
    }
    AudioManager.playSFX("asteroidDamage")
  }
  createParticles(impactDamage) {
    let spawnAttempts = 0
    let count = impactDamage + 1
    for(let i = 0; i < count; i++) {
      spawnAttempts++
      let timeoutMS = i == 0 ? 0 : Random.int(0, 100)
      let position = this.transform.position.clone().add(new Vector(...Random.intArray(-50, 50, 2)))
      if(spawnAttempts > 20) {
        break
      }
      if(!Collision.auto(position, this.hitbox)) {
        i--
        continue
      }
      setTimeout(() => {
        if(this.destroyed) return
        let particle = GameObject.create(
          "particle", 
          "asteroid" + this.material.capitalize(), 
          {
            transform: new Transform(
              position,
              this.transform.velocity.clone().normalize(Random.int(2, 20)),
              Random.rotation(),
              Random.float(-PI/4, PI/4)
            )
          },
          {
            world: this.gameWorld
          }
        )
        particle.sprite.container.scale.set(
          clamp((this.broadphaseGrowFactor / 2) * Random.float(0.75, 1), 0.9, 1.45)
        )
      }, timeoutMS)
    }
  }
  die() {
    if(this.dying) return

    if(this.sprite.death) 
      this.playDeathAnimationAndDestroy()
    else
      GameObject.destroy(this)

    this.dying = true
    this.playDeathSound()
  }
  playDeathAnimationAndDestroy() {
    this.sprite.all.forEach(sprite => sprite.renderable = false)
    this.sprite.death.renderable = true
    this.sprite.death.gotoAndPlay(0)
    this.sprite.death.animationSpeed = 0.1
    this.sprite.death.loop = false
    this.sprite.death.onComplete = () => GameObject.destroy(this)
  }
  playDeathSound() {
    if(this.name.search(/small/i) !== -1)
      AudioManager.playSFX("asteroidDestroySmall")
    if(this.name.search(/medium/i) !== -1)
      AudioManager.playSFX("asteroidDestroyMedium")
    if(this.name.search(/large/i) !== -1)
      AudioManager.playSFX("asteroidDestroyLarge")
  }
  update() {
    this.move()
  }
  destroy() {
    
  }
  static minImpactSpeedToDamage = 80
}
class Debris extends GameObject {
  constructor(transform, name) {
    let objectData = data.debris[name]
    super(transform)
    this.type = "debris"
    this.name = name
    this.mass = objectData.mass
    this.health = objectData.health
    this.debrisYield = objectData.debrisYield ?? {min: 0, max: 0}
    this.scrappable = objectData.scrappable ?? true
    this.components = [
      "hitbox",
      "sprite",
      "rigidbody",
    ]
    this.registerComponents(objectData)

    if(Random.chance(50))
      this.transform.angularVelocity += Random.float(-0.20, 0.20)
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  handleImpact(event) {
    if(event.impactSpeed > 35)
      this.takeDamage(event.impactDamage)
  }
  takeDamage(amount) {
    this.health -= amount

    AudioManager.playSFX("hullDamage")

    if(this.health <= 0)
      GameObject.destroy(this)
  }
  update() {
    this.move()
  }
  destroy() {
    for(let i = 0; i < 2; i++)
    GameObject.create(
      "particle", 
      "debris", 
      {
        transform: new Transform(
          this.transform.position.clone().add(new Vector(...Random.intArray(-10, 10, 2))),
          this.transform.velocity.clone().normalize(Random.int(2, 25)),
          Random.rotation(),
          Random.float(-PI/2, PI/2)
        )
      },
      {
        world: this.gameWorld
      }
    )
  }
}
class Cluster extends GameObject {
  constructor(transform) {
    super(transform)
    this.objects = []
    this.type = "cluster"
    this.name = "Cluster"
  }
  add(...objects) {
    this.objects.push(...objects)
  }
  remove(...objects) {
    objects.forEach(obj => this.objects.remove(obj))
  }
  calculateCenter() {
    let vectors = this.objects.map(o => o.transform.position)
    if(vectors.length === 0) return
    this.transform.position.setFrom(Vector.avg(...vectors))
  }
  rotationUpdate() {
    this.transform.rotation += this.transform.angularVelocity
    this.wrapRotation()
  }
  update() {
    this.calculateCenter()
    this.rotationUpdate()
    this.objects.forEach(obj => {
      obj.transform.angularVelocity = 0
      obj.transform.position.rotateAround(this.transform.position, this.transform.angularVelocity)
    })
  }
  destroy() {
    
  }
}
class LocationRandomizer extends GameObject {
  constructor(transform) {
    super(transform)
    this.object = {}
    this.spawns = []
    this.type = "locationRandomizer"
  }
  setObject(type, name) {
    if(this.object.thumbnail) {
      this.container.removeChild(this.object.thumbnail)
      this.object.thumbnail.destroy()
    }
    this.object = {}
    this.object.name = name
    this.object.type = type
    
    let thumbnail = PIXI.Sprite.from(data[type][name].sources.folder + "thumbnail" + ".png")
    thumbnail.anchor.set(0.5)
    thumbnail.position.set(0, 100)
    this.container.addChild(thumbnail)
    this.object.thumbnail = thumbnail
  }
  addSpawn(pos) {
    let newspawn = new LocationRandomizerSpawn(pos.clone(), 1, this)
    newspawn.addToStage(locationEditor.stage)
    this.spawns.push(newspawn)
  }
  removeSpawn(spawn) {
    this.spawns.remove(spawn)
  }
  update() {

  }
  destroy() {

  }
}

class LocationRandomizerSpawn extends GameObject {
  constructor(transform, weight, parent) {
    super(transform)
    this.weight = weight
    this.hitbox = new CircleHitbox(24)
    this.parent = parent
    this.type = "locationRandomizerSpawn"
  }
  update() {

  }
  destroy() {
    this.parent.removeSpawn(this)
  }
}

class RandomSpawner extends GameObject {
  constructor(pos, hitbox = {}, radius) {
    super(pos)
    this.type = "randomSpawner"
    this.transform.position = pos
    this.transform.velocity = new Vector(0)
    this.radius = radius || 250
    this.objects = []
    this.spawnsMin = 3
    this.spawnsMax = 5

    if(hitbox.type === "circle") 
      this.hitbox = new CircleHitbox(hitbox.radius)
    if(hitbox.type === "box") 
      this.hitbox = new BoxHitbox(hitbox.a, hitbox.b)
  }
  addToStage(stage) {
    this.stage = stage
    this.stage.addChild(this.container)
  }
  addObject(type, name, rotation, rotationVelocity, weight = 1) {
    if(this.objects.find(obj => obj.type === type && obj.name === name)) return
    let src = data[type][name].sources.folder + "thumbnail.png"
    let object = new RandomSpawnerSpawn(type, name, rotation, rotationVelocity, this, src, weight)
    this.generateThumbnail(type, name, src)
    this.objects.push(object)
  }
  generateThumbnail(type, name, src) {
    let imgCont = El('div', "context-window-thumbnail temp")
    let img = new Image(); img.src = src
    let cross = El('div', "icon-16 icon-close-top-right")
    imgCont.dataset.type = type
    imgCont.dataset.name = name
    imgCont.append(img, cross)
    locationEditor.contextWindow.querySelector(".thumbnail-container").append(imgCont)
  }
  removeObject(obj) {
    this.objects.remove(obj)
  }
  update() {

  }
  destroy() {
    this.sprite.destroy()
    this.container.destroy()
  }
}

class RandomSpawnerSpawn extends GameObject {
  constructor(transform, spawnType, spawnName, parent, src, weight = 1) {
    super(transform)
    this.type = "randomSpawnerSpawn"

    this.transform.position = parent.pos.clone()
    this.transform.position.y += 100
    this.transform.velocity = new Vector(0)
    this.spawnType = spawnType
    this.spawnName = spawnName
    this.rotation = rotation
    this.rotationVelocity = rotationVelocity
    this.parent = parent
    this.weight = weight
    this.src = src
  }
  update() {

  }
  destroy() {
    this.parent.removeObject(this)
    let thumbnail = locationEditor.contextWindow.querySelector(".context-window-thumbnail[data-type='" + this.spawnType + "']" + "[data-name='" + this.spawnName + "']")
    thumbnail.remove()
  }
}
class GameOverlay extends GameObject {
  constructor(transform, name, parent) {
    super(transform)
    let objectData = data.gameOverlay[name]
    this.name = name
    this.type = "gameOverlay"
    this.parent = parent
    this.onFinishPlaying = objectData.onFinishPlaying
    this.onFinishPlayingDelayMS = objectData.onFinishPlayingDelayMS
    this.finished = false
    this.components = ["sprite"]
    this.registerComponents(objectData)

    this.timers = new Timer(
      ["refreshSprite", objectData.refreshSpriteFrequencyMS, {loop: true, active: true, onfinish: this.updateSprite.bind(this)}],
      ["waitForDelay", objectData.onFinishPlayingDelayMS,    {loop: false, active: false, onfinish: this[this.onFinishPlaying]?.bind(this)}],
    )
    this.update()
    this.sprite.update()
  }
  updateSprite() {
    if(this.finished) return

    for(let sprite of this.sprite.all) {
      sprite.gotoAndStop(sprite.currentFrame + 1)
      if(sprite.currentFrame === sprite.totalFrames - 1) {
        this.finished = true
        setTimeout(() => {
          this.doOnFinishPlaying()
        }, this.timers.refreshSprite.duration)
      }
    }
  }
  setOpacity(value) {
    this.sprite.container.alpha = clamp(value, 0, 1)
  }
  doOnFinishPlaying() {
    if(this.onFinishPlayingDelayMS)
      this.timers.waitForDelay.start()
    else
      this[this.onFinishPlaying]()
  }
  //#region onFinishPlaying commands
  destroyOverlay() {
    GameObject.destroy(this)
  }
  //#endregion
  update() {
    if(this.parent)
      this.transform.position.setFrom(this.parent.transform.position)
  }
}
class ContinuousGraphic extends GameObject {
  constructor(transform, width, height) {
    super(transform)
    this.width = width
    this.height = height
    this.loopAlong = "x"
    this.generateSprites()
  }
  generateSprites() {
    let count
    if(this.loopAlong = "x")
      count = window.innerWidth / this.width
    else
      count = window.innerHeight / this.height
  }
  updateSprites() {

  }
  update() {
    this.updateSprites()
  }
  destroy() {
    
  }
}
class UltraportBeacon extends GameObject {
  constructor(transform, name) {
    super(transform)
    let objectData = data.ultraportBeacon[name]
    this.name = name
    this.setAsImmovable()
    this.mass = 1_000_000
    this.type = "ultraportBeacon"
    this.name = name
    this.isPlayerNearby = false
    this.components = [
      "sprite",
      "hitbox",
      "rigidbody"
    ]
    this.registerComponents(objectData)
    this.cloneParticleSprite(2)
    this.cloneParticleSprite(3)
  }
  cloneParticleSprite(newParticleIndex) {
    let src = this.sprite.particles.texture.textureCacheIds[0]
    let 
    newSprite = Sprite.animatedSprite(src)
    newSprite.anchor.set(0.5)
    newSprite.play()
    newSprite.animationSpeed = Random.int(8, 12) / 100
    newSprite.rotation = Random.float(0.5, 12)
    this.sprite["particles" + newParticleIndex] = newSprite
    this.sprite.container.addChild(newSprite)
    this.sprite.all.push(newSprite)
  }
  onPlayerEnter() {
    if(this.isPlayerNearby) return

    this.isPlayerNearby = true
    this.createOverlayMenu()
  }
  createOverlayMenu() {
    if(player.inventory.findItemByName("beaconAccessKey")) {
      this.overlayMenu = GameObject.create("gameOverlay", "overlayOpenMapAndUseKey", {parent: this}, {world: this.gameWorld})
      this.registerBeaconKeyInteraction()
    }
    else {
      this.overlayMenu = GameObject.create("gameOverlay", "overlayOpenMap", {parent: this}, {world: this.gameWorld})
    }
  }
  destroyOverlayMenu() {
    if(this.overlayMenu)
      GameObject.destroy(this.overlayMenu)
    this.overlayMenu = null
  }
  onPlayerLeave() {
    if(!this.isPlayerNearby) return
    
    this.isPlayerNearby = false
    this.destroyOverlayMenu()
    this.unregisterBeaconKeyInteraction()
  }
  registerBeaconKeyInteraction() {
    game.availableInteraction = UltraportBeacon.beaconKeyInteraction.bind(this)
  }
  unregisterBeaconKeyInteraction() {
    game.availableInteraction = null
  }
  updateSprite(distanceFromPlayer) {
    const opacity = clamp(1 - (distanceFromPlayer - 100) / UltraportBeacon.minDistanceToTravel, 0, 1)
    this.sprite.overlayFill.alpha = opacity
    this.sprite.glow.alpha = clamp(opacity + 0.2, 0, 1)
    this.sprite.particles.alpha = opacity
    this.sprite.particles.rotation += (30 * PI/180) * dt * opacity
    this.sprite.particles2.alpha = opacity
    this.sprite.particles2.rotation += (40 * PI/180) * dt * opacity
    this.sprite.particles3.alpha = opacity / 2
    this.sprite.particles3.rotation += (60 * PI/180) * dt * opacity
  }
  update() {
    let distanceFromPlayer = GameObject.distance(this, player.ship)
    if(distanceFromPlayer < UltraportBeacon.minDistanceToTravel)
      this.onPlayerEnter()
    else
      this.onPlayerLeave()
    this.updateSprite(distanceFromPlayer)  
  }
  destroy() {
    this.destroyOverlayMenu()
  }
  static minDistanceToTravel = 480
  static beaconKeyInteraction() {
    GameObject.create(
      "hint", 
      "Hint", 
      {
        transform: new Transform(), 
        hintData: {
          hintText: "Extracted fly-paths data from the beacon. Your map has been updated. \n\n Press [M] or click on the map icon on your right.",
          hintType: "static",
          hintAttachment: "bottom",
          hintComplete: {
            requirements: [
              {
                method: "UIevent",
                eventType: "keydown",
                eventBind: "dismissHint",
              }
            ],
            onComplete: "none"
          }
        },
        parent: this, 
      },
      {world: this.gameWorld}
    )
    /* create the quest overlay */
    GameObject.create(
      "mapImage",
      "questOverlay_theLostPrincess_searchRadius",
      {transform: new Transform(new Vector(80, -100)), scale: 0.5},
      {world: map}
    )
  }
}
class HintGraphic extends GameObject {
  constructor(transform, name, parent) {
    super(transform)
    let objectData = data.hintGraphic[name]
    this.type = "hintGraphic"
    this.name = name
    this.parent = parent
    this.components = [
      "sprite"
    ]
    this.registerComponents(objectData)
    this.timers = new Timer(
      ["fadeout", 1000, {loop: false, active: false, onfinish: this.onFadeout.bind(this)}]
    )
    this.onload(objectData)
  }
  onload() {
    this.update()
    this.sprite.linework.animationSpeed = 0.2
    this.sprite.linework.loop = false
    this.sprite.linework.play()
  }
  //#region input
  handleInput(event) {
    this["handle" + event.type.capitalize()](event)
  }
  handleKeydown(event) {

  }
  handleKeyup(event) {

  }
  handleMousedown(event) {

  }
  handleMousemove(event) {

  }
  handleMouseup(event) {

  }
  handleClick(event) {

  }
  handleWheel(event) {

  }
  handlePointerdown(event) {

  }
  handlePointermove(event) {

  }
  //#endregion
  dismiss() {
    this.timers.fadeout.start()
  }
  onFadeout() {
    GameObject.destroy(this)
  }
  updateSprite() {
    if(!this.timers.fadeout.active) return
    this.sprite.container.alpha = Ease.InOut(this.timers.fadeout.currentTime, 1, -1, this.timers.fadeout.duration)
  }
  update() {
    this.updateSprite()
    this.transform.position.setFrom(this.parent.transform.position)
  }
}
class Hint extends GameObject {
  constructor(transform, hintData, fadeoutTime = 520, parent) {
    super(transform)
    this.type = "hint"
    this.name = "Hint"
    this.parent = parent
    this.fadeoutTimeMax = fadeoutTime
    this.fadeTime = fadeoutTime
    this.dismissed = false
    this.id = uniqueIDString(12)
    this.timers = new Timer()
    for(let key in hintData)
      this[key] = hintData[key]

    this.createHtml()
    this.registerCompleteMethods()
    this.fade(0, 1, this.flash.bind(this))
  }
  createHtml() {
    /* create hint */
    this.element = El('div', "hint tooltip-popup")
    this.element.dataset.tooltip = "Click to dismiss ~bind=dismissHint~"
    this.element.dataset.tooltipattachment = "top"
    this.element.dataset.setmaxwidthtotriggerelement = "true"
    this.element.dataset.parentelementid = this.id
    this.element.dataset.playsfx = ""
    this.element.dataset.sounds = "buttonHover buttonClick"
    this.element.dataset.playonevents = "mouseover mousedown"

    let richText = createRichText(this.hintText)

    /* put the innerHTML inside the hint element */
    this.element.innerHTML = "<div class='hint-content'>" + richText + "</div>"

    /* create miniature */
    this.miniature = El('div', "hint-miniature tooltip-popup")
    this.miniature.dataset.tooltip = "Maximize [Click]"
    this.miniature.dataset.delay = 300
    this.miniature.dataset.tooltipattachment = "top"
    this.miniature.dataset.parentelementid = this.id
    this.miniature.dataset.playsfx = ""
    this.miniature.dataset.sounds = "buttonHover buttonClick"
    this.miniature.dataset.playonevents = "mouseover mousedown"

    /* create wrapper element */
    this.hintWrapper = El('div', "hint-wrapper")
    this.hintWrapper.append(this.element, this.miniature)

    /* turns other hints into a miniature and displays this hint */
    this.miniature.onclick = () => this.maximize()

    /* do periodic hint flashing */
    this.timers.add(
      ["flash", 6500, {loop: true, active: true, onfinish: this.periodicFlash.bind(this, 3, 180)}]
    )

    if(Qa('#interaction-container *:not(.hidden)').length > 0)
      this.miniature.classList.add("hidden")
    else
      this.element.classList.add("hidden")

    /* if the audiocall panel is hidden, maximize this hint immediately */
    if(Q("#audio-call-panel").classList.contains("hidden")) this.maximize()

    if(this.hintText != "") 
      Q('#interaction-container').append(this.hintWrapper)

    this.element.style.filter = "opacity(0)"
    this.element.onclick = () => this.complete()
    this.updateHtml()
  }
  maximize() {
    this.minimizeOtherInteractions()
    this.element.classList.remove("hidden")
    this.miniature.classList.add("hidden")
  }
  minimize() {
    this.element.classList.add("hidden")
    this.miniature.classList.remove("hidden")
  }
  minimizeOtherInteractions() {
    game.gameObjects.hint.forEach(hint => hint.minimize())
    gameUI.minimizeAudioCallPanel()
  }
  registerCompleteMethods() {
    if(!this.hintComplete) {
      this.onComplete = () => {}
      return
    }
    this.onComplete = () => this[this.hintComplete.onComplete]()
    this.hintComplete.eventListeners = []

    /* register event listeners for all the requirements for hint completion */
    for(let [index, req] of this.hintComplete.requirements.entries())
      this.registerRequirementCompleteMethod(req, index)
  }
  registerRequirementCompleteMethod(requirement, index) {
    switch(requirement.method) {
      case "UIevent": {
        let eventType = requirement.eventType
        let handlerMethod = (event) => {
          let eventBind = requirement.eventBind
          if(eventBind) {
            if(event.code === binds[eventBind])
              this.completeRequirement(index)
          }
          else {
            this.completeRequirement(index)
          }
        }
        
        let targetElement
        if(!requirement.elementSelector)
          targetElement = document
        else
          targetElement = Q(requirement.elementSelector)

        targetElement.addEventListener(eventType, handlerMethod)

        this.hintComplete.eventListeners.push({ targetElement, eventType, handlerMethod })
        break
      }
      case "gameEvent": {
        switch(requirement.eventType) {
          case "destroyGameObject": {
            this.timers.add(
              ["requirementCheck" + index, 100, {loop: true, active: true, onfinish: this.requirementCheck.bind(this, index)}]
            )
            break
          }
        }
        break
      }
    }
  }
  unregisterRequirementCompleteMethod(index) {
    switch(this.hintComplete.requirements[index].method) {
      case "UIevent": {
        let listenerData = this.hintComplete.eventListeners[index]
        listenerData.targetElement.removeEventListener(listenerData.eventType, listenerData.handlerMethod)
        break
      }
      case "gameEvent": {
        this.timers.remove("requirementCheck" + index)
        break
      }
    }
  }
  requirementCheck(index) {
    /* 
    this shitty function checks whether a specific requirement for the hint completion has been fulfilled
    so far it only accepts gameEvent and destroyGameObject 

    this is called periodically EVERY 100ms or so as long as the hint is active
    */
    let requirement = this.hintComplete.requirements[index]
    switch(requirement.method) {
      case "gameEvent": {
        switch(requirement.eventType) {
          case "destroyGameObject": {
            if(!GameObject.byId(this.gameWorld, requirement.gameObjectId)) {
              this.completeRequirement(index)
              console.log("completed destroygameobject requirement")
            }
            break
          }
        }
        break
      }
    }
  }
  //#region hintType specific methods
  static() {
    /* this does nothing */
  }
  dynamic() {
    let boundingBox = this.element.getBoundingClientRect()
    this.element.style.left = Math.floor( this.transform.position.x -boundingBox.width/2 ) + "px"
    this.element.style.top =  Math.floor( this.transform.position.y -boundingBox.height/2 ) + "px"
    this.transform.position = worldToClientPosition(this.gameWorld, this.parent.transform.position)
  }
  //#endregion
  //#region animations
  fade(fromOpacity, toOpacity, onFinish) {
    this.element.animate([
      {
        filter: `opacity(${fromOpacity})`
      },
      {
        filter: `opacity(${toOpacity})`
      },
    ], {
      duration: this.fadeoutTimeMax
    })
    .onfinish = () => {
      this.element.style.filter = ""
      if(onFinish && !this.destroyed)
        onFinish()
    }
  }
  periodicFlash(iterations, durationMS) {
    /* this function exists solely to check whether the hint is a miniature, in that case the flashing isn't applied */
    if(this.element.classList.contains("hidden")) return
    this.flash(iterations, durationMS)
  }
  async flash(iterations = 3, durationMS = 125) {
    /* choose whether to animate the full element or miniature */
    let element, image
    if(this.element.classList.contains("hidden")) {
      element = this.miniature
      image = "hintMiniature"
    }
    else {
      element = this.element
      image = "hintContainer"
    }

    for(let i = 0; i < iterations; i++) {
      element.style.backgroundImage = `url("assets/ui/${image}Hover.png")`

      if(this.hintText)
        AudioManager.playSFX("buttonNoAction", Random.decimal(0.05, 0.15, 2))

      await waitFor(durationMS)
      element.style.backgroundImage = `url("assets/ui/${image}.png")`
      await waitFor(durationMS)
    }
    element.style.backgroundImage = ""
  }
  //#endregion
  //#region onComplete commands
  destroyInteractable() {
    console.log("destroyed interactable")
    GameObject.destroy(this.parent)
  }
  none() {
    //useless method that does nothing but needs to be here in case I need some hint to do "none"
  }
  //#endregion
  updateHtml() {
    this.element.style.filter = `opacity(${this.opacity})`
  }
  updateLife() {
    if(this.dismissed) 
      this.fadeTime -= 1000 * dt
    if(this.fadeTime <= 0) 
      GameObject.destroy(this)
  }
  update() {
    this.updateLife()
    this.updateHtml()
    if(!this[this.hintType]) 
      console.error("Missing hintType on hint:", this, "HintType is required and has two values: dynamic, static")
    this[this.hintType]()
    this.transform.position.setFrom(this.parent.transform.position)
  }
  dismiss() {
    this.dismissed = true
    this.fade(1, 0)
  }
  completeRequirement(index) {
    this.hintComplete.requirements[index].complete = true
    this.unregisterRequirementCompleteMethod(index)
    if(this.hintComplete.requirements.find(req => req.complete !== true)) return
    this.complete()
  }
  complete() {
    this.dismiss()
    this.onComplete()
  }
  destroy() {
    this.hintWrapper.remove()
    //console.log("destroyed hint", this)
  }
  static async preloadAssets() {
    /* preload images just in case */
    let images = ["assets/ui/hintContainerHover.png", "assets/ui/hintContainer.png"]

    await Promise.all(images.map(src => {
      new Promise(resolve => {
        let img = new Image()
        img.src = src
        img.onload = resolve()
      })
    }))
    console.log("Hint assets loaded.")
  }
}
class Explosion extends GameObject {
  constructor(transform, name, SFXName) {
    super(transform)
    let objectData = data.explosion[name]
    this.type = "explosion"
    this.name = name
    for(let key in objectData)
      this[key] = objectData[key]

    this.components = [
      "sprite",
    ]
    this.registerComponents(objectData)
    this.setAsImmovable()
    this.play()
    AudioManager.playSFX(SFXName)
    setTimeout(() => this.affectNearbyObjects(), 100)
  }
  affectNearbyObjects() {
    let targets = Collision.broadphase(this.gameWorld, this, {exclude: [Interactable, HintGraphic, Hint, Explosion]})
    targets.forEach(target => {
      if(Collision.isSameCollisionGroup(this, target)) return

      let distance = GameObject.distance(this, target) 
      if(distance > this.effectRadius) return

      let angle = GameObject.angle(this, target)
      let pushVector = Vector.fromAngle(angle).mult((1 - distance / (this.effectRadius * 2)) * this.strength).div(target.mass)
      target.transform.velocity.add(pushVector)

      let world = target.gameWorld

      target.handleImpact(CollisionEvent.fakeEvent(1, pushVector.length() * 6))
      
      if(target instanceof Ship)
      GameObject.create(
        "particle",
        target.name + "HullDamage",
        {
          transform: target.transform.clone()
        },
        {world}
      )
      if(this.name = "default") {
        let particle = GameObject.create(
          "particle",
          "explosionHit",
          {
            transform: new Transform(target.transform.position.clone(), undefined, Random.rotation())
          },
          {world}
        )
        particle.sprite.container.scale.set(Random.float(0.65, 1.0))
      }
    })
  }
  play() {
    this.sprite.container.position.set(this.transform.position.x, this.transform.position.y)
    this.transform.rotation = Math.random() * TAU
    this.sprite.linework.gotoAndPlay(0)
    this.sprite.linework.loop = false
    this.sprite.linework.animationSpeed = 0.1
    this.sprite.linework.onComplete = () => GameObject.destroy(this)
  }
  update() {

  }
}
class Fragment extends GameObject {
  constructor(transform, name, parent, fragmentData) {
    super(transform)
    let objectData = {
      hitbox: {
        type: "polygonHitbox",
        filename: null,
        definition: fragmentData.hitbox
      }
    }
    this.mass = parent.mass / 3
    this.health = 3
    this.scrappable = true
    this.debrisYield = {min: 6, max: 12}
    this.type = "fragment"
    this.name = name

    this.parent = parent
    this.parentName = parent.name
    setTimeout(() => delete this.parent, 0)

    this.components = ["hitbox", "rigidbody"]
    this.registerComponents(objectData)
    this.addSpriteComponentToFragment(fragmentData.index)
    this.update()
    this.timers = new Timer(
      ["invulnerableWindow", 500, {loop: false, active: false, onfinish: this.setInvulnerableState.bind(this, false)}]
    )
  }
  handleImpact(event) {
    if(event.impactSpeed > 50) 
      this.takeDamage(event.impactDamage)
  }
  setInvulnerableState(bool) {
    this.invulnerable = bool
  }
  takeDamage(amt) {
    if(this.invulnerable) return

    this.health -= amt
    this.invulnerable = true
    this.timers.invulnerableWindow.start()

    AudioManager.playSFX("hullDamage")
    this.createParticles()

    if(this.health <= 0)
      GameObject.destroy(this)
  }
  createParticles() {
    console.count("createParticlesFragment")
    let particleName = data.particle[this.parentName + "HullDamage"] ? this.parentName + "HullDamage" : "debris"
    let count = Random.int(1, 2)
    for(let i = 0; i < count; i++)
    GameObject.create(
      "particle", 
      particleName,
      {
        transform: new Transform(
          this.transform.position.clone().add(new Vector(...Random.intArray(-25, 25, 2))),
          this.transform.velocity.clone().normalize(Random.int(2, 25)),
          Random.rotation(),
          Random.float(-PI/2, PI/2)
        )
      },
      {
        world: this.gameWorld
      }
    )
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  update() {
    this.move()
  }
}
class Camera extends GameObject {
  constructor(
    transform,
    context, 
    contextDim = new Vector(window.innerWidth, window.innerHeight),
    lockedTo = null,
    baseZoom = 1,
    zoomRange,
    options = {zoomDurationMS: 500}
  ) {
    super(transform)
    this.type = "camera"
    this.name = "camera"
    this.context = context
    this.contextDim = contextDim
    this.lockedTo = lockedTo
    this.target = null
    this.bounds = {
      minX: -Infinity,
      minY: -Infinity,
      maxX: Infinity, 
      maxY: Infinity,
    }
    this.currentZoom = baseZoom
    this.baseZoom = baseZoom
    this.zoomRange = zoomRange ?? Camera.zoomRange
    this.zoomStep = Camera.zoomStep
    this.zoom = {
      startValue: 0,
      endValue: 0,
      currentTime: 0,
      duration: options.zoomDurationMS ?? Camera.zoomDurationMS,
      active: false,
      direction: "in" || "out"
    }
    this.easeFunction = Ease.InOut
    this.state = new State(
      "default",
      "transitioning",
    )

    this.positionOffset = new Vector()
    this.transitionTimeMin = 500
    this.timers = new Timer(
      ["transition", Camera.transitionDurationMS, {loop: false, active: false, onfinish: this.transitionEnd.bind(this)}]
    )
  }
  transitionEnd() {
    this.lockTo(this.target)
    this.target = null
    this.state.ifrevert("transitioning")
  }
  lockTo(object) {
    if(!object.transform) throw "Can't lock camera to object without transform component"
    this.lockedTo = object
  }
  transitionBegin(object) {
    if(this.state.is("transitioning")) return
    this.target = object
    let distance = this.lockedTo.transform.position.distance(object.transform.position)
    this.timers.transition.duration = this.transitionTimeMin + distance*0.75
    this.timers.transition.restart()
    this.state.set("transitioning")
  }
  positionUpdate() {
    if(this.state.is("default")) {
      this.transform.position.setFrom(this.lockedTo.transform.position).add(this.positionOffset)
      this.transform.position.x = clamp(this.transform.position.x, this.bounds.minX, this.bounds.maxX)
      this.transform.position.y = clamp(this.transform.position.y, this.bounds.minY, this.bounds.maxY)
    }
    else
    if(this.state.is("transitioning")) {
      let diff = this.target.transform.position.clone().sub(this.lockedTo.transform.position)
      this.transform.position.x = this.easeFunction(this.timers.transition.currentTime, this.lockedTo.transform.position.x, diff.x, this.timers.transition.duration)
      this.transform.position.y = this.easeFunction(this.timers.transition.currentTime, this.lockedTo.transform.position.y, diff.y, this.timers.transition.duration)
    }
  }
  update() {
    this.positionUpdate()
    this.updateWorldOffset()
    this.zoomInterpolate()
  }
  updateWorldOffset() {
    this.context.position.x = (-this.transform.position.x / this.currentZoom + this.contextDim.x/2)
    this.context.position.y = (-this.transform.position.y / this.currentZoom + this.contextDim.y/2)
    this.context.scale.set(1 / this.currentZoom)
  }
  zoomInterpolate() {
    if(!this.zoom.active) return

    let zoomIncrement = Math.abs(this.zoom.startValue - this.zoom.endValue)

    if(this.zoom.startValue < this.zoom.endValue) 
      this.currentZoom = this.zoom.startValue + this.easeFunction(this.zoom.currentTime, 0, zoomIncrement, this.zoom.duration)
    if(this.zoom.startValue > this.zoom.endValue) 
      this.currentZoom = this.zoom.startValue - this.easeFunction(this.zoom.currentTime, 0, zoomIncrement, this.zoom.duration)

    this.zoom.currentTime += 1000 * dt

    if(this.zoom.currentTime >= this.zoom.duration)
      this.zoomEnd()
  }
  zoomInit(direction) {
    if(this.zoom.active) return

    this.zoom.startValue = this.currentZoom
    this.zoom.direction = direction
    if(direction === "in")
      this.zoom.endValue = (this.currentZoom * this.zoomStep)
    if(direction === "out") 
      this.zoom.endValue = (this.currentZoom / this.zoomStep)

    this.zoom.endValue = clamp(this.zoom.endValue, this.zoomRange[0], this.zoomRange[1])

    if(debug.camera) 
      console.log("zoom start value: " + this.zoom.startValue)
    if(debug.camera) 
      console.log("zoom end value: " + this.zoom.endValue)

    if(this.zoom.endValue === this.zoom.startValue) return
    
    this.zoom.active = true
    return this.zoomStep
  }
  zoomEnd() {
    this.currentZoom = this.zoom.endValue
    this.zoom.active = false
    this.zoom.currentTime = 0
    this.onZoomEnd()
  }
  onZoomEnd() {
    //empty method used for custom handling
  }
  resetZoom() {
    this.currentZoom = this.baseZoom
  }
  shake(shakeIntensityMultiplier = 1) {
    let iterationTime = 50
    let iterations = 8
    let shakeIntensity = 4 * shakeIntensityMultiplier
    const stopShake = () => {
      this.positionOffset.set(0)
    }
    const scheduleOffset = (iteration = 0) => {
      if(iteration > iterations) {
        stopShake()
        return
      }
      let offset = new Vector(Random.int(0, shakeIntensity), Random.int(0, shakeIntensity))
      this.positionOffset.setFrom(offset)
      setTimeout(() => scheduleOffset(++iteration), iterationTime)
    }

    scheduleOffset()
  }
  static zoomRange = [0.5, 2]
  static zoomStep = 0.75
  static zoomDurationMS = 500
  static transitionDurationMS = 1000
}

class FogGenerator extends GameObject {
  constructor(transform, parent, fogData) {
    super(transform)
  }
  update() {
    this.transform.position.set(this.parent.transform.position)
  }
}
class AudioEmitter extends GameObject {
  constructor(category, name, parent, options = {volumeFadeDistance: 1000, maxVolume: 1}) {
    super()
    this.type = "audioSource"
    this.name = name
    this.category = category
    this.parent = parent
    this.volumeFadeDistance = options.volumeFadeDistance
    this.maxVolume = options.maxVolume ?? 1

    this.wasWithinDistanceLastFrame = false

    this.audioClip = new LoopedAudioClip(
      `audio/${this.category}/${this.name}.ogg`,
      this.name,
    )
    this.audioClip.onload = () => this.ready = true
  }
  update() {
    if(!this.ready) return

    this.transform.position.setFrom(this.parent.transform.position)
    this.checkDistance()
  }
  checkDistance() {
    let distance = GameObject.distance(this, player?.ship)

    if(distance < this.volumeFadeDistance && !this.wasWithinDistanceLastFrame)
      this.audioClip.start()
    if(distance >= this.volumeFadeDistance && this.wasWithinDistanceLastFrame)
      this.audioClip.stop()
    
    this.wasWithinDistanceLastFrame = distance < this.volumeFadeDistance
    
    if(this.category === "SFX")
      this.audioClip.setVolume((1 - distance/this.volumeFadeDistance) * this.maxVolume * AudioManager.SFXVolume)
    else
      this.audioClip.setVolume((1 - distance/this.volumeFadeDistance) * this.maxVolume * AudioManager.musicVolume)  
  }
}
class LightSource extends GameObject {
  constructor(transform, name, parent, lightData = {}) {
    super(transform)
    let objectData = {hitbox: {filename: null, type: "circle", definition: {radius: lightData.radius}}}
    this.type = "lightSource"
    this.name = name
    this.parent = parent

    this.lightData = lightData
    this.color = Number(lightData.color)
    this.radius = lightData.radius
    this.components = ["hitbox"]
    this.registerComponents(objectData)
    this.update()
  }
  update() {
    this.transform.position.setFrom(this.parent.transform.position)
  }
}
class Particle extends GameObject {
  constructor(transform, name) {
    super(transform, name)
    let objectData = data.particle[name]
    this.type = "particle"
    this.name = name
    this.destroyAfterPlay = objectData.destroyAfterPlay
    this.components = ["sprite"]
    this.registerComponents({})

    let haveFinishedPlaying = 0
    
    this.sprite.update()
    this.sprite.all.forEach(sprite => {
      sprite.loop = false
      sprite.onComplete = () => {
        if(this.destroyed) return
        haveFinishedPlaying++
        if(haveFinishedPlaying === this.sprite.all.length && this.destroyAfterPlay)
          GameObject.destroy(this)
      }
    })
  }
  move() {
    this.transform.position.x += this.transform.velocity.x * dt
    this.transform.position.y += this.transform.velocity.y * dt
  }
  update() {
    this.move()
  }
}
class StarSystemDetail extends GameWindow {
  constructor() {
    super("StarSystemDetail", Q('#star-system-detail'))
    this.windowType = "overlay"
    this.initialize()
  }
  show() {
    this.element.classList.remove('hidden')
  }
  hide() {
    this.element.classList.add('hidden')
  }
  loadStarSystem(starSystemName) {
    this.initialize()

    this.element.querySelector("#star-system-detail-content")

    this.starSystemName = starSystemName
    this.setHTML()
  }
  setHTML() {

  }
  addPlanet() {

  }
  initialize() {
    this.planets = []
    this.orbits = []

    this.ymax = null
    this.ymin = null
    this.sun = null
    this.starSystemName = null
  }
  updateDescription(starSystemName) {
    let location = data.starSystem[starSystemName]
    Q("#star-system-location-title-text").innerText =   location.planets[0].name
    Q("#star-system-location-description").innerText =  location.planets[0].description ?? "Planet description missing"
    Q("#location-detail-planet-image").src =            `assets/locationThumbnails/${location.planets[0].name.decapitalize()}.png`
    Q("#star-system-title").innerText =                 starSystemName.splitCamelCase()
  }
  update() {
    /* maybe keep this function, the planets gonna be moving somehow */
    return
    let speedMultiplier = 25
    this.planets.forEach((planet, index) => {
      let orbit =   this.orbits[index]
      let length =  orbit.getTotalLength()
      let point =   orbit.getPointAtLength(length*(planet.offset/100))
      planet.pos.set(point.x, point.y)
      planet.offset += planet.freq * speedMultiplier * dt
      let scale = planet.pos.y / this.ymax
      planet.element.setAttribute("transform", `translate(${planet.pos.x} ${planet.pos.y}) scale(${scale + 0.3}) `)
      if(planet.offset > 100)
        planet.offset = 0
    })
  }
  handleKeydown(e) {
    if(e.code === "Escape") gameManager.closeWindow()
  }
}

class WorldMap extends GameWorldWindow {
  constructor() {
    super("WorldMap", Q('#world-map'))
    this.app.view.id = "map-canvas"
    this.app.view.width = window.innerWidth
    this.app.view.height = window.innerHeight

    this.state = new State(
      "default",
      "panning",
      "movingObject",
    )
    this.tools = [
      "move",
      "add-star-system",
      "add-star-system-outback",
      "add-sprite",
      "lock-icon",
      "lock-sprite",
      "toggle-window-mode"
    ]

    this.editMode = new State(
      false,
      true,
    )

    this.locked = {
      mapImage: false,
      mapIcon: false,
      mapLabel: false,
    }
    this.images = []
    this.selected = []

    this.createHtml()
    this.generateToolIcons()
    this.createOrigin()
    this.modifyCamera()
  }
  show() {
    this.element.classList.remove("hidden")
    gameUI.beginUIHintSequence("map")
  }
  generateToolIcons() {
    this.tools.forEach(t => {
      let cont = El('div', "tool-cont dev-icon")
      let icon = El('div', "tool-icon " + t)
      cont.append(icon)
      cont.onclick = () => {
        this.setTool(t)
      }
      cont.title = t.replaceAll('-', " ").capitalize()
      cont.dataset.toolname = t
      Q('#map-toolset').append(cont)
    })
  }
  modifyCamera() {
    this.camera.zoomRange = [0.25, 1.25]
    this.camera.onZoomEnd = () => {
      this.adjustCameraBounds()
      this.gameObjects.mapIcon.forEach(icon => {
        if(this.camera.zoom.direction === "in") 
          icon.hitbox.radius = icon.hitbox.radiusDefault * this.camera.currentZoom
        if(this.camera.zoom.direction === "out") 
          icon.hitbox.radius = icon.hitbox.radiusDefault * this.camera.currentZoom
      })
    }
    this.adjustCameraBounds()
  }
  adjustCameraBounds() {
    /* bounds are adjusted according to camera zoom so you can pan to the edge when zoomed in */
    let multiplier = this.camera.zoomRange[1] - this.camera.currentZoom
    let xMultiplier = cw / ch
    let yMultiplier = ch / cw
    this.camera.bounds = {
      minX: -50  - (cw/2) * xMultiplier * multiplier,
      maxX:  50  + (cw/2) * xMultiplier * multiplier,
      minY: -500 - (ch/2) * yMultiplier * multiplier,
      maxY:  500 + (ch/2) * yMultiplier * multiplier,
    }
  }
  load() {
    readJSONFile("data/worldmapData.json", (text) => {
      let mapData = JSON.parse(text)
      mapData.forEach(obj => {
        GameObject.create(
          obj.type, 
          obj.name,
          {
            transform: Transform.fromPlain(obj.transform),
            scale: obj.scale,
            locationReference: obj.locationReference,
            text: obj.text,
            color: obj.color
          }, 
          {
            world: this
          }
        )
      })
    })
  }
  export() {
    let mapObjects = []
    this.gameObjects.mapImage.forEach(obj => {
      if(obj.name.includes("questOverlay")) return
      let plain = {
        name: obj.name,
        type: obj.type,
        transform: obj.transform.plain,
        scale: obj.scale
      }
      mapObjects.push(plain)
    })
    this.gameObjects.mapIcon.forEach(obj => {
      let plain = {
        name: obj.name,
        type: obj.type,
        transform: obj.transform.plain,
        locationReference: obj.locationReference,
      }
      mapObjects.push(plain)
    })
    this.gameObjects.mapLabel.forEach(obj => {
      let plain = {
        name: obj.name,
        type: obj.type,
        text: obj.text,
        color: obj.color,
        transform: obj.transform.plain,
        locationReference: obj.locationReference,
      }
      mapObjects.push(plain)
    })
    exportToJSONFile(mapObjects, "worldmapData")
  }
  createOrigin() {
    if(!debug.map) return
    this.origin = {
      transform: new Transform(),
      sprite: new PIXI.Sprite.from("assets/origin.png"),
    }
    this.origin.sprite.position.set(this.origin.transform.position.x, this.origin.transform.position.y)
    this.origin.sprite.anchor.set(0.5)
    this.app.stage.addChild(this.origin.sprite)
  }
  createHtml() {
    this.element.prepend(this.app.view)
  }
  addGrid() {
    this.gridSprite = new PIXI.TilingSprite(mapGrid.texture, 
      4096,
      4096,
    )
    this.gridSprite.anchor.set(0.5)
    this.stage.addChild(this.gridSprite)
  }
  //#region input
  handleKeydown(event) {
    if(this.state.is("default")) {
      if(event.code === "KeyE")                   this.export()
      if(event.code === "KeyD")                   this.duplicate()
      if(event.code === "KeyA" && keys.shift)     this.addMapImage()
      if(event.code === "KeyR")                   this.renameSelected()
      if(event.code === "KeyC")                   this.recolorSelected()
      if(event.code === "KeyX")                   this.deleteSelected()
      if(event.code === "Escape")                 this.deselectAll()
      if(event.code === "NumpadAdd")              this.selected.forEach(obj => obj.scaleUp())
      if(event.code === "NumpadSubtract")         this.selected.forEach(obj => obj.scaleDown())
      if(event.code === binds.openWorldMap)       gameManager.closeWindow()
    }
  }
  handleKeyup(event) {

  }
  handleMousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(this.editMode.is(true) && target === this.canvas) {
        let match = false
        let matchingObjects = []

        if(!(keys.shift || keys.shiftRight)) 
          this.deselectAll()

        this.gameObjects.gameObject.forEach(obj => {
          for(let key in this.locked)
            if(this.locked[key] && obj.type === key)
              return

          if(Collision.auto(mouse.mapPosition, obj.hitbox)) {
            matchingObjects.push(obj)
            match = true
            this.state.set("movingObject")
          }
        })


        if(match)
          this.select(GameObject.closestToPoint(mouse.mapPosition, ...matchingObjects))
        else
          this.deselectAll()
      }
      else
      if(this.editMode.is(false)) {
        
      }

      if(keys.ctrl) {
        this.createIcon()
      }
      if(target.closest(".tool-icon.add-sprite")) {
        this.addMapImage()
      }
      if(target.closest(".tool-icon.add-star-system")) {
        this.addMapIcon("connected")
      }
      if(target.closest(".tool-icon.add-star-system-outback")) {
        this.addMapIcon("outback")
      }
      if(target.closest(".tool-icon.toggle-window-mode")) {
        this.editMode.toggle()
        if(this.editMode.is(false))
          this.deselectAll()
        setTimeout(() => this.setTool("move"), 100)
      }
      if(target.closest(".tool-icon.lock-sprite")) {
        target.closest(".tool-icon.lock-sprite").classList.toggle('active')
        this.locked.mapImage = !this.locked.mapImage
        setTimeout(() => this.setTool("move"), 100)
      }
      if(target.closest(".tool-icon.lock-icon")) {
        target.closest(".tool-icon.lock-icon").classList.toggle('active')
        this.locked.mapIcon = !this.locked.mapIcon
        setTimeout(() => this.setTool("move"), 100)
      }
    }
  }
  handleMousemove(event) {
    if(mouse.keys.middle || (mouse.keys.left && this.editMode.is(false))) {
      this.pan()
    }
    else {
      this.gameObjects.mapIcon.forEach(icon => {
        if(Collision.auto(mouse.mapPosition, icon.hitbox)) {
          icon.hover = true
          icon.showText()
        }
        else {
          icon.hover = false
          icon.hideText()
        }
      })
    }

    if(mouse.keys.left) {
      if(this.state.is("movingObject")) {
        this.selected.forEach(obj => {
          let offsetVector = mouse.clientMoved.clone().mult(this.camera.currentZoom)
          obj.transform.position.add(offsetVector)
        })
      }
    }
  } 
  handleMouseup(event) {
    this.state.set('default')
  }
  handleClick(event) {
    if(this.mode.is("play") && this.editMode.is(false)) {
      this.gameObjects.mapIcon.forEach(icon => {
        if(Collision.vectorCircle(mouse.mapPosition, icon.hitbox)) {
          this.openStarSystemDetail(icon.locationReference)
        }
      })
    }
  }
  handleWheel(event) {
    if(mouse.keys.middle) return
    if(keys.shift || keys.shiftRight) {
      if(event.deltaY > 0) {
        this.selected.forEach(obj => obj.scaleUp())
      }
      else
      if(event.deltaY < 0) {
        this.selected.forEach(obj => obj.scaleDown())
      }
    }
    if(!(keys.shift || keys.shiftRight)) {
      if(event.deltaY > 0) {
        this.zoom("out")
        console.log("out")
      }
      else
      if(event.deltaY < 0) {
        this.zoom("in")
        console.log("in")
      }
    }
  }
  //#endregion
  setTool(name) {
    let tool = this.tools.find(t => t === name)
    if(!tool) return

    this.tool = tool
    Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
    this.element.querySelector(`[data-toolname="${tool}"`).classList.add('active')
    this.state.set("default")
  }
  duplicate() {
    this.selected.forEach(obj => {
      let newobj = GameObject.create(obj.type, obj.name, {
          transform: Transform.fromPlain(obj.transform.plain)
        },
        {
          world: this
        }
      )
      
      newobj.transform.position.x += 30
      newobj.transform.position.y += 30
      newobj.setScale(obj.scale)
    })
  }
  select(obj) {
    console.log("selecting object: ", obj)

    if(!(keys.shift || keys.shiftRight)) 
      this.selected = []
    if(this.selected.find(object => object === obj)) return
    this.selected.push(obj)
    console.log("after selection: ", this.selected)
  }
  deselectAll() {
    this.selected = []
  }
  renameSelected() {
    this.selected.forEach(obj => {
      obj.updateName(window.prompt("Rename", obj.name))
    })
  }
  recolorSelected() {
    this.selected.forEach(obj => {
      obj.updateColor(window.prompt("Rename", obj.color))
    })
  }
  deleteSelected() {
    this.selected.forEach(obj => {
      GameObject.destroy(obj)
    })
    this.deselectAll()
  }
  addMapImage() {
    let names = window.prompt("Sprite name", "nebula1") || ""
    if(names) 
      names = names.replaceAll(" ", "").split(",")
    if(names.length === 0) 
      return

    names.forEach(name => {
      if(data.mapImage[name] == null) return

      GameObject.create(
        "mapImage", 
        name, 
        {
          transform: new Transform()
        }, 
        {
          world: this
        }
      )
    })
    setTimeout(() => this.setTool("move"), 100)
  }
  addMapIcon(locationType) {
    let locationReference = window.prompt("Location reference: ", "")
    if(!locationReference) {
      setTimeout(() => this.setTool("move"), 100)
      return
    }

    GameObject.create(
      "mapIcon", 
      locationType, 
      {
        transform: new Transform(),
        locationReference
      }, 
      {
        world: this
      }
    )
    setTimeout(() => this.setTool("move"), 100)
  }
  zoom(direction = "in" || "out") { 
    if(this.camera.zoom.active) return
    this.camera.zoomInit(direction)
  }
  pan() {
    let 
    position = this.cameraAnchor.transform.position
    position.sub(mouse.mapMoved)
    position.clampWithinBounds(this.camera.bounds)
  }
  updateObjects() {
    this.gameObjects.mapIcon.forEach(icon => {
      /* the sprite is actually scaled down because it's a workaround for the imprecision of photoshop exporting wonky sprites */
      /* these icons rotate and they have to rotate nicely, therefore the sprite is originally 4 times larger the actual side */

      let scaleDownFactor = 0.25
      icon.sprite.container.scale.set((this.camera.currentZoom * (icon.hover / 4 + 1)) * scaleDownFactor)
      icon.sprite.container.position.set(icon.transform.position.x, icon.transform.position.y)
      icon.transform.position.setFrom(icon.transform.position)
    })
    this.gameObjects.mapImage.forEach(img => {
      img.sprite.container.position.set(img.transform.position.x, img.transform.position.y)
      img.transform.position.setFrom(img.transform.position)
    })
  }
  drawHitboxForSelected() {
    this.selected.forEach(obj => {
      Hitbox.drawBoundingBox(obj, this.graphics, this.camera.currentZoom)
    })
  }
  openStarSystemDetail(systemName) {
    gameManager.setWindow(starSystemDetail)
    starSystemDetail.updateDescription(systemName)
  }
  update() {
    this.drawHitboxForSelected()
    this.updateObjects()
    this.images.forEach(img => img.update())
  }
}
class MapIcon extends GameObject {
  constructor(transform, locationType, locationReference) {
    //locationType is actually the "name" parameter for most other objects, but here
    //it refers to the location "type": connected/outback; it isn't the name of the place
    //locationReference is the actual name of the location and a string accessor inside data.starSystem
    super(transform)
    let objectData = data.mapIcon[locationType]
    this.type = "mapIcon"
    this.name = locationType

    if(!data.starSystem[locationReference])
      throw "'" + locationReference +  "': this location doesn't exist, create it first please."
    
    this.locationReference = locationReference
    this.locationDisplayName = data.starSystem[locationReference].displayName
    this.locationType = locationType
    this.hover = false
    this.fontSize = 16
    this.transform.angularVelocity = 0.5

    this.orbitalVelocities = [
      Random.float(0.7, 1.5),
      Random.float(0.4, 1),
      Random.float(0.25, 0.75),
    ]
    
    this.components = [
      "hitbox",
      "sprite",
    ]
    this.textSprite = null
    this.registerComponents(objectData)
  }
  createText() {
    this.textSprite = new PIXI.Text(this.locationDisplayName, {fontFamily: "space", fill: "0xffffff"})
    this.textSprite.position.set(this.transform.position.x + 60, this.transform.position.y - 15)
    this.gameWorld.stage.addChild(this.textSprite)
  }
  showText() {
    if(!this.textSprite)
      this.createText()
    
    this.gameWorld.stage.addChild(this.textSprite)
    this.textSprite.position.set(this.transform.position.x + 30 + (20 * map.camera.currentZoom), this.transform.position.y -  5 - (5 * map.camera.currentZoom))
    this.textSprite.scale.set(this.gameWorld.camera.currentZoom * 0.8)
  }
  hideText() {
    this.gameWorld.stage.removeChild(this.textSprite)
  }
  update() {
    if(this.sprite.orbits)
      Sprite.updateOrbits(this)
  }
  destroy() {
    
  }
}
class MapImage extends GameObject {
  constructor(transform, scale, name) {
    super(transform)
    let objectData = data.mapImage[name]
    this.name = name
    this.type = "mapImage"

    this.scale = scale || 1
    this.scaleStep = 0.9

    this.components = [
      "hitbox",
      "sprite",
    ]
    this.registerComponents(objectData)

    this.source = sources.img.mapImage[name].folder + sources.img.mapImage[name].auto[0] + ".png"
    this.img = new Image()
    this.img.src = this.source
    this.img.onload = () => {
      if(!this.hitbox.w || !this.hitbox.h)
        throw "mapImage can only have a box hitbox"
      this.hitbox.w = this.img.naturalWidth * this.scale
      this.hitbox.h = this.img.naturalHeight * this.scale
    }
  }
  cull() {
    //this is an override of the default method to prevent the large image in world map from disappearing
  }
  scaleDown() {
    this.scale = this.sprite.container.scale.x * this.scaleStep
    this.hitbox.w *= this.scaleStep
    this.hitbox.h *= this.scaleStep
  }
  scaleUp() {
    this.scale = this.sprite.container.scale.x / this.scaleStep
    this.hitbox.w /= this.scaleStep
    this.hitbox.h /= this.scaleStep
  }
  setScale(scale) {
    let factor = scale / this.scale
    this.hitbox.w *= factor
    this.hitbox.h *= factor
    this.scale = scale
  }
  update() {
    this.sprite.container.position.set(this.transform.position.x, this.transform.position.y)
    this.sprite.container.scale.set(this.scale)
  }
}
class MapLabel extends GameObject {
  constructor(transform, text, color) {
    super(transform)
    let objectData = {hitbox: {
      type: "box",
      filename: null,
      definition: {
        a: 100,
        b: 100,
      }
    }}
    this.text = text
    this.color = color
    this.fontWeight = 400
    this.type = "mapLabel"
    this.name = "default"
    this.components = ["hitbox"]
    this.registerComponents(objectData)
    this.addSpriteComponentToMapLabel(text, color)
  }
  updateName(text) {
    GameObject.create("mapLabel", this.name, {transform: this.transform.clone(), text: text, color: this.color}, {world: this.gameWorld})
    GameObject.destroy(this)
  }
  updateColor(color) {
    GameObject.create("mapLabel", this.name, {transform: this.transform.clone(), text: this.text, color: color}, {world: this.gameWorld})
    GameObject.destroy(this)
  }
  scaleUp() {

  }
  scaleDown() {

  }
  setScale() {
    
  }
  update() {
    this.sprite.text.scale.set(this.gameWorld.camera.currentZoom * 0.8)
  }
  destroy() {
    
  }
}
class WorldMarker {
  constructor(id, world, parentObject, markerData) {
    this.id = id
    this.world = world
    this.world.markers.push(this)
    this.position = new Vector()
    this.parent = parentObject
    this.screenPosition = new Vector()

    this.flashCount = 0
    this.flashing = true

    this.timers = new Timer(
      ["flash", WorldMarker.flashCycleMS, {loop: true, active: true, onfinish: this.updateFlashCount.bind(this)}]
    )

    this.createSprite(markerData.markerIcon)
    this.updateFlashAnimation()
  }
  createSprite(markerIcon) {
    this.sprite = PIXI.Sprite.from("assets/marker/" + markerIcon + ".png")
    this.sprite.anchor.set(0.5)
    this.sprite.alpha = WorldMarker.opacity
    this.world.layers.overlays.addChild(this.sprite)
  }
  getScreenPosition() {
    let shipToMarkerAngle = player.ship.transform.position.angleTo(this.parent.transform.position)
    let shipClientPosition = worldToClientPosition(this.world, player.ship.transform.position)
    let distance = this.parent.transform.position.clone().sub(player.ship.transform.position)

    if(distance.length() < cw / 2)
      this.sprite.renderable = false
    else
      this.sprite.renderable = true

    let factorX = Math.abs((shipClientPosition.x * this.world.camera.currentZoom) / distance.x)
    let factorY = Math.abs((shipClientPosition.y * this.world.camera.currentZoom) / distance.y)

    let smallerFactor = Math.min(factorX, factorY)
    let markerOffset = distance.clone().mult(smallerFactor).mult(WorldMarker.screenInsetFactor)
    
    this.position = player.ship.transform.position.clone()
    this.position.add(markerOffset)

    
    if(debug.markers) {
      this.world.graphics.lineStyle(2, colors.hitbox.collision, 1)

      this.world.graphics.drawCircle(this.position.x, this.position.y, 10)

      this.world.graphics.moveTo(player.ship.transform.position.x, player.ship.transform.position.y)
      this.world.graphics.lineTo(this.parent.transform.position.x, this.parent.transform.position.y)
    }
  }
  updateFlashAnimation() {
    if(!this.flashing) return
    this.sprite.alpha = Ease.InOutAlternate(
      this.timers.flash.currentTime, 
      WorldMarker.opacity, 
      WorldMarker.flashOpacityMax - WorldMarker.opacity, 
      this.timers.flash.duration
    )
  }
  reFlash() {
    this.timers.flash.duration = WorldMarker.flashCycleMS
    this.flashing = true
    this.flashCount = 0
    this.timers.flash.start()
  }
  stopFlashAnimation() {
    this.flashing = false
    this.sprite.alpha = WorldMarker.opacity
    this.timers.flash.reset()
  }
  updateFlashCount() {
    this.flashCount++
    this.timers.flash.duration += 150
    if(this.flashCount >= WorldMarker.flashCount)
      this.stopFlashAnimation()
  }
  updateSprite() {
    this.sprite.position.set(this.position.x, this.position.y)
    this.sprite.scale.set(this.world.camera.currentZoom)
  }
  update() {
    this.timers.update()
    this.getScreenPosition()
    this.updateFlashAnimation()
    this.updateSprite()
  }
  destroy() {
    this.world.markers.remove(this)
    this.world.layers.overlays.removeChild(this.sprite)
  }
  static screenInsetFactor = 0.92
  static opacity = 0.2
  static flashOpacityMax = 1
  static flashCount = 3
  static flashCycleMS = 420
}
class QuestNode {
  constructor(type, nodeData = {}) {
    this.type = type
    this.position = new Vector()
    this.elements = {}
    this.interactionSets = []
    this.createHTML()
  }
  createHTML() {
    /* node body and header */
    let container =       El("div", "quest-node")
    let widgetDrag =      El("div", "quest-node-widget drag")
    let widgetRemove =    El("div", "quest-node-widget remove", [["title", "Delete node"]])
    let header =          El('div', "quest-node-header")
    let title =           El("div", "quest-node-title", undefined, "Quest node")
    let filler =          El('div', "filler")
    let body =            El("div", "quest-node-body")

    this.elements.container =     container
    this.elements.header =        header
    this.elements.widgetDrag =    widgetDrag
    this.elements.widgetRemove =  widgetRemove
    this.elements.body =          body

    /* type-specific */
    this[`create${this.type.capitalize()}NodeHTML`]()
    
    /* node sockets */
    let wrapperOut = El('div', "quest-node-socket-wrapper out")
    let wrapperIn  = El('div', "quest-node-socket-wrapper in")
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    /* append everything */
    wrapperIn.append(socketIn)
    wrapperOut.append(socketOut)
    header.append(title, filler, widgetDrag, widgetRemove)
    container.append(header, wrapperOut, wrapperIn)
    questDesigner.element.append(container)
  }
  createQuestNodeHTML() {
    let interactionSets = El("div", "interaction-set-container")

    this.elements.body.append(interactionSets)
  }
  createRouterNodeHTML() {

  }
  move(vector) {
    this.position.add(vector)
    this.moveHTML()
  }
  moveHTML() {
    this.elements.container.style.left = this.position.x  + "px"
    this.elements.container.style.top  = this.position.y  + "px"
  }
  update() {

  }
  destroy() {
    this.elements.container.remove()
  }
  static types = {
    quest: true,
    router: true,
  }
}

class QuestDesigner extends GameWindow {
  constructor() {
    super("QuestDesigner", Q("#quest-designer"))
    this.nodes = []
    this.activeNode = []
    this.state = new State(
      "default",
    )
    this.edit = {
      active: false,
      object: null,
    }
    this.drag = {
      active: false,
      object: null,
      origin: new Vector()
    }
    this.pan = {
      active: false,
    }
  }
  handleMousedown(event) {
    switch(event.button) {
      case 0: {this.handleLeftDown(event);   break}
      case 1: {this.handleMiddleDown(event); break}
      case 2: {this.handleRightDown(event);  break}
    }
  }
  handleLeftDown(event) {
    let target = event.target
    if(target === this.element) {
      this.createNode("quest")
    }
    if(target.closest(".quest-node")) {
      this.setActiveNode(target.closest(".quest-node"))
    }
    if(target.closest(".quest-node-widget.drag")) {
      this.dragBegin(target.closest(".quest-node"))
    }
  }
  handleMiddleDown(event) {
    this.pan.active = true
  }
  handleRightDown(event) {

  }
  handleMousemove(event) {
    if(this.drag.active) {
      this.dragUpdate()
    }
    if(this.pan.active) {
      this.panNodes()
    }
  }
  handleMouseup(event) {
    switch(event.button) {
      case 0: { this.handleLeftUp(event);   break }
      case 1: { this.handleMiddleUp(event); break }
      case 2: { this.handleRightUp(event);  break }
    }
  }
  handleLeftUp(event) {
    this.dragEnd()
  }
  handleMiddleUp(event) {
    this.pan.active = false
  }
  handleRightUp(event) {
    
  }
  handleWheel(event) {
    let target = event.target

    if(target === this.element) {
      this.scrollNodes(event.deltaY * -1)
    }
  }
  dragBegin(element) {
    this.drag.active = true
    this.drag.object = this.getNodeByElement(element)
    this.drag.origin.setFrom(mouse.clientPosition)
  }
  dragUpdate() {
    this.drag.object.move(mouse.clientMoved)
  }
  dragEnd() {
    this.drag.active = false
    this.drag.object = null
    this.drag.origin.set(0)
  }
  panNodes() {
    this.nodes.forEach(node => node.move(mouse.clientMoved))
  }
  scrollNodes(amount) {
    this.nodes.forEach(node => node.move(new Vector(0, amount)))
  }
  setActiveNode(element) {
    this.activeNode = this.getNodeByElement(element)
  }
  getNodeByElement(element) {
    return this.nodes.find(node => node.elements.container === element)
  }
  createNode(type) {
    let 
    node = new QuestNode(type, {})
    node.position.setFrom(mouse.clientPosition)
    node.moveHTML()

    this.nodes.push(node)
  }
  destroyNode(node) {
    node.destroy()
    this.nodes.remove(node)
  }
}
class StatusEffect {
  constructor(gameObject, name) {
    let objectData = data.statusEffect[name]
    this.type = "statusEffect"
    this.name = name

    this.gameObject = gameObject
    this.gameObject.statusEffects.push(this)

    this.timers = new Timer(
      ["decrement", objectData.durationMS, {loop: false, active: true, onfinish: this.onFinish.bind(this)}]
    )
  }
  onFinish() {
    this[this.name + "Finish"]()
    this.destroy()
  }
  affectGameObject() {
    this[this.name]()
  }
  //#region effect type specific methods
  movementTrap() {
    this.gameObject.engine?.unpower()
    this.gameObject.brakes?.brake()
    this.gameObject.boosters?.unpower()
  }
  movementTrapFinish() {
    this.gameObject.engine?.repower()
    this.gameObject.boosters?.repower()
  }
  //#endregion
  update() {
    this.affectGameObject()
    this.timers.update()
  }
  destroy() {
    this.gameObject.statusEffects.remove(this)
  }
  static types = [
    "fire",
    "frost",
    "movementTrap",
    "engineJam",
    "fog",
  ]
}
class DialogueScreen extends GameWindow {
  constructor() {
    super("DialogueScreen")
    this.element = Q("#dialogue-screen")
    this.optionsElement = Q("#dialogue-options")
    this.factSwitcher = Q("#fact-switcher")
    this.dialogueContent = Q('#dialogue-content')
    this.factList = this.factSwitcher.querySelector(".fact-list")
    this.graphics = new PIXI.Graphics()
    this.state = new State(
      "default",
      "dragging",
    )
    this.canFastForwardBubble = true
    this.dragged = null
    this.JSONData = null
    this.timeouts = []
    this.windowType = "overlay"
    this.reset()
  }
  show() {
    if(this.visible) return

    AudioManager.dimMusic(0.5)

    this.visible = true
    this.reset()
    this.element.classList.remove('hidden')
    this.element.style.backgroundColor = "hsla(240, 2%, 8%, 0.0)"
    this.element.animate([
      {filter: "opacity(0) saturate(0)", backgroundColor: "hsla(240, 2%, 8%, 0.0)"},
      {filter: "opacity(1) saturate(1)", backgroundColor: "hsla(240, 2%, 8%, 0.5)"},
    ], {
      duration: 700,
      iterations: 1,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)",
    })
    .onfinish = () => this.element.style.backgroundColor = "hsla(240, 2%, 8%, 0.5)"
  }
  hide() {
    if(!this.visible) return

    this.visible = false
    this.element.animate([
      {filter: "opacity(1) saturate(1)", backgroundColor: "hsla(240, 2%, 8%, 0.5)"},
      {filter: "opacity(0) saturate(0)", backgroundColor: "hsla(240, 2%, 8%, 0.0)"},
    ], {
      duration: 1000,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    })
    .onfinish = () => {
      this.element.classList.add('hidden')
      this.element.style.backgroundColor = ""
      this.reset()
    }
    AudioManager.restoreMusic()
  }
  reset() {
    this.dialogueName = null
    this.nodes = []
    this.facts = null
    this.factsCopy = null
    this.currentNode = null
    this.isDialogueFinished = false
    this.resetHTML()
  }
  resetFacts() {
    this.resetHTML()
  }
  //#region input
  handleKeydown(event) {
    
  }
  handleKeyup(event) {

  }
  handleMousemove(event) {
    if(this.state.is("dragging") && this.dragged)
      this.updateDrag()
  }
  handleMousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".option:not(.leave-call-option)")) {
        let node = this.getNodeById(target.dataset.id)
        this.processNextNode(node)
      }
      if(target.closest("#dialogue-content")) {
        this.fastForwardBubble()
      }
      if(target.closest(".drag-widget")) {
        this.dragBegin(target)
      }
      if(target.closest(".icon-restart-conversation")) {
        this.start()
      }
      if(target.closest(".icon-reset-facts")) {
        this.resetFacts()
      }
      if(target.closest(".fact-value") && target.closest(".fact-list")) {
        let value = event.target.closest(".fact-value")
        let identifier = this.factList.querySelector(`[data-identifier='${value.dataset.identifier}']`).dataset.identifier
        let fact = this.factsCopy.find(fact => fact.identifier === identifier)
        fact.value = !fact.value
        value.innerText = fact.value.toString()
        fact.value ? value.classList.replace("false", "true") : value.classList.replace("true", "false")
        if(typeof fact.value !== "boolean") alert('not boolean')
      }
    }
  }
  handleMouseup(event) {
    if(this.state.is("dragging"))
      this.dragEnd()
  }
  handleClick(event) {
    
  }
  handleWheel(event) {

  }
  //#endregion
  //#region drag
  dragBegin(target) {
    this.dragged = target.closest(".draggable")
    this.state.set("dragging")
  }
  updateDrag() {
    let x = +this.dragged.style.left.replace("px", "")
    let y = +this.dragged.style.top.replace("px", "")
    x += mouse.clientMoved.x
    y += mouse.clientMoved.y
    this.dragged.style.left = x + "px"
    this.dragged.style.top = y + "px"
  }
  dragEnd() {
    this.state.revert()
    this.dragged = null
  }
  //#endregion
  start() {
    this.reset()
    this.nodes = JSON.parse(this.JSONData)
    let node = this.nodes.find(node => node.in.length === 0)
    this.displaySpeakers()
    this.processNextNode(node)
  }
  load(filename) {
    this.dialogueName = filename
    this.reset()
    readJSONFile("data/dialogue/" + filename + ".json", (text) => {
      this.JSONData = text
      this.start()
    })
  }
  displaySpeakers() {
    let speakers = this.getUniqueSpeakersPerDialogueTree()
    let rightContainer = Q("#dialogue-screen-portrait-container-right")
    let leftContainer = Q("#dialogue-screen-portrait-container-left")
    
    leftContainer.innerHTML = ""
    rightContainer.innerHTML = ""
    
    for(let [index, speaker] of speakers.entries()) {
      if(DialogueScreen.hiddenSpeakers.findChild(speaker)) continue

      let 
      image = new Image()
      image.src = "assets/portraits/" + speaker + ".png"

      let 
      imageContainer = El("div", "chat-portrait-big")
      imageContainer.append(image)
      imageContainer.style.zIndex = index

      if(speaker === "player")
        rightContainer.prepend(imageContainer)
      else
        leftContainer.prepend(imageContainer)
    }
    setTimeout(() => {
      if(leftContainer.childNodes.length > 1)
        leftContainer.style.left = "-100px"
      else
        leftContainer.style.left = ""
    }, 500)
  }
  animateSpeakers() {

  }
  getUniqueSpeakersPerDialogueTree() {
    let unfiltered = this.nodes.map(node => {
      if(node.type !== "text") 
        return null
      return node.speaker
    })
    .filter(s => s !== null)

    let speakers = []
    unfiltered.forEach(speaker => {
      if(!speakers.find(s => s === speaker))
        speakers.push(speaker)
    })
    return speakers
  }
  getNodeById(id) {
    return this.nodes.find(node => node.id === +id)
  }
  getNextNode() {
    this.unhighlightSpeakerImage()

    if(this.forwardingTimeout)
      window.clearTimeout(this.forwardingTimeout)

    let node = this.getNodeById(this.currentNode.out[0]?.to)
    if(!node) 
      return this.endDialogue()
    else
      this.processNextNode(node)
  }
  pickNodeForNPC(nodes = []) {
    let [filteredNodes, criteriaRequirementCounts] = this.filterNodes(nodes)
    let mostSpecific = Math.max(...criteriaRequirementCounts)
    let index = criteriaRequirementCounts.indexOf(mostSpecific)
    let pickedNode = filteredNodes[index]

    this.processNextNode(pickedNode)
  }
  processNextNode(node) {
    this.clearOptions()

    this.canFastForwardBubble = false
    this.forwardingTimeout = setTimeout(() => {
      this.canFastForwardBubble = true
    }, DialogueScreen.bubbleDelay)

    this.currentNode = node
    this[`process${node.type.capitalize()}Node`](node)
  }
  //#region processing notes per type
  processTextNode(node) {
    this.createBubble(node.speaker, node.text)
  }
  processResponsePickerNode(node) {
    let out = node.out.map(output => this.nodes.find(node => node.id === output.to))
    if(out.find(conn => conn.speaker !== "player"))
      this.pickNodeForNPC(out)
    else
      this.generateOptions(out)
  }
  processTransferNode(node) {
    let nonPlayerRow = node.transfer.find(part => part.owner !== "player")
    if(!nonPlayerRow) throw "npc item transfer has not been implemented yet"

    let items = nonPlayerRow.items.map(itemName => new Item(itemName))
    receivedItemModal.setItems(...items)
    gameManager.setWindow(receivedItemModal)
    player.inventory.addItems(...items)

    console.log(nonPlayerRow.items, items)

    receivedItemModal.onClose = () => this.getNextNode()
  }
  processPassNode(node) {
    this.createBubble(node.speaker, node.text)
  }
  processWhisperNode(node) {
    
  }
  processAggressionNode(node) {
    /* this method turns ALL npcs involved in the dialogue hostile, not just the specific one mentioned in the node */
    let speakersInvolved = this.getUniqueSpeakersPerDialogueTree()
    game.gameObjects.npc.forEach(npc => {
      if(!speakersInvolved.find(s => s == npc.name)) return
      npc.stateMachine.setStateByName("attackEnemy")
      npc.ship?.stealth?.deactivate()
    })
    this.endDialogue("Prepare for a fight")
  }
  processFactSetterNode(node) {
    node.factsToSet.forEach(fact => Fact.create(fact.id, fact.identifier, fact.value))
    this.getNextNode()
  }
  //#endregion
  resetHTML() {
    this.clearTimeouts()
    this.factSwitcher.querySelector(".fact-list").innerHTML = ""
    
    Array.from(this.element.querySelectorAll(".dialogue-block, .dialogue-options .option, .dialogue-end-block"))
    .forEach(el => el.remove())
  }
  clearTimeouts() {
    this.timeouts.forEach(t => window.clearTimeout(t))
    this.timeouts = []
  }
  async createBubble(speaker, text) {
    /* create html elements for the bubble */
    let block =       El("div", "dialogue-block")
    let bubble =      El("div", "chat-bubble ui-button-minimal-alt-filled")
    let bubbleArrow = El("div", "chat-bubble-arrow")
    let bubbleText =  El("span", "chat-bubble-text")
    this.dialogueContent.append(block)

    /* remaining letters for the current dialogue bubble */
    this.remainingLetters = text.split("")

    /* keep calling this function until there are no remaining letters to animate */
    const nextLetter = (prependWithSpace = false) => {
      let letter = this.remainingLetters.shift()
      let prependNextLetterWithSpace

      prependWithSpace ?
      bubbleText.innerText += " " + letter + " " :
      bubbleText.innerText += letter

      letter === " " ?
      prependNextLetterWithSpace = true :
      prependNextLetterWithSpace = false

      if(this.remainingLetters.length === 0) {
        let timeout = setTimeout(this.getNextNode.bind(this), 900)
        this.timeouts.push(timeout)
        return
      }

      /* set next delay based on character */
      let delay = 28
      if(letter.includes(","))
        delay = 260
      if(letter.includes("?")) 
        delay = 520
      if(letter.includes(".")) 
        delay = 520
      if(letter.includes(".") && this.remainingLetters[0].includes("."))
        delay = 260

      let timeout = setTimeout(() => nextLetter(prependNextLetterWithSpace), delay)
      this.timeouts.push(timeout)
      AudioManager.playSFX("dialogueLetter" + Random.int(1, 3), Random.decimal(0.4, 0.5, 1))
    }

    let bubbleHeight = await this.getBubbleHeight(text, block)

    bubble.append(bubbleText, bubbleArrow)
    bubble.dataset.playsfx = ""
    bubble.dataset.sounds = "buttonNoAction"
    bubble.dataset.playonevents = "mouseover"
    bubble.dataset.volumes = "0.05"
    bubble.style.height = bubbleHeight + "px"
    bubbleText.classList.add("chat-bubble-text-background-color")

    /* highlight character that the chat bubble belongs to */
    bubble.onmouseenter = () => this.highlightSpeakerImage(speaker)
    bubble.onmouseleave = () => this.unhighlightSpeakerImage()

    /* change bubble appearance based on whether speaker is player */
    if(speaker === "player") {
      bubble.classList.add("orange")
      bubbleArrow.classList.add("right")
      block.append(bubble)
    }
    else {
      bubble.classList.add("dialogue-gray")
      bubbleArrow.classList.add("left")
      block.append(bubble)
    }
    nextLetter()
    this.scrollDown()
    this.previousSpeaker = speaker
  }
  highlightSpeakerImage(speaker) {
    Qa("#dialogue-screen-portrait-container-right .chat-portrait-big img, #dialogue-screen-portrait-container-left .chat-portrait-big img").forEach(portrait => {
      if(portrait.src.includes(speaker)) 
        portrait.style.filter = DialogueScreen.highlightFilter
      else
        portrait.style.filter = DialogueScreen.dimFilter
    })
  }
  unhighlightSpeakerImage() {
    Qa(".chat-portrait-big img").forEach(portrait => portrait.style.filter = "")
  }
  async getBubbleHeight(text, dialogueBlock) {
    /* this function creates an invisible bubble, waits for DOM to *hopefully* update and then returns the bubble height */
    let newBubble = El("div", "chat-bubble ui-button-minimal-alt-filled")
    let newText = El("span", "chat-bubble-text")

    newBubble.style.filter = "opacity(0)"
    newBubble.append(newText)
    newText.innerText = text

    dialogueBlock.append(newBubble)
    await waitFor(DialogueScreen.bubbleDelay)
    let height = newBubble.getBoundingClientRect().height
    newBubble.remove()
    return height
  }
  scrollDown() {
    this.dialogueContent.scrollTo({top: this.dialogueContent.scrollHeight, behavior: "smooth",})
  }
  async fastForwardBubble() {
    if(!this.canFastForwardBubble) return
    if(this.currentNode.type === "responsePicker") return

    this.canFastForwardBubble = false
    this.clearTimeouts()

    let bubbles = Qa(".chat-bubble-text")
    bubbles.last().innerText += this.remainingLetters.join("")
    this.remainingLetters = []

    let timeout = setTimeout(() => this.getNextNode(), 400)
    this.timeouts.push(timeout)

    AudioManager.playSFX("buttonNoAction", 0.3)
    await waitFor(70)
    AudioManager.playSFX("buttonNoAction", 0.2)
    await waitFor(70)
    AudioManager.playSFX("buttonNoAction", 0.15)
  }
  filterNodes(nodes) {
    let filteredNodes = []
    let criteriaRequirementCounts = []
    nodes.forEach(node => {
      node.criteria.forEach(criterion => {
        let passedCriterion = true
        criterion.requirements.forEach(requirement => {
          switch(requirement.type) {
            case "fact": {
              let match = Fact.testForFact(requirement.identifier) === requirement.expectedValue
              if(!match) passedCriterion = false
              break
            }
            case "condition": {
              let match = Fact.testForCondition(requirement.entryObject, requirement.accessorChain, requirement.condition)
              if(!match) passedCriterion = false
              break
            }
          }
        })
        if(passedCriterion) {
          filteredNodes.push(node)
          criteriaRequirementCounts.push(criterion.requirements.length)
        }
      })
      if(node.criteria.length == 0) {
        filteredNodes.push(node)
        criteriaRequirementCounts.push(0)
      }
    })
    return [filteredNodes, criteriaRequirementCounts]
  }
  generateOptions(nodes = []) {
    let [filteredNodes] = this.filterNodes(nodes)
    this.optionsElement.classList.remove("inactive")

    let 
    optionsCopy = this.optionsElement.cloneNode(true)
    optionsCopy.style.filter = "opacity(0)"
    optionsCopy.style.position = "absolute"
    optionsCopy.style.top = 0
    optionsCopy.style.left = 0
    optionsCopy.style.width = this.optionsElement.getBoundingClientRect().width + "px"

    document.body.append(optionsCopy)

    let options = []
    filteredNodes.forEach(node => {
      let 
      option = El("div", "option", undefined)
      option.innerText = node.text
      
      for(let key in node.labels) {
        if(node.labels[key])
          option.innerText = `[${key.capitalize()}] ` + option.innerText
      }

      option.style.filter = "opacity(0)"
      option.dataset.id = node.id
      option.dataset.playsfx = ""
      option.dataset.sounds = "buttonHover buttonClick"
      option.dataset.playonevents = "mouseover mousedown"
      optionsCopy.append(option)
      options.push(option)
    })

    optionsCopy.removeAttribute("style")
    this.optionsElement.replaceWith(optionsCopy)
    this.optionsElement = optionsCopy
    options.forEach(option => option.removeAttribute("style"))
    this.scrollDown()

    this.generateWaitingBlock()

    AudioManager.playSFX("dialogueOptionsShow")
  }
  clearOptions() {
    let options = Qa('#dialogue-options .option')
    
    if(!options.length) return

    options.forEach(o => o.remove())
    this.optionsElement.classList.add("inactive")

    this.destroyWaitingBlock()
    AudioManager.playSFX("dialogueOptionsHide")

    this.dialogueContent.style.justifyContent = ""
  }
  generateWaitingBlock() {
    let block = El("div", "dialogue-block waiting-block")
    let bubble = El("div", "chat-bubble ui-button-minimal-alt-filled orange")

    /* this shit animates the 3 circles element inside the waiting bubble */
    let img = new Image(); img.style.width = "50px"
    let animIndex = 0
    let interval = setInterval(() => {
      img.src = `assets/ui/chat/chatCirclesWaiting000${animIndex}.png`
      animIndex++
      if(animIndex > 9)
        animIndex = 0
      if(!img.isConnected) {
        window.clearInterval(interval)
      }
    }, 250)

    bubble.append(img)
    block.append(bubble)
    this.dialogueContent.append(block)

    /* this enables scrolling for the dialogue but only while the player is picking from options */
    setTimeout(() => {
      let totalDialogueHeight = sum(...Qa("#dialogue-content .chat-bubble").map(bubble => bubble.getBoundingClientRect().height + 20))
      console.log(totalDialogueHeight)
      if(totalDialogueHeight < 540) return

      this.dialogueContent.style.justifyContent = "flex-start"
      this.dialogueContent.scrollTo({behavior: "auto", top: this.dialogueContent.scrollHeight + 50})
    }, 400)
  }
  destroyWaitingBlock() {
    Q(".dialogue-block.waiting-block")?.remove()
  }
  endDialogue(endMessage) {
    if(this.isDialogueFinished) return

    this.isDialogueFinished = true
    AudioManager.playSFX("speakerLeaveDialogue")
    this.generateDialogueEndBlock(endMessage)
    Qa(".chat-portrait-big").forEach(portrait => portrait.style.filter = DialogueScreen.desatFilter)
  }
  generateDialogueEndBlock(endMessage) {
    let block = El("div", "dialogue-end-block ui-graphic")
    let text = El("div", "dialogue-block-informatory-text-bubble")

    text.innerText = endMessage ?? "All participants left, you can close the window."
    block.append(text)
    Q('#dialogue-content').append(block)
    this.scrollDown()

    let option = El("div", "option leave-call-option", undefined, "Leave call")
    option.dataset.playsfx =      ""
    option.dataset.sounds =       "buttonHover buttonClick"
    option.dataset.playonevents = "mouseover mousedown"

    /* this is a terrible hack so the intro quest can continue */
    option.onclick = () => Q("#leave-call-button").click()

    this.optionsElement.append(option)
  }
  //#region fact switcher
  setupFactSwitcher() {
    /* create an index of facts that have been altered for the sake of dialogue testing */
    this.alteredFacts = {} 
  }
  switchFact(fact) {

  }
  //#endregion
  static hiddenSpeakers = [
    "dummyCaptain",
    "aiAssistant",
  ]
  static bubbleDelay = 450
  static desatFilter =      "grayscale(0.5)  brightness(0.6)"
  static dimFilter =        "grayscale(0.25) brightness(0.78)"
  static highlightFilter =  "saturate(1.1)   brightness(1.3)"
}
class DialogueNode {
  constructor(type, text, speaker, pos = new Vector(cw/2, ch/2), id, criteria, options = {labels: null, factsToSet: null}, transfer, recipient) {
    this.id = id || uniqueID(dialogueEditor.nodes)
    this.pos = pos.clone()
    this.type = type
    this.speaker = speaker || null
    this.recipient = recipient || null
    this.text = text
    this.criteria = criteria ?? []
    this.factsToSet = options.factsToSet ?? []
    this.labels = {
      lie:        options.labels?.lie         || false,
      exaggerate: options.labels?.exaggerate  || false,
    }
    this.in = []
    this.out = []
    this.transfer = transfer ?? [
      {
        owner: "player",
        items: [""]
      },
      {
        owner: "player",
        items: [""]
      }
    ]
    dialogueEditor.nodes.push(this)
    this["createHTML" + type.capitalize()]()
    this.update()
    this.reorderOutputs()
  }
  drag() {
    this.pos.add(mouse.clientMoved)
  }
  createHTML() {
    /* header */
    let node =                El('div', "dialogue-node")
    let header =              El('div', "dialogue-node-header")
    let nodeTitle =           El('div', "dialogue-node-title", undefined, "Fact setter")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    let filler =              El("div", "filler")
    
    /* sockets */
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    this["createHTML" + type.capitalize()]()

    //wrap up
    
    //finish node creation
  }
  createHTMLText() {
    let node =                El('div', "dialogue-node")
    let header =              El('div', "dialogue-node-header")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    let labels =              El("div", "dialogue-node-label-container")
    let lieLabel =            El("div", "dialogue-node-label", [["title", "The player is lying"]], "Lie")
    let exaggerateLabel =     El("div", "dialogue-node-label", [["title", "The player is exaggerating"]], "Exaggerate")

    if(this.labels.lie)
      lieLabel.classList.add("active")
    if(this.labels.exaggerate)
      exaggerateLabel.classList.add("active")

    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text = El('div', "dialogue-node-row dialogue-node-text-field", [["title", "Text"]], this.text)

    socketOut.dataset.index = this.out.length

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    text.dataset.editable = "true"
    text.dataset.datatype = "text"
    lieLabel.dataset.nodelabel = "lie"
    exaggerateLabel.dataset.nodelabel = "exaggerate"

    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList)
    labels.append(lieLabel, exaggerateLabel)
    node.dataset.id = this.id
    node.append(header, speaker, text, factCount, labels, wrapperOut, wrapperIn )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLPass() {
    let node =                El('div', "dialogue-node")
    let header =              El('div', "dialogue-node-header")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text = El('div', "dialogue-node-row dialogue-node-row-informational", [["title", "Text"]], "Speaker says nothing.")

    socketOut.dataset.index = this.out.length

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id

    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList)
    node.dataset.id = this.id
    node.append(header, speaker, text, factCount, wrapperOut, wrapperIn )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLWhisper() {
    let node =                El('div', "dialogue-node")
    let header =              El('div', "dialogue-node-header")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let recipient = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.recipient)

    let text = El('div', "dialogue-node-row dialogue-node-text-field", [["title", "Text"]], this.text)

    socketOut.dataset.index = this.out.length

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id
    recipient.dataset.datatype = "recipient"
    recipient.dataset.id = this.id
    text.dataset.editable = "true"
    text.dataset.datatype = "text"

    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList)
    node.dataset.id = this.id
    node.append(header, speaker, recipient, text, factCount, wrapperOut, wrapperIn )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLResponsePicker() {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widgetDrag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList = El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount = El("div", "fact-count")

    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    
    let socketIn = El.special('node-socket-in')
    let socketOut = El.special('node-socket-out')

    socketOut.dataset.index = this.out.length
    node.dataset.id = this.id
    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)
    header.append(widgetRemove, widgetDrag, widgetList)
    node.append(header, factCount, wrapperIn, wrapperOut )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLTransfer() {
    let node = El('div', "dialogue-node")
    let header = El('div', "dialogue-node-header")
    let widgetDrag = El("div", "dialogue-node-widget drag", [["title", "Drag node"]])    
    let nodeTitle =  El('div', "dialogue-node-title", undefined, "Transfer")
    let widgetRemove = El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList = El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount = El("div", "fact-count")
    let filler =    El("div", "filler")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")

    let socketIn = El.special('node-socket-in')
    let socketOut = El.special('node-socket-out')

    let cont = El('div', "dialogue-node-transfer-container")

    //create the person rows
    for(let i = 0; i < 2; i++) {
      let row = El("div", "dialogue-node-transfer")
      let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Owner of these items"]])
      let itemCont = El("div", "dialogue-node-item-container")
      let icon = El("div", "dialogue-node-icon plus hover-dark-02")
      let addButton = El("div", "dialogue-node-add-item",  [["title", "Add new item slot"]])

      //for each item in both rows of transfer, add an item element into this array
      let items = this.transfer[i].items.map(() => {
        return El("div", "dialogue-node-item empty", [["title", "Click to select an item"]])
      })

      row.dataset.personindex = i

      speaker.innerText = this.transfer[i].owner
      speaker.dataset.datatype = "speaker"
      speaker.dataset.speaker = this.transfer[i].owner
      speaker.dataset.id = this.id

      icon.dataset.personindex = i
      itemCont.dataset.personindex = i

      items.forEach((item, index) => {
        item.dataset.itemindex = index
        item.dataset.datatype = "item"
        item.dataset.item = this.transfer[i].items[index]
      })

      this.transfer[i].items.forEach((item, index) => {
        if(item == "") return
        let thumbnail = new Image()
            thumbnail.src = `assets/${data.item[item].folder ?? "item"}/${item}.png`
        items[index].append(thumbnail)
      })

      addButton.append(icon)
      itemCont.append(...items, addButton)
      row.append(speaker, itemCont)
      cont.append(row)
    }

    socketOut.dataset.index = this.out.length
    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)
    header.append(widgetRemove, widgetDrag, widgetList, filler, nodeTitle)
    node.dataset.id = this.id
    node.append(header, factCount, cont, wrapperIn, wrapperOut)

    dialogueEditor.element.append(node)
    this.element = node
    console.log(node)
  }
  createHTMLAggression() {
    let node =                El('div', "dialogue-node aggression")
    let header =              El('div', "dialogue-node-header")
    let nodeTitle =           El('div', "dialogue-node-title", undefined, "Aggression")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    let filler =              El("div", "filler")
    
    let wrapperOut = El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  = El('div', "dialogue-node-socket-wrapper in")
    
    let socketOut = El.special('node-socket-out')
    let socketIn = El.special('node-socket-in')

    let speaker = El('div', "dialogue-node-row dialogue-node-speaker", [["title", "Speaker"]], this.speaker)
    let text = El('div', "dialogue-node-row dialogue-node-row-informational", [["title", "Text"]], "Speaker turns on you. This ends the dialogue.")

    socketOut.dataset.index = this.out.length

    speaker.dataset.datatype = "speaker"
    speaker.dataset.id = this.id

    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList, filler, nodeTitle)
    node.dataset.id = this.id
    node.append(header, speaker, text, factCount, wrapperOut, wrapperIn )

    dialogueEditor.element.append(node)
    this.element = node
  }
  createHTMLFactSetter() {
    /* header */
    let node =                El('div', "dialogue-node")
    let header =              El('div', "dialogue-node-header")
    let nodeTitle =           El('div', "dialogue-node-title", undefined, "Fact setter")
    let widgetDrag =          El("div", "dialogue-node-widget drag", [["title", "Drag node"]])
    let widgetRemove =        El("div", "dialogue-node-widget remove", [["title", "Delete node"]])
    let widgetList =          El("div", "dialogue-node-widget list", [["title", "Open facts list"]])
    let factCount =           El("div", "fact-count")
    let filler =              El("div", "filler")

    let factContainer =       El("div", "dialogue-node-fact-container")
    let addFactButton =       El("div", "dialogue-node-add-fact-button ui-graphic")

    let wrapperOut =          El('div', "dialogue-node-socket-wrapper out")
    let wrapperIn  =          El('div', "dialogue-node-socket-wrapper in")
    let socketOut =           El.special('node-socket-out')
    let socketIn =            El.special('node-socket-in')

    socketOut.dataset.index = this.out.length

    wrapperOut.append(socketOut)
    wrapperIn.append(socketIn)

    header.append(widgetRemove, widgetDrag, widgetList, filler, nodeTitle)
    node.dataset.id = this.id
    node.append(header, factContainer, addFactButton, factCount, wrapperOut, wrapperIn )

    dialogueEditor.element.append(node)
    this.element = node

    this.refreshHTML()
  }
  addSetterFact(id, identifier = "fact_identifier", value = true) {
    this.factsToSet.push(Fact.createSetterFact(id, identifier, value))
    this.refreshHTML()
  }
  createSetterFactHTML(index, identifier, value) {
    let container = this.element.querySelector(".dialogue-node-fact-container")
    let row = El("div", "dialogue-node-fact-row", [["data-factindex", index]])
    let identifierElement = El("div", "dialogue-node-fact-identifier", [["data-editable", "true"], ["data-datatype", "nodeFactIdentifier"]], identifier)
    let valueElement = El("div", `dialogue-node-fact-value ${value}`,    [["data-editable", "true"], ["data-datatype", "factValue"], ["data-isboolean", "true"]], value)
    let deleteButton = El("div", "dialogue-node-fact-delete-button ui-graphic")

    row.append(identifierElement, valueElement, deleteButton)
    container.append(row)
  }
  flipSetterFact(index) {
    this.factsToSet[index].value = !this.factsToSet[index].value
    this.refreshHTML()
  }
  setFactIdentifier(index, identifier) {
    this.factsToSet[index].identifier = identifier
  }
  removeSetterFact(index) {
    console.log("remove setter fact")
    this.factsToSet.splice(index, 1)
    this.refreshHTML()
  }
  refreshHTML() {
    this[`refresh${this.type.capitalize()}HTML`]()
  }
  refreshFactSetterHTML() {
    this.element.querySelector(".dialogue-node-fact-container").innerHTML = ""
    this.factsToSet.forEach((fact, index) => this.createSetterFactHTML(index, fact.identifier, fact.value))
  }
  reorderOutputs() {
    let sockets = Array.from(this.element.querySelectorAll(".dialogue-node-socket.out"))
    sockets.forEach(s => s.remove())

    let i = 0
    do {
      let socketOut = El.special('node-socket-out')
      socketOut.dataset.index = i
      this.element.querySelector(".dialogue-node-socket-wrapper.out").append(socketOut)
      i++
    } while (i < this.out.length + 1*(this.type === "responsePicker"))

    this.out.forEach((node, index) => {
      node.index = index
    })
  }
  createConnection(to) {
    if(this.type !== "responsePicker") 
      this.deleteOut()
    if(to.in.find(connection => connection.from.id === this.id)) return
    if(to.out.find(connection => connection.to.id === this.id)) return
    let index = this.out.length
    let conn = {to, index}
    this.out.push(conn)

    to.in.push({from: this})

    if(this.type === "responsePicker")
      this.reorderOutputs()
  }
  deleteConnection(index) {
    let conn = this.out[index]
    let to = dialogueEditor.nodes.find(node => node.id === conn.to.id)
    let destinationRef = to.in.find(conn => conn.from.id === this.id)
    to.in.splice(to.in.indexOf(destinationRef), 1)
    this.out.splice(index, 1)
    this.reorderOutputs()
  }
  deleteIn() {
    this.in.forEach(conn => {
      let from = dialogueEditor.nodes.find(node => node.id === conn.from.id)
      let originRef = from.out.find(conn => conn.to.id === this.id)
      from.reorderOutputs()
      from.out.splice(from.out.indexOf(originRef), 1)
    })
    this.in = []
  }
  deleteOut() {
    this.out.forEach(conn => {
      let to = dialogueEditor.nodes.find(node => node.id === conn.to.id)
      let destinationRef = to.in.find(conn => conn.from.id === this.id)
      to.in.remove(destinationRef)
    })
    this.out = []
  }
  update() {
    this.element.style.left = this.pos.x + "px"
    this.element.style.top = this.pos.y + "px"
    this.element.querySelector(".fact-count").innerText = this.criteria.length + " criteria"
  }
  destroy() {
    this.deleteIn()
    this.deleteOut()
    this.element.remove()
    dialogueEditor.unsetActiveNode()
    dialogueEditor.nodes = dialogueEditor.nodes.filter(node => node !== this)
  }
  static types = [
    "text",
    "responsePicker",
    "transfer",
    "whisper",
    "pass",
    "aggression",
    "factSetter",
  ]
}

class DialogueEditor extends GameWindow {
  constructor() {
    super("DialogueEditor", Q('#dialogue-editor'))
    this.dialogueName = "dialogue1"
    this.nodes = []
    this.textarea = El("textarea", "dialogue-editor-textarea", [["type", "text"],["size", "300"],["width", ""]])
    this.editedData = {}
    this.style = {
      connectionWidth: 8
    }
    this.scale = 1

    /* an element that's visually highlighted using a blue outline */
    this.highlighted = null

    /* name of the last npc used inside a text node */
    this.lastNpc = Object.keys(data.person)[0]

    this.state = new State(
      "default",
      "connecting",
      "creating",
      "creatingContextMenu",
      "deleting",
      "panning",
      "dragging",
      "editing",
      "loading",
      "selectingSpeaker",
      "selectingItem",
      "boxSelection",
    )
    this.selected = {
      connections: [],
      nodes: [],
    }
    this.options = {
      compactView: false
    }
    this.boxSelection = {
      active: false,
      startPoint: new Vector(),
      endPoint: new Vector(),
      box: new BoundingBox(0, 0, 0, 0),
      visual: Q("#dialogue-editor-box-selection"),
      begin() {
        this.reset()
        this.active = true
        this.startPoint.setFrom(mouse.clientPosition)
        this.endPoint.setFrom(mouse.clientPosition)
        this.visual.classList.remove("hidden")
      },
      update() {
        this.endPoint.add(mouse.clientMoved)

        let topLeftPoint = this.startPoint.distance(this.endPoint) > 0 ?  this.startPoint : this.endPoint
        let bottomRightPoint = topLeftPoint === this.startPoint ? this.endPoint : this.startPoint

        let width =  bottomRightPoint.x - topLeftPoint.x
        let height = bottomRightPoint.y - topLeftPoint.y

        this.box = new BoundingBox(
            topLeftPoint.x,
            topLeftPoint.y,
            width,
            height,
        )
        
        this.updateVisual()
      },
      updateVisual() {
        this.visual.style.width   = this.box.w + "px"
        this.visual.style.height  = this.box.h + "px"
        this.visual.style.left    = this.box.x + "px"
        this.visual.style.top     = this.box.y + "px"
      },
      end() {
        this.active = false
        this.endPoint.setFrom(mouse.clientPosition)
        this.selectObjects()
        this.visual.classList.add("hidden")
      },
      selectObjects: () => {
        let nodeRects = this.nodes.map(node => node.element.getBoundingClientRect())
        this.nodes.forEach((node, index) => {
          let nodeBox = new BoundingBox(
            nodeRects[index].x,
            nodeRects[index].y,
            nodeRects[index].width,
            nodeRects[index].height
          )
          if(Collision.auto(this.boxSelection.box, nodeBox)) {
            this.selectNode(node)
          }
        })
      },
      reset() {
        this.startPoint.set(0)
        this.endPoint.set(0)
      },
    }

    this.createHtml()
    this.createFactEditor()
    this.unsetActiveNode()
  }
  createFactEditor() {
    this.factEditor = new FactEditor(this, "view-bottom")
    this.factEditor.hide()
  }
  createHtml() {
    Q('.dialogue-name').innerText = this.dialogueName
    this.svgCont = El("div", "svg-container")
    this.element.append(this.svgCont)
    
    let importIcon = El('div', "icon-import", [["title", "Import dialogue file"]])
    let exportIcon = El('div', "icon-export-facts", [["title", "Export dialogue tree and facts"]])
    this.element.querySelector(".icon-close-container").prepend(importIcon, exportIcon)

    /* canvas for drawing node connections */
    this.canvas = El("canvas", undefined, [["id", "dialogue-editor-canvas"]])
    this.canvas.width = cw
    this.canvas.height = ch
    this.element.append(this.canvas)
  }
  pan() {
    this.nodes.forEach(node => node.pos.add(mouse.clientMoved))
  }
  scroll(amt) {
    this.nodes.forEach(node => node.pos.y += amt)
    this.updateHTML()
  }
  import() {
    let name = window.prompt("dialogue filename", "al_and_betty_2")
    if(!name) return

    this.reset()
    this.state.set('loading')
    Q(".dialogue-name").innerText = name
    this.dialogueName = name
    let url = "data/dialogue/" + name + ".json"

    readJSONFile(url, (text) => {
      let nodes = JSON.parse(text);
      /* create nodes */
      nodes.forEach(node => {
        new DialogueNode(
          node.type, 
          node.text, 
          node.speaker, 
          new Vector(node.pos.x, node.pos.y), 
          node.id, 
          node.criteria, 
          {labels: node.labels, factsToSet: node.factsToSet},
          node.transfer,
          node.recipient
        )
      })
      /* create connections between nodes */
      nodes.forEach(node => {
        node.out.forEach(outConnection => {
          let nodeOrigin =      this.nodes.find(n => n.id === node.id)
          let nodeDestination = this.nodes.find(n => n.id === outConnection.to)
          nodeOrigin.createConnection(nodeDestination)
        })
      })
      /* reconstruct html */
      this.reconstructHTML()
      this.state.set("default")
    })
    
  }
  export() {
    let exportData = []
    this.nodes.forEach(node => {
      let inNodes = node.in.map(n => {return {index: n.index, to: n.from.id}})
      let outNodes = node.out.map(n => {return {index: n.index, to: n.to.id}})

      exportData.push(
        {
          id: node.id,
          pos: node.pos,
          type: node.type,
          speaker: node.speaker,
          recipient: node.recipient,
          transfer: node.transfer,
          labels: node.labels,
          text: node.text,
          factsToSet: node.factsToSet,
          criteria: node.criteria,
          in: inNodes,
          out: outNodes,
        }
      )
    })
    exportToJSONFile(exportData, this.dialogueName)
  }
  displayFactSearch() {
    
  }
  hideFactSearch() {

  }
  unsetActiveNode() {
    Qa(".dialogue-node.active").forEach(node => node.classList.remove("active"))
    this.nodes.forEach(node => node.element.classList.remove("highlighted"))
    this.activeNode = null
    this.factEditor.hide()
  }
  setPerson(person, role) {
    console.log("setting person: ", person)
    if(this.activeNode.type == "text" || this.activeNode.type == "whisper" || this.activeNode.type == "pass" || this.activeNode.type == "aggression") {
      this.activeNode[role] = person
      this.highlighted.innerText = person
    }
    else
    if(this.activeNode.type == "transfer") {
      let personIndex = +this.highlighted.closest(".dialogue-node-transfer").dataset.personindex
      this.activeNode.transfer[personIndex].owner = person
      this.highlighted.innerText = person
    }
    this.lastNpc = person
    this.npcSearchDelete()
  }
  setItem(item) {
    let itemIndex = +this.highlighted.dataset.itemindex
    let speakerRow = this.highlighted.closest(".dialogue-node-transfer")
    let ownerIndex = speakerRow.dataset.personindex
    let owner = speakerRow.querySelector(".dialogue-node-speaker").dataset.speaker

    this.activeNode.transfer[ownerIndex].owner = owner
    this.activeNode.transfer[ownerIndex].items[itemIndex] = item

    let 
    itemThumbnail = new Image()
    itemThumbnail.src = `assets/${data.item[item].folder ?? "item"}/${item}.png`

    let itemElement = speakerRow.querySelector(`.dialogue-node-item[data-itemindex='${itemIndex}']`)

    if(itemElement.querySelector("img"))
      itemElement.querySelector("img").remove()

    itemElement.append(itemThumbnail)
    this.itemSearchDelete()
  }
  unsetItem(itemElement) {
    //this method takes the parameter from an itemElement inside a transfer node, then it determines which slot and which owner should have this item deleted
    let personIndex = +itemElement.closest(".dialogue-node-transfer").dataset.personindex
    let itemIndex = +itemElement.dataset.itemindex
    console.log(personIndex, itemIndex)
    // this.activeNode.element.querySelector(`.dialogue-node-item-container[data-personindex='${personIndex}'`)
    this.activeNode.transfer[personIndex].items[itemIndex] = ""
    itemElement.querySelector("img")?.remove()
    this.itemSearchDelete()
  }
  handleElementEdit(element) {
    this.editedData = {
      content: element.innerText,
      datatype: element.dataset.datatype,
      isBoolean: element.dataset.isboolean === "true",
      parent: element.parentElement,
      element: element,
      node: this.activeNode,
      accessorChain:    element.closest(".requirement-property")?.dataset.accessorchain?.split(" "),
      criterionIndex:   +element.closest(".criterion-container")?.dataset.criterionindex,
      requirementIndex: +element.closest(".criterion-requirement")?.dataset.requirementindex,
      factIndex:        +element.closest(".dialogue-node-fact-row")?.dataset.factindex
    }
    element.replaceWith(this.textarea)
    this.npcSearchDelete()
    this.contextMenuDelete()

    if(this.editedData.isBoolean)
      this.editConfirm(true)
    else
      this.editBegin()
  }
  editBegin() {
    if(this.state.is("editing")) 
      this.editCancel()

    this.textarea.value = this.editedData.element.innerHTML.replaceAll("<br>", "\n")
    this.textarea.style.border = "2px solid var(--color-shield)"
    this.state.set("editing")
    this.textarea.focus()
    this.textarea.select()
  }
  editConfirm(forceExecution) {
    if(this.state.isnt("editing") && !forceExecution) return

    console.log("edit confirm")

    let 
    element = this.editedData.element
    element.innerText = this.textarea.value
    let value = this.textarea.value

    this.textarea.replaceWith(element)

    switch(element.dataset.datatype) {
      case "entry": {
        this.factEditor.setRequirementEntryObject(this.editedData.criterionIndex, this.editedData.requirementIndex, value)
        break
      }
      case "accessorChain": {
        this.factEditor.setRequirementAccessorChain(this.editedData.criterionIndex, this.editedData.requirementIndex, value)
        break
      }
      case "expectedvalue": {
        this.factEditor.flipRequirementExpectedValue(this.editedData.criterionIndex, this.editedData.requirementIndex)
        break
      }
      case "identifier": {
        this.factEditor.setRequirementIdentifier(this.editedData.criterionIndex, this.editedData.requirementIndex, value)
        break
      }
      case "conditionType": {
        this.factEditor.setConditionType(this.editedData.criterionIndex, this.editedData.requirementIndex, value)
        break
      }
      case "conditionTestValue": {
        this.factEditor.setConditionTestValue(this.editedData.criterionIndex, this.editedData.requirementIndex, value)
        break
      }
      case "factValue": {
        this.activeNode.flipSetterFact(this.editedData.factIndex)
        // this.activeNode.factsToSet[this.editedData.factIndex].value = !this.activeNode.factsToSet[this.editedData.factIndex].value
        break
      }
      case "nodeFactIdentifier": {
        this.activeNode.setFactIdentifier(this.editedData.factIndex, value)
        break
      }
      default: {
        this.activeNode[element.dataset.datatype] = value
      }
    }

    this.textarea.style.border = ""
    this.state.set("default")
  }
  editCancel() {
    if(this.state.isnt("editing")) return

    console.log("edit cancel")

    this.textarea.style.border = ""
    this.textarea.replaceWith(this.editedData.element)
    this.state.set("default")
  }
  //#region input
  handleInput(event) {
    this["handle" + event.type.capitalize()](event)
  }
  handleKeydown(event) {
    if(document.activeElement === Q(".fact-search-bar input")) {
      if(event.code === "Escape")
        this.hideFactSearch()
      return
    }
    if(document.activeElement === this.npcSearchInput) {
      this.npcSearchFilter()
      return
    }
    /* when editing a text field */
    if(document.activeElement === this.textarea || this.state.is("editing")) {
      if((event.code === "Enter" || event.code === "NumpadEnter") && (!keys.shift && !keys.shiftRight))
        this.editConfirm()
      if(event.code === "Escape")
        this.editCancel()
      return
    }
    /* general cancel event, should hide most searches, popups and context menus */
    if(event.code === "Escape") {
      this.editCancel()
      this.npcSearchDelete()
      this.itemSearchDelete()
      this.contextMenuDelete()
      this.selected.nodes.length > 0 ? this.deselectAll() : this.unsetActiveNode()
    }
    if(event.code === "KeyD" && !keys.shift) {
      this.duplicateNode(this.activeNode)
    }
    if(event.code === "KeyD" && keys.shift) {
      this.deselectAll()
    }
    if(event.code === "KeyE") {
      this.export()
    }
    if(event.code === "KeyI") {
      this.import()
    }
    if(event.code === "KeyF") {
      this.factEditor.toggle()
    }
    if((event.code === "Delete" || event.code === "Backspace") && this.highlighted.dataset.datatype === "item") {
      this.unsetItem(this.highlighted)
    }
  }
  handleKeyup(event) {
    if(document.activeElement === this.npcSearchInput) {
      this.npcSearchFilter()
    }
  }
  handleMousedown(event) {
    switch(event.button) {
      case 0: {this.handleLeftDown(event);   break}
      case 1: {this.handleMiddleDown(event); break}
      case 2: {this.handleRightDown(event);  break}
    }
  }
  handleLeftDown(event) {
    let target = event.target
    if(this.state.is("editing")) {
      if(target.closest(".dialogue-node") && +target.closest(".dialogue-node").dataset.id !== this.activeNode.id) 
        this.editCancel() 
      else
      if(!target.closest(".dialogue-node") && !target.closest(".fact-editor")) 
        this.editCancel()
    }

    if(target.closest(".dialogue-node")) {
      let sameNodeAsBefore = target.closest(".dialogue-node") === this.activeNode?.element
      this.setActiveNode(event)
      if(this.factEditor.open && !sameNodeAsBefore)
        this.factEditor.refreshStructure()
    }

    if(target.closest(".dialogue-node-socket.out")) {
      this.state.set("connecting")
    }

    if(target.closest(".dialogue-node") && (keys.shift || keys.shiftRight)) {
      this.state.set("connecting")
    }

    if(target.closest(".dialogue-node-label")) {
      let label = target.closest(".dialogue-node-label")
      let labelValue = label.dataset.nodelabel
      this.activeNode.labels[labelValue] = !this.activeNode.labels[labelValue]
      if(this.activeNode.labels[labelValue])
        label.classList.add("active")
      else
        label.classList.remove("active")
    }

    if(target.closest("[data-editable='true']")){
      this.handleElementEdit(target.closest("[data-editable='true']"))
    }

    if(target.closest(".dialogue-node *[data-datatype='speaker']")) {
      this.highlighted = target.closest("[data-datatype='speaker']")
      this.highlighted.style.outline = "2px solid var(--color-accent)"
      this.state.set("selectingSpeaker")
      this.npcSearchCreate("speaker")
    }

    if(target.closest(".dialogue-node *[data-datatype='recipient']")) {
      this.highlighted = target.closest("[data-datatype='recipient']")
      this.highlighted.style.outline = "2px solid var(--color-accent)"
      this.state.set("selectingSpeaker")
      this.npcSearchCreate("recipient")
    }

    if(target.closest(".dialogue-node *[data-datatype='item']")) {
      if(this.itemSearch) {
        this.itemSearchDelete()
        return
      }
      this.highlighted = target.closest("[data-datatype='item']")
      this.highlighted.style.outline = "2px solid var(--color-accent)"
      this.state.set("selectingItem")
      this.itemSearchCreate()
    }
    
    if(target.closest(".dialogue-node-widget.drag")) {
      this.editCancel()
      this.state.set("dragging")
    }

    if(target.closest(".dialogue-node-add-fact-button")) {
      this.activeNode?.addSetterFact()
    }
    if(target.closest(".dialogue-node-fact-delete-button")) {
      let index = +target.closest(".dialogue-node-fact-row").dataset.factindex
      this.activeNode?.removeSetterFact(index)
    }

    if(target.closest(".dialogue-node-widget.remove")) {
      if(target.closest(".dialogue-node")) {
        this.editCancel()
        this.state.set("deleting")
      }
      if(target.closest(".fact-container")) {
        this.factEditor.toggle(event)
      }
    }

    if(target.closest(".fact-editor-delete-criterion-button")) {
      let index = +target.closest(".criterion-container").dataset.criterionindex
      this.factEditor.deleteCriterion(index)
    }

    if(target.closest(".criterion-requirement-delete-button")) {
      let requirementIndex =  +target.closest(".criterion-requirement").dataset.requirementindex
      let criterionIndex =    +target.closest(".criterion-container").dataset.criterionindex
      this.factEditor.deleteRequirementFromCriterion(criterionIndex, requirementIndex)
    }

    if(target.closest(".criterion-requirement-toggle")) {
      let requirementIndex =  +target.closest(".criterion-requirement").dataset.requirementindex
      let criterionIndex =    +target.closest(".criterion-container").dataset.criterionindex
      this.factEditor.toggleRequirementType(criterionIndex, requirementIndex)
    }

    if(target === this.element) {
      this.unsetActiveNode()
      this.state.set("creating")
    }

    if(target.closest("path")) {
      let svg = target.closest("svg")
      svg.childNodes[0].setAttribute("stroke", "blue")
      let node = this.nodes.find(node => node.id === +event.target.closest("svg").dataset.id)
      let index = +svg.dataset.index
      node.deleteConnection(index)
      this.reconstructHTML()
    }

    if(target.closest(".search-popup-row")) {
      
      if(target.closest(".search-popup-row[data-datatype='item']") && keys.ctrl) {
        let item = target.closest(".search-popup-row[data-datatype='item']").dataset.item
        this.unsetItem(item)
      }
      else
      if(target.closest(".search-popup-row[data-datatype='item']")) {
        let item = target.closest(".search-popup-row[data-datatype='item']").dataset.item
        this.setItem(item)
      }
      
      if(target.closest(".search-popup-row[data-datatype='speaker']")) {
        let speaker = target.closest(".search-popup-row").dataset.speaker
        this.setPerson(speaker, "speaker")
      }

      if(target.closest(".search-popup-row[data-datatype='recipient']")) {
        let recipient = target.closest(".search-popup-row").dataset.speaker
        this.setPerson(recipient, "recipient")
      }
    }

    //add an empty item slot into a transfer node
    if(target.closest(".dialogue-node .dialogue-node-icon.plus")) {
      let personIndex = +target.closest(".dialogue-node .dialogue-node-icon.plus").dataset.personindex
      let itemContainer = target.closest(`.dialogue-node .dialogue-node-item-container[data-personindex='${personIndex}']`)
      let itemIndex = Array.from(itemContainer.querySelectorAll(".dialogue-node-item")).length
      console.log(itemIndex)

      let 
      newItem = El("div", "dialogue-node-item empty")
      newItem.dataset.datatype = "item"
      newItem.dataset.itemindex = itemIndex
      itemContainer.append(newItem)
    }

    if(target.closest(".icon-export-facts")) {
      this.export()
    }

    if(target.closest(".icon-import")) {
      this.import()
    }

    if(target.closest(".dialogue-editor-option")) {
      let optionElement = target.closest(".dialogue-editor-option")
      this["setOption" + optionElement.dataset.option.capitalize()]()
      this.options[optionElement.dataset.option] ? 
      optionElement.classList.add("active") : 
      optionElement.classList.remove("active")
    }

    if(target.closest(".context-menu-option")) {
      let option = target.closest(".context-menu-option")
      this.createNode(option.dataset.type, option.dataset.isplayer.bool())
      this.contextMenuDelete()
    }

    if(target.closest(".fact-value") && target.closest(".fact-list")) {
      let value = event.target.closest(".fact-value")
      let node = this.nodes.find(n => n.id === +value.dataset.nodeid)
      let identifier = this.factEditor.list.querySelector(`[data-identifier='${value.dataset.identifier}']`).dataset.identifier
      let fact = node.facts.find(fact => fact.identifier === identifier)
      fact.value = !fact.value
      value.innerText = fact.value.toString()
      fact.value ? value.classList.replace("false", "true") : value.classList.replace("true", "false")
      if(typeof fact.value !== "boolean") 
        alert('not boolean')
    }

    if(target.closest(".dialogue-node-widget.list")) {
      this.factEditor.toggle(event)
    }

    if(target.closest(".fact-editor .dialogue-node-widget.remove")) {
      this.factEditor.hide()
    }
  }
  handleMiddleDown(event) {
    let target = event.target
    if(target.closest(".fact-editor")) return

    this.state.set("panning")
  }
  handleRightDown(event) {
    let target = event.target

    if(target === this.element)
      this.state.set("creatingContextMenu")
  }
  handleMousemove(event) {
    if(this.state.is("dragging")) {
      this.activeNode.drag(event)
      this.selected.nodes.forEach(node => {
        if(node !== this.activeNode) node.drag(event)
      })
    }
    if(this.state.is("panning")) {
      this.pan()
    }
    if(this.state.is("creating")) {
      this.boxSelection.begin()
      this.state.set("boxSelection")
    }
    if(this.state.is("boxSelection")) {
      this.boxSelection.update()
    }
    this.updateHTML()
  }
  handleMouseup(event) {
    /* LMB */
    if(event.button === 0) {
      if(this.state.is("connecting") && event.target.closest(".dialogue-node")) {
        let connectTo = this.getNodeAtMousePosition(event)
        this.activeNode.createConnection(connectTo)
        this.unsetActiveNode()
      }
      if(this.state.is("connecting") && event.target === this.element) {
        let node = this.createNode("text")
        this.activeNode.createConnection(node)
      }
      if(this.state.is("creating") && event.target === this.element) {
        let node = this.createNode("text")
        let event = {target: node.element}
        this.setActiveNode(event)
        this.factEditor.refreshStructure()
      }
      if(this.state.is("deleting") && event.target.closest(".dialogue-node-widget.remove")) {
        this.activeNode.destroy()
      }
      if(this.state.is("boxSelection")) {
        this.boxSelection.end()
      }
      this.contextMenuDelete()
    }
    /* RMB */
    if(event.button === 2) {
      if(this.state.is("creatingContextMenu") && event.target === this.element) {
        this.contextMenuCreate()
      }
    }

    if(this.state.is("dragging") && this.factEditor.open) {
      this.factEditor.show(event)
    }
    if(this.state.isnt("editing", "selectingSpeaker", "selectingItem")) {
      this.state.set("default")
    }
    this.factEditor.toggleEditability()
    this.reconstructHTML()
  }
  handleWheel(event) {
    if(event.target.closest(".fact-editor")) return
    if(event.target.closest(".search-popup")) return

    this.scroll(-event.deltaY)
  }
  //#endregion input
  //#region options
  async setOptionCompactView() {
    /* this method causes a truncation error somewhere and the nodes are getting further apart with each click  */

    this.nodes.forEach(node => {
      node.temp = {} 
      node.temp.height = node.element.getBoundingClientRect().height
    })

    this.options.compactView = !this.options.compactView
    this.options.compactView ? 
    this.element.classList.add("compact-view") : 
    this.element.classList.remove("compact-view")

    await waitFor(200)
    
    let avgHeightDifference = avg(...this.nodes.map(node => node.element.getBoundingClientRect().height / node.temp.height))
    
    this.nodes.forEach(node => node.pos.y *= avgHeightDifference)
    this.reconstructHTML()
  }
  //#endregion
  contextMenuCreate() {
    if(this.contextMenu) 
      this.contextMenuDelete()

    let menu = El("div", "context-menu")
    let title = El("div","context-menu-title", undefined, "Select node type")
    menu.append(title)

    for(let type of DialogueNode.types) {
      let option = El("div", "context-menu-option")
      option.innerText = type.replaceAll("-", " ").splitCamelCase().capitalize()
      option.dataset.type = type
      option.dataset.isplayer = false
      menu.append(option)
    }
    menu.style.left = (mouse.clientPosition.x + 5) + "px"
    menu.style.top =  (mouse.clientPosition.y + 5) + "px"
    this.element.append(menu)
    this.contextMenu = menu
    setTimeout(() => this.fitInViewport(this.contextMenu), 0)

  }
  contextMenuDelete() {
    if(!this.contextMenu) return
    
    this.contextMenu.remove()
    this.contextMenu = null
  }
  npcSearchCreate(role) {
    this.npcSearchDelete()
    let popup =         El("div", "search-popup")
    let itemContainer = El("div", "search-popup-item-list")
    let input =         El("input", "search-popup-input", [["type", "text"]])

    const createField = (speaker) => {
      let row =   El("div", "search-popup-row", undefined, undefined, [["datatype", role],["speaker", speaker]])
      let name =  El("div", "search-popup-name", undefined, speaker)

      let 
      img = new Image()
      img.src = speaker.includes("variable") ? "assets/editor/iconSpeaker.png" : "assets/portraits/" + speaker + ".png"

      row.append(img, name)
      itemContainer.append(row)
    }

    for(let prop in data.person) 
      createField(prop)

    popup.append(input, itemContainer)
    popup.style.left = (mouse.clientPosition.x + 5) + "px"
    popup.style.top = (mouse.clientPosition.y + 5) + "px"

    this.element.append(popup)
    this.npcSearch = popup
    this.npcSearchInput = input
    setTimeout(() => this.fitInViewport(this.npcSearch), 0)
  }
  fitInViewport(popupElement) {
    let rect = popupElement.getBoundingClientRect()
    console.log(rect)
    if(rect.bottom > ch) {
      let top = ch - rect.height - 20
      popupElement.style.top = top + "px"
    }
    if(rect.right > cw) {
      let left = cw - rect.width - 20
      popupElement.style.left = left + "px"
    }
  }
  npcSearchFilter() {
    Qa(".search-popup-row").forEach(row => {
      let name = row.querySelector(".search-popup-name")
      if(name.innerText.toLocaleLowerCase().includes(this.npcSearchInput.value.toLocaleLowerCase()))
        row.classList.remove("hidden")
      else
        row.classList.add("hidden")
    })
  }
  npcSearchDelete() {
    if(!this.npcSearch) return

    this.npcSearch.remove()
    this.npcSearch = null
    this.highlighted.style.outline = ""
    this.highlighted = null
    this.state.ifrevert("selectingSpeaker")
  }
  itemSearchCreate() {
    let popup =         El("div", "search-popup")
    let input =         El("input", "search-popup-input", [["type", "text"]])
    let itemContainer = El("div", "search-popup-item-list")

    const createItemElement = (prop) => {
      let row = El("div", "search-popup-row")
          row.dataset.datatype = "item"
      let name = El("div", "search-popup-name", undefined, prop)
      let img = new Image()
          img.src = `assets/${data.item[prop].folder ?? "item"}/${prop}.png`

      row.append(img, name)
      row.dataset.item = prop
      itemContainer.append(row)
    }
    /* generate elements for all items */
    for(let prop in data.item)
      createItemElement(prop)

    popup.append(input, itemContainer)
    popup.style.left = (mouse.clientPosition.x + 5) + "px"
    popup.style.top = (mouse.clientPosition.y + 5) + "px"
    this.element.append(popup)
    this.itemSearch = popup
    setTimeout(() => this.fitInViewport(this.itemSearch), 0)
  }
  itemSearchDelete() {
    if(!this.itemSearch) return

    this.itemSearch.remove()
    this.itemSearch = null
    this.highlighted.style.outline = ""
    this.highlighted = null
    this.state.ifrevert("selectingItem")
  }
  createNode(type) {
    let node = new DialogueNode(
      type, 
      "Lorem Ipsum", 
      this.lastNpc, 
      mouse.clientPosition, 
      undefined, 
      undefined, 
    )
    return node
  }
  setActiveNode(event) {
    this.unsetActiveNode()
    let 
    target = event.target.closest(".dialogue-node")
    target.classList.add('active')

    this.activeNode = this.nodes.find(node => node.id === +target.dataset.id)
    this.nodes.forEach(node => node.element.classList.remove("highlighted"))
    this.activeNode.in.forEach (connection => connection.from.element.classList.add("highlighted"))
    this.activeNode.out.forEach(connection => connection.to.element.classList.add("highlighted"))
  }
  getNodeAtMousePosition(event) {
    let target = event.target.closest(".dialogue-node")
    if(target) 
      return this.nodes.find(node => node.id === +target.dataset.id)
    return null
  }
  selectNode(node) {
    if(this.selected.nodes.findChild(node)) return

    this.selected.nodes.push(node)
    node.element.classList.add("selected")
  }
  deselectAll() {
    this.selected.nodes.forEach(node => {
      node.element.classList.remove("selected")
    })
    this.selected.nodes = []
  }
  duplicateNode(node) {
    if(!node) return
    new DialogueNode(
      _.cloneDeep(node.type),
      _.cloneDeep(node.text),
      _.cloneDeep(node.speaker),
      node.pos.clone().add(new Vector(0, 25)),
      undefined,
      _.cloneDeep(node.facts),
      {labels: _.cloneDeep(node.labels)},
      _.cloneDeep(node.transfer)
    )
  }
  reconstructHTML() {
    /* generate svgs for connections */
    this.svgCont.innerHTML = ""
    this.nodes.forEach(node => {
      
      /* highlight entry and exit nodes for better visual navigation of the node tree */
      node.out.length === 0 ? node.element.classList.add("end-node")    : node.element.classList.remove("end-node")
      node.in.length === 0  ? node.element.classList.add("start-node")  : node.element.classList.remove("start-node")

      node.update()
      node.out.forEach(conn => {
        let svg = SVGEl(
          "svg", 
          "dialogue-node-connection", 
          [
            ["viewBox", "0 0 " + cw + " " + ch],
            ["preserveAspectRatio", "xMinYMax"],
            ["width", cw],
            ["height", ch], 
            ["fill", "none"]
          ]
        )
        let path = SVGEl(
          "path", 
          undefined, 
          [
            ["d", "M 0 0 L 250 250"],
            ["stroke", "green"], 
            ["stroke-width", this.style.connectionWidth]
          ]
        )
        let rects = [
          node.element.querySelector(`.dialogue-node-socket.out[data-index='${conn.index}'`).getBoundingClientRect(),
          conn.to.element.querySelector(".dialogue-node-socket.in").getBoundingClientRect()
        ]
        path.setAttribute("d", 
          "M " + (rects[0].x + 6) + " " + (rects[0].y + 6) + 
          "L " + (rects[1].x + 6) + " " + (rects[1].y + 6)
        )
        svg.append(path)
        svg.dataset.id = node.id
        svg.dataset.index = conn.index
        this.svgCont.append(svg)
      })
    })
    this.updateHTML()
  }
  updateHTML() {
    /* store information about the position of node sockets */
    let layoutData = []

    /* update nodes */
    this.nodes.forEach(node => node.update())
      
    /* get layout information */
    this.nodes.forEach((node, index) => {
      node.out.forEach(conn => {
        let rects = [
          node.element.querySelector(`.dialogue-node-socket.out[data-index='${conn.index}'`).getBoundingClientRect(),
          conn.to.element.querySelector(".dialogue-node-socket.in").getBoundingClientRect()
        ]
        let path = this.svgCont.querySelector("svg[data-id='" + node.id + "']" + "[data-index='" + conn.index + "']" + " path")
        layoutData.push({path, rects})
      })
    })

    /* recalculate the SVG paths */
    this.nodes.forEach((node, index) => {
      node.out.forEach(conn => {
        layoutData[index].path.setAttribute("d",
          "M " + (layoutData[index].rects[0].x + 6) + " " + (layoutData[index].rects[0].y + 6) + 
          "L " + (layoutData[index].rects[1].x + 6) + " " + (layoutData[index].rects[1].y + 6)
        )
      })
    })
  }
  reset() {
    this.nodes.forEach(node => node.destroy())
    this.nodes = []
    this.activeNode = null
    this.editedData = {}
    this.updateHTML()
  }
  update() {

  }
  //#region debugging methods
  checkForDuplicateIds() {
    let ids = []
    this.nodes.forEach(node => {
      if(ids.find(id => id === node.id))
        ids.push(node.id)
    })
    if(ids.length) 
      console.log('found duplicates', ids)
  }
  //#endregion
}
class FactEditor {
  constructor(gameWindow, viewportSide) {
    this.gameWindow = gameWindow
    this.open = true
    this.elements = {
      
    }
    this.activeElements = {
      criterion: null
    }
    this.activeObjects = {
      criterion: null
    }
    this.createHtml(viewportSide)
  }
  show() {
    this.open = true
    this.elements.container.classList.remove("hidden")
    this.updateIconsForNodes()
  }
  hide() {
    this.open = false
    this.elements.container.classList.add('hidden')
    this.updateIconsForNodes()
  }
  toggle() {
    if(!this.open) 
      this.show()
    else 
      this.hide()
  }
  updateIconsForNodes() {
    Qa(".dialogue-node-widget.list").forEach(icon => {
      if(this.open)
        icon.classList.add("active")
      else 
        icon.classList.remove('active')
    })
  }
  //#region HTML layer
  createHtml(viewportSide) {
    let element =             El("div", "fact-editor " + viewportSide)
    let header =              El("div", "fact-container-header", undefined, "Fact editor")
    let buttonClose =         El("div", "dialogue-node-widget remove")
    let btnAddFact =          El("div", "fact-add-button", [["title", "Add new fact"]])
    let factInputWrapper =    El("div", "fact-input-wrapper")
    let factInput =           El("div", "fact-input", [["type", "text"]])
    let searchbar =           El("div", "fact-search-bar")
    let searchIcon =          El("div", "fact-search-icon")

    let criteriaContainer =   El("div", "fact-editor-criteria-container")
    let criteriaHeader =      El("div", "fact-editor-criteria-header", undefined, "Node criteria")
    let addCriterionButton =  El("div", "fact-editor-add-criterion-button ui-graphic")

    criteriaContainer.append(criteriaHeader, addCriterionButton)
    header.append(buttonClose)
    element.append(header, criteriaContainer)

    addCriterionButton.onclick = () => this.createCriterion()

    this.elements.container =         element
    this.elements.criteriaContainer = criteriaContainer
    this.elements.criteriaHeader =    criteriaHeader
    this.gameWindow.element.append(this.elements.container)
  }
  createCriterionHTML(criterion) {
    let container = El("div", "criterion-container")
    let addRequirementButton = El("div", "fact-editor-add-requirement-button ui-graphic")
    let deleteCriterionButton = El("div", "fact-editor-delete-criterion-button ui-graphic")
    let buttons = El("div", "criterion-buttons")

    container.onclick =             () => this.setActiveCriterion(criterion)
    addRequirementButton.onclick =  () => this.addRequirementToCriterion(criterion)

    buttons.append(addRequirementButton, deleteCriterionButton)
    container.append(buttons)
    container.dataset.criterionindex = criterion.index
    this.activeElements.criterion = container
    this.elements.criteriaContainer.append(container)

    criterion.element = container
  }
  createRequirementHTML(criterion, requirement, requirementIndex) {
    let row = El("div", "criterion-requirement " + requirement.type)
    let toggle = El("div", "criterion-requirement-toggle", [["title", "Flip type"]], requirement.type.capitalize())
    let deleteButton = El("div", "criterion-requirement-delete-button ui-graphic")
    let body = El("div", "criterion-requirement-body")
    let filler = El("div", "filler")
    
    let optionalElements = []
    console.log(requirement)
    switch(requirement.type) {
      case "condition": {
        optionalElements = [
          El("div", `requirement-property editable${requirement.entryObject ? "" : " unset"}`,          [["data-editable", "true"], ["data-datatype", "entry"]],              requirement.entryObject || "Entry object"),
          El("div", `requirement-property editable${requirement.accessorChain.length ? "" : " unset"}`, [["data-editable", "true"], ["data-datatype", "accessorChain"]],      requirement.accessorChain.join(",") || "accessorChain"),
          El("div", `requirement-property editable${requirement.condition.type ? "" : " unset"}`,       [["data-editable", "true"], ["data-datatype", "conditionType"]],      requirement.condition.type || "Exists"),
          El("div", `requirement-property editable${requirement.condition.testValue ? "" : " unset"}`,  [["data-editable", "true"], ["data-datatype", "conditionTestValue"]], requirement.condition.testValue || "Test value"),
        ]
        break
      }
      case "fact": {
        optionalElements = [
          El("div", `requirement-property editable${requirement.identifier ? "" : " unset"}`,           [["data-editable", "true"], ["data-datatype", "identifier"]], requirement.identifier || "fact_identifier"),
          El("div", `requirement-property boolean editable ${boolToString(requirement.expectedValue)}`, [["data-editable", "true"], ["data-datatype", "expectedvalue"], ["data-isboolean", "true"]], boolToString(requirement.expectedValue)),
        ]
        break
      }
    }
    toggle.dataset.requirementtype = requirement.type
    body.append(...optionalElements)
    row.append(toggle, body, filler, deleteButton)

    row.dataset.requirementindex = +requirementIndex

    this.activeElements.criterion.append(row)
  }
  clearHTML() {
    Array.from(this.elements.container.querySelectorAll(".criterion-container"))
    .forEach(element => element.remove())
  }
  refreshStructure() {
    this.gameWindow.activeNode.criteria.forEach((criterion, index) => criterion.index = index)

    this.clearHTML()
    this.refreshHTML()
  }
  refreshHTML() {
    this.gameWindow.activeNode.criteria.forEach(criterion => {
      this.createCriterionHTML(criterion)
      for(let [index, requirement] of criterion.requirements.entries()) {
        this.createRequirementHTML(criterion, requirement, index)
      }
    })
    this.elements.criteriaHeader.innerText = `Node criteria [ ${this.gameWindow.activeNode.criteria.length} ]`
  }
  //#endregion HTML layer
  //#region data manipulation
  addRequirementToCriterion(criterion) {
    criterion.addRequirement(Requirement.empty("condition"))
    this.refreshStructure()
  }
  deleteRequirementFromCriterion(criterionIndex, requirementIndex) {
    this.gameWindow.activeNode.criteria[criterionIndex].requirements.removeAt(requirementIndex)
    this.refreshStructure()
  }
  createCriterion() {
    let 
    criterion = new Criterion()
    criterion.index = this.gameWindow.activeNode.criteria.length
    this.gameWindow.activeNode.criteria.push(criterion)
    this.refreshStructure()
  }
  toggleRequirementType(criterionIndex, requirementIndex) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.flipType()
    this.refreshStructure()
  }
  flipRequirementExpectedValue(criterionIndex, requirementIndex) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.expectedValue = !requirement.expectedValue
    this.refreshStructure()
  }
  setRequirementIdentifier(criterionIndex, requirementIndex, value) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.identifier = value
    this.refreshStructure()
  }
  setRequirementEntryObject(criterionIndex, requirementIndex, value) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.entryObject = value
    this.refreshStructure()
  }
  setRequirementAccessorChain(criterionIndex, requirementIndex, value) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.accessorChain = value.replaceAll(" ", "").split(",")
    this.refreshStructure()
  }
  setConditionType(criterionIndex, requirementIndex, value) {
    if(!Requirement.conditionTypes.findChild(value)) return console.error("invalid condition type")

    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    requirement.condition.type = value
    this.refreshStructure()
  }
  setConditionTestValue(criterionIndex, requirementIndex, value) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    isNaN(+value) ? 
    requirement.condition.testValue = value :
    requirement.condition.testValue = +value
    this.refreshStructure()
  }
  cycleConditionType(criterionIndex, requirementIndex) {
    let 
    requirement = this.gameWindow.activeNode.criteria[criterionIndex].requirements[requirementIndex]
    let index = Requirement.conditionTypes.indexOf(requirement.conditionType)
    requirement.condition.type = Requirement.conditionTypes[++index] ?? Requirement.conditionTypes[0]
    this.refreshStructure()
  }
  setActiveCriterion(criterion) {
    Qa(".criterion-container").forEach(element => element.classList.remove("active"))
    this.activeObjects.criterion = criterion
    this.activeElements.criterion = criterion.element
    this.activeElements.criterion.classList.add("active")
  }
  deleteCriterion(criterionIndex) {
    this.gameWindow.activeNode.criteria.removeAt(criterionIndex)
    this.refreshStructure()
  }
  //#endregion data manipulation
  toggleEditability() {
    if(this.gameWindow.activeNode) {
      this.elements.container.classList.remove("disabled")
    }
    else {
      this.elements.container.classList.add("disabled")
      this.clearHTML()
    }
  }
}
class Fact {
  constructor(id, identifier, value) {
    this.id = id ?? Fact.index.length
    this.identifier = identifier
    this.value = value ?? false
  }
  static createSetterFact(...args) {
    return new Fact(...args)
  }
  static loadFacts() {
    readJSONFile("data/facts/facts.json", function(text) {
      let facts = JSON.parse(text)
      facts.forEach(fact => {
        Fact.create(fact.id, fact.identifier, fact.value)
      })
    })
  }
  static exportFacts() {
    let exportData = []
    for(let key in this.index) {
      let fact = this.index[key]
      exportData.push({id: fact.id, identifier: fact.identifier, value: fact.value})
    }
    exportToJSONFile(exportData, "facts")
  }
  static create(...args) {
    let fact = new Fact(...args)

    if(this.index[fact.identifier] === undefined)
      this.index[fact.identifier] = fact
    else
      this.setFact(args[1], args[2])
  }
  static setFact(identifier, value) {
    if(this.index[identifier] === undefined)
      this.create(undefined, identifier, value)
    else
      this.index[identifier].value = value
  }
  static testForCondition(entryObject = "player", accessorChain = ["ship", "hull", "current"], condition) {
    let currentLevel = eval(entryObject)
    while
    (
      accessorChain.length && 
      currentLevel[accessorChain[0]] !== null && 
      currentLevel[accessorChain[0]] !== undefined
    )
    currentLevel = currentLevel[accessorChain.shift()]

    switch(condition.type) {
      case "exists": {
        return !!currentLevel
      }
      case "greater": {
        return currentLevel > condition.testValue
      }
      case "smaller": {
        return currentLevel < condition.testValue
      }
      case "equals": {
        return currentLevel == condition.testValue
      }
    }
    return false
  }
  static testForFact(identifier) {
    return this.index[identifier]?.value === true
  }
  static index = {} //index of Fact instances
}
class Criterion {
  constructor() {
    this.requirements = []
    this.element = null
  }
  addRequirement(requirement) {
    this.requirements.push(requirement)
    return requirement
  }
  removeRequirement(requirement) {
    this.requirements.remove(requirement)
    return requirement
  }
  get plain() {
    return {
      requirements: [...this.requirements]
    }
  }
  validate() {
    for(let req of this.requirements) {
      
    }
    return true
  }
}
class Requirement {
  constructor(type, data = {}) {
    this.initialize(type, data)
  }
  initialize(type, data) {
    this.type = type
    if(!Requirement.types[type])
      return console.error("Invalid requirement type: ", type)
    for(let key in data) {
      if(Requirement.propertiesPerType[this.type].findChild(key))
        this[key] = data[key]
    }
  }
  flipType() {
    let type = this.type === "condition" ? "fact" : "condition"
    this.initialize(type, Requirement.defaultData())
  }
  static empty(type) {
    return new Requirement(
      type,
      Requirement.defaultData()
    )
  }
  static defaultData() {
    return {
      entryObject: "emptyObject", 
      accessorChain: [""], 
      condition: {type: "exists"},
      identifier: "",
      expectedValue: true,
    }
  }
  static types = {
    condition: true,
    fact: true,
  }
  static propertiesPerType = {
    condition:  ["entryObject", "accessorChain", "condition"],
    fact:       ["identifier", "expectedValue"],
  }
  static conditionTypes = ["exists", "greater", "smaller", "equals"]
}
class Person extends GameObject {
  constructor(name) {
    super()
    let objectData = data.person[name]
    this.name = objectData.name
    this.type = "person"
    this.displayName = objectData.displayName
    this.currency = 0
    this.inventory = new Inventory()
    this.setJobTitle(objectData.jobTitle)
  }
  setJobTitle(jobTitle) {
    this.jobTitle = data.jobTitle[jobTitle] ?? console.error("invalid job title: ", jobTitle)
  }
  update() {
    throw "person cannot be instantiated, it either has to be NPC or Player"
  }
}
class NPC extends Person {
  constructor(name) {
    super(name)
    this.type = "npc"
    this.name = name
    this.ship = null
    this.target = null
    this.followDistance = 1400
    this.stopDistance = 650
    this.brakeDistance = 450
    this.timers = new Timer()
    this.setupStateMachine()
    this.setupNavMesh()
  }
  setupStateMachine() {
    this.stateMachine = new StateMachine(this)
    for(let key in NPC.states) {
      let stateRef = key
      let state = new StateObject(stateRef)
      state.assignMethods(NPC.states[stateRef].methods.map(method => NPC[method].bind(state)))
      state.timers = NPC.states[stateRef].setupTimers(state)
      this.stateMachine.addState(state)
    }
  }
  setupNavMesh() {
    this.navMesh = {
      boundingBoxes: [],
      nearest: null,
      indexOfTargetBox: 0
    }
  }
  assignShip(ship) {
    this.ship = ship
    this.ship.npcs.push(this)
  }
  update() {
    this.stateMachine.update()
    this.ship ? this.transform.position.setFrom(this.ship.transform.position) : null
    NPC.drawNavMesh(this)
  }
  destroy() {
    this.stateMachine.destroy()
  }
  static states = {
    avoidCollision: {
      methods: [
        "setTarget",
        "rotateToNearestPoint",
      ],
      setupTimers(state) {
        return new Timer(
          ["createNavmesh", 400, {loop: true, active: true, onfinish: NPC.createNavmesh.bind(state)}],
        )
      }
    },
    attackEnemy: {
      methods: [
        "setTarget",
        "rotateToTargetIfNotObstructed",
        "rotateToNearestPoint",
        "followTarget",
      ],
      setupTimers(state) {
        return new Timer(
          ["createNavmesh", 400,  {loop: true, active: true, onfinish: NPC.createNavmesh.bind(state)}],
          ["fireWeapon",    800,  {loop: true, active: true, onfinish: NPC.fireWeapon.bind(state)}],
          ["skip",          8000, {loop: true, active: true, onfinish: NPC.useSkip.bind(state)}],
        )
      }
    },
    flee: {
      methods: [
        "rotateToNearestPoint",
        "avoidTarget",
      ],
      setupTimers(state) {
        return new Timer(
          ["createNavmesh", 400, {loop: true, active: true, onfinish: NPC.createNavmesh.bind(state)}],
        )
      }
    },
  }
  //#region state methods (inside these methods this === the StateObject)
  static createNavmesh() {
    if(this.timers.createNavmesh.finished)
      this.timers.createNavmesh.start()
    let shipBoundingBox = this.gameObject.ship.hitbox?.boundingBox
    if(!shipBoundingBox) return

    this.gameObject.navMesh.boundingBoxes.empty()

    let objects = Collision.broadphase(game, this.gameObject.ship, {exclude: [Interactable], grid: navMeshGrid})
    let navmeshFirstPhase = []
    //1st phase - create 4 bounding boxes around each object
    for(let obj of objects) {
      let offsetFromObject = Math.max(shipBoundingBox.w + obj.hitbox.boundingBox.w, shipBoundingBox.h + obj.hitbox.boundingBox.h)
      let offsetVector = new Vector(offsetFromObject, 0)
      for(let i = 0; i < 4; i++) {
        //create a navmesh point with absolute position in the world
        let worldPosition = offsetVector.clone().add(obj.transform.position)
        let newBoundingBox = new BoundingBox(worldPosition.x - shipBoundingBox.w/2, worldPosition.y - shipBoundingBox.h/2, shipBoundingBox.w, shipBoundingBox.h)
        navmeshFirstPhase.push(newBoundingBox)
        offsetVector.rotate(halfPI)
      }
    }
    //2nd phase - ruling out colliding bounding boxes
    for(let boundingBox of navmeshFirstPhase) {
      let objects = Collision.broadphaseForVector(game, new Vector(boundingBox.x, boundingBox.y), {exclude: [Interactable], grid: grid} )
      let isColliding = false
      for(let obj of objects) {
        if(Collision.auto(boundingBox, obj.hitbox)) 
          isColliding = true
      }
      if(!isColliding)
        this.gameObject.navMesh.boundingBoxes.push(boundingBox)
    }
    //player line of sight check
    {
      let line = new Line(this.gameObject.ship.transform.position.clone(), player.ship.transform.position.clone())
      let objects = game.gameObjects.gameObject.filter(obj => 
        obj.hitbox && 
        obj.rigidbody && 
        obj !== player.ship && 
        obj !== this.gameObject.ship && 
        GameObject.distanceFast(obj, this.gameObject.ship) < data.npcLineOfSightDistance
      )

      this.hasAngleToTarget = true
      for(let obj of objects) {
        if(Collision.auto(line, obj.hitbox)) {
          this.hasAngleToTarget = false
          return
        }
      }
    }
  }
  static rotateToNearestPoint() {
    if(this.hasAngleToTarget) return
    if(!this.gameObject.ship.hitbox) return
    if(!this.gameObject.target) return
    if(!this.gameObject.navMesh.nearest) return

    let distances = this.gameObject.navMesh.boundingBoxes.map((b, index) => [b.position.distance(this.gameObject.ship.transform.position), index])
    let indexOfNearest = distances.indexOf(
      distances.find(dist => dist[0] === Math.min(...distances.map(d => d[0])))
    )
    this.gameObject.navMesh.nearest = this.gameObject.navMesh.boundingBoxes[indexOfNearest]
    let positionOfNearest = this.gameObject.navMesh.nearest.position

    let angleToPlayer = GameObject.angle(this.gameObject.ship, this.gameObject.target)

    //angles to all the viable boundingBoxes that the ship can navigate to
    let angles = this.gameObject.navMesh.boundingBoxes.map((b, i) => 
      [
        this.gameObject.transform.position.angleTo(b.position), 
        i
      ]
    )
    
    let subtractedAngles = angles.map(a => Math.abs(a[0] - angleToPlayer))
    let sortedSubtractedAngles = subtractedAngles.sort((a, b) => a - b)
    let indexOfClosestAngleToPlayerAngle = subtractedAngles.indexOf(subtractedAngles.find(a => a === Math.min(...subtractedAngles)))
    let closestAngle = angles[indexOfClosestAngleToPlayerAngle][0]
    // console.log(closestAngle)

    //this block tries to get the boundingbox which is with its angle to the npc's ship closest to the angle the npc's ship has to the player
    {
      return
      let nearestPositionBetweenPlayerAndShip = this.gameObject.navMesh.boundingBoxes[indexOfClosestAngleToPlayerAngle].position
      this.gameObject.navMesh.indexOfTargetBox = indexOfClosestAngleToPlayerAngle

      //if the point is too far away, pick a different one from all available positions, if it doesn't work, just get the first one
      let foundSuitablePosition = false
      for(let i = 0; i < angles.length; i++) {
        if(nearestPositionBetweenPlayerAndShip.distance(this.gameObject.target < 1000)) {
          foundSuitablePosition = true
          break
        }
        this.gameObject.navMesh.indexOfTargetBox = i
        nearestPositionBetweenPlayerAndShip = this.gameObject.navMesh.boundingBoxes[i].position
      }

      if(!foundSuitablePosition)
        nearestPositionBetweenPlayerAndShip = this.gameObject.navMesh.boundingBoxes[indexOfClosestAngleToPlayerAngle].position

      if(this.gameObject.ship.transform.position.isObjectRotationGreaterThanAngleToVector(nearestPositionBetweenPlayerAndShip, this.gameObject.ship.transform.rotation)) {
        this.gameObject.ship.rotate(-1)
        // console.log("rotating CCW")
      }      
      else {
        this.gameObject.ship.rotate(1)
        // console.log("rotating CW")
      }   
    }
    {
      let closestBoxPosition = this.gameObject.target.transform.position.closest(...this.gameObject.navMesh.boundingBoxes.map(b => b.position))
      let indexOfBox = this.gameObject.navMesh.boundingBoxes.indexOf(this.gameObject.navMesh.boundingBoxes.find(box => box.position.is(closestBoxPosition)))
      this.gameObject.navMesh.indexOfTargetBox = indexOfBox
      if(this.gameObject.ship.transform.position.isObjectRotationGreaterThanAngleToVector(closestBoxPosition, this.gameObject.ship.transform.rotation)) {
        this.gameObject.ship.rotate(-1)
        console.log("rotating CCW")
      }      
      else {
        this.gameObject.ship.rotate(1)
        console.log("rotating CW")
      }   
    }
  }
  static rotateToTargetIfNotObstructed() {
    if(!this.gameObject.ship) return
    if(!this.gameObject.target) return
    if(!this.hasAngleToTarget) return
    let [angle, rotation] = this.gameObject.ship.transform.position.wrapAngleAndRotation(this.gameObject.target.transform.position, this.gameObject.ship.transform.rotation)
    if(Math.abs(rotation - angle) < PI_32) return
    
    if(this.gameObject.ship.transform.position.isObjectRotationGreaterThanAngleToVector(this.gameObject.target.transform.position, this.gameObject.ship.transform.rotation))
      this.gameObject.ship.rotate(-1)
    else
      this.gameObject.ship.rotate(1)
  }
  static checkForCollision() {
    if(!this.gameObject.ship) return
    this.collisionEvents = []
    let objects = Collision.broadphase(game, this.gameObject.ship, {exclude: [Interactable]})
    objects.forEach(obj => {
      for(let [iteration, projection] of obj.hitbox.projections.entries()) {
        if(Collision.auto(projection, this.gameObject.ship.hitbox))
          this.collisionEvents.push(new CollisionEvent(this.gameObject.ship, obj, {iteration}))
      }
    })
  }
  static updateNavMesh() {
    if(this.navMeshGenerated && this.gameObject.navMesh.points.length > 4) return
    if(!this.gameObject.ship.hitbox) return
  }
  static avoidObstacle() {
    //this function only works by predicting where the craft would go, but there should be another one, predicting with an imagined, higher velocity
    if(this.collisionEvents.length == 0) return
    
    let collisionEvents = []
    let allProjections = []
    let angleOffsetStep = PI/6
    let iteration = 1
    do {
      let multiplier = Math.ceil((iteration * (1 - (iteration % 2)*2)) / 2) //this should cause that an alternation in the offset
      let newProjections = this.gameObject.ship.hitbox.projectPositionInDifferentAngle(angleOffsetStep * multiplier)
      allProjections.push(...newProjections)
      collisionEvents = NPC.checkForCollisionInSetOfProjections(this, newProjections)
      if(collisionEvents.length === 0) break
      iteration++
    }
    while(angleOffsetStep * iteration < TAU)
    
    if(collisionEvents.length > 0 ) {
      //try to pathfind if the velocity was something more normal, to avoid the constant collision when the craft isn't moving
      iteration = 1
      let newVelocity = this.gameObject.transform.velocity.clone().normalize(250)
      do {
        let multiplier = Math.ceil((iteration * (1 - (iteration % 2)*2)) / 2) //this should cause that an alternation in the offset
        let newProjections = this.gameObject.ship.hitbox.projectPositionInDifferentAngle(angleOffsetStep * multiplier, newVelocity)
        allProjections.push(...newProjections)
        collisionEvents = NPC.checkForCollisionInSetOfProjections(this, newProjections)
        if(collisionEvents.length === 0) break
        iteration++
      }
      while(angleOffsetStep * iteration < TAU)
      
      if(collisionEvents.length > 0 ) {
        this.gameObject.desiredAngle = GameObject.angle(this.gameObject.ship, this.gameObject.target)
      }
      else {
        this.gameObject.desiredAngle = this.gameObject.ship.transform.rotation + (angleOffsetStep * iteration)
      }
    }
    else {
      this.gameObject.desiredAngle = this.gameObject.ship.transform.rotation + (angleOffsetStep * iteration)
    }

    allProjections.forEach(projection => {
      let color = projection === allProjections.last() ? 0xff0000 : 0x1111dd
      game.graphics.lineStyle(2, color, 1)
      game.graphics.drawCircle(projection.x, projection.y, 4)
      game.graphics.closePath()
    })
  }
  static avoidTarget() {

  }
  static rotateTowardsDesiredAngle() {
    if(this.collisionEvents.length == 0) return

    let margin = 0.2
    if(this.gameObject.desiredAngle > this.gameObject.ship.transform.rotation + margin) 
      this.gameObject.ship.rotate(1)
    else
    if(this.gameObject.desiredAngle < this.gameObject.ship.transform.rotation - margin)
      this.gameObject.ship.rotate(-1) 
  }
  static setTarget() {
    if(!player || !player.ship || !this.gameObject.ship) 
      this.gameObject.target = null
    else
    if(player.ship && player.ship.vwb) {
      this.gameObject.target = null
    }
    else
    if(GameObject.distance(this.gameObject.ship, player.ship) < this.gameObject.followDistance) {
      this.gameObject.target = player.ship
      this.gameObject.ship.targetPosition = this.gameObject.target.transform.position.clone()
    }      
  }
  static followTarget() {
    if(!this.gameObject.target) return

    let distance = GameObject.distance(this.gameObject.ship, this.gameObject.target)
    if(distance > this.gameObject.followDistance) return

    if( distance > this.gameObject.stopDistance && 
        this.gameObject.ship.transform.velocity.length() < this.gameObject.ship.engine.maxSpeed / 2
    ) {
      this.gameObject.ship.accelerate()
    }
    else
    if(distance > this.gameObject.brakeDistance) {
      //do nothing
    }
    else {
      this.gameObject.ship.decelerate()
    }
  }
  static fireWeapon() {
    if(!this.gameObject.ship.weapons) return
    
    let weaponSystem = this.gameObject.ship.weapons
    if(!weaponSystem.activeWeapon.ready) 
      weaponSystem.cycleActiveWeapon()
    
    if(weaponSystem.activeWeapon.ready) {
      let event = {type: weaponSystem.activeWeapon.fireMethod}
      weaponSystem.activeWeapon.handleInput.bind(weaponSystem.activeWeapon, event)()
    }
    else 
    if(weaponSystem.weapons.find(w => w.chargeMethod !== "auto")) {
      weaponSystem.setActiveWeapon(
        weaponSystem.weapons.find(w => w.chargeMethod !== "auto")
      )
      if(weaponSystem.activeWeapon.charging) return
      
      let event = {type: weaponSystem.activeWeapon.chargeMethod}
      weaponSystem.activeWeapon.handleInput.bind(weaponSystem.activeWeapon, event)()
    }
  }
  static useSkip() {
    if(!this.gameObject.ship.skip.ready) return

    let targetPos = this.gameObject.target.transform.position
    let destination = targetPos.clone()

    destination.x += 300
    destination.y += 300
    destination.rotateAround(targetPos, Random.rotation())

    this.gameObject.ship.skip.activate(destination)

    /* this kinda randomizes when the next skip occurs */
    this.timers.skip.duration = Random.int(5000, 18000)
    this.timers.skip.start()
  }
  //#endregion
  //#region helper methods
  static drawNavMesh(npcObject) {
    if(!visible.navMesh) return

    for(let [index, box] of npcObject.navMesh.boundingBoxes.entries()) {
      if(index === npcObject.navMesh.indexOfTargetBox) 
        game.graphics.lineStyle(npcObject.gameWorld.camera.currentZoom, 0xff0000, 1)
      else
        game.graphics.lineStyle(npcObject.gameWorld.camera.currentZoom, 0x1111dd, 1)

      game.graphics.drawRect(box.x, box.y, box.w, box.h)
      game.graphics.closePath()
      game.graphics.drawCircle(box.x, box.y, 7)
      game.graphics.closePath()
    }
  }
  static checkForCollisionInSetOfProjections(stateObject, projections) {
    let collisionEvents = []
    let objects = Collision.broadphase(game, stateObject.gameObject.ship, {exclude: [Interactable]})
    objects.forEach(obj => {
      for(let [iteration, projection] of projections.entries()) {
        if(Collision.auto(projection, obj.hitbox))
          collisionEvents.push(new CollisionEvent(stateObject.gameObject.ship, obj, {iteration}))
      }
    })
    return collisionEvents
  }
}
class Player extends Person {
  constructor(ship) {
    super("player")
    this.ship = ship
  }
  handleInput(event) {
    this["handle" + event.type.capitalize()](event)
  }
  handleMousedown(event) {
    if(event.target !== game.element) return

    if(event.button === 0) {
      if(keys.shift || keys.shiftRight) {
        this.ship.skip.activate(mouse.worldPosition)
      }
      else
      if(keys.ctrl || keys.ctrlRight) {
        this.ship.shields.activate()
      }
      else {
        
      }
    }
  }
  handleMousemove(event) {

  }
  handleMouseup(event) {

  }
  handleClick(event) {

  }
  handleKeydown(event) {
    /* ship controls */
    if(event.code === binds.boosters)         this.ship.boosters.activate()
    if(event.code === binds.toggleAutobrake)  this.ship.brakes.toggleAuto()
    if(event.code === binds.dockShip)         this.ship.toggleDockState()
    if(event.code === binds.activateStealth)  this.ship.stealth.toggle()
    if(event.code === binds.armWeapons)       this.ship.weapons.toggleArmWeapons()
    if(event.code === binds.beginCoating)     this.ship.coater.beginCoating()

    /* general game */
    if(event.code === binds.openStationMenu)  this.openStationIfAvailable()
    if(event.code === binds.scrapDebris)      this.scrapDebris()

    /* weapon selection */
    if(event.code === binds.selectWeapon0)     this.selectWeapon(0)
    if(event.code === binds.selectWeapon1)     this.selectWeapon(1)
    if(event.code === binds.selectWeapon2)     this.selectWeapon(2)
    if(event.code === binds.selectWeapon3)     this.selectWeapon(3)
  }
  handleKeyup(event) {
    if(event.code === binds.boosters)         this.ship.boosters.deactivate()
    if(event.code === binds.beginCoating)     this.ship.coater.cancelCoating()
  }
  handleWheel(event) {
    let direction = clamp(event.deltaY, -1, 1)
    this.ship.weapons.cycleActiveWeapon(direction)
  }
  handlePointermove(event) {
    
  }
  handlePointerdown(event) {
    
  }
  handlePointerup(event) {
    
  }
  controlShipContinuous() {
    if(gameManager.activeWindow !== game) return
    if(game.state.is("loadingLocation")) return
    this.ship.targetPosition = mouse.worldPosition.clone()
    
    if(keys.shift) 
      this.ship.drawGhost()
    else 
      this.ship.hideGhost()
    
    if(keys.accel) {
      this.ship.accelerate()
      this.ship.brakes.setTargetSpeed()
    }
    if(keys.decel)  {
      this.ship.decelerate()
      this.ship.brakes.setTargetSpeed()
    }
    
    //brakes are janky and the order of if-statements matters here
    if(keys.brake)
      this.ship.brakes.active = true
    else
    if(!(keys.accel || keys.decel) && this.ship.brakes.auto)  
      this.ship.brakes.active = true
    else
      this.ship.brakes.active = false

    if(keys.rotateCCW || keys.rotateCW)  
      this.ship.steering = true
    if(!keys.rotateCCW && !keys.rotateCW)  
      this.ship.steering = false

    if(keys.rotateCW && !keys.rotateCCW)
      this.ship.rotate(1)
    if(keys.rotateCCW && !keys.rotateCC)
      this.ship.rotate(-1)
  }
  selectWeapon(index) {
    if(this.ship?.weapons?.weapons[index])
      this.ship.weapons.setActiveWeapon(this.ship.weapons.weapons[index])
  }
  openStationIfAvailable() {
    if(this.ship.state.is("docked")) {
      gameManager.setWindow(inventory)
      inventory.viewInventoryTab("station")
    }
  }
  scrapDebris() {
    if(!this.targetDebris) return
    for(let i = 0; i < 3; i++) {
      GameObject.create(
        "particle", 
        "debris", 
        {
          transform: new Transform(
            this.targetDebris.transform.position.clone().add(new Vector(...Random.intArray(-12, 12, 2))),
            new Vector(...Random.intArray(-12, 12, 2)),
            Random.rotation(),
            Random.float(-PI/4, PI/4)
          )
        },
        {
          world: this.targetDebris.gameWorld
        }
      )
    }
    
    let debrisCount = Random.int(
      this.targetDebris.debrisYield.min,
      this.targetDebris.debrisYield.max
    )
    for(let i = 0; i < debrisCount; i++)
      this.ship.cargo.addItems(new Item("debris"))
    GameObject.destroy(this.targetDebris)
  }
  createDebrisHighlight() {
    let targets = Collision.broadphase(this.ship.gameWorld, this.ship, {solo: [Debris, Fragment]})
    if(!targets.length) {
      this.destroyDebrisHighlight()
      return
    }
    let mouseCollidesWithDebris = false
    for(let debris of targets) {
      if(!debris.scrappable) return
      if(!Collision.auto(mouse.worldPosition, debris.hitbox.boundingBox.expand(20))) continue
      
      mouseCollidesWithDebris = true
      if(this.targetDebris === debris) break

      this.targetDebrisOverlay = GameObject.create(
        "gameOverlay", 
        "scrapDebris", 
        {parent: debris}, 
        {world: this.ship.gameWorld}
      )
      this.targetDebris = debris
      break
    }
    if(!mouseCollidesWithDebris)
      this.destroyDebrisHighlight()
  }
  destroyDebrisHighlight() {
    if(this.targetDebrisOverlay)
      GameObject.destroy(this.targetDebrisOverlay)
    for(let overlay of game.gameObjects.gameOverlay.filter(a => a.name === "scrapDebris")) {
      GameObject.destroy(overlay)
    }
    this.targetDebris = null
    this.targetDebrisOverlay = null
  }
  update() {
    if(gameManager.activeWindow !== game) return
    if(game.state.is("loadingLocation")) return
    this.controlShipContinuous()
    this.createDebrisHighlight()
    Q("#ship-reactor-view").innerText = this.ship.reactor.powerFree + "/" + this.ship.reactor.power
    Q("#currency-view").innerText     = this.currency
    this.transform.position.setFrom(this.ship.transform.position)
  }
}

class Quest {
  static beginQuest(quest) {
    if(this.finished.findChild(quest)) return

    this.active.push(quest)
  }
  static endQuest(quest) {
    if(this.finished.findChild(quest)) return
    if(!this.active.findChild(quest)) return

    this.active.remove(quest)
    this.finished.push(quest)
  }
  static active = []
  static finished = []
}
class HitboxEditor extends GameWorldWindow {
  constructor() {
    super("HitboxEditor",  Q('#hitbox-editor'))
    this.canvas = this.app.view
    this.object = null
    this.selectedShapes = []
    this.selectedHitbox = null
    this.selectedVertices = []
    this.controlPoints = []
    this.controlPointRadius = 7
    this.weaponSlots = []
    this.dockingPoints = []
    this.selectedWreckIndex = 0
    this.state = new State(
      "default",
      "definingWeaponSlots",
      "definingDockingPoints",
      "panning",
    )
    this.editMode = new State(
      "hitbox",
      "wreck"
    )
    this.tools = [
      "select",
      "pen-tool",
      "add-shape",
      "add-point",
      "remove-shape",
      "center-shape",
      "object-center",
      "object-cycle-rotation",
      "define-weapon-slots",
      "define-docking-points",
      "select-object",
      "return-to-stage",
      "edit-wreck"
    ]
    this.tool = "add-shape"
    this.generateIcons()
    this.searchBar = {
      cont: Q('#hitbox-editor-search-bar'),
      input: Q('#hitbox-editor-search-input'),
      show: () => {
        this.searchBar.cont.classList.remove('hidden')
        this.deselectAllShapes()
      },
      toggle: () => {
        if(this.searchBar.cont.classList.contains('hidden'))
          this.searchBar.show()
        else
          this.searchBar.hide()
        this.deselectAllShapes()
      },
      hide: () => {
        this.searchBar.cont.classList.add('hidden')
        this.deselectAllShapes()
      },
    }
    this.wreckEditToolbar = Q("#hitbox-editor-edit-wreck-toolbar")
    this.shape = {
      vertices: [],
      color: 0x9900ff,
      reset() {
        this.vertices = []
      },
    }
    this.modifyCamera()
  }
  modifyCamera() {
    this.camera.zoomRange = [0.1, 25]
    this.camera.zoomStep = 0.9
    this.camera.zoom.duration = 10
  }
  generateIcons() {
    this.tools.forEach(t => {
      let cont = El('div', "tool-cont")
      let icon = El('div', "tool-icon " + t)
      cont.append(icon)
      cont.onclick = () => this.setTool(t)
      cont.title = t.replaceAll('-', " ").capitalize()
      cont.dataset.toolname = t
      Q('#hitbox-editor-toolset').append(cont)
    })
  }
  exportHitbox() {
    let data = {}
    data.type = this.object.hitbox.type
    data.color = this.object.hitbox.color
    data.bodies = this.object.hitbox.definition
    exportToJSONFile(data)
  }
  exportWreckHitboxVault() {
    let vault = this.object.wreckHitboxVault.hitboxes.map(hitbox => {
      let h = {
        type: hitbox.type,
        color: hitbox.color,
        bodies: hitbox.definition
      }
      return h
    })
    exportToJSONFile(vault)
  }
  consoleLogWeaponSlots() {
    let string = `weaponSlots: [`
    this.weaponSlots.forEach(slot => {
      string += `{x:${slot.x},y:${slot.y}},`
    })
    string += `],`
    console.log(string)
  }
  consoleLogDockingPoints() {
    let string = `dockingPoints: [`
    this.dockingPoints.forEach(point => {
      string += `{x:${point.x},y:${point.y}},`
    })
    string += `],`
    console.log(string)
  }
  setTool(name) {
    let tool = this.tools.find(t => t === name)
    if(!tool) throw "tool with name: " + name + "doesn't exist"

    this.tool = tool
    Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
    this.element.querySelector('[data-toolname="' + tool + '"').classList.add('active')
  }
  select(object) {
    if(!object) return

    this.deselect()

    //this step is important for returning the object to where it was
    object.previousStage = object.stage
    this.placeObjectInLayer(object)
    this.object = object
    object.transform.reset()
    this.refreshEditWreckToolbar(this.object.wreckHitboxVault?.hitboxes.length)
    this.setTool("select")
  }
  deselect() {
    if(!this.object) return

    //this basically means if the object was created inside this editor, destroy it
    if(this.object.previousStage === this.object.stage)
      GameObject.destroy(this.object)
    else {
      GameObject.addToStage(this.object, this.object.previousStage)
    }
    delete this.object.previousStage
    this.object = null
    this.dockingPoints = []
    this.weaponSlots = []
  }
  createEditWreckToolbarToolIcon(index) {
    let icon = El("div", "toolbar-icon", [["title", "Edit wreck part " + index]])
        icon.dataset.wreckindex = index
    this.wreckEditToolbar.append(icon)
  }
  openEditWreckToolbar() {
    this.wreckEditToolbar.classList.remove("hidden")
  }
  closeEditWreckToolbar() {
    this.wreckEditToolbar.classList.add("hidden")
  }
  toggleEditWreckToolbar() {
    this.deselectAllShapes()
    this.wreckEditToolbar.classList.toggle("hidden")
    if(this.wreckEditToolbar.classList.contains("hidden"))
      setTimeout(() => this.setTool("select"), 100)
  }
  refreshEditWreckToolbar(wreckBodiesCount) {
    console.log(wreckBodiesCount)
    Array.from(this.wreckEditToolbar.querySelectorAll(".toolbar-icon")).forEach(icon => icon.remove())
    for(let i = 0; i < wreckBodiesCount; i++)
      this.createEditWreckToolbarToolIcon(i)
  }

  //#region input
  handleKeydown(event) {
    if(document.activeElement === this.searchBar.input) 
    {
      if(event.code === "Enter") {
        let [type, name] = this.searchBar.input.value.split(" ")
        if(!type || !name)
          return alert("missing name or type")
          
        let gameObject = GameObject.create(type, name, {}, {world: this})
        if(data[type][name].wreck?.hitboxVaultName) {
          gameObject.onWreckHitboxVaultLoad = () => {
            this.select(gameObject)
            this.searchBar.hide()
            this.setTool("select")
          }
        }
        else {
          this.select(gameObject)
          this.searchBar.hide()
          this.setTool("select")
        }
      }
    }
    else 
    { 
      if(event.code === "KeyX") {
        if(this.selectedVertices.length > 0) {
          this.selectedVertices.forEach(vert => {
            let body = this.getVertextFromBody(vert)
            this.selectedHitbox.removePoint(body, vert)
          })
          this.selectedVertices = []
          this.deselectAllShapes() 
          this.generateControlPoints()
        }
        else if(this.selectedShapes.length > 0) {
          this.selectedShapes.forEach(shape => {
            this.selectedHitbox.removeBody(shape)
          })
          this.selectedVertices = []
          this.deselectAllShapes()
          this.generateControlPoints()
        }
      }
      if(event.code === "KeyE") {
        this.exportHitbox()
      }
      if(event.code === "KeyR") {
        this.exportWreckHitboxVault()
      }
      if(event.code === "KeyV") {
        this.setTool("select")
      }
      if(event.code === "KeyD") {
        this.selectedShapes.forEach(shape => {
          let newShape = new Polygon(_.cloneDeep(shape.vertices))
          this.selectedHitbox.addBody(newShape)
        })
      }
      if(event.code === "KeyP") {
        this.setTool("pen-tool")
      }
      if(event.code === "KeyF") {
        if(this.searchBar.input === document.activeElement) {
          this.searchBar.toggle()
        }
        else {
          this.searchBar.show()
          setTimeout(()=> {this.searchBar.input.focus()},40)
        }
      }
      if(event.code === "Escape") {
        if(this.shape.vertices.length > 0) {
          this.deselectAllShapes()
          this.shape.reset()
        }
        if(this.state.is("definingWeaponSlots")) {
          this.setTool("select")
          this.state.set("default")
        }
        if(this.state.is("definingDockingPoints")) {
          this.setTool("select")
          this.state.set("default")
        }
      }
      if(event.code === "Enter") {
        if(this.shape.vertices.length >= 3) {
          let body = new Polygon(this.shape.vertices)
          this.selectedHitbox.addBody(body)
          this.shape.reset()
        }
        if(this.state.is("definingWeaponSlots")) {
          this.consoleLogWeaponSlots()
          this.setTool("select")
          this.state.set("default")
        }
        if(this.state.is("definingDockingPoints")) {
          this.consoleLogDockingPoints()
          this.setTool("select")
          this.state.set("default")
        }
      }
    }
  }
  handleKeyup(event) {

  }
  handleMousedown(event) {
    if(event.button === 0) {
      if(this.object && event.target === this.canvas) {
        this.selectedVertices = []
        if(debug.editor) 
          console.log('cleared selected vertices')
        let shape = this.getClickedShape()
        let handle = this.getClickedHandle()
        if(this.tool === "select") {
          if(handle) 
            this.selectVertex(this.getNearestVertexTo(handle))
          else 
          if(shape)
            this.selectShape(shape)
          else 
            this.deselectAllShapes()
        }
        if(this.state.is("definingWeaponSlots")) {
          let newslot = mouse.hitboxEditorPosition.clone()
          this.weaponSlots.push(newslot)
        }
        if(this.state.is("definingDockingPoints")) {
          this.defineDockingPoint()
        }
        if(this.tool === "add-point") {
          if(shape) 
            this.selectedHitbox.addVertex(shape)
        }
      }
    }
    if(event.button === 1) {
      this.state.set("panning")
    }
  }
  handleMousemove(event) {
    let target = event.target

    if(target === this.canvas) {
      if(this.tool === "select" && this.selectedVertices.length > 0 && mouse.keys.left) {
        this.moveVertices()
      }
      else
      if(this.tool === "select" && this.selectedShapes.length > 0 && mouse.keys.left) {
        this.moveShapes()
      }
    }
    if(this.state.is("panning")) {
      this.cameraAnchor.transform.position.sub(mouse.hitboxEditorMoved)
    }
  }
  handleMouseup(event) {
    if(this.state.is("panning"))
      this.state.revert()
  }
  handleClick(event) {
    let target = event.target
    if(target.closest(".tool-cont")) {
      let toolIcon = target.closest(".tool-cont")
      if(toolIcon.dataset.toolname === "select-object") {
        this.searchBar.toggle()
        this.searchBar.input.focus()
      }
      if(toolIcon.dataset.toolname === "object-center") {
        if(!this.object) return

        this.object.transform.rotation = 0
        this.object.transform.angularVelocity = 0
        this.object.wrapRotation()
        this.object.transform.position.set(0)
        this.object.transform.velocity.set(0)
        setTimeout(()=> {
          this.setTool("select")
        }, 100)
      }
      if(toolIcon.dataset.toolname === "object-cycle-rotation") {
        this.object.transform.rotation += 90 * PI/180
        this.object.wrapRotation()
        setTimeout(() => this.setTool("select"), 100)
      }
      if(toolIcon.dataset.toolname === "return-to-stage") {
        this.deselect()
      }
      if(toolIcon.dataset.toolname === "define-weapon-slots") {
        this.weaponSlots = []
        this.state.set("definingWeaponSlots")
        console.log('Define weapon slots by clicking. [ESCAPE] to cancel, [ENTER] to confirm')
      }
      if(toolIcon.dataset.toolname === "define-docking-points") {
        this.dockingPoints = []
        this.state.set("definingDockingPoints")
        console.log('Define docking points. [ESCAPE] to cancel, [ENTER] to confirm')
      }
      if(toolIcon.dataset.toolname === "edit-wreck") {
        this.toggleWreckEditMode()
      }
      return
    }
    else
    if(target.closest(".toolbar-icon")) {
      let toolbarIcon = target.closest(".toolbar-icon")
      if(toolbarIcon.dataset.wreckindex) {
        this.setSelectedWreck(+toolbarIcon.dataset.wreckindex)
      }
    }
    else
    if(target === this.canvas) {
      if(this.tool === "add-shape") {
        this.addShape()
      }
      if(this.tool === "remove-shape") {
        this.removeShape()
      }
      if(this.tool === "pen-tool") {
        this.addPointToActiveShape()
      }
    }
  }
  handleWheel(event) {
    if(event.deltaY < 0) {
      this.camera.zoomInit("in")
    }
    else
    if(event.deltaY > 0) {
      this.camera.zoomInit("out")
    }
  }
  //#endregion
  defineDockingPoint() {
    this.dockingPoints.push(mouse.hitboxEditorPosition.plain())
  }
  addShape(type = "rect") {
    if(!this.object) return
    let pos = new Vector(cw/2, ch/2)
    switch(type) {
      case "rect" : {
        let length = 100
        let verts = [
          {x: 0, y: 0},
          {x: length, y: 0},
          {x: length, y: length},
          {x: 0, y: length}
        ]
        let body = PolygonBuilder.Square(length, {x: mouse.clientPosition.x - cw/2, y: mouse.clientPosition.y - ch/2}, 90)
        this.object.addBody(body)
      }
    }
  }
  addPointToActiveShape() {
    console.log(this.shape)
    this.shape.vertices.push(new Vector(mouse.hitboxEditorPosition.x, mouse.hitboxEditorPosition.y))
  }
  getClickedShape() {
    if(this.editMode.is("hitbox")) return this.getClickedShapeForHitbox()
    if(this.editMode.is("wreck")) return this.getClickedShapeForWreck()
  }
  getClickedShapeForHitbox() {
    let matched = false
    let matchedShape;
    this.object.hitbox.bodies.forEach(body => {
      if(matched) return
      if(Collision.polygonVector(body, mouse.hitboxEditorPosition)) {
        matched = true
        matchedShape = body
      }
    })
    if(Collision.polygonVector(this.shape, mouse.hitboxEditorPosition)) {
      matched = true
      matchedShape = this.shape
    }
    this.selectedHitbox = this.object.hitbox
    console.log(this.selectedHitbox)
    return matchedShape
  }
  getClickedShapeForWreck() {
    let matched = false
    let matchedShape;
    this.object.wreckHitboxVault.hitboxes[this.selectedWreckIndex].bodies.forEach(body => {
      if(matched) return
      if(Collision.polygonVector(body, mouse.hitboxEditorPosition)) {
        matched = true
        matchedShape = body
      }
    })
    if(Collision.polygonVector(this.shape, mouse.hitboxEditorPosition)) {
      matched = true
      matchedShape = this.shape
    }
    this.selectedHitbox = this.object.wreckHitboxVault.hitboxes[this.selectedWreckIndex]
    console.log(this.selectedHitbox)
    return matchedShape
  }
  getClickedHandle() {
    let distances = []
    this.controlPoints.forEach(point => {
      let diff = point.clone().sub(mouse.hitboxEditorPosition)
      distances.push(Math.hypot(diff.x, diff.y))
    })
    let smallest = Math.min(...distances)
    let indexOfSmallest = distances.indexOf(smallest)
    if(smallest < this.controlPointRadius * this.camera.currentZoom) {
      return this.controlPoints[indexOfSmallest]
    }
    else return null
  }
  toggleWreckEditMode() {
    this.editMode.toggle()
    this.toggleEditWreckToolbar()

    if(this.editMode.is("wreck"))
      this.enterWreckEditMode()
    else 
      this.exitWreckEditMode()
  }
  enterWreckEditMode() {
    this.object.sprite.all.forEach(sprite => sprite.renderable = false)
    this.setSelectedWreck(0)
    this.object.sprite.container.addChild(...this.object.sprite.wreck)
  }
  exitWreckEditMode() {
    this.object.sprite.all.forEach(sprite => sprite.renderable = true)
    this.object.sprite.wreck.forEach(sprite => sprite.renderable = false)
  }
  setSelectedWreck(index) {
    if(!this.object) return
    this.deselectAllShapes()
    this.selectedWreckIndex = index
    this.object.sprite.wreck.forEach((sprite, i) => {
      if(i === index) {
        sprite.renderable = true
        sprite.alpha = 1.0
      }
      else {
        sprite.renderable = false
        sprite.alpha = 0.0
      }
    })
  }
  moveShapes() {
    if(!this.object) return
    
    this.selectedShapes.forEach(shape => {
      this.selectedHitbox.offsetBody(shape, mouse.hitboxEditorMoved)
    })
  }
  moveVertices() {
    this.selectedVertices.forEach(point => {
      let vert = this.getNearestVertexTo(point)
      let body = this.getVertextFromBody(vert)
      this.selectedHitbox.movePoint(body, vert, mouse.hitboxEditorMoved)
    })
  }
  deselectShape(shape) {
    this.selectedShapes.splice(this.selectedShapes.indexOf(shape), 1)
    shape.color = colors.hitbox.noCollision
  }
  deselectAllShapes() {
    this.selectedShapes.forEach(shape => {
      shape.color = colors.hitbox.noCollision
    })
    this.selectedShapes = []
    this.generateControlPoints()
  }
  selectShape(shape) {
    if(!shape) return
    if(this.selectedShapes.find(s => s === shape)) {
      if(!keys.shift) this.deselectAllShapes()
      this.deselectShape(shape)
    }
    else {
      if(!keys.shift) this.deselectAllShapes()
      this.selectedShapes.push(shape)
      shape.color = colors.hitbox.shapeSelected
    }
  }
  selectVertex(vertex) {
    if(this.selectedVertices.find(v => v === vertex)) {
      this.selectedVertices.splice(this.selectedVertices.indexOf(vertex), 1)
    }
    else {
      this.selectedVertices.push(vertex)
    }
  }
  generateControlPoints() {
    this.controlPoints = []
    this.selectedShapes.forEach(shape => {
      shape.vertices.forEach(vert => {
        this.controlPoints.push(new Vector(vert.x, vert.y))
      })
    })
  }
  getNearestVertexTo(position) {
    let distances = []
    let verts = []
    this.selectedHitbox.bodies.forEach(body => {
      body.vertices.forEach(vert => {
        let diff = new Vector(vert.x, vert.y).sub(position)
        distances.push(Math.hypot(diff.x, diff.y))
        verts.push(vert)
      })
    })
    let smallest = Math.min(...distances)
    let indexOfSmallest = distances.indexOf(smallest)
    return verts[indexOfSmallest]
  }
  getVertextFromBody(vert) {
    return this.selectedHitbox.bodies.find(body => body.vertices.find(v => v === vert))
  }
  removeShape() {
    let shape = this.getClickedShape()
    this.selectedHitbox.removeBody(shape)
    this.deselectAllShapes()
  }
  drawControlPoints() {
    this.controlPoints.forEach(point => {
      this.graphics.lineStyle(2, colors.hitbox.shapeSelected, 1)
      this.graphics.drawCircle(point.x, point.y, this.controlPointRadius * this.camera.currentZoom)
    })
  }
  drawWeaponSlots() {
    this.weaponSlots.forEach(slot => {
      this.graphics.lineStyle(2, colors.hitbox.weaponSlot, 1)
      this.graphics.drawCircle(slot.x, slot.y, 9)
      this.graphics.closePath()
    })
  }
  drawDockingPoints() {
    this.dockingPoints.forEach(point => {
      this.graphics.lineStyle(2, colors.hitbox.dockingPoint, 1)
      this.graphics.drawCircle(point.x, point.y, 9)
      this.graphics.closePath()
    })
  }
  drawObjectDockingPoints() {
    //these are already set on the object
    this.object.dockingPoints.forEach(point => {
      this.graphics.lineStyle(2, colors.hitbox.dockingPoint, 0.5)
      this.graphics.drawCircle(point.x, point.y, 9)
      this.graphics.closePath()
    })
  }
  drawUnfinishedShape() {
    Hitbox.drawPolygon(this.shape, this.graphics, this.camera.currentZoom)
  }
  drawSelectedWreck() {
    if(this.editMode.isnt("wreck")) return
    if(!this.object) return
    if(!this.object.wreckHitboxVault) return
      Hitbox.drawPolygonHitbox(this.object, this.object.wreckHitboxVault.hitboxes[this.selectedWreckIndex], this.graphics, this.camera.currentZoom)
  }
  update() {
    this.generateControlPoints()
    this.drawWeaponSlots() 
    this.drawDockingPoints() 
    this.drawControlPoints() 
    this.drawUnfinishedShape() 
    this.drawSelectedWreck()
    
    if(this.object)
      Hitbox.draw(this.object, this.graphics, this.camera.currentZoom)
    if(this.object?.dockingPoints)
      this.drawObjectDockingPoints()
  }
}
class LocationEditor extends GameWorldWindow {
  constructor() {
    super("LocationEditor", Q('#location-editor'))
    this.app.view.classList.add("location-editor-app")
    this.cameraAnchor = {transform: new Transform()}
    this.contextWindow = Q('#location-editor-context-window')
    this.contextWindowPropertiesContainer = this.contextWindow.querySelector(".object-properties")
    this.locationPosition = new Vector(0)
    this.state = new State(
      "default",
      "addingObj",
      "addingSpawn",
      "panning",
      "rotating",
      "draggingContextWindow",
      "paintingFog",
      "erasingFog",
      "circleSelecting",
    )
    this.tools = [
      "move",
      "circle-select",
      "select-object",
      "rotate",
      "edit-hitbox",
      "randomize-rotation",
      "fog-paint",
      "fog-eraser",
      "toggle-collision",
      "toggle-spray-mode",
      "use-multi-selection",
    ]
    this.unusedTools = [
      "addSpawn",
      "add-special",
      "moveSpawnsAlong",
    ]
    this.specialObjects = [
      "randomSpawner", 
      "locationRandomizer",
    ]
    this.selected = []
    this.dragged = null
    this.previousSelected = []
    this.isContextWindowOpen = true
    this.sprayMode = {
      active: false,
      spacing: 50,
      scatter: {
        x: 0,
        y: 0
      }
    }
    this.boxSelection = {
      active: false,
      startPoint: new Vector(),
      endPoint: new Vector(),
      begin() {
        this.reset()
        this.active = true
        this.startPoint.setFrom(mouse.locationEditorPosition)
        this.endPoint.setFrom(mouse.locationEditorPosition)
      },
      end() {
        this.active = false
        this.endPoint.setFrom(mouse.locationEditorPosition)
        this.selectObjects()
      },
      selectObjects: () => {
        let topLeftPoint =      this.boxSelection.startPoint.distance(this.boxSelection.endPoint) > 0 ? this.boxSelection.startPoint : this.boxSelection.endPoint
        let bottomRightPoint =  topLeftPoint === this.boxSelection.startPoint                         ? this.boxSelection.endPoint   : this.boxSelection.startPoint
        let box = new BoundingBox(
            topLeftPoint.x,
            topLeftPoint.y,
            bottomRightPoint.x - topLeftPoint.x,
            bottomRightPoint.y - topLeftPoint.y,
        )
        let selectable = this.gameObjects.gameObject.concat(this.gameObjects.decoration)
        selectable.forEach(obj => {
          if(!obj.hitbox) return
          if(Collision.auto(obj.hitbox, box)) 
            this.selectObject(obj)
        })
      },
      reset() {
        this.startPoint.set(0)
        this.endPoint.set(0)
      }
    }
    this.selectDelay = 55
    this.activeObject = {
      name: "small0",
      type: "asteroid",
      extra: []
    }
    this.activeLayer = null
    this.limitSelectionToLayer = false
    this.circleSelectRadius = 50

    /* add layers here and set each to unlocked */
    this.lockedLayers = {}
    for(let key in this.layers) {
      this.lockedLayers[key] = false
    }
    this.rotationData = {
      clickOrigin: new Vector(),
      angleStart: 0,
      angleNow: 0,
      pivot: new Vector(),
      orig: 0,
    }

    /* fog stuff */
    this.fogPlaced = 0
    this.fogRemoved = 0
    this.brushSpacing = 50
    this.eraserRadius = 50
    this.fog = []
    
    /* this is an array of gameObjects that are used to move fog sprites around */
    this.fogHandlers = []

    this.moveSpawnsAlong = false
    this.useCollision = false
    this.useMultiSelection = false
    this.dropdown = this.element.querySelector(".search-dropdown-window")
    this.dropdownSpecial = this.element.querySelector(".special-dropdown-window")
    this.objSelector = this.element.querySelector(".selected-object-cont")
    this.camera.lockTo(this.cameraAnchor)
    
    this.generateIcons()
    this.generateObjectList()
    this.addOrigin()
    this.modifyCamera()
    this.loadSprayModeSpacing()
    this.setActiveObject(this.element.querySelector(".dropdown-item.object"))
    this.generateLayerButtons()
    this.setTool(this.tools[0])
  }
  import() {
    let name = window.prompt("location name", "kaeso")
    if(!name) return
    
    this.clearLocation()

    readJSONFile("data/locations/" + name + "/objects.json", (text) => {
      let rawData = JSON.parse(text)
      let location = SaveConverter.convert("save", "data", rawData)

      /* cosmetic */
      this.locationName = location.name
      Q('#location-editor-name').innerText = this.locationName

      /* fog */
      this.loadFog(location.fog)

      /* objects */
      location.objects.forEach(obj => {

        if(obj.type == "decoration" && obj.name == "empty") return

        let params = {
          transform: Transform.fromPlain(obj.transform),
          id: obj.id,
          pilot: obj.pilot
        }
        if(obj.type === "camera") {
          params["context"] = this.stage
          params["lockedTo"] = this.cameraAnchor
        }

        let gameObject = 
        GameObject.create(
          obj.type, 
          obj.name, 
          params,
          {
            world: this,
            layer: obj.layer
          }
        )
        if(obj.type === "camera")
          this.camera = gameObject
        this.supplyHitboxIfNotPresent(gameObject)
      })

      this.modifyCamera()
    })
  }
  export() {
    let gameLocation = {}
    gameLocation.name = this.locationName
    gameLocation.position = this.locationPosition.plain()

    /* fog */
    gameLocation.fog = this.fog.map(f => {
      return {
        position: {
          x: f.position.x,
          y: f.position.y
        },
        alpha: f.alpha,
      }
    })

    /* objects */
    gameLocation.objects = []
    let exceptions = [NPC, Person, Player, Hint, GameOverlay, HintGraphic]
    let exportedObjects = this.gameObjects.gameObject.concat(this.gameObjects.decoration)

    exportedObjects.forEach(obj => {
      for(let exception of exceptions)
        if(obj instanceof exception) return
      
      if(obj.type == "decoration" && obj.name == "empty") return

      let newobj = {
        id: obj.id, 
        transform: obj.transform.plain,
        type: obj.type,
        name: obj.name,
        layer: obj.layer
      }
      if(obj.pilot)
        newobj.pilot = obj.pilot
      
      gameLocation.objects.push(newobj)
    })

    /* convert to save file */
    let saveFile = SaveConverter.convert("data", "save", gameLocation, {decimals: 0})
    console.log(saveFile)
    exportToJSONFile(saveFile, "location001")
  }
  show() {
    this.element.classList.remove('hidden')
  }
  hide() {
    this.element.classList.add('hidden')
  }
  toggle() {
    this.element.classList.toggle('hidden')
  }
  modifyCamera() {
    this.camera.zoomRange = [0.1, 25]
    this.camera.zoomStep = 0.9
    this.camera.zoom.duration = 10
  }
  addOrigin() {
    this.origin = PIXI.Sprite.from("assets/origin.png")
    this.origin.anchor.x = 0.5
    this.origin.anchor.y = 0.5
    this.stage.addChild(this.origin)
  }
  generateIcons() {
    this.tools.forEach(tool => {
      let cont = El('div', "tool-cont")
      let icon = El('div', "tool-icon " + tool)
      cont.append(icon)
      cont.onclick = () => this.setTool(tool)
      cont.title = tool.replaceAll('-', " ").replaceAll("_", " ").capitalize()
      cont.dataset.toolname = tool
      Q('#location-editor-toolset').append(cont)
    })
  }
  generateObjectList() {
    let regularList =     this.element.querySelector(".search-dropdown-window .dropdown-list-regular")
    let backgroundList =  this.element.querySelector(".search-dropdown-window .dropdown-list-background")
    let names = []
    let types = []

    /* only these objects are placeable, the rest like 'projectiles' wouldn't make sense */
    let typesDef = [
      "ship",
      "asteroid",
      "debris",
      "station",
      "satellite",
      "ultraportBeacon",
      "decoration",
    ]

    for(let type of typesDef)
      for(let key in data[type]) {
        names.push(key)
        types.push(type)
      }

    names.forEach((n, index) => {
      if(debug.locationEditor) 
        console.log(types[index], names[index], sources.img[types[index]][names[index]])

      let img = new Image()
      types[index].includes("decoration") ? 
      img.src = sources.img[types[index]][names[index]].folder + "linework.png" :
      img.src = sources.img[types[index]][names[index]].folder + "thumbnail.png"
      img.style.position = "absolute"

      let cont = El('div', "dropdown-item object", [["title", "Click to select | Click + SHIFT to add/remove object from multi-selection | Click + CTRL to replace selected with this object"]])
      let name = names[index].replaceAll("_", ' ').capitalize()
      let desc = El('div', "dropdown-desc", undefined, name) 
      let imageCont = El('div', "dropdown-image")
      imageCont.append(img)
      cont.dataset.name = names[index]
      cont.dataset.type = types[index]
      cont.append(imageCont, desc)

      if(types[index].includes("decoration"))
        backgroundList.append(cont)
      else
        regularList.append(cont)
    })
  }
  generateLayerButtons() {
    function createButton(key) {
      let button = El("div", "location-editor-layer-button", undefined, key)
      button.dataset.layer = key
      Q("#location-editor-layer-dropdown").append(button)
    }
    createButton("auto")
    for(let key in this.layers) {
      createButton(key)
    }
  }
  setActiveLayer(layer) {
    Q("#location-editor-layer-selector-text").innerText = layer
    layer == "auto" ? this.activeLayer = null : this.activeLayer = layer
  }
  toggleLayerLock(layer) {
    this.lockedLayers[layer] = !this.lockedLayers[layer]
    this.element.querySelector(`.location-editor-layer-button[data-layer='${layer}']`).classList.toggle("locked")
  }
  toggleLayerDropdown() {
    Q("#location-editor-layer-dropdown").classList.toggle("hidden")
  }
  showLayerDropdown() {
    Q("#location-editor-layer-dropdown").classList.remove("hidden")
  }
  hideLayerDropdown() {
    Q("#location-editor-layer-dropdown").classList.add("hidden")
  }
  toggleDropdownListCategory() {
    Q(".dropdown-list-regular").classList.toggle("hidden")
    Q(".dropdown-list-background").classList.toggle("hidden")
    Q("#search-dropdown-category-switch-regular").classList.toggle("active")
    Q("#search-dropdown-category-switch-background").classList.toggle("active")
  }
  setTool(name) {
    let tool = this.tools.find(t => t === name)
    if(!tool) return

    this.prevTool = this.tool
    this.tool = tool
    Array.from(this.element.querySelectorAll('.tool-cont')).forEach(el => el.classList.remove('active'))
    this.element.querySelector('[data-toolname="' + tool + '"').classList.add('active')

    if(tool !== "select-object") 
      this.dropdown.classList.add("hidden")
    if(tool !== "add-special") 
      this.dropdownSpecial.classList.add("hidden")
    if(tool === "select-object")
      this.state.set("addingObj")
    else
      this.state.set("default")
  }
  addOverrideRow() {
    let row = El("div", "context-window-override-row", undefined, "Click to set override")
    row.dataset.overrideindex = this.selected[0].overrides.length
    this.selected[0].overrides.push("")
    Q("#context-window-overrides-list").append(row)
  }
  setOverride(overrideElement) {
    let overrideIndex = overrideElement.dataset.overrideindex
    let value = window.prompt(`Enter override value(example:'"systems", ["cargo", "engine"]'`, overrideElement.innerText)
    if(!value) return

    this.selected.forEach(obj => obj.overrides[overrideIndex] = eval(`[${value}]`))
    overrideElement.innerText = value
  }
  revertTool() {
    this.setTool(this.prevTool)
    if(this.tool === "select-object") 
      this.state.set("addingObj")
    if(this.tool === "add-special") 
      this.state.set("addingObj")
  }
  setActiveObject(target) {
    let item = target.closest(".dropdown-item.object")
    let type = item.dataset.type
    let name = item.dataset.name
    if(!keys.shift) {
      this.activeObject.type = type
      this.activeObject.name = name
      this.activeObject.extra = []
      Qa("#location-editor .dropdown-item").forEach(i => i.classList.remove("active"))
      setTimeout(() => this.hideDropdown(), 100)
      
      let imgCont = item.querySelector(".dropdown-image").cloneNode(true)
      Array.from(imgCont.children).forEach(img => img.style = "")
      imgCont.classList.replace("dropdown-image", "selected-object-icon")
      let text = item.querySelector(".dropdown-desc").innerText
      let desc = El("div", "selected-object-desc", undefined, text)
      this.objSelector.innerHTML = ""
      this.objSelector.append(imgCont, desc)
    }
    else
    if(keys.shift) {
      let obj = this.activeObject.extra.find(obj => obj.name === name && obj.type === type)
      if(obj) {
        this.activeObject.extra.remove(obj)
        item.classList.remove("active")
      }
      else {
        this.activeObject.extra.push({name, type})
        item.classList.add("active")
      }
    }
  }
  replaceSelectedWith(type, name) {
    let newObjects = []
    let replaced = [...this.selected]
    this.deselectAll()
    replaced.forEach(obj => {
      let transform = obj.transform.clone()
      newObjects.push(
        GameObject.create(type, name, {transform}, {world: this})
      )
    })
    replaced.forEach(obj => GameObject.destroy(obj))
    this.selected.push(...newObjects)
  }
  contestWindowToggle() {
    if(this.isContextWindowOpen)
      this.contextWindowClose()
    else
      this.contextWindowOpen()
  }
  contextWindowOpen() {
    if(this.selected.length > 1) return

    let obj = this.selected[0]
    this.contextWindow.classList.remove('hidden')
    this.isContextWindowOpen = true
  }
  contextWindowClose() {
    this.contextWindow.classList.add('hidden')
    this.isContextWindowOpen = false
  }
  //this is the inspector window for a selected GameObject
  contextWindowRefresh() {
    if(this.selected.length !== 1) return

    let obj = this.selected[0]
    Array.from(this.contextWindow.querySelectorAll(".temp")).forEach(prop => prop.remove())

    const createProp = (prop) => {
      let cont = El("div", "property temp")
      let key = El("div", "key", undefined, prop + ": ")

      let value
      let isTransformProperty = prop.matchAgainst("position", "velocity", "rotation", "angularVelocity")
      
      if(isTransformProperty)
        value = obj.transform[prop]
      else
        value = obj[prop]

      cont.dataset.property = prop
      cont.dataset.istransformproperty = isTransformProperty ? "true" : "false"
      
      let valueElement = El("div", "value", undefined, value)

      if(prop === "pilot")
        valueElement.classList.add("person-field")

      cont.dataset.datatype = typeof value
      cont.append(key, valueElement)
      this.contextWindowPropertiesContainer.append(cont)
    }

    let props = ["id", "rotation", "angularVelocity"]

    if(obj instanceof RandomSpawner) {
      props.push("radius", "spawnsMin", "spawnsMax")
      props.forEach(prop => createProp(prop))
      obj.objects.forEach(o => {
        obj.generateThumbnail(o.type, o.name, o.src)
      })
    }
    else
    if(obj instanceof RandomSpawnerSpawn) {
      props.push("weight")
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof Asteroid) {
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof Debris) {
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof Ship) {
      props.push("pilot")
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof Station) {
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof Interactable) {
      props.push("radius")
      props.forEach(prop => createProp(prop))
    }
    else
    if(obj instanceof UltraportBeacon) {
      props.forEach(prop => createProp(prop))
    }
  }
  npcSearchCreate() {
    let popup = El("div", "search-popup")
    let input = El("input", "search-popup-input", [["type", "text"]])

    const createField = (prop) => {
      let row = El("div", "search-popup-row")
          row.dataset.datatype = "speaker"
      let name = El("div", "search-popup-name", undefined, prop)
      let img = new Image()
      if(prop.includes("variable")) 
      {
        img.src = "assets/editor/iconSpeaker.png"
      }
      else 
      {
        img.src = "assets/portraits/" + prop + ".png"
      }

      row.append(img, name)
      row.dataset.speaker = prop
      popup.append(row)
    }
    for(let prop in data.person) 
      createField(prop)

    popup.append(input)
    popup.style.left = (mouse.clientPosition.x + 5) + "px"
    popup.style.top = (mouse.clientPosition.y + 5) + "px"
    this.element.append(popup)
    this.npcSearch = popup
  }
  addObject(options = {useScatter: false}) {
    let pos = mouse.locationEditorPosition.clone()
    let vel = new Vector(0,0)
    let rotation = 0
    let angularVelocity = 0
    let type, name
    let objectIndex = Random.int(0, this.activeObject.extra.length - 1)
    if(this.useMultiSelection) {
      type = this.activeObject.extra[objectIndex].type
      name = this.activeObject.extra[objectIndex].name
    }
    else {
      type = this.activeObject.type
      name = this.activeObject.name
    }

    if(options.useScatter) {
      pos.x += Random.int(-this.sprayMode.scatter.x, this.sprayMode.scatter.x)
      pos.y += Random.int(-this.sprayMode.scatter.y, this.sprayMode.scatter.y)
    }

    if(this.randomizeRotation) 
      rotation = Math.random() * PI*2

    let gameObject = GameObject.create(
      type,
      name, 
      {
        transform: new Transform(
          pos, vel, rotation, angularVelocity
        )
      }, 
    {
      world: this,
      layer: this.activeLayer
    })
    if(type === "ship")
      gameObject.pilot = "dummyCaptain"

    this.supplyHitboxIfNotPresent(gameObject)
  }
  addSpecial() {
    throw "Don't use addSpecial()"
  }
  selectObject(obj) {
    if(this.selected.findChild(obj)) return
    if(this.limitSelectionToLayer && this.activeLayer && obj.layer !== this.activeLayer) return
    if(this.lockedLayers[obj.layer]) return

    this.selected.push(obj)
    this.contextWindowRefresh()
  }
  deselectObject(obj) {
    this.selected.remove(obj)
  }
  reselect() {
    [this.selected, this.previousSelected] = [this.previousSelected, this.selected]
  }
  selectAll() {
    this.deselectAll()
    let selectable = this.gameObjects.decoration.concat(this.gameObjects.gameObject)
    selectable.forEach(obj => {
      if(obj === this.camera) return
      if(this.activeLayer && this.limitSelectionToLayer && obj.layer === this.activeLayer)
        this.selectObject(obj)
      else 
      if(this.activeLayer && !this.limitSelectionToLayer)
        this.selectObject(obj)
      else 
      if(!this.activeLayer)
        this.selectObject(obj)
    })
    this.previousSelected = [...this.selected]
  }
  deselectAll() {
    this.selected = []
  }
  resetRotation() {
    this.selected.forEach(o => o.transform.rotation = 0)
  }
  randomizeRotationForAll() {
    this.selected.forEach(obj => obj.transform.rotation = Random.float(0, TAU))
  }
  deleteSelected() {
    let toBeDestroyed = [...this.selected]
    this.deselectAll()
    toBeDestroyed.forEach(obj => {
      if(this.fogHandlers.findChild(obj))
        this.removeFogSprite(obj.attachedFogSprite)
      GameObject.destroy(obj)
    })
  }
  duplicateSelected() {
    let duplicates = []
    this.selected.forEach(obj => {
      let newobj = 
      GameObject.create(
        obj.type, 
        obj.name, 
        {
          transform: obj.transform.clone()
        }, 
        {world: this}
      )
      newobj.transform.position.x += 50
      newobj.transform.position.y += 50
      this.supplyHitboxIfNotPresent(newobj)
      duplicates.push(newobj)
    })
    this.deselectAll()
    duplicates.forEach(dup => this.selectObject(dup))
    this.previousSelected = [...this.selected]
  }
  loadFog(fogArray) {
    fogArray.forEach(f => {
      this.addFog(f.alpha, f.position, true)
    })
  }
  addFog(
    alpha = clamp(mouse.pressure * 3, 0.2, 1.0),
    position = mouse.locationEditorPosition.clone(),
    fromFile = false,
  ) {
    /* if the fog isn't loaded from a file, return if the mouse hasn't moved far enough to place another sprite */
    if(!fromFile && mouse.travelled < Math.floor(this.fogPlaced) * this.brushSpacing) return
    
    let 
    fog = PIXI.Sprite.from("assets/fogDab.png")
    fog.position.set(position.x, position.y)
    fog.anchor.set(0.5)
    fog.alpha = alpha
    fog.rotation = Random.rotation()
    fog.scale.set(0.5 + alpha)

    this.layers.fog.addChild(fog)
    this.fog.push(fog)
    this.fogPlaced++

    /* create a gameobject that holds the fog in reference and then when you move the gameobject, it moves the fog sprite */
    let 
    go = GameObject.create("decoration", "empty", {transform: new Transform(new Vector(position.x, position.y))}, {world: this, layer: "fog"})
    go.attachedFogSprite = fog
    this.fogHandlers.push(go)
    this.supplyHitboxIfNotPresent(go, 0x335aee)
  }
  removeFog() {
    if(mouse.travelled < Math.floor(this.fogRemoved) * this.brushSpacing) return

    let position = mouse.locationEditorPosition.clone()
    for(let i = 0; i < this.fog.length; i++) {
      let fog = this.fog[i]
      let vec = new Vector(fog.position.x, fog.position.y)
      if(vec.isClose(this.eraserRadius, position)) {
        this.removeFogSprite(fog)
        break
      }
    }
    this.fogRemoved++
  }
  removeFogSprite(fog) {
    this.fog.remove(fog)
    this.layers.fog.removeChild(fog)
  }
  loadSprayModeSpacing() {
    this.sprayMode.spacing = +localStorage.getItem("sprayModeSpacing")
    this.sprayMode.scatter.x = +localStorage.getItem("scatterX")
    this.sprayMode.scatter.y = +localStorage.getItem("scatterY")
  }
  setSprayModeParameters() {
    this.sprayMode.spacing =    +window.prompt("Set spacing value", this.sprayMode.spacing)      || this.sprayMode.spacing
    this.sprayMode.scatter.x =  +window.prompt("Set scatter X value", this.sprayMode.scatter.x)  || this.sprayMode.scatter.x
    this.sprayMode.scatter.y =  +window.prompt("Set scatter Y value", this.sprayMode.scatter.y)  || this.sprayMode.scatter.y
    
    localStorage.setItem("sprayModeSpacing",  this.sprayMode.spacing)
    localStorage.setItem("scatterX",          this.sprayMode.scatter.x)
    localStorage.setItem("scatterY",          this.sprayMode.scatter.y)
  }
  //#region input handlers
  handleKeydown(event) {
    if(event.code === "Escape" && (keys.shift || keys.shiftRight)) 
      this.reselect()
    else 
    if(event.code === "Escape") 
      this.deselectAll()

    if(event.code === "KeyD")                                 this.duplicateSelected()
    if(event.code === "KeyV")                                 this.setTool("move")
    if(event.code === "KeyC")                                 this.setTool("circle-select")
    if(event.code === "KeyR" && !keys.alt && !keys.shift)     this.setTool("rotate")
    if(event.code === "KeyR" && keys.alt && !keys.shift)      this.resetRotation()
    if(event.code === "KeyR" && !keys.alt && keys.shift)      this.randomizeRotationForAll()
    if(event.code === "KeyS" && !keys.shift)                  this.setTool("select-object")
    if(event.code === "KeyS" && keys.shift)                   this.setSprayModeParameters()
    if(event.code === "KeyX")                                 this.deleteSelected()
    if(event.code === "KeyA")                                 this.selectAll()
    if(event.code === "KeyE")                                 this.contestWindowToggle()
    if(event.code === "KeyN")                                 this.state.set("addingSpawn")
  }               
  handleKeyup(event) {

  }
  handleMousemove(event) {
    if(this.state.is("panning")) {
      this.cameraAnchor.transform.position.sub(mouse.locationEditorMoved)
    }

    /* move objects */
    if(
      this.tool === "move" && 
      this.selected.length > 0 && 
      event.target === this.element && 
      mouse.keys.left && 
      this.state.isnt("draggingContextWindow")
    ) {
      this.selected.forEach(obj => {
        obj.transform.position.add(mouse.locationEditorMoved)
        if(this.fogHandlers.findChild(obj))
          obj.attachedFogSprite.position.set(obj.transform.position.x, obj.transform.position.y)
      })
    }

    if(this.state.is("circleSelecting")) {
      let pos = mouse.locationEditorPosition.clone()
      let fakeGameObject = {transform: {position: pos}}
      let fakeCircleHitbox = {type: "circle", radius: this.circleSelectRadius * this.camera.currentZoom, gameObject: fakeGameObject}

      let selectable = this.gameObjects.gameObject.concat(this.gameObjects.decoration)
      selectable.forEach(obj => {
        if(!obj.hitbox) return

        if(!Collision.auto(fakeCircleHitbox, obj.hitbox)) return

        if(mouse.keys.right)
          this.deselectObject(obj)
        else
          this.selectObject(obj)
      })
    }

    if(this.state.is("draggingContextWindow")) {
      let left =  this.contextWindow.getBoundingClientRect().x
      let top =   this.contextWindow.getBoundingClientRect().y
      this.contextWindow.style.left = (left + mouse.clientMoved.x) + "px"
      this.contextWindow.style.top = (top + mouse.clientMoved.y) + "px"
    }

    /* rotate objects */
    if(this.state.is("rotating")) {
      if(this.selected.length === 1) {
        let pos = mouse.locationEditorPosition.clone()
        let obj = this.selected[0]
        let angle = Math.atan2(pos.y - obj.transform.position.y, pos.x - obj.transform.position.x)
        let result = angle - this.rotationData.angleStart
        obj.transform.rotation = this.rotationData.orig + result
      }
      if(this.selected.length > 1) {
        console.warn("cannot rotate multiple objects, sorry mate")
      }
    }
    if(this.state.is("addingObj") && this.sprayMode.active && mouse.travelled > this.sprayMode.spacing) {
      mouse.travelled = 0
      this.addObject({useScatter: true})
    }

    if(this.boxSelection.active)      this.boxSelection.endPoint.setFrom(mouse.locationEditorPosition)
    if(this.state.is("paintingFog"))  this.addFog()
    if(this.state.is("erasingFog"))   this.removeFog()
  }
  handleMousedown(event) {
    let target = event.target
    if(event.button === 0) {
      if(target.closest(".tool-icon.select-object")) {
        this.toggleDropdown(target)
      } 
      if(target.closest(".drag-widget")) {
        this.state.set("draggingContextWindow")
      }
      if(target.closest(".thumbnail-container .icon-close-top-right")) {
        if(!(this.selected[0] instanceof RandomSpawner)) return

        let container = target.closest(".context-window-thumbnail")
        let obj = this.selected[0].objects.find(obj => obj.type === container.dataset.type && obj.name === container.dataset.name)
        obj.destroy()
      }
      if(target.closest(".tool-icon.add-special")) {
        let el = target.closest(".tool-cont")
        let rect = el.getBoundingClientRect()
        
        this.dropdownSpecial.style.left = rect.x + "px"
        this.dropdownSpecial.style.top = rect.y + rect.height + 10 + "px"
        this.dropdownSpecial.classList.toggle("hidden")
      }
      if(target.closest(".tool-icon.edit-hitbox")) {
        if(this.selected.length > 0) {
          let obj = this.selected[0]
          gameManager.closeWindow()
          gameManager.setWindow(hitboxEditor)
          hitboxEditor.select(obj)
        }
      }
      if(target.closest(".tool-icon.moveSpawnsAlong")) {
        this.moveSpawnsAlong = !this.moveSpawnsAlong
        target.closest(".tool-icon.moveSpawnsAlong").classList.toggle('active')

        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".tool-icon.randomize-rotation")) {
        this.randomizeRotation = !this.randomizeRotation
        target.closest(".tool-icon.randomize-rotation").classList.toggle('active')
        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".tool-icon.toggle-collision")) {
        this.useCollision = !this.useCollision
        target.closest(".tool-icon.toggle-collision").classList.toggle('active')
        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".tool-icon.toggle-spray-mode")) {
        this.sprayMode.active = !this.sprayMode.active
        target.closest(".tool-icon.toggle-spray-mode").classList.toggle('active')
        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".tool-icon.use-multi-selection")) {
        this.useMultiSelection = !this.useMultiSelection
        target.closest(".tool-icon.use-multi-selection").classList.toggle('active')
        setTimeout(()=> {this.revertTool()},100)
      }
      if(target.closest(".dropdown-item.object") && !keys.ctrl) {
        this.setActiveObject(target)
        this.state.set("addingObj")
      }
      if(target.closest(".dropdown-item.object") && keys.ctrl) {
        let item = target.closest(".dropdown-item.object")
        let type = item.dataset.type
        let name = item.dataset.name
        this.replaceSelectedWith(type, name)
        this.state.set("addingObj")
      }

      /* layer selection and locking */
      if(target.closest("#location-editor-layer-selector")) {
        if(keys.shift || keys.ctrl)
          this.showLayerDropdown()
        else
          this.toggleLayerDropdown()
      }
      if(target.closest(".location-editor-layer-button") && !keys.shift && !keys.ctrl) {
        let layer = target.closest(".location-editor-layer-button").dataset.layer
        this.setActiveLayer(layer)
      }
      if(target.closest(".location-editor-layer-button") && keys.shift && !keys.ctrl) {
        let layer = target.closest(".location-editor-layer-button").dataset.layer
        this.toggleLayerLock(layer)
      }
      if(target.closest(".location-editor-layer-button") && keys.ctrl && !keys.shift) {
        let layer = target.closest(".location-editor-layer-button").dataset.layer

        for(let key in this.lockedLayers)
          if(!this.lockedLayers[key])
            this.toggleLayerLock(key)
        
        this.toggleLayerLock(layer)
      }
      if(target.closest(".location-editor-layer-button") && keys.ctrl && keys.shift) {
        let layer = target.closest(".location-editor-layer-button").dataset.layer

        let isSoloed = true
        let soloValue = this.lockedLayers[layer]
        for(let key in this.lockedLayers) {
          if(key === layer) continue
          if(this.lockedLayers[key] == soloValue) {
            isSoloed = false
            break
          }
        }
        if(isSoloed) {
          for(let key in this.lockedLayers)
            this.toggleLayerLock(key)
        }
        else {
          for(let key in this.lockedLayers)
            if(!this.lockedLayers[key])
              this.toggleLayerLock(key)
          this.toggleLayerLock(layer)
        }
      }
      /* end of layer selection and locking */

      if(target.closest("#search-dropdown-category-switch")) {
        this.toggleDropdownListCategory()
      }
      if(target.closest("#add-override-button")) {
        this.addOverrideRow()
      }
      if(target.closest(".context-window-override-row")) {
        this.setOverride(target.closest(".context-window-override-row"))
      }
      if(target.closest("#limit-selection-to-active-layer")) {
        this.limitSelectionToLayer = !this.limitSelectionToLayer
        target.closest("#limit-selection-to-active-layer").classList.toggle("active")
      }
      /* edit object property in inspector */
      if(target.closest(".property .value")) {
        if(this.selected.length == 0) return
        
        let propertyElement = target.closest(".property")
        let property = propertyElement.dataset.property
        let datatype = propertyElement.dataset.datatype
        let isTransformProperty = propertyElement.dataset.istransformproperty.bool()

        let newValue

        if(keys.alt) {
          newValue = 0
        }
        else {
          if(isTransformProperty)
            newValue = window.prompt("Enter new value for " + property, this.selected[0].transform[property])
          else
            newValue = window.prompt("Enter new value for " + property, this.selected[0][property])
        }

        if(datatype === "number") {
          if(isTransformProperty)
            this.selected[0].transform[property] = +newValue
          else
            this.selected[0][property] = +newValue
        }
        if(datatype === "string") {
          if(isTransformProperty)
            this.selected[0].transform[property] = newValue
          else
            this.selected[0][property] = newValue
        }

        mouse.keys.left = false
        this.contextWindowRefresh()
      }
      if(target.closest(".dropdown-item.special")) {
        this.activeObject.type = target.closest(".dropdown-item.special").dataset.type
        this.activeObject.name = target.closest(".dropdown-item.special").dataset.name
        this.state.set("addingObj")
        this.dropdownSpecial.classList.add("hidden")
      }
      if(target === this.element && this.state.is("addingObj")) {
        let hit = false
        mouse.travelled = 0
        let selectable = this.gameObjects.gameObject.concat(this.gameObjects.decoration)

        selectable.forEach(obj => {
          if(!(obj instanceof LocationRandomizer) && !(obj instanceof RandomSpawner)) return
          if(Collision.vectorCircle(mouse.locationEditorPosition, obj.hitbox)) {
            if(obj instanceof LocationRandomizer) {
              hit = true
              obj.setObject(this.activeObject.type, this.activeObject.name)
            }
            if(obj instanceof RandomSpawner) {
              hit = true
              obj.addObject(this.activeObject.type, this.activeObject.name, 0, 0, 1)
            }
          }
        })
        if(!hit) this.addObject()
      }
      if(target.closest('.icon-export')) {
        this.export()
      }
      if(target.closest('.icon-import')) {
        this.import()
      }
      if(target === this.element) {
        if(this.tool === "move") {
          let hasHit = false
          let pos = mouse.locationEditorPosition.clone()

          let selectable = this.gameObjects.gameObject.concat(this.gameObjects.decoration)
          selectable.forEach(obj => {
            if(hasHit) return
            if(!obj.hitbox) return
            
            if(Collision.auto(pos, obj.hitbox)) 
              hasHit = true

            if(hasHit) {
              if(!(keys.shift || keys.shiftRight) && !this.previousSelected.find(o => o === obj)) 
                this.deselectAll()
              
              this.selectObject(obj)
            }
          })
          if(!hasHit && this.selected.length === 0) {
            this.boxSelection.begin()
          }
        }

        if(this.tool === "circle-select") {
          this.state.set("circleSelecting")
        }

        if(this.tool === "addSpawn") {
          if(!(this.selected[0] instanceof LocationRandomizer) || this.selected.length > 1) return
          this.selected[0].addSpawn(mouse.locationEditorPosition)
        }

        if(this.tool === "rotate") {
          if(this.selected.length === 0) return
          this.state.set("rotating")
          this.rotationData.clickOrigin.setFrom(mouse.locationEditorPosition)
          if(this.selected.length === 1) {
            let pos = this.rotationData.clickOrigin
            let obj = this.selected[0]
            this.rotationData.angleStart = Math.atan2(pos.y - obj.transform.position.y, pos.x - obj.transform.position.x)
            this.rotationData.orig = obj.transform.rotation
          }
          else {
            throw "cannot rotate multiple objects, sorry"
            let pos = this.rotationData.clickOrigin
            let positions = this.selected.map(s => s.pos)
            let pivot = Vector.avg(...positions)
            this.rotationData.pivot = pivot
            this.rotationData.angleStart = Math.atan2(pos.y - pivot.y, pos.x - pivot.x)
          }

        }
        if(this.tool === "fog-paint") {
          this.addFog()
          this.state.set("paintingFog")
        }
        
        if(this.tool === "fog-eraser") {
          this.removeFog()
          this.state.set("erasingFog")
        }
      }
    }
    if(event.button === 1) {
      if(event.target === this.element)
        this.state.set("panning")
      else
      if(target.closest("#location-editor-layer-selector"))
        this.setActiveLayer("auto")
    }
    if(event.button === 2) {
      if(this.tool === "circle-select") {
        this.state.set("circleSelecting")
      }
    }
  }
  handleMouseup(event) {
    if(this.state.is("panning", "rotating", "draggingContextWindow", "paintingFog", "erasingFog", "circleSelecting"))
      this.state.revert()

    this.fogPlaced = 0
    this.fogRemoved = 0

    let selectable = this.gameObjects.gameObject.concat(this.gameObjects.decoration)
    selectable.forEach(obj => {
      if(!obj.hitbox) return
      let hit = false
      let pos = mouse.clientPosition.clone().sub(new Vector(this.stage.position.x, this.stage.position.y))
      if(
        Collision.auto(pos, obj.hitbox) 
        && 
        mouse.clientClickOrigin.isClose(2, mouse.clientClickEnd)
      ) {
        hit = true
      }
      if(hit && this.previousSelected.find(o => o === obj))
        this.deselectObject(obj)
    })

    if(event.button === 0) {
      if(this.boxSelection.active)
        this.boxSelection.end()
    }

    this.previousSelected = [...this.selected]
  }
  handleClick(event) {

  }
  handleWheel(event) {
    if(event.target === this.element)
      this.zoom(event)
  }
  //#endregion
  supplyHitboxIfNotPresent(obj, color = 0xd35a1e) {
    if(obj.hitbox || data[obj.type][obj.name].hitbox) return

    switch(obj.type) {
      case "decoration": {
        /* do some black magic with the decoration to convert it to quasi-gameobject and add hitbox and rigidbody and some other shit */
        obj.components = []
        obj.addComponent = GameObject.prototype.addComponent
        obj.calculateBroadphaseGrowFactor = GameObject.prototype.calculateBroadphaseGrowFactor
        obj.components.push("hitbox", "rigidbody")
        obj.addComponent("hitbox", {
          hitbox: {
            type: "box",
            filename: null,
            definition: {
              a: 50,
              b: 50,
              color
            }
          }
        })
        obj.addComponent("rigidbody", {rigidbody: {}})
        break
      }
      default: {
        obj.components.push("hitbox", "rigidbody")
        obj.addComponent("hitbox", {
          hitbox: {
            type: "box",
            filename: null,
            definition: {
              a: 50,
              b: 50,
              color
            }
          }
        })
        obj.addComponent("rigidbody", {rigidbody: {}})
        break
      }
    }

  }
  toggleDropdown(target) {
    let el = target.closest(".tool-cont")
    let rect = el.getBoundingClientRect()
    if(this.dropdown.classList.contains("hidden"))
      this.showDropdown(rect)
    else
      this.hideDropdown(rect)
  }
  showDropdown(parentBoundingRect) {
    this.dropdown.classList.remove("hidden")
    this.dropdown.style.left = parentBoundingRect.x + "px"
    this.dropdown.style.top = parentBoundingRect.y + parentBoundingRect.height + 10 + "px"
    setTimeout(() => {
      this.dropdown.querySelector("input").focus()
      this.dropdown.scrollTo(0, this.dropdown.scrollTopPrevious)
      console.log("scrolling to" , this.dropdown.scrollTopPrevious)
      console.log(this.dropdown.scrollTopPrevious)
    }, 100)
  }
  hideDropdown() {
    this.dropdown.scrollTopPrevious = this.dropdown.scrollTop
    this.dropdown.classList.add("hidden")
  }
  zoom(event) {
    if(event.deltaY < 0) 
      this.camera.zoomInit("in")
    else
      this.camera.zoomInit("out")
  }
  updateCursorOverlays() {
    if(this.tool === "fog-eraser") {
      this.graphics.lineStyle(2 * this.camera.currentZoom, 0xffffff, 1)
      this.graphics.drawCircle(mouse.locationEditorPosition.x, mouse.locationEditorPosition.y, this.eraserRadius)
      this.graphics.closePath()
    }
    if(this.tool === "circle-select") {
      this.graphics.lineStyle(2 * this.camera.currentZoom, 0xffffff, 1)
      this.graphics.drawCircle(mouse.locationEditorPosition.x, mouse.locationEditorPosition.y, this.circleSelectRadius * this.camera.currentZoom)
      this.graphics.closePath()
    }
  }
  updateHitboxesForDecorations() {
    this.gameObjects.decoration.forEach(obj => {
      let layerOffsetMultiplier = GameWorldWindow.layerCounterOffset[obj.layer] ?? 1
      obj.hitbox.positionOffset.x = this.camera.transform.position.x * layerOffsetMultiplier
      obj.hitbox.positionOffset.y = this.camera.transform.position.y * layerOffsetMultiplier
    })
  }
  drawBoxSelection() {
    if(this.boxSelection.active && this.boxSelection.endPoint.isnt(this.boxSelection.startPoint)) {
      this.graphics.lineStyle(2 * this.camera.currentZoom, colors.hitbox.shapeSelected, 1)
      this.graphics.drawRect(
        this.boxSelection.startPoint.x, 
        this.boxSelection.startPoint.y, 
        this.boxSelection.endPoint.x - this.boxSelection.startPoint.x, 
        this.boxSelection.endPoint.y - this.boxSelection.startPoint.y
      )
      this.graphics.closePath()
    }
  }
  drawSelectedObjects() {
    this.selected.forEach(obj => {
      Hitbox.drawBoundingBox(obj, this.graphics, this.camera.currentZoom)
    })
  }
  updateGridSpriteNew() {
    this.gridSprite.position.x = Math.floor((0-this.stage.position.x + cw/2) / grid.cellSize) * grid.cellSize - grid.cellSize*2
    this.gridSprite.position.y = Math.floor((0-this.stage.position.y + ch/2) / grid.cellSize) * grid.cellSize - grid.cellSize
  }
  update() {
    this.updateHitboxesForDecorations()
    this.updateCursorOverlays()
    this.drawSelectedObjects()
    this.drawBoxSelection()
    this.updateGridSpriteNew()
    this.updateLayers()
  }
}
class GameUI extends GameWindow {
  constructor() {
    super("GameUI", Q("#game-ui"))

    /* elements */
    this.shipHull =           Q('#ship-hull-wrapper')
    this.shipHullWrapper =    Q('#ship-hull-wrapper')
    this.audioCallPanel =     Q("#audio-call-panel")
    this.audioCallMiniature = Q("#audio-call-panel-miniature")

    /* tooltips */
    this.tooltip = new Tooltip(250)

    this.state = new State(
      "default",
      "dragging"
    )

    this.timers = new Timer(
      ["audioCallFlash", 4000, {loop: true, active: false, onfinish: this.flashAudioCallPanel.bind(this)}]
    )

    /* temp globals for drag functionality */
    this.placeholder = null
    this.placeholderTimeout = null
    this.draggedElement = null
    this.dragParent = null

    /* UI sequence data */
    this.sequenceTooltip = null

    /* temp globals for audio call */
    this.isAudioCallActive = false

    /* Means that game statistics like fps and collisionCount are displayed */
    this.statsVisible = false
  }
  //#region input
  handleKeydown(event) {
    if(event.code === binds.hitbox) 
      visible.hitbox = !visible.hitbox
    if(event.code === binds.navMesh) 
      visible.navMesh = !visible.navMesh
    if(event.code === binds.gameStats)
      this.toggleGameStats()
    if(event.code === binds.devIcons) 
      this.toggleDevIcons()

    /* rudimentary key-buttons highlighting for hints */
    Qa(".keyboard-key").forEach(key => {
      if(binds[key.dataset.bind] == event.code)
        key.classList.add("pressed", "accepted")
    })
  }
  handleKeyup(event) {
    /* rudimentary key-buttons highlighting for hints */
    Qa(".keyboard-key").forEach(key => {
      if(binds[key.dataset.bind] == event.code)
        key.classList.remove("pressed")
    })
  }
  handleMousedown(event) {
    if(event.target.closest("*[data-draggable='true']"))
      this.activateDrag(event.target.closest("*[data-draggable='true']"))
  }
  handleMousemove(event) {
    let target = event.target
    this.cancelTooltipTimeout()

    if(target.closest(".tooltip"))
      this.activateTooltip(target.closest(".tooltip"))
    else 
      this.cancelTooltip(target.closest(".tooltip"))

    if(target.closest(".tooltip-popup"))
      this.activateTooltipPopup(target.closest(".tooltip-popup"))
    else 
      this.cancelTooltipPopup()

    if(this.state.is("dragging") && this.draggedElement)
      this.updateDraggedItem(target)
  }
  handleMouseup(event) {
    if(this.state.is("dragging"))
      this.endDrag(event)
  }
  handleClick(event) {
    let target = event.target
    if(target.closest(".keyboard-bind-button")) {
      this.handleKeyBind(target)
    }
  }
  handleWheel(event) {

  }
  //#endregion
  handleKeyBind(target) {
    let 
    button = target.closest(".keyboard-bind-button")
    button.classList.add("active")

    let confirm = (e) => {
      button.dataset.key = e.code
      button.innerText = e.code.replace("Key", "").capitalize()
      binds[button.dataset.bind] = e.code
    }
    let resetHTML =  (e) => {
      button.classList.remove("active")
      document.removeEventListener("keydown", handler)
      document.removeEventListener("mousedown", handler)
    }
    let handler = (e) => {
      if(e.code === "Escape" || e.code === "Backspace") 
        return resetHTML(e)
      if(e.type === "mousedown")  
        return resetHTML(e)
      
      confirm(e)
      resetHTML(e)
    }
    document.addEventListener("keydown", handler)
    document.addEventListener("mousedown", handler)
  }
  //#region tooltips
  activateTooltip(target) {
    let delay = +target.dataset.delay
    let element = this.tooltip.element
    this.tooltip.setDataFrom(target)

    const updateTooltip = () => { element.classList.remove("hidden"); this.tooltip.update() }
    
    if(typeof delay === "number")
      this.tooltip.timeout = setTimeout(updateTooltip, delay)
    else 
      this.tooltip.timeout = setTimeout(updateTooltip, this.tooltip.delayDefault)

    this.tooltip.update()
  }
  cancelTooltip() {
    this.tooltip.element.classList.add("hidden")
  }
  cancelTooltipTimeout() {
    window.clearTimeout( this.tooltip.timeout )
  }
  activateTooltipPopup(eventTarget) {
    if(this.tooltipPopup?.triggerElement === eventTarget) {
      this.tooltipPopup.show()
    }
    else {
      this.tooltipPopup?.destroy()
      let attachmentOffset = null
      if(eventTarget.dataset.attachmentoffset)
        attachmentOffset = eval(eventTarget.dataset.attachmentoffset)

      this.tooltipPopup = new PopupTooltip(
        eventTarget, 
        eventTarget.dataset.tooltipattachment, 
        {title: eventTarget.dataset.tooltip, text: eventTarget.dataset.tooltipdescription}, 
        {
          setMaxWidthToTriggerElement:  eventTarget.dataset.setmaxwidthtotriggerelement?.bool(), 
          setMaxHeightToTriggerElement: eventTarget.dataset.setmaxheighttotriggerelement?.bool(),
          centerTooltipText:            eventTarget.dataset.centertooltiptext?.bool(),
          attachmentOffset:             attachmentOffset
        }
      )
    }
  }
  cancelTooltipPopup() {
    this.tooltipPopup?.destroy()
    this.tooltipPopup = null
  }
  //#endregion
  openAudioCallPanel(caller, message, dialogueName) {
    this.isAudioCallActive = true
    let name = data.person[caller].addressAs ?? data.person[caller].displayName

    this.audioCallPanel.querySelector(".audio-call-heading").innerText = "You have a call from " + name + "."
    this.audioCallPanel.querySelector(".audio-call-message").innerText = message
    this.audioCallPanel.querySelector(".caller-portrait").src = "assets/portraits/" + caller + ".png"
    this.audioCallPanel.querySelector(".call-option.accept").onclick = () => {
      gameManager.setWindow(dialogueScreen)
      setTimeout(() => dialogueScreen.load(dialogueName), 600)
      this.closeAudioCallPanel()
    }
    this.maximizeAudioCallPanel()
    this.animateAudioCallPanel(0, 1, () => this.timers.audioCallFlash.start())

    /* hide miniature */
    Q("#audio-call-panel-miniature").classList.add("hidden")

    AudioManager.playLoopedAudio("SFX", "tightbeamCall")
  }
  maximizeAudioCallPanel() {
    if(!this.isAudioCallActive) return

    Q("#audio-call-panel-miniature").classList.add("hidden")
    Q("#audio-call-panel").classList.remove("hidden")
    game.gameObjects.hint.forEach(hint => hint.minimize())
  }
  minimizeAudioCallPanel() {
    if(!this.isAudioCallActive) return

    Q("#audio-call-panel").classList.add("hidden")
    Q("#audio-call-panel-miniature").classList.remove("hidden")
  }
  animateAudioCallPanel(fromOpacity, toOpacity, onfinish = () => {}) {
    this.audioCallPanel.animate([
      {filter: `opacity(${fromOpacity})`},
      {filter: `opacity(${toOpacity})`},
    ],
    {
      duration: 650,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    })
    .onfinish = () => {
      this.audioCallPanel.style.filter = ""
      onfinish()
    }
  }
  async flashAudioCallPanel(iterations = 3, durationMS = 180) {
    let image, element
    if(this.audioCallPanel.classList.contains("hidden")) {
      image = "audioCallMiniature"
      element = this.audioCallMiniature
    }
    else {
      image = "audioCallPopup"
      element = this.audioCallPanel
    }
    
    await fetch("assets/ui/audioCallPopupHover.png")
    await fetch("assets/ui/audioCallPopup.png")
    await fetch("assets/ui/audioCallMiniatureHover.png")
    await fetch("assets/ui/audioCallMiniature.png")

    for(let i = 0; i < iterations; i++) {
      setTimeout(() => element.style.backgroundImage = `url("assets/ui/${image}.png")`)
      AudioManager.playSFX("buttonNoAction", Random.decimal(0.05, 0.15, 1.5))
      await waitFor(durationMS)
      setTimeout(() => element.style.backgroundImage = `url("assets/ui/${image}Hover.png")`)
      await waitFor(durationMS)
    }
    element.style.backgroundImage = ""
  }
  closeAudioCallPanel() {
    this.isAudioCallActive = false
    this.animateAudioCallPanel(1, 0, () => {
      Q("#audio-call-panel").classList.add("hidden")
      Q("#audio-call-panel-miniature").classList.add("hidden")
    })
    this.timers.audioCallFlash.stop()
  }
  async animateHullDamage() {
    let iterations = 4
    let animDurationMS = 1000 / 8
    await fetch("assets/ui/shipHullAndWeaponPanelWarning.png")
    for(let i = 0; i < iterations; i++) {
      setTimeout(() => Q("#ship-hull-and-weapon-panel").style.backgroundImage = 'url("assets/ui/shipHullAndWeaponPanelWarning.png")')
      await waitFor(animDurationMS)
      setTimeout(() => Q("#ship-hull-and-weapon-panel").style.backgroundImage = 'url("assets/ui/shipHullAndWeaponPanel.png")')
      await waitFor(animDurationMS)
    }
    Q("#ship-hull-and-weapon-panel").style.backgroundImage = ""
  }
  animateHullRepair() {
    this.shipHullWrapper.animate([
      {borderColor: "var(--color-accent)"},
      {borderColor: "unset"},
    ], {
      duration: 250,
      iterations: 2,
      easing: "steps(2)"
    })
    .onfinish = () => {
      this.shipHullWrapper.style.borderColor = ""
    }
  }
  createUIWeaponComponent(weapon, weaponSystem) {
    new UIWeaponComponent(game, Q("#ui-weapon-component-parent"), weapon, weaponSystem)
  }
  destroyUIWeaponComponents() {
    let weaponComponents = game.uiComponents.filter(c => c instanceof UIWeaponComponent)
    for(let c of weaponComponents)
      UIComponent.destroy(c)
  }
  toggleWeaponUIComponentChargedState(weaponElement, isCharged) {
    isCharged ? weaponElement.classList.add("charged") : weaponElement.classList.remove("charged")
  }
  highlightUIElement(elementId) {
    Q(`#${elementId}`).animate([
      {borderColor: "var(--dark-4)"},{borderColor: "white"},
    ], {duration: 220, iterations: 4, easing: "steps(2)"})
  }
  updateShipHullUI() {
    this.shipHull.innerHTML = ""
    for (let i = 0; i < player.ship.hull.level; i++) {
      if(i < player.ship.hull.current)
        this.shipHull.append(El("div", "ship-hull-point"))
      else
        this.shipHull.append(El("div", "ship-hull-point empty"))
    }

    if(player.ship.hull.current <= 4) {
      Q("#ship-hull-and-weapon-panel").classList.add("warning")
      Q("#red-overlay").classList.remove("hidden")
    } 
    else {
      Q("#ship-hull-and-weapon-panel").classList.remove("warning")
      Q("#red-overlay").classList.add("hidden")
    }
  }
  beginUIHintSequence(sequenceName) {
    if(data.UIHintSequence[sequenceName].finished) return

    this.UIHintSequence = sequenceName
    this.stepUIHintSequence(0)
  }
  stepUIHintSequence(index, previousHandler) {
    if(!this.UIHintSequence) return

    document.removeEventListener("keyup", previousHandler)
    let handler = (e) => {
      if(e.code.includesAny("Enter", "NumpadEnter", "Space"))
        this.stepUIHintSequence(++index, handler)
      if(e.code.includes("Escape"))
        this.finishUISequence(handler)
    }
    
    let hintBlock = data.UIHintSequence[this.UIHintSequence].hintSequence[index]
    if(!hintBlock) return this.finishUISequence(handler)

    console.log("Step UI sequence")
    this.sequenceTooltip?.destroy()
    this.sequenceTooltip = null

    let element = Q(`#${hintBlock.parentElementId}`)
    this.sequenceTooltip = new PopupTooltip(
      element, 
      hintBlock.hintPlacement, 
      {
        title: hintBlock.title, 
        text: createRichText(hintBlock.text)
      }, 
      hintBlock.options
    )

    /* add a popup tooltip to the popup tooltip 🤡 */
    this.sequenceTooltip.element.classList.add("tooltip-popup")
    this.sequenceTooltip.element.dataset.tooltip = "~bind=forwardSequence~ Continue hint <br><br>  ~bind=cancel~ Cancel hint"
    this.sequenceTooltip.element.dataset.tooltipattachment = "top"
    this.sequenceTooltip.element.dataset.setmaxwidthtotriggerelement = "true"

    if(hintBlock.options.allowPointerEvents)
      this.sequenceTooltip.element.onclick = () => this.stepUIHintSequence(++index, handler)

    document.addEventListener("keyup", handler)

    /* hint actions */
    for(let action of hintBlock.actions) {
      switch(action.actionName) {
        case "clickElement": {
          Q(`#${action.elementId}`).click()
          break
        }
        case "focusElement": {
          Q(`#${action.elementId}`).focus()
          break
        }
        case "addClass": {
          Q(`#${action.elementId}`).classList.add(...action.classes)
          break
        }
        case "removeClass": {
          Q(`#${action.elementId}`).classList.remove(...action.classes)
          break
        }
      }
    }
  }
  finishUISequence(handler) {
    if(!this.UIHintSequence) return
    console.log("Finished/Cancelled UI hint sequence")
    
    data.UIHintSequence[this.UIHintSequence].finished = true
    this.UIHintSequence = null
    this.sequenceTooltip?.destroy()
    this.sequenceTooltip = null
    document.removeEventListener("keydown", handler)
  }
  //#region drag and drop 
  activateDrag(target) {
    this.draggedElement = target
    this.dragParent = this.draggedElement.parentElement
    
    if(this.dragParent.dataset.inventorytype == "fixed-size" && this.dragParent.querySelectorAll("[data-draggable='true']").length === +this.dragParent.dataset.inventoryitemcount)
      this.dragParent.append(Item.createEmptyItemElement())
    else
      this.createPlaceholderElement(this.draggedElement)

    let rect = this.draggedElement.getBoundingClientRect()

    this.draggedElement.style.width =   rect.width  + "px"
    this.draggedElement.style.height =  rect.height  + "px"
    this.draggedElement.style.left =    mouse.clientPosition.x + "px"
    this.draggedElement.style.top =     mouse.clientPosition.y  + "px"
    this.draggedElement.style.pointerEvents = "none"
    this.draggedElement.style.position = "fixed"
    this.draggedElement.style.zIndex = 100000

    this.draggedElement.dataset.changedstyles = "width height left top pointerEvents position zIndex"
    this.draggedElement.dataset.order = getChildIndex(this.draggedElement)

    document.body.append(this.draggedElement)
    this.state.set("dragging")

    Qa(".inventory-buy-drop-area") .forEach(button => button.classList.add("active"))
  }
  updateDraggedItem(target) {
    let x = +this.draggedElement.style.left.replace("px", "")
    let y = +this.draggedElement.style.top.replace("px", "")
    x += mouse.clientMoved.x
    y += mouse.clientMoved.y
    this.draggedElement.style.left = x + "px"
    this.draggedElement.style.top = y + "px"

    let dropTarget = target.closest("[data-drop]")
    let dropTargetAcceptedClass = dropTarget?.dataset.drop
    let dropTargetMatchesDraggedElementClass = this.draggedElement.classList.contains(dropTargetAcceptedClass)

    if(dropTargetMatchesDraggedElementClass) {
      let targ = target.closest(`.${dropTargetAcceptedClass}`)
      if(!targ) return
      if(targ === this.placeholder) return
      window.clearTimeout(this.placeholderTimeout)

      if(!this.placeholder && (+dropTarget.dataset.inventoryitemcount || 1) < dropTarget.querySelectorAll("div").length) {
        this.createPlaceholderElement(targ)
      }
      else {
        this.removePlaceholderElement()
        this.placeholderTimeout = setTimeout(() => {
          if(this.placeholder) {
            targ.before(this.placeholder)
            let index = getChildIndex(this.placeholder)
            this.placeholder.dataset.index = index
            this.placeholder.style.order = index
          }
        }, 200)
      }
    }
    else {
      window.clearTimeout(this.placeholderTimeout)
      this.removePlaceholderElement()
    }
  }
  endDrag(event) {
    console.log("end drag")
    if(this.state.isnt("dragging")) return

    let target = event.target
    let dropTarget = target.closest("[data-drop]")
    if(!dropTarget) 
      return this.cancelDrag()

    let dropTargetAcceptedClass = dropTarget.dataset.drop
    let matchesClass = this.draggedElement.classList.contains(dropTargetAcceptedClass)

    if(matchesClass) 
      this.confirmDrag(target, dropTarget, dropTargetAcceptedClass)
    else 
      this.cancelDrag()
  }
  confirmDrag(eventTarget, dropTarget, dropTargetAcceptedClass) {
    console.log("confirm drag")

    let hoveredItem = eventTarget.closest(`.${dropTargetAcceptedClass}`)
    
    if(hoveredItem) {
      let index = +hoveredItem.style.order
      this.draggedElement.style.order = index
      this.draggedElement.dataset.order = index
      
      hoveredItem.before(this.draggedElement)
    }
    else {
      dropTarget.append(this.draggedElement)
    }
    
    const areItemsOverflowing = () => {
      let children = Array.from(dropTarget.querySelectorAll("div"))
      let length = children.length
      if(children.findChild(this.placeholder))
        length--
      
      return length > +dropTarget.dataset.inventoryitemcount
    }

    /* this shit removes overflowing items but only if they are an empty item */
    if(dropTarget.dataset.inventorytype === "fixed-size" && areItemsOverflowing()) {
      let empties = Array.from(dropTarget.querySelectorAll(".empty")).reverse()
      empties.forEach(child => {
        if(
          (child.dataset.draggable || child.classList.contains(dropTargetAcceptedClass) || child.classList.contains("empty")) && 
          child !== this.draggedElement &&
          areItemsOverflowing()
        ) {
          child.remove()
        }
      })
    }
    let areMissingItems = Array.from(this.dragParent.querySelectorAll("div")).length < +this.dragParent.dataset.inventoryitemcount
    if(dropTarget !== this.dragParent && areMissingItems) 
      this.dragParent.append(Item.createEmptyItemElement())
      
    /* awful rudimentary item buy code */
    if(dropTarget.dataset.ondrop === "buy" && this.draggedElement.dataset.cansell && this.draggedElement.dataset.isstationware && player.currency >= +this.draggedElement.dataset.buycost) {
      let item = new Item(this.draggedElement.dataset.itemname)

      player.inventory.addItems(item)
      player.currency -= +this.draggedElement.dataset.buycost
      Q("#station-currency-container").innerText = player.currency
      AudioManager.playSFX("cardShimmer")

      let wareCategory = this.draggedElement.dataset.warecategory
      let station = player.ship.dockData.station
      let ware = station.wares[wareCategory].find(ware => ware.name === this.draggedElement.dataset.itemname)
      station.wares[wareCategory].remove(ware)
      station.setStationWares()

      this.draggedElement.remove()
    }

    /* awful rudimentary equip weapon code */
    if(dropTarget.dataset.ondrop === "equip-weapon" && this.draggedElement.dataset.itemtype === "weapon") {
      player.ship.weapons.addWeapon(this.draggedElement.dataset.itemname)
      inventory.refreshInventoryTab()
    }

    this.resetDrag()
  }
  cancelDrag() {
    console.log('cancel drag')

    let placeBeforeIndex
    this.placeholder ? 
    placeBeforeIndex = +this.placeholder.style.order :
    placeBeforeIndex = +this.draggedElement.dataset.order

    this.dragParent.childNodes[placeBeforeIndex] ?
    this.dragParent.childNodes[placeBeforeIndex].before(this.draggedElement) :
    this.dragParent.append(this.draggedElement)

    this.resetDrag()
  }
  resetDrag() {
    /* here do the things to clean up the UI after the dragging operation ended, regardless of its success */
    let changedStyles = this.draggedElement.dataset.changedstyles.split(" ")
    changedStyles.forEach(ch => {
      this.draggedElement.style[ch] = ""
      this.draggedElement.dataset.changedstyles = ""
    })
    Qa('[data-drop]').forEach(drop => drop.style.backgroundColor = drop.dataset.backgroundColor)
    this.removePlaceholderElement()
    this.draggedElement = null
    this.dragParent = null
    this.state.ifrevert("dragging")

    Qa(".inventory-buy-drop-area") .forEach(button => button.classList.remove("active"))
  }
  createPlaceholderElement(target) {
    console.log("create placeholder")

    this.placeholder = target.cloneNode(true)
    this.placeholder.classList.add("placeholder")
    console.log(this.placeholder)
    target.before(this.placeholder)
  }
  removePlaceholderElement() {
    if(!this.placeholder) return

    console.log("remove placeholder")

    this.placeholder.remove()
    this.placeholder = null
  }
  //#endregion
  toggleGameStats() {
    Q(".game-stats").classList.toggle("hidden")
    this.statsVisible = !this.statsVisible
  }
  toggleDevIcons() {
    Qa(".dev-icon").forEach(icon => icon.classList.toggle("hidden"))
  }
  updateStats() {
    if(!this.statsVisible) return
    
    Q('#collision-count').innerText = game.previousCollisions.length
    Q('#zoom-level').innerText = game.camera.currentZoom
    Q("#game-state-view").innerText = game.state.current.capitalize()
    Q("#stage-offset").innerText = "x: " + game.app.stage.position.x.toFixed(0) + " y: " + game.app.stage.position.y.toFixed(0) 
    Q("#fps").innerText = fps.toFixed(0)
  }
  update() {
    this.updateStats()
    this.timers.update()
  }
}

class SVGManager {
  static loadShipSVG(shipName, appendTo) {
    let svg = SVGEl("svg", "ship-svg")
    svg.dataset.src = "assets/svg/" + shipName + ".svg"
    setTimeout(() => this.processShipSVG(svg), 100)
    appendTo.append(svg)
  }
  static processShipSVG(svg, attemptNumber = 0) {
    if(svg.childElementCount === 0) {
      setTimeout(() => this.processShipSVG(svg, ++attemptNumber), 100)
      return
    }
    if(attemptNumber > 10) {
      console.warn("taking too long to load svg, maybe it's empty")
    }

    svg.querySelector("title")?.remove()

    let 
    paths = Array.from(svg.querySelectorAll("path"))
    paths = paths.concat(
      Array.from(svg.querySelectorAll("polyline")), 
      Array.from(svg.querySelectorAll("line"))
    )

    paths.forEach(path => {
      path.style.stroke = "#555555"
    })
    let circles = Array.from(svg.querySelectorAll("circle"))
    circles.forEach(circle => {
      circle.style.opacity = 1.0
      circle.style.strokeOpacity = "0.0"
      circle.style.stroke = "#FFFFFF"
      circle.style.strokeWidth = 2
      circle.style.fillOpacity = "0.2"
      circle.style.cursor = "var(--cursor-pointer)"

      circle.classList.add('tooltip')
      circle.dataset.delay = "0"
    
      let hex = rgbToHex(circle.style.fill).toLocaleUpperCase()

      if(hex === "#8FB2FF") {
        circle.dataset.tooltip = "Cargo"
        circle.dataset.tooltipdescription = "Your ship's cargo capacity. Each item you acquire takes up one slot, regardless of weight, because this is a videogame."
      }
      if(hex === "#FFA515") {
        circle.dataset.tooltip = "Engines"
        circle.dataset.tooltipdescription = "Engines determine your maximum speed, how fast you can rotate and how fast you accelerate."
      }
      if(hex === "#35A82C") {
        circle.dataset.tooltip = "Boosters"
        circle.dataset.tooltipdescription = "Special type of engine that allows you to drift sideways."
      }
      if(hex === "#8E1720") {
        circle.dataset.tooltip = "Brakes"
        circle.dataset.tooltipdescription = "Live fast and die young. You don't need brakes."
      }
      if(hex === "#D14622") {
        circle.dataset.tooltip = "Weapons"
        circle.dataset.tooltipdescription = "The weapon system itself. It cannot be upgraded, and it also shouldn't even appear here."
      }
      if(hex === "#3162FF") {
        circle.dataset.tooltip = "Shields"
        circle.dataset.tooltipdescription = `A protective mechanism against projectiles or environmental hazards. There are 4 types: pulse, hard-light, force and bubble.`
      }
      if(hex === "#FCF683") {
        circle.dataset.tooltip = "Hull"
        circle.dataset.tooltipdescription = "The metal carapace often referred to as 'hull' is like the shell of a hermit crab. Without it, the crab will die soon, probably."
      }
      if(hex === "#873EE5") {
        circle.dataset.tooltip = "Stealth"
        circle.dataset.tooltipdescription = "A small module that turns your ship invisible, sort of."
      }
      if(hex === "#FF5959") {
        circle.dataset.tooltip = "Weapon slot 1"
        circle.dataset.tooltipdescription = ""
      }
      if(hex === "#BC1D1D") {
        circle.dataset.tooltip = "Weapon slot 2"
        circle.dataset.tooltipdescription = ""
      }
      if(hex === "#961515") {
        circle.dataset.tooltip = "Weapon slot 3"
        circle.dataset.tooltipdescription = ""
      }
      if(hex === "#7A0C0C") {
        circle.dataset.tooltip = "Weapon slot 4"
        circle.dataset.tooltipdescription = ""
      }

      if(circle.dataset.tooltip.includes("Weapon"))
        circle.dataset.tooltipdescription = "A slot for a weapon. Your ship has a limited number of slots and more cannot be purchased. This was done for balancing."
      circle.dataset.tooltipdescription += "\n \n Click to view system details."

      circle.style.fill = "#FFFFFF"

      circle.onmouseenter = () => {
        if(circle.dataset.tooltip === "Hull") {
          paths.forEach(path => {
            path.style.stroke = "#999999"
          })
        }
        circle.style.fillOpacity = "0.5"
        circle.style.strokeOpacity = "1.0"

      }
      circle.onmouseleave = () => {
        if(circle.dataset.tooltip === "Hull") {
          paths.forEach(path => {
            path.style.stroke = "#555555"
          })
        }
        circle.style.fillOpacity = "0.2"
        circle.style.strokeOpacity = "0.0"
      }
    })
  }
}
class Logger {
  static active = false
  static log(message) {
    if(this.active)
      console.log(message)
  }
  static error(message) {
    if(this.active)
      console.error(message)
  }
}
class SpritePreprocessor {
  static jobs = 0
  static beginJobTracking(callback) {
    this.callAfterJobTrackingFinished = callback
    this.isTrackingJobs = true
  }
  static stopJobTracking() {
    this.isTrackingJobs = false
  }
  static finishJobTracking() {
    console.log("Finished job tracking, total amount:" , this.jobs)
    this.isTrackingJobs = false
    if(this.jobs !== 0)
      throw "error"
    this.callAfterJobTrackingFinished()
  }
  static incrementJobCount() {
    console.log("Job added")
    this.jobs++
  }
  static decrementJobCount() {
    this.jobs--
    if(this.jobs === 0)
      this.finishJobTracking()
    if(this.jobs < 0)
      throw "error"
  }
  static async applyFilterToImage(imageSource, filter = {intensity: 0.5, hue: 296, saturationShift: 1.5}) {
    if(this.isTrackingJobs)
      this.incrementJobCount()
    
    let canvas = document.createElement("canvas")
    let ctx = canvas.getContext("2d")
    
    let image = new Image(); image.src = imageSource
    await image.decode()

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    //draw the base image with altered saturation
    ctx.filter = `saturate(${filter.saturationShift}`
    ctx.drawImage(image, 0, 0)

    //draw an overlay that colors the image
    ctx.filter = ""
    ctx.globalCompositeOperation = "hue"
    ctx.globalAlpha = filter.intensity
    ctx.fillStyle = `hsl(${filter.hue}, 100%, 50%)`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    //restore the alpha channel to match the original image
    ctx.filter = ""
    ctx.globalAlpha = 1.0
    ctx.globalCompositeOperation = "destination-in"
    ctx.drawImage(image, 0, 0)

    let processedImage = new Image(); 
        processedImage.src = canvas.toDataURL()

    if(this.isTrackingJobs)
      this.decrementJobCount()

    return processedImage
  }
  static prefilterImages() {
    this.processedImages.push()
  }
  static processedImages = []
}
class CreditScreen extends GameWindow {
  constructor() {
    super("CreditScreen", Q("#credit-screen"))
  }
}
class LoadingScreen extends GameWindow {
  constructor() {
    super("LoadingScreen", Q("#loading-screen"))
  }
  hide() {
    if(!this.visible) return

    this.element.animate([
      {filter: "opacity(1)"}, 
      {filter: "opacity(0)"},
    ], {
      duration: 1800,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    })
    .onfinish = () => {
      this.element.classList.add("hidden")
      this.visible = false
    }
  }
  setBackground(locationName) {
    Q("#loading-screen-background").src = `assets/loadingScreen/${locationName}.png`
  }
}
const binds = {
  rotateCW:           "KeyD",
  rotateCCW:          "KeyA",
  accel:              "KeyW",
  decel:              "KeyS",
  toggleAutobrake:    "KeyB",
  activateShields:    "KeyF",
  activateStealth:    "KeyT",
  dismissHint:        "KeyH",
  dockShip:           "KeyG",
  openStationMenu:    "KeyV",
  openInventory:      "KeyI",
  openWorldMap:       "KeyM",
  openMap:            "KeyN",
  interact:           "KeyE",
  scrapDebris:        "KeyC",
  beginCoating:       "KeyQ",
  armWeapons:         "KeyX",
  boosters:           "Space",
  cancel:             "Escape",
  confirm:            "Enter",
  acceptDialogue:     "KeyZ",
  declineDialogue:    "KeyU",
  openDialogueScreen: "KeyO",
  pause:              "KeyP",
  skipCutscene:       "Escape",
  replayPage:         "KeyR",
  devIcons:           "Backquote",
  selectWeapon0:      "Digit1",
  selectWeapon1:      "Digit2",
  selectWeapon2:      "Digit3",
  selectWeapon3:      "Digit4",
  navMesh:            "Digit5",
  gameStats:          "Digit6",
  hitbox:             "Digit7",
  zoomIn:             "Digit8",
  zoomOut:            "Digit9",
  resetZoom:          "Digit0",
  forwardSequence:    "Space",
  /* modifiers */
  shift:              "ShiftLeft",
  shiftRight:         "ShiftRight",
  ctrl:               "ControlLeft",
  ctrlRight:          "ControlRight",
  alt:                "alt",
}
class Mouse {
  constructor() {
    this.worldPosition            = new Vector()
    this.hitboxEditorPosition     = new Vector()
    this.locationEditorPosition   = new Vector()
    this.clientClickOrigin        = new Vector()
    this.clientClickEnd           = new Vector()
    this.mapPosition              = new Vector()
    this.clientPosition           = new Vector()
    this.clientPositionPrev       = new Vector()
    this.clientMoved              = new Vector()
    this.hitboxEditorMoved        = new Vector()
    this.locationEditorMoved      = new Vector()
    this.mapMoved                 = new Vector()
    this.target = null
    this.clickTarget = null
    this.travelled = 0
    this.pressure = 1
    this.shipAngle = 0
    this.keys = {
      left: false,
      middle: false,
      right: false,
    }
  }
  //#region 
  handleInput(event) {
    this.updateKeys(event)
    switch(event.type) {
      case "pointerdown"  : {this.handlePointerdown(event); break;}
      case "mousedown"    : {this.handleMousedown(event); break;}
      case "mousemove"    : {this.handleMousemove(event); break;}
      case "pointermove"  : {this.handlePointermove(event); break;}
      case "mouseup"      : {this.handleMouseup(event); break;}
      case "click"        : {this.handleClick(event); break;}
      case "wheel"        : {this.handleWheel(event); break;}
    }
    this.target = event.target
  }
  updateKeys(event) {
    if(event.type === "mousedown") {
      if(event.button === 0) this.keys.left = true
      if(event.button === 1) this.keys.middle = true
      if(event.button === 2) this.keys.right = true
    }
    if(event.type === "mouseup") {
      if(event.button === 0) this.keys.left = false
      if(event.button === 1) this.keys.middle = false
      if(event.button === 2) this.keys.right = false
    }
  }
  handlePointerdown(event) {
    this.updatePressure(event)
  }
  handleMousedown(event) {
    this.updatePressure(event)
    this.clientClickOrigin.set(event.clientX, event.clientY)
    this.clickTarget = event.target
  }
  handleMousemove(event) {
    this.updateClientPosition(event)
    this.updateTravelledDistance(event)
    this.updateWorldPosition()
  }
  handlePointermove(event) {
    this.updatePressure(event)
  }
  handleMouseup(event) {
    this.clientClickEnd.set(event.clientX, event.clientY)
  }
  handleClick(event) {

  }
  handleWheel(event) {

  }
  //#endregion
  updateShipAngle() {
    // this.shipAngle = Math.atan2(this.worldPosition.y - player.ship.transform.position.y, this.worldPosition.x - player.ship.transform.position.x)
    this.shipAngle = player.ship.transform.position.angleTo(this.worldPosition)
  }
  updateClientPosition(e) {
    this.clientPositionPrev.x = this.clientPosition.x
    this.clientPositionPrev.y = this.clientPosition.y

    this.clientPosition.x = e.clientX
    this.clientPosition.y = e.clientY
    
    this.clientMoved.x = this.clientPosition.x - this.clientPositionPrev.x
    this.clientMoved.y = this.clientPosition.y - this.clientPositionPrev.y

    this.hitboxEditorMoved    .setFrom(this.clientMoved)  .mult(hitboxEditor.camera.currentZoom)
    this.locationEditorMoved  .setFrom(this.clientMoved)  .mult(locationEditor.camera.currentZoom)
    this.mapMoved             .setFrom(this.clientMoved)  .mult(map.camera.currentZoom)
  }
  updateTravelledDistance() {
    if(this.keys.left) 
      this.travelled += this.clientMoved.length()
    else 
      this.travelled = 0
  }
  updatePressure(e) {
    if(e.pointerType !== "pen") return
    this.pressure = e.pressure
  }
  updateWorldPosition() {
    this.updateWorldPositionFor(locationEditor, this.locationEditorPosition)
    this.updateWorldPositionFor(hitboxEditor, this.hitboxEditorPosition)
    this.updateWorldPositionFor(map, this.mapPosition)
    this.updateWorldPositionFor(game, this.worldPosition)
  }
  updateWorldPositionFor(world, position) {
    position.x = Math.round((this.clientPosition.x - cw/2 + (world.camera.transform.position.x / world.camera.currentZoom)) * world.camera.currentZoom)
    position.y = Math.round((this.clientPosition.y - ch/2 + (world.camera.transform.position.y / world.camera.currentZoom)) * world.camera.currentZoom)
  }
}
const keys = {}
for(let key in binds)
  keys[key] = false

function updateKeys(event) {
  if(event.type !== "keyup" && event.type !== "keydown") return

  let bindKeys = Object.keys(binds)
  for (let i = 0; i < bindKeys.length; i++) {
    if(event.code === binds[bindKeys[i]] && event.type === "keyup") {
      keys[bindKeys[i]] = false
    }
    if(event.code === binds[bindKeys[i]] && event.type === "keydown") {
      keys[bindKeys[i]] = true
    }
  }

  if(event.altKey) 
    keys.alt = true
  else 
    keys.alt = false
}

function attachListeners() {
  document.addEventListener("contextmenu", function(e) {
    e.preventDefault()
  })
  document.addEventListener("keydown", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("keyup", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("mousemove", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("pointermove", function(e) {
    handleGlobalInput(e)
  })
  document.addEventListener("mousedown", function (e) {
    if(e.button === 1) 
      e.preventDefault()
    handleGlobalInput(e)
  })
  document.addEventListener("mouseup", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("click", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("wheel", function (e) {
    handleGlobalInput(e)
  })
  document.addEventListener("pointerdown", function (e) {
    handleGlobalInput(e)
  })
}

function handleGlobalInput(e) {
  updateKeys(e)
  gameManager.handleInput(e)
}
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

class Inventory {
  constructor(capacity, options = {itemContainerId: null}) {
    this.items = []
    this.capacity = capacity ?? 30
    this.id = uniqueIDString()

    if(options.itemContainerId) {
      this.assignContainer(options.itemContainerId)
      this.updateContainer()
    }
  }
  assignContainer(containerId) {
    this.containerId = containerId
  }
  removeItems(...items) {
    items.forEach(i => this.items.remove(i))
  }
  addItems(...items) {
    for(let item of items) {
      if(this.isFull) break
      if(!(item instanceof Item)) throw "only input Item class instances"
      this.items.push(item)
    }
  }
  findItemByName(name) {
    return this.items.find(i => i.name === name) || null
  }
  get isFull() {
    return this.items.length === this.capacity
  }
  //#region HTML part
  updateContainer() {
    Q(`#${this.containerId}`).innerHTML = ""
    let items = []

    for(let i = 0; i < this.capacity; i++)
      if(this.items[i])
        items.push(Item.createItemElement(data.item[this.items[i].name], {enableDrag: true, smallItem: false}))
      else
        items.push(Item.createEmptyItemElement({smallItem: false}))
    
    this.itemElements = [...items]
    Q(`#${this.containerId}`).append(...items)
    Q(`#${this.containerId}`).dataset.inventoryid = this.id
  }
  refillWithEmpty() {
    
  }
  //#endregion
}
class InventoryWindow extends GameWindow {
  constructor() {
    super("InventoryWindow", Q('#inventory-window'))

    this.inventoryTab = Q("#inventory-inventory-tab")
    this.stationTab =   Q("#inventory-station-tab")
    this.questTab =     Q("#inventory-quest-tab")
    this.inventoryTabs = [this.inventoryTab, this.stationTab, this.questTab]

    this.cargoInventoryGrid = Q("#cargo-inventory-grid-6-columns")
  
    this.viewInventoryTab("station")
    this.createStationSellInventories()
  }
  show() {
    this.element.classList.remove("hidden")

    if(this.currentTabName === "station" && player?.ship?.state.isnt("docked"))
      this.viewInventoryTab("inventory")
    
    gameUI.beginUIHintSequence("inventory")
  }
  hide() {
    this.element.classList.add("hidden")
    gameUI.finishUISequence()
  }
  createStationSellInventories() {
    let categories = ["weapons", "systems", "misc"]
    for(let category of categories) {
      let itemContainerId = `station-row-items-${category}`
      let capacity = +Q(`#${itemContainerId}`).dataset.inventoryitemcount
      this["stationInventory" + category.capitalize()] = new Inventory(capacity, {itemContainerId})
    }
  }
  viewInventoryTab(which) {
    if(which === "station" && player?.ship?.state.isnt("docked")) return

    this.inventoryTabs.forEach(t => t.classList.add("hidden"))
    this[which + "Tab"].classList.remove("hidden")

    /* set the right window label */
    Qa(".station-window-label").forEach(label => label.classList.add("hidden"))
    this.element.querySelector(`.station-window-label.${which}`)  ?.classList.remove("hidden")
    
    this.element.querySelector(".station-switch-icon.active")     ?.classList.remove("active")
    this.element.querySelector(`.station-switch-icon.${which}`)   .classList.add("active")
    this.element.querySelector(`*[data-tab='${which}']`)          .classList.add("active")

    this[`viewInventoryTab${which.capitalize()}`]()
    this.currentTabName = which
  }
  viewInventoryTabStation() {
    Q("#station-currency-container").innerText = player?.currency
  }
  viewInventoryTabInventory() {
    this.refreshInventoryTab()
  }
  viewInventoryTabQuest() {
    
  }
  enableStationTab() {
    Q("#inventory-switch-station").classList.remove("disabled")
    Q("#inventory-switch-station").classList.remove("tooltip")
  }
  disableStationTab() {
    Q("#inventory-switch-station").classList.add("disabled")
    Q("#inventory-switch-station").classList.add("tooltip")
  }
  fillCargoWithEmptyItems() {
    for(let i = 0; i < 6 * 6; i++) {
      this.cargoInventoryGrid.append(Item.emptyItemElement())
    }
  }
  refreshInventoryTab() {
    player.inventory.assignContainer("player-inventory-grid")
    player.inventory.updateContainer()

    /* update ship weapon slots */
    Qa(".ship-weapon-slot-wrapper .ship-inventory-weapon-slot").forEach((slot, index) => {
      slot.innerHTML = ""

      let item
      if(player.ship.weapons.weapons[index]) {
        let itemData = data.item[player.ship.weapons.weapons[index].name]
        item = Item.createItemElement(itemData, {enableDrag: true})

        /* if the weapon is equipped, remove its item from the player inventory grid */
        let duplicateItemInGrid = Q(`#${player.inventory.containerId} .inventory-item[data-itemname='${itemData.name}']`)
        if(duplicateItemInGrid) {
          duplicateItemInGrid.remove()
          Q(`#${player.inventory.containerId}`).append(Item.createEmptyItemElement())
        }

      }
      else {
        item = Item.createEmptyItemElement()
      }
      
      slot.append(item)
    })
  }
  //#region input
  handleKeydown(event) {
    if(event.code === binds.openInventory)
      gameManager.closeWindow()
    if(event.code === binds.openStationMenu)
      gameManager.closeWindow()
  }
  handleMousedown(event) {
    switch(event.button) {
      case 0: {this.handleLeftDown(event);   break}
      case 1: {this.handleMiddleDown(event); break}
      case 2: {this.handleRightDown(event);  break}
    }
  }
  handleLeftDown(event) {
    
  }
  handleMiddleDown(event) {
    
  }
  handleRightDown(event) {
    
  }
  //#endregion
}
class Item {
  constructor(name) {
    this.name = name
  }
  static createItemElement(itemData, options = {enableDrag: false, smallItem: false}) {
    let 
    item = El("div", "inventory-item tooltip")
    item.dataset.tooltipdescription = itemData.description
    item.dataset.tooltip =            itemData.title
    item.dataset.itemname =           itemData.name
    item.dataset.itemtype =           itemData.itemType ?? "regular"
    item.dataset.tooltiptype =        itemData.itemType || "item"
    item.dataset.playsfx =            ""
    item.dataset.sounds =             "buttonNoAction"
    item.dataset.playonevents =       "mouseover"
    item.dataset.volumes =            "0.15"
    item.dataset.cansell =            boolToString(itemData.flags.canSell)
    item.dataset.buycost =            itemData.buyCost

    let 
    img = new Image()
    img.src = `assets/${itemData.folder ?? "item"}/${itemData.thumbnail}.png`
    
    if(options.enableDrag)
      item.dataset.draggable = "true"
    if(options.smallItem)
      item.classList.add("small")

    item.append(img)
    return item
  }
  static createEmptyItemElement(options = {smallItem: false}) {
    let item = El("div", "inventory-item empty")
    let img = new Image()
    options.smallItem ? img.src = "assets/item/emptySmall.png" : img.src = "assets/item/empty.png"
    item.append(img)
    return item
  }
  static registerItemsFromWeapons() {
    for(let name in data.weapon) {
      this.registerItemDataFromWeapon(name, data.weapon[name])
    }
  }
  static registerItemDataFromWeapon(name, weaponRef) {
    data.item[name] = {
      name: name,
      itemType: "weapon",
      title: weaponRef.displayName,
      description: weaponRef.description,
      thumbnail: name,
      buyCost: weaponRef.buyCost,
      folder: "weapon",
      flags: {canSell: true, questItem: false, canSellOnBlackMarket: true}
    }
  }
}
class ReceivedItemModal extends GameWindow {
  constructor() {
    super("ReceivedItemModal", Q('#received-item-modal'))
    this.itemContainer = this.element.querySelector(".item-container")
  }
  show() {
    if(this.visible) return
    AudioManager.playSFX("receivedItem")
    this.element.classList.remove("hidden")
    this.element.animate([
      {filter: "opacity(0)", transform: "scale(0.9)"},
      {filter: "opacity(1)", transform: "scale(1.0)"},
    ], {
      duration: 1000,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    }).onfinish = () => this.visible = true
  }
  hide() {
    if(!this.visible) return
    this.element.animate([
      {filter: "opacity(1)", transform: "scale(1.0)"},
      {filter: "opacity(0)", transform: "scale(0.92)"},
    ], {
      duration: 1000,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    })
    .onfinish = () => {
      this.element.classList.add("hidden")
      this.onClose()
      this.visible = false
    }
  }
  onClose() {
    //empty method that can be used to attach handlers to the closing of this window
  }
  setItems(...items) {
    if(items.find(i => (i instanceof Item) == false)) throw "only accept instances of Item class"

    this.itemContainer.innerHTML = ""
    items.forEach(item => {
      this.itemContainer.append(Item.createItemElement(data.item[item.name]))
    })
  }
}
class AudioManager {
  static musicVolume = 1
  static SFXVolume = 1
  static ready = false

  static currentSoundSourceElement = null
  static currentSoundEvent = null
  static SFXList = {}
  static musicList = {}

  static SFXAudioClips = {}
  static musicAudioClips = {}
  static SFXGainNodes = {}
  static musicGainNodes = {}

  static audioEmitters = []

  static totalRegularAudio = 0
  static totalRegularAudioLoaded = 0

  static ctx = new (AudioContext || webkitAudioContext)()

  static prime() {
    document.addEventListener("click", this.primeListener, false)
  }
  static primeListener = (e) => {
    this.setup()
    document.removeEventListener("click", this.primeListener)
  }
  static setup() {
    document.addEventListener("mouseover",  this.playSFXOnMouse.bind(this), false)
    document.addEventListener("mouseout",   this.playSFXOnMouse.bind(this), false)
    document.addEventListener("mousedown",  this.playSFXOnMouse.bind(this), false)
    this.update()
    this.playLoopedAudio("music", "mainTheme", 0.8)
  }
  //#region sound loading
  static loadSounds() {
    for(let category in sources.audio) {
      for(let sound of sources.audio[category]) {
        this.loadSound(category, sound)
        this.totalRegularAudio++
      }
    }
  }
  static loadSound(category, name) {
    let audioName = name.split(" ")[0]
    let isLooped = name.includes("loop") ? true : false

    if(isLooped)
      this.loadLoopedAudio(category, audioName)
    else
      this.loadRegularAudio(category, audioName)
  }
  static loadRegularAudio(category, audioName) {
    let 
    audio = new Audio()
    audio.src = `audio/${category}/${audioName}.ogg`
    audio.oncanplaythrough = () => {
      this[category + "List"][audioName] = audio
      this.updateLoadProgress(category + audioName)
      audio.oncanplaythrough = () => {}
    }
  }
  static loadLoopedAudio(category, audioName) {
    this[category + "AudioClips"][audioName] = new LoopedAudioClip(
      `audio/${category}/${audioName}.ogg`,
      audioName,
    )
  }
  static getMissingAudioNames() {
    
  }
  static updateLoadProgress(identifier) {
    this.totalRegularAudioLoaded++
    Logger.log(identifier)
    if(this.totalRegularAudio === this.totalRegularAudioLoaded) {
      this.ready = true
      console.log("Regular audio loaded.", this.totalRegularAudioLoaded + " / " + this.totalRegularAudio)
    }
  }
  //#endregion
  //#region play audio methods
  static playSFX(name, volume = 1) {
    if(!this.SFXList[name]) return
    this.SFXList[name].volume = clamp(volume, 0, 1) * this.SFXVolume
    this.SFXList[name].currentTime = 0
    this.SFXList[name].play()
  }
  static playMusic(name, volume = 1) {
    if(!this.musicList[name]) return
    this.musicList[name].volume = clamp(volume, 0, 1) * this.musicVolume
    this.musicList[name].currentTime = 0
    this.musicList[name].play()
  }
  static stopSFX(name) {
    if(!this.SFXList[name]) return
    this.SFXList[name].pause()    
  }
  static stopMusic(name) {
    if(!this.musicList[name]) return
    this.musicList[name].pause()    
  }
  static playSFXOnMouse(e) {
    let soundTarget = e.target.closest("*[data-playsfx]")
    if(!this.currentSoundSourceElement?.contains(e.target))
      this.currentSoundSourceElement = null

    if(!soundTarget) return

    let playOnEvents = soundTarget.dataset.playonevents.split(" ")
    let sounds = soundTarget.dataset.sounds.split(" ")
    let volumes = soundTarget.dataset.volumes?.split(" ") ?? playOnEvents.map(ev => 1)
    let soundIndex = playOnEvents.indexOf(e.type)
    let soundName = sounds[soundIndex]
    let volume = volumes[soundIndex]

    /* check if the event type is found on the element dataset */
    let elementMatchesEventType = false
    for(let eventType of playOnEvents)
      if(eventType === e.type)
        elementMatchesEventType = true
    if(!elementMatchesEventType) return

    if(
      soundTarget === this.currentSoundSourceElement &&
      this.currentSoundEvent === e.type &&
      e.type !== "mousedown"
    ) return

    this.currentSoundSourceElement = soundTarget
    this.currentSoundEvent = e.type
    this["playSFXOn" + e.type.capitalize()](soundName, volume, e)
  }
  static playSFXOnMouseover(soundName, volume, event) {
    this.playSFX(soundName, volume)
  }
  static playSFXOnMouseout(soundName, volume, event) {
    this.playSFX(soundName, volume)
  }
  static playSFXOnMousedown(soundName, volume, event) {
    this.playSFX(soundName, volume)
  }
  static playLoopedAudio(category, name, volume = 1) {
    let isMusicPlaying
    for(let key in this.musicAudioClips)
      if(this.musicAudioClips[key].playing)
        isMusicPlaying = true

    if(category === "music" && isMusicPlaying)
      for(let key in this.musicAudioClips)
        if(this.musicAudioClips[key].playing)
          this.musicAudioClips[key].fadeOut(4500)
    
    this[category + "AudioClips"][name].start()

    if(category === "music" && isMusicPlaying) {
      this[category + "AudioClips"][name].setVolume(0)
      setTimeout(() => this[category + "AudioClips"][name].fadeIn(6000, volume), 500)
    }
    else {
      this[category + "AudioClips"][name].setVolume(volume)
    }
  }
  static stopLoopedAudio(category, name) {
    this[category + "AudioClips"][name].stop()
  }
  static dimMusic(toVolume) {
    for(let key in this.musicAudioClips)
      if(this.musicAudioClips[key].playing)
        this.musicAudioClips[key].fadeTo(3500, toVolume)
  }
  static restoreMusic() {
    for(let key in this.musicAudioClips)
      if(this.musicAudioClips[key].playing)
        this.musicAudioClips[key].fadeTo(3500, this.musicAudioClips[key].previousVolume)
  }
  //#region an attempt to do audio layers - not functional
  static audioLayers = [
    {
      sourceNode: null,
      volume: 1
    }
  ]
  //#endregion
  static audioLastTime = 0
  static update() {
    /* set audio delta time */
    let now = Date.now()
    adt = (now - this.audioLastTime) / 1000
    this.audioLastTime = now

    for(let key in this.musicAudioClips)
      this.musicAudioClips[key].update()
    
    window.requestAnimationFrame(this.update.bind(this))
  }
}
class LoopedAudioClip {
  constructor(src, name) {
    this.src = src
    this.name = name
    this.audioNode = null
    this.audioBuffer = null
    this.gainNode = null
    this.playing = false
    this.loaded = false
    this.volume = 1
    this.previousVolume = null
    this.fadeData = {
      from: 0,
      to: 1,
    }
    this.setup()
  }
  setup() {
    this.gainNode = AudioManager.ctx.createGain()
    this.gainNode.connect(AudioManager.ctx.destination)
    this.fetchSourceData()
    this.createAudioNode()
    this.timers = new Timer(
      ["fadeTick", 1000, {loop: false, active: false, onfinish: this.fadeEnd.bind(this)}]
    )
    this.timers.setToAudioDelta()
  }
  onload() {

  }
  fetchSourceData() {
    fetch(this.src, {mode: "cors"})
    .then(function(resp) {return resp.arrayBuffer()})
    .then(this.decodeAudioData.bind(this));
  }
  decodeAudioData(buffer) {
    AudioManager.ctx.decodeAudioData(buffer, this.setAudioBuffer.bind(this));
  }
  setAudioBuffer(audioBuffer) {
    this.audioBuffer = audioBuffer
    this.loaded = true
    this.onload()
    this.createAudioNode()
  }
  createAudioNode() {
    this.audioNode = AudioManager.ctx.createBufferSource()
    this.audioNode.buffer = this.audioBuffer
    this.audioNode.connect(this.gainNode)
    this.audioNode.loop = true
  }
  start() {
    if(!this.loaded) return
    if(this.playing) return
    this.createAudioNode()
    this.audioNode.start()
    this.playing = true
  }
  stop() {
    if(!this.loaded) return
    if(!this.playing) return
    this.audioNode.disconnect()
    this.audioNode.stop()
    this.audioNode = null
    this.playing = false
  }
  fadeIn(duration, volume = 1) {
    this.previousVolume = this.volume
    this.fadeStart(0, volume, duration)
  }
  fadeOut(duration) {
    this.fadeStart(this.volume, 0, duration)
  }
  fadeTo(duration, volume) {
    this.previousVolume = this.volume
    this.fadeStart(this.volume, volume, duration)
  }
  fadeStart(from, to, duration) {
    this.fadeData.from = from
    this.fadeData.to = to
    this.timers.fadeTick.duration = duration
    this.timers.fadeTick.start()
  }
  fadeEnd() {
    if(this.volume < 0.25) this.stop() //this basically
  }
  fadeTick() {
    this.setVolume(
      Ease.Linear(this.timers.fadeTick.currentTime, this.fadeData.from, this.fadeData.to - this.fadeData.from, this.timers.fadeTick.duration)
    )
  }
  setVolume(volume) {
    this.volume = clamp(volume, 0, 1)
    this.gainNode.gain.setValueAtTime(this.volume * AudioManager.musicVolume, AudioManager.ctx.currentTime)
  }
  update() {
    this.timers.update()
    if(this.timers.fadeTick.active)
      this.fadeTick()
  }
}
const grid = {
  cellSize: 64,
  origin: new Vector(0),
  texture: PIXI.Texture.from("assets/gridCell.png"),
}
const navMeshGrid = {
  cellSize: 512,
  origin: new Vector(0),
  texture: PIXI.Texture.from("assets/navMeshGridCell.png"),
}
const mapGrid = {
  texture: PIXI.Texture.from("assets/mapGrid.png")
}
function tick(deltaFactor) {
  setDelta(deltaFactor)
  //#region update
  mouse.updateShipAngle()
  mouse.updateWorldPosition()
  filterManager.update()
  gameManager.update()
  gameManager.windows.forEach(win => {
    if(win.graphics) {
      win.graphics.clear()
      win.graphics.alpha = 1.0
    }
    if(win instanceof GameWorldWindow && gameManager.activeWindow === win) {
      win.updateGameObjects()
      win.updateGridSprite()
      win.updateFog()
    }
    win.update()
  })
  //#endregion

  //#region interact
  collisionChecksPerFrame = 0
  broadphaseCallsPerFrame = 0
  if(gameManager.activeWindow === game)
    Collision.detect(game)
  if(locationEditor.useCollision)
    Collision.detect(locationEditor)
  //#endregion
}

function setDelta(deltaFactor) {
  dt = game.app.ticker.deltaMS / 1000
  if(dt > 500) 
    dt = 0
  dtf = deltaFactor
  fps = 1000 / game.app.ticker.deltaMS
}

let collisionChecksPerFrame = 0
let broadphaseCallsPerFrame = 0
class Game extends GameWorldWindow {
  constructor() {
    super("Game", Q("#game"))
    this.app.view.style.pointerEvents = "none"
    this.gridSprite = new PIXI.TilingSprite(grid.texture, cw + grid.cellSize*2, ch + grid.cellSize*2)
    this.state = new State(
      "default",
      "explore",
      "battle",
      "dialogue",
      "mapOpen",
      "loadingLocation",
    )
    this.availableInteraction = null
    this.localMapOpen = false
    this.createVignette()
    this.setupMinimap()
    this.modifyLayers()
    this.location = null
    this.locations = []
    this.timers = new Timer(
      ["spawnFgObjects", 2000, {loop: true, active: true, onfinish: this.spawnFgObjects.bind(this)}]
    )
  }
  setBoundsOnCamera(bounds) {
    this.camera.bounds = bounds ?? this.camera.bounds
    this.camera.zoomRange = [0.25, 5]
    this.camera.zoom.duration = 1600
    this.camera.currentZoom = 1.25
    this.camera.baseZoom = 1.25
  }
  modifyLayers() {
    let filter1 = new PIXI.filters.ColorMatrixFilter()
        filter1.brightness(1)
    let filter2 = new PIXI.filters.ColorMatrixFilter()
        filter2.brightness(0.9)
    let filter3 = new PIXI.filters.ColorMatrixFilter()
        filter3.brightness(0.85)
    let filter4 = new PIXI.filters.ColorMatrixFilter()
        filter4.brightness(0.80)
    let filterFG = new PIXI.filters.ColorMatrixFilter()
        filterFG.brightness(0.75)

    this.layers.background.filters =  [filter1]
    this.layers.background2.filters = [filter2]
    this.layers.background3.filters = [filter3]
    this.layers.background4.filters = [filter4]
    
    this.layers.foreground.filters =  [filterFG]
    this.layers.foreground2.filters = [filterFG]
    this.layers.foreground3.filters = [filterFG]
  }
  setupMinimap() {
    let minimapCSSRule = 
    Array.from(
      Array.from(document.styleSheets)
      .find(sheet => sheet.href.includes("gameOverlays")).cssRules
    ).find(rule => rule.cssText.includes("#minimap"))

    let width =       +minimapCSSRule.style.width.replaceAll("px", "") - 4
    let height =      +minimapCSSRule.style.height.replaceAll("px", "") - 4
    this.minimap =    Q("#minimap")
    this.minimapApp = new PIXI.Application({width, height, backgroundColor: 0x1b1d1f})
    this.minimap.append(this.minimapApp.view)
    this.minimap.dimensions = {width, height}
    this.minimapApp.view.id = "minimap-canvas"
  }
  toggleLocalMap() {
    this.localMapOpen ? this.hideLocalMap() : this.showLocalMap()
  }
  showLocalMap() {
    let panel = Q("#local-map-background-panel")
    let map = Q("#local-map")
    let rect = panel.getBoundingClientRect()

    map.classList.remove("hidden")
    panel.append(this.minimapApp.view)

    this.minimapApp.view.classList.add("big")
    this.minimapApp.resizeTo = panel
    this.localMapOpen = true
  }
  hideLocalMap() {
    Q("#local-map").classList.add("hidden")
    this.minimap.append(this.minimapApp.view)
    this.minimapApp.view.classList.remove("big")
    this.minimapApp.resizeTo = this.minimap
    this.minimapApp.view.width -= 4
    this.minimapApp.view.height -= 4
    this.localMapOpen = false  
    this.minimapApp.stage.scale.set(1)
    this.gameObjects.gameObject.forEach(obj => obj.sprite?.minimapIcon?.scale.set(1))
  }
  //#region input
  handleInput(event) {
    this.handleInputExceptionCases(event)
    if(!this.localMapOpen)
      player.handleInput(event)
    this["handle" + event.type.capitalize()](event)
  }
  handleInputExceptionCases(event) {
    //this prevents shooting and interacting with hints when you click on UI things and not canvas
    if(event.type === "mousedown" && event.target !== this.element) return 
    
    if(!keys.shift && !keys.shiftRight && !keys.ctrl && !keys.ctrlRight && !this.localMapOpen) {
      if(player.ship.weapons)
        player.ship.weapons.activeWeapon?.handleInput(event)
    }
    if(player.ship.shields)
      player.ship.shields.handleInput(event)
    
    this.gameObjects.hintGraphic.forEach(graphic => graphic.handleInput(event))
  }
  handleKeydown(event) {    
    if(event.code === binds.zoomIn)             this.camera.zoomInit("in")
    if(event.code === binds.zoomOut)            this.camera.zoomInit("out")
    if(event.code === binds.resetZoom)          this.camera.resetZoom()
    if(event.code === binds.interact)           this.interact()
    if(event.code === binds.openMap)            this.toggleLocalMap()
    if(event.code === binds.pause)              gameManager.togglePause()
    if(event.code === binds.openInventory)      {gameManager.setWindow(inventory); inventory.viewInventoryTab("inventory")}
    if(event.code === binds.openDialogueScreen) {gameManager.setWindow(dialogueScreen); dialogueScreen.setTab("logs")}
    if(event.code === binds.openWorldMap)       gameManager.setWindow(map)
  }
  handleKeyup(event) {

  }
  handleMousedown(event) {
    switch(event.button) {
      case 0: {this.handleLeftDown(event);   break}
      case 1: {this.handleMiddleDown(event); break}
      case 2: {this.handleRightDown(event);  break}
    }
  }
  handleLeftDown(event) {

  }
  handleMiddleDown(event) {

  }
  handleRightDown(event) {

  }
  handleMousemove(event) {
    let target = event.target
    if(mouse.keys.middle || mouse.keys.left) {
      if(target.closest("#local-map")) {
        let position = this.minimapApp.stage.position
        position.set(position.x + mouse.clientMoved.x, position.y + mouse.clientMoved.y)
      }
    }
  }
  handleMouseup(event) {

  }
  handleClick(event) {

  }
  handleWheel(event) {
    let target = event.target

    if(target.closest("#local-map")) {
      let start = performance.now()
      let scale = this.minimapApp.stage.scale._x - (event.deltaY / 1000)
      let inverseScale = 1 / scale
      this.minimapApp.stage.scale.set(scale)
      this.gameObjects.gameObject.forEach(obj => {
        obj.sprite?.minimapIcon?.scale.set(inverseScale)
      })
      console.log(performance.now() - start)
    }
  }
  //#endregion
  interact() {
    if(this.availableInteraction)
      this.availableInteraction()
  }
  updateMinimap() {
    if(this.localMapOpen) return

    this.minimapApp.stage.position.set(
      -this.camera.transform.position.x * Game.minimapScaleFactor + this.minimapApp.view.getBoundingClientRect().width / 2,
      -this.camera.transform.position.y * Game.minimapScaleFactor + this.minimapApp.view.getBoundingClientRect().height / 2
    )
  }
  spawnFgObjects() {
    return
    let count = Random.int(0, 5)
    let types = [
      "fgMedium0",
      "fgMedium1",
      "fgMedium2",
      "fgMedium3",
      "fgMedium4",
      "fgMedium5",
    ];
    let layers = [
      "foreground",
      "foreground2",
      "foreground3",
    ]
    for(let i = 0; i < count; i++) {
      let position = player.ship.transform.position.clone()
      let velocity = new Vector(Random.int(12, 150), Random.int(12, 150))
      let rotation = Random.float(0, TAU)
      let angularVelocity = Random.float(0, 1)
      let offsetFromPlayer = new Vector(Random.int(cw/2, cw) * Random.from(-1, 1), Random.int(ch/2, ch) * Random.from(-1, 1))
      
      position.add(offsetFromPlayer)
      GameObject.create(
        "decoration",
        Random.from(...types), 
        {
          transform: new Transform(position, velocity, rotation, angularVelocity),
          isPermanent: false
        },
        {world: this, layer: Random.from(...layers)}
      )
    }
    this.timers.spawnFgObjects.duration = Random.int(900, 3600)
  }
  update() {
    this.updateLayers()
    this.updateMinimap()
    this.markers.forEach(m => m.update())
    this.timers.update()
  }
  static minimapScaleFactor = 0.028
}
class GameoverScreen extends GameWindow {
  constructor() {
    super("GameoverScreen", Q("#gameover-screen"))
  }
  show() {
    if(this.visible) return

    this.createQuote()

    this.element.classList.remove("hidden")
    this.element.animate([
      {filter: "opacity(0)", transform: "scale(0.965)"},
      {filter: "opacity(1)", transform: "scale(1.0)"},
    ], {
      duration: 1800,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    }).onfinish = () => this.visible = true
  }
  hide() {
    if(!this.visible) return

    this.element.animate([
      {filter: "opacity(1)", transform: "scale(1.0)"},
      {filter: "opacity(0)", transform: "scale(0.965)"},
    ], {
      duration: 1800,
      easing: "cubic-bezier(0.65, 0.0, 0.35, 1.0)"
    })
    .onfinish = () => {
      this.element.classList.add("hidden")
      this.visible = false
      this.destroyQuote()
    }
  }
  createQuote() {
    let quote = Random.from(...data.quotes)
    let element = El("div", "quote-container")
    let author =  El("div", "quote-author", undefined, data.person[quote.authorRef].displayName)
    let text =    El("div", "quote-text", undefined, quote.text)
    element.append(text, author)
    Q("#gameover-screen-content").append(element)
    this.quoteElement = element
  }
  destroyQuote() {
    this.quoteElement?.remove()
  }
  handleKeydown(e) {
    if(e.code === "Enter" || e.code === "NumpadEnter") Q("#gameover-button-reload-from-checkpoint").click()
  }
}
class SettingsScreen extends GameWindow {
  constructor() {
    super("SettingsScreen", Q('#settings-screen'))
  }
  handleMousedown() {
    
  }
}
class PauseScreen extends GameWindow {
  constructor() {
    super("PauseScreen", Q('#pause-screen'))
    this.createSliders()
  }
  createSliders() {
    this.musicVolumeSlider = new UISliderComponent(
      this, 
      Q("#pause-screen-slider-container-music"), 
      AudioManager,
      "musicVolume",
      {range: [0, 1], steps: 20}
    )
    this.sfxVolumeSlider = new UISliderComponent(
      this, 
      Q("#pause-screen-slider-container-sfx"), 
      AudioManager,
      "SFXVolume",
      {range: [0, 1], steps: 20}
    )
  }
  show() {
    this.element.classList.remove('hidden')
    Q("#game").style.backdropFilter = "blur(5px)"
  }
  hide() {
    this.element.classList.add('hidden')
    Q("#game").style.backdropFilter = ""
  }
  handleKeydown(event) {
    if(event.code === binds.pause)
      gameManager.unpauseGame()
  }
}
class StartScreen extends GameWindow {
  constructor() {
    super("SaveSelectScreen", Q('#start-screen'))
  }
  show() {
    this.visible = true
    this.element.classList.remove('hidden')
  }
}
class SaveConverter {
  static dictionaries = {
    dataToSave: {
      type: "t",
      name: "n",
      position: "p",
      alpha: "a",
      transform: "tr",
      velocity: "v",
      rotation: "r",
      angularVelocity: "aV",
      cellPosition: "cP",
      objects: "objs",
      fog: "f",
      pilot: "pl",
      layer: "l"
    },
    saveToData: {}
  }
  
  static generateReverseDictionary() {
    /* this function creates the reverse dictionary from dataToSave */

    let totalKeys = Object.keys(this.dictionaries.dataToSave)
    
    /* test whether there are duplicit values, this could corrupt the save */
    let values = new Set()
    for(let key of totalKeys)
      values.add(this.dictionaries.dataToSave[key])
    if(values.size < totalKeys.length)
      throw "Duplicit values."

    /* create the reverse dictionary */
    totalKeys.forEach(key => {
      let value = this.dictionaries.dataToSave[key]
      this.dictionaries.saveToData[value] = key
    })
  }
  static convert(from, to, inputData, options = {decimals: 0}, parentObject, parentAccessor) {
    /* 
    this function MODIFIES THE INPUT OBJECT recursively
    functions:
      modify object keys
      truncate number precision
    */

    /* which dictionary to use when converting */
    let dictionary = this.dictionaries[from + "To" + to.capitalize()]

    /* get data type */
    let type = getDataType(inputData)

    switch(type) {
      case "array": {
        for(let [index, child] of inputData.entries())
          this.convert(from, to, child, options, inputData, index)
        break
      }
      case "object": {
        let originalKeys = Object.keys(inputData)
        for(let origKey of originalKeys) {

          /* replace the original key for new one if it is found inside the dictionary */
          let key = dictionary[origKey]
          if(key) {
            inputData[key] = inputData[origKey]
            delete inputData[origKey]
          }
          else {
            key = origKey
          }

          this.convert(from, to, inputData[key], options, inputData, key)
        }
        break
      }
      case "number": {
        if(options.decimals)
          parentObject[parentAccessor] = +inputData.toFixed(options.decimals)
        break
      }
      default: {}
    }
    return inputData
  }
}
class SaveSelectScreen extends GameWindow {
  constructor() {
    super("SaveSelectScreen", Q('#save-select-screen'))
  }
}
class GameManager {
  constructor() {
    this.windows = []
    this.windowHistory = []
    this.activeWindow = null
    this.playerData = {
      shipName: "theGrandMoth",
      shipId: "player_ship"
    }
  }
  newGame() {
    cutsceneWindow.loadCutscene("intro")
    cutsceneWindow.onexit = () => this.loadStartingLocation()
    AudioManager.playLoopedAudio("music", "introCutscene", 0.75)
  }
  loadStartingLocation() {
    gameManager.setWindow(game)
    game.loadLocation("kaeso", setup.bind(this))
    function setup() {
      /* player */
      let ship = GameObject.create("ship", this.playerData.shipName, {transform: new Transform(),id: this.playerData.shipId,}, {world: game})
      player = GameObject.create("player", "player", {}, {world: game})
      player.ship = ship
      player.currency = 150

      /* horrible hack, this adds an item into player's inventory for every weapon the ship is instantiated with */
      for(let weapon of ship.weapons.weapons)
        player.inventory.addItems(new Item(weapon.name))

      game.camera.lockTo(player.ship)
      gameUI.updateShipHullUI()
      game.mode.set("play")
      game.app.ticker.add(tick)

      AudioManager.playLoopedAudio("music", "kaesoBackground", 0.7)
  
      /* this hack fast-forwards the ship docking animation so it looks like the ship started docked, even though it didnt */
      setTimeout(() => {
        player.ship.dockBegin()
        player.ship.timers.dock.currentTime += player.ship.timers.dock.duration - 10
      }, 100)

      /* this tries to fix the camera, should be set BEFORE THE ship starts docking */
      setTimeout(() => game.camera.currentZoom = 1.25)
    }
  }
  loadLocation(starSystemName) {
    /* rudimentary bad saving system that only saves the ship and player data */
    let playerInventory = player.inventory
    let shipWeapons = player.ship.weapons.weapons.map(weapon => weapon.name)

    AudioManager.playSFX("ultraportTravel")
    this.removePlayerControl()
    gameManager.setWindow(game)
    console.log(player.ship)
    game.loadLocation(starSystemName, setup.bind(this))
    
    function setup() {
      let entryBeacon = GameObject.byId(game, "entry_beacon")
      let shipOffset = Vector.fromAngle(Random.float(0, TAU)).mult(256)
      let transform = new Transform(entryBeacon.transform.position.clone().add(shipOffset))

      console.warn("Recreated player; inserted previous inventory into player; this is a hack")

      player = GameObject.create("player", "player", {}, {world: game})
      let ship = GameObject.create(
        "ship", 
        this.playerData.shipName, 
        {
          transform,
          id: this.playerData.shipId,
        }, 
        {
          world: game
        }
      )
      console.log(ship.gameWorld)
      player.ship = ship
      game.camera.lockTo(player.ship)

      /* 
      hack player and ship to restore their inventory and weapons, 
      the timeout is necessary because the weapon sprites are added inside a 0ms timeout 
      this timeout technically needs only be 0ms but I wanted to be sure it works
      */
      setTimeout(() => {
        player.inventory = playerInventory
        player.ship.weapons.removeAllWeapons()
        for(let weapon of shipWeapons)
          player.ship.weapons.addWeapon(weapon)
      }, 100)

      setTimeout(() => player.ship.skip.playTravelAnimation(player.ship.transform.position), 1500)

      gameUI.updateShipHullUI()
      gameUI.destroyUIWeaponComponents()
      this.restorePlayerControl()
    }
  }
  togglePause() {
    game.app.ticker.started ? this.pauseGame() : this.unpauseGame()
  }
  pauseGame() {
    game.app.ticker.stop()
    gameManager.setWindow(pauseScreen)
  }
  unpauseGame() {
    game.app.ticker.start()
    gameManager.setWindow(game)
  }
  endGame() {
    setTimeout(() => this.setWindow(gameoverScreen), 2500)
    console.log("game over, unregistering player handlers...")
    this.removePlayerControl()
  }
  removePlayerControl() {
    this.playerHandleInput = player.handleInput
    this.playerUpdate = player.update
    player.handleInput = () => {}
    player.update = () => {}
  }
  restorePlayerControl() {
    player.handleInput = this.playerHandleInput
    player.update = this.playerUpdate
  }
  saveAndQuit() {
    gameManager.setWindow(startScreen)
  }
  setWindow(newWindow) {
    if(!this.windows.find(w => w === newWindow)) return
    if(this.activeWindow === newWindow) return

    this.windows.forEach(otherWindow => {
      if(otherWindow === newWindow) return

      if(newWindow instanceof Game)
        gameUI.show()
      else 
        gameUI.hide()

      if(newWindow instanceof DialogueScreen) {
        game.show()
      }
      else
      if(newWindow instanceof InventoryWindow) {
        game.show()
      }
      else
      if(newWindow instanceof GameoverScreen) {
        game.show()
      }
      else
      if(newWindow instanceof PauseScreen) {
        game.show()
      }
      else
      if(newWindow instanceof ReceivedItemModal) {
        game.show()
        dialogueScreen.show()
      }
      else
      if(newWindow instanceof StarSystemDetail) {
        map.show()
      }
      else {
        otherWindow.hide()
      }
    })
            
    this.activeWindow = newWindow
    this.activeWindow.show()
    this.activeWindow.active = true
    this.windowHistory.push(newWindow)
  }
  closeWindow() {
    this.activeWindow.hide()
    this.activeWindow.active = false
    let prev = this.windowHistory.pop()
    this.setWindow(this.windowHistory.pop())
  }
  handleInput(e) {
    mouse.handleInput(e)
    gameUI.handleInput(e)
    this.activeWindow.handleInput(e)
    this.activeWindow.uiComponents.forEach(comp => comp.handleInput(e))
  }
  update() {
    gameUI.update()
    this.activeWindow.uiComponents.forEach(comp => comp.update())
  }
  preloadImageAssets() {
    /* 
    this function preloads assets by creating a dud gameObject and tries to load a sprite component for it
    it's not perfect but most assets will be requested
    */
    let errors = []
    for(let type in sources.img) {
      for(let name in sources.img[type]) {
        try {
          let 
          gameObject = new GameObject()
          gameObject.name = name
          gameObject.type = type
          gameObject.addComponent("sprite")
        }
        catch(e) {
          errors.push([e, type, name])
        }
      }
    }
    if(errors.length) console.log(errors)
  }
}
let dt = 0 
let dtf = 0
let fps = 0

let cdt = 0
let cLastTime = 0

let adt = 0 //audiodeltatime

let cw = window.innerWidth
let ch = window.innerHeight

let player = {}
const filters = {}

const filterManager           = new FilterManager()
const gameManager             = new GameManager()
const interactionManager      = new InteractionManager()
const mouse                   = new Mouse()
const gameUI                  = new GameUI()

const game                    = new Game()
const locationEditor          = new LocationEditor()
const dialogueEditor          = new DialogueEditor()
const hitboxEditor            = new HitboxEditor()
const dialogueScreen          = new DialogueScreen()
const starSystemDetail        = new StarSystemDetail()
const inventory               = new InventoryWindow()
const map                     = new WorldMap()
const startScreen             = new StartScreen()
const saveSelectScreen        = new SaveSelectScreen()
const settingsScreen          = new SettingsScreen()
const gameoverScreen          = new GameoverScreen()
const loadingScreen           = new LoadingScreen()
const creditScreen            = new CreditScreen()
const pauseScreen             = new PauseScreen()
const receivedItemModal       = new ReceivedItemModal()
const cutsceneWindow          = new CutsceneWindow()
const questDesigner           = new QuestDesigner()

gameManager.windows.push(
  game,
  locationEditor,
  dialogueEditor,
  hitboxEditor, 
  dialogueScreen,
  starSystemDetail,
  inventory,
  map,
  startScreen,
  saveSelectScreen,
  settingsScreen,
  gameoverScreen,
  loadingScreen,
  creditScreen,
  pauseScreen,
  receivedItemModal,
  cutsceneWindow,
  questDesigner,
)

window.onresize = () => {
  cw = window.innerWidth
  ch = window.innerHeight
  gameManager.windows.forEach(win => {
    win.app?.resize()
    win.camera?.contextDim.set(cw, ch)
  })
  dialogueEditor.canvas.width = cw
  dialogueEditor.canvas.height = ch
}

// window.onblur = () => gameManager.pauseGame()

/* mutation observer used to update hints */
{
  const container = Q("#interaction-container")
  const audioCall = Q("#audio-call-panel")

  let canUpdate = true
  const callback = async () => {

    /* this is run because the UI shuffles and I want to hide tooltips that would correspond to incorrect or hidden elements */
    gameUI.cancelTooltipPopup()

    await waitFor(250)
    if(!canUpdate) return
    setTimeout(() => canUpdate = true, 1000)
    canUpdate = false
    
    /* 
    if the total number of visible audio call panels AND big hints is less than 1,
    try to maximize the first hint, if it doesn't exist, maximize audio call
    */
    if(Qa('#interaction-container .hint:not(.hidden), #audio-call-panel:not(.hidden)').length < 1) {
      let firstVisibleHint = game.gameObjects.hint.find(h => h.hintText)
      firstVisibleHint ? firstVisibleHint.maximize() : gameUI.maximizeAudioCallPanel()
    }
  }
  /* just fuckin call this periodically anyways */
  setInterval(callback, 250)

  const interactionObserver = new MutationObserver(callback)
  interactionObserver.observe(container, {childList: true})
  interactionObserver.observe(audioCall, {attributes: true})
}

function perfRun(fn = function() {}, context, ...args) {
  [1, 10, 100, 1000]
  .forEach(value => {
    let start = performance.now()
    for(let i = 0; i < value; ++i)
      fn.apply(context, args)
    console.log(performance.now() - start)
  })
}
/* sets of commands I can easily switch between to make it easier to do stuff */
const initMacros = {
  openDialogueEditor() {
    gameManager.setWindow(dialogueEditor)
  },
  loadGame() {
    gameManager.loadStartingLocation()
  },
  startIntroDialogue() {
    gameManager.setWindow(game)
    gameManager.setWindow(dialogueScreen)
    dialogueScreen.load("intro-king_and_ada")
  },
  openMap() {
    gameManager.setWindow(game)
    gameManager.setWindow(map)
  },
};

(function init() {
  SaveConverter.generateReverseDictionary()
  gameManager.preloadImageAssets()
  Cutscene.preloadScenes()
  Hint.preloadAssets()
  attachListeners()
  Fact.loadFacts()
  loadFonts(() => map.load())
  AudioManager.prime()
  AudioManager.loadSounds()
  Item.registerItemsFromWeapons()
  gameManager.setWindow(startScreen)
  Q("#ship-graphic").classList.add(gameManager.playerData.shipName)
  Q("#ship-skip-charge-icon").classList.add(gameManager.playerData.shipName)
  gameUI.toggleDevIcons()
})();
