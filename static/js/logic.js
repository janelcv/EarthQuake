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
    "Earth Quake": earthQuake,
    "Earth Quake": earthQuake
  };

  // // Create the map object with options
  var myMap = L.map("map-id", {
    center: [37.77, -122.41],
    zoom: 5,
    layers: [ darkmap, satellitemap, streetmap, earthQuake, earthQuake,]
  });
  

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

legend.addTo(myMap);

}

// Create a legend to display information about our map
var legend = L.control({
  position: 'bottomright'});


// When the layer control is added, insert a div with the class of "legend"
legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]+1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

function getColor(d) {
  return d < 1.0 ? '#80ff00' :
         d >= 1.0  && d < 2.0  ? '#bfff00' :
         d >= 2.0  && d < 3.0  ? '#ffff00' :
         d >= 3.0  && d < 4.0  ? '#ffbf00' :
         d >= 4.0  && d < 5.0   ? '#ff8000' :
                                  '#ff4000' ;
}


function createMarkers(response) {
  console.log(response)

  // Pull the "locations" property off of response.data
  var locations = response.features;
  console.log(locations)
  // Initialize an array to hold markers
  var earthMarkers = [];

  // Loop through the locations array
  for (var i = 0; i < locations.length; i++) {

    var lat = locations[i].geometry.coordinates[1];
    var lon = locations[i].geometry.coordinates[0]
    var popUp =  "<h3>" + locations[i].properties.title + "<h3>"
    // console.log(lat)
    // console.log(lon)
    // console.log(popUp)
    // console.log(locations[i].properties.mag)

    // // For each station, create a marker and bind a popup with the station's name
    // var color = "";
    // if (locations[i].properties.mag < 1.0) {
    //   color = "#80ff00";
    // }
    // else if (1.0 <= locations[i].properties.mag && locations[i].properties.mag < 2.0) {
    //   color = "#bfff00";
    // }
    // else if (2.0 <= locations[i].properties.mag && locations[i].properties.mag < 3.0) {
    //   color = "#ffff00";
    // }
    // else if (3.0 <= locations[i].properties.mag && locations[i].properties.mag < 4.0) {
    //   color = "#ffbf00";
    // }
    // else if (4.0 <= locations[i].properties.mag && locations[i].properties.mag < 5.0) {
    //   color = "#ff8000";
    // }
    // else {
    //   color = "#ff4000";
    // }
    
    
    var earthMarker = L.circle([lat, lon],{
      color: "black",
      fillColor: getColor(locations[i].properties.mag),
      fillOpacity: 0.5,
      radius: locations[i].properties.mag * 20000})
    .bindPopup(popUp);
    

    // Add the marker to the eathMarkers array
    earthMarkers.push(earthMarker)
    // console.log(earthMarkers)
  }

  // // Create a layer group made from the markers array, pass it into the createMap function
  createMap(new L.layerGroup(earthMarkers));
}



// Perform an API call  to get location information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);


