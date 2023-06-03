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