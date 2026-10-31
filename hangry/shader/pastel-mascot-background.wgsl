import { lightBlue, lightCyan, lightPaper, lightRose, lightSurface, lightViolet } from "./light-palette.shared.wgsl";

struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

struct Config {
  metrics: vec4f, // width, height, time, intensity
  pointer: vec4f, // normalized position, hover amount
};
@group(0) @binding(0) var<uniform> cfg: Config;

const PI: f32 = 3.14159265359;

fn hash21(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

fn valueNoise(st: vec2f) -> f32 {
  let i = floor(st);
  let f = fract(st);
  let u = f * f * (3.0 - 2.0 * f);
  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn rotate(p: vec2f, angle: f32) -> vec2f {
  let c = cos(angle);
  let s = sin(angle);
  return vec2f(p.x * c - p.y * s, p.x * s + p.y * c);
}

fn getPosition(index: f32, time: f32) -> vec2f {
  let a = index * 0.37;
  let b = 0.6 + fract(index / 3.0) * 0.9;
  let c = 0.8 + fract((index + 1.0) / 4.0);
  return 0.5 + 0.5 * vec2f(sin(time * b + a), cos(time * c + a * 1.5));
}

@fragment fn fs_main(@location(0) uvInput: vec2f) -> @location(0) vec4f {
  var uv = uvInput;
  let time = 0.5 * (cfg.metrics.z + 41.5);
  let distortion = 0.8;
  let swirl = 0.1;
  let radius = smoothstep(0.0, 1.0, length(uv - 0.5));
  let center = 1.0 - radius;

  for (var i = 1.0; i <= 2.0; i += 1.0) {
    uv.x += distortion * center / i *
      sin(time + i * 0.4 * smoothstep(0.0, 1.0, uv.y)) *
      cos(0.2 * time + i * 2.4 * smoothstep(0.0, 1.0, uv.y));
    uv.y += distortion * center / i *
      cos(time + i * 2.0 * smoothstep(0.0, 1.0, uv.x));
  }

  let uvRotated = rotate(uv - 0.5, -3.0 * swirl * radius) + 0.5;
  let pointer = (cfg.pointer.xy - 0.5) * cfg.pointer.z * 0.04;
  let sampleUv = uvRotated + pointer;

  let colors = array<vec3f, 5>(
    vec3f(1.0, 0.702, 0.851),
    vec3f(0.529, 0.808, 0.922),
    vec3f(0.290, 0.565, 0.886),
    vec3f(0.169, 0.243, 0.314),
    vec3f(0.102, 0.102, 0.181)
  );

  let lightColors = array<vec3f, 5>(mix(lightRose(), lightPaper(), 0.5), mix(lightCyan(), lightPaper(), 0.45), mix(lightBlue(), lightPaper(), 0.35), mix(lightViolet(), lightPaper(), 0.45), lightSurface());
  var color = vec3f(0.0);
  var totalWeight = 0.0;
  for (var index = 0.0; index < 5.0; index += 1.0) {
    let position = getPosition(index, time);
    let distance = pow(length(sampleUv - position), 3.5);
    let weight = 1.0 / (distance + 0.001);
    color += select(colors[u32(index)], lightColors[u32(index)], theme.mode.x > 0.5) * weight;
    totalWeight += weight;
  }

  color /= max(totalWeight, 0.0001);
  return vec4f(color * cfg.metrics.w, 1.0);
}
