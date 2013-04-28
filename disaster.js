document.addEventListener("DOMContentLoaded", function(){
  d3.csv('Disaster_Data.csv', function(data){
  	console.log(data[575].Type);
  });

//Size of Map
	var width = 1280;
	var height = 680;

//Placement of Map
	var projection = d3.geo.miller()
			.center([0,45])
	    .scale(195)
	    .translate([width / 2, height / 2.5]);

	var path = d3.geo.path()
	    .projection(projection);

	var graticule = d3.geo.graticule();
	

	var svg = d3.select("body").append("svg")
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
		  			// .duration(500)
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

	  svg.append("path")
	    .datum(graticule)
	    .attr("class", "graticule line")
	    .attr("d", path);

	  //Lat, Long Lines
	  svg.append('path')
		  .datum(graticule.outline)
		  .attr('class', 'graticule outline')
		  .attr('d', path);

	  svg.append("circle")
	    .attr("r",5)
	    .attr('fill', 'red')
	    .attr("transform", function() {return "translate(" + projection([-97, 38]) + ")";});

    //EARTHQUAKE!!!
	  setInterval(function(){
	  	svg.append("circle")
	    .attr("transform", function() {return "translate(" + projection([-97, 38]) + ")";})
	    .attr('fill', 'none')
	    .attr('r', 1)
	    .style('stroke', 'red')
	    .style('stroke-width', 5)
	    .transition()
	    .attr("r",50)
	    .ease('sine')
	    .style('stroke-opacity', 0)
	    .duration(2000)
	    .remove()
	  }, 800);
	  


	  // d3.select('.subunit').on('click', function(){
	  // 	 console.log($(this));
	  // 	 var activeCountry = $(this)[0].__data__.id;
	  // 	 $(this[0]).addClass('active');
	  // 	 console.log(activeCountry);
	  // });

	});
}, false);
	