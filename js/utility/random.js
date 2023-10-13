class Random {
  static float(from = 0, to = 1) {
    return Math.random()*(to - from) + from
  }
  static int(from = 0, to = 1) {
    return Math.round(this.float(from, to))
  }
  static decimal(from = 0, to = 1, decimalPoints = 1) {
    return +this.float(from, to).toFixed(decimalPoints)
  }
  static intArray(from, to, count) {
    let ints = []
    for(let i = 0; i < count; i++) {
      ints.push(this.int(from, to))
    }
    return ints
  }
  static rotation() {
    return this.float(0, TAU)
  }
  static bool() {
    return !!this.int(0, 1)
  }
  /** How many %. */
  static chance(chance) {
    return this.int(0, 100) < chance
  }
  static from(...array) {
    return array[Math.round(Math.random()*(array.length - 1))]
  }
  static dataFrom(...array) {
    let i = this.int(0, array.length - 1)
    return array[i]
  }
  static weighted(values = {apple: 1, orange: 2}) {
    let weights = []
    let keys = Object.keys(values)
  
    for (let i = 0; i < keys.length; i++) {
      weights.push(values[keys[i]])
    }
  
    let thresholds = []
    let value = 0;
    let prevValue = 0;
    for (let i = 0; i < keys.length; i++) {
      value = weights[i] + prevValue
      thresholds.push(value)
      prevValue = value
    }
    let pick;
    let random = this.int(0,thresholds[thresholds.length - 1])
  
    for (let i = 0; i < thresholds.length; i++) {
      if(i === 0) {
        if(random < thresholds[i]) {
          pick = keys[i]
          break
        }
      }
      if(i > 0 && i < (thresholds.length - 1)) {
        if(random > thresholds[i - 1] && random <= thresholds[i]) {
          pick = keys[i]
          break
        }
      }
      if(i == thresholds.length - 1) {
        if(random <= thresholds[i]) {
          pick = keys[i]
          break
        }
      }
    }
    return pick
  }
  /* mess of functions adding IDs */
  static id(length = 10) {
    let num = Math.random() * 1_000_000_000
    return num.toFixed(length)
  }
  static idFor(objects) {
    let id = this.id()
    let isUnique = false
    while(!isUnique) {
      isUnique = true
      objects.forEach(item => {
        if(item.id === id) {
          isUnique = false
          id = this.id()
        }
      })
    }
    return id
  }
  static uniqueID(array) {
    let id = this.int(0, 1_000_000_000_000)
    if(!array)
      return id
  
    let isUnique = false
    while(!isUnique) {
      isUnique = true
      array.forEach(item => {
        if(item.id === id) {
          isUnique = false
          id = this.int(0, 1_000_000)
        }
      })
    }
    return id
  }
  static uniqueIDHEX(size = 16) {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  
    for (let n = 0; n < size; n++)
      result.push(hexRef[Math.floor(Math.random() * 16)])
      
    return result.join('');
  }
  static uniqueIDString(size = 16) {
    let result = [];
    let alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
  
    for (let n = 0; n < size; n++)
      result.push(alphabet[Math.floor(Math.random() * 16)])
      
    return result.join('');
  }
}
