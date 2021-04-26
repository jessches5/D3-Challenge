// Set svg Width and Height
var svgWidth = outerWidth *.75;
var svgHeight = outerHeight * .75;

// Set margin parameters
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// Set width and height variables
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

 // Import Data
d3.csv("assets/data/data.csv").then(function(stateData) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  stateData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });
  
  // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d.poverty) -.5, d3.max(stateData, d => d.poverty)])
      .range([0, width]);

      var yLinearScale = d3.scaleLinear()
      .domain([d3.min(stateData, d => d.healthcare) -1, d3.max(stateData, d => d.healthcare)])
      .range([height, 0]);

      // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

      chartGroup.append("g")
      .call(leftAxis);

      // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "17")
    .attr("fill", "teal")
    .attr("opacity", ".75");

    var textGroup = chartGroup.selectAll()
    .data(stateData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => d.abbr)
    .attr("r", "17")
    .attr("text-anchor", "middle")
    .style("fill", "white");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([4, -8])
      .html(function(d) {
        return (`${d.state}<hr><br>Percentage in Poverty: ${d.poverty}<br>Percentage with access to healthcare: ${d.healthcare}`);
      });

      // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

   // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
    
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Percentage with Access to Healthcare");

      chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Percentage in Poverty");
  }).catch(function(error) {
    console.log(error);
  });