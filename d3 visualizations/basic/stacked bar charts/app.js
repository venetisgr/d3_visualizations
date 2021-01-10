// Data
let data = [
  { pigeons: 6, doves: 8, eagles: 15 },
  { pigeons: 9, doves: 15, eagles: 5 },
  { pigeons: 11, doves: 13, eagles: 14 },
  { pigeons: 15, doves: 4, eagles: 20 },
  { pigeons: 22, doves: 25, eagles: 23 },
];
//console.log(data);

let chart_width = 800;
let chart_height = 400;
//one different color per entry
let color = d3.scaleOrdinal(d3.schemeCategory10);
//if we input in the color function the index location of each value we get a UNIQUE color for each element

//stack layout
let stack = d3
  .stack() //it will convert our data in a format that can be used by the stacked bar visualization
  .keys(["pigeons", "doves", "eagles"]); //names of the categories
//it groups the data based on the categories we define

//data format -> [ group1_list,group2_list], each lists contains the bottom and the top part of each bar for each row/example
// [ [1], [2], [3]]

//data prep
let stack_data = stack(data);
console.log(stack_data);

//scales

let x_scale = d3
  .scaleBand()
  .domain(d3.range(data.length))
  .range([0, chart_width])
  .paddingInner(0.05);

let y_scale = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(data, function (d) {
      return d.pigeons + d.doves + d.eagles;
    }),
  ])
  .range([chart_height, 0]);

//svg element

let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height);

//groups-bars creation

let groups = svg
  .selectAll("g")
  .data(stack_data)
  .enter()
  .append("g")
  .style("fill", function (d, i) {
    //each unique category will have its unique color
    return color(i);
  });

//color
// the index corresponds to each class, elements of the same class have the same index

//bar customization
groups
  .selectAll("rect")
  .data(function (d) {
    return d; //this way all arrays are placed in the waiting room, like combining the 3 arrays into one
    // [[1],[2],[3]]-->[1,2,3]
  })
  .enter()
  .append("rect")
  .attr("x", function (d, i) {
    return x_scale(i);
  })
  .attr("y", function (d) {
    return y_scale(d[1]);
  })
  .attr("height", function (d) {
    return y_scale(d[0]) - y_scale(d[1]);
  })
  .attr("width", x_scale.bandwidth());

// IMPORTANT NOTES !!!!!!!!!!!!
//height
//essentially we get to itterate through all elements which contain the bottom and top part of the corresponding bar
//location - index
// The index here corresponds to the location of each bar, bars of the same stack get the same index
