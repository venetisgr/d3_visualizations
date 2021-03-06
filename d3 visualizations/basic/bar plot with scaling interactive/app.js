let data = [6, 20, 21, 14, 2, 30, 7, 16, 25, 5, 11, 28, 10, 26];
//console.log(data);
let chart_width = 800;
let chart_height = 400;
let pad = 5; /*the space between the bars */
let sort_flag = 1; //1 asc 0 desc

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
  .attr("fill", "green")
  .on("click", function (e, d) {
    //what happens when we click the element
    //e is the event
    console.log(d);
  });

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

//events

//what happens when we click the button
d3.select("#reverse").on("click", function () {
  // modifications in the data are in place
  data.reverse(); //reverses the data inside
  //since we already have enough rects for our data we wont use the enter() (which is used to add elements for the data that dont have one)

  svg
    .selectAll("rect")
    .data(data) //we only need to update the heights for the new data!!!!!
    .transition() // makes the transition to the new bars more smooth
    //.delay(1000) //1000ms transition will be delayed / will start after 1s
    .delay(function (d, i) {
      return (i / data.length) * 1000; // in this scenario the bars will change one by one
    })
    .duration(1000) //1000ms animation duration
    .ease(d3.easeElasticOut) //type of transition/animation
    .attr("y", function (d) {
      /*y corresponds to the top left edge of the rectangular y goes from TOP TO BOTTOM */
      return chart_height - y_scale(d);
    })
    .attr("height", function (d) {
      //return d * 5; manual calculation of the height
      return y_scale(d);
    });
  //we also need to update the text

  svg
    .selectAll("text")
    .data(data)
    .transition()
    //.delay(1000) //1000ms transition will be delayed / will start after 1s
    .delay(function (d, i) {
      return (i / data.length) * 1000; // in this scenario the bars will change one by one (delay is in ms)
    })
    .duration(1000) //1000ms animation duration
    .ease(d3.easeElasticOut) //type of transition/animation
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return x_scale(i) + x_scale.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return chart_height - y_scale(d) + 15;
    });
});
//////////////////////////////////////////////////////////////////////
//what happens when we click the button
d3.select("#new").on("click", function () {
  //new data BUT THE LENGTH REMAINS THE SAME
  data[0] = 50;
  y_scale.domain([0, d3.max(data)]); //we need to update the scale

  //since we already have enough rects for our data we wont use the enter() (which is used to add elements for the data that dont have one)
  svg
    .selectAll("rect")
    .data(data) //we only need to update the heights for the new data!!!!!
    .transition() // makes the transition to the new bars more smooth
    //.delay(1000) //1000ms transition will be delayed / will start after 1s
    .delay(function (d, i) {
      return (i / data.length) * 1000; // in this scenario the bars will change one by one
    })
    .duration(1000) //1000ms animation duration
    .ease(d3.easeElasticOut) //type of transition/animation
    .attr("y", function (d) {
      /*y corresponds to the top left edge of the rectangular y goes from TOP TO BOTTOM */
      return chart_height - y_scale(d);
    })
    .attr("height", function (d) {
      //return d * 5; manual calculation of the height
      return y_scale(d);
    });
  //we also need to update the text

  svg
    .selectAll("text")
    .data(data)
    .transition()
    //.delay(1000) //1000ms transition will be delayed / will start after 1s
    .delay(function (d, i) {
      return (i / data.length) * 1000; // in this scenario the bars will change one by one (delay is in ms)
    })
    .duration(1000) //1000ms animation duration
    .ease(d3.easeElasticOut) //type of transition/animation
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return x_scale(i) + x_scale.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return chart_height - y_scale(d) + 15;
    });
});
//////////////////////////////////////////////////////////
//what happens when we click the button
d3.select("#new_bar").on("click", function () {
  //new data length increases by one
  let new_num = Math.floor(Math.random() * d3.max(data));
  data.push(new_num);

  //scales need to be updated
  x_scale.domain(d3.range(data.length));
  y_scale.domain([
    0,
    d3.max(data, function (d) {
      return d;
    }),
  ]);

  //select bars
  let bars = svg.selectAll("rect").data(data);

  //add a new bar
  bars
    .enter() //new data point is taken from the waiting room and is assigned to the new bar that will
    .append("rect") //be created from the append method
    .attr("x", function (d, i) {
      return x_scale(i);
    })
    .attr("y", chart_height)
    .attr("width", x_scale.bandwidth())
    .attr("height", 0)
    .attr("fill", "#7ed26d")
    .on("click", function (e, d) {
      //e is the event
      console.log(d);
    })
    .merge(bars) // we select all the bars (old+new)
    .transition()
    //WE ARE RECALCULATING THE SIZE AND LOCATION OF ALL THE BARS IN ORDER FOR THEM TO LOOK AND FIT PROPERLY
    .duration(1000) //1000ms transition period
    .attr("x", function (d, i) {
      /* x corresponds to the top left edge of the rectangular  x goes from left to right*/
      return x_scale(i);
    })
    .attr("y", function (d) {
      /*y corresponds to the top left edge of the rectangular y goes from TOP TO BOTTOM */
      return chart_height - y_scale(d);
    })
    .attr("width", x_scale.bandwidth()) // bandwidth is the width of the bar that was calculated from the scaleBand
    .attr("height", function (d) {
      return y_scale(d);
    });

  //New labels
  let labels = svg.selectAll("text").data(data);
  labels
    .enter() //we add new labels for the new data
    .append("text") //How the new labels will look
    .text(function (d) {
      return d;
    })
    .attr("x", function (d, i) {
      return x_scale(i) + x_scale.bandwidth() / 2;
    })
    .attr("y", chart_height)
    .attr("font-size", "14px")
    .attr("fill", "#fff")
    .attr("text-anchor", "middle")
    .merge(labels) //selects all the labels
    .transition() //we are changing the location of all the labels in order to fit accordingly
    .duration(1000) //1000 ms transition period
    .attr("x", function (d, i) {
      return x_scale(i) + x_scale.bandwidth() / 2;
    })
    .attr("y", function (d) {
      return chart_height - y_scale(d) + 15;
    });
});

//////////////////////////////////////////////////////////
//what happens when we click the button
d3.select("#sort").on("click", function () {
  //data sorting

  svg
    .selectAll("rect")
    .sort(function (a, b) {
      return sort_flag ? d3.ascending(a, b) : d3.descending(a, b);
    })
    .transition()
    .duration(1000) //duration lasts for 1000ms
    .attr("x", function (d, i) {
      return x_scale(i);
    });

  svg
    .selectAll("text")
    .sort(function (a, b) {
      return sort_flag ? d3.ascending(a, b) : d3.descending(a, b);
    })
    .transition()
    .duration(1000) //duration lasts for 1000ms
    .attr("x", function (d, i) {
      return x_scale(i) + x_scale.bandwidth() / 2;
    });

  sort_flag = !sort_flag;
});
