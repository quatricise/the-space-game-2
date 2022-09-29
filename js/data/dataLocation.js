readTextFile("data/locationCoordinates.json", function(text) {
  data.locationCoords = JSON.parse(text)
    
  data.location = {
    crownCapital: {
      name: "Crown central system",
      pos: {
        x: data.locationCoords["Crown central system"].x, 
        y: data.locationCoords["Crown central system"].y
      },
      objects: []
    },
    tauriB: {
      name: "Tauri B",
      pos: {
        x: data.locationCoords["Tauri B"].x,
        y: data.locationCoords["Tauri B"].y
      },
      objects: []
    },
    hiveCapital: {
      name: "Hive",
      pos: {
        x: data.locationCoords["Hive"].x, 
        y: data.locationCoords["Hive"].y
      },
      objects: []
    },
  }
})

readTextFile("data/worldmapData.json", function(text) {
  let d = JSON.parse(text)
  console.warn("process map images somehow")
})
