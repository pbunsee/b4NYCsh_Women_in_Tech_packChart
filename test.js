var diameter = 500,
    format = d3.format(",d"),
    dataSource = 2;

var pack = d3.layout.pack()
    .size([diameter - 3, diameter - 3])
    .padding(2)
    .sort(function(a, b) {
        return -(a.value - b.value);
    })
    .value(function(d) { return d.size; });

var svg = d3.select("#test-container").append("svg")
    .attr("width", diameter + 300)
    .attr("height", diameter);

var parties = [
                { name: "Conservative", color:"#6495ed" },
                { name: "New Democratic", color:"#f4a460" },
                { name: "Liberal", color:"#F08080" },
                { name: "Bloc Québécois", color:"#87CEFA" },
                { name: "Green", color:"#2F873E" }
              ];

var provincies = [
                { name: "British Columbia", acronym: "BC" },
                { name: "Alberta", acronym: "AL" },
                { name: "Saskatchewan", acronym: "SK" },
                { name: "Manitoba", acronym: "MB" },
                { name: "Ontario", acronym: "ON" },
                { name: "Quebec", acronym: "BC" },
                { name: "New Brunswick", acronym: "NB" },
                { name: "Nova Scotia", acronym: "NS" },
                { name: "Prince Edward Island", acronym: "PE" },
                { name: "Newfoundland and Labrador", acronym: "NL" },
                { name: "Yucon", acronym: "YT" },
                { name: "Northwest Territories", acronym: "NT" },
                { name: "Nunavut", acronym: "NU" }
              ];

var buttonData = ["Original", "Constant", "Random"];
var buttonDiv = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", 50);
var buttons = buttonDiv.selectAll(".updateButton")
	.data(buttonData)
   .enter()
	.append('g')
	.attr("class", "updateButton")
	.on("click", function(d, i) {
		dataSource = i;
		updateVis();		
	});
buttons.append("rect")
	.attr("x", function(d, i) { return (i * 100) + 100; })
    .attr("width", 98)
    .attr("height", 25)
    .attr("ry", 5)
    .style("stroke", "#787878")
    .style("fill", "tan");
buttons.append("text")
    .attr("x", function(d, i) { return (i * 100) + (100 / 2) + 98; }) 
    .attr("y", 12)
    .attr("dy", "0.35em")
    .style("text-anchor", "middle")
    .style("font-size", "15px")
    .text(function(d) { return d; });

var data = getData();

var legendParties = svg.append("g")
    .attr("class", "legend")
    .attr("width", 300)
    .attr("height", diameter)
   .selectAll(".legend-parties-item")
    .data(parties) //Changed this line from your code
   .enter()
    .append("g")
    .attr("class", "legend-parties-item");

legendParties.append("rect")
    .attr("x", diameter + 50)
    .attr("y", function(d, i) { return 40 + i * 25; })
    .attr("width", 18)
    .attr("height", 18)
    .style("opacity", 0.8)
    .style("fill", function(d) { return d.color; });

legendParties.append("text")
    .attr("x", diameter + 80)
    .attr("y", function(d, i) { return 40 + i * 25; })
    .attr("dy", "0.9em")
    .style("opacity", 0.8)
    .text(function(d) { return d.name; });

var legendProvincies = svg.append("g")
    .attr("class", "legend")
    .attr("width", 300)
    .attr("height", diameter)
   .selectAll(".legend-provinces-item")
    .data(provincies) //Changed this line from your code
   .enter()
    .append("g")
    .attr("class", "legend-provinces-item");

legendProvincies.append("text")
    .attr("x", diameter + 50)
    .attr("y", function(d, i) { return 40 + 150 + i * 20; })
    .attr("dy", "0.9em")
    .style("opacity", 0.8)
    .text(function(d) { return d.acronym; });

legendProvincies.append("text")
    .attr("x", diameter + 80)
    .attr("y", function(d, i) { return 40 + 150 + i * 20; })
    .attr("dy", "0.9em")
    .style("opacity", 0.8)
    .text(function(d) { return d.name; });

var vis = svg.datum(data).selectAll(".node")
    .data(pack.nodes)
   .enter()
    .append("g");

var titles = vis.append("title")
    .text(function(d) {
        if (!d.children) {
            return d.parent.name.toUpperCase() + " - " +
                d.name + ": " + format(d.value);
        } else {
            return d.name;
        }
    });

var circles = vis.append("circle")
    .attr("stroke", "#bbbbbb")
    .style("opacity", function(d) {
        return !d.children ? 0.8 : 0.2;
    })
    .style("fill", function(d) {
        if (!d.children) {
            return getColor(d.name);
        } else if (d.depth == 1){
            return "#ffffff";
        }
        return "#ffffff";
    })
    .style("fill", function(d) { return getColor(d.name); })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return d.r; });


function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}


function describeArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, 1, 1, end.x, end.y
    ].join(" ");
    return d;       
}

var arcs = vis.append("path")
    .attr("fill","none")
    .attr("id", function(d,i){return "s"+i;})
    .attr("d", function(d,i) {
        return describeArc(d.x, d.y, d.r, 160, -160)
    } );

var arcPaths = vis.append("g")
    .style("fill","navy");
var labels = arcPaths.append("text")
    .style("opacity", function(d) {
        if (d.depth == 0) {
            return 0.0;
        }
        if (!d.children) {
            return 0.0;
        }
        var sumOfChildrenSizes = 0;
        d.children.forEach(function(child){sumOfChildrenSizes += child.size;});
        //alert(sumOfChildrenSizes);
        if (sumOfChildrenSizes <= 5) {
            return 0.0;
        }
        return 0.8;
    })
    .attr("font-size",10)
    .style("text-anchor","middle")
    .append("textPath")
    .attr("xlink:href",function(d,i){return "#s"+i;})
    .attr("startOffset",function(d,i){return "50%";})
    .text(function(d){return d.name.toUpperCase();})

//updateVis();

function getColor(partyName) {
    if (partyName == "Conservative") {
        return "#6495ed";
    } else if (partyName == "New Democratic") {
        return "#f4a460";
    } else if (partyName == "Liberal") {
        return "#F08080";
    } else if (partyName == "Bloc Québécois") {
        return "#87CEFA";
    } else if (partyName == "Green") {
        return "#2F873E";
    }
    return "#ffffff";
};

function updateVis() {

    if (dataSource == 0)
        pack.value(function(d) { return d.size; });
    if (dataSource == 1)
        pack.value(function(d) { return 100; });
    if (dataSource == 2)
        pack.value(function(d) { return 1 +
                 Math.floor(Math.random()*301); });

    var data1 = pack.nodes(data);

    titles = vis.append("title")
        .text(function(d) {
            if (!d.children) {
                return d.parent.name.toUpperCase() + " - " +
                        d.name + ": " + format(d.value);
            } else {
                return d.name;
        }
    });

    circles.transition()
        .duration(5000)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return d.r; });

};


function getData() {
return {
 "name": "Election 2011",
 "children": [
  {
   "name": "British Columbia",
   "acronym": "BC",
   "children": [
      {"name": "Conservative", "size": 21},
      {"name": "New Democratic", "size": 12},
      {"name": "Liberal", "size": 2},
      {"name": "Green", "size": 1}
    ]
  },{
   "name": "Alberta",
   "acronym": "AB",
   "children": [
      {"name": "Conservative", "size": 27},
      {"name": "New Democratic", "size": 1}
    ]
  },{
   "name": "Saskachewan",
   "acronym": "SK",
   "children": [
      {"name": "Conservative", "size": 13},
      {"name": "Liberal", "size": 1}
   ]
  },{
   "name": "Manitoba",
   "acronym": "MB",
   "children": [
      {"name": "Conservative", "size": 11},
      {"name": "New Democratic", "size": 2},
      {"name": "Liberal", "size": 1}
    ]
  },{
   "name": "Ontario",
   "acronym": "MB",
   "children": [
      {"name": "Conservative", "size": 73},
      {"name": "New Democratic", "size": 22},
      {"name": "Liberal", "size": 11}
    ]
  },{
   "name": "Quebec",
   "acronym": "QC",
   "children": [
      {"name": "Conservative", "size": 5},
      {"name": "New Democratic", "size": 59},
      {"name": "Liberal", "size": 7},
      {"name": "Bloc Québécois", "size": 4}
    ]
  },{
   "name": "New Bruncwick",
   "acronym": "NB",
   "children": [
      {"name": "Conservative", "size": 8},
      {"name": "New Democratic", "size": 1},
      {"name": "Liberal", "size": 1}
    ]
  },{
   "name": "Nova Scotia",
   "acronym": "NS",
   "children": [
      {"name": "Conservative", "size": 4},
      {"name": "New Democratic", "size": 3},
      {"name": "Liberal", "size": 4}
    ]
  },{
   "name": "Prince Edward Island",
   "acronym": "PE",
   "children": [
      {"name": "Conservative", "size": 1},
      {"name": "New Democratic", "size": 0},
      {"name": "Liberal", "size": 3}
    ]
  },{
   "name": "Newfoundland and Labrador",
   "acronym": "PE",
   "children": [
      {"name": "Conservative", "size": 1},
      {"name": "New Democratic", "size": 2},
      {"name": "Liberal", "size": 4}
    ]
  },{
   "name": "Yucon",
   "acronym": "YT",
   "children": [
      {"name": "Conservative", "size": 1},
      {"name": "New Democratic", "size": 0},
      {"name": "Liberal", "size": 0}
    ]
  },{
   "name": "Northwest Territories",
   "acronym": "NT",
   "children": [
      {"name": "Conservative", "size": 0},
      {"name": "New Democratic", "size": 1},
      {"name": "Liberal", "size": 0}
    ]
  },{
   "name": "Nunavut",
   "acronym": "NU",
   "children": [
      {"name": "Conservative", "size": 1},
      {"name": "New Democratic", "size": 0},
      {"name": "Liberal", "size": 0}
    ]
  }
 ]
};
};
  
