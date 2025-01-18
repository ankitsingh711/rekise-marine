import React, { useState } from "react";

interface MissionModalProps {
  features: any[];
  onInsertPolygon: (index: number, position: "before" | "after") => void;
  onClose: () => void;
}

const MissionModal: React.FC<MissionModalProps> = ({
  features,
  onInsertPolygon,
  onClose,
}) => {
  const [dropdownIndex, setDropdownIndex] = useState<number | null>(null);

  const toggleDropdown = (index: number) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  return (
    <div className="modal">
      <button className="modal-close" onClick={onClose}>
        ×
      </button>
      <h2>LineString Details</h2>
      <table>
        <thead>
          <tr>
            <th>WP</th>
            <th>Coordinates</th>
            <th>Distance (meters)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={index}>
              <td>{`WP${index + 1}`}</td>
              <td>{JSON.stringify(feature.coordinates)}</td>
              <td>{feature.distance.toFixed(2)}</td>
              <td style={{ position: "relative" }}>
                <button onClick={() => toggleDropdown(index)}>⋮</button>
                {dropdownIndex === index && (
                  <div className="dropdown">
                    <button
                      onClick={() => {
                        onInsertPolygon(index, "before");
                        setDropdownIndex(null);
                      }}
                    >
                      Insert Polygon Before
                    </button>
                    <button
                      onClick={() => {
                        onInsertPolygon(index, "after");
                        setDropdownIndex(null);
                      }}
                    >
                      Insert Polygon After
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MissionModal;
