import * as d3 from "d3";
import * as topojson from "topojson-client";

const svg = d3.select("svg");
const width = +svg.attr("width"),
      height = + svg.attr("height");

const unemplyment = d3.map();
const path = d3.geoPath();

d3.json("./data/us-map.json").then(us => {
  ready(us);
})

function ready(us){

  svg.append("g")
    .attr("class","countries")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
    .attr("fill","red")
    .attr("d",path)

  svg.append("path")
    .data([topojson.mesh(us,us.objects.states,(a,b) => {
      return a !== b;
    })])
    .attr("class","states")
    .attr("d",path)
}