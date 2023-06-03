class Logger {
  static active = false
  static log(message) {
    if(this.active)
      console.log(message)
  }
  static error(message) {
    if(this.active)
      console.error(message)
  }
}