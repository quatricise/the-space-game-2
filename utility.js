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

function mode(arr){
  return arr.sort((a,b) =>
        arr.filter(v => v===a).length
      - arr.filter(v => v===b).length
  ).pop();
}

const reducer = (accumulator, curr) => accumulator + curr;

function vectorRotate(x, y, rot) {
  var sin = Math.sin(rot);
  var cos = Math.cos(rot);
  var newPos = {
    x: (cos * x) + (sin * y),
    y: (cos * y) - (sin * x)
  }
  return newPos;
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