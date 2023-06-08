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
