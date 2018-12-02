var chartContainer = document.getElementById("chartContainer");
console.log(chartContainer.offsetWidth);

var margin = {top: 10, right: 10, bottom: 10, left: 10}
var width = 1100
var height = 405 - margin.top - margin.bottom
var padding = 3
var xLabelHeight = 30
var yLabelWidth = 80
var borderWidth = 3
var duration = 500
var count = 0;
var artists = {};

// var aspect = width / height,
//     chart = d3.select('#chart');
// d3.select(window)
//   .on("resize", function() {
//     var targetWidth = chart.node().getBoundingClientRect().width;
//     chart.attr("width", targetWidth);
//     chart.attr("height", targetWidth / aspect);
//   });

var chart = d3.select('#chart').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    // .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

var defs = chart.append('defs');


var border = chart.append('rect')
    .attr('x', yLabelWidth)
    .attr('y', xLabelHeight)
    .style('fill-opacity', 0)
    .style('stroke', '#000')
    .style('stroke-width', borderWidth)
    .style('shape-rendering', 'crispEdges')

loadJSON('./artists_totals.json')

function loadJSON(name) {
    d3.text(name, function(JSONdata) {
        var rawData = JSON.parse(JSONdata);
        var labelsX = [];
        var data = [];
        var vals = [];
        var valLen = [];

        // Get all artists and make patterns for defs
        for (artist in rawData["2012"]) {
          let a = ""
          for (var i=0; i<artist.length; i++) {
            if (artist[i] != " ") {
              if (artist[i] != "&")
                a += artist[i]
            }
          }
          artists[artist] = a;
          defs.append('pattern')
              .attr("id", a)
              .attr("height", "100%")
              .attr("width", "100%")
              .attr("patternContentUnits", "objectBoundingBox")
              .append("image")
              .attr("height",1)
              .attr("width",1)
              .attr("preserveAspectRatio","none")
              .attr("xlink:href",rawData["2012"][artist].img);
        }

        for (x in rawData) {
          var currVals = []
          for (y in rawData[x]) {
            // console.log(rawData[x][y]);
            currVals.push({key: y, value: rawData[x][y]});
            vals.push(rawData[x][y].val);
            labelsX.push(y)
          }
          // console.log(currVals.length);
          valLen.push(currVals.length);
          data.push({key: x, value: currVals})
        }
        updateJSON(data, labelsX, vals, valLen);
    })
}

function updateJSON(data, labelsX, vals, valLen) {
    // Data is now a list of JSON objects
    var circleVals = [];
    for (var i=0; i<data.length; i++) {
      var d = [];
      for (var j=0; j<data[i].value.length; j++) { // For each year
        d.push(data[i].value[j].value.val)
      }
      circleVals.push(d);
    }
    vals = vals.map(n => n*0.7);
    var maxWidth = Math.max.apply(null,valLen);
    var maxR = d3.min([(width - yLabelWidth) / maxWidth, (height - xLabelHeight) / data.length]) / 2;

    var r = function(d) { // Function to calculate the radii
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

    var dots = rows.selectAll('circle') // Bind data to circles
        .data(function(d)
          {
            console.log(d.value.map(v=>v.value.val));
            return d.value.map(v=>v.value.val);
            // return (circleVals.value.map(d=>d.value)).map(v=>v);
          });

        // Append a circle
        var circleEnter = dots.enter()

        circleEnter.append('circle')
            // .attr('fill', function(d) {
            //   var i = Math.floor(count/24);
            //   console.log(Math.floor(count/24));
            //   console.log("#"+artists[data[i].value[count - 24*i].key]); // Get artist name
            //   count++;
            //   return "url(#"+artists[data[i].value[count-1 - 24*i].key]+")"
            //
            //   // return data[i].value[count-1 - 24*i].value.img; // Should align to correct images
            // })
        //     .attr('cy', 0)
        //     .attr('cx', 0)
        //     // .attr('size',10)
        //     .style('fill', '#ffffff')
        //     .text(function(d){ return d })

      // var c = d3.selectAll('circle')

        // circleEnter.append('image')
        //     .attr('xlink:href',function(d)  {return "./img/arcangel.jpg"})
        //     .attr("x", function(d) { return -25;})
        //     .attr("y", function(d) { return -25;})
        //     .attr("height", 50)
        //     .attr("width", 50);

        dots.exit()
            .transition()
            .duration(duration)
            .attr('r', 0)
            .remove()

        // var imgs = rows.selectAll('circle')
        //     .data(function(d) {return d.value.map(v=>v.value.val);});
        //
        // // var imgs = rows.selectAll('image')
        // //     .data(function(d) {return d.value.map(v=>v.value.img)});
        // //
        // imgs.enter().append('image')
        //     .attr('xlink:href', function(d) {return d})
        //     // .attr("x", function(d) { return -25;})
        //     // .attr("y", function(d) { return -25;})
        //     .attr("transform", "translate(-40,-40)")
        //     .attr("height", 50)
        //     .attr("width", 50);
        //
        // imgs.exit()

        // rows.selectAll('circle')
        //     .append()
        // dots.enter().append('image')
        //     .attr('xlink:href', function(d) {
        //       console.log(circleVals);
        //       // return
        //     })
        //     .attr('x', function(d) {return -25;})
        //     .attr('y', function(d) {return -25;})
        //     // .attr('r', 10)
        //     .attr('r', 50)
        //     .attr('width', 50)

        dots.transition()
            .duration(duration)
            .attr('r', function(d){ return r(d) })
            .attr('cx', function(d, i){ return i * maxR * 2 + maxR })
            .style('fill', function(d) {
              var i = Math.floor(count/24);
              console.log(Math.floor(count/24));
              console.log("#"+artists[data[i].value[count - 24*i].key]); // Get artist name
              count++;
              return "url(#"+artists[data[i].value[count-1 - 24*i].key]+")"

              // return data[i].value[count-1 - 24*i].value.img; // Should align to correct images
            })

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
