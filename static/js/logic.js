function createMap(earthQuake) {

  // Create the tile layer that will be the background of our map
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    "Light Map": lightmap
  };

  // Create an overlayMaps object to hold the earthQuake layer
  var overlayMaps = {
    "Earth Quake": earthQuake
  };

  // // Create the map object with options
  var myMap = L.map("map-id", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [lightmap, earthQuake]
  });

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}




function createMarkers(response) {
  console.log(response)

  // Pull the "stations" property off of response.data
  var locations = response.features;
  console.log(locations)
  // Initialize an array to hold bike markers
  var earthMarkers = [];

  // Loop through the stations array
  for (var i = 0; i < locations.length; i++) {

    var lat = locations[i].geometry.coordinates[1];
    var lon = locations[i].geometry.coordinates[0]
    var popUp = locations[i].properties.place
    // console.log(lat)
    // console.log(lon)
    // console.log(popUp)
    // console.log(locations[i].properties.mag)

    // For each station, create a marker and bind a popup with the station's name
    var color = "";
    if (1.0 <= locations[i].properties.mag < 2.0) {
      color = "yellow";
    }
    else if (2.0 <= locations[i].properties.mag < 3.0) {
      color = "blue";
    }
    else if (3.0 <= locations[i].properties.mag < 4.0) {
      color = "pink";
    }
    else if (4.0 <= locations[i].properties.mag < 5.0) {
      color = "red";
    }
    else if (locations[i].properties.mag >= 5.0) {
      color = "orange";
    }
    else {
      color = "black";
    }

    
    var earthMarker = L.circle([lat, lon],{
      color: "black",
      fillColor: color,
      fillOpacity: 0.75,
      radius: locations[i].properties.mag * 50000})
    .bindPopup(popUp);
    

    // Add the marker to the bikeMarkers array
    earthMarkers.push(earthMarker);
    // console.log(earthMarkers)
  }

  // // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(earthMarkers));
}

// Perform an API call  to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", createMarkers);


// // Perform a GET request to the query URL
// d3.json(url, function(data) {
//   // Once we get a response, send the data.features object to the createFeatures function
//   console.log(data.features[2].geometry)
//   console.log(data.features[1].properties.place)
//   createFeatures(data.features);
// });









// function createMap(earthQuake) {

//   // Create the tile layer that will be the background of our map
//   var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
//     maxZoom: 18,
//     id: "mapbox.light",
//     accessToken: API_KEY
//   });

//   // Create a baseMaps object to hold the lightmap layer
//   var baseMaps = {
//     "Light Map": lightmap
//   };

//   // Create an overlayMaps object to hold the earthQuake layer
//   var overlayMaps = {
//     "Bike Stations": earthQuake
//   };

//   // Create the map object with options
//   var map = L.map("map-id", {
//     center: [40.73, -74.0059],
//     zoom: 12,
//     layers: [lightmap, earthQuake]
//   });

//   // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
//   L.control.layers(baseMaps, overlayMaps, {
//     collapsed: false
//   }).addTo(map);
// }

// function createMarkers(response) {

//   // Pull the "stations" property off of response.data
//   var stations = response.data.stations;

//   // Initialize an array to hold bike markers
//   var bikeMarkers = [];

//   // Loop through the stations array
//   for (var index = 0; index < stations.length; index++) {
//     var station = stations[index];

//     // For each station, create a marker and bind a popup with the station's name
//     var bikeMarker = L.marker([station.lat, station.lon])
//       .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "<h3>");

//     // Add the marker to the bikeMarkers array
//     bikeMarkers.push(bikeMarker);
//   }

//   // Create a layer group made from the bike markers array, pass it into the createMap function
//   createMap(L.layerGroup(bikeMarkers));
// }


// // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
// d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json", createMarkers);
