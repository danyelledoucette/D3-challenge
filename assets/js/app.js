// TRIED TO GET THE BONUS TO WORK, SO SOME OF THIS CODE IS FOR THE BONUS SECTION
// 
// 

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
  
  // function used for updating xAxis var upon click on axis label
  function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles (x)
  function renderCircles(xcirclesGroup, newXScale, chosenXAxis) {
  
    xcirclesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return xcirclesGroup;
  }


  // function used for updating circles group with new tooltip
  function updateToolTip(chosenXAxis, xcirclesGroup) {
  
    var label;
  
    if (chosenXAxis === "poverty") {
      label = "Poverty (%):";
    }
    else if (chosenXAxis === "age"){
      label = "Age (Median):";
    }
    else {
        xlabel = "Household Income (Median):"
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      // .attr("color", "black")
      .offset([60, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
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

    chartGroup.select("g")
        .selectAll("circle")
        .data(healthData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .attr("dy",-425)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "black");

    var xcirclesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "10")
        .attr("fill", "lightblue")
        .attr("opacity", ".5")
        .attr("stroke-width", "1")
        .attr("stroke","black");

    // Create group for three x-axis labels
    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    // var ageLabel = labelsGroup.append("text")
    // .attr("x", 0)
    // .attr("y", 40)
    // .attr("value", "age") // value to grab for event listener
    // .classed("inactive", true)
    // .text("Age (Median)");

    // var incomeLabel = labelsGroup.append("text")
    // .attr("x", 0)
    // .attr("y", 60)
    // .attr("value", "income") // value to grab for event listener
    // .classed("inactive", true)
    // .text("Household Income (Median)");

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

var xcirclesGroup = updateToolTip(chosenXAxis, xcirclesGroup);

// x axis labels event listener
// labelsGroup.selectAll("text")
// .on("click", function() {
//   // get value of selection
//   var value = d3.select(this).attr("value");
//   if (value !== chosenXAxis) {

//     // replaces chosenXAxis with value
//     chosenXAxis = value;

//     // console.log(chosenXAxis)

//     // functions here found above csv import
//     // updates x scale for new data
//     xLinearScale = xScale(healthData, chosenXAxis);

//     // updates x axis with transition
//     xAxis = renderAxes(xLinearScale, xAxis);

//     // updates circles with new x values
//     xcirclesGroup = renderCircles(xcirclesGroup, xLinearScale, chosenXAxis);

//     // updates tooltips with new info
//     xcirclesGroup = updateToolTip(chosenXAxis, xcirclesGroup);

//     // changes classes to change bold text
//     if (chosenXAxis === "poverty") {
//       povertyLabel
//         .classed("active", true)
//         .classed("inactive", false);
//       ageLabel
//         .classed("active", false)
//         .classed("inactive", true);
//         incomeLabel
//         .classed("active", false)
//         .classed("inactive", true);
//     }
//     else if (chosenXAxis === "age") {
//         povertyLabel
//         .classed("active", false)
//         .classed("inactive", true);
//         ageLabel
//         .classed("active", true)
//         .classed("inactive", false);
//         incomeLabel
//         .classed("active", false)
//         .classed("inactive", true);
//     }
//     else {
//         povertyLabel
//         .classed("active", false)
//         .classed("inactive", true);
//         ageLabel
//         .classed("active", false)
//         .classed("inactive", true);
//         incomeLabel
//         .classed("active", true)
//         .classed("inactive", false); 
//     }
//   }
// });
// }).catch(function(error) {
// console.log(error);


});