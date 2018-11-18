var margin = {top: 10, right: 10, bottom: 10, left: 15}
var width = 960 - margin.left - margin.right
var height = 405 - margin.top - margin.bottom
var padding = 3
var xLabelHeight = 30
var yLabelWidth = 80
var borderWidth = 3
var duration = 500

var chart = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var border = chart.append('rect')
    .attr('x', yLabelWidth)
    .attr('y', xLabelHeight)
    .style('fill-opacity', 0)
    .style('stroke', '#000')
    .style('stroke-width', borderWidth)
    .style('shape-rendering', 'crispEdges')

loadJSON('artists_totals.json')

function loadJSON(name) {
    d3.text(name, function(JSONdata) {
        var rawData = JSON.parse(JSONdata);
        var labelsX = [];
        var data = [];
        var vals = [];
        var valLen = [];

        for (x in rawData) {
          currVals = []
          for (y in rawData[x]) {
            currVals.push({key: y, value: rawData[x][y]});
            vals.push(rawData[x][y]);
            labelsX.push(y)
          }
          valLen.push(currVals.length);
          data.push({key: x, value: currVals})
        }
        console.log(Math.max.apply(null,valLen));
        updateJSON(data, labelsX, vals, valLen);
    })
}

function updateJSON(data, labelsX, vals, valLen) {
    console.log(labelsX);
    vals = vals.map(n => n*0.7);
    var maxWidth = Math.max.apply(null,valLen);
    var maxR = d3.min([(width - yLabelWidth) / maxWidth, (height - xLabelHeight) / data.length]) / 2;

    var r = function(d) { // Function to calculate the radii
      console.log(d);
      if (d === 0) return 0

      f = d3.scale.sqrt()
          .domain([d3.min(vals), d3.max(vals)])
          .rangeRound([2, maxR - padding])

      return f(d)
    }

    var c = d3.scale.linear()
        .domain([d3.min(vals), d3.max(vals)])
        .rangeRound([255 * 0.8, 0])

    var rows = chart.selectAll('.row') // Rows would be all the years
        .data(data, function(d){ return d.key })

    rows.enter().append('g')
        .attr('class', 'row')

    rows.exit()
        .transition()
        .duration(duration)
        .style('fill-opacity', 0)
        .remove()

    rows.transition()
        .duration(duration)
        .attr('transform', function(d, i) { return 'translate(' + yLabelWidth + ',' + (maxR * i * 2 + maxR + xLabelHeight) + ')' })

    var dots = rows.selectAll('circle') // Make some circles
        .data(function(d) {return d.value.map(d=>d.value)});

        dots.enter().append('circle')
            .attr('cy', 0)
            .attr('r', 0)
            .style('fill', '#ffffff')
            .text(function(d){ return d })

        dots.exit()
            .transition()
            .duration(duration)
            .attr('r', 0)
            .remove()

        dots.transition()
            .duration(duration)
            .attr('r', function(d){ return r(d) })
            .attr('cx', function(d, i){ return i * maxR * 2 + maxR })
            .style('fill', function(d){ return 'rgb(' + c(d) + ',' + c(d) + ',' + c(d) + ')' })

        var dotLabels = rows.selectAll('.dot-label')
            .data(function(d){return d.value.map(d=>(d.key,d.value))});

        var dotLabelEnter = dotLabels.enter().append('g')
            .attr('class','dot-label')
            .on('mouseover', function(d) {
                var selection = d3.select(this);
                selection.select('rect').transition().duration(100).style('opacity',1)
                selection.select('text').transition().duration(100).style('opacity',1)
            })
            .on('mouseout', function(d) {
                var selection = d3.select(this);
                selection.select('rect').transition().duration(100).style('opacity',0)
                selection.select('text').transition().duration(100).style('opacity',0)
            })

        dotLabelEnter.append('rect')
            .style('fill','#000000')
            .style('opacity',0)

        dotLabelEnter.append('text')
            .style('text-anchor','middle')
            .style('fill','#ffffff')
            .style('opacity',0)

        dotLabels.exit().remove()

        dotLabels
            .attr('transform', function(d, i){ return 'translate(' + (i * maxR * 2) + ',' + (-maxR) + ')' })
            .select('text')
                .text(function(d) {return d})
                .attr('y',maxR+4)
                .attr('x',maxR)

        dotLabels.select('rect')
            .attr('width',maxR*2)
            .attr('height',maxR*2)

        var yLabels = chart.selectAll('.yLabel')
            .data(data, function(d) { return d.key })

        yLabels.enter().append('text')
            .text(function (d) {return d.key})
            .attr('x',yLabelWidth)
            .attr('class','yLabel')
            .style('text-anchor','end')
            .style('fill-opacity',0)

            yLabels.exit()
                .transition()
                .duration(duration)
                .style('fill-opacity', 0)
                .remove()

            yLabels.transition()
                .duration(duration)
                .attr('y', function(d, i){ return maxR * i * 2 + maxR + xLabelHeight })
                .attr('transform', 'translate(-6,' + maxR / 2.5 + ')')
                .style('fill-opacity', 1)

            // var vert = chart.selectAll('.vert')
            //     .data(labelsX)
            //
            // vert.enter().append('line')
            //     .attr('class', 'vert')
            //     .attr('y1', xLabelHeight + borderWidth / 2)
            //     .attr('stroke', '#888')
            //     .attr('stroke-width', 1)
            //     .style('shape-rendering', 'crispEdges')
            //     .style('stroke-opacity', 0)
            //
            // vert.exit()
            //     .transition()
            //     .duration(duration)
            //     .style('stroke-opacity', 0)
            //     .remove()
            //
            // vert.transition()
            //     .duration(duration)
            //     .attr('x1', function(d, i){ return maxR * i * 2 + yLabelWidth })
            //     .attr('x2', function(d, i){ return maxR * i * 2 + yLabelWidth })
            //     .attr('y2', maxR * 2 * data.length + xLabelHeight - borderWidth / 2)
            //     .style('stroke-opacity', function(d, i){ return i ? 1 : 0 })

            var horiz = chart.selectAll('.horiz').
                data(data, function(d){ return d.key })

            horiz.enter().append('line')
                .attr('class', 'horiz')
                .attr('x1', yLabelWidth + borderWidth / 2)
                .attr('stroke', '#888')
                .attr('stroke-width', 1)
                .style('shape-rendering', 'crispEdges')
                .style('stroke-opacity', 0)

            horiz.exit()
                .transition()
                .duration(duration)
                .style('stroke-opacity', 0)
                .remove()

            horiz.transition()
                .duration(duration)
                .attr('x2', maxR * 2 * labelsX.length + yLabelWidth - borderWidth / 2)
                .attr('y1', function(d, i){ return i * maxR * 2 + xLabelHeight })
                .attr('y2', function(d, i){ return i * maxR * 2 + xLabelHeight })
                .style('stroke-opacity', function(d, i){ return i ? 1 : 0 })

}
