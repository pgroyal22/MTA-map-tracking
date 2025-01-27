import { Map, View } from "ol";
import { defaults as defaultControls } from "ol/control";
import { defaults as defaultInteractions } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import { XYZ } from "ol/source";

import "./style.css";

import { SubwayLineLayers } from "./lines";
import { StopsLayer } from "./stops";
import GeoJSON from "ol/format/GeoJSON";

const baseLayer = new TileLayer<XYZ>({
  extent: [-8453323, 4774561, -7983695, 5165920],
  source: new XYZ({
    url: "https://maps{1-4}.nyc.gov/xyz/1.0.0/carto/basemap/{z}/{x}/{y}.jpg",
  }),
  minZoom: 10,
  maxZoom: 19,
});

const labelLayer = new TileLayer<XYZ>({
  extent: [-8268000, 4870900, -8005000, 5055500],
  source: new XYZ({
    url: "https://maps{1-4}.nyc.gov/xyz/1.0.0/carto/label/{z}/{x}/{y}.png8",
  }),
});

const controls = defaultControls({ rotate: false });
const interactions = defaultInteractions({
  altShiftDragRotate: false,
  pinchRotate: false,
});

const geoJsonFormatter = new GeoJSON();
const subwayLineLayers = new SubwayLineLayers(geoJsonFormatter);
const stopsLayer = new StopsLayer(geoJsonFormatter).getLayer();

const map = new Map({
  target: "map",
  layers: [baseLayer, labelLayer, ...subwayLineLayers.getLayers(), stopsLayer],
  controls: controls,
  interactions: interactions,
  view: new View({
    center: [-8235252, 4969073],
    rotation: (-29 * Math.PI) / 180, // Manhattan deviates from true north 29 degrees, align map to grid
    zoom: 11,
    maxZoom: 19,
    minZoom: 11,
    extent: [-8453323, 4774561, -7983695, 5165920],
  }),
});
