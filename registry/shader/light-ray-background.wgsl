struct Config {
  metrics: vec4f,    // x, y: size px · z: pulse clock · w: intensity
  pointer: vec4f,    // xy: pointer 0..1 (y down) · z: steer strength
  animation: vec4f,  // drift, reveal threshold, surge depth, surge strength
};
@group(0) @binding(0) var<uniform> cfg: Config;
const TAU = 6.2831853;
const COUNT = 56.0;
const FLOW = -1.0;  // 1.0: pulses run into the tunnel, -1.0: out toward the viewer
fn hash(n: f32) -> f32 { return fract(sin(n * 127.1) * 43758.5453); }
fn bend_at(depth: f32) -> vec2f {
  let reach = 1.0 - exp(-max(depth, 0.0) * 0.55);
  let wobble = vec2f(sin(cfg.animation.x * 0.37 + depth * 0.31), cos(cfg.animation.x * 0.29 + depth * 0.23)) * 0.18;
  let steer = (cfg.pointer.xy - 0.5) * vec2f(1.0, -1.0) * 0.5 * cfg.pointer.z;
  return (wobble + steer) * reach;
}
@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let scale = min(cfg.metrics.x, cfg.metrics.y) * 0.5;
  let p = (uv - 0.5) * cfg.metrics.xy * vec2f(1.0, -1.0) / scale;
  var depth = -log(max(length(p), 0.00001));
  var q = p;
  for (var j = 0; j < 4; j++) {
    q = p - bend_at(depth);
    depth = -log(max(length(q), 0.00001));
  }
  let r = length(q);
  let px = r * scale;
  let swing = sin(cfg.animation.x * 0.9) * 0.25 / TAU;
  let s = atan2(q.y, q.x) / TAU - swing - 0.045 * sin(depth * 1.2 + cfg.animation.x * 0.5);
  let cell = floor(s * COUNT);
  let spacing = TAU * px / COUNT;
  let near = smoothstep(0.55, 1.25, r);
  let width = 0.775 * (1.0 + near * 1.2);
  let soft = 0.55 + near * 0.9;
  let tight = 2.4 * (1.0 + near);
  var lines = 0.0;
  var glow = 0.0;
  for (var k = -3; k <= 3; k++) {
    let i = cell + f32(k);
    let id = i - floor(i / COUNT) * COUNT;
    let h1 = hash(id);
    let h2 = hash(id + 17.0);
    let h3 = hash(id + 41.0);
    let h4 = hash(id + 73.0);
    var center = (i + 0.5 + (h1 - 0.5) * 0.55) / COUNT;
    center += 0.12 * sin(depth * (0.8 + h2 * 0.9) + cfg.animation.x * (0.4 + h3 * 0.5) + h4 * TAU) / COUNT;
    let d = abs(s - center) * TAU * px;
    let shade = 1.0 + (h3 - 0.5) * 0.9;
    let reach = 1.0 - smoothstep(spacing * 1.4, max(spacing * 2.4, 0.00001), d);
    lines += (1.0 - smoothstep(width - soft, width + soft, d)) * shade;
    // FLOW flips the travel direction. The head/tail sides flip with it, so the head always leads.
    let x = depth * 0.4 - FLOW * cfg.metrics.z * 8.0 * (0.55 + h2 * 0.6) + h4 * 7.0;
    let lead = -FLOW * (fract(x) - 0.5) / 0.4;
    let lit = select(0.0, 1.0, hash(id * 3.7 + floor(x) * 13.1) <= 0.5);
    let ahead = max(-lead, 0.0) / 0.071232;
    let head = exp(-ahead * ahead) * smoothstep(-1.25, -1.0, lead);
    let tail = exp(-max(lead, 0.0) / 0.30912) * (1.0 - smoothstep(0.6875, 1.25, lead));
    let off = (depth - cfg.animation.z) / 0.22;
    let surge = cfg.animation.w * exp(-off * off);
    let pulse = max(select(tail, head, lead < 0.0) * lit, surge);
    let core = 1.5 * width + 0.35;
    let stroke = 1.0 - smoothstep(core - soft, core + soft, d);
    let bloom = (exp(-d / tight) * 0.7 + exp(-d / (tight * 4.5)) * 0.18) * reach;
    glow += pulse * (stroke * 1.5 + bloom) * shade;
  }
  let lod = 1.0 - smoothstep(1.2, 4.0, spacing);
  let average = min(1.55 / max(spacing, 0.001), 1.0);
  lines = mix(lines, average, lod);
  glow = mix(glow, average * 0.3, lod);
  let rr = r * 0.25;
  let fade = smoothstep(0.0, 0.5, rr) * (1.0 - smoothstep(1.1, 2.0, rr)) * smoothstep(cfg.animation.y - 0.6, cfg.animation.y, depth);
  let light = (lines * 0.12 + glow) * cfg.metrics.w * fade;
  return vec4f(vec3f(1.0 - exp(-light * 1.4)), 1.0);
}
