class Ease {
  static InOut(curTime, valueFrom, valueAdd, duration) {
    if ((curTime /= duration / 2) < 1) {
      return (valueAdd / 2) * curTime * curTime + valueFrom;
    } else {
      return (-valueAdd / 2) * (--curTime * (curTime - 2) - 1) + valueFrom;
    }
  }
  static InOutAlternate(curTime, valueFrom, valueAdd, duration) {
    let halfDuration = duration / 2
    let maxValue = valueFrom + valueAdd
    if(curTime <= halfDuration)
      return this.InOut(curTime, valueFrom, valueAdd, halfDuration)
    else
      return maxValue - this.InOut(curTime - halfDuration, valueFrom, valueAdd - valueFrom, halfDuration)
  }
  static In(curTime, valueFrom, valueAdd, duration) {
    return valueAdd * (curTime /= duration) * curTime + valueFrom
  }
  static Out(curTime, valueFrom, valueAdd, duration) {
    return -valueAdd * (curTime /= duration) * (curTime - 2) + valueFrom;
  }
  static Linear(curTime, valueFrom, valueAdd, duration) {
    return (valueAdd * curTime) / duration + valueFrom;
  }
  static LinearAlternate(curTime, valueFrom, valueAdd, duration) {
    let halfDuration = duration / 2
    let maxValue = valueFrom + valueAdd
    if(curTime <= halfDuration)
      return this.Linear(curTime, valueFrom, valueAdd, halfDuration)
    else
      return maxValue - this.Linear(curTime - halfDuration, valueFrom, valueAdd - valueFrom, halfDuration)
  }
}