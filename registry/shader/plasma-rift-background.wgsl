struct Config {
  metrics: vec4f,
  pointer: vec4f,
  settings: vec4f,
};
@group(0) @binding(0) var<uniform> cfg: Config;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = cfg.metrics.x / max(cfg.metrics.y, 1.0);
  var p = (uv - 0.5) * vec2f(aspect, 1.0) * 2.0;
  p -= (cfg.pointer.xy - 0.5) * vec2f(aspect, 1.0) * cfg.pointer.z * 0.18;
  let t = cfg.metrics.z;
  let radius = max(length(p), 0.008);
  let angle = atan2(p.y, p.x);
  // Log-polar space repeats folded ribbons toward a dark vanishing point.
  let depth = -log(radius);
  let twist = angle + depth * 0.65 + t * 0.2;
  var q = vec2f(twist * 3.0, depth * 4.0 - t * 1.6);
  q += vec2f(sin(q.y * 1.3 + sin(twist * 5.0)), cos(q.x * 1.2 - t)) * 0.8;
  let folds = sin(q.y + sin(q.x * 1.5) * 1.6) + sin(q.x * 2.0 + q.y * 0.65) * 0.55;
  let edge = abs(folds - 0.24);
  let core = exp(-edge * 14.0);
  let halo = exp(-edge * 5.0) * 0.22;
  let broken = smoothstep(-0.65, 0.5, sin(q.x + q.y * 0.3));
  let colorPhase = sin(twist * 2.0 + depth * 1.7);
  let tint = mix(vec3f(0.15, 0.7, 1.0), vec3f(0.6, 1.0, 0.48), colorPhase * 0.5 + 0.5);
  let centerFade = smoothstep(0.015, 0.15, radius);
  let vignette = 1.0 - smoothstep(0.65, 1.5, radius);
  let energy = (core * 2.7 + halo) * broken * centerFade * vignette * cfg.metrics.w;
  let color = tint * energy + vec3f(core * core * 0.8 * broken * centerFade * vignette * cfg.metrics.w);
  return vec4f(clamp(color, vec3f(0), vec3f(1)), 1.0);
}
