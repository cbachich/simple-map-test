var map;
var home_lat  = 40.0;
var home_long = -100.0;
var timeout;
var bb;

function mapInit() {
  map = L.mapbox.map('map', 'examples.map-9ijuk24y')
    .setView([home_lat, home_long], 4);

  map.addControl(L.mapbox.geocoderControl('examples.map-9ijuk24y'));
  map.addControl(L.mapbox.shareControl());
  timeout = 0;
  setInterval(timer, 200);
  bb = "";
  getLocation();
}

function change() {
  timeout = 2;
}

function timer() {
  if (timeout == 1) {
    addr_search();
  }

  if (timeout > 0) {
    timeout--;
  }
}

function addr_search() {
  var inp = document.getElementById("addr");

  var searchString = 'http://nominatim.openstreetmap.org/search?format=json&limit=5' + bb + '&q=' + inp.value;
  $.getJSON(searchString, function(data) {
    var items = [];

    $.each(data, function(key, val) {
      items.push(
        "<li><a href='#' onclick='chooseAddr(" +
        val.lat + ", " + val.lon + ", \"" + val.type + "\");return false;'>" + val.display_name +
        '</a></li>'
      );
    });
    $('#results').empty();
    if (items.length != 0) {
      $('<p>', { html: "Search results:" }).appendTo('#results');
      $('<ul/>', {
        'class': 'my-new-list',
        html: items.join('')
      }).appendTo('#results');
    } else {
      $('<p>', { html: "No results found" }).appendTo('#results');
    }
  });

  var className = document.getElementById("results").className;
  if (className != "visible") {
    document.getElementById("results").className = "visible";
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setLocation);
  }
}

function setLocation(position) {
  var x = position.coords.latitude;
  var y = position.coords.longitude;
  bb = "&viewbox=" + (y-1) + "," + (x+1) + "," + (y+1) + "," + (x-1);
}

function chooseAddr(lat, lng, type) {
  var location = new L.LatLng(lat, lng);

  if (type == 'city') {
    map.setZoom(11);
  }
  else if (type == 'administrative' || type == "state") {
    map.setZoom(6);
  }
  else {
    map.setZoom(13);
  }

  map.panTo(location);

  var geojson = [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [lng, lat]
      },
      "properties": {
        "title": "You're selection",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "heart"
      }
    }
  ];

  map.markerLayer.setGeoJSON(geojson);
  document.getElementById("results").className = "invisible";
}
