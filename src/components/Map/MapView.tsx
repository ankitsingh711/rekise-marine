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
import PolygonModal from "../Modal/PolygonModal";
import { calculateDistance } from "../../utils/distanceCalculator";

const MapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [drawType, setDrawType] = useState<"LineString" | "Polygon" | null>(
    null
  );
  const [features, setFeatures] = useState<any[]>([]);
  const [polygonToImport, setPolygonToImport] = useState<any>(null);
  const [modalType, setModalType] = useState<"Mission" | "Polygon" | null>(
    null
  );
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

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
      const distance =
        type === "LineString" ? calculateDistance(coordinates) : 0;

      if (type === "LineString") {
        setFeatures((prev) => [...prev, { type, coordinates, distance }]);
        setModalType("Mission");
      } else if (type === "Polygon") {
        setPolygonToImport({ type, coordinates, distance });
        setModalType("Polygon");
      }

      setDrawType(null);
    });

    map.addInteraction(draw);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        map.removeInteraction(draw);
        window.removeEventListener("keydown", handleKeyDown);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
  };

  const handleInsertPolygon = (index: number) => {
    setInsertIndex(index);
    setDrawType("Polygon");
    startDrawing("Polygon");
  };

  const importPolygonToMission = () => {
    if (!polygonToImport || insertIndex === null) return;

    setFeatures((prev) => {
      const updatedFeatures = [...prev];
      const lineString = updatedFeatures[insertIndex];
      const polygonCoords = polygonToImport.coordinates[0];
      const lineStringCoords = lineString.coordinates;

      if (insertIndex === 0) {
        lineString.coordinates = [...polygonCoords, ...lineStringCoords];
      } else if (insertIndex === updatedFeatures.length - 1) {
        lineString.coordinates = [...lineStringCoords, ...polygonCoords];
      } else {
        const firstSegment = lineStringCoords.slice(0, insertIndex + 1);
        const secondSegment = lineStringCoords.slice(insertIndex + 1);
        lineString.coordinates = [
          ...firstSegment,
          ...polygonCoords,
          ...secondSegment,
        ];
      }

      updatedFeatures[insertIndex] = {
        ...lineString,
        distance: calculateDistance(lineString.coordinates),
      };

      return updatedFeatures;
    });

    setPolygonToImport(null);
    setModalType("Mission");
  };

  return (
    <div>
      <button onClick={() => startDrawing("LineString")}>
        Draw LineString
      </button>
      <button onClick={() => startDrawing("Polygon")}>Draw Polygon</button>
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
      {modalType === "Mission" && (
        <MissionModal
          features={features}
          onInsertPolygon={handleInsertPolygon}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === "Polygon" && (
        <PolygonModal
          polygon={polygonToImport}
          onImport={importPolygonToMission}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
};

export default MapView;
