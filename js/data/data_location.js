readTextFile("data/location_coordinates.json", function(text) {
  data.location_coords = JSON.parse(text)
    
  data.location = {
    crown_capital: {
      name: "Crown central system",
      pos: {
        x: data.location_coords["Crown central system"].x, 
        y: data.location_coords["Crown central system"].y
      },
      objects: []
    },
    tauri_b: {
      name: "Tauri B",
      pos: {
        x: data.location_coords["Tauri B"].x, 
        y: data.location_coords["Tauri B"].y
      },
      objects: []
    },
    hive_capital: {
      name: "Hive",
      pos: {
        x: data.location_coords["Hive"].x, 
        y: data.location_coords["Hive"].y
      },
      objects: []
    },
  }
})

readTextFile("data/worldmap_data.json", function(text) {
  let d = JSON.parse(text)
  console.warn("process map images somehow")
})
