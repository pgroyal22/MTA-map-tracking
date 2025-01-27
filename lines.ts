import GeoJSON from "ol/format/GeoJSON";
import VectorSource from "ol/source/Vector";

import subwayGeoJson from "./geojson/lines.json";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";

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

export class SubwayLineLayers {
  private subwayLineLayers: Array<VectorLayer>;
  public getLayers() {
    return this.subwayLineLayers;
  }

  constructor(geoJsonFormatter: GeoJSON) {
    const vectorSource = new VectorSource({
      features: geoJsonFormatter.readFeatures(subwayGeoJson, {
        featureProjection: "EPSG:3857",
      }),
    });

    // partition the features by their name property
    const featuresGroupedByName = vectorSource
      .getFeatures()
      .reduce((acc, item) => {
        const key = item.getProperties().name;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(item);
        return acc;
      }, {});

    // creating a new vector layer for each line helps with overlapping line geometry
    this.subwayLineLayers = new Array<VectorLayer>();
    for (const [key, value] of Object.entries(featuresGroupedByName)) {
      this.subwayLineLayers.push(
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
  }
}
