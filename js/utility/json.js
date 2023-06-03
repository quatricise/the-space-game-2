function exportToJSONFile(data, filename) {
  let dataStr = JSON.stringify(data, null, 2);
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  let defaultName = filename || 'data.json';

  if(filename) defaultName += ".json"

  let 
  linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', defaultName);
  linkElement.click();
}

function readJSONFile(file, callback) {
  var request = new XMLHttpRequest();
  request.overrideMimeType("application/json");
  request.open("GET", file, true);
  request.onreadystatechange = function() {
    if(request.readyState === 4 && request.status == "200") {
      callback(request.responseText);
    }
  }
  request.send(null);
}