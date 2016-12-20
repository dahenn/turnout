var c4margin = {top: 20, right: 50, bottom: 30, left: 30},
    c4width = parseInt(d3.select('#chart4').style('width')) - c4margin.left - c4margin.right,
    c4height = 700 - c4margin.top - c4margin.bottom;

var c4x = d3.scale.linear()
    .rangeRound([0, c4width]);

var c4y = d3.scale.linear()
    .rangeRound([c4height, 0]);

var c4xAxis = d3.axisBottom(c4x);

var c4yAxis = d3.axisLeft(c4y).ticks(20, '%');

var c4svg = d3.select("#chart4").append("svg")
    .attr("width", c4width + c4margin.left + c4margin.right)
    .attr("height", c4height + c4margin.top + c4margin.bottom)
  .append("g")
    .attr("transform", "translate(" + c4margin.left + "," + c4margin.top + ")");

var c4div = d3.select('.tooltip-holder2').append("div")
    .attr("class", "tooltip3")
    .style('opacity',0);

c4svg.append('marker')
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

c4x.domain([-1, 1]);
c4y.domain([0.2, 0.8]);

c4svg.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + c4height + ")")
    .call(c4xAxis)
    .append("text")
      .attr("y", -15)
      .attr('x', parseInt(d3.select('#chart4').style('width')) - 120)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Republican Margin");
c4svg.append("g")
    .attr("class", "axis axis--y")
    .call(c4yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Turnout");

function drawGraph4(path) {
    d3.select('#chart4').selectAll(".state-change").remove();
    d3.select('#chart4').selectAll(".statebutton2").remove();
    d3.csv(path, type, function(error, c4data) {
      if (error) throw error;

      c4svg.append('line')
            .attr('x1',c4x(0))
            .attr('x2',c4x(0))
            .attr('y1',c4y(0.2))
            .attr('y2',c4y(0.8))
            .attr('stroke','#aaa')
            .attr('stroke-width',1)
            .attr('stroke-dasharray', '5,5');

      var statelines = c4svg.selectAll(".state-change")
          .data(c4data)
        .enter().append("line")
          .attr("id", function(d) {return d.Abbreviation;})
          .attr('class','state-change')
          .attr("x1", function(d) { return c4x(d.d_margin_12); })
          .attr("y1", function(d) { return c4y(d.Year_2012); })
          .attr("x2", function(d) { return c4x(d.d_margin_16); })
          .attr("y2", function(d) { return c4y(d.Year_2016); })
          .attr('stroke','#fff')
          .attr('stroke-width', function(d) { return d.ev/6;})
          .attr('marker-end', 'url(#triangle)')
          .on("mouseover", function(d) {c4div.html('<h1>' + d.Abbreviation + "</h1><p>Turnout Change: " + (d.turnout_change*100).toFixed(2) + "%<br/>Republican Margin Gain: " + (d.margin_shift*-100).toFixed(2) + "%<br/>Electoral Votes: " + d.ev);
              c4div.transition().duration(400).style('opacity',1);
            })
          .on("mouseout", function(d) {
              c4div.transition().duration(400).style('opacity',0);
          });

      /*c4svg.selectAll(".state-12")
          .data(c4data)
        .enter().append("circle")
          .attr("id", function(d) {return d.Abbreviation;})
          .attr('class','state-12')
          .attr("cx", function(d) { return c4x(d.d_margin_12); })
          .attr("cy", function(d) { return c4y(d.Year_2012); })
          .attr("r", 2)
          .style('fill','blue');

      c4svg.selectAll(".state-16")
          .data(c4data)
        .enter().append("circle")
          .attr("id", function(d) {return d.Abbreviation;})
          .attr('class','state-16')
          .attr("cx", function(d) { return c4x(d.d_margin_16); })
          .attr("cy", function(d) { return c4y(d.Year_2016); })
          .attr("r", 2)
          .style('fill','red');*/

      var statebuttons = d3.select('div#chart4').selectAll('.statebutton2').data(c4data)
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
                  d3.select("#chart4 line#" + d.Abbreviation + ".state-change").transition().duration(400).style("opacity", 1);
                  c4div.html('<h1>' + d.Abbreviation + "</h1><p>Turnout Change: " + (d.turnout_change*100).toFixed(2) + "%<br/>Republican Margin Gain: " + (d.margin_shift*-100).toFixed(2) + "%<br/>Electoral Votes: " + d.ev);
                  c4div.transition().duration(400).style('opacity',1);
                })
              .on("mouseout", function(d) {
                  statelines.transition().duration(400).style("opacity", 1);
                  c4div.transition().duration(400).style('opacity',0);
              });
    });
};

/*function type(d) {
  variables.forEach(function(c) { d[c] = +d[c]; });
  return d;
}*/
