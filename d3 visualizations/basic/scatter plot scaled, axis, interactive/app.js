let data = [
  [400, 200],
  [210, 140],
  [722, 300],
  [70, 160],
  [117, 666],
  [250, 100],
  [300, 200],
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
  .append("g")
  .attr("id", "plot-area")
  .attr("clip-path", "url(#plot-area-clip-path)")
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
  /*.attr("r", function (d) {
    return a_scale(d[1]);
  })*/
  .attr("r", 15)
  .attr("fill", "gold");

//labels

// join combines the elements of the array by using , between them x,y
svg
  .append("g")
  .attr("class", "text")
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

//clip paths data outside of our axis will be removed
svg
  .append("clipPath")
  .attr("id", "plot-area-clip-path")
  .append("rect")
  .attr("x", pad)
  .attr("y", pad)
  .attr("width", chart_width - pad * 3)
  .attr("height", chart_height - pad * 2);

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

//events//////////////////////////////////

//what happens when we click the button
d3.select("#new").on("click", function () {
  //new data with different length

  data = [];
  let max_num = Math.random() * 1000; // new max number

  //new data creation
  for (let i = 0; i < 7; i++) {
    let temp_x = Math.floor(Math.random() * max_num);
    let temp_y = Math.floor(Math.random() * max_num);
    data.push([temp_x, temp_y]);
  }

  //scale update in order to accomodate for the new data
  x_scale.domain([
    0,
    d3.max(data, function (d) {
      return d[0];
    }),
  ]);

  y_scale.domain([
    0,
    d3.max(data, function (d) {
      return d[1];
    }),
  ]);

  //new circles

  //list of random colors
  let colors = ["yellow", "red", "pink", "blue", "orange"];
  let color_index = Math.floor(Math.random() * colors.length);
  //selects a random color for the circles after the transition ends

  svg
    .selectAll("circle")
    .data(data)
    .transition()
    .duration(1000) //animation lasts 1000ms
    .on("start", function () {
      //what happens when the transition begins
      d3.select(this) //accesses the current circle which is animated
        .attr("fill", "#f26d2d");
      //while the circles are moving their color will be orange
    })
    .attr("cx", function (d) {
      return x_scale(d[0]); // scaling
    })
    .attr("cy", function (d) {
      return y_scale(d[1]); //scaling
    })
    /*.on("end", function () {
      //what happens when the transition ends

      d3.select(this) //accesses the current circle which is animated
        .attr("fill", "gold"); //when the circles are done moving they will return to their original color
    }); */
    .attr("fill", colors[color_index]);

  //new axis
  svg.select(".x-axis").transition().duration(1000).call(x_axis);

  svg.select(".y-axis").transition().duration(1000).call(y_axis);

  //new labels

  svg
    .select(".text")
    .selectAll("text")
    .data(data)
    .transition()
    .duration(1000) //animation lasts 1000ms
    .text(function (d) {
      return d.join(",");
    })
    .attr("x", function (d) {
      return x_scale(d[0]);
    })
    .attr("y", function (d) {
      return y_scale(d[1]);
    });
});
