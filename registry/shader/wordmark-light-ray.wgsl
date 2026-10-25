struct Config {
  // Pointer in wordmark pixels, elapsed seconds, and hover state.
  ray: vec4f,
};

@group(0) @binding(0) var<uniform> cfg: Config;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let pointer = cfg.ray.xy / vec2f(1337.0, 336.0);
  // Start inside the mark so reduced motion still shows a complete beam.
  let scan = fract(cfg.ray.z * 0.14 + 0.45) * 1.6 - 0.3;
  let beam_x = mix(scan, pointer.x, cfg.ray.w);
  let beam_y = mix(0.5, pointer.y, cfg.ray.w);
  let offset = uv.x - beam_x + (uv.y - beam_y) * 0.14;
  let core = exp(-pow(offset / 0.009, 2.0));
  let halo = exp(-pow(offset / 0.065, 2.0));
  // A broad, asymmetric wake makes the direction of the ray visible.
  let trail = exp(min(offset, 0.0) / 0.15) * (1.0 - smoothstep(-0.005, 0.025, offset));
  let color = vec3f(0.025, 0.045, 0.065)
    + vec3f(0.1, 0.45, 0.8) * trail * 0.65
    + vec3f(0.25, 0.7, 1.0) * halo * 0.65
    + vec3f(0.85, 0.95, 1.0) * core;
  return vec4f(color, 1.0);
}
