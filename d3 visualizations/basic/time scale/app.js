let data = [
  { date: "10/07/2017", num: 20 },
  { date: "11/07/2017", num: 37 },
  { date: "12/07/2017", num: 25 },
  { date: "13/07/2017", num: 45 },
  { date: "20/07/2017", num: 23 },
  { date: "25/07/2017", num: 33 },
  { date: "30/07/2017", num: 49 },
];
console.log(data);

let chart_height = 400;
let chart_width = 800;
let pad = 50;

//data parsing

let time_parse = d3.timeParse("%d/%m/%Y"); //date format (month/day/year) of our input data
data.forEach(function (d, i) {
  data[i].date = time_parse(d.date); //we convert our data in the correct format that d3 can understand
});

//data formatting
let time_format = d3.timeFormat(" %e %b"); // how our data will look when displayed

//console.log(data);
//SVG element - background plot

let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height);

// data scaling

let x_scale = d3
  .scaleTime()
  .domain([
    d3.min(data, function (d) {
      return d.date;
    }),
    d3.max(data, function (d) {
      //domain is the input range
      return d.date;
    }),
  ])
  .range([pad, chart_width - pad * 2]); //range is the output range of the scaled data
// center of the circle will not be able to go as far as the length of the plot in order for the whole circle to appear

let y_scale = d3
  .scaleTime()
  .domain([
    0,
    d3.max(data, function (d) {
      //domain is the input range
      return d.num;
    }),
  ])
  //.range([pad, chart_height - pad]); //range is the output range of the scaled data
  .range([chart_height - pad, pad]); //we are reversing the values in order for the height to increase from bottom to top
// center of the circle will not be able to go as far as the height of the plot in order for the whole circle to appear

//scalesqrt works well for circles
let a_scale = d3
  .scaleSqrt()
  .domain([
    0,
    d3.max(data, function (d) {
      return d.num;
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
    return x_scale(d.date); // scaling
  })
  .attr("cy", function (d) {
    return y_scale(d.num); //scaling
  })
  .attr("r", function (d) {
    return a_scale(d.num);
  })
  .attr("fill", "gold");

//labels

// join combines the elements of the array by using , between them x,y
svg
  .selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(function (d) {
    return time_format(d.date);
  })
  .attr("x", function (d) {
    return x_scale(d.date);
  })
  .attr("y", function (d) {
    return y_scale(d.num);
  })
  .attr("font-size", 14)
  .attr("color", "white");
