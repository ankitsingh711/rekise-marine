//@ts-nocheck

import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Draw } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import MissionModal from "../Modal/MissionModal";

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [drawType, setDrawType] = useState<"LineString" | "Polygon" | null>(
    null
  );
  const [features, setFeatures] = useState<any[]>([]);

  useEffect(() => {
    const initialMap = new Map({
      target: mapRef.current!,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    setMap(initialMap);

    return () => {
      initialMap.setTarget(null);
    };
  }, []);

  const startDrawing = (type: "LineString" | "Polygon") => {
    if (!map) return;

    const source = new VectorSource();
    const vectorLayer = new VectorLayer({ source });
    map.addLayer(vectorLayer);

    const draw = new Draw({
      source,
      type,
    });

    draw.on("drawend", (event) => {
      const feature = event.feature;
      const coordinates = feature.getGeometry()?.getCoordinates();
      setFeatures((prev) => [...prev, { type, coordinates }]);
      console.log("Feature drawn:", coordinates);
    });

    map.addInteraction(draw);
  };

  return (
    <div>
      <button onClick={() => startDrawing("LineString")}>
        Draw LineString
      </button>
      <button onClick={() => startDrawing("Polygon")}>Draw Polygon</button>
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
      <MissionModal features={features} />
    </div>
  );
};

export default MapView;
