import { Map, View } from "ol";
import GeoJSON from "ol/format/GeoJSON";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

import { XYZ } from "ol/source";
import subwayGeoJson from "./geoJSON/Subway Lines.json";
import "./style.css";

const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(subwayGeoJson, {
    featureProjection: "EPSG:3857", // need to reproject features to the project used by the rest fo the app
  }),
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

var baseLayer = new TileLayer<XYZ>({
  extent: [-8453323, 4774561, -7983695, 5165920],
  source: new XYZ({
    url: "https://maps{1-4}.nyc.gov/xyz/1.0.0/carto/basemap/{z}/{x}/{y}.jpg",
  }),
  minZoom: 10,
  maxZoom: 19,
});

var labelLayer = new TileLayer<XYZ>({
  extent: [-8268000, 4870900, -8005000, 5055500],
  source: new XYZ({
    url: "https://maps{1-4}.nyc.gov/xyz/1.0.0/carto/label/{z}/{x}/{y}.png8",
  }),
});

const map = new Map({
  target: "map",
  layers: [baseLayer, labelLayer, vectorLayer],
  view: new View({
    center: [-8235252, 4969073],
    rotation: (-29 * Math.PI) / 180, // Manhattan deviates from true north 29 degrees, align map to grid
    zoom: 11,
    maxZoom: 19,
    minZoom: 11,
    extent: [-8453323, 4774561, -7983695, 5165920],
  }),
});
