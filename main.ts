import { Map, View } from "ol";
import GeoJSON from "ol/format/GeoJSON.js";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { useGeographic } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

import subwayGeoJson from "./geoJSON/Subway Lines.json";
import "./style.css";

useGeographic();

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
    center: [-73.97968, 40.703312],
    rotation: (-29 * Math.PI) / 180, // Manhattan deviates from true north 29 degrees, align map to grid
    zoom: 11,
  }),
});
