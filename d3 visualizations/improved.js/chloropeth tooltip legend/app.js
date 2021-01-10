let margin = { top: 80, bottom: 50, left: 50, right: 50 };
let width = 960 - margin.left - margin.right;
let height = 600 - margin.top - margin.bottom;
var xScale = d3.scaleLinear().domain([1, 10]).rangeRound([600, 860]);
var colorScale = d3
  .scaleLinear()
  .domain([13000, 33000])
  .range(["white", "green"]);
var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
//caption
svg
  .append("text")
  .attr("class", "caption")
  .attr("x", xScale.range()[0] + 80)
  .attr("y", -20)
  .attr("fill", "#000")
  .attr("font-size", "20px")
  .attr("text-anchor", "start")
  .attr("font-weight", "bold")
  .text("Median Earning By State");
//legends
var legend = svg
  .selectAll(".legend")
  .data(colorScale.ticks(9).slice(1))
  .enter()
  .append("g")
  .attr("class", "legend")
  .attr("transform", function (d, i) {
    return "translate(" + (width - 50) + ", " + (30 + i * 30) + ")";
  });
legend
  .append("rect")
  .attr("width", 40)
  .attr("height", 30)
  .style("fill", colorScale);

legend.append("text").attr("x", 46).attr("y", 18).attr("dy", ".35em").text("$");
legend
  .append("text")
  .attr("x", 55)
  .attr("y", 18)
  .attr("dy", ".35em")
  .text(String);
//projection
var projection = d3
  .geoAlbersUsa()
  .translate([width / 2, height / 2])
  .scale([1000]);
//path
var path = d3.geoPath(projection);
var div = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
//
//
//
//
//load data
d3.json("data/us.json").then(function (us) {
  d3.json("data/median_earnings.json").then(function (earning) {
    d3.csv("data/sat_scores.csv").then(function (sat) {
      //console.log("ok")
      svg
        .append("g")
        .attr("class", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        //.style("fill", "green")
        .attr("fill", function (d) {
          var i = 0;
          while (i < earning.length) {
            if (earning[i].id == d.id) break;
            i++;
          }
          return colorScale(earning[i].median_earnings);
          /*
          let num = d.properties.num;
          //depending if num exists which means if we had data for that country/state or not
          return num ? color(num) : "pink"; //pink will represent states/countries with no data
          */
        }) //TOOLTIP
        .on("mouseover", function (d) {
          d3.selectAll(".tooltip").remove();
          div = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
          var info = [];
          sat.forEach(function (s) {
            if (s.id == d.id) {
              info.push([s.name, s.sat_avg]);
            }
          });
          info.sort(function (a, b) {
            return b[1] - a[1];
          });
          var cnt = 5;
          if (info.length < 5) cnt = info.length;

          div.transition().duration(0).style("opacity", 1);
          for (var i = 0; i < cnt; i++) {
            div
              .append("text")
              .text(info[i][0] + "(SAT:" + info[i][1] + ")")
              .attr("x", 20)
              .attr("dy", ".35em")
              .attr("y", function (d, i) {
                return i * 20;
              });
            if (i != cnt - 1) {
              //div.append("text").html("<br> line");
              div.append("text").html("<br>");
            }
          }
          div
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 30 + "px");
        })
        .on("mouseout", function (d) {
          div.transition().duration(0).style("opacity", 0);
        });
    });
  });
});
