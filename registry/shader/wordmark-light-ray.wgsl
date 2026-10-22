// Adapted from triangle-led-front/shaders/led-emitters.wgsl.
// The wordmark's CSS mask replaces the source example's triangle SDF clip.
struct Config {
  resolution: vec2f,
  tunables: vec4f,
  ray: vec4f,
};

struct Led {
  pos_brightness: vec4f,
  color: vec4f,
};

@group(0) @binding(0) var<uniform> cfg: Config;
@group(0) @binding(1) var<storage, read> leds: array<Led>;

struct VSIn {
  @location(0) position: vec2f,
  @location(1) led_index: f32,
};

struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) led_index: f32,
};

@vertex fn vs_main(in: VSIn) -> VSOut {
  var out: VSOut;
  let clip = (in.position / cfg.resolution) * vec2f(2.0, -2.0) + vec2f(-1.0, 1.0);
  out.pos = vec4f(clip, 0.0, 1.0);
  out.led_index = in.led_index;
  return out;
}

@fragment fn fs_main(in: VSOut) -> @location(0) vec4f {
  let raw_index = u32(max(round(in.led_index), 0.0));
  let i = min(raw_index, arrayLength(&leds) - 1u);
  let led = leds[i];
  let brightness = clamp(led.pos_brightness.z, 0.0, 1.0);
  let scan_x = fract(cfg.ray.z * 0.1) * cfg.resolution.x;
  let scan_distance = in.pos.x - scan_x;
  let sweep = exp(-scan_distance * scan_distance / 5_000.0);
  let pointer_distance = distance(led.pos_brightness.xy, cfg.ray.xy);
  let hover_beam = exp(-pointer_distance * pointer_distance / 14_000.0) * cfg.ray.w;
  let intensity = mix(cfg.tunables.y, cfg.tunables.z, brightness)
    * cfg.tunables.x
    * (0.55 + sweep * 0.65 + hover_beam * 1.8);

  return vec4f(led.color.rgb * intensity, 1.0);
}
