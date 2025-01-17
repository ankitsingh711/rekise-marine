import React from "react";

interface MissionModalProps {
  features: any[];
}

const MissionModal: React.FC<MissionModalProps> = ({ features }) => {
  return (
    <div>
      <h2>Mission Details</h2>
      {features.map((feature, index) => (
        <div key={index}>
          <h3>{feature.type}</h3>
          <p>Coordinates: {JSON.stringify(feature.coordinates)}</p>
        </div>
      ))}
    </div>
  );
};

export default MissionModal;
