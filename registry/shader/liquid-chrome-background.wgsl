struct Config { metrics: vec4f, pointer: vec4f, settings: vec4f };
@group(0) @binding(0) var<uniform> cfg: Config;

fn softbox(p: vec2f, center: vec2f, size: vec2f, softness: f32) -> f32 {
  let q = abs(p - center) - size;
  let distance = length(max(q, vec2f(0))) + min(max(q.x, q.y), 0.0);
  return 1.0 - smoothstep(-softness, softness, distance);
}

fn studio(reflection: vec3f, blur: f32) -> vec3f {
  let p = reflection.xy / max(reflection.z + 1.0, 0.08);
  let radius = length(p);
  let soft = 0.035 + blur;
  let key = softbox(p, vec2f(-0.25, 0.42), vec2f(0.3, 0.12), soft);
  let side = softbox(p, vec2f(0.48, 0.12), vec2f(0.06, 0.3), soft);
  let ground = softbox(p, vec2f(-0.1, -0.55), vec2f(0.45, 0.06), soft);
  let rim = exp(-pow((radius - 1.0) / (0.05 + blur * 1.5), 2.0));
  let wall = smoothstep(1.2, 1.7, radius) * (0.45 + 0.2 * sin(atan2(p.y, p.x) * 3.0));
  return vec3f(0.018) + vec3f(1.0, 0.98, 0.96) * key * 2.8
    + vec3f(0.93, 0.97, 1.0) * side * 2.0 + vec3f(ground * 0.8 + rim * 1.1 + wall);
}

fn shade(slope: vec2f, view: vec3f, blur: f32) -> vec3f {
  let steepness = length(slope);
  let limited = slope * (3.0 * tanh(steepness / 3.0) / max(steepness, 0.00001));
  let normal = normalize(vec3f(-limited, 1.0));
  let reflected = reflect(view, normal);
  let facing = clamp(dot(normal, -view), 0.0, 1.0);
  let fresnel = 0.92 + 0.08 * pow(1.0 - facing, 5.0);
  return studio(reflected, blur) * fresnel;
}

fn tonemap(color: vec3f) -> vec3f {
  return clamp((color * (2.51 * color + 0.03)) / (color * (2.43 * color + 0.59) + 0.14), vec3f(0), vec3f(1));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = cfg.metrics.x / cfg.metrics.y;
  let original = (uv - 0.5) * vec2f(aspect, 1.0) * cfg.settings.x;
  var p = original;
  var rowX = vec2f(1, 0);
  var rowY = vec2f(0, 1);
  let time = cfg.metrics.z;
  // Carry the warp derivatives forward for a smooth surface normal.
  for (var octave = 1; octave <= 4; octave++) {
    let i = f32(octave);
    let amplitude = cfg.settings.y * 0.3 / i;
    let soften = exp(0.3 - 0.3 * i);
    let x = i * 3.0 * p.y + time;
    p.x += amplitude * cos(x);
    rowX -= amplitude * sin(x) * i * 3.0 * soften * rowY;
    let y = i * 3.0 * p.x + time;
    p.y += amplitude * cos(y);
    rowY -= amplitude * sin(y) * i * 3.0 * soften * rowX;
  }
  let phase = time - p.x - p.y;
  let field = -(rowX + rowY);
  let across = field / max(length(field), 0.0001);
  let sharpness = 1.45;
  let bevel = tanh(sharpness * sin(phase));
  var slope = sharpness * cos(phase) * (1.0 - bevel * bevel) / tanh(sharpness) * across;
  let cursor = (cfg.pointer.xy - 0.5) * vec2f(aspect, 1.0) * cfg.settings.x;
  let delta = original - cursor;
  let distance = length(delta);
  let ripple = exp(-distance * distance * 3.0) * (9.0 * cos(distance * 9.0 - time) - 6.0 * distance * sin(distance * 9.0 - time));
  slope += delta / max(distance, 0.001) * ripple * cfg.pointer.z * 0.1;

  // Integrate across the steepest pixel footprint to soften thin reflections.
  let stepX = dpdx(slope);
  let stepY = dpdy(slope);
  let sweep = select(stepY, stepX, dot(stepX, stepX) > dot(stepY, stepY));
  let blur = cfg.settings.z * 0.35 + length(sweep) * 0.15;
  let view = normalize(vec3f(original * 0.08, -1));
  var light = vec3f(0);
  for (var sample = 0; sample < 4; sample++) {
    let offset = (f32(sample) + 0.5) / 4.0 - 0.5;
    light += shade(slope + sweep * offset, view, blur);
  }
  let color = pow(tonemap(light * 0.25 * cfg.settings.w * cfg.metrics.w), vec3f(1.0 / 2.2));
  return vec4f(color, 1.0);
}
