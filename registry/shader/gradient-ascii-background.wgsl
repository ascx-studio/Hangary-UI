struct Config {
  metrics: vec4f,
  pointer: vec4f,
  settings: vec4f,
};
@group(0) @binding(0) var<uniform> cfg: Config;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let cellSize = cfg.settings.x;
  let grid = uv * cfg.metrics.xy / cellSize;
  let cell = floor(grid);
  let point = (cell + 0.5) * cellSize / cfg.metrics.xy;
  let time = cfg.metrics.z;
  let field = sin(point.x * 4.0 + time * 0.9) * cos(point.y * 3.2 - time * 0.6)
    + sin((point.x + point.y) * 3.0 - time * 0.45) * 0.5;
  let delta = (cell + 0.5) * cellSize - cfg.pointer.xy * cfg.metrics.xy;
  let hover = exp(-dot(delta, delta) / 18000.0) * cfg.pointer.z;
  let brightness = clamp(0.42 + field * 0.24 + hover * 0.4, 0.0, 1.0);
  let character = u32(brightness * 9.0);
  let glyphs = array<u32, 10>(
    0u, 131072u, 131200u, 31744u, 1016800u,
    4357252u, 22511061u, 11512810u, 27070835u, 32175662u
  );
  let local = vec2i(floor(fract(grid) * 7.0)) - vec2i(1);
  var ink = 0.0;
  if (all(local >= vec2i(0)) && all(local < vec2i(5))) {
    ink = f32((glyphs[character] >> u32(local.y * 5 + local.x)) & 1u);
  }
  let gradient = 0.5 + 0.5 * cos(vec3f(0.0, 2.1, 4.2) + point.x * 3.0 + point.y * 2.0 + time * 0.12);
  let tint = mix(vec3f(0.95, 0.18, 0.72), vec3f(0.15, 0.85, 1.0), gradient);
  return vec4f(vec3f(0.012, 0.006, 0.035) + tint * ink * (0.25 + brightness * 0.9) * cfg.metrics.w, 1.0);
}
