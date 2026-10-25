import { clock, effect, frame, frameLoop, init, surface, type Frame, type SurfaceOptions } from "vgpu";

type ShaderSource = Parameters<typeof effect>[1];
type Bindings = Parameters<ReturnType<typeof effect>["set"]>[0];

interface ShaderRendererOptions {
  label: string;
  uniforms: (time: number, size: readonly [number, number]) => Bindings;
  animated?: boolean;
  fps?: number;
  surface?: SurfaceOptions;
}

/** Owns one canvas effect. Components supply bindings and retain their own input/UI logic. */
export function createShaderRenderer(canvas: HTMLCanvasElement, source: ShaderSource, {
  label, uniforms, animated = true, fps = 60, surface: surfaceOptions = { dpr: 1 },
}: ShaderRendererOptions) {
  let disposed = false;
  let gpu: Awaited<ReturnType<typeof init>> | undefined;
  let target: ReturnType<typeof surface> | undefined;
  let shader: ReturnType<typeof effect> | undefined;
  let loop: ReturnType<typeof frameLoop> | undefined;
  let observer: ResizeObserver | undefined;
  let pendingFrame = 0;
  let draw: ((currentFrame: Frame) => void) | undefined;
  canvas.style.opacity = "0";

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    loop?.stop();
    observer?.disconnect();
    cancelAnimationFrame(pendingFrame);
    shader?.dispose();
    target?.dispose();
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
    if (disposed) { initialized.dispose(); return; }
    gpu = initialized;
    target = surface(gpu, canvas, surfaceOptions);
    shader = effect(gpu, source, { label, set: uniforms(0, target.size) });
    await shader.compile(target);
    if (disposed) return;
    const time = clock(gpu);
    draw = (currentFrame) => {
      if (!target || !shader || disposed) return;
      shader.set(uniforms(animated ? time.time : 0, target.size));
      currentFrame.pass(target, shader);
      canvas.style.opacity = "1";
    };
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
