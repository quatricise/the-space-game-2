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
