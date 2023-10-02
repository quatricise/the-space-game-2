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
/** Return true if the string is equal any of the input strings. */
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
Array.prototype.random = function() {
  return this[Random.int(0, this.length - 1)]
}
Array.prototype.removeAt = function(index) {
  return this.splice(index, 1)
}
Array.prototype.empty = function() {
  while(this.length)
    this.pop()
}
