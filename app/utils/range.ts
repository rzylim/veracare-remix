export const range = (start: number, stop: number, step = 1) => {
  const length = Math.ceil((stop - start) / step);
  return Array.from({ length }, (_, i) => i * step + start);
};
