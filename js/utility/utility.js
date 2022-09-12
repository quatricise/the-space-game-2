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
function randomData(...data) {
  let i = randR(0, data.length - 1)
  return data[i]
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

function avg(...numbers) {
  let sum = 0
  numbers.map(num => sum += num)
  return sum / numbers.length
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
  else throw `not "false" or "true"`;
}

// function easeLinear(curTime, valueFrom, valueAdd, duration) {
//   return (valueAdd * curTime) / duration + valueFrom;
// }
// function easeInOutQuad(curTime, valueFrom, valueAdd, duration) {
//   if ((curTime /= duration / 2) < 1) {
//     return (valueAdd / 2) * curTime * curTime + valueFrom;
//   } else {
//     return (-valueAdd / 2) * (--curTime * (curTime - 2) - 1) + valueFrom;
//   }
// }
// function easeOutQuad(curTime, valueFrom, valueAdd, duration) {
//   return -valueAdd * (curTime /= duration) * (curTime - 2) + valueFrom;
// }
// function easeInQuad(curTime, valueFrom, valueAdd, duration) {
//   return valueAdd * (curTime /= duration) * curTime + valueFrom;
// }

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
  var newpos = new Vector((cos * x) + (sin * y),(cos * y) - (sin * x))
  return newpos;
}

function vectorScale(vector, factor) {
  var newpos = {
    x: vector.x * factor,
    y: vector.y * factor
  }
  return newpos;
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

function world_to_client_pos(game_window, pos) {
  console.log(game_window)
  return pos.clone().sub(game_window.camera.transform.position).add(new Vector(cw/2, ch/2))
}

function f(id) {
  return entities.find(e => e.id === +id)
}

function capitalize(string) {
  return string.charAt(0).toLocaleUpperCase() + string.slice(1)
}

function rgb_to_hex(rgb) {
  let a = rgb.split("(")[1].split(")")[0]
  a = a.split(",")
  let b = a.map((x) => {              //For each array element
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

Array.prototype.remove = function(...children) {
  children.forEach(child => {
    this.splice(this.indexOf(child), 1)
  })
}
Array.prototype.findChild = function(child) {
  return this.find(obj => obj === child)
}