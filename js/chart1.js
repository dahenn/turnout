var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = parseInt(d3.select('#chart1').style('width')) - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("div#chart1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);

var line = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.turnout); });

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style('display', 'none');

d3.csv("data/pres.csv", type, function(error, data) {
  if (error) throw error;

    var states = data.columns.slice(1).map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {Year: d.Year, turnout: d[id]};
            })
        };
    });

    var statebuttons = d3.select('div#chart1').selectAll('.statebutton').data(states)
        .enter().append('a')
            .attr('class','statebutton')
            .attr('id', function(d) { return d.id; })
            .text(function(d) { return d.id; })
            .on("mouseover", function(d) {
                    if (d.id != 'USA') {
                        d3.select('#'+d.id)
                            .style("stroke", 'rgba(255,255,255,0.9)')
                            .style('stroke-width', '4px');
                    }
                    else {
                        d3.select('#'+d.id)
                            .style("stroke", 'red')
                            .style('stroke-width', '4px');
                    }
                    var statedata = state.selectAll('.data-point').data(d.values);
                    statedata.enter().append('g')
                            .attr('class', 'data-point')
                            .append('rect')
                                .attr('x', function(d) { return x(d.Year) - 18; })
                                .attr('y', function(d) { return y(d.turnout) - 10; })
                                .attr('width', 36)
                                .attr('height', 20)
                                .attr('rx', 4)
                                .attr('ry', 4)
                                .style('display', 'inline');
                    statedata.enter().append('text')
                        .attr('x', function(d) { return x(d.Year); })
                        .attr('y', function(d) { return y(d.turnout); })
                        .attr('text-anchor', 'middle')
                        .attr('dy', '4px')
                        .attr('class', 'data-point-text')
                        .style('display', 'inline')
                        .text(function(d) {return (d.turnout*100).toFixed(1) + '%';});
              })
            .on("mouseout", function(d) {
                div.transition().duration(200).style("opacity", 0);
                d3.selectAll('.data-point').remove();
                d3.selectAll('.data-point-text').remove();
                if (d.id != 'USA') {
                    d3.select('#'+d.id).style("stroke", 'rgba(255,255,255,0.3)')
                    .style('stroke-width', '2.5px');
                }
                else {d3.select('#'+d.id).style("stroke", 'red').style('stroke-width', '2.5px');}
            });

    x.domain(d3.extent(data, function(d) { return d.Year; }));

    y.domain([0, 1]);

    z.domain(states.map(function(c) { return c.id; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(20, 'd'));

     g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(20, '%'))
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("fill", "#000")
          .text("Turnout");

    var state = g.selectAll(".state")
        .data(states)
        .enter().append("g")
            .attr("class", "state");
    state.append("path")
        .attr("class", "line")
        .attr('id', function(d) { return d.id; })
        .attr("d", function(d) { return line(d.values); })
        .on("mouseover", function(d) {
            div.transition().duration(200).style("opacity", 0.9);
                if (d.id != 'USA') {
                    d3.select('#'+d.id)
                        .style("stroke", 'rgba(255,255,255,0.9)')
                        .style('stroke-width', '4px');
                }
                else {
                    d3.select('#'+d.id)
                        .style("stroke", 'red')
                        .style('stroke-width', '4px');
                }
                div.html(d.id)
                    .style('display', 'inline')
                    .style("left", (d3.event.pageX - 30) + "px")
                    .style("top", (d3.event.pageY - 35) + "px");
                var statedata = state.selectAll('.data-point').data(d.values);
                statedata.enter().append('g')
                        .attr('class', 'data-point')
                        .append('rect')
                            .attr('x', function(d) { return x(d.Year) - 18; })
                            .attr('y', function(d) { return y(d.turnout) - 10; })
                            .attr('width', 36)
                            .attr('height', 20)
                            .attr('rx', 4)
                            .attr('ry', 4)
                            .style('display', 'inline');
                statedata.enter().append('text')
                    .attr('x', function(d) { return x(d.Year); })
                    .attr('y', function(d) { return y(d.turnout); })
                    .attr('text-anchor', 'middle')
                    .attr('dy', '4px')
                    .attr('class', 'data-point-text')
                    .style('display', 'inline')
                    .text(function(d) {return (d.turnout*100).toFixed(1) + '%';});
          })
          .on('mousemove', function(d) {
              div
                  .style("left", (d3.event.pageX - 30) + "px")
                  .style("top", (d3.event.pageY - 35) + "px");
          })
        .on("mouseout", function(d) {
            div.transition().duration(200).style("opacity", 0);
            d3.selectAll('.data-point').remove();
            d3.selectAll('.data-point-text').remove();
            if (d.id != 'USA') {
                d3.select('#'+d.id).style("stroke", 'rgba(255,255,255,0.3)')
                .style('stroke-width', '2.5px');
            }
            else {d3.select('#'+d.id).style("stroke", 'red').style('stroke-width', '2.5px');}
        });

  /*state.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.Year) + "," + y(d.value.turnout) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });*/
});

function type(d, _, columns) {
  for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
  return d;
}

// ** Update data section (Called from the onclick)
function updateData() {
    d3.csv("data/nonpres.csv", function(error, data) {
        if (error) throw error;

    var states = data.columns.slice(1).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {Year: d.Year, turnout: d[id]};
        })
      };
    });

    var state = g.selectAll("g.state").data(states);

    var lines = state.select("path.line");

    lines.attr('id', function(d) { return d.id; })
        .attr("d", function(d) { return line(d.values); })
        .on("mouseover", function(d) {
            div.transition().duration(200).style("opacity", 0.9);
                if (d.id != 'USA') {
                    d3.select('#'+d.id)
                        .style("stroke", 'rgba(255,255,255,0.9)')
                        .style('stroke-width', '4px');
                }
                else {
                    d3.select('#'+d.id)
                        .style("stroke", 'red')
                        .style('stroke-width', '4px');
                }
                div.html(d.id)
                    .style('display', 'inline')
                    .style("left", (d3.event.pageX - 30) + "px")
                    .style("top", (d3.event.pageY - 35) + "px");
                var statedata = state.selectAll('.data-point').data(d.values);
                statedata.enter().append('g')
                        .attr('class', 'data-point')
                        .append('rect')
                            .attr('x', function(d) { return x(d.Year) - 18; })
                            .attr('y', function(d) { return y(d.turnout) - 10; })
                            .attr('width', 36)
                            .attr('height', 20)
                            .attr('rx', 4)
                            .attr('ry', 4)
                            .style('display', 'inline');
                statedata.enter().append('text')
                    .attr('x', function(d) { return x(d.Year); })
                    .attr('y', function(d) { return y(d.turnout); })
                    .attr('text-anchor', 'middle')
                    .attr('dy', '4px')
                    .attr('class', 'data-point-text')
                    .style('display', 'inline')
                    .text(function(d) {return (d.turnout*100).toFixed(1) + '%';});
          })
          .on('mousemove', function(d) {
              div
                  .style("left", (d3.event.pageX - 30) + "px")
                  .style("top", (d3.event.pageY - 35) + "px");
          })
        .on("mouseout", function(d) {
            div.transition().duration(200).style("opacity", 0);
            d3.selectAll('.data-point').remove();
            d3.selectAll('.data-point-text').remove();
            if (d.id != 'USA') {
                d3.select('#'+d.id).style("stroke", 'rgba(255,255,255,0.3)')
                .style('stroke-width', '2.5px');
            }
            else {d3.select('#'+d.id).style("stroke", 'red').style('stroke-width', '2.5px');}
        });

        var statebuttons = d3.select('div#chart1').selectAll('.statebutton').data(states)
            .enter().append('a')
                .attr('class','statebutton')
                .attr('id', function(d) { return d.id; })
                .text(function(d) { return d.id; })
                .on("mouseover", function(d) {
                        if (d.id != 'USA') {
                            d3.select('#'+d.id)
                                .style("stroke", 'rgba(255,255,255,0.9)')
                                .style('stroke-width', '4px');
                        }
                        else {
                            d3.select('#'+d.id)
                                .style("stroke", 'red')
                                .style('stroke-width', '4px');
                        }
                        var statedata = state.selectAll('.data-point').data(d.values);
                        statedata.enter().append('g')
                                .attr('class', 'data-point')
                                .append('rect')
                                    .attr('x', function(d) { return x(d.Year) - 18; })
                                    .attr('y', function(d) { return y(d.turnout) - 10; })
                                    .attr('width', 36)
                                    .attr('height', 20)
                                    .attr('rx', 4)
                                    .attr('ry', 4)
                                    .style('display', 'inline');
                        statedata.enter().append('text')
                            .attr('x', function(d) { return x(d.Year); })
                            .attr('y', function(d) { return y(d.turnout); })
                            .attr('text-anchor', 'middle')
                            .attr('dy', '4px')
                            .attr('class', 'data-point-text')
                            .style('display', 'inline')
                            .text(function(d) {return (d.turnout*100).toFixed(1) + '%';});
                  })
                .on("mouseout", function(d) {
                    div.transition().duration(200).style("opacity", 0);
                    d3.selectAll('.data-point').remove();
                    d3.selectAll('.data-point-text').remove();
                    if (d.id != 'USA') {
                        d3.select('#'+d.id).style("stroke", 'rgba(255,255,255,0.3)')
                        .style('stroke-width', '2.5px');
                    }
                    else {d3.select('#'+d.id).style("stroke", 'red').style('stroke-width', '2.5px');}
                });

    });

}

function revertData() {

    // Get the data again
    d3.csv("data/pres.csv", function(error, data) {
        if (error) throw error;

    var states = data.columns.slice(1).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {Year: d.Year, turnout: d[id]};
        })
      };
    });

    var state = g.selectAll("g.state").data(states);

    var lines = state.select("path.line");

    lines.attr('id', function(d) { return d.id; })
        .attr("d", function(d) { return line(d.values); })
        .on("mouseover", function(d) {
            div.transition().duration(200).style("opacity", 0.9);
                if (d.id != 'USA') {
                    d3.select('#'+d.id)
                        .style("stroke", 'rgba(255,255,255,0.9)')
                        .style('stroke-width', '4px');
                }
                else {
                    d3.select('#'+d.id)
                        .style("stroke", 'red')
                        .style('stroke-width', '4px');
                }
                div.html(d.id)
                    .style('display', 'inline')
                    .style("left", (d3.event.pageX - 30) + "px")
                    .style("top", (d3.event.pageY - 35) + "px");
                var statedata = state.selectAll('.data-point').data(d.values);
                statedata.enter().append('g')
                        .attr('class', 'data-point')
                        .append('rect')
                            .attr('x', function(d) { return x(d.Year) - 18; })
                            .attr('y', function(d) { return y(d.turnout) - 10; })
                            .attr('width', 36)
                            .attr('height', 20)
                            .attr('rx', 4)
                            .attr('ry', 4)
                            .style('display', 'inline');
                statedata.enter().append('text')
                    .attr('x', function(d) { return x(d.Year); })
                    .attr('y', function(d) { return y(d.turnout); })
                    .attr('text-anchor', 'middle')
                    .attr('dy', '4px')
                    .attr('class', 'data-point-text')
                    .style('display', 'inline')
                    .text(function(d) {return (d.turnout*100).toFixed(1) + '%';});
          })
          .on('mousemove', function(d) {
              div
                  .style("left", (d3.event.pageX - 30) + "px")
                  .style("top", (d3.event.pageY - 35) + "px");
          })
        .on("mouseout", function(d) {
            div.transition().duration(200).style("opacity", 0);
            d3.selectAll('.data-point').remove();
            d3.selectAll('.data-point-text').remove();
            if (d.id != 'USA') {
                d3.select('#'+d.id).style("stroke", 'rgba(255,255,255,0.3)')
                .style('stroke-width', '2.5px');
            }
            else {d3.select('#'+d.id).style("stroke", 'red').style('stroke-width', '2.5px');}
        });

        var statebuttons = d3.select('div#chart1').selectAll('.statebutton').data(states)
            .enter().append('a')
                .attr('class','statebutton')
                .attr('id', function(d) { return d.id; })
                .text(function(d) { return d.id; })
                .on("mouseover", function(d) {
                        if (d.id != 'USA') {
                            d3.select('#'+d.id)
                                .style("stroke", 'rgba(255,255,255,0.9)')
                                .style('stroke-width', '4px');
                        }
                        else {
                            d3.select('#'+d.id)
                                .style("stroke", 'red')
                                .style('stroke-width', '4px');
                        }
                        var statedata = state.selectAll('.data-point').data(d.values);
                        statedata.enter().append('g')
                                .attr('class', 'data-point')
                                .append('rect')
                                    .attr('x', function(d) { return x(d.Year) - 18; })
                                    .attr('y', function(d) { return y(d.turnout) - 10; })
                                    .attr('width', 36)
                                    .attr('height', 20)
                                    .attr('rx', 4)
                                    .attr('ry', 4)
                                    .style('display', 'inline');
                        statedata.enter().append('text')
                            .attr('x', function(d) { return x(d.Year); })
                            .attr('y', function(d) { return y(d.turnout); })
                            .attr('text-anchor', 'middle')
                            .attr('dy', '4px')
                            .attr('class', 'data-point-text')
                            .style('display', 'inline')
                            .text(function(d) {return (d.turnout*100).toFixed(1) + '%';});
                  })
                .on("mouseout", function(d) {
                    div.transition().duration(200).style("opacity", 0);
                    d3.selectAll('.data-point').remove();
                    d3.selectAll('.data-point-text').remove();
                    if (d.id != 'USA') {
                        d3.select('#'+d.id).style("stroke", 'rgba(255,255,255,0.3)')
                        .style('stroke-width', '2.5px');
                    }
                    else {d3.select('#'+d.id).style("stroke", 'red').style('stroke-width', '2.5px');}
                });

    });

}
