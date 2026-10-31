struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

struct Config {
  metrics: vec4f, // width, height, terrain scale, time
  contours: vec4f, // density, line width, reserved
  pointer: vec4f, // normalized position, influence, press strength
  options: vec4f, // reserved (was labels), left fade, reserved
  low: vec4f,
  foreground: vec4f,
  high: vec4f,
  background: vec4f,
};
@group(0) @binding(0) var<uniform> cfg: Config;

fn hash(p: vec3f) -> f32 {
  return fract(sin(dot(p, vec3f(127.1, 311.7, 74.7))) * 43758.5453);
}

fn noise(p: vec3f) -> f32 {
  let cell = floor(p);
  let f = fract(p);
  let u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  let a = mix(mix(hash(cell), hash(cell + vec3f(1, 0, 0)), u.x),
    mix(hash(cell + vec3f(0, 1, 0)), hash(cell + vec3f(1, 1, 0)), u.x), u.y);
  let b = mix(mix(hash(cell + vec3f(0, 0, 1)), hash(cell + vec3f(1, 0, 1)), u.x),
    mix(hash(cell + vec3f(0, 1, 1)), hash(cell + vec3f(1, 1, 1)), u.x), u.y);
  return mix(a, b, u.z);
}

fn terrain(pixel: vec2f) -> f32 {
  let p = pixel / cfg.metrics.y * cfg.metrics.z + vec2f(4.7, 9.2);
  var height = noise(vec3f(p, cfg.metrics.w)) * 0.57;
  height += noise(vec3f(p * 2.0 + vec2f(11.3), cfg.metrics.w * 0.8)) * 0.29;
  height += noise(vec3f(p * 4.0 + vec2f(27.8), cfg.metrics.w * 0.6)) * 0.14;
  let distance = length(pixel - cfg.pointer.xy * cfg.metrics.xy);
  let radius = min(cfg.metrics.x, cfg.metrics.y) * 0.35;
  let influence = pow(max(0.0, 1.0 - distance / radius), 2.0);
  return (height - 0.2) * 1.65 + influence * cfg.pointer.z * mix(0.32, -0.32, cfg.pointer.w);
}

fn palette(height: f32) -> vec3f {
  let h = clamp(height, 0.0, 1.0);
  return mix(mix(cfg.low.rgb, cfg.foreground.rgb, min(h * 2.0, 1.0)),
    cfg.high.rgb, max(h * 2.0 - 1.0, 0.0));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let pixel = uv * cfg.metrics.xy;
  let height = terrain(pixel);
  let level = height * cfg.contours.x;
  let distance = abs(fract(level + 0.5) - 0.5) / max(fwidth(level), 0.0001);
  let line = 1.0 - smoothstep(cfg.contours.y * 0.35, cfg.contours.y * 0.35 + 0.8, distance);
  let majorLevel = level / 4.0;
  let majorDistance = abs(fract(majorLevel + 0.5) - 0.5) / max(fwidth(majorLevel), 0.0001);
  let major = 1.0 - smoothstep(cfg.contours.y * 0.7, cfg.contours.y * 0.7 + 0.8, majorDistance);
  let paper = select(cfg.background.rgb, vec3f(0.96, 0.95, 0.9), theme.mode.x > 0.5);
  let contourInk = select(palette(height), mix(vec3f(0.22, 0.15, 0.07), palette(height) * 0.48, 0.6), theme.mode.x > 0.5);
  let color = mix(paper, contourInk, max(line * 0.35, major * 0.7));

  let fade = select(1.0, smoothstep(0.0, 0.65, uv.x), cfg.options.y > 0.5);
  return vec4f(mix(paper, color, fade), 1.0);
}
