import * as d3 from "d3";
import * as topojson from "topojson-client";


const svg = d3.select("svg");
const width = +svg.attr("width"),
      height = + svg.attr("height");

const infection = d3.map();
const projection = d3.geoMercator()
  .translate([width/2,height/2])
  .center([139.736394,35.685744])
  .scale(70000);

const path = d3.geoPath(projection);

const x = d3.scaleLinear()
  .domain([0,300]) // 10段階？
  .rangeRound([600,860]);

// ６段階の不透明度で表現しても良いかも
const color = d3.scaleThreshold()
  .domain(d3.range(50,300,50))
  .range(d3.schemeBlues[6]);


let g = svg.append("g")
  .attr("class","key")
  .attr("transform","translate(0,40)");

g.selectAll("rect")
  .data(color.range().map(d => {
    d = color.invertExtent(d);
    if(d[0]==null) d[0] = x.domain()[0];
    if(d[1]==null) d[1] = x.domain()[1];
    return d;
  }))
  .enter()
  .append("rect")
  .attr("x",d => x(d[0]))
  .attr("width", d => x(d[1]) - x(d[0]))
  .attr("height",8)
  .attr("fill",d => color(d[0]));

  g.call(
    d3.axisBottom(x)
    .tickSize(13)
    .tickFormat((x,i) => i ? x : x + "%")
    .tickValues(color.domain())
  )
  .select(".domain")
  .remove();

g.append("text")
  .attr("class","caption")
  .attr("x",x.range()[0])
  .attr("y",-6)
  .attr("fill","#000")
  .attr("text-anchor","start")
  .attr("font-weight","bold")
  .text("感染者数");

let prmsz = [
  d3.json("./data/tokyo.json"),
  d3.csv("data/tokyo.csv", d => {
    infection.set(d.city,+d.num);
  })
]

Promise.all(prmsz).then(data => {
  ready(data[0]);
}).catch(err => {
  console.log(err);
})

function ready(us){

  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.tokyo).features)
    .enter().append("path")
    .attr("fill",d => {
      return getColor(d.properties.city_ja);
    })
    .attr("d",path)


  svg.append("path")
    .data([topojson.mesh(us,us.objects.tokyo,(a,b) => {
      return a !== b;
    })])
    .attr("class","city")
    .attr("d",path)
}

function getColor(city){

  let num = infection.get(city);
  return num ? color(num) : "none";
}
