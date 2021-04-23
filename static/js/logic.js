var myMap; 
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link,function(data){
       
    function createCircleMarker(feature,latlng){
        let options = {
            radius:feature.properties.mag*5,
            fillColor: chooseColor(feature.properties.mag),
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
        }
        return L.circleMarker( latlng, options );
    }


    var earthQuakes = L.geoJSON(data,{
        onEachFeature: function(feature,layer){
            layer.bindPopup("Title:"+feature.properties.title + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
        },
        pointToLayer: createCircleMarker

    });

    createMap(earthQuakes);

});
  
  function createMap(earthQuakes) {

    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: config.API_KEY
    });
  
    var baseMaps = {
      "Satellite": satellite,      
    };
  
        var overlayMaps = {Earthquakes: earthQuakes
    };
  
    var myMap = L.map("map", {
      center: [
        35.0,-95.7128906
      ],
      zoom: 5,
      layers: [satellite,earthQuakes]
    });  
    
    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div","legend");
        return div;
    }

    info.addTo(myMap);

    document.querySelector(".legend").innerHTML=displayLegend();

  }

  function chooseColor(mag){
    switch(true){
        case (mag<1):
            return "chartreuse";
        case (mag<2):
            return "greenyellow";
        case (mag<3):
            return "gold";
        case (mag<4):
            return "DarkOrange";
        case (mag<5):
            return "Peru";
        default:
            return "red";
    };
}

function displayLegend(){
    var legendInfo = [{
        limit: "0-1",
        color: "whote"
    },{
        limit: "1-2",
        color: "greenyellow"
    },{
        limit:"2-3",
        color:"gold"
    },{
        limit:"3-4",
        color:"DarkOrange"
    },{
        limit:"4-5",
        color:"Peru"
    },{
        limit:"5+",
        color:"red"
    }];

    var header = "<h3>Magnitude</h3><hr>";

    var strng = "";
   
    for (i = 0; i < legendInfo.length; i++){
        strng += "<p style = \"background-color: "+legendInfo[i].color+"\">"+legendInfo[i].limit+"</p> ";
    }    
    return header+strng;
}