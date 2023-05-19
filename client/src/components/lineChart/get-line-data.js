export function getLineData(id, color, data) {
  return {
    id,
    color,
    data: Object.entries(data).map(([key, value]) => ({
      x: key,
      y: value,
    })),
  };
}
