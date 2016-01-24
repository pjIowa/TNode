

//currently selected state, county
var selectedStateID = 0, selectedCountyID = 0;

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

var countyGeoJSON;
var stateGeoJSON;
var stateBorderGeoJSON;

var m_width, width, height;

var projection;
var path;
var svg;
var g, gPins;

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
    if (error) { console.warn(error); }
    
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
    countyGeoJSON = topojson.feature(us, us.objects.counties).features.filter(countyIn50States);
    
    //all state shapes
    stateGeoJSON = topojson.feature(us, us.objects.states).features;
    
    //interior facing borders of states
    stateBorderGeoJSON = topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; });
    
    //size of map
    m_width = document.getElementById("map").offsetWidth;
    width = 938;
    height = 500;
    
    //projection and map size
    projection = d3.geo.albersUsa()
        .scale(width * scaleRatio)
        .translate([width * sidebarRatio / 2, height / 2]);
    
    //path for projection
    path = d3.geo.path()
        .projection(projection);
    
    //add svg to body
    svg = d3.select("#map").append("svg")
        .attr("preserveAspectRatio", "xMidYMid")
        .attr("viewBox", "0 0 " + width + " " + height)
        .attr("width", m_width)
        .attr("height", m_width * height / width);
    
    //add background to svg
    svg.append("rect")
        .attr("class", "background")
        .attr("width", "100%")
        .attr("height", "100%")
        .on("click", clickedMap);
    
    //add object container to svg
    g = svg.append("g");
    gPins = svg.append("g");
    
    //add county shapes container to container
    g.append("g")
        .attr("id", "counties")
        .selectAll("path")
        .data(countyGeoJSON)
        .enter().append("path")
        .attr("d", path)
        .attr("class", "county-boundary")
        .on("click", clickedMap);
    
    //add state shapes container to container
    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(stateGeoJSON)
        .enter().append("path")
        .attr("d", path)
        .attr("class", function (d) { return "state " + idToMarketArea[d.id]; })
        .on("click", clickedMap);
    
    //add state borders container to container
    g.append("path")
        .datum(stateBorderGeoJSON)
        .attr("id", "state-borders")
        .attr("d", path);
}

function plotPoints(data){
    svg.selectAll("circle")
        .transition()
        .delay(function(d, i) { return i * 2; })
        .attr("r", 0)
        .remove()
    
    gPins.selectAll(".pin") // add circles to new g element
        .data(data)
        .enter().append("circle", ".pin")
        .attr("transform", function(d) { 
        return "translate(" + projection([d.longitude,d.latitude]) + ")"; 
    })
        .attr("r", 0 )
        .transition()
        .duration(500)
        .delay(function(d, i) { return i * 5; })
        .attr("r", 1.0 );
}

function clickedMap(obj) {
    "use strict";
    if (obj) {
        if ((obj.id < 1000) && (selectedStateID !== obj.id)) {//state clicked 
            hideCounties();
            selectedStateID = obj.id;
            showCounties();
            zoomIntoObject(obj);
        } else if (selectedCountyID !== obj.id) {//county clicked
            selectedCountyID = obj.id;
            zoomIntoObject(obj);
        } else {//county clicked twice
            hideCounties();
            revertToInitial();
        }
    } else {//background clicked
        revertToInitial();
    }
}

function zoomIntoObject(obj) {
    "use strict";
        //get x,y
    var centroid = path.centroid(obj),
    x = centroid[0],
    y = centroid[1],
    bounds = path.bounds(obj),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    k = 0.9 / Math.max(dx / width, dy / height);
        
    //perform animation
    animateMap(x,y,k);
}

function revertToInitial() {
    "use strict";
    var x, y, k;
    //get center of us map
    x = width / 2;
    y = height / 2;
    k = 1;
    
    //hide counties
    hideCounties();
    
    //reset id's
    selectedStateID = 0;
    selectedCountyID = 0;
    
    //perform animation
    animateMap(x,y,k);
}

function animateMap(x,y,k) {
    "use strict";
    
    //translate and resize map
    g.transition()
        .duration(500)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
}

function animatePoints(x,y,k) {
    "use strict";
    
    //translate and resize grid map
    gPins.transition()
        .duration(500)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
    
    //resize point itself
    gPins.selectAll("circle")
        .transition()
        .duration(500)
        .attr("r", 5.0 / k);
}

function hideCounties() {
    "use strict";
    g.selectAll("path")
        .filter(function (d) { return (d.id === selectedStateID); })
        .classed("active", false);
}
    
function showCounties() {
    "use strict";
    g.selectAll("path")
        .filter(function (d) { return (d.id === selectedStateID); })
        .classed("active", true);
}