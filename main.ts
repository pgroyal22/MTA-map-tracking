import { Feature, Map, View } from "ol";
import GeoJSON from "ol/format/GeoJSON.js";
import OSM from "ol/source/OSM";
import Style, { StyleLike } from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

import subwayGeoJson from "./geoJSON/Subway Lines.json";
import "./style.css";

const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(subwayGeoJson),
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
  style: new Style({
    stroke: new Stroke({
      width: 2,
      color: "green",
    }),
  }),
});

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer,
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});
