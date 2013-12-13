var map;
var home_lat  = 38.947053;
var home_long = -104.690293;

function mapInit() {
  map = L.mapbox.map('map', 'examples.map-9ijuk24y')
    .setView([home_lat, home_long], 4);

  map.addControl(L.mapbox.geocoderControl('examples.map-9ijuk24y'));
  map.addControl(L.mapbox.shareControl());

  var geojson = [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [home_long, home_lat]
      },
      "properties": {
        "title": "My Home",
        "description": "7967 Superior Hill Pl, Colorado Springs",
        "marker-color": "#fc4353",
        "marker-size": "large",
        "marker-symbol": "heart"
      }
    }
  ];

  map.markerLayer.setGeoJSON(geojson);
}
