class Switch {
  constructor(mode1, mode2) {
    this.value = mode1
    this.modes = [mode1, mode2]
  }
  switch() {
    this.value === this.modes[0] ? this.value = this.modes[1] : this.value = this.modes[0]
  }
  set(val) {
    if(val === this.modes[0] || val === this.modes[1]) this.value = val
    else console.log('invalid value')
  }
  is(val) {
    if(this.value === val) return true
    else return false
  }
}