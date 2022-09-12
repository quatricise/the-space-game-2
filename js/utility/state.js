class State {
  constructor(...values) {
    this.values = values
    this.current =  values[0]
    this.previous = values[0]
  }
  set(value) {
    let val = this.values.find(v => v === value)
    if(val) {
      this.previous = this.current
      this.current = val
    }
    else {
      console.log('invalid value')
    }
  }
  revert() {
    let prev = this.current
    this.current = this.previous
  }
  ifrevert(val) {
    if(this.is(val)) this.revert()
  }
  ifthen(val, val2) {
    if(this.is(val)) this.set(val2)
  }
  is(...values) {
    let match = false
    values.forEach(val => {
      if(this.current === val) match = true
    })
    return match
  }
  isnt(...values) {
    let match = true
    values.forEach(val => {
      if(this.current === val) match = false
    })
    return match
  }
  get() {
    return this.current
  }
}