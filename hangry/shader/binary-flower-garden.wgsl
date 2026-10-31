@group(0) @binding(0) var shapeTexture: texture_2d<f32>;
@group(0) @binding(1) var glyphTexture: texture_2d<f32>;
@group(0) @binding(2) var textureSampler: sampler;

struct Uniforms {
  resolution: vec2f,
  time: f32,
  isDark: f32,
};
@group(0) @binding(3) var<uniform> uniforms: Uniforms;

// Shared renderer theme binding; the explicit dark prop controls this effect.
struct Theme { mode: vec4f };
@group(0) @binding(4) var<uniform> theme: Theme;

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let shapeColor = textureSample(shapeTexture, textureSampler, uv);
  let glyphSample = textureSample(glyphTexture, textureSampler, uv);

  let bgDark = vec4f(0.078, 0.078, 0.086, 1.0); // #141416
  let bgLight = vec4f(0.961, 0.961, 0.969, 1.0); // #f5f5f7
  let bg = mix(bgLight, bgDark, uniforms.isDark);

  // Three rows of binary soil anchor the stems against a plain background.
  let scale = min(uniforms.resolution.x / 840.0, uniforms.resolution.y / 360.0);
  let cellSize = max(7.5, floor(8.5 * scale + 0.5));
  let groundRow = floor(0.78 * uniforms.resolution.y / cellSize);
  let soilRow = floor(uv.y * uniforms.resolution.y / cellSize) - groundRow;
  let soilMask = select(0.0, glyphSample.r, soilRow >= 0.0 && soilRow < 3.0);
  let soilColor = mix(vec3f(0.55, 0.39, 0.25), vec3f(0.36, 0.27, 0.18), uniforms.isDark);
  let finalBg = mix(bg, vec4f(soilColor, 1.0), soilMask);

  // Flower foreground masked with binary glyphs
  let maskedFlowerAlpha = shapeColor.a * glyphSample.r;
  let finalColor = mix(finalBg, vec4f(shapeColor.rgb, 1.0), maskedFlowerAlpha);

  return finalColor;
}
