# リンク

- [geojsonの編集とtopojsonへの変換](https://mapshaper.org/)
- [各県のgeojsonを配布](https://github.com/niiyz/JapanCityGeoJson)

# 地図の中心やスケールの指定

```js
const projection = d3.geoMercator()
  .translate([width/2,height/2])
  .center([140.190179, 36.046454])
  .scale(1600);

const path = d3.geoPath(projection);
```