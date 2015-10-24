var diameter = 700,
    format = d3.format(",d"),
    dataSource = 2;

var pack = d3.layout.pack()
    .size([diameter - 3, diameter - 3])
    .padding(10)
    .sort(function(a, b) {
        return -(a.value - b.value);
    })
    .value(function(d) { return d.size; });

var svg = d3.select("#overview-container").append("svg")
    .attr("width", diameter + 500)
    .attr("height", diameter);

var gender = [
                { name: "Men", color:"#6495ed" },
                { name: "Women", color:"#F08080" }
              ];

var measures = [
                { name: "2012 CompSci Grads", acronym: "1." },
                { name: "2013 Workforce", acronym: "2." },
                { name: "2014 Pay Dollar Comparison", acronym: "3." },
                { name: "Venture Capital Recipients", acronym: "4." },
                { name: "Venture Capital Investors", acronym: "5." },
                { name: "Software Developers", acronym: "6." },
                { name: "College Enrollment - General", acronym: "7." }
              ];

var data = getData();

var legendGender = svg.append("g")
    .attr("class", "legend")
    .attr("width", 300)
    .attr("height", diameter)
   .selectAll(".legend-gender-item")
    .data(gender) 
   .enter()
    .append("g")
    .attr("class", "legend-gender-item");

legendGender.append("rect")
    .attr("x", diameter + 50)
    .attr("y", function(d, i) { return 40 + i * 25; })
    .attr("width", 18)
    .attr("height", 18)
    .style("opacity", 0.8)
    .style("fill", function(d) { return d.color; });

legendGender.append("text")
    .attr("x", diameter + 80)
    .attr("y", function(d, i) { return 40 + i * 25; })
    .attr("dy", "0.9em")
    .style("opacity", 0.9)
    .text(function(d) { return d.name; });

var legendMeasures = svg.append("g")
    .attr("class", "legend")
    .attr("width", 300)
    .attr("height", diameter)
   .selectAll(".legend-measures-item")
    .data(measures) 
   .enter()
    .append("g")
    .attr("class", "legend-measures-item");

legendMeasures.append("text")
    .attr("x", diameter + 50)
    .attr("y", function(d, i) { return 40 + 150 + i * 20; })
    .attr("dy", "0.9em")
    .style("opacity", 0.9)
    .text(function(d) { return d.acronym; });

legendMeasures.append("text")
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
            return d.name + d.value;
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

var labels = vis.selectAll("text.label")
    .data(function(d) { console.log(d); return [d.value]; });
labels.enter().append("text")
    .attr({
      "class": "label",
      dy: "0.35em"
    })
    .style("text-anchor", "middle")
    .text(String);

/*
    .append("text")
          .text(function (d){ console.log("test " + d.value + " " + d.name); return d.value ; })
          .attr("fill", "#000")
            .attr("x", 0)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle");
*/


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
        if (d.depth == 1) {
            return 0.8;
        }
        if (d.depth == 2) {
            return 0.0;
        }
        if (!d.children) {
            return 0.0;
        }
        var sumOfChildrenSizes = 0;
        d.children.forEach(function(child){sumOfChildrenSizes += child.size;});
        if (sumOfChildrenSizes <= 5) {
            return 0.0;
        }
        return 0.8;
    })
    .attr("font-size",16)
    .style("text-anchor","middle")
    .append("textPath")
    .attr("xlink:href",function(d,i){return "#s"+i;})
    .attr("startOffset",function(d,i){return "50%";})
    .text(function(d){return d.name.toUpperCase();})

//updateVis();

function getColor(measureName) {
    if (measureName == "Men") {
        return "#6495ed";
    } else if (measureName == "Women") {
        return "#F08080";
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

      vis.append("text")
          .text(function (d){ return d.name ; })
          .attr("fill", "#fff")
            .attr("x", 0)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle");
    
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
 "name": "Gender Inequality in Tech",
 "children": [
  {
   "name": "2013 Workforce",
   "acronym": "Workforce 2013",
   "children": [
      {"name": "Men", "size": 74},
      {"name": "Women", "size": 26}
    ]
  },
  {
   "name": "2014 Pay",
   "acronym": "2014 Pay",
   "children": [
      {"name": "Women", "size": 84},
      {"name": "Men", "size": 100}
    ]
  },
  {
   "name": "2012 CompSci Grads",
   "acronym": "CS Grads",
   "children": [
      {"name": "Women", "size": 18},
      {"name": "Men", "size": 82}
   ]
  },
  {
   "name": "Venture Capital Recipients",
   "acronym": "VC Recipients",
   "children": [
      {"name": "Women", "size": 7},
      {"name": "Men", "size": 93}
    ]
  },
  {
   "name": "Venture Capital Investors",
   "acronym": "VC Investors",
   "children": [
      {"name": "Men", "size": 95.8},
      {"name": "Women", "size": 4.2}
    ]
  },
  {
   "name": "Software Developers",
   "acronym": "SW Dev",
   "children": [
      {"name": "Women", "size": 20},
      {"name": "Men", "size": 80}
    ]
  },
  {
   "name": "2014 General College Enrollment",
   "acronym": "College Enrollment",
   "children": [
      {"name": "Men", "size": 63},
      {"name": "Women", "size": 68}
    ]
  }
 ]
};
};
  
