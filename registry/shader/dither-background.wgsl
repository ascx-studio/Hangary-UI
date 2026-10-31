struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

struct Config {
  // Surface width, height, pixel size, and elapsed animation time.
  metrics: vec4f,
  // Normalized pointer position, hover strength, reserved.
  pointer: vec4f,
  // Click position, age in seconds, active flag.
  ripple: vec4f,
  foreground: vec4f,
  background: vec4f,
};
@group(0) @binding(0) var<uniform> cfg: Config;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let pixel = uv * cfg.metrics.xy;
  let hover = cfg.pointer.z;

  // Cursor lens. The push grows with distance from the pointer, so a cell can
  // move away from it but never past it (no mirrored or torn patch).
  let cursorDelta = pixel - cfg.pointer.xy * cfg.metrics.xy;
  let cursorDistance = length(cursorDelta);
  let cursorDir = cursorDelta / max(cursorDistance, 1.0);
  let cursorFalloff = max(0.0, 1.0 - cursorDistance / 120.0);
  let cursorPush = cursorDistance * 0.8 * cursorFalloff * cursorFalloff * hover;

  // Click ring. The push is capped so the first frames can't fold over the click point.
  let rippleDelta = pixel - cfg.ripple.xy * cfg.metrics.xy;
  let rippleDistance = length(rippleDelta);
  let rippleDir = rippleDelta / max(rippleDistance, 1.0);
  let ring = abs(rippleDistance - cfg.ripple.z * 225.0);
  let rippleForce = max(0.0, 1.0 - ring / 37.0) * max(0.0, 1.0 - cfg.ripple.z / 0.675) * 30.0 * cfg.ripple.w;
  let ripplePush = min(rippleForce, rippleDistance * 0.5);

  // Inverse-map the grid so its pixels move away from the pointer and click ring.
  let displaced = pixel - cursorDir * cursorPush - rippleDir * ripplePush;
  let grid = max(displaced, vec2f(0.0)) / cfg.metrics.z;
  let cell = floor(grid);
  let position = (cell + 0.5) * cfg.metrics.z / cfg.metrics.y;
  let center = cfg.metrics.xy / cfg.metrics.y * 0.5;
  let p = position - center;
  let time = cfg.metrics.w;
  let wave = sin(p.x * 5.0 + time) * cos(p.y * 4.0 - time * 0.7);
  let swirl = sin(length(p + vec2f(sin(time * 0.3) * 0.3, 0.0)) * 12.0 - time);
  let brightness = clamp(0.4 + wave * 0.25 + swirl * 0.2 - length(p) * 0.12, 0.0, 1.0);

  var bayer = array<f32, 16>(0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0);
  let index = u32(cell.x) % 4u + (u32(cell.y) % 4u) * 4u;
  let threshold = (bayer[index] + 0.5) / 16.0;

  // Separate the displaced cells instead of letting them read as one solid patch.
  let spread = max(cursorFalloff * hover, min(1.0, rippleForce / 30.0));
  let gap = spread * 0.18;
  let withinCell = abs(fract(grid) - 0.5);
  let cellMask = 1.0 - step(0.5 - gap, max(withinCell.x, withinCell.y));

  // Clear space around the cursor so the pixels visibly move away from it.
  let cleared = step(22.0 * hover, cursorDistance);
  let ink = step(threshold, brightness) * cellMask * cleared;
  if (theme.mode.x > 0.5) {
    return vec4f(mix(vec3f(0.92, 0.96, 0.94), cfg.foreground.rgb * 0.45, ink), 1.0);
  }
  return vec4f(mix(cfg.background.rgb, cfg.foreground.rgb, ink), 1.0);
}
