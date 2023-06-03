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
