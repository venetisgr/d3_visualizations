let chart_width = 800;
let chart_height = 600;
let color = d3.scaleQuantize().range([
  "rgb(255,245,240)",
  "rgb(254,224,210)",
  "rgb(252,187,161)",
  "rgb(252,146,114)",
  "rgb(251,106,74)",
  "rgb(239,59,44)",
  "rgb(203,24,29)",
  "rgb(165,15,21)",
  "rgb(103,0,13)",
  //colors generated via colorbrewer2
]);

//svg background

let svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", chart_width)
  .attr("height", chart_height);

//basic map properties

let projection = d3
  .geoAlbersUsa() // how the map will look, we define the projection of the map
  //IF WE ARE USING THE ZOOM FUNCTION WE HAVE TO REMOVE THESE 2 BELLOW
  //.scale([chart_width * 1]) //how big the map will look -- the bigger the number the more zoomed in!!
  //.translate([chart_width / 2, chart_height / 2]); //centers the map
  .translate([0, 0]);

let path = d3.geoPath(projection);

//
//
//
/*  
// DRAG MAP FUNCTIONALITY   //

//DRAG EVENT LISTENER

let drag_map = d3.drag().on("drag", function (e) {
  //e is the event
  //what happens when we drag the map
  let offset = projection.translate(); //coords of the current map
  offset[0] = offset[0] + e.dx;
  offset[1] = offset[1] + e.dy;

  //update the coordinates
  projection.translate(offset);

  //update the map
  map
    .selectAll("path")
    .transition() // makes the move more slow but more nice
    .attr("d", path);

  //update the circles

  map
    .selectAll("circle")
    .transition() // makes the move more slow but more nice
    .attr("cx", function (d) {
      //based on the cords we can get the location in the map using projection
      return projection([d.lon, d.lat])[0];
    })
    .attr("cy", function (d) {
      //based on the cords we can get the location in the map using projection
      return projection([d.lon, d.lat])[1];
    });
});

//the listener will listen for a drag of the elements inside g
//in order for the listener to work all elements must be inside a group (g) element

//we select all our elements using one variable, all elements are inside the group element !!!!
//!!!!!!!!!!!!!!!!!!!!!!!! all elements are placed inside the g group!!!!!!!!!!!!!!!
let map = svg //map "points" to the g element, all the following appended values will be appended inside it
  .append("g") //group element
  .attr("id", "map")
  .call(drag_map);

//this way we can drag even if we aren't inside the map (but inside the chart-box)
map
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", chart_width)
  .attr("height", chart_height)
  .attr("opacity", 0);

//  !!!!!!!!!!!!!!!!!!!!!!!!!!  //

*/

// ZOOM MAP FUNCTIONALITY   // it can also be used for dragging

//ZOOM EVENT LISTENER

//scaleExtent defines how far the map can be zoomed in and out
//translateExtent how far we can drag the map
let zoom_map = d3
  .zoom()
  .scaleExtent([0.3, 3])
  .translateExtent([
    [-1000, -500],
    [1000, 500],
  ])
  .on("zoom", function (e) {
    //console.log(e);
    //e is the event
    //what happens when we drag the map
    let offset = [e.transform.x, e.transform.y]; //coords of the current map
    let scale = e.transform.k * 2000; //scale of the map (z axis)

    //offset is used for dragging and scale for zooming
    //update the coordinates
    projection.translate(offset).scale(scale);

    //update the map
    svg
      .selectAll("path")
      .transition() // makes the move more slow but more nice
      .attr("d", path);

    //update the circles

    svg
      .selectAll("circle")
      .transition() // makes the move more slow but more nice
      .attr("cx", function (d) {
        //based on the cords we can get the location in the map using projection
        return projection([d.lon, d.lat])[0];
      })
      .attr("cy", function (d) {
        //based on the cords we can get the location in the map using projection
        return projection([d.lon, d.lat])[1];
      });
  });

//the listener will listen for a drag or zoom of the elements inside g
//in order for the listener to work all elements must be inside a group (g) element

//we select all our elements using one variable, all elements are inside the group element !!!!
//!!!!!!!!!!!!!!!!!!!!!!!! all elements are placed inside the g group!!!!!!!!!!!!!!!
let map = svg //map "points" to the g element, all the following appended values will be appended inside it
  .append("g") //group element
  .attr("id", "map")
  .call(zoom_map)
  .call(
    zoom_map.transform,
    d3.zoomIdentity
      .translate(chart_width / 2, chart_height / 2) //initial map location, in the middle of the chart
      .scale(0.5)
  );

//this way we can drag even if we aren't inside the map (but inside the chart-box)
map
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", chart_width)
  .attr("height", chart_height)
  .attr("opacity", 0);

//  !!!!!!!!!!!!!!!!!!!!!!!!!!  //

//data load

d3.json("zombie-attacks.json").then(function (zombie_data) {
  //loads the zombie data first
  color.domain([
    d3.min(zombie_data, function (d) {
      return d.num;
    }),
    d3.max(zombie_data, function (d) {
      return d.num;
    }),
  ]);

  //loads the map then
  d3.json("us.json").then(function (us_data) {
    us_data.features.forEach(function (us_d, us_i) {
      zombie_data.forEach(function (z_d, z_i) {
        if (us_d.properties.name !== z_d.state) {
          return null;
          // if the state/country mentioned in the zombie data doesnt exist in the map it will be skiped
        }
        us_data.features[us_i].properties.num = parseFloat(z_d.num);
        //we assign the information of the zombie dataset in the appropriate variable of the map
      });
    });

    console.log(us_data);

    //how the map will look
    map
      .selectAll("path")
      .data(us_data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        let num = d.properties.num;
        //depending if num exists which means if we had data for that country/state or not
        return num ? color(num) : "pink"; //pink will represent states/countries with no data
      }) // color of the particular state/country (map) will be based on the data
      .attr("stroke", "#fff") // color of the lines that seperate the areas
      .attr("stroke-width", 1); //how thick is the line that seperates the areas

    //WE CAN ALSO LOAD DATA THAT SHOW US THE POPULATION OF EACH CITY AND REPRESENT THEM WITH A CIRCLE
    d3.json("us-cities.json").then(function (city_data) {
      map
        .selectAll("circle")
        .data(city_data)
        .enter()
        .append("circle")
        .style("fill", "#9D497A")
        .style("opacity", 0.8)
        .attr("cx", function (d) {
          //based on the cords we can get the location in the map using projection
          return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function (d) {
          //based on the cords we can get the location in the map using projection
          return projection([d.lon, d.lat])[1];
        })
        .attr("r", function (d) {
          return Math.sqrt(parseInt(d.population) * 0.00005);
        })
        .append("title") // if we hover over the city a tab will pop up
        .text(function (d) {
          return d.city + " " + d.population + " people";
        });
    });
  });
});

// BUTTON FUNCTIONALITY

/*directions*/

//inside the buttons div and selects the elements with the button type and the pan class
d3.selectAll("#buttons button.pan").on("click", function () {
  //let offset = projection.translate(); //coords of the current map
  let distance = 100; // it will move the map 100 px to the direction the user chose
  let direction = d3.select(this).attr("class").replace("pan ", ""); //which direction was chosen
  //we remove the keyword pan in order to access the second name (class) which indicates the direction
  //this keyword will be set to the element that was clicked
  let x = 0;
  let y = 0;

  if (direction == "up") {
    y = y + distance;
  } else if (direction == "down") {
    y = y - distance;
  } else if (direction == "left") {
    x = x + distance;
  } else if (direction == "right") {
    x = x - distance;
  }

  //update the map
  map.transition().call(zoom_map.translateBy, x, y); //moves the map by x and y pixels to the corresponding direction

  /*projection.translate(offset);

  //update the map
  map
    .selectAll("path")
    .transition() // makes the move more slow but more nice
    .attr("d", path);

  //update the circles

  map
    .selectAll("circle")
    .transition() // makes the move more slow but more nice
    .attr("cx", function (d) {
      //based on the cords we can get the location in the map using projection
      return projection([d.lon, d.lat])[0];
    })
    .attr("cy", function (d) {
      //based on the cords we can get the location in the map using projection
      return projection([d.lon, d.lat])[1];

      
    }); */
});

//zoom buttons

//inside the buttons div and selects the elements with the button type and the pan class
d3.selectAll("#buttons button.zoom").on("click", function () {
  let distance = 100; // it will move the map 100 px to the direction the user chose
  let direction = d3.select(this).attr("class").replace("zoom ", ""); //which direction was chosen
  //we remove the keyword zoom in order to access the second name (class) which indicates the direction
  //this keyword will be set to the element that was clicked

  let scale = 1;

  if (direction == "inside") {
    scale = 1.25;
  } else if (direction == "outside") {
    scale = 0.75;
  }

  map.transition().call(zoom_map.scaleBy, scale); //updates the new scale
});
