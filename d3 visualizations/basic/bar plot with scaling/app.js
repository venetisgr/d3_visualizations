let data = [6, 20, 21, 14, 2, 30, 7, 16, 25, 5, 11, 28, 10, 26];
//console.log(data);
let chart_width = 800;
let chart_height = 400;
let pad = 5; /*the space between the bars */

let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height);

//scalling

let x_scale = d3
  .scaleBand() // equally distributes our data within the given range
  .domain(d3.range(data.length)) // creates an array of unique numbers
  .range([0, chart_width]) // our data are equally distributed in this range(width of our chart)
  .paddingInner(0.05); //space between bars

let y_scale = d3
  .scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, chart_height]);

/*  BARS */

//x,y positions are on the top left side of the bar x goes from left to right and y from top to bottom
svg
  .selectAll("rect") /*appends the bar boxes */
  .data(data)
  .enter()
  .append("rect")
  .attr("x", function (d, i) {
    /* x corresponds to the top left edge of the rectangular  x goes from left to right*/
    //return (i * chart_width) / data.length; //custom return in order to have empty space between the bars
    return x_scale(i);
  })
  .attr("y", function (d) {
    /*y corresponds to the top left edge of the rectangular y goes from TOP TO BOTTOM */
    //return chart_height - d * pad; //manual calculation of the y position
    return chart_height - y_scale(d);
  })
  //.attr("width", chart_width / data.length - pad) //custom width of the bar
  .attr("width", x_scale.bandwidth()) // bandwidth is the width of the bar that was calculated from the scaleBand
  .attr("height", function (d) {
    //return d * 5; manual calculation of the height
    return y_scale(d);
  })
  .attr("fill", "green");

//labels inside the bars

svg
  .selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(function (d) {
    return d; //the labels inside will show the number that corresponds to the bar chart
  })
  .attr("x", function (d, i) {
    //text will be centered
    /*return (
      i * (chart_width / data.length) + (chart_width / data.length - pad) / 2
    );*/
    return x_scale(i) + x_scale.bandwidth() / 2;
  })
  .attr("y", function (d) {
    //return chart_height - d * pad + 15; //15 is found via trial and error
    return chart_height - y_scale(d) + 15; //is found via trial and error
  })
  .attr("font-size", 14)
  .attr("fill", "white")
  .attr("text-anchor", "middle");
