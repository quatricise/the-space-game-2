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

/* merge scripts in a better but still janky way */
setTimeout(() => {
  return
  let excludedNames = ["dependencies/", "mergeScripts"]

  let scripts = Array.from(document.scripts)
  /* exclude certain scripts */
  scripts = scripts.filter(script => 
    script.src &&
    !script.src.includesAny(...excludedNames)
  )

  /* load script sources */
  let promise = Promise.all(
    scripts.map(script => new Promise(resolve => readJSONFile(script.src, resolve)))
  )
  /* join & save scripts */
  promise.then(data => exportToUTF8(data.join("\n"), "app.js"))
}, 0)