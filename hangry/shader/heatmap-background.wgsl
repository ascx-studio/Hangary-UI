struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

struct Config { metrics: vec4f, pointer: vec4f, settings: vec4f };
@group(0) @binding(0) var<uniform> cfg: Config;

struct Palette { color0: vec4f, color1: vec4f, color2: vec4f, color3: vec4f, color4: vec4f, color5: vec4f, color6: vec4f, lightColor0: vec4f, lightColor1: vec4f, lightColor2: vec4f, lightColor3: vec4f, lightColor4: vec4f, lightColor5: vec4f, lightColor6: vec4f };
@group(0) @binding(1) var<uniform> palette: Palette;

fn thermal(value: f32) -> vec3f {
  let t = clamp(value, 0.0, 1.0) * 6.0;
  let colors = array<vec3f, 7>(palette.color0.rgb, palette.color1.rgb, palette.color2.rgb,
    palette.color3.rgb, palette.color4.rgb, palette.color5.rgb, palette.color6.rgb);
  let index = min(u32(t), 5u);
  let blend = smoothstep(0.0, 1.0, t - f32(index));
  if (theme.mode.x > 0.5) {
    let lightColors = array<vec3f, 7>(palette.lightColor0.rgb, palette.lightColor1.rgb, palette.lightColor2.rgb,
      palette.lightColor3.rgb, palette.lightColor4.rgb, palette.lightColor5.rgb, palette.lightColor6.rgb);
    return mix(lightColors[index], lightColors[index + 1u], blend);
  }
  return mix(colors[index], colors[index + 1u], blend);
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
