var c2margin = {top: 20, right: 50, bottom: 30, left: 30},
    c2width = parseInt(d3.select('#chart2').style('width')) - c2margin.left - c2margin.right,
    c2height = 600 - c2margin.top - c2margin.bottom;

var c2x = d3.scale.linear()
    .rangeRound([0, c2width]);

var c2y = d3.scale.linear()
    .rangeRound([c2height, 0]);

var c2xAxis = d3.axisBottom(c2x);

var c2yAxis = d3.axisLeft(c2y).ticks(20, '%');

var c2svg = d3.select("#chart2").append("svg")
    .attr("width", c2width + c2margin.left + c2margin.right)
    .attr("height", c2height + c2margin.top + c2margin.bottom)
  .append("g")
    .attr("transform", "translate(" + c2margin.left + "," + c2margin.top + ")");

var c2div = d3.select('.tooltip-holder').append("div")
    .attr("class", "tooltip2")
    .style('opacity',0);

c2svg.append('marker')
    .attr('id','triangle')
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 5)
    .attr("refY", 5)
    .attr('markerUnits','strokeWidth')
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .style('fill','#fff')
  .append("svg:path")
    .attr("d", "M0,0L10,5L0,10");

c2x.domain([-1, 1]);
c2y.domain([0.2, 0.8]);

c2svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + c2height + ")")
    .call(c2xAxis)
    .append("text")
      .attr("y", -15)
      .attr('x', parseInt(d3.select('#chart1').style('width')) - 120)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Republican Margin");
c2svg.append("g")
    .attr("class", "axis axis--y")
    .call(c2yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Turnout");

function drawGraph(path) {
    d3.select('#chart2').selectAll(".state-change").remove();
    d3.select('#chart2').selectAll(".statebutton2").remove();
    d3.csv(path, type, function(error, c2data) {
      if (error) throw error;
      c2svg.append('line')
            .attr('x1',c2x(0))
            .attr('x2',c2x(0))
            .attr('y1',c2y(0.2))
            .attr('y2',c2y(0.8))
            .attr('stroke','#aaa')
            .attr('stroke-width',1)
            .attr('stroke-dasharray', '5,5');

      var statelines = c2svg.selectAll(".state-change")
          .data(c2data)
        .enter().append("line")
          .attr("id", function(d) {return d.Abbreviation;})
          .attr('class','state-change')
          .attr("x1", function(d) { return c2x(d.d_margin_12); })
          .attr("y1", function(d) { return c2y(d.Year_2012); })
          .attr("x2", function(d) { return c2x(d.d_margin_16); })
          .attr("y2", function(d) { return c2y(d.Year_2016); })
          .attr('stroke','#fff')
          .attr('stroke-width', function(d) { return d.ev/6;})
          .attr('marker-end', 'url(#triangle)')
          .on("mouseover", function(d) {c2div.html('<h1>' + d.Abbreviation + "</h1><p>Turnout Change: " + (d.turnout_change*100).toFixed(2) + "%<br/>Republican Margin Gain: " + (d.margin_shift*-100).toFixed(2) + "%<br/>Electoral Votes: " + d.ev);
              c2div.transition().duration(400).style('opacity',1);
            })
          .on("mouseout", function(d) {
              c2div.transition().duration(400).style('opacity',0);
          });

      /*c2svg.selectAll(".state-12")
          .data(c2data)
        .enter().append("circle")
          .attr("id", function(d) {return d.Abbreviation;})
          .attr('class','state-12')
          .attr("cx", function(d) { return c2x(d.d_margin_12); })
          .attr("cy", function(d) { return c2y(d.Year_2012); })
          .attr("r", 2)
          .style('fill','blue');

      c2svg.selectAll(".state-16")
          .data(c2data)
        .enter().append("circle")
          .attr("id", function(d) {return d.Abbreviation;})
          .attr('class','state-16')
          .attr("cx", function(d) { return c2x(d.d_margin_16); })
          .attr("cy", function(d) { return c2y(d.Year_2016); })
          .attr("r", 2)
          .style('fill','red');*/

      var statebuttons = d3.select('div#chart2').selectAll('.statebutton2').data(c2data)
          .enter().append('a')
              .attr('class', function(d) {
                  if (d.d_margin_16 < 0) {
                      return 'statebutton2 d_gain';
                  }
                  else {return 'statebutton2 r_gain';};
              })
              .attr('id', function(d) { return d.Abbreviation; })
              .text(function(d) { return d.Abbreviation; })
              .on("mouseover", function(d) {
                  statelines.transition().duration(400).style("opacity", 0);
                  d3.select("#chart2 line#" + d.Abbreviation + ".state-change").transition().duration(400).style("opacity", 1);
                  c2div.html('<h1>' + d.Abbreviation + "</h1><p>Turnout Change: " + (d.turnout_change*100).toFixed(2) + "%<br/>Republican Margin Gain: " + (d.margin_shift*-100).toFixed(2) + "%<br/>Electoral Votes: " + d.ev);
                  c2div.transition().duration(400).style('opacity',1);
                })
              .on("mouseout", function(d) {
                  statelines.transition().duration(400).style("opacity", 1);
                  c2div.transition().duration(400).style('opacity',0);
              });
    });
};

/*function type(d) {
  variables.forEach(function(c) { d[c] = +d[c]; });
  return d;
}*/
