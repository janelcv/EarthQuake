function createMap(earthQuake) {

  // Create the tile layer that will be the background of our map
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
  });

var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.comic",
  accessToken: API_KEY
});

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Dark Map": darkmap,
    "Satellite Map": satellitemap,
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the earthQuake layer
  var overlayMaps = {
    "Earth Quake": earthQuake
  };

  // // Create the map object with options
  var myMap = L.map("map-id", {
    center: [37.77, -122.41],
    zoom: 5,
    layers: [ darkmap, satellitemap, streetmap, earthQuake]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

// legend.addTo(myMap);

}



function plateMarkers(response) {
  console.log(response)

  // Pull the "locations" property off of response.data
  var locations = response.features;
  console.log(locations)
  // Initialize an array to hold markers
  var plateMarkers = [];

  // Loop through the locations array
  for (var i = 0; i < locations.length; i++) {
    var linePlate = locations[i].geometry.coordinates[0];
    // console.log(linePlate)
    var switchedLinePlate = [];
    linePlate.forEach(function(x){
      x0 = x[1];
      x1 = x[0];
      array_new = [x0,x1];
      switchedLinePlate.push(array_new);
    });
    console.log(switchedLinePlate)
    var popUp =  "<h3>" + locations[i].properties.Name + "<h3><h3>Source: " + locations[i].properties.Source + "<h3>"
    var plateMarker = L.polyline(switchedLinePlate,{
      color: "red"})
    

    // Add the marker to the eathMarkers array
    plateMarkers.push(plateMarker);
    // console.log(earthMarkers)
  }

  // Create a layer group made from the markers array, pass it into the createMap function
  createMap(new L.layerGroup(plateMarkers));
};



// Perform an API call  to get location information. Call createMarkers when complete
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json", plateMarkers);


