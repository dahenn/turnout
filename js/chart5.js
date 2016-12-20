var c5margin = {top: 20, right: 50, bottom: 30, left: 30},
    c5width = parseInt(d3.select('#chart5').style('width')) - c5margin.left - c5margin.right,
    c5height = 700 - c5margin.top - c5margin.bottom;

var c5x = d3.scale.linear()
    .rangeRound([0, c5width]);

var c5y = d3.scale.linear()
    .rangeRound([c5height, 0]);

var c5xAxis = d3.axisBottom(c5x);

var c5yAxis = d3.axisLeft(c5y).ticks(20, '%');

var c5svg = d3.select("#chart5").append("svg")
    .attr("width", c5width + c5margin.left + c5margin.right)
    .attr("height", c5height + c5margin.top + c5margin.bottom)
  .append("g")
    .attr("transform", "translate(" + c5margin.left + "," + c5margin.top + ")");

c5x.domain([-1, 1]);
c5y.domain([0.2, 0.8]);

c5svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + c5height + ")")
    .call(c5xAxis)
    .append("text")
      .attr("y", -15)
      .attr('x', parseInt(d3.select('#chart5').style('width')) - 120)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Republican Margin");
c5svg.append("g")
    .attr("class", "axis axis--y")
    .call(c5yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Turnout");

function drawGraph5(path) {
    d3.csv(path, type, function(error, c5data) {
      if (error) throw error;

      c5svg.append('line')
            .attr('x1',c5x(0))
            .attr('x2',c5x(0))
            .attr('y1',c5y(0.2))
            .attr('y2',c5y(0.8))
            .attr('stroke','#aaa')
            .attr('stroke-width',1)
            .attr('stroke-dasharray', '5,5');

    c5svg.append('line')
          .attr('x1',c5x(-1))
          .attr('x2',c5x(1))
          .attr('y1',c5y(0.7428))
          .attr('y2',c5y(0.4806))
          .attr('stroke', '#3b5d84')
          .attr('stroke-width',1)
          .attr('stroke-dasharray', '15,5');

      var dots = c5svg.selectAll(".state-change")
          .data(c5data)
        .enter().append("circle")
          .attr("id", function(d) {return d.Abbreviation;})
          .attr('class','state-change')
          .attr("cx", function(d) { return c5x(d.d_margin_12); })
          .attr("cy", function(d) { return c5y(d.Year_2012); })
          .attr('r',2)
          .attr('fill','#fff');

      var dots2 = c5svg.selectAll(".state-change2")
          .data(c5data)
        .enter().append("circle")
          .attr("id", function(d) {return d.Abbreviation;})
          .attr('class','state-change2')
          .attr("cx", function(d) { return c5x(d.d_margin_16); })
          .attr("cy", function(d) { return c5y(d.Year_2016); })
          .attr('r',2)
          .attr('fill','#fff');



      /*c5svg.selectAll(".state-12")
          .data(c5data)
        .enter().append("circle")
          .attr("id", function(d) {return d.Abbreviation;})
          .attr('class','state-12')
          .attr("cx", function(d) { return c5x(d.d_margin_12); })
          .attr("cy", function(d) { return c5y(d.Year_2012); })
          .attr("r", 2)
          .style('fill','blue');

      c5svg.selectAll(".state-16")
          .data(c5data)
        .enter().append("circle")
          .attr("id", function(d) {return d.Abbreviation;})
          .attr('class','state-16')
          .attr("cx", function(d) { return c5x(d.d_margin_16); })
          .attr("cy", function(d) { return c5y(d.Year_2016); })
          .attr("r", 2)
          .style('fill','red');*/


    });
};

/*function type(d) {
  variables.forEach(function(c) { d[c] = +d[c]; });
  return d;
}*/
