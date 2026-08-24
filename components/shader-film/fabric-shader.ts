import { Vector2, Vector3 } from "three";

/**
 * KIRESAILE fabric shader.
 *
 * Turns a video frame into a printed-cloth surface: the frame is snapped to a
 * rotated lattice (pixelisation), each cell becomes a halftone dot whose radius
 * tracks the cell's luminance, and an 8x8 ordered-Bayer threshold plus film
 * grain break the dot sizes up so the result reads as ink on paper rather than
 * as a clean CSS effect.
 *
 * Every knob is a uniform. Sensible ranges are noted next to each default.
 */
export const FABRIC_SHADER_DEFAULTS = {
  /** Lattice cell size, in device pixels. Smaller = finer print. 3–24. */
  uGridSize: 40,
  /** Dot radius multiplier, relative to the cell. 0–1.6. */
  uDotSize: 1.25,
  /** Luminance contrast around mid-grey. 0.5–3. */
  uContrast: 1.45,
  /** Luminance offset. -0.5–0.5. */
  uBrightness: 0.09,
  /** Crossfade between the raw video and the processed one. 0–1. */
  uEffectStrength: 1,
  /** Ordered-dither amount mixed into the threshold. 0–1. */
  uDither: 0.42,
  /** Animated grain amount. 0–0.4. */
  uGrain: 0.09,
  /** Lattice rotation, in radians. 0.4 ≈ the classic 23° screen angle. */
  uAngle: 0.4,
  /** Ink colour — the dots. */
  uColor: [0x0b / 255, 0x0b / 255, 0x0b / 255] as [number, number, number],
  /** Paper colour — what sits behind the dots. */
  uPaper: [0xf6 / 255, 0xf2 / 255, 0xe9 / 255] as [number, number, number],
};

export type FabricShaderUniforms = typeof FABRIC_SHADER_DEFAULTS;

export const FabricShader = {
  name: "FabricShader",

  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: new Vector2(1, 1) },
    // Cover-fit crop, so the source keeps its aspect inside any container.
    uCover: { value: new Vector2(1, 1) },
    uGridSize: { value: FABRIC_SHADER_DEFAULTS.uGridSize },
    uDotSize: { value: FABRIC_SHADER_DEFAULTS.uDotSize },
    uContrast: { value: FABRIC_SHADER_DEFAULTS.uContrast },
    uBrightness: { value: FABRIC_SHADER_DEFAULTS.uBrightness },
    uEffectStrength: { value: FABRIC_SHADER_DEFAULTS.uEffectStrength },
    uDither: { value: FABRIC_SHADER_DEFAULTS.uDither },
    uGrain: { value: FABRIC_SHADER_DEFAULTS.uGrain },
    uAngle: { value: FABRIC_SHADER_DEFAULTS.uAngle },
    uColor: { value: new Vector3(...FABRIC_SHADER_DEFAULTS.uColor) },
    uPaper: { value: new Vector3(...FABRIC_SHADER_DEFAULTS.uPaper) },
  },

  vertexShader: /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2  uResolution;
    uniform vec2  uCover;
    uniform float uTime;
    uniform float uGridSize;
    uniform float uDotSize;
    uniform float uContrast;
    uniform float uBrightness;
    uniform float uEffectStrength;
    uniform float uDither;
    uniform float uGrain;
    uniform float uAngle;
    uniform vec3  uColor;
    uniform vec3  uPaper;

    varying vec2 vUv;

    // 2x2 Bayer cell, recursed twice into an 8x8 ordered-dither matrix.
    float bayer2(vec2 a) {
      a = floor(a);
      return fract(a.x * 0.5 + a.y * a.y * 0.75);
    }
    float bayer4(vec2 a) { return bayer2(a * 0.5) * 0.25 + bayer2(a); }
    float bayer8(vec2 a) { return bayer4(a * 0.5) * 0.25 + bayer2(a); }

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    vec2 rotate(vec2 p, float angle) {
      float c = cos(angle);
      float s = sin(angle);
      return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    }

    // Named "relativeLuma", not "luminance" — three.js's WebGLProgram always
    // injects its own luminance(const in vec3) into the fragment prefix
    // (for tone mapping), and redeclaring it fails to compile.
    float relativeLuma(vec3 c) {
      return dot(c, vec3(0.2126, 0.7152, 0.0722));
    }

    // Screen uv -> source uv, cropped to cover without stretching.
    vec2 cover(vec2 uv) {
      return clamp((uv - 0.5) * uCover + 0.5, 0.0, 1.0);
    }

    void main() {
      vec3 raw = texture2D(tDiffuse, cover(vUv)).rgb;

      // --- pixelise: snap to a rotated lattice, one sample per cell ---------
      float cellPx = max(uGridSize, 1.0);
      vec2 pixel = vUv * uResolution;
      vec2 lattice = rotate(pixel, uAngle) / cellPx;
      vec2 cell = floor(lattice);
      vec2 inCell = fract(lattice) - 0.5;

      vec2 centre = rotate((cell + 0.5) * cellPx, -uAngle) / uResolution;
      vec3 sampled = texture2D(tDiffuse, cover(clamp(centre, 0.0, 1.0))).rgb;

      // --- tone: contrast around mid-grey, then lift ------------------------
      float shade = relativeLuma(sampled);
      shade = (shade - 0.5) * uContrast + 0.5 + uBrightness;

      // --- break the tone up with ordered dither + animated grain -----------
      float ordered = bayer8(cell) / 0.9844;
      shade += (ordered - 0.5) * uDither;
      shade += (hash(cell + floor(uTime * 24.0)) - 0.5) * uGrain;
      shade = clamp(shade, 0.0, 1.0);

      // --- halftone: dot radius tracks darkness ----------------------------
      // Named "dotDistance", not "distance" — that shadows the GLSL builtin
      // and fails to compile under ANGLE (Windows Chrome).
      float dotDistance = length(inCell);
      float radius = (1.0 - shade) * uDotSize * 0.5;
      float edge = fwidth(dotDistance) + 0.02;
      float ink = 1.0 - smoothstep(radius - edge, radius + edge, dotDistance);

      vec3 printed = mix(uPaper, uColor, ink);

      gl_FragColor = vec4(mix(raw, printed, clamp(uEffectStrength, 0.0, 1.0)), 1.0);
    }
  `,
};
