import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

import stopsGeoJson from "./geojson/stops.json";

export class StopsLayer {
  private stopsLayer: VectorLayer<VectorSource<any>, any>;
  public getLayer() {
    return this.stopsLayer;
  }

  constructor(geoJsonFormatter: GeoJSON) {
    this.stopsLayer = new VectorLayer({
      source: new VectorSource({
        features: geoJsonFormatter.readFeatures(stopsGeoJson, {
          featureProjection: "EPSG:3857",
        }),
      }),
      style: new Style({
        image: new Circle({
          radius: 2,
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
  }
}
