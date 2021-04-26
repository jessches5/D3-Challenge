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

      