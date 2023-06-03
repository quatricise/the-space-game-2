class MathUtils {
  static clamp(value, min, max) {
    let val = value
    if(val <= min) val = min
    else
    if(val >= max) val = max
    return val
  }
  static sum(...values) {
    let result = 0
    values.forEach(val => result += val)
    return result
  }
  static avg(...numbers) {
    let sum = 0
    numbers.map(num => sum += num)
    return sum / numbers.length
  }
}