struct Theme { mode: vec4f };
@group(1) @binding(0) var<uniform> theme: Theme;

@group(0) @binding(0) var scene: texture_2d<f32>;
@group(0) @binding(1) var sceneSampler: sampler;

struct BloomUniforms {
  resolution: vec2f,
  threshold: f32,
  intensity: f32,
  radius: f32,
  enabled: f32,
  pad1: f32,
  pad2: f32,
};
@group(0) @binding(2) var<uniform> bloom: BloomUniforms;

fn luminance(color: vec3f) -> f32 {
  return dot(color, vec3f(0.2126, 0.7152, 0.0722));
}

fn brightSample(uv: vec2f) -> vec3f {
  let color = textureSample(scene, sceneSampler, uv).rgb;
  let knee = 0.15;
  return color * smoothstep(bloom.threshold - knee, bloom.threshold + knee, luminance(color));
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let base = textureSample(scene, sceneSampler, uv);
  if (bloom.enabled < 0.5 || theme.mode.x > 0.5) {
    return base;
  }

  let texel = vec2f(1.0) / bloom.resolution * bloom.radius;
  var glow = brightSample(uv) * 0.22;
  var totalWeight = 0.22;

  let ring1 = array<vec2f, 4>(
    vec2f(-1.0, -1.0),
    vec2f(1.0, -1.0),
    vec2f(-1.0, 1.0),
    vec2f(1.0, 1.0)
  );
  for (var i = 0; i < 4; i++) {
    glow += brightSample(uv + ring1[i] * texel * 1.2) * 0.14;
    totalWeight += 0.14;
  }

  let ring2 = array<vec2f, 4>(
    vec2f(0.0, 2.4),
    vec2f(0.0, -2.4),
    vec2f(2.4, 0.0),
    vec2f(-2.4, 0.0)
  );
  for (var i = 0; i < 4; i++) {
    glow += brightSample(uv + ring2[i] * texel) * 0.09;
    totalWeight += 0.09;
  }

  let diagonal = 4.5 * 0.707;
  let ring3 = array<vec2f, 4>(
    vec2f(-diagonal, -diagonal),
    vec2f(diagonal, -diagonal),
    vec2f(-diagonal, diagonal),
    vec2f(diagonal, diagonal)
  );
  for (var i = 0; i < 4; i++) {
    let offset = ring3[i] * texel;
    let sampleValue = brightSample(uv + offset);
    let red = brightSample(uv + offset * 1.08).r;
    let blue = brightSample(uv + offset * 0.92).b;
    glow += vec3f(red, sampleValue.g, blue) * 0.055;
    totalWeight += 0.055;
  }

  let ring4 = array<vec2f, 4>(
    vec2f(0.0, 7.5),
    vec2f(0.0, -7.5),
    vec2f(7.5, 0.0),
    vec2f(-7.5, 0.0)
  );
  for (var i = 0; i < 4; i++) {
    glow += brightSample(uv + ring4[i] * texel) * 0.03;
    totalWeight += 0.03;
  }

  glow = glow / totalWeight * bloom.intensity * 2.2;
  let combined = base.rgb + glow;
  let toneMapped = combined / (vec3f(1.0) + combined * 0.15);
  return vec4f(toneMapped, base.a);
}
