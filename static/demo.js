BASECOORDS = [51.3150172,9.3205287];

var blueIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
	shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var goldIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
	shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var redIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
	shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var greenIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
	shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var orangeIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
	shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var yellowIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
	shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var violetIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
	shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var greyIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
	shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var blackIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
	shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});


function add_title_layer() {
    var TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    var MB_ATTR = 'Ein Forschungsprojekt der Medizinischen Fakultät Mannheim der Universität Heidelberg. <a href="/info">Informationen zum Projekt und Spendenaufruf</a>, <a href="/impressum">Impressum</a>,  <a href="/delete">Daten löschen</a>, Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
    L.tileLayer(TILE_URL, {attribution: MB_ATTR}).addTo(map);
}


function makeMap() {

    map = L.map('map').setView(BASECOORDS, 6);
    map.on('locationfound', onLocationFound);
    //map.on('locationerror', onLocationError);
    add_title_layer()
}

var reportlayer = L.layerGroup();
var rki_layer = L.layerGroup();
var kreisareas = L.layerGroup();

function onLocationFound(e) {
    var radius = e.accuracy;

    //L.marker(e.latlng).addTo(map)
    //    .bindPopup("You are within " + radius + " meters from this point").openPopup();

    // L.circle(e.latlng, radius).addTo(map);
}




function renderData() {
	var zoomlevel = map.getZoom();
	var display_option = document.querySelector('input[name="display_options"]:checked').value;


	function onEachFeature(feature, layer) {
		if(feature.properties.cases){
			layer.bindTooltip(
				String(feature.properties.cases),
				{
					className: 'tooltip',
					permanent: true, 
					direction:"center",
					opacity: 0.8
				}
			).openTooltip()
		}
		/* crashes the browser window, too computationally expensive for large number of PLZ areas?
		if(feature.properties.estimated_cases){
			layer.bindTooltip(
				"~ " + String(feature.properties.estimated_cases),
				{
					className: 'tooltip',
					permanent: true, 
					direction:"center",
					opacity: 0.8
				}
			).openTooltip()
		}
		*/
	}
    function get_risklayers(data) {
        layers =  L.geoJSON(data, {
            onEachFeature: onEachFeature,
            style: function (feature) {
                let s = {
                    opacity: 1.0,
                    weight:1,
                    fillOpacity: 0.8,
                    color:"rgb(200,200,200)"
                }
                if (display_option == 'Landkreise') {
                    var cases = feature.properties.cases_per_population;
                    var red_cases = 0.1;
                } else if (display_option == 'Bundesländer'){
                    var cases = feature.properties.Fallzahl/feature.properties.LAN_ew_EWZ*100;
                    var red_cases = 0.1;
                } else {
                    var cases = feature.properties.estimated_cases;
                    var red_cases = 100;
				}
                var hue = 60-60*cases/red_cases;
                if (hue < 0) hue = 0;
                s.fillColor = 'hsl('+hue+',100%,50%)'
                if (display_option == 'Postleitzahlen' && plz == feature.properties.plz) {
                    s.color= 'rgb(0,0,0)';
                    s.weight= 2;
                    var x_low = 400;
                    var x_high = 0;
                    var y_low = 400;
                    var y_high = 0;
                    var x = 0
                    var y = 0
                    for (const coord of feature.geometry.coordinates[0]){
                        x = parseFloat(coord[0])
                        y = parseFloat(coord[1])
                        if (x_high < x) x_high = x
                        if (x_low > x) x_low = x
                        if (y_high < y) y_high = y
                        if (y_low > y) y_low = y
                    }
                    var center = [0,0]
                    center[1] = x_low + ((x_high - x_low) / 2);
                    center[0] = y_low + ((y_high - y_low) / 2);
                    map.flyTo(center, 11);
                }
                return s;
            }
        });
        return layers
    }

    if (display_option == 'Bundesländer') {
            $.getJSON("/static/bundeslaender_simplify200.geojson", function (data) {
                county_areas = get_risklayers(data)
                county_areas.bindPopup(function (layer) {
                        var popup = "<p>"+ layer.feature.properties.Fallzahl + " positiv getestet in "
                        popup += layer.feature.properties.LAN_ew_GEN + "<br/>"+ layer.feature.properties.Death
                        popup += " Todesfälle<br/>"
                        return popup
                    })
                map.addLayer(county_areas);
			});
    }
    else if (display_option == 'Landkreise') {
        $.getJSON("/static/landkreise_simplify200.geojson", function (data) {
            kreisareas = get_risklayers(data)
            kreisareas.bindPopup(function (layer) {
				var popup = "<p>" + layer.feature.properties.cases + " positiv getestet in "
				popup += layer.feature.properties.BEZ + " " + layer.feature.properties.GEN + "<br/>"+ layer.feature.properties.deaths
				popup += " Todesfälle<br/>"
				return popup
            });
            map.addLayer(kreisareas);
		});
    }
    else if (display_option == 'Gemeinden') {
        $.getJSON("/static/gemeinden_estimated.geojson", function (data) {
            gemeindeareas = get_risklayers(data)
            gemeindeareas.bindPopup(function (layer) {
				var popup = "<p>" + layer.feature.properties.estimated_cases + " geschätzte positiv getestete Fälle in "
				popup += layer.feature.properties.BEZ + " " + layer.feature.properties.GEN + "<br/>basierend auf " + layer.feature.properties.Kreis
				return popup
            });
            map.addLayer(gemeindeareas);
		});
    }
    else if (display_option == 'Postleitzahlen') {
        $.getJSON("/static/plz.geojson", function (data) {
            plzareas = get_risklayers(data)
            plzareas.bindPopup(function (layer) {
				var popup = "<p>" + layer.feature.properties.estimated_cases + " geschätzte positiv getestete Fälle in "
				popup += layer.feature.properties.plz + "<br/>basierend auf " + layer.feature.properties.Kreis
				return popup
            });
            map.addLayer(plzareas);
		});
    }


    $.getJSON("/getreports", function(obj) {
        var markers = obj.data.map(function(arr) {
            var icon = greenIcon;
            if(arr["test"]=="Positiv"){
                icon = orangeIcon;
            }
            let marker = L.marker([arr["latitude"], arr["longitude"]], {icon: icon})
            marker.bindPopup('<p>'+arr["date"]+'<br/>Virustest: ' + arr["test"] + '</p>')
            return marker;
        });
        reportlayer = L.layerGroup(markers);
        map.addLayer(reportlayer);
	});
	
	/*
    $.getJSON("/getrki", function(obj) {

        var markers = obj.data.map(function(arr) {
			var icon = redIcon
			if(arr["ncases"] == 0){
				icon = blackIcon
			}
			if(arr["source"] == "RKI"){
				icon = blueIcon
			}
            let marker = L.marker([arr["latitude"], arr["longitude"]], {icon: icon});
            if (display_option == "Bundesländer") {
            }
            marker.bindPopup(arr["popup"])
            return marker;
        });

        rki_layer = L.layerGroup(markers);
        map.addLayer(rki_layer);

	});
	*/
}

function onChange() {
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    add_title_layer()
    renderData()
}

function init() {
    makeMap();
    map.locate({setView: true, maxZoom: 13});

    var filter = L.control({position: 'topright'});

    filter.onAdd = function (map) {
        var div = L.DomUtil.create('div');
        div.innerHTML = `
            <div id="filter_container">
              <button class="btn active" onclick="filterSelection('all')">Zeige alle Daten</button>
              <button class="btn" onclick="filterSelection('relevant')">Zeige relevante Fälle</button>
            </div>`;
        return div;
    }

    filter.addTo(map)
    var display_options = L.control({position: 'topright'});

    display_options.onAdd = function (map) {
        var div = L.DomUtil.create('div');
        div.innerHTML = `
            <div class="leaflet-control-layers leaflet-control-layers-expanded">
                <form onchange="onChange()" id="display_options">
                    <input type="radio" class="leaflet-control-layers-overlays" id="landkreise" name="display_options" value="Landkreise">
                    Landkreise</input><br>
                    <input type="radio" class="leaflet-control-layers-overlays" id="bundeslaender" name="display_options" value="Bundesländer">
                    Bundesländer</input><br>
                    <input type="radio" class="leaflet-control-layers-overlays" id="gemeinden" name="display_options" value="Gemeinden">
                    Gemeinden</input><br>
                    <input type="radio" class="leaflet-control-layers-overlays" id="plz" name="display_options" value="Postleitzahlen">
                    Postleitzahlen</input>
                </form>
            </div>`;

        return div;
    };

    display_options.addTo(map)
    if (plz == '00000'){
	    var display_option = document.querySelector('input[id="landkreise"]').checked = true;
    }
    else {
	    var display_option = document.querySelector('input[id="plz"]').checked = true;
    }

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        div.innerHTML += '<a href="/report"><img src="/static/add-button.svg" id="fixedbutton"></a>';
        return div;
    };

    legend.addTo(map);

    renderData();
}

$(init())
