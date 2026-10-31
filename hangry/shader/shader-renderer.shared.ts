import {
  effect,
  frame,
  frameLoop,
  init,
  sampler,
  surface,
  target,
  type Frame,
  type SurfaceOptions,
} from "vgpu";

type ShaderSource = Parameters<typeof effect>[1];
type Bindings = Parameters<ReturnType<typeof effect>["set"]>[0];

export interface PostProcessOptions {
  label: string;
  source: ShaderSource;
  uniforms?: (time: number, size: readonly [number, number]) => Bindings;
}

interface ShaderRendererOptions {
  label: string;
  uniforms: (
    time: number,
    size: readonly [number, number],
    gpu?: Awaited<ReturnType<typeof init>>,
  ) => Bindings;
  animated?: boolean;
  fps?: number;
  surface?: SurfaceOptions;
  postProcess?: PostProcessOptions;
  themeAware?: boolean;
  themeMask?: boolean;
}

/** Owns one canvas effect. Components supply bindings and retain their own input/UI logic. */
export function createShaderRenderer(
  canvas: HTMLCanvasElement,
  source: ShaderSource,
  {
    label,
    uniforms,
    animated = true,
    fps = 60,
    surface: surfaceOptions = { dpr: 1 },
    postProcess,
    themeAware = true,
    themeMask = false,
  }: ShaderRendererOptions,
) {
  let disposed = false;
  let gpu: Awaited<ReturnType<typeof init>> | undefined;
  let output: ReturnType<typeof surface> | undefined;
  let scene: ReturnType<typeof target> | undefined;
  let themeObserver: MutationObserver | undefined;
  let light = themeAware && !document.documentElement.classList.contains("dark");
  const theme = () => ({ mode: [Number(light), Number(themeMask), 0, 0] });
  let sceneSampler: ReturnType<typeof sampler> | undefined;
  let shader: ReturnType<typeof effect> | undefined;
  let postShader: ReturnType<typeof effect> | undefined;
  let loop: ReturnType<typeof frameLoop> | undefined;
  let observer: ResizeObserver | undefined;
  let unsubscribeResize: (() => void) | undefined;
  let pendingFrame = 0;
  let draw: ((currentFrame: Frame) => void) | undefined;
  canvas.style.opacity = "0";

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    loop?.stop();
    observer?.disconnect();
    themeObserver?.disconnect();
    cancelAnimationFrame(pendingFrame);
    unsubscribeResize?.();
    shader?.dispose();
    postShader?.dispose();
    output?.dispose();
    gpu?.dispose();
  };
  const render = () => {
    if (disposed || !draw || animated) return;
    cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(() => {
      if (!disposed && gpu && draw) frame(gpu, draw);
    });
  };
  const start = async () => {
    const initialized = await init();
    if (disposed) {
      initialized.dispose();
      return;
    }
    gpu = initialized;
    output = surface(gpu, canvas, surfaceOptions);
    scene = postProcess ? target(gpu, { size: output.size }) : undefined;
    sceneSampler = postProcess
      ? sampler(gpu, { minFilter: "linear", magFilter: "linear" })
      : undefined;
    light = themeAware && !document.documentElement.classList.contains("dark");
    shader = effect(gpu, source, {
      label,
      set: { ...uniforms(0, (scene ?? output).size, gpu), theme: theme() },
    });
    postShader = postProcess
      ? effect(gpu, postProcess.source, {
          label: postProcess.label,
          set: {
            theme: theme(),
            scene: scene,
            sceneSampler,
            ...postProcess.uniforms?.(0, output.size),
          },
        })
      : undefined;
    await shader.compile(scene ?? output);
    await postShader?.compile(output);
    if (disposed) return;
    const startedAt = performance.now();
    if (output && scene && sceneSampler) {
      unsubscribeResize = output.onResize(({ width, height }) => {
        scene?.resize([width, height]);
        postShader?.set({
          scene,
          sceneSampler,
          ...postProcess?.uniforms?.(0, [width, height]),
        });
      });
    }
    draw = (currentFrame) => {
      if (!output || !shader || disposed) return;
      const time = animated ? (performance.now() - startedAt) / 1000 : 0;
      const renderTarget = scene ?? output;
      shader.set({ ...uniforms(time, renderTarget.size, gpu!), theme: theme() });
      if (postShader && scene && sceneSampler) {
        postShader.set({
          theme: theme(),
          scene,
          sceneSampler,
          ...postProcess?.uniforms?.(time, output.size),
        });
        currentFrame.pass(scene, shader);
        currentFrame.pass(output, postShader);
      } else {
        currentFrame.pass(scene ?? output, shader);
      }
      canvas.style.opacity = "1";
    };
    if (themeAware) {
      themeObserver = new MutationObserver(() => {
        light = themeAware && !document.documentElement.classList.contains("dark");
        render();
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }
    if (animated) loop = frameLoop(gpu, draw, { fps });
    else {
      observer = new ResizeObserver(render);
      observer.observe(canvas);
      render();
    }
  };
  void start().catch((error: unknown) => {
    if (!disposed) {
      canvas.style.opacity = "0";
      console.warn(`${label} could not start; retaining its fallback:`, error);
      dispose();
    }
  });
  return { dispose, render };
}
