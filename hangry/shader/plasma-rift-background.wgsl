import { lightBlue, lightEmerald, lightPaper } from "./light-palette.shared.wgsl";

struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

struct Config {
  metrics: vec4f,   // x: width px, y: height px, z: time s, w: intensity
  pointer: vec4f,   // xy: pointer in 0..1 (y up), z: pull strength
  settings: vec4f,  // reserved
};
@group(0) @binding(0) var<uniform> cfg: Config;

struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
};

@vertex fn vs_main(@builtin(vertex_index) i: u32) -> VSOut {
  var p = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  var o: VSOut;
  o.pos = vec4f(p[i], 0.0, 1.0);
  o.uv = (p[i] + vec2f(1.0)) * 0.5;
  return o;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = cfg.metrics.x / max(cfg.metrics.y, 1.0);
  var p = (uv - 0.5) * vec2f(aspect, 1.0) * 2.0;
  p -= (cfg.pointer.xy - 0.5) * vec2f(aspect, 1.0) * cfg.pointer.z * 0.18;
  let t = cfg.metrics.z;
  let radius = max(length(p), 0.008);
  let angle = atan2(p.y, p.x);
  let depth = -log(radius);
  let twist = angle + depth * 0.65 + t * 0.2;
  var q = vec2f(twist * 3.0, depth * 4.0 - t * 1.6);
  // Whole-number multipliers on q.x keep the pattern continuous across the atan2 seam.
  q += vec2f(sin(q.y * 1.3 + sin(twist * 5.0)), cos(q.x * 1.0 - t)) * 0.8;
  let folds = sin(q.y + sin(q.x * 2.0) * 1.6) + sin(q.x * 2.0 + q.y * 0.65) * 0.55;
  let edge = abs(folds - 0.24);
  let core = exp(-edge * 14.0);
  let halo = exp(-edge * 5.0) * 0.22;
  let broken = smoothstep(-0.65, 0.5, sin(q.x + q.y * 0.3));
  let colorPhase = sin(twist * 2.0 + depth * 1.7);
  let tint = mix(vec3f(0.15, 0.7, 1.0), vec3f(0.6, 1.0, 0.48), colorPhase * 0.5 + 0.5);
  let centerFade = smoothstep(0.015, 0.15, radius);
  let vignette = 1.0 - smoothstep(0.65, 1.5, radius);
  let energy = (core * 2.7 + halo) * broken * centerFade * vignette * cfg.metrics.w;
  if (theme.mode.x > 0.5) {
    let ribbon = clamp(energy * 0.65 + core * 0.4, 0.0, 1.0);
    let mineral = mix(lightBlue(), lightEmerald(), colorPhase * 0.5 + 0.5);
    return vec4f(mix(lightPaper(), mineral, ribbon), 1.0);
  }
  let color = tint * energy + vec3f(core * core * 0.8 * broken * centerFade * vignette * cfg.metrics.w);
  return vec4f(clamp(color, vec3f(0.0), vec3f(1.0)), 1.0);
}
