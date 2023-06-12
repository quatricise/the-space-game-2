class SaveConverter {
  static dictionaries = {
    dataToSave: {
      type: "t",
      name: "n",
      position: "p",
      alpha: "a",
      transform: "tr",
      velocity: "v",
      rotation: "r",
      angularVelocity: "aV",
      cellPosition: "cP",
      objects: "objs",
      fog: "f",
      pilot: "pl",
      layer: "l"
    },
    saveToData: {}
  }
  
  static generateReverseDictionary() {
    /* this function creates the reverse dictionary from dataToSave */

    let totalKeys = Object.keys(this.dictionaries.dataToSave)
    
    /* test whether there are duplicit values, this could corrupt the save */
    let values = new Set()
    for(let key of totalKeys)
      values.add(this.dictionaries.dataToSave[key])
    if(values.size < totalKeys.length)
      throw "Duplicit values."

    /* create the reverse dictionary */
    totalKeys.forEach(key => {
      let value = this.dictionaries.dataToSave[key]
      this.dictionaries.saveToData[value] = key
    })
  }
  static convert(from, to, inputData, options = {decimals: 0}, parentObject, parentAccessor) {
    /* 
    this function MODIFIES THE INPUT OBJECT recursively
    functions:
      modify object keys
      truncate number precision
    */

    /* which dictionary to use when converting */
    let dictionary = this.dictionaries[from + "To" + to.capitalize()]

    /* get data type */
    let type = getDataType(inputData)

    switch(type) {
      case "array": {
        for(let [index, child] of inputData.entries())
          this.convert(from, to, child, options, inputData, index)
        break
      }
      case "object": {
        let originalKeys = Object.keys(inputData)
        for(let origKey of originalKeys) {

          /* replace the original key for new one if it is found inside the dictionary */
          let key = dictionary[origKey]
          if(key) {
            inputData[key] = inputData[origKey]
            delete inputData[origKey]
          }
          else {
            key = origKey
          }

          this.convert(from, to, inputData[key], options, inputData, key)
        }
        break
      }
      case "number": {
        if(options.decimals)
          parentObject[parentAccessor] = +inputData.toFixed(options.decimals)
        break
      }
      default: {}
    }
    return inputData
  }
}