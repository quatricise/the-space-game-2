class Rotation {
  constructor(value) {
    this._value = value
  }
  set value(value) {
    value = +value.toFixed(12)
    while(value < 0)
      value += TAU
    while(value > TAU)
      value -= TAU
    this._value = value
  }
  get degrees() {
    return Math.round(this._value * 180/PI)
  }
  get value() {
    return this._value
  }
}