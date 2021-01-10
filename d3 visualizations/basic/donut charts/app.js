// Data
let data = [10, 24, 16, 30, 20];

//console.log(data);

let chart_width = 600;
let chart_height = 600;
//one different color per entry
let color = d3.scaleOrdinal(d3.schemeCategory10);
//if we input in the color function the index location of each value we get a UNIQUE color for each element

//pie layout

let pie = d3.pie();

//arc

//draws an arc

let outer_radius = chart_width / 2; //essentially the "length" of one pie from center to edge
let inner_radius = 200; // must be smaller than outer radius
let arc = d3.arc().innerRadius(inner_radius).outerRadius(outer_radius);

//svg element

let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height);

//groups - arc creation

let arcs = svg
  .selectAll("g.arc") //groups with the arc class
  .data(pie(data)) //pie converts the data in radius (pi) format which is necessary
  .enter()
  .append("g") // for each data a g is created with the class arc
  .attr("class", "arc") //properties for each appended group=arc bellow
  .attr(
    "transform",
    "translate(" + outer_radius + "," + chart_height / 2 + ")"
  );

//arc properties
arcs
  .append("path")
  .attr("fill", function (d, i) {
    return color(i);
    //if we input in the color function the index location of each value we get a UNIQUE color for each element
  })
  .attr("d", arc);

//labels
arcs
  .append("text")
  .attr("transform", function (d, i) {
    return "translate(" + arc.centroid(d) + ")"; //centroid is the center of the pie
  })
  .attr("text-anchor", "text-middle")
  .text(function (d) {
    return d.value;
  });
