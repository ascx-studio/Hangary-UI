struct Params {
  time: vec4f,
};

@group(0) @binding(0) var<uniform> params: Params;

fn led_hash(cell: vec2f) -> f32 {
  return fract(sin(dot(cell, vec2f(127.1, 311.7))) * 43758.5453);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let grid = uv * vec2f(64.0, 16.0);
  let cell = floor(grid);
  let local = fract(grid) - vec2f(0.5);
  let radius = length(local);
  let led = 1.0 - smoothstep(0.24, 0.31, radius);
  let scan_x = fract(params.time.x * 0.08) * 72.0 - 4.0;
  let scan_distance = abs(cell.x - scan_x);
  let scan = exp(-scan_distance * scan_distance / 18.0);
  let pointer_cell = vec2f(params.time.y * 64.0, params.time.z * 16.0);
  let pointer_distance = distance(cell + vec2f(0.5), pointer_cell);
  let hover_glow = exp(-pointer_distance * pointer_distance / 20.0) * params.time.w;
  let variation = 0.82 + led_hash(cell) * 0.18;
  let energy = led * (0.85 + scan * 0.45 + hover_glow * 0.7) * variation;

  return vec4f(vec3f(energy), 1.0);
}
