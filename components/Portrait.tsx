"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Edge-derived point-cloud portrait.
 *
 * The source photograph is sampled on a staggered grid; each sample's weight
 * comes from a Sobel gradient (structure — glasses, hairline, lapels, facial
 * features) blended with luminance (form), then masked by a soft vignette so
 * the blurred corridor behind the subject dissolves instead of competing with
 * him. The result is the actual face, reconstructed from its own edges.
 *
 * Motion is deliberate and finite: one reconstruction on first view, then
 * cursor parallax weighted by brightness so the brighter foreground samples
 * travel further than the dim ones. The render loop stops entirely once the
 * portrait has resolved and the cursor is still — nothing animates at rest.
 * Under prefers-reduced-motion it paints the resolved state once and stops.
 *
 * Clicking the frame cross-fades to the photograph it was derived from, framed
 * on exactly the region the cloud samples; clicking again abstracts it back and
 * replays the reconstruction. It is a button, so this works from the keyboard.
 *
 * Swap the portrait by changing `src` — nothing else is image-specific.
 */

interface Particle {
  /** Resolved position, in CSS pixels. */
  tx: number;
  ty: number;
  /** Scatter origin for the reconstruction. */
  ox: number;
  oy: number;
  weight: number;
  size: number;
  /** 0–1, staggers the reconstruction outward from the centre. */
  delay: number;
}

const SRC = "/portrait.jpg";
/**
 * Crop of the source that holds head and shoulders, as fractions. Its aspect
 * matches the container's 4:5 so the sampling grid stays square.
 */
const CROP = { x: 0.13, y: 0.1, w: 0.74, h: 0.68 };
const REVEAL_MS = 1400;
/** height / width of the frame, matching the `aspect-[4/5]` wrapper. */
const CONTAINER_ASPECT = 5 / 4;

export function Portrait({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<(() => void) | null>(null);
  const [failed, setFailed] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [photoStyle, setPhotoStyle] = useState<CSSProperties>({ opacity: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      setFailed(true);
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // Sample density follows the canvas, not the viewport: a face needs a
    // roughly constant number of columns to stay legible, whether it is drawn
    // at 280px on a phone or 420px on a desktop. Touch devices get a coarser
    // target since they never drive the parallax loop.
    const targetColumns = coarse ? 96 : 120;

    /** Particles pre-partitioned by alpha, so a frame is one pass, not six. */
    let buckets: Particle[][] = [];
    let raf = 0;
    let start = 0;
    let running = false;
    let visible = true;
    let width = 0;
    let height = 0;
    let step = 3.6;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const image = new Image();
    image.decoding = "async";

    function build() {
      const rect = wrap!.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      step = Math.min(5.5, Math.max(2.4, width / targetColumns));

      const cols = Math.floor(width / step);
      const rows = Math.floor(height / step);
      if (cols < 8 || rows < 8) return;

      // Draw the crop into an offscreen buffer at sampling resolution, so the
      // browser does the scaling and we read one small ImageData.
      const buffer = document.createElement("canvas");
      buffer.width = cols;
      buffer.height = rows;
      const bctx = buffer.getContext("2d", { willReadFrequently: true });
      if (!bctx) return;

      bctx.drawImage(
        image,
        CROP.x * image.naturalWidth,
        CROP.y * image.naturalHeight,
        CROP.w * image.naturalWidth,
        CROP.h * image.naturalHeight,
        0,
        0,
        cols,
        rows,
      );

      const { data } = bctx.getImageData(0, 0, cols, rows);

      // Relative luminance, one value per sample.
      const lum = new Float32Array(cols * rows);
      for (let i = 0; i < cols * rows; i++) {
        const o = i * 4;
        lum[i] = (0.2126 * data[o] + 0.7152 * data[o + 1] + 0.0722 * data[o + 2]) / 255;
      }

      const next: Particle[] = [];
      const cx = cols / 2;
      // The subject sits above centre; anchor the vignette on him, not on the
      // frame, so the blurred corridor behind him falls away.
      const cy = rows * 0.4;
      const rx = cols * 0.55;
      const ry = rows * 0.68;
      // A second, tighter ellipse over the head — the face should be the
      // densest region of the cloud, not merely one edge field among many.
      const fx = cols * 0.27;
      const fy = rows * 0.25;
      const fcy = rows * 0.26;

      for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
          const i = y * cols + x;

          // Sobel magnitude — the structural term.
          const tl = lum[i - cols - 1];
          const tc = lum[i - cols];
          const tr = lum[i - cols + 1];
          const ml = lum[i - 1];
          const mr = lum[i + 1];
          const bl = lum[i + cols - 1];
          const bc = lum[i + cols];
          const br = lum[i + cols + 1];

          const gx = tr + 2 * mr + br - (tl + 2 * ml + bl);
          const gy = bl + 2 * bc + br - (tl + 2 * tc + tr);
          const edge = Math.min(1, Math.hypot(gx, gy) * 1.15);

          // Radial falloff, squared for a softer shoulder.
          const d = Math.min(1, Math.hypot((x - cx) / rx, (y - cy) / ry));
          const vignette = Math.pow(1 - d * d, 1.85);
          if (vignette <= 0.02) continue;

          const fd = Math.min(1, Math.hypot((x - cx) / fx, (y - fcy) / fy));
          const faceBoost = 1 + 0.55 * (1 - fd * fd);

          const weight =
            (edge * 0.72 + Math.max(0, lum[i] - 0.22) * 0.42) * vignette * faceBoost;
          if (weight < 0.055) continue;

          // Stagger every other row for a point cloud rather than a lattice.
          const px = (x + (y % 2 ? 0.5 : 0)) * step;
          const py = y * step;
          const angle = Math.random() * Math.PI * 2;
          const scatter = 40 + Math.random() * 90;

          next.push({
            tx: px,
            ty: py,
            ox: px + Math.cos(angle) * scatter,
            oy: py + Math.sin(angle) * scatter,
            weight: Math.min(1, weight),
            size: Math.max(0.7, step * (0.3 + Math.min(1, weight) * 0.42)),
            delay: Math.min(0.65, d * 0.65),
          });
        }
      }

      buckets = Array.from({ length: BUCKETS }, () => [] as Particle[]);
      for (const particle of next) {
        const index = Math.min(BUCKETS - 1, Math.floor(particle.weight * BUCKETS));
        buckets[index].push(particle);
      }
    }

    /** Alpha buckets: one fillStyle change per bucket instead of per dot. */
    const BUCKETS = 6;

    function paint(now: number) {
      if (!start) start = now;
      const t = reduced ? 1 : Math.min(1, (now - start) / REVEAL_MS);

      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      const settled =
        Math.abs(pointer.tx - pointer.x) < 0.05 && Math.abs(pointer.ty - pointer.y) < 0.05;

      ctx!.clearRect(0, 0, width, height);

      for (let b = 0; b < BUCKETS; b++) {
        const bucket = buckets[b];
        if (!bucket?.length) continue;

        const alpha = ((b + 0.5) / BUCKETS) * 0.92;
        ctx!.fillStyle = `rgba(233, 241, 236, ${alpha.toFixed(3)})`;

        for (let i = 0; i < bucket.length; i++) {
          const p = bucket[i];

          // Ease-out reconstruction, staggered outward from the face.
          const local = Math.max(0, Math.min(1, (t - p.delay) / (1 - p.delay)));
          if (local <= 0) continue;
          const e = 1 - Math.pow(1 - local, 3);

          let x = p.ox + (p.tx - p.ox) * e;
          let y = p.oy + (p.ty - p.oy) * e;

          if (!reduced) {
            // Brighter samples read as nearer, so they travel further.
            const depth = 0.4 + p.weight * 1.6;
            x += pointer.x * depth;
            y += pointer.y * depth;
          }

          const s = p.size * (e * 0.6 + 0.4);
          ctx!.fillRect(x, y, s, s);
        }
      }

      // Nothing animates at rest: the loop ends once the portrait has resolved
      // and the parallax has caught up with the cursor.
      if (reduced || (t >= 1 && (settled || !visible))) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(paint);
    }

    function loop() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(paint);
    }

    function onPointerMove(event: PointerEvent) {
      if (coarse || reduced) return;
      const rect = canvas!.getBoundingClientRect();
      // Normalised to a small displacement in CSS pixels.
      pointer.tx = ((event.clientX - (rect.left + rect.width / 2)) / rect.width) * 7;
      pointer.ty = ((event.clientY - (rect.top + rect.height / 2)) / rect.height) * 7;
      loop();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) loop();
      },
      { threshold: 0.05 },
    );

    let resizeTimer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Rebuilding means re-sampling the image, so only do it when the box
        // has genuinely changed size — not for every incidental resize event,
        // and never in a way that restarts a reconstruction already finished.
        const rect = wrap!.getBoundingClientRect();
        if (Math.abs(rect.width - width) < 24 && Math.abs(rect.height - height) < 24) return;
        const resolved = start !== 0 && performance.now() - start >= REVEAL_MS;
        build();
        if (resolved) start = performance.now() - REVEAL_MS;
        loop();
      }, 250);
    }

    image.onload = () => {
      build();
      observer.observe(wrap!);
      loop();

      // The photograph is positioned to show exactly the region the point
      // cloud samples, so the two states are the same framing of the same
      // face and the cross-fade reads as one image resolving into the other.
      const scale = 1 / CROP.w;
      const imageAspect = image.naturalHeight / image.naturalWidth;
      const heightOfBox = (scale * imageAspect) / CONTAINER_ASPECT;
      setPhotoStyle({
        width: `${scale * 100}%`,
        left: `${-CROP.x * scale * 100}%`,
        top: `${-CROP.y * heightOfBox * 100}%`,
        height: "auto",
      });

      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    };
    image.onerror = () => setFailed(true);
    image.src = SRC;

    // Lets the toggle re-run the reconstruction when the visitor switches back
    // from the photograph.
    replayRef.current = () => {
      start = 0;
      loop();
    };

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      observer.disconnect();
      replayRef.current = null;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  function toggle() {
    setShowPhoto((previous) => {
      // Returning to the cloud replays the reconstruction rather than snapping.
      if (previous) requestAnimationFrame(() => replayRef.current?.());
      return !previous;
    });
  }

  return (
    <div
      ref={wrapRef}
      className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-line bg-surface ${className}`}
    >
      {failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={SRC}
          alt="Rishikesh Patil"
          className="h-full w-full object-cover object-top opacity-90"
        />
      ) : (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={showPhoto}
          className="absolute inset-0 h-full w-full cursor-pointer"
        >
          <span className="sr-only">
            {showPhoto
              ? "Show the point-cloud portrait of Rishikesh Patil"
              : "Show the photograph of Rishikesh Patil"}
          </span>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={SRC}
            alt=""
            aria-hidden="true"
            style={photoStyle}
            className={`absolute max-w-none transition-[opacity,filter,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              showPhoto ? "scale-100 opacity-100 blur-0" : "scale-[1.03] opacity-0 blur-[6px]"
            }`}
          />

          <canvas
            ref={canvasRef}
            role="img"
            aria-label="Portrait of Rishikesh Patil, rendered as a point cloud derived from the edges of a photograph"
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
              showPhoto ? "opacity-0" : "opacity-100"
            }`}
          />

          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
          <span className="label pointer-events-none absolute bottom-3 left-4">
            {showPhoto ? "photograph · click to abstract" : "edge-derived · click to resolve"}
          </span>
        </button>
      )}
    </div>
  );
}
