document.addEventListener("DOMContentLoaded", function(){
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

			var svg = d3.select("body").append("svg")
			    .attr("width", width)
			    .attr("height", height);

			var graticule = d3.geo.graticule()
			    .extent([[180, 180], [-180, -180]])
			    .step([5, 5]);

			d3.json("world.json", function(error, world) {
			  svg.selectAll(".subunit")
					.data(topojson.feature(world, world.objects.subunits).features)
					.enter().append("path")
					.attr("class", function(d) { return "subunit " + d.id; })
					.attr("d", path);

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
			    .attr("class", "graticule")
			    .attr("d", path);



			});
}, false);
	