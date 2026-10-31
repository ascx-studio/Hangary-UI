struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

struct Config {
  metrics: vec4f, // canvas width, height, time, intensity
  pointer: vec4f, // normalized position, hover strength, reserved
};
@group(0) @binding(0) var<uniform> cfg: Config;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let pixel = uv * cfg.metrics.xy;
  let spacing = 16.0;
  let cell = floor(pixel / spacing);
  let local = fract(pixel / spacing) - 0.5;
  let radius = length(local) * spacing;
  let led = 1.0 - smoothstep(1.2, 2.0, radius);
  let halo = exp(-radius * radius / 12.0);
  let scanX = (sin(cfg.metrics.z * 0.22) * 0.5 + 0.5) * cfg.metrics.x;
  let scan = exp(-pow((pixel.x - scanX + pixel.y * 0.2) / 120.0, 2.0));
  let cursor = pixel - cfg.pointer.xy * cfg.metrics.xy;
  let hover = exp(-dot(cursor, cursor) / 20000.0) * cfg.pointer.z;
  let variation = 0.8 + fract(sin(dot(cell, vec2f(127.1, 311.7))) * 43758.5453) * 0.2;
  let energy = (led * (0.11 + scan * 0.5 + hover * 0.65) + halo * (scan + hover) * 0.07) * variation;
  let vignette = 1.0 - smoothstep(0.2, 0.85, length(uv - 0.5)) * 0.5;
  if (theme.mode.x > 0.5) {
    let board = vec3f(0.9, 0.94, 0.97);
    let dotColor = vec3f(0.04, 0.22, 0.4);
    return vec4f(mix(board, dotColor, clamp(energy * vignette * cfg.metrics.w, 0.0, 1.0)), 1.0);
  }
  let color = vec3f(0.008, 0.012, 0.018) + vec3f(0.62, 0.8, 1.0) * energy * vignette * cfg.metrics.w;
  return vec4f(color, 1.0);
}
