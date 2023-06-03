class Range {
  constructor(from, to, value) {
    this.from = +from
    this.to = +to
    value ? this.value = value : this._value = from
  }
  set value(value) {
    this._value = value
    if(this._value < this.from) this._value = this.from
    else
    if(this.value > this.to)    this._value = this.to
    
    return this._value
  }
  offset(value) {
    this.value = this._value + value
  }
  get value() {
    return this._value
  }
}