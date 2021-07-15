//Creating function that will size circle marker based on magnitude
function markerSize(magnitude){
    return magnitude * 2
};

//Creating our map
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

//Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

//Link to url 
var queryUrl =  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var geojson;

//Setting color for markers based on depth
function setColor(depth){
    if (depth > 90){
        return "#F51313"
    } else if (depth <= 90 && depth > 70){
        return "#F56713"
    } else if (depth <= 70 && depth > 50){
        return "#F59C13"
    } else if (depth <= 50 && depth > 30){
        return "#F5C413"
    } else if (depth <= 30 && depth > 10){
        return "#D2F513"
    } else {
        return "#83F513"
    }
}

//Creating function that will style markers
function styleThis(feature){
    return {
        radius: markerSize(feature.properties.mag),
        fillColor: setColor(feature.geometry.coordinates[2]),
        stroke: true,
        weight: .75,
        color: "#000000",
        fillOpacity: .75,
        opacity: .75
    }
}

//Using d3 to get data from url
d3.json(queryUrl).then(function(data){

    var earthquakeLayer = new L.LayerGroup();

    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng)
        }, 
        style: styleThis,
        onEachFeature: function(feature, layer){
            layer.bindPopup(feature.properties.title)
        }
    }).addTo(earthquakeLayer);

    earthquakeLayer.addTo(myMap);

    var legend = L.control({position: "bottomright"});

    //Creating legend
    legend.onAdd = function(map){
        var div = L.DomUtil.create("div", "info legend");
        var labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];
        var labelColors = ["#83F513", "#D2F513", "#F5C413", "#F59C13", "#F56713", "#F51313"];
        var ulArray = [];

        var legendInfo = "<h2>Earthquake Depth</h2>"
        div.innerHTML = legendInfo;

        for (var i=0; i < labels.length; i++){

            ulArray.push(
                '<p> <p style="background-color:' + labelColors[i] + '; height: 10px; width: 10px; padding 5px 5px"></p>' +
                '<span> ' + labels[i] + '</span> </p>'
                // `<p> 
                // <p style="background-color:${labelColors[i]}; height: 10px; width: 10px; padding 5px 10px"></p>
                // &nbsp; <span>${labels[i]}</span>
                // </p>`
            )
            
        };

        div.innerHTML += "<div" + ulArray.join("") + "</div>";
        return div;

    };

    legend.addTo(myMap);

});
