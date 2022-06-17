function exportToJsonFile(data, filename) {
  let dataStr = JSON.stringify(data);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  // console.log(dataUri)
  let exportFileDefaultName = filename || 'data.json';
  if(filename) {
    exportFileDefaultName += ".json"
  }

  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText);
      }
  }
  rawFile.send(null);
}