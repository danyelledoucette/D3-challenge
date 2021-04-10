var svgWidth = 960;
var svgHeight = 550;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
}

var width = svgWidth - margin.left - margin.right
var height = svgHeight - margin.top - margin.bottom

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
        d3.max(healthData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
  }

  // function used for updating y-scale var upon click on axis label
// function yScale(healthData, chosenYAxis) {
//   // create scales
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
//       d3.max(healthData, d => d[chosenYAxis]) * 1.2
//     ])
//     .range([0, width]);

//   return yLinearScale;

// }

  // function used for updating xAxis var upon click on axis label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  

  // function used for updating yAxis var upon click on axis label
  // function renderYAxes(newYScale, yAxis) {
  //   var leftAxis = d3.axisBottom(newYScale);
  
  //   yAxis.transition()
  //     .duration(1000)
  //     .call(leftAxis);
  
  //   return yAxis;
  // }
  
  function renderXCircles(xcirclesGroup, newXScale, chosenXAxis) {
  
    xcirclesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return xcirclesGroup;
  }

  // function renderYCircles(ycirclesGroup, newYScale, chosenYAxis) {
  
  //   ycirclesGroup.transition()
  //     .duration(1000)
  //     .attr("cy", d => newYScale(d[chosenYAxis]));
  
  //   return ycirclesGroup;
  // }


//   // function used for updating circles group with a transition to
  // new circles (y)
//   function renderCircles(circlesGroup, newYScale, chosenYAxis) {
  
//     circlesGroup.transition()
//       .duration(1000)
//       .attr("cy", d => newXScale(d[chosenYAxis]));
  
//     return circlesGroup;
//   }

  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, xcirclesGroup) {
  
    var xlabel;
  
    if (chosenXAxis === "poverty") {
      xlabel = "Poverty (%):";
    }
    else if (chosenXAxis === "age"){
      xlabel= "Age (Median):";
    }
    else {
      xlabel = "Household Income (Median):"
    }
  

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}`);
      });
  
    xcirclesGroup.call(toolTip);
  
    xcirclesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data, this);
      });
  
    return xcirclesGroup;
  }  

// function updateToolTip(chosenYAxis, ycirclesGroup) {
  
//     var ylabel;
  
//     if (chosenYAxis === "healthcare") {
//       ylabel = "Lacks Healthcare (%):";
//     }
//     else if (chosenYAxis === "age"){
//       ylabel= "Smokes (%):";
//     }
//     else {
//       ylabel = "Obese (%):"
//     }
  

//     var toolTip = d3.tip()
//       .attr("class", "tooltip")
//       .offset([80, -60])
//       .html(function(d) {
//         return (`${d.state}<br>${ylabel} ${d[chosenYAxis]}`);
//       });
  
//     ycirclesGroup.call(toolTip);
  
//     ycirclesGroup.on("mouseover", function(data) {
//       toolTip.show(data, this);
//     })
//       // onmouseout event
//       .on("mouseout", function(data, index) {
//         toolTip.hide(data, this);
//       });
  
//     return ycirclesGroup;
//   }  

d3.csv("assets/data/data.csv").then(function(healthData, err) {
    if (err) throw err;

    healthData.forEach(function(data) {
        
        console.log(data)

        data.poverty = +data.poverty;
        data.age = +data.age;
        data.income = +data.income;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
    });

    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty)+2])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([2, d3.max(healthData, d => d.healthcare)+2])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale).tickValues([10,12,14,16,18,20,22]);
    var leftAxis = d3.axisLeft(yLinearScale).tickValues([4,6,8,10,12,14,16,18,20,22,24,26]);


    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var xcirclesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");

    // var ycirclesGroup = chartGroup.selectAll("circle")
    //     .data(healthData)
    //     .enter()
    //     .append("circle")
    //     .attr("cx", d => xLinearScale(d.poverty))
    //     .attr("cy", d => yLinearScale(d.healthcare))
    //     .attr("r", "15")
    //     .attr("fill", "blue")
    //     .attr("opacity", ".5");

    // Create group for three x-axis labels
    var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

    // Create group for three y-axis labels
    var ylabelsGroup = chartGroup.append("g")
    // .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 30)
      .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

    var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height / 2))
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

    var obeseLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 70)
      .attr("x", 0 - (height / 2))
    .attr("value", "obese") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");

  // Create axes labels
    
    // chartGroup.append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 0 - margin.left + 40)
    //   .attr("x", 0 - (height / 2))
    //   .attr("dy", "1em")
    //   .attr("class", "axisText")
    //   .text("Lacks Healthcare (%)");

var xcirclesGroup = updateToolTip(chosenXAxis, xcirclesGroup);
var ycirclesGroup = updateToolTip(chosenYAxis, ycirclesGroup);

// x axis labels event listener
xlabelsGroup.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    xLinearScale = xScale(healthData, chosenXAxis);

    // updates x axis with transition
    xAxis = renderAxes(xLinearScale, xAxis);

    // updates circles with new x values
    xcirclesGroup = renderCircles(xcirclesGroup, xLinearScale, chosenXAxis);

    // updates tooltips with new info
    xcirclesGroup = updateToolTip(chosenXAxis, xcirclesGroup);

    console.log(chosenXAxis);

    // changes classes to change bold text
    if (chosenXAxis === "poverty") {
      povertyLabel
        .classed("active", true)
        .classed("inactive", false);
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true)  
    }
    else if (chosenXAxis === "age"){
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      ageLabel
        .classed("active", true)
        .classed("inactive", false);
      incomeLabel
        .classed("active", false)
        .classed("inactive", true)  
    }
    else {
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
      incomeLabel
        .classed("active", true)
        .classed("inactive", false)      
    }
  }
});
// }).catch(function(error) {
// console.log(error);

// // x axis labels event listener
// ylabelsGroup.selectAll("text")
// .on("click", function() {
//   // get value of selection
//   var value = d3.select(this).attr("value");
//   if (value !== chosenYAxis) {

//     // replaces chosenXAxis with value
//     chosenYAxis = value;

//     // console.log(chosenXAxis)

//     // functions here found above csv import
//     // updates x scale for new data
//     yLinearScale = yScale(healthData, chosenYAxis);

//     // updates x axis with transition
//     yAxis = renderAxes(yLinearScale, yAxis);

//     // updates circles with new x values
//     ycirclesGroup = renderCircles(ycirclesGroup, yLinearScale, chosenYAxis);

//     // updates tooltips with new info
//     ycirclesGroup = updateToolTip(chosenYAxis, ycirclesGroup);

//     console.log(chosenYAxis);

//     // changes classes to change bold text
//     if (chosenYAxis === "healthcare") {
//       healthcareLabel
//         .classed("active", true)
//         .classed("inactive", false);
//       smokesLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       obeseLabel
//         .classed("active", false)
//         .classed("inactive", true)  
//     }
//     else if (chosenYAxis === "smokes"){
//       healthcareLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       smokesLabel
//         .classed("active", true)
//         .classed("inactive", false);
//       obeseLabel
//         .classed("active", false)
//         .classed("inactive", true)  
//     }
//     else {
//       healthcareLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       smokesLabel
//         .classed("active", false)
//         .classed("inactive", true);
//       obeseLabel
//         .classed("active", true)
//         .classed("inactive", false)      
//     }
//   }
// });
// }).catch(function(error) {
// console.log(error);

});