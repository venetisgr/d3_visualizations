let margin = { left: 100, right: 100, top: 100, bottom: 150 };
let chart_width = 1200 - margin.left - margin.right;
let chart_height = 700 - margin.top - margin.bottom;

//
//
//appends and selects the svg element, our plot will be placed inside it
//d3 plots must be inside an svg element
let svg = d3
  .select("#chart")
  .append("svg")
  //appends the svg element and returns a selection for that element, that means that the svg variable points to the element
  .attr("width", chart_width + margin.left + margin.right) //svg element properties
  .attr("height", chart_height + margin.top + margin.bottom);

//We append a group element inside the svg element, inside we will place our bars and later on the axis
let g = svg
  .append("g")
  .attr("class", "chart")
  .attr("transform", `translate(${margin.left},${margin.top})`);
// our (0,0) in g is shifted to the bottom and right compared to the svg element

// Labels of row and columns
var myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
var myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"];

// Build X scales and axis:
var x = d3.scaleBand().range([0, chart_width]).domain(myGroups).padding(0.01);
g.append("g")
  .attr("transform", "translate(0," + chart_height + ")")
  .call(d3.axisBottom(x));

// Build Y scales and axis:
var y = d3.scaleBand().range([chart_height, 0]).domain(myVars).padding(0.01);
g.append("g").call(d3.axisLeft(y));

// Build color scale
var myColor = d3.scaleLinear().range(["white", "#69b3a2"]).domain([1, 100]);

let global_data = 0;
//Read the data
d3.csv(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv"
).then((data) => {
  //console.log(data);
  global_data = data;
  heat = g.append("g").attr("class", "heat");
  heat
    .selectAll("rect")
    .data(data, function (d) {
      return d.group + ":" + d.variable;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.group);
    })
    .attr("y", function (d) {
      return y(d.variable);
    })
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) {
      return myColor(d.value);
    });

  console.log(data);
  // we create new data
  data[0].value = 0;
  data[1].value = 80;
  data[2].value = 80;
  data[3].value = 80;
  data[4].value = 80;
});

/*          NOTES         */

//our svg dimensions are the same as the background and are equal to the chart dimensions + padding
//all our elements are placed inside a group element
//this group element is shifted to the right and bottom using the translate
//this means that the (0,0) of the g element is shifted compared to svg's (0,0) by margin.left and margin.top
//this means that our scales can start from zero since the top and left padding are already calculated
// margin left and margin bottom leave enough space for the axis and the labels

//event listeners

// CHANGE THE GRAPH BY DELETING THE PREVIOUS ONE
/*
d3.select(".options").on("change", function (e) {
  console.log(e.target.value);
  d3.select(".chart").html(""); // clears all the html inside

  // Build X scales and axis:
  var x = d3.scaleBand().range([0, chart_width]).domain(myGroups).padding(0.01);
  g.append("g")
    .attr("transform", "translate(0," + chart_height + ")")
    .call(d3.axisBottom(x));

  // Build Y scales and axis:
  
  var y = d3.scaleBand().range([chart_height, 0]).domain(myVars).padding(0.01);
  g.append("g").call(d3.axisLeft(y));
  x;
  g.selectAll("rect")
    .data(global_data, function (d) {
      return d.group + ":" + d.variable;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.group);
    })
    .attr("y", function (d) {
      return y(d.variable);
    })
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) {
      return myColor(d.value);
    });
});

*/

// FOR PICKING THE RIGHT DATASET WE CAN USE FILTER
// CHANGE THE GRAPH BY UPDATING THE PREVIOUS ONE

d3.select(".options").on("change", function (e) {
  console.log(e.target.value);
  //d3.select(".chart").html(""); // clears all the html inside
  d3.select(".heat").html("");
  heat
    .selectAll("rect")
    .data(global_data, function (d) {
      return d.group + ":" + d.variable;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.group);
    })
    .attr("y", function (d) {
      return y(d.variable);
    })
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) {
      return myColor(d.value);
    });
});
