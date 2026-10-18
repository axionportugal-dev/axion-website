/*
 * Soft colour glows as plain radial gradients.
 *
 * These replace rounded divs blurred with `filter: blur(130px)` and the
 * like: a filter that large is expensive to rasterise and has to run again
 * whenever its layer repaints. Each gradient reproduces the exact profile of
 * the original blurred disc (a disc of radius R convolved with a Gaussian of
 * standard deviation σ, sampled out to R + 3σ), so the element has to be
 * 2·(R + 3σ) wide, centred where the old disc was.
 */

const stops = (color: string, alphas: number[]) => {
  const positions = [0, 15, 30, 42, 52, 62, 72, 82, 91, 100];

  return `radial-gradient(circle closest-side, ${positions
    .map(
      (position, index) =>
        `oklch(${color} / ${alphas[index] ?? 0}) ${position}%`,
    )
    .join(', ')})`;
};

// 34rem disc, sky-300 at 10%, blur 130px  ->  1324px box.
export const heroGlow = stops('82.8% 0.111 230.318', [
  0.0888, 0.0816, 0.0606, 0.0385, 0.0219, 0.0103, 0.0039, 0.0012, 0.0003,
]);

// 28rem disc, sky-400 at 3.5%, blur 130px  ->  1228px box.
export const budgetCallGlow = stops('74.6% 0.16 232.661', [
  0.0271, 0.0242, 0.0169, 0.0102, 0.0057, 0.0027, 0.001, 0.0003, 0.0001,
]);

// 34rem disc, sky-500 at 10%, blur 140px  ->  1384px box.
export const notFoundGlow = stops('68.5% 0.169 237.323', [
  0.0849, 0.0771, 0.0558, 0.0347, 0.0195, 0.0092, 0.0035, 0.0011, 0.0003,
]);

// 46rem disc, sky-500 at 15%, blur 150px  ->  1636px box.
export const budgetTopGlow = stops('68.5% 0.169 237.323', [
  0.1426, 0.1346, 0.1067, 0.0717, 0.0423, 0.0202, 0.0076, 0.0023, 0.0006,
]);

// 20rem disc, blue-600 at 10%, blur 120px  ->  1040px box.
export const budgetCornerGlow = stops('54.6% 0.245 262.881', [
  0.0589, 0.0516, 0.0344, 0.0201, 0.011, 0.0052, 0.0021, 0.0007, 0.0002,
]);
