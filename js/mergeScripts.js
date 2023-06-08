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