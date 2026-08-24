"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { SRGBColorSpace, VideoTexture, Vector2, Vector3 } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { TexturePass } from "three/examples/jsm/postprocessing/TexturePass.js";
import {
  FabricShader,
  FABRIC_SHADER_DEFAULTS,
  type FabricShaderUniforms,
} from "./fabric-shader";

type Knobs = Partial<FabricShaderUniforms>;

/**
 * The whole pipeline, with no meshes of our own:
 *
 *   <video> -> THREE.VideoTexture -> EffectComposer
 *              -> TexturePass (draws the frame full-screen)
 *              -> ShaderPass  (FabricShader)
 *              -> OutputPass  (linear -> sRGB)
 *              -> <Canvas>
 */
function FabricComposer({
  video,
  knobs,
}: {
  video: HTMLVideoElement;
  knobs: Knobs;
}) {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);

  const { composer, shaderPass } = useMemo(() => {
    const texture = new VideoTexture(video);
    texture.colorSpace = SRGBColorSpace;

    const composer = new EffectComposer(gl);
    composer.addPass(new TexturePass(texture));

    const shaderPass = new ShaderPass(FabricShader);
    composer.addPass(shaderPass);
    composer.addPass(new OutputPass());

    return { composer, shaderPass, texture };
  }, [gl, video]);

  // Tear the composer down with the component, not with every knob change.
  useEffect(() => {
    return () => {
      composer.dispose();
    };
  }, [composer]);

  useEffect(() => {
    const pixelRatio = Math.min(viewport.dpr, 2);
    composer.setPixelRatio(pixelRatio);
    composer.setSize(size.width, size.height);
    shaderPass.uniforms.uResolution.value = new Vector2(
      size.width * pixelRatio,
      size.height * pixelRatio,
    );

    // Cover-fit: crop the axis the container has too much of.
    const applyCover = () => {
      const media = video.videoWidth / video.videoHeight;
      const frame = size.width / size.height;
      if (!Number.isFinite(media) || media <= 0) return;
      shaderPass.uniforms.uCover.value =
        media > frame
          ? new Vector2(frame / media, 1)
          : new Vector2(1, media / frame);
    };

    applyCover();
    video.addEventListener("loadedmetadata", applyCover);
    return () => video.removeEventListener("loadedmetadata", applyCover);
  }, [composer, shaderPass, size.width, size.height, viewport.dpr, video]);

  useEffect(() => {
    const merged = { ...FABRIC_SHADER_DEFAULTS, ...knobs };
    const { uniforms } = shaderPass;
    uniforms.uGridSize.value = merged.uGridSize;
    uniforms.uDotSize.value = merged.uDotSize;
    uniforms.uContrast.value = merged.uContrast;
    uniforms.uBrightness.value = merged.uBrightness;
    uniforms.uEffectStrength.value = merged.uEffectStrength;
    uniforms.uDither.value = merged.uDither;
    uniforms.uGrain.value = merged.uGrain;
    uniforms.uAngle.value = merged.uAngle;
    uniforms.uColor.value = new Vector3(...merged.uColor);
    uniforms.uPaper.value = new Vector3(...merged.uPaper);
  }, [shaderPass, knobs]);

  // Priority >= 1 takes the render loop away from r3f's default renderer.
  useFrame((_, delta) => {
    shaderPass.uniforms.uTime.value += delta;
    composer.render(delta);
  }, 1);

  return null;
}

export type ShaderFilmProps = {
  src: string;
  poster?: string;
  className?: string;
  /** Any subset of the shader uniforms; the rest fall back to the defaults. */
  knobs?: Knobs;
};

export function ShaderFilm({ src, poster, className = "", knobs }: ShaderFilmProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    // Some browsers refuse the autoplay attribute but allow a muted play().
    const start = () => {
      void element.play().catch(() => undefined);
      setVideo(element);
    };

    if (element.readyState >= 2) {
      start();
    } else {
      element.addEventListener("loadeddata", start, { once: true });
      return () => element.removeEventListener("loadeddata", start);
    }
  }, []);

  const memoKnobs = useMemo(() => knobs ?? {}, [knobs]);

  return (
    <div className={`relative overflow-hidden bg-ink-900 ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        // Source only — the processed result is what gets shown.
        className="pointer-events-none absolute h-px w-px opacity-0"
      />

      {video && (
        <Canvas
          className="absolute inset-0"
          gl={{ antialias: false, alpha: false }}
          dpr={[1, 2]}
          orthographic
          camera={{ position: [0, 0, 1] }}
        >
          <FabricComposer video={video} knobs={memoKnobs} />
        </Canvas>
      )}
    </div>
  );
}
