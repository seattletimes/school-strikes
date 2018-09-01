//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

var xhr = require("./lib/xhr");
var template = require("./lib/dot").compile(require("./_tooltip.html"));

var allData = window.allData;
var featureLookup = {};

xhr("./assets/WSD.geo.json", function(err, data) {
	var fillKey = function() {
	};
	fillKey();

  var findDistrictData = function(geoid) {
    var districtData = allData.find(function(individualChange) {
      return individualChange.GEOID == geoid;
    });

    return districtData;
  }
 

  var paint = function(feature) {
    var fillColor = "transparent";

    // GEOID == identifier for the disrict
    var districtData = findDistrictData(feature.properties.GEOID10);

    if (districtData) {
      // District data will either be a number or undefined - if a number use it to color
      var min = Number.parseFloat(districtData.status);

      if (!isNaN(min)) {
        fillColor = min <= 1 ? '#b10026' :
                    min <= 2 ? '#fc4e2a' :
                    min <= 3 ? '#feb24c' :
                    min <= 4 ? '#ffeda0' :
                    '#EAEAEA';
      }
    }

    return {
      fillColor,
      weight: 1,
      color: "rgba(0, 0, 0, .3)",
      fillOpacity: .8
    }
  };



	var onClick = function(e) {
    var districtData = findDistrictData(this.GEOID10);
		map.openPopup(template(districtData), e.latlng)
  };

	var schools = L.geoJson(data, {
    style: paint,
    onEachFeature: function(feature, layer) {
      layer.on("click", onClick.bind(feature.properties));
    }
  });


  schools.addTo(map);
  map.fitBounds(schools.getBounds());

  });
 map.scrollWheelZoom.disable();