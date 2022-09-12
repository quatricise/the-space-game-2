class Ease {
  //all methods are quadratic except for Linear
  static InOut(curTime, valueFrom, valueAdd, duration) {
    if ((curTime /= duration / 2) < 1) {
      return (valueAdd / 2) * curTime * curTime + valueFrom;
    } else {
      return (-valueAdd / 2) * (--curTime * (curTime - 2) - 1) + valueFrom;
    }
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
}