window.addEventListener("DOMContentLoaded", function(){
//About Info
var aboutInfo = ["Earthquake data from Wikipedia, and the USGS. <br> Each magnitude is exaggerated in order to visualize the the differences in each order in magnitude."];

//Size of Map
	var width = 1280;
	var height = 680;

//Placement of Map
	window.projection = d3.geo.miller()
		.center([0,35])
	  .scale(195)
	  .translate([width / 2, height / 2.5]);

	window.path = d3.geo.path()
	    .projection(projection);

	window.graticule = d3.geo.graticule();
	

	window.svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);
	  
	d3.json("resources/world.json", function(error, world) {
	  svg.selectAll(".subunit")
			.data(topojson.feature(world, world.objects.subunits).features)
			.enter().append("path")
			.attr("class", function(d) { return "subunit" + d.id; })
			.attr("d", path)
    
	  //Bordering
	    //Exterior
      svg.append("path")
	    .datum(topojson.mesh(world, world.objects.subunits, function(a, b) { return a === b; }))
	    .attr("d", path)
	    .attr("class", "coast");
          
      //Interior  
	  svg.append("path")
	    .datum(topojson.mesh(world, world.objects.subunits, function(a, b) { return a !== b; }))
	    .attr("d", path)
	    .attr("class", "border");

	  //Lat, Long Lines
	  svg.append("path")
	    .datum(graticule)
	    .attr("class", "graticule line")
	    .attr("d", path);
	  
	  svg.append("path")
		  .datum(graticule.outline)
		  .attr("class", "graticule outline")
		  .attr("d", path);

	// All Earthquake Data
    earthquakeData = [];

	  d3.csv("Resources/Earthquake_Data1.csv", function(data){
	  	data.forEach(function(d){
	  		earthquakeData.push(d);
	  	});
	  	hasEarthquakeData();
	  });

	  function hasEarthquakeData(){
	  	// Coordinates for Each Earthquake
		  coordinates = [];
		  var coordMaker = function(earthquakeData) {
		  	for (i = 0; i < earthquakeData.length; i++){
		  		var eachCoord =[];
		  		eachCoord.push(earthquakeData[i].Longitude);
		  		eachCoord.push(earthquakeData[i].Latitude);
		  		coordinates.push(eachCoord);
		  	}
		  	return coordinates;
		  };
		  coordMaker(earthquakeData);
		  

		  var magMaker = function(earthquakeData) {
		  	for (i = 0; i < earthquakeData.length; i++){
		  		var re = /\d../;
		  		coordinates[i].push(parseFloat(re.exec(earthquakeData[i].Magnitude)));
		  	}
		  	return coordinates;
		  };
		  magMaker(earthquakeData);
		  console.log(coordinates);

		  dates = [];
		  var dateTaker = function(earthquakeData) {
		  	for (i = 0; i < earthquakeData.length; i++){
		  		dates.push(earthquakeData[i]["Origin (UTC)"].slice(-4));
		  	}
		  	return dates;
		  };
		  dateTaker(earthquakeData);



      //Make Epi-centers
		  svg.selectAll("circle-center")
		    .data(coordinates)
		    .enter()
		    .append("circle")
		    .attr("r", 0)
		    .attr("fill", "red")
		    .attr("opacity", 1)
		    .attr("transform", function(d) {return "translate(" + projection(d) + ")";})
		    .transition()
		    .ease("sine")
		    .delay(function(d, i ) { return i * 100 })
		    .duration(1000)
	        .attr("r", 4)
	        .transition()
	        .delay(function(d, i ) { return i * 100 + 1000 })
	        .duration(1000)
	        .attr("opacity", 0.50);

      //Make Rings
		  svg.selectAll("rings")
		    .data(coordinates)
		    .enter()
		    .append("circle")
		    .attr("r",0)
		    .attr("stroke", "red")
		    // .attr("fill", none)
		    .attr("stroke-opacity", 2)
		    .attr("transform", function(d) {return "translate(" + projection(d) + ")";})
		    .transition()
		    .delay(function(d, i ) { return i * 100 })
		    .duration(4500)
	        .attr("stroke-opacity", 0)
	        .attr("fill", "none")
		    .attr("stroke", "red")
		    .attr("stroke-width", 3)
		    .attr("r", function(d, i) {  return Math.pow(d[2], 10) / 10000000})
		    .remove();

		  svg.selectAll("text")
		    .data(dates)
		    .enter()
		    .append("text")
		    .text(function(d) { return d; })
		    .attr("x", 50)
		    .attr("y", 600)
		    .attr("fill", "none")
		    .attr("opacity", .6)
		    .attr("font-family", "sans-serif")
		    .attr("font-size", "100px")
		    .transition()
		    .delay(function(d, i){ return i * 100 + 1000})
		    // .duration(1200)
		    .attr("fill","black")
		    .remove()
		}
	});

    $(".icon-info").on("click", function(){
        svg.append("rect")
        .attr("class", "about")
        .attr("fill", "#7f7f7f")
        .attr("width", 250)
        .attr("height", 150)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("x", 1000)
        .attr("y", -150)
        .attr("opacity", .8)
        .transition()
        .ease("sine")
        .duration(1500)
        .attr("y", -5)

        svg.selectAll("aboutInfo")
		    .data(aboutInfo)
		    .enter()
		    .append("text")
		    .text(function(d) { return d; })
		    .attr("x", 1000)
		    .attr("y", -150)
		    .attr("dx", -110)
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle")
		    .attr("fill", "white")
		    .attr("opacity", 1)
		    .attr("font-family", "sans-serif")
		    .attr("font-size", "12px")
		    .transition()
		    .ease("sine")
        .duration(1500)
        .attr("y", 25)
      });

}, false);