struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

struct Params {
  time: vec4f,  // x: seconds, y: pointer x (0..1), z: pointer y (0..1), w: hover strength
};

@group(0) @binding(0) var<uniform> params: Params;

// The wordmark surface is 1337x336 (about 4:1), so 64x16 cells are already square. No size uniform needed.

const COLS = 64.0;
const ROWS = 16.0;
const IDLE = 0.16;  // brightness of LEDs outside the beam and the hover glow

fn led_hash(cell: vec2f) -> f32 {
  return fract(sin(dot(cell, vec2f(127.1, 311.7))) * 43758.5453);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let grid = uv * vec2f(COLS, ROWS);
  let cell = floor(grid);
  let local = fract(grid) - vec2f(0.5);
  let radius = length(local);

  let aa = max(fwidth(radius) * 0.75, 0.035);
  let led = 1.0 - smoothstep(0.275 - aa, 0.275 + aa, radius);

  // The beam travels 10 cells past each edge so it has fully faded before it wraps.
  let span = COLS + 20.0;
  let scan_x = fract(params.time.x * 6.0 / span) * span - 10.0;
  let scan_distance = abs(cell.x - scan_x);
  let scan = exp(-scan_distance * scan_distance / 18.0);

  let pointer_cell = vec2f(params.time.y * COLS, params.time.z * ROWS);
  let pointer_distance = distance(cell + vec2f(0.5), pointer_cell);
  let hover_glow = exp(-pointer_distance * pointer_distance / 20.0) * params.time.w;

  let variation = 0.82 + led_hash(cell) * 0.18;
  let energy = led * (IDLE + scan * 0.9 + hover_glow * 1.0) * variation;

  if (theme.mode.x > 0.5) {
    let coverage = led * (0.5 + scan * 0.65 + hover_glow * 0.8) * variation;
    return vec4f(vec3f(1.0 - min(coverage, 1.0)), 1.0);
  }
  return vec4f(vec3f(min(energy, 1.0)), 1.0);
}
