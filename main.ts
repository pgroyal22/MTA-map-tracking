import { Map, View } from "ol";
import { defaults as defaultControls } from "ol/control";
import GeoJSON from "ol/format/GeoJSON";
import { defaults as defaultInteractions } from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { XYZ } from "ol/source";
import VectorSource from "ol/source/Vector";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Circle from "ol/style/Circle";

import subwayGeoJson from "./geojson/lines.json";
import stopsGeoJson from "./geojson/stops.json";
import "./style.css";
import Fill from "ol/style/Fill";

const stopsLayer = new VectorLayer({
  source: new VectorSource({
    features: new GeoJSON().readFeatures(stopsGeoJson, {
      featureProjection: "EPSG:3857",
    }),
  }),
  style: new Style({
    image: new Circle({
      radius: 1,
      fill: new Fill({
        color: "black",
      }),
      stroke: new Stroke({
        color: "black",
        width: 1,
      }),
    }),
  }),
  opacity: 0.5,
});

const vectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(subwayGeoJson, {
    featureProjection: "EPSG:3857", // need to reproject features to the projection used by the rest fo the app
  }),
});

// map of route symbols to line colors
const routeColors = {
  // IND Crosstown
  // Here first because it's my favorite
  G: " #6cbe45",

  // IND Eight Avenue
  A: " #0039a6",

  // IND Sixth Avenue Lines
  B: " #ff6319",

  // BMT Canarsie
  L: " #a7a9ac",

  // BMT Nassau Street
  J: " #996633",

  // BMT Broadway
  N: " #fccc0a",

  // IRT Broadway-7th Avenue
  1: " #ee352e",

  // IRT Lexington Avenue
  4: " #00933c",

  // IRT Flushing
  7: " #b933ad",

  // Shuttles
  S: " #808183",

  // counting some chickens before they hatch
  // IND Second Avenue
  T: " #00add0",
};

// partition the features by their name property
const featuresGroupedByName = vectorSource.getFeatures().reduce((acc, item) => {
  const key = item.getProperties().name;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(item);
  return acc;
}, {});

const vectorLayers = new Array<VectorLayer>();
for (const [key, value] of Object.entries(featuresGroupedByName)) {
  vectorLayers.push(
    new VectorLayer({
      source: new VectorSource({
        features: value as any,
      }),
      style: (feature) =>
        new Style({
          stroke: new Stroke({
            color: routeColors[feature.getProperties().rt_symbol],
            width: 1.75,
          }),
        }),
    })
  );
}

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

const map = new Map({
  target: "map",
  layers: [baseLayer, labelLayer, ...vectorLayers, stopsLayer],
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
