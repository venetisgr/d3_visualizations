// Data
let data = [
  { date: 1988, num: 51 },
  { date: 1989, num: 60 },
  { date: 1990, num: 62 },
  { date: 1991, num: -64 },
  { date: 1992, num: 69 },
  { date: 1993, num: 69 },
  { date: 1994, num: 75 },
  { date: 1995, num: 80 },
  { date: 1996, num: 91 },
  { date: 1997, num: 93 },
  { date: 1998, num: 97 },
  { date: 1999, num: 100 },
  { date: 2000, num: -103 },
  { date: 2001, num: 104 },
  { date: 2002, num: 105 },
  { date: 2003, num: 110 },
  { date: 2004, num: 111 },
  { date: 2005, num: 112 },
  { date: 2006, num: 112 },
  { date: 2007, num: 113 },
  { date: 2008, num: 119 },
  { date: 2009, num: 128 },
  { date: 2010, num: 139 },
  { date: 2011, num: -139 },
  { date: 2012, num: 139 },
  { date: 2013, num: 140 },
  { date: 2014, num: 143 },
  { date: 2015, num: 146 },
  { date: 2016, num: 147 },
  { date: 2017, num: 149 },
];

//Data prep
let time_parse = d3.timeParse("%Y"); //indicates that the value is a year //parsing converts it in a proper d3 format
let time_format = d3.timeFormat("%Y"); // how the data will look //formating changes the way the variables look
data.forEach(function (d, i) {
  //d is the row and i is the index
  //d.date = time_parse(d.date); //same as the bellow
  data[i].date = time_parse(d.date);
});
//console.log(data);

let chart_width = 1000;
let chart_height = 800;
let padding = 50;

//scales

let x_scale = d3
  .scaleTime()
  .domain([
    //input range of values
    d3.min(data, function (d) {
      return d.date;
    }),
    d3.max(data, function (d) {
      return d.date;
    }),
  ])
  .range([padding, chart_width - padding]); //output range of values

let y_scale = d3
  .scaleLinear()
  .domain([
    //input range of values
    0,
    d3.max(data, function (d) {
      return d.num;
    }),
  ])
  .range([chart_height - padding, padding]); // output range of values , must be reversed max,min

//elements

//background
let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height);

//axes values

let x_axis = d3.axisBottom(x_scale).ticks(10).tickFormat(time_format); ////will extract the min and max from x_scale
let y_axis = d3.axisLeft(y_scale).ticks(12); //will extract the min and max from y_scale

//axes visualization
svg
  .append("g")
  .attr("transform", "translate(0," + (chart_height - padding) + ")")
  .call(x_axis);
svg
  .append("g")
  .attr("transform", "translate(" + padding + ",0)")
  .call(y_axis);

//create a line

//we can create a line for normal data and one for important data using the defined function
//normal
let line = d3
  .line()
  .defined(function (d) {
    //if we return True the line will pass through these data points
    return d.num >= 0 && d.num <= 100;
    //values that are bellow 0 are bellow our axis, thus we dont want our line to pass through them
  })
  .x(function (d) {
    return x_scale(d.date); //x value
  })
  .y(function (d) {
    return y_scale(d.num); // y value
  });

//important

let i_line = d3
  .line()
  .defined(function (d) {
    //if we return True the line will pass through these data points
    return d.num >= 0 && d.num > 100;
    //values that are bellow 0 are bellow our axis, thus we dont want our line to pass through them
  })
  .x(function (d) {
    return x_scale(d.date); //x value
  })
  .y(function (d) {
    return y_scale(d.num); // y value
  });

//we can fill the area beneath the lines
let area = d3
  .area()
  .defined(function (d) {
    //if we return True the area bellow it will be filled if false it will be skipped
    return d.num >= 0 && d.num <= 100;
    //values that are bellow 0 are bellow our axis, thus we want to skip them
  })
  .x(function (d) {
    return x_scale(d.date); //x value
  })
  .y0(function (d) {
    return y_scale.range()[0]; // y value
  })
  .y1(function (d) {
    return y_scale(d.num); // y value
  });

let i_area = d3
  .area()
  .defined(function (d) {
    //if we return True the area bellow it will be filled if false it will be skipped
    return d.num >= 0 && d.num > 100;
    //values that are bellow 0 are bellow our axis, thus we want to skip them
  })
  .x(function (d) {
    return x_scale(d.date); //x value
  })
  .y0(function (d) {
    return y_scale.range()[0]; // y value
  })
  .y1(function (d) {
    return y_scale(d.num); // y value
  });

//area gets filled from y0 to y1 !!

//normal line
svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 5)
  .attr("d", line);

//important line
svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "red")
  .attr("stroke-width", 5)
  .attr("d", i_line);

//normal area
svg.append("path").datum(data).attr("fill", "green").attr("d", area);

//important area
svg.append("path").datum(data).attr("fill", "red").attr("d", i_area);
