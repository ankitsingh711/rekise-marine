export const calculateDistance = (coordinates: number[][]): number => {
  // Dummy distance calculation
  return coordinates.reduce((acc, coord, index, arr) => {
    if (index === 0) return acc;
    const [x1, y1] = arr[index - 1];
    const [x2, y2] = coord;
    return acc + Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }, 0);
};
