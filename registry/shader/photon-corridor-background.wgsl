struct Config { metrics: vec4f, pointer: vec4f, settings: vec4f };
@group(0) @binding(0) var<uniform> cfg: Config;
fn hash(p: vec2f) -> f32 { return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453); }

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = cfg.metrics.x / max(cfg.metrics.y, 1.0);
  var p = (uv - 0.5) * vec2f(aspect, 1.0) * 2.0;
  p -= (cfg.pointer.xy - 0.5) * cfg.pointer.z * 0.12;
  let horizontal = abs(p.x) > abs(p.y) * 0.8;
  let wallDistance = max(select(abs(p.y) * 0.8, abs(p.x), horizontal), 0.025);
  let depth = 1.0 / wallDistance;
  let across = select(p.x / max(abs(p.y), 0.025), p.y / max(abs(p.x), 0.025), horizontal);
  let travel = depth * 7.0 - cfg.metrics.z * 7.0;
  let grid = vec2f(travel, across * 16.0);
  let local = fract(grid) - 0.5;
  // Every row shares the same depth phase: dots align instead of randomly breaking.
  // Filter in grid space so distant dots soften rather than shimmer or form jagged lines.
  let footprint = fwidth(grid);
  let width = sqrt(vec2f(0.0225) + footprint * footprint * 0.16);
  let distance = local / width;
  let coverage = 0.0225 / (width.x * width.y);
  let dots = exp(-dot(distance, distance) * 1.8) * coverage;
  // Match Light Ray's tight bloom plus a wider, softer halo.
  let glowDistance = length(distance);
  let bloom = (exp(-glowDistance / 0.8) * 0.7 + exp(-glowDistance / 3.6) * 0.18) * coverage;
  // Like Light Ray, each line has its own phase, speed, and randomly enabled pulse.
  let row = floor(grid.y);
  let wall = select(select(2.0, 3.0, p.y > 0.0), select(0.0, 1.0, p.x > 0.0), horizontal);
  let id = vec2f(row, wall);
  let phase = hash(id + vec2f(17.0, 41.0));
  let speed = 0.55 + hash(id + vec2f(73.0, 9.0)) * 0.6;
  let cycle = depth * 0.4 - cfg.metrics.z * 3.0 * speed + phase * 7.0;
  let lead = -(fract(cycle) - 0.5) / 0.4;
  let enabled = select(0.0, 1.0, hash(id + vec2f(floor(cycle) * 13.1, 53.0)) < 0.45);
  let head = exp(-pow(max(-lead, 0.0) / 0.071232, 2.0));
  let tail = exp(-max(lead, 0.0) / 0.30912) * (1.0 - smoothstep(0.6875, 1.25, lead));
  let pulse = select(tail, head, lead < 0.0) * enabled;
  let fade = exp(-depth * 0.14) * smoothstep(0.04, 0.3, length(p));
  let walls = select(0.15, 1.0, horizontal);
  let light = (dots * (0.16 + pulse * 3.5) + bloom * (0.04 + pulse * 2.2)) * fade * walls * 3.8;
  let haze = exp(-abs(across) * 1.5) * fade * walls * 0.035;
  let grain = (hash(floor(uv * cfg.metrics.xy)) - 0.5) * 0.025;
  let value = 1.0 - exp(-max(light + haze + grain + 0.008, 0.0) * cfg.metrics.w * 1.4);
  return vec4f(vec3f(value), 1.0);
}
