struct Config { metrics: vec4f, pointer: vec4f, settings: vec4f };
@group(0) @binding(0) var<uniform> cfg: Config;
fn cover(d: f32, aa: f32) -> f32 { return 1.0 - smoothstep(-aa, aa, d); }
fn ellipse(p: vec2f, r: vec2f) -> f32 { return (length(p / r) - 1.0) * min(r.x, r.y); }

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let aspect = cfg.metrics.x / max(cfg.metrics.y, 1.0);
  var p = (uv - 0.5) * vec2f(aspect, 1.0);
  let t = cfg.metrics.z;
  let aa = 1.2 / max(cfg.metrics.y, 1.0);
  let pointerWave = 0.0;
  let splashDelta = (uv - cfg.settings.xy) * vec2f(aspect, 1.0);
  let splashRadius = length(splashDelta);
  let age = cfg.settings.z;
  let front = splashRadius - age * 0.24;
  let splashWave = sin(front * 110.0) * exp(-front * front * 110.0) * exp(-age * 1.1)
    * smoothstep(0.0, 0.08, age) * cfg.settings.w;
  p += splashDelta / max(splashRadius, 0.01) * splashWave * 0.008;
  let wave = sin(p.x * 16.0 + sin(p.y * 13.0 + t * 0.5)) + sin(p.y * 23.0 - t * 0.4 + p.x * 5.0);
  // Smooth overlapping wave normals make broad, flowing reflections instead of cell borders.
  let water = p * 7.0 + vec2f(sin(p.y * 12.0 + t * 0.35), cos(p.x * 11.0 - t * 0.3)) * 0.35;
  let waveA = sin(water.x * 2.1 + sin(water.y * 1.7 + t * 0.3));
  let waveB = sin(water.y * 2.3 - sin(water.x * 1.8 - t * 0.25));
  let focus = abs(waveA + waveB * 0.72);
  let caustic = exp(-focus * focus * 28.0) * (0.45 + 0.25 * sin(water.x + water.y + t * 0.25));
  let nearest = 0.5 + 0.2 * waveA;
  let texture = fract(sin(dot(floor(p * 1800.0), vec2f(12.9898, 78.233))) * 43758.5453);
  var color = mix(vec3f(0.045, 0.13, 0.085), vec3f(0.19, 0.34, 0.22), nearest * 0.8 + texture * 0.15);
  // Rounded submerged stones, with a light-facing bevel and offset shadows.
  for (var rock = 0; rock < 5; rock++) {
    let id = f32(rock);
    let rockUV = vec2f(0.18 + fract(id * 0.37) * 0.65, 0.2 + fract(id * 0.57) * 0.65);
    let r = (uv - rockUV) * vec2f(aspect, 1.0) + (p - (uv - 0.5) * vec2f(aspect, 1.0));
    let size = 0.04 + fract(id * 0.43) * 0.035;
    let shape = length(r * vec2f(1.0, 0.85)) - size * (1.0 + sin(atan2(r.y, r.x) * 3.0 + id) * 0.08);
    let shadow = cover(length((r - vec2f(0.014, 0.018)) * vec2f(1.0, 0.85)) - size, aa * 5.0);
    color *= 1.0 - shadow * 0.48;
    let normal = r / size;
    let bevel = sqrt(max(0.0, 1.0 - min(1.0, dot(normal, normal))));
    let lighting = clamp(0.45 + bevel * 0.35 - normal.x * 0.25 - normal.y * 0.22, 0.1, 1.0);
    let stone = mix(vec3f(0.17, 0.2, 0.15), vec3f(0.4, 0.37, 0.23), fract(id * 0.7));
    color = mix(color, stone * lighting + texture * 0.025, cover(shape, aa));
  }
  // Tapered grass blades grow from clumps at the pond edges.
  for (var clump = 0; clump < 4; clump++) {
    let id = f32(clump);
    let root = vec2f(select(0.08, 0.9, clump % 2 == 1), select(0.94, 0.07, clump > 1));
    let g = (uv - root) * vec2f(aspect, 1.0) + (p - (uv - 0.5) * vec2f(aspect, 1.0));
    for (var blade = 0; blade < 7; blade++) {
      let b = f32(blade);
      let angle = -2.8 + b * 0.28 + id * 0.45;
      let length = 0.12 + fract(b * 0.37 + id * 0.21) * 0.14;
      let direction = vec2f(cos(angle), sin(angle)) * select(1.0, -1.0, clump > 1);
      let along = dot(g, direction) / length;
      let bend = sin(t * 0.6 + id + b * 0.6) * 0.015 * along * along;
      let across = dot(g, vec2f(-direction.y, direction.x)) - bend;
      let width = 0.001 + 0.008 * max(0.0, sin(clamp(along, 0.0, 1.0) * 3.14159));
      let shape = max(abs(across) - width, max(-along, along - 1.0) * length);
      let grass = mix(vec3f(0.015, 0.06, 0.02), vec3f(0.13, 0.27, 0.045), b / 7.0) + exp(-abs(across) * 900.0) * 0.04;
      color = mix(color, grass, cover(shape, aa));
    }
  }
  for (var i = 0; i < 4; i++) {
    let id = f32(i);
    // A click gives nearby koi a quick escape burst that eases back into cruising.
    let burstAge = max(cfg.settings.z, 0.0);
    let burstEnabled = cfg.settings.w * (1.0 - smoothstep(1.8, 2.8, burstAge));
    let acceleration = burstAge * exp(-burstAge * 1.8) * burstEnabled;
    let swimTime = t * 4.5;
    let speed = 0.27 + id * 0.055;
    let angle = swimTime * speed + id * 1.57079633 + 0.5;
    let orbitX = (0.2 + id * 0.016) * min(aspect, 1.2);
    let orbitY = 0.17 + id * 0.018;
    let wander = angle * 1.7 + id * 2.0;
    let baseCenter = vec2f(cos(angle) * orbitX + sin(wander) * 0.025, sin(angle) * orbitY);
    let pointerPosition = (cfg.pointer.xy - 0.5) * vec2f(aspect, 1.0);
    let away = baseCenter - pointerPosition;
    let proximity = exp(-dot(away, away) / 0.018) * cfg.pointer.z;
    let avoidance = away / max(length(away), 0.04) * proximity * 0.065;
    let clickPosition = (cfg.settings.xy - 0.5) * vec2f(aspect, 1.0);
    // Anchor the reaction to the fish position at click time, not its changing position.
    let clickAngle = (swimTime - burstAge * cfg.pointer.w * 4.5) * speed + id * 1.57079633 + 0.5;
    let clickWander = clickAngle * 1.7 + id * 2.0;
    let clickCenter = vec2f(cos(clickAngle) * orbitX + sin(clickWander) * 0.025, sin(clickAngle) * orbitY);
    let escapeDelta = clickCenter - clickPosition;
    let clickProximity = exp(-dot(escapeDelta, escapeDelta) / 0.025);
    let escapeDirection = escapeDelta / max(length(escapeDelta), 0.04);
    let escape = escapeDirection * clickProximity * acceleration * 0.28;
    let center = baseCenter + avoidance + escape;
    // Face the path tangent: the fish actively lead with their heads as they turn.
    let tangent = normalize(vec2f(-sin(angle) * orbitX + cos(wander) * 0.0425, cos(angle) * orbitY));
    let forward = normalize(tangent + avoidance * 5.0 + escapeDirection * clickProximity * acceleration * 0.9);
    let beat = swimTime * (4.8 + id * 0.6) + id * 2.1 + proximity * 0.7
      + clickProximity * burstEnabled * sin(burstAge * 6.0) * acceleration * 1.5;
    let delta = (p - center + vec2f(pointerWave, wave) * 0.0015) / (0.83 + id * 0.035);
    var q = vec2f(dot(delta, forward), dot(delta, vec2f(-forward.y, forward.x)));
    // The centerline bends increasingly toward the tail, keeping every fin attached.
    q.y -= sin((0.08 - q.x) * 22.0 - beat) * (0.004 + 0.028 * pow(clamp((0.08 - q.x) / 0.27, 0.0, 1.0), 1.5));
    let bodyU = clamp((q.x + 0.09) / 0.19, 0.0, 1.0);
    let radius = 0.004 + 0.031 * pow(max(0.0, sin(bodyU * 3.14159265)), 0.7) * (0.55 + bodyU * 0.65);
    let body = max(abs(q.y) - radius, max(-0.09 - q.x, q.x - 0.1));
    let head = ellipse(q - vec2f(0.067, 0.0), vec2f(0.039, 0.026));
    let silhouette = min(body, head);
    let shadow = cover(min(ellipse(q - vec2f(-0.006, 0.012), vec2f(0.1, 0.04)), body - 0.008), aa * 6.0);
    color *= 1.0 - shadow * 0.32;
    // Three flowing tail lobes emerge from the narrow tail root.
    for (var j = -1; j <= 1; j++) {
      let lobe = f32(j);
      let u = clamp((-q.x - 0.075) / (0.155 - abs(lobe) * 0.025), 0.0, 1.0);
      let spread = lobe * (0.037 + 0.007 * sin(beat - 0.8)) * pow(u, 0.9) + sin(u * 4.5 - beat + 0.9) * u * 0.027;
      let finWidth = 0.003 + 0.022 * pow(max(0.0, sin(u * 3.14159265)), 0.8);
      let d = max(abs(q.y - spread) - finWidth, max(q.x + 0.075, -0.23 + abs(lobe) * 0.025 - q.x));
      let rays = pow(0.5 + 0.5 * cos((q.y - spread) / max(finWidth, 0.002) * 22.0 + u * 7.0), 8.0);
      let finColor = mix(vec3f(0.11, 0.17, 0.18), vec3f(0.7, 0.76, 0.71), rays * 0.5 + 0.25);
      color = mix(color, finColor, cover(d, aa) * 0.72);
    }
    for (var k = -1; k <= 1; k += 2) {
      let side = f32(k);
      let finBeat = sin(beat * 0.7 + side * 0.8);
      let f = q - vec2f(0.022 + finBeat * 0.006, side * (0.03 + finBeat * 0.007));
      let fin = ellipse(vec2f(f.x + f.y * side * 0.9, f.y), vec2f(0.042, 0.016 + finBeat * 0.004));
      let rays = pow(0.5 + 0.5 * cos(atan2(f.y * side + 0.02, f.x + 0.04) * 42.0), 6.0);
      color = mix(color, vec3f(0.36, 0.44, 0.43) + rays * 0.16, cover(fin, aa) * 0.78);
    }
    let roundness = sqrt(max(0.0, 1.0 - pow(clamp(q.y / max(radius, 0.005), -1.0, 1.0), 2.0)));
    let scaleUV = vec2f(q.x * 175.0, q.y * 210.0);
    let cell = fract(scaleUV + vec2f(floor(scaleUV.y) * 0.5, 0.0)) - 0.5;
    let scales = exp(-abs(length(cell) - 0.45) * 32.0) * (1.0 - smoothstep(0.035, 0.07, q.x));
    let silver = 0.25 + roundness * 0.37 + scales * 0.1;
    let markings = smoothstep(0.2, 0.7, sin(q.x * 75.0 + id * 3.0 + sin(q.y * 100.0)));
    var bodyColor = mix(vec3f(silver * 1.04, silver, silver * 0.87), vec3f(silver * 0.32, silver * 0.4, silver * 0.39), markings * 0.75);
    bodyColor += vec3f(0.12) * exp(-pow((q.y + 0.009) / 0.007, 2.0)) * roundness;
    color = mix(color, bodyColor, cover(silhouette, aa));
    let eyes = min(length(q - vec2f(0.077, 0.019)), length(q - vec2f(0.077, -0.019)));
    color = mix(color, vec3f(0.008, 0.015, 0.018), cover(eyes - 0.004, aa * 0.6));
    let glint = length(q - vec2f(0.078, -0.02));
    color = mix(color, vec3f(0.8), cover(glint - 0.0014, aa * 0.4));
    let gill = abs(length((q - vec2f(0.069, 0.0)) / vec2f(0.027, 0.025)) - 1.0) * 0.02;
    color *= 1.0 - cover(gill - 0.0008, aa * 0.5) * cover(silhouette, aa) * (1.0 - smoothstep(0.045, 0.06, q.x)) * 0.3;
  }
  // Surface reflections sit above the fish; water remains visible throughout the scene.
  let reflection = pow(0.5 + 0.5 * sin(wave * 2.2 + p.x * 8.0), 22.0);
  color += vec3f(0.32, 0.42, 0.26) * caustic * 0.42;
  color += vec3f(0.16, 0.25, 0.24) * reflection * 0.12;
  color += vec3f(0.25, 0.35, 0.22) * splashWave * 0.25;
  color += vec3f(0.09, 0.18, 0.19) * max(0.0, pointerWave) * 0.35;
  color *= 1.0 - smoothstep(0.25, 0.8, length(uv - 0.5)) * 0.4;
  return vec4f(clamp(color * cfg.metrics.w, vec3f(0), vec3f(1)), 1.0);
}
