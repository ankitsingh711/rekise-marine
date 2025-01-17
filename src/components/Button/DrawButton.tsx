import React from "react";

interface DrawButtonProps {
  onClick: () => void;
  label: string;
}

const DrawButton: React.FC<DrawButtonProps> = ({ onClick, label }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default DrawButton;
