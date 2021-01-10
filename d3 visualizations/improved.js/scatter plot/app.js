let margin = { left: 100, right: 100, top: 10, bottom: 150 };
let chart_width = 1100 - margin.left - margin.right;
let chart_height = 700 - margin.top - margin.bottom;
let pad = 0.05; /*the space between the bars */
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

// Data Load
d3.json("data/buildings.json").then((data) => {
  data.forEach((d) => {
    d.height = Number(d.height);
  });

  // THE REST OF THE CODE IS EXECUTED ONLY AFTER THE DATA ARE LOADED
  console.log(data);

  //
  //
  /*   Scales   */
  //scale converts our input to range to an appropriate range in order for the diagram to fit in the defined space
  let x_scale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.width)])
    .range([0, chart_width]);

  let y_scale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.height)])
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
    .text("Width (m)");

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
    .text("Height (m)");

  //we are placing the circles after the axis, so the grid lines can be underneath them
  //EVERY CIRCLE AND LABEL PAIR ARE PLACED INSIDE A GROUP (.rects)
  //
  //
  /*   Binding Data   */
  //we are creating the bars and binding them to our data
  //x,y positions are on the top left side of the bar x goes from left to right and y from top to bottom
  //
  //Circle creation, one circle per row
  groups = g
    .selectAll(".circles")
    .data(data)
    .enter()
    .append("g")
    .attr("class", ".circles");
  groups //appends a rect in each group
    .append("circle")
    .attr("cx", function (d) {
      return x_scale(d.width); // scaling
    })
    .attr("cy", function (d) {
      return y_scale(d.height); //scaling
    })
    .attr("r", 15)
    .attr("fill", "gold")
    //what happens when we click the bars
    .on("click", function (e, d) {
      //e is the event, d the data
      console.log(d.height);
    });

  //
  //
  /*   Text Inside The Bars   */

  groups //each group gets a text
    .append("text") // each text inside the groups is also binded to the data
    .text(function (d) {
      return d.width + "," + d.height; //
    })
    .attr("x", function (d, i) {
      //text will be centered inside the bar
      return x_scale(d.width);
    })
    .attr("y", function (d) {
      return y_scale(d.height); //text will be bellow the top of the bar
      //15 is found via trial and error
    })
    //text styling
    .attr("font-size", 14)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold");
});

/*          NOTES         */

//our svg dimensions are the same as the background and are equal to the chart dimensions + padding
//all our elements are placed inside a group element
//this group element is shifted to the right and bottom using the translate
//this means that the (0,0) of the g element is shifted compared to svg's (0,0) by margin.left and margin.top
//this means that our scales can start from zero since the top and left padding are already calculated
// margin left and margin bottom leave enough space for the axis and the labels
