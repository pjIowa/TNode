/* GLOBAL VARIABLES */
"use strict";

//currently selected state, county
var selectedStateID = 0, selectedCountyID = 0;

//id mappings
var idToName = {};
var idToPopulationDensity = {};
var idToStateTweetDensity = {};
var idToCountyTweetDensity = {};

//constants
var infoBox, infoWidth = 300;
var aspectRatio = 0.4;
var scaleRatio = 0.85;
var sidebarRatio = 1;

//JSON structures for building map
var countyGeoJSON;
var stateGeoJSON;
var stateBorderGeoJSON;

//map size params
var m_width, width, height;

//detail view params
var detailViewParams = function () {
    var detailScale = .25;
    return {
        w: width*detailScale,
        h: height*detailScale,
        x: width-width*detailScale,
        y: height-height*detailScale
    };
}

//map manipulators
var projection, path, svg, g, gPins;

/* INITIALIZER */

queue()
    .defer(d3.json, 'http://localhost:3000/data/us.json')
    .defer(d3.csv, 'http://localhost:3000/data/us-fips-codes.csv')
    .defer(d3.csv, 'http://localhost:3000/data/census.csv')
    .defer(d3.json, 'http://localhost:3000/stateCounts')
    .defer(d3.json, 'http://localhost:3000/countyCounts')
    .await(baseMap);

function countyIn50States(elem) {
    return elem.id < 70000;
}

function baseMap(error, us, fipsVectors, censusVectors, stateCountVectors, countyCountVectors) {
    if (error) { console.warn(error); }
    
    //create name mappings
    for (var i = 0; i < fipsVectors.length; i++) {
        var sid = parseInt(fipsVectors[i].state_id, 10);
        var cid = parseInt(fipsVectors[i].county_id, 10) + sid * 1000;
        idToName[cid] = fipsVectors[i].county;
        idToName[sid] = fipsVectors[i].state;
    }
    
    //create census mappings
    for(var i = 0; i < censusVectors.length; i++) {
        var fipsid = parseInt(censusVectors[i].fips, 10);
        idToPopulationDensity[fipsid] = parseFloat(censusVectors[i].density);
    }
    
    //create count mappings
    for(var i = 0; i < stateCountVectors.length; i++) {
        var fipsid = parseInt(stateCountVectors[i].stateid, 10) * 1000;
        idToStateTweetDensity[fipsid] = parseFloat(stateCountVectors[i].count) / idToPopulationDensity[fipsid];
    }
    
    for(var i = 0; i < countyCountVectors.length; i++) {
        var fipsid = parseInt(countyCountVectors[i].countyid, 10);
        idToCountyTweetDensity[fipsid] = parseFloat(countyCountVectors[i].count) / idToPopulationDensity[fipsid];
    }
    
    
    
    var stateQuantize = d3.scale.quantize()
    .domain([d3.min(d3.values(idToStateTweetDensity)), d3.max(d3.values(idToStateTweetDensity))])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
    
    var countyQuantize = d3.scale.quantize()
    .domain([d3.min(d3.values(idToCountyTweetDensity)), d3.max(d3.values(idToCountyTweetDensity))])
    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));
    
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
        .attr("class", function (d) { 
        return  "county-boundary " + countyQuantize(idToCountyTweetDensity[d.id]); 
    } ) 
        .on("mouseover", mouseOverMap)
        .on("mouseout", mouseOutMap)
        .on("click", clickedMap);
    //add state shapes container to container
    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(stateGeoJSON)
        .enter().append("path")
        .attr("d", path)
        .attr("class", function (d) {
        return  "state " + stateQuantize(idToStateTweetDensity[d.id*1000]); 
    } ) 
        .on("mouseover", mouseOverMap)
        .on("mouseout", mouseOutMap)
        .on("click", clickedMap);
    
    //add state borders container to container
    g.append("path")
        .datum(stateBorderGeoJSON)
        .attr("id", "state-borders")
        .attr("d", path);
    
    var detailParams = detailViewParams();
    
    svg.append("rect")
        .attr("class", "detail")
        .attr("width", detailParams.w)
        .attr("height", detailParams.h)
        .attr("x", detailParams.x)
        .attr("y", detailParams.y);
    
    svg.append("text")
        .attr("class", "title")
        .attr("width", detailParams.w)
        .attr("height", detailParams.h)
        .attr("x", detailParams.x+10)
        .attr("y", detailParams.y+25)
        .text("Touch the map!");
    
     var textBox = svg.append("text")
        .attr("width", detailParams.w)
        .attr("height", detailParams.h)
        .attr("x", detailParams.x+10)
        .attr("y", detailParams.y+45)
     
        textBox.append('svg:tspan')
        .attr("class", "description_1")
        .attr('x', detailParams.x+10)
        .attr('dy', 10)
        .text("do it.")
     
        textBox.append('svg:tspan')
        .attr("class", "description_2")
        .attr('x', detailParams.x+10)
        .attr('dy', 20)
        .text("get to tha choppa.");
}

/* USER INTERACTION */

function clickedMap(obj) {
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

function mouseOverMap(obj) {
    d3.select('.title').text(idToName[obj.id]);
    d3.selectAll('.description_1').text('clicked on a ');
    if (obj.id < 1000) {
        d3.selectAll('.description_2').text('state');
    }
    else {
        d3.selectAll('.description_2').text('county');
    }
}

function mouseOutMap(obj) {
    d3.select('.title').text("Touch the map!");
    d3.selectAll('.description_1').text('');
    d3.selectAll('.description_2').text('');
}

/* POINTS */

function plotPoints(data) {
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



/* UI HELPERS */

function zoomIntoObject(obj) {
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
    
    //reset detail
    d3.select('.title').text("Touch the map!");
    d3.selectAll('.description_1').text('');
    d3.selectAll('.description_2').text('');
}

function animateMap(x,y,k) {
    //translate and resize map
    g.transition()
        .duration(500)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px");
}

function animatePoints(x,y,k) {
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
    g.selectAll("path")
        .filter(function (d) { return (d.id === selectedStateID); })
        .classed("active", false);
}
    
function showCounties() {
    g.selectAll("path")
        .filter(function (d) { return (d.id === selectedStateID); })
        .classed("active", true);
}