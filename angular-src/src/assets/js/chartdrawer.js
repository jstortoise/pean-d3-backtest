function showChart(backtestresult) {
	// Set chart width height
	var cWidth = $("#linechart").width();
	var cHeight = $("#linechart").height();
	var cPosition = $("#linechart").position();
	var cX = cPosition.left;
	var cY = cPosition.top;

	// Set Dimension
	var margin = {top: 30, right: 20, bottom: 30, left: 50},
	    width = cWidth - margin.left - margin.right,
	    height = cHeight - margin.top - margin.bottom;

	// Parse the date / time
	var parseDate = d3.time.format("%Y%m%d").parse;
	// Parse the date / time
	var parseDate = d3.time.format("%d-%b-%y").parse,
	    formatDate = d3.time.format("%d %b"),
	    bisectDate = d3.bisector(function(d) { return d.timestamp; }).left;
	// Set the ranges
	var x = d3.time.scale().range([0, width]);
	var y = d3.scale.linear().range([height, 0]);

	// Define the axes
	var xAxis = d3.svg.axis().scale(x)
	    .orient("bottom").ticks(5).tickFormat(d3.time.format('%d %b'));

	var yAxis = d3.svg.axis().scale(y)
	    .orient("left").ticks(5);

	// Define Cone Area
	var area10 = d3.svg.area()
	    .interpolate("basis")
	    .x(function(d) { return x(d["timestamp"]); })
	    .y1(function(d) { return y(d["cone10p"]); });
	var area15 = d3.svg.area()
	    .interpolate("basis")
	    .x(function(d) { return x(d["timestamp"]); })
	    .y1(function(d) { return y(d["cone15p"]); });
	var area20 = d3.svg.area()
	    .interpolate("basis")
	    .x(function(d) { return x(d["timestamp"]); })
	    .y1(function(d) { return y(d["cone20p"]); });

	// Define the line for SPY, Backtest, Live
	var valueSpyline = d3.svg.line()
	    .x(function(d) { return x(d["timestamp"]); })
	    .y(function(d) { return y(d["spy"]); });
	var valueBackTestline = d3.svg.line()
	    .x(function(d) { return x(d["timestamp"]); })
	    .y(function(d) { return y(d["backtest"]); });
	var valueLiveline = d3.svg.line()
	    .x(function(d) { return x(d["timestamp"]); })
	    .y(function(d) { return y(d["backtest"]); });
	
	// Add Title
  var titleHtml = '<span>Cumulative Returns</span>';
  var title = d3.select("#linechart").append("div")
      // .attr("class", "title")
      .style("text-align", "center")
	    .style("padding", "7px")
	    .style("font", "20px san-serif")
	    .style("font-weight", "bold")
	    .style("width", "100%")
	    .style("background", "white")
      // .style("top", "0px")
      .html(titleHtml);

	// Adds the svg canvas
	var svg = d3.select("#linechart")
	    .append("svg")
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	        .attr("transform", 
	              "translate(" + margin.left + "," + margin.top + ")");
	// console.log(backtestresult.result);
	var jsonData = {text: JSON.parse(backtestresult.result)};
	var data = {result: jsonData.text.result};
	// console.log(data.result);
	// data["result"] = JSON.parse(backtestresult.result);
	// console.log(data);
	// Make Chart
	// d3.json("./json/1071.json", function(error, data) {
	    // data sanitization
	    // data["result"].forEach(function(d) {
	    //     d.return = +d.return;
	    //     d.price = +d.price;
	    //     d.pl = +d.pl;
	    // });
	// data.result.forEach(function(d) {
	//     d.return = +d.return;
	//     d.price = +d.price;
	//     d.pl = +d.pl;
	// });
  for (var i = 0; i < data.result.length; i++) {
  	data.result[i].return = +data.result[i].return;
  	data.result[i].price = +data.result[i].price;
  	data.result[i].pl = +data.result[i].pl
  }

  // Read & Tweak Data
  var cumData = [];//new Array(data.result.length);

  var maxY = 0;
  var minY = 10000;
  var gapIndex = Math.round(data.result.length / 2);

  var cone_pl = [];
  for (var i = 0; i < data.result.length; i++) {
	  var unitData = {
	      timestamp: getDateTime(data.result[i].date, data.result[i].time),
	      spy: parseFloat(data.result[i].price),
	      backtest: parseFloat(data.result[i].return),
	      pl: parseFloat(data.result[i].pl)
	  }

	  if (unitData.spy > maxY) {
	      maxY = unitData.spy;
	  }

	  if (unitData.backtest > maxY) {
	      maxY = unitData.backtest;
	  }

	  if (unitData.spy < minY) {
	      minY = unitData.spy;
	  }

	  if (unitData.backtest < minY) {
	      minY = unitData.backtest;
	  }

	  cumData[i] = unitData;
	  cone_pl[i] =cumData[i].pl / 100;
  }


  // console.log(maxY);
  // calculate & set cone data
  var cone_bounds = calculation(cone_pl);
  // console.log(cone_bounds);
  var start_live_value = cumData[gapIndex - 1].backtest;
  for (var i = gapIndex - 1; i < cumData.length; i++) {
      cumData[i].cone10p = start_live_value * cone_bounds[i - gapIndex + 1][0];
      cumData[i].cone10m = start_live_value * cone_bounds[i - gapIndex + 1][1];

      cumData[i].cone15p = start_live_value * cone_bounds[i - gapIndex + 1][2];
      cumData[i].cone15m = start_live_value * cone_bounds[i - gapIndex + 1][3];

      cumData[i].cone20p = start_live_value * cone_bounds[i - gapIndex + 1][4];
      cumData[i].cone20m = start_live_value * cone_bounds[i - gapIndex + 1][5];

      var coneMax = Math.max(cumData[i].cone10p, cumData[i].cone15p, cumData[i].cone20p);
      var coneMin = Math.min(cumData[i].cone10m, cumData[i].cone15m, cumData[i].cone20m);
      if (coneMax > maxY) {
          maxY = coneMax;
      }
      if (coneMin < minY) {
          minY = coneMin;
      }
  }

  // Scale the range of the data
  x.domain(d3.extent(cumData, function(d) { return d.timestamp; }));
  y.domain([minY - 10, maxY + 10]);

  // set datum for cone
  svg.datum(cumData.slice(gapIndex - 1, cumData.length));

  // [2.0, -2.0]
  svg.append("path")
  .style("fill", "rgba(0,128,255, 0.2")
    .attr("d", area20.y0(function(d) { return y(d["cone20m"]); }));
  // [1.5, -1.5]
  svg.append("path")
    .style("fill", "rgba(0,128,255, 0.2")
    .attr("d", area15.y0(function(d) { return y(d["cone15m"]); }));
  // [1.0, -1.0]
  svg.append("path")
    .style("fill", "rgba(0,128,255, 0.2")
    .attr("d", area10.y0(function(d) { return y(d["cone10m"]); }));

  // set datum for cone
  svg.datum(cumData);

  // Add the spy line path.
  svg.append("path")
  	.style("stroke", "gray")
  	.style("stroke-width", "2")
  	.style("fill", "none")
    // .attr("class", "line spy")
    .attr("d", valueSpyline(cumData));
  // Add the backtest line path.
  svg.append("path")
    // .attr("class", "line backtest")
    .style("stroke", "green")
  	.style("stroke-width", "2")
  	.style("fill", "none")
    .attr("d", valueBackTestline(cumData.slice(0, gapIndex)));
  // Add the live line path.
  svg.append("path")
    // .attr("class", "line live")
    .style("stroke", "red")
  	.style("stroke-width", "2")
  	.style("fill", "none")
    .attr("d", valueLiveline(cumData.slice(gapIndex - 1, cumData.length)));

  // Add the X Axis
  svg.append("g")
    // .attr("class", "x axis")
    .style("fill", "none")
	  .style("stroke", "grey")
	  .style("stroke-width", "1")
	  .style("shape-rendering", "crispEdges")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add the Y Axis
  svg.append("g")
    .style("font", "12px Arial")
    .style("fill", "none")
	  .style("stroke", "grey")
	  .style("stroke-width", "1")
	  .style("shape-rendering", "crispEdges")
    .call(yAxis);

  // Add Legend
  var legendHtml = '<span class="glyphicon glyphicon-minus" style="color:gray"></span><span> SPY&nbsp;&nbsp;&nbsp;</span>' +
              '<span class="glyphicon glyphicon-minus" style="color:green"></span><span> BACKTEST&nbsp;&nbsp;&nbsp;</span>' + 
              '<span class="glyphicon glyphicon-minus" style="color:red"></span><span> LIVE</span>';
  // var legendX = 70 + "px";
  // var legendY = 0 + "px";
  var legend = d3.select("#linechart").append("div")
      // .attr("class", "legend")
      .style("text-align", "center")
	    .style("padding", "7px")
	    .style("font", "15px san-serif")
	    .style("width", "100%")
	    .style("background", "white")
      // .style("left", legendX)
      // .style("top", legendY)
      .html(legendHtml);
  
  // Define Y focus
  var focus = svg.append("g")
      // .style("background", "white")
      .style("display", "none");
  // Set Focus
  // append the x line
  focus.append("line")
      .attr("class", "x")
      .style("stroke", "gray")
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0.7)
      .attr("y1", 0)
      .attr("y2", height);
  // append the circle at the intersection
  focus.append("circle")
      .attr("id", "circle-spy")
      .attr("class", "y")
      .attr("fill", "white")
      .style("stroke", "gray")
      .style("stroke-width", "3")
      .attr("r", 5);
  focus.append("circle")
      .attr("id", "circle-backtest")
      .attr("class", "y")
      .attr("fill", "white")
      .style("stroke", "green")
      .style("stroke-width", "3")
      .attr("r", 5);

  // append the rectangle to capture mouse
  svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mouseover", function() { focus.style("display", null);tooltip.style("display", null) })
      .on("mouseout", function() { focus.style("display", "none");tooltip.style("display", "none") })
      .on("mousemove", mousemove);

  // Mouse Handler
  function mousemove() {
      
      var x0 = x.invert(d3.mouse(this)[0]),
          i = bisectDate(cumData, x0, 1),
          d0 = cumData[i - 1],
          d1 = cumData[i],
          d = x0 - d0.timestamp > d1.timestamp - x0 ? d1 : d0;

      focus.select("#circle-spy.y")
          .attr("transform",
                "translate(" + x(d.timestamp) + "," +
                               y(d.spy) + ")");

      focus.select("#circle-backtest.y")
              .attr("transform",
                    "translate(" + x(d.timestamp) + "," +
                                   y(d.backtest) + ")");
      if (i < gapIndex) {
          focus.select("#circle-backtest.y")
              .style("stroke", "green");
      } else {
          focus.select("#circle-backtest.y")
              .style("stroke", "red");
      }

      var tooltip_text = '<center><span style="color:black">' + formatDate(d.timestamp) + '</span></center><span style="color:gray">&#9899</span><span style="color:black">' + ' SPY: ' + '<strong>' + d.spy.toFixed(2) + '</strong></span><br>';

      if (i < gapIndex) {
          tooltip_text = tooltip_text + '<span style="color:green">&#9899</span><span style="color:black">' + ' Backtest: ' + '<strong>' + d.backtest.toFixed(2) + '</strong></span><br>';
      } else {
          tooltip_text = tooltip_text + '<span style="color:red">&#9899</span><span style="color:black">' + ' Live: ' + '<strong>' + d.backtest.toFixed(2) + '</strong></span><br>';
      }

      if (i >= gapIndex) {
          tooltip_text = tooltip_text + '<span style="color:rgba(0, 128, 255, 0.6)">&#9899</span><span style="color:black">' + ' Series 4: ' + '<strong>' + d.cone10m.toFixed(2) + ' - ' + d.cone10p.toFixed(2) + '</strong></span><br>';
          tooltip_text = tooltip_text + '<span style="color:rgba(0, 128, 255, 0.4)">&#9899</span><span style="color:black">' + ' Series 5: ' + '<strong>' + d.cone15m.toFixed(2) + ' - ' + d.cone15p.toFixed(2) + '</strong></span><br>';
          tooltip_text = tooltip_text + '<span style="color:rgba(0, 128, 255, 0.2)">&#9899</span><span style="color:black">' + ' Series 6: ' + '<strong>' + d.cone20m.toFixed(2) + ' - ' + d.cone20p.toFixed(2) + '</strong></span><br>';
      }

      tooltip.html(tooltip_text);
      var tooltipWidth = parseInt((tooltip.style("width")).replace("px", ""));
      var tooltipHeight = parseInt((tooltip.style("height")).replace("px", ""));
      var tooltipY = cY + (cHeight - tooltipHeight) / 2 + "px";
      var offsetX = 70;
      var tooltipX = (x(d.timestamp) + offsetX );// + "px";
      if (tooltipX + tooltipWidth > cWidth) {
          tooltipX = tooltipX - offsetX + 30 - tooltipWidth;
      }
      tooltipX = cX + tooltipX + "px";

      tooltip.style("left", tooltipX).style("top", tooltipY);//

      focus.select(".x")
          .attr("transform",
                "translate(" + x(d.timestamp) + "," +
                               0 + ")")
                     .attr("y2", height);

  }

  // Define the div for the tooltip
  var tooltip = d3.select("#linechart").append("div")   
      // .attr("class", "tooltip")               
      .style("position", "absolute")
      .style("text-align", "left")
	    .style("padding", "7px")          
	    .style("font", "14px sans-serif")
	    .style("background", "white")
	    .style("border", "1px solid gray")
	    .style("border-radius", "8px")
	    .style("pointer-events", "none")
	    .style("opacity", "0.7")
      .style("display", "none");

	// Get Date Object from 2 string
	function getDateTime(date, time) {
	    var yyyy = date.substring(0, 4);
	    var mm = date.substring(4, 6);
	    var dd = date.substring(6, 8);

	    if (time.length == 3) {
	        time = "0" + time;
	    }

	    var hh = time.substring(0, 2);
	    var min = time.substring(2, 4);
	    var newDate = new Date(yyyy + "-" + mm + "-" + dd);// + "T" + hh + ":" + min + ":00.000Z");
	    return newDate;
	}

	// calculate cone bounds
	function calculation(pl) {
	    var live_start_date = Math.round(pl.length / 2) - 1;
	    var df_train = pl.slice(0, live_start_date);
	    var df_test = pl.slice(live_start_date, pl.length);
	    var cone_std = [1.0, -1.0, 1.5, -1.5, 2.0, -2.0];
	    var starting_value = 1;
	    var num_samples = 1000;
	    var random_seed = false;
	    
	    var cone_bounds = cone_function(df_train, df_test.length, cone_std, starting_value, num_samples, random_seed);
	    
	    return cone_bounds;
	}

	// get cone function - main
	function cone_function(is_returns, num_days, cone_std, starting_value, num_samples, random_seed) {
	    var samples = simulate_paths(is_returns, num_days, starting_value, num_samples, random_seed);
	    var cone_bounds = summarize_paths(samples, cone_std, starting_value);
	    return cone_bounds;
	}

	// simulate for pl
	function simulate_paths(is_returns, num_days, starting_value, num_samples, random_seed) {
	    var samples = [];// = [num_samples][num_days];
	    for (var i = 0; i < num_samples; i++) {
	        var sampleUnit = [];
	        for (var j = 0; j < num_days; j++) {
	            sampleUnit[j] = is_returns[getRandomInt(0, is_returns.length - 1)];
	        }
	        samples[i] = sampleUnit;
	    }
	    return samples;
	}

	// summarize paths for samples
	function summarize_paths(samples, cone_std, starting_value) {
	    var cum_samples = getTransposeMatrix(cum_returns(getTransposeMatrix(samples), starting_value));
	    var cum_mean = getMean(cum_samples);
	    var cum_std = getStd(cum_samples);
	    var cone_bounds = [];

	    for (var i = 0; i < cum_mean.length; i++) {
	      var unitCone = [];
	      for (var j = 0; j < cone_std.length; j++) {
	        
	          unitCone[j] = cum_mean[i] + cum_std[i] * cone_std[j];
	        
	      }
	      cone_bounds[i] = unitCone;
	    }
	    
	    return cone_bounds;
	}

	// get cumulative values for samples
	function cum_returns(returns, starting_value) {
	    if (returns.length < 1) {
	        return null;
	    }

	    var cumData = [];

	    for (var i = 0; i < returns.length; i++) {
	        for (var j = 0; j < returns[i].length; j++) {
	            if (isNaN(returns[i][j])) {
	                returns[i][j] = 0.0;
	            }
	            returns[i][j] = 1.0 + returns[i][j];
	        }
	    }
	    for (var i = 0; i < returns[0].length; i++) {
	        for (var j = 1; j < returns.length; j++) {
	            returns[j][i] = returns[j][i] * returns[j - 1][i];
	        }
	    }

	    for (var i = 0; i < returns.length; i++) {
	        for (var j = 0; j < returns[i].length; j++) {
	            if (starting_value == 0) {

	            } else {
	                returns[i][j] = (returns[i][j]) * starting_value;
	            }
	        }
	    }

	    return returns;
	}

	// Standard Normal variate using Box-Muller transform.
	function randn_bm() {
	    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
	    var v = 1 - Math.random();
	    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI(v));
	}


	/**
	 * Returns a random integer between min (inclusive) and max (inclusive)
	 * Using Math.round() will give you a non-uniform distribution!
	 */
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// get transpose matrix = Get A(T) from A
	function getTransposeMatrix(matrix) {
	    var nRow = matrix.length;
	    var nCol = matrix[0].length;
	    var newMatrix = [];
	    for (var i = 0; i < nCol; i++) {
	        var unit = [];
	        for (var j = 0; j < nRow; j++) {
	            unit[j] = matrix[j][i];    
	        }
	        newMatrix[i] = unit;
	    }
	    return newMatrix;
	}

	// get MEAN
	function getMean(samples) {
	    var nRow = samples.length;
	    var nCol = samples[0].length;
	    var returns = [];
	    for (var i = 0; i < nCol; i++) {
	        // var meanValue = 0;
	        var sum = 0;
	        for (var j = 0; j < nRow; j++) {
	            sum += samples[j][i];
	        }
	        returns[i] = parseFloat(sum) / parseFloat(nRow);
	    }
	    return returns;
	}

	// get STD
	function getStd(samples) {
	    var nRow = samples.length;
	    var nCol = samples[0].length;
	    var mean = getMean(samples);
	    var std = [];
	    // var returns = [];
	    for (var i = 0; i < nCol; i++) {
	        // var meanValue = 0;
	        var sum = 0;
	        for (var j = 0; j < nRow; j++) {
	            sum += Math.abs(samples[j][i] - mean[i]);
	        }
	        std[i] = Math.sqrt(Math.pow((parseFloat(sum) / parseFloat(nRow)), 2));
	    }
	    return std;   
	}
}