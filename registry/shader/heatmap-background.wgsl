struct Config { metrics: vec4f, pointer: vec4f, settings: vec4f };
@group(0) @binding(0) var<uniform> cfg: Config;

fn thermal(value: f32) -> vec3f {
  let t = clamp(value, 0.0, 1.0) * 4.0;
  let colors = array<vec3f, 5>(vec3f(0.015, 0.01, 0.15), vec3f(0.05, 0.15, 0.8),
    vec3f(0.0, 0.8, 0.65), vec3f(1.0, 0.85, 0.08), vec3f(1.0, 0.08, 0.02));
  let index = min(u32(t), 3u);
  return mix(colors[index], colors[index + 1u], smoothstep(0.0, 1.0, t - f32(index)));
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = cfg.metrics.x / cfg.metrics.y;
  let p = (uv - 0.5) * vec2f(aspect, 1.0) * cfg.settings.x;
  let time = cfg.metrics.z;
  let warmCenter = vec2f(sin(time * 0.55) * 0.42, cos(time * 0.38) * 0.32);
  let warmCenter2 = vec2f(cos(time * 0.3 + 1.5) * 0.5, sin(time * 0.48) * 0.3);
  let coldCenter = vec2f(cos(time * 0.32) * 0.5, sin(time * 0.44) * 0.38);
  let warm = exp(-dot(p - warmCenter, p - warmCenter) * 4.5);
  let warm2 = exp(-dot(p - warmCenter2, p - warmCenter2) * 5.0);
  let cool = exp(-dot(p - coldCenter, p - coldCenter) * 3.5);
  let waves = sin(p.x * 3.2 + sin(p.y * 2.6 + time * 0.8)) *
    cos(p.y * 2.8 - time * 0.5);
  let ripples = sin(length(p) * 8.0 - time * 1.2) * 0.08;
  let cursor = (uv - cfg.pointer.xy) * vec2f(aspect, 1.0);
  let heat = exp(-dot(cursor, cursor) * 12.0) * cfg.pointer.z * 0.45;
  let temperature = 0.28 + waves * 0.16 + ripples + warm * 0.55 + warm2 * 0.3 - cool * 0.22 + heat;
  return vec4f(thermal(temperature) * cfg.metrics.w, 1.0);
}
