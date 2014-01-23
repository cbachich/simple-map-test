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
  setInterval(timer, 250);
  bb = "";
  getLocation();
}

function change(e) {
  if (e.keyCode == 13) {
    timeout = 1;
  } else {
    timeout = 5;
  }
}

function timer() {
  if (timeout == 1) {
    addr_search();
  }

  if (timeout > 0) {
    timeout--;
  }
}

var items;
var results;
function addr_search() {
  var inp = document.getElementById("addr");

  items = [];
  results = [];
  var searchString = 'http://nominatim.openstreetmap.org/search?format=json&q=' + inp.value;
  getSearchResults(searchString + bb + "&limit=10&bounded=1");
  getSearchResults(searchString + "&limit=10");

  var text;
  if (items.length != 0) {
    text = "<table class='table table-striped'>";
    text += items.join('');
    text += "</table>";
  } else {
    text = "No results found";
  }
  console.log(text);

  document.getElementById('results').innerHTML = text;
  document.getElementById('bottom').className = "bottom search";
}

function getSearchResults(searchString) {
  $.ajax({
    async: false,
    url: searchString, 
    success: function(data) {
      $.each(data, function(key, val) {
        addSearchItem(val)
      });
    }
  });
}

function addSearchItem(val) {
  if (results.indexOf(val.display_name) < 0) {
    results.push(val.display_name);
    items.push(
      "<tr><td><a href='#' onclick='chooseAddr(" +
      val.lat + ", " + val.lon + ", \"" + val.type + "\");return false;'>" + val.display_name +
      '</a></td></tr>'
    );
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
  bb = "&viewbox=" + (y-0.5) + "," + (x+0.5) + "," + (y+0.5) + "," + (x-0.5);
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
}

function closeSearch() {
  document.getElementById('bottom').className = "bottom";
}
