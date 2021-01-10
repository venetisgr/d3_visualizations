let margin = { left: 100, right: 100, top: 10, bottom: 150 };
let chart_width = 1100 - margin.left - margin.right;
let chart_height = 700 - margin.top - margin.bottom;
let pad = 0.05; /*the space between the bars */

//time-parse for x-scale
let parseTime = d3.timeParse("%Y");

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
  .attr("transform", `translate(${margin.left},${margin.top})`);
// our (0,0) in g is shifted to the bottom and right compared to the svg element

//
//
// TOOLTIP
let tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .attr("style", "position: absolute; opacity: 0;")
  .style("background-color", "black")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px");
//
//

//
//
// Data Load
d3.csv(
  "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_stacked.csv"
).then((data) => {
  /*data.forEach((d) => {
    d.value = Number(d.value);
    d.year = parseTime(d.year); //time parsing
  });
  */
  let subgroups = data.columns.slice(1);
  console.log(subgroups); // they will be stacked on top of each other

  let groups = [];
  data.forEach((d) => {
    groups.push(d.group);
  });
  console.log(groups); // categories of x axis

  // THE REST OF THE CODE IS EXECUTED ONLY AFTER THE DATA ARE LOADED
  console.log(data);

  //
  //
  /*   Scales   */
  //scale converts our input to range to an appropriate range in order for the diagram to fit in the defined space
  let x_scale = d3.scaleBand().domain(groups).range([0, chart_width]);

  //max height
  let max_value = 0;
  let sum = 0;
  data.forEach((row) => {
    subgroups.forEach((subg) => {
      sum = sum + Number(row[subg]);
    });
    max_value = Math.max(max_value, sum);
    sum = 0;
  });
  console.log(max_value);

  let y_scale = d3
    .scaleLinear()
    .domain([0, max_value])
    .range([chart_height, 0]);
  //
  //
  /*    Axis   */

  let xAxis = d3.axisBottom(x_scale).tickSizeInner(-chart_height);

  g.append("g") // axis is placed inside a group element which is inside the overall g element
    .attr("class", "x-axis")
    .attr("transform", `translate(${0},${chart_height})`) // is actually placed on the top thus we need to shift it to the bottom
    .call(xAxis)
    .selectAll("text")
    .attr("y", 10)
    .attr("x", "-5")
    .attr("text-anchor", "end");

  let yAxis = d3.axisLeft(y_scale).tickSizeInner(-chart_width - 5); //innerticksize adds gridlines
  g.append("g") // axis is placed inside a group element which is inside the overall g element
    .attr("class", "y-axis")
    .attr("transform", `translate(${0},0)`)
    .call(yAxis);

  //
  //
  /* Axis Labels */
  //x label
  g.append("g")
    .attr("class", "x-label")
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", chart_width / 2)
    .attr("y", chart_height + margin.bottom - 5)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Categories");

  //y label
  g.append("g")
    .attr("class", "y-label")
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", -chart_height / 2) // x and y are actually reversed x=y and y=x
    .attr("y", -50) // 0 of the g element is shifted to the right and bottom compared to the the (0,0) of the svg element
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Stacked Values");

  //
  //
  //Color palete one for each subcategory
  let color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  //
  //
  //Convert the data in the proper stacked format
  //stack the data? --> stack per subgroup
  let stackedData = d3.stack().keys(subgroups)(data);

  //
  //
  //Stacked Bars

  g.append("g")
    .selectAll(".subgroups")
    // we iterate through each subcategory
    .data(stackedData)
    .enter()
    .append("g")
    .attr("class", "subgroups")

    .attr("fill", function (d) {
      return color(d.key);
    })
    .selectAll("rect")
    // we itterate for each example
    .data(function (d) {
      return d;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x_scale(d.data.group);
    })
    .attr("y", function (d) {
      return y_scale(d[1]);
    })
    .attr("height", function (d) {
      return y_scale(d[0]) - y_scale(d[1]);
    })
    .attr("width", x_scale.bandwidth() / 2)
    .on("mouseover", function (e, d) {
      d3.select("#tooltip")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .text(`${d[1]}`);
    })
    .on("mouseout", function () {
      d3.select("#tooltip").style("opacity", 0);
    })
    .on("mousemove", function (e, d) {
      d3.select("#tooltip")
        .style("left", e.pageX + "px")
        .style("top", e.pageY + "px");
    });

  //
  //   Legend
  let legend = g
    .append("g")
    .attr("transform", `translate(${chart_width},${chart_height})`);
  //shifts the (0,0) of that group to the bottom right edge

  subgroups.forEach((d, i) => {
    let legendRow = legend
      .append("g")
      .attr("transform", `translate(0,${i * 20 + 40})`);

    legendRow
      .append("rect")
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", color(d)); //instead of red i should pick one color for each category

    legendRow
      .append("text")
      .attr("x", -10)
      .attr("y", 10)
      .attr("text-anchor", "end")
      .style("text-transform", "capitalize")
      .text(d); //instead of category we should have the name of each category
  });
});

/*          NOTES         */

//our svg dimensions are the same as the background and are equal to the chart dimensions + padding
//all our elements are placed inside a group element
//this group element is shifted to the right and bottom using the translate
//this means that the (0,0) of the g element is shifted compared to svg's (0,0) by margin.left and margin.top
//this means that our scales can start from zero since the top and left padding are already calculated
// margin left and margin bottom leave enough space for the axis and the labels
