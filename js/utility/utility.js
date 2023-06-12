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
  console.log(pairs)

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
  console.log(remainingText, splitText)

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
    }
    insertionOffset++
  })

  return splitText.join("")
}