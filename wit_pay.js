var wit = (function(myApp){
  'use strict';

  $(document).on('ready page:load',function(){
    var width = 800,
       height = 500, 
       margin = 50;
  
    var colorScale = d3.scale.category10();

    var canvas = d3.select("#pay-container").append("svg")
                   .attr("width", width)
                   .attr("height", height)
                   .append("g")
                   .attr("transform","translate(50, 50)");

    var pack = d3.layout.pack()
                    .size([width, height - margin])
                    .padding(10);

    d3.json("wit_pay.json",function(d) {
  
      var nodes = pack.nodes(d);
      console.dir(nodes);
  
      var node = canvas.selectAll(".node")
                       .data(nodes)
                       .enter()
                       .append("g")
                         .attr("class", "node")
                         .attr("transform", function (d){ return "translate(" + d.x + "," + d.y + ")"; } )

      node.append("circle")
          .attr("r", function (d){ return d.r; })
          .attr("fill", function (d){ return d.children ? "#eee" : colorScale(d.value) ; })
          .attr("opacity", "0.65")
          .attr("stroke", function (d){ return d.children ? "#eee" : colorScale(d.value) ; })
          .attr("stroke-width", "2");
  
      node.append("text")
          .text(function (d){ return d.name ; })
          .attr("fill", "#fff")
          //.append("g")
            .attr("x", 0)
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
                         //.attr("transform", function (d){ return "translate(" + d.x + "," + d.y + ")"; } )
    
    });

  });

  return myApp;
})(wit || {});
