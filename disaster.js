window.addEventListener("DOMContentLoaded", function(){

//Size of Map
	var width = 1280;
	var height = 680;

//Placement of Map
	window.projection = d3.geo.miller()
			.center([0,45])
	    .scale(195)
	    .translate([width / 2, height / 2.5]);

	window.path = d3.geo.path()
	    .projection(projection);

	window.graticule = d3.geo.graticule();
	

	window.svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);
	  
	d3.json("world.json", function(error, world) {
	  svg.selectAll(".subunit")
			.data(topojson.feature(world, world.objects.subunits).features)
			.enter().append("path")
			.attr("class", function(d) { return "subunit " + d.id; })
			.attr("d", path)
	  	.on('mouseover', function(e) {
	  	  d3.select(this)
	  	  .transition()
	  		.ease('cubic')
			  .attr('fill', '#ffc726')
		  })
		  .on('mouseout', function(e) {
				d3.select(this)
				.transition()
				.ease('cubic')
				.attr('fill', 'black')
			})
			.on('click', function() {
			  console.log($(this)[0].__data__.id);
			})
    
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
	  
	  svg.append('path')
		  .datum(graticule.outline)
		  .attr('class', 'graticule outline')
		  .attr('d', path);

		// longi = earthquakeData[1338].Longitude;
    // lati = earthquakeData[1338].Latitude;

	  // All Earthquake Data
    earthquakeData = [];

	  d3.csv('Earthquake_Data.csv', function(data){
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
		  console.log(coordinates);

		  svg.selectAll("circle-center")
		    .data(coordinates)
		    .enter()
		    .append("circle")
		    .attr("r", 0)
		    .attr("fill", "red")
		    .attr('opacity', 1)
		    .attr("transform", function(d) {return "translate(" + projection(d) + ")";})
		    .transition()
		    .ease('sine')
		    .delay(function(d, i ) { return i * 100 })
		    .duration(1000)
        .attr("r", 4)
        .transition()
        .delay(function(d, i ) { return i * 100 + 1000 })
        .duration(1000)
        .attr('opacity', 0.50);


		  svg.selectAll("rings")
		    .data(coordinates)
		    .enter()
		    .append("circle")
		    .attr('r',0)
		    .attr("transform", function(d) {return "translate(" + projection(d) + ")";})
		    .transition()
		    .delay(function(d, i ) { return i * 100 })
		    .duration(5000)
        .attr("r", 30)
        .attr("fill", "none")
		    .attr('stroke', 'red')
		    .attr('stroke-width', 3)
		    .remove()

		  // 	 var activeCountry = $(this)[0].__data__.id;

		}

	});
}, false);