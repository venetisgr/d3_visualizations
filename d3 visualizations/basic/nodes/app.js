// Data
let data = {
  nodes: [
    { name: "Jack" },
    { name: "Bob" },
    { name: "Bill" },
    { name: "Jan" },
    { name: "Edward" },
    { name: "Sara" },
    { name: "Nikki" },
    { name: "Ronald" },
    { name: "Jerry" },
    { name: "Zac" },
  ],
  links: [
    // source-target are connected, the number corresponds to the index of the nodes list
    { source: 0, target: 1 },
    { source: 0, target: 2 },
    { source: 0, target: 3 },
    { source: 0, target: 4 },
    { source: 1, target: 5 },
    { source: 2, target: 5 },
    { source: 2, target: 5 },
    { source: 3, target: 4 },
    { source: 5, target: 8 },
    { source: 5, target: 9 },
    { source: 6, target: 7 },
    { source: 7, target: 8 },
    { source: 8, target: 9 },
  ],
};
//console.log(data);

let chart_width = 600;
let chart_height = 600;
//one different color per entry
let color = d3.scaleOrdinal(d3.schemeCategory10);
//if we input in the color function the index location of each value we get a UNIQUE color for each element
let circle_radius = 20;

//force layout // how the nodes will be placed in the plot
let force = d3
  .forceSimulation(data.nodes)
  .force("charge", d3.forceManyBody().strength(-200)) //how the circles will react to each other
  //strength if positive by default circles come closer if negative by default circles distance themselves from each other
  .force("link", d3.forceLink(data.links)) //links between the circles
  .force(
    "center",
    d3
      .forceCenter() //the "center" of the plot is the center of the graph
      .x(chart_width / 2)
      .y(chart_height / 2)
  )
  .force(
    "collision", //makes sure that the circles wont touch each other
    d3.forceCollide().radius(function (d) {
      return circle_radius;
    })
  );

//svg
let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height);

//lines between nodes
let lines = svg
  .selectAll("line")
  .data(data.links)
  .enter()
  .append("line")
  .style("stroke", "black")
  .style("stroke-width", 2);

//nodes

let nodes = svg
  .selectAll("circle")
  .data(data.nodes)
  .enter()
  .append("circle")
  .attr("r", circle_radius)
  .style("fill", function (d, i) {
    return color(i);
  });

//tooltip  /names inside the circle that will appear if we hover our mouse
nodes.append("title").text(function (d) {
  return d.name;
});

//events

//after a certain time has passed (tick) d3 will check the cords of the circles
//if they arent in their original one, it will move them towards it
//this way the circles will start moving towards their final location !!
force.on("tick", function () {
  //what will do after a tick has passed
  lines.attr("x1", function (d) {
    return d.source.x;
  });
  lines.attr("y1", function (d) {
    return d.source.y;
  });
  lines.attr("x2", function (d) {
    return d.target.x;
  });
  lines.attr("y2", function (d) {
    return d.target.y;
  });
  // one point of the line is the coords of the source node and the other point is the coords of the target node

  nodes.attr("cx", function (d) {
    return d.x;
  });
  nodes.attr("cy", function (d) {
    return d.y;
  });
});

/*extra properties for force layout !!!!!!!!!!!!!!!!

forceX and forceY can be used in order to place a node in a specific location in the chart


*/
