import { lightCyan, lightPaper, lightRose, lightViolet } from "./light-palette.shared.wgsl";

struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

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
  let warpA = vec2f(
    sin(p.y * 2.2 + time * 0.55) + cos(p.x * 1.3 - time * 0.35),
    cos(p.x * 2.0 - time * 0.5) + sin(p.y * 1.5 + time * 0.4)
  );
  let q = p + warpA * 0.42;
  let warpB = vec2f(
    sin(q.y * 4.5 - time * 0.8),
    cos(q.x * 4.0 + time * 0.65)
  );
  let r = q + warpB * 0.12;
  let flow = sin(r.x * 2.4 + r.y * 1.7 + time * 0.45) +
    cos(r.y * 2.8 - r.x * 1.2 - time * 0.32);
  let bands = 0.5 + 0.5 * sin(flow * 3.0 + r.x * 1.8 + time * 0.25);
  let phase = flow * 1.7 + bands * 1.2 + cfg.settings.x;
  let spectrum = 0.5 + 0.5 * cos(vec3f(0.0, 2.094, 4.188) + phase);
  let ribbons = smoothstep(0.18, 0.82, bands);
  let glow = 0.08 + ribbons * 0.82 + influence * 0.16;
  let vignette = 1.0 - smoothstep(0.35, 1.25, length(p)) * 0.5;
  let grain = fract(sin(dot(floor(uv * cfg.metrics.xy), vec2f(12.9898, 78.233))) * 43758.5453) - 0.5;
  if (theme.mode.x > 0.5) {
    let dye = (lightRose() * spectrum.r + lightCyan() * spectrum.g + lightViolet() * spectrum.b) / max(spectrum.r + spectrum.g + spectrum.b, 0.001);
    let pigment = mix(lightPaper(), dye, glow * vignette * 0.78 * cfg.metrics.w);
    return vec4f(pigment + vec3f(grain * cfg.settings.y * 0.3), 1.0);
  }
  var color = vec3f(0.008, 0.006, 0.02) + pow(max(spectrum, vec3f(0.0)), vec3f(1.25)) * glow * vignette * cfg.metrics.w;
  color += vec3f(grain * cfg.settings.y);
  return vec4f(clamp(color, vec3f(0), vec3f(1)), 1.0);
}
