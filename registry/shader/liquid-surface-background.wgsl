import { lightCyan, lightSurface, lightViolet } from "./light-palette.shared.wgsl";

struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

struct Config {
  metrics: vec4f,
  pointer: vec4f,
  settings: vec4f,
};
@group(0) @binding(0) var<uniform> cfg: Config;

fn surfaceHeight(p: vec2f, t: f32, mouse: vec2f) -> f32 {
  var height = sin(p.x * 4.0 + t) * cos(p.y * 4.0 + t * 0.8) * 0.3;
  height += sin(p.x * 8.0 - t * 1.4) * cos(p.y * 7.0 + t * 1.1) * 0.15;
  let distance = length(p - mouse);
  let ripple = sin(distance * 28.0 - t * 8.0) *
    exp(-distance * 4.5 / max(0.1, 0.22)) * cfg.pointer.z * cfg.settings.y * 0.4;
  return height + ripple;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = cfg.metrics.x / max(cfg.metrics.y, 1.0);
  let p = (uv - 0.5) * vec2f(aspect, 1.0);
  let mouse = (cfg.pointer.xy - 0.5) * vec2f(aspect, 1.0);
  let time = cfg.metrics.z * cfg.settings.x;
  let epsilon = 0.005;

  let center = surfaceHeight(p, time, mouse);
  let right = surfaceHeight(p + vec2f(epsilon, 0.0), time, mouse);
  let up = surfaceHeight(p + vec2f(0.0, epsilon), time, mouse);
  let normal = normalize(vec3f((center - right) / epsilon, (center - up) / epsilon, 1.0));

  let lightDirection = normalize(vec3f(0.5, 0.8, 0.7));
  let cursorDirection = normalize(vec3f(mouse.x - p.x, mouse.y - p.y, 0.4));
  let viewDirection = vec3f(0.0, 0.0, 1.0);
  let specular = pow(max(0.0, dot(normal, normalize(lightDirection + viewDirection))), 32.0);
  let cursorSpecular = pow(max(0.0, dot(normal, normalize(cursorDirection + viewDirection))), 24.0) * cfg.pointer.z;
  let fresnel = pow(1.0 - max(0.0, dot(normal, viewDirection)), 3.0);
  let rainbow = 0.5 + 0.5 * cos(normal.y * 6.0 + vec3f(0.0, 2.0, 4.0) + time * 0.5);
  let chrome = vec3f(0.1, 0.12, 0.16) + normal.z * 0.2 + rainbow * fresnel * 0.75;
  let vignette = 1.0 - smoothstep(0.4, 1.3, length(p));
  if (theme.mode.x > 0.5) {
    let pearl = mix(lightSurface(), lightCyan(), 0.2) + normal.z * 0.08;
    let iridescence = mix(lightCyan(), lightViolet(), rainbow) * fresnel * 0.24;
    let lightColor = pearl + iridescence + vec3f(specular * 0.25) + vec3f(0.1, 0.18, 0.22) * cursorSpecular;
    return vec4f(clamp(lightColor * (0.85 + vignette * 0.15) * cfg.metrics.w, vec3f(0.0), vec3f(1.0)), 1.0);
  }
  let color = (chrome + vec3f(1.0) * specular * 0.9 + vec3f(0.6, 0.9, 1.0) * cursorSpecular * 1.4) * cfg.metrics.w;
  return vec4f(clamp(color * vignette, vec3f(0.0), vec3f(1.0)), 1.0);
}
