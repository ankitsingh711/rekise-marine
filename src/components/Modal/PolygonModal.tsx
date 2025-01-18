import React from "react";

interface PolygonModalProps {
  polygon: { type: string; coordinates: any; distance: number } | null;
  onImport: () => void;
  onClose: () => void;
}

const PolygonModal: React.FC<PolygonModalProps> = ({ polygon, onImport, onClose }) => {
  if (!polygon) {
    return <div>No Polygon to display.</div>;
  }

  return (
    <div className="modal">
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
      <h3>Polygon Details</h3>
      <p>Type: {polygon.type}</p>
      <p>Coordinates: {JSON.stringify(polygon.coordinates)}</p>
      <p>Distance: {polygon.distance.toFixed(2)} meters</p>
      <button onClick={onImport}>Import Points</button>
    </div>
  );
};

export default PolygonModal;
