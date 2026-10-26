struct Config {
  metrics: vec4f,
  pointer: vec4f,
  settings: vec4f,
};
@group(0) @binding(0) var<uniform> cfg: Config;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let time = cfg.metrics.z;
  let motion = cfg.settings.x;
  let angle = time * motion * 0.18;
  let direction = normalize(vec2f(cos(angle), sin(angle)));
  let gradient = clamp(dot(uv - 0.5, direction) + 0.5, 0.0, 1.0);
  let cursor = 1.0 - smoothstep(0.0, 0.7, distance(uv, cfg.pointer.xy)) * cfg.pointer.z;
  let first = vec3f(0.02, 0.16, 0.12);
  let second = vec3f(0.02, 0.86, 0.48);
  let third = vec3f(0.15, 0.22, 0.52);
  let color = mix(mix(first, second, smoothstep(0.0, 0.55, gradient)), third, smoothstep(0.55, 1.0, gradient));
  return vec4f(color * (0.85 + cursor * 0.2) * cfg.metrics.w, 1.0);
}
