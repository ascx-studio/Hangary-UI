import { lightEmerald, lightInk, lightPaper } from "./light-palette.shared.wgsl";

struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

struct Config { metrics: vec4f, pointer: vec4f, settings: vec4f };
@group(0) @binding(0) var<uniform> cfg: Config;

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let cellSize = cfg.settings.x;
  let grid = uv * cfg.metrics.xy / cellSize;
  let cell = floor(grid);
  let point = (cell + 0.5) * cellSize / cfg.metrics.y;
  let time = cfg.metrics.z;
  let field = sin(point.x * 3.2 + time) * cos(point.y * 3.8 - time * 0.7)
    + sin((point.x + point.y) * 2.4 - time * 0.5) * 0.5;
  let delta = (cell + 0.5) * cellSize - cfg.pointer.xy * cfg.metrics.xy;
  let hover = exp(-dot(delta, delta) / 18000.0) * cfg.pointer.z;
  let brightness = clamp(0.4 + field * 0.3 + hover * 0.45, 0.0, 1.0);
  let character = u32(brightness * 9.0);
  let glyphs = array<u32, 10>(0u, 131072u, 131200u, 31744u, 1016800u, 4357252u, 22511061u, 11512810u, 27070835u, 32175662u);
  let local = vec2i(floor(fract(grid) * 7.0)) - vec2i(1);
  var ink = 0.0;
  if (all(local >= vec2i(0)) && all(local < vec2i(5))) {
    ink = f32((glyphs[character] >> u32(local.y * 5 + local.x)) & 1u);
  }
  if (theme.mode.x > 0.5) {
    let paper = lightPaper();
    let inkColor = mix(lightInk(), lightEmerald(), brightness);
    return vec4f(mix(paper, inkColor, ink * clamp((0.9 + brightness * 0.1) * cfg.metrics.w, 0.0, 1.0)), 1.0);
  }
  let tint = mix(vec3f(0.08, 0.55, 0.35), vec3f(0.55, 1.0, 0.85), brightness);
  return vec4f(vec3f(0.005, 0.012, 0.01) + tint * ink * (0.3 + brightness * 0.7) * cfg.metrics.w, 1.0);
}
