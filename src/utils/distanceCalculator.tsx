export const calculateDistance = (coordinates: number[][]): number => {
  if (coordinates.length < 2) return 0;

  let distance = 0;
  for (let i = 1; i < coordinates.length; i++) {
    const [x1, y1] = coordinates[i - 1];
    const [x2, y2] = coordinates[i];
    const segmentDistance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    distance += segmentDistance;
  }

  return distance;
};
