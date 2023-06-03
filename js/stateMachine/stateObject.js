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