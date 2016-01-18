/*
    INITIALIZER
*/

queue()
    .defer(d3.json, 'http://localhost:3000/data/us.json')
    .defer(d3.csv, 'http://localhost:3000/data/mkareas.csv')
    .defer(d3.csv, 'http://localhost:3000/data/us-fips-codes.csv')
    .await(baseMap);

function countyIn50States(elem) {
    "use strict";
    return elem.id < 70000;
}

function baseMap(error, us, marketVectors, fipsVectors) {
    "use strict";
    console.log('basemap');
    if (error) { console.warn(error); }

    //indices
    var i, sid, cid;
    
    //id mappings
    var idToName = {};
    var idToMarketArea = {};
    
    //constants
    var infoBox, infoWidth = 300;
    var aspectRatio = 0.4;
    var scaleRatio = 0.85;
    var sidebarRatio = 1;
    
    //create market area mappings
    for (i = 0; i < marketVectors.length; i++) {
        sid = parseInt(marketVectors[i].state_id, 10);
        idToMarketArea[sid] = marketVectors[i].mk_area;
    }
    
    //create name mappings
    for (i = 0; i < fipsVectors.length; i++) {
        sid = parseInt(fipsVectors[i].state_id, 10);
        cid = parseInt(fipsVectors[i].county_id, 10) + sid * 1000;
        idToName[cid] = fipsVectors[i].county;
        idToName[sid] = fipsVectors[i].state;
    }
    
    //county shapes in 50 states
    var countyGeoJSON = topojson.feature(us, us.objects.counties).features.filter(countyIn50States);
    
    //all state shapes
    var stateGeoJSON = topojson.feature(us, us.objects.states).features;
    
    //interior facing borders of states
    var stateBorderGeoJSON = topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; });
    
    //size of map
    var m_width = document.getElementById("map").offsetWidth;
    var width = 938;
    var height = 500;
    
    //projection and map size
    var projection = d3.geo.albersUsa()
        .scale(width * scaleRatio)
        .translate([width * sidebarRatio / 2, height / 2]);
    
    //path for projection
    var path = d3.geo.path()
        .projection(projection);
    
    //add svg to body
    var svg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", m_width)
        .attr("height", m_width * height / width);
    
    //add background to svg
    svg.append("rect")
        .attr("class", "background")
        .attr("width", "100%")
        .attr("height", "100%");
    
    //add object container to svg
    var g = svg.append("g");
    var gPins = svg.append("g");
    
    //add county shapes container to container
    g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(countyGeoJSON)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "county-boundary");
    
    //add state shapes container to container
    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(stateGeoJSON)
        .enter().append("path")
        .attr("d", path)
        .attr("class", function (d) { return "state " + idToMarketArea[d.id]; });
    
    //add state borders container to container
    g.append("path")
        .datum(stateBorderGeoJSON)
        .attr("id", "state-borders")
        .attr("d", path);
}


