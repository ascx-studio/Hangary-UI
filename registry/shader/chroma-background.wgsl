struct Config {
  metrics: vec4f, // width, height, time, intensity
  pointer: vec4f, // normalized position, hover strength, reserved
  settings: vec4f, // hue offset in radians, grain strength, reserved
};
@group(0) @binding(0) var<uniform> cfg: Config;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = cfg.metrics.x / cfg.metrics.y;
  var p = (uv - 0.5) * vec2f(aspect, 1.0) * 2.0;
  let cursor = (uv - cfg.pointer.xy) * vec2f(aspect, 1.0);
  let influence = exp(-dot(cursor, cursor) * 5.0) * cfg.pointer.z;
  p += cursor * influence * 0.45;
  let time = cfg.metrics.z;
  // Broad domain warps keep color flowing like liquid rather than a flat rainbow.
  let warp = vec2f(sin(p.y * 1.9 + time * 0.7), cos(p.x * 1.4 - time * 0.6));
  let q = p + warp * 0.7;
  let flow = sin(q.x * 1.6 + time * 0.35) + cos(q.y * 1.8 - time * 0.4);
  let phase = flow * 2.2 + q.x * 0.6 + cfg.settings.x;
  let spectrum = 0.5 + 0.5 * cos(vec3f(0.0, 2.1, 4.2) + phase);
  let ribbons = pow(0.5 + 0.5 * sin(flow * 2.1 + q.y), 1.5);
  let glow = 0.1 + ribbons * 0.65 + influence * 0.12;
  let vignette = 1.0 - smoothstep(0.3, 1.0, length(uv - 0.5)) * 0.55;
  var color = vec3f(0.012, 0.008, 0.025) + pow(spectrum, vec3f(1.4)) * glow * vignette * cfg.metrics.w;
  let grain = fract(sin(dot(floor(uv * cfg.metrics.xy), vec2f(12.9898, 78.233))) * 43758.5453) - 0.5;
  color += vec3f(grain * cfg.settings.y);
  return vec4f(clamp(color, vec3f(0), vec3f(1)), 1.0);
}
