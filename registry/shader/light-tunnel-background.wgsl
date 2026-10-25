struct Config { metrics: vec4f, pointer: vec4f, settings: vec4f };
@group(0) @binding(0) var<uniform> cfg: Config;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = cfg.metrics.x / cfg.metrics.y;
  let center = vec2f(0.5) + (cfg.pointer.xy - 0.5) * cfg.pointer.z * 0.22;
  let p = (uv - center) * vec2f(aspect, 1.0);
  let angle = atan2(p.y, p.x);
  let radius = max(length(p), 0.008);
  let depth = -log(radius) * cfg.settings.x + cfg.metrics.z * 2.0;
  let distance = abs(fract(depth + 0.5) - 0.5) / max(fwidth(depth), 0.001);
  let ring = exp(-distance * distance * 0.9);
  let halo = exp(-distance * distance * 0.08) * 0.22;
  let spokes = pow(0.5 + 0.5 * cos(angle * 8.0 + cfg.metrics.z * 0.15), 35.0) * 0.12;
  let palette = 0.5 + 0.5 * cos(vec3f(0.3, 2.3, 4.2) + depth * 0.3 + cfg.settings.y);
  let opening = smoothstep(0.015, 0.09, radius);
  let edge = 1.0 - smoothstep(0.35, 1.3, radius) * 0.6;
  let color = vec3f(0.005, 0.008, 0.02) + palette * (ring * 0.75 + halo + spokes) * opening * edge * cfg.metrics.w;
  return vec4f(color, 1.0);
}
