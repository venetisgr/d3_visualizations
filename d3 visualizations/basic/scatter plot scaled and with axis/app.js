let data = [
  [400, 200],
  [210, 140],
  [722, 300],
  [70, 160],
];
//console.log(data);

let chart_height = 400;
let chart_width = 800;
let pad = 50;

//SVG element - background plot

let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height);

// data scaling

let x_scale = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(data, function (d) {
      //domain is the input range
      return d[0];
    }),
  ])
  .range([pad, chart_width - pad * 2]); //range is the output range of the scaled data
// center of the circle will not be able to go as far as the length of the plot in order for the whole circle to appear

let y_scale = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(data, function (d) {
      //domain is the input range
      return d[1];
    }),
  ])
  //.range([pad, chart_height - pad]); //range is the output range of the scaled data
  .range([chart_height - pad, pad]); //we are reversing the values in order for the height to increase from bottom to top
// center of the circle will not be able to go as far as the height of the plot in order for the whole circle to appear

/*let r_scale = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(data, function (d) {
      return d[1];
    }),
  ])
  .range([5, 30]); //smaller than the padding */

//scalesqrt works well for circles
let a_scale = d3
  .scaleSqrt()
  .domain([
    0,
    d3.max(data, function (d) {
      return d[1];
    }),
  ])
  .range([0, 25]); //smaller than the padding */

//data points - small circles

// each data (d) corresponds to a list that resembles the row
// for each row a circle is assigned
svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function (d) {
    return x_scale(d[0]); // scaling
  })
  .attr("cy", function (d) {
    return y_scale(d[1]); //scaling
  })
  .attr("r", function (d) {
    return a_scale(d[1]);
  })
  .attr("fill", "gold");

//labels

// join combines the elements of the array by using , between them x,y
svg
  .append("g")
  .selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(function (d) {
    return d.join(",");
  })
  .attr("x", function (d) {
    return x_scale(d[0]);
  })
  .attr("y", function (d) {
    return y_scale(d[1]);
  })
  .attr("font-size", 14)
  .attr("color", "white");

// axis

//x-axis
let x_axis = d3
  .axisBottom(x_scale) //the min,max and the rest of the values of the axis will be taken from the x_scale
  .ticks(6); //no ticks d3 will add extra ticks if needed or remove the unnecessary ones
//.tickValues([0,150,250,600,700]) // we define the specific tics we want

svg
  .append("g")
  .attr("class", "x-axis") //adds the x-axis class which we can modify from css file
  .attr("transform", "translate(0," + (chart_height - pad) + ")") //x axis will stay at the bottom
  // ^^ size of the axis
  .call(x_axis);

//y-axis

let y_axis = d3
  .axisLeft(y_scale) //the min,max and the rest of the values of the axis will be taken from the x_scale
  .ticks(6) //no ticks d3 will add extra ticks if needed or remove the unnecessary ones
  .tickFormat(function (d) {
    return d + "%"; //how the ticks will look
  });

svg
  .append("g")
  .attr("class", "y-axis") //adds the x-axis class which we can modify from css file
  .attr("transform", "translate(" + pad + ",0)") //x axis will stay at the bottom
  // ^^size of the axis
  .call(y_axis);
