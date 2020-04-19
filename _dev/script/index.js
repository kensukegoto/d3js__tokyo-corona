import * as d3 from "d3";
import * as topojson from "topojson-client";

const svg = d3.select("svg");
const width = +svg.attr("width"),
      height = + svg.attr("height");

const unemplyment = d3.map();
const projection = d3.geoMercator()
  .translate([width/2,height/2])
  .center([139.736394,35.685744])
  .scale(70000);

const path = d3.geoPath(projection);

const x = d3.scaleLinear()
  .domain([0,200]) // 10段階？
  .rangeRound([600,860]);

const color = d3.scaleThreshold()
  .domain([50,100,150,200])
  .range(d3.schemeBlues[5]);

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
  d3.tsv("data/map.tsv", d => {
    unemplyment.set(d.id,+d.rate);
  })
]



Promise.all(prmsz).then(data => {
  ready(data[0]);
}).catch(err => {
  console.log(err);
})


function ready(us){

  svg.append("g")
    .attr("class","countries")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.tokyo).features)
    .enter().append("path")
    .attr("fill",d => {
 
      return (d.properties.city_ja === "渋谷区") ? "#ff0000":"none";
      
      //  d.rateをここで設定して後で使いたい
      // return color(d.rate = unemplyment.get(d.id))
    })
    .attr("d",path)


  // svg.append("path")
  //   .data([topojson.mesh(us,us.objects.states,(a,b) => {
  //     return a !== b;
  //   })])
  //   .attr("class","states")
  //   .attr("d",path)
}