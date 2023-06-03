/* merge scripts in a janky way */
setTimeout(() => {
  return
  let data = []
  let count = document.scripts.length - 1 // - 1 is to prevent this very code getting in the bundle
  let excludedNames = ["dependencies/"]
  let current = 0
  Array.from(document.scripts).forEach((script, index) => {
    if(script.src.includesAny(...excludedNames)) return count--

    readJSONFile(script.src, (text) => {
      try {data.push({text: text, index: index})} catch (e) {}
      current++
      if(current == count) {
        data.sort((a, b) => a.index - b.index)
        data = data.map(d => d.text).join("\n")
        exportToUTF8(data, "app.js")
      }
    })
  })
}, 0)
