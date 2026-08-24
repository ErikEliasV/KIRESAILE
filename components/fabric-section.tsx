import { ShaderFilm } from "@/components/shader-film";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/reveal";
import { versioned } from "@/lib/asset-version";

const SPECS = [
  { label: "Mill", value: "Biella, Italy" },
  { label: "Weight", value: "340 gsm" },
  { label: "Weave", value: "Double-faced twill" },
  { label: "Run", value: "120 metres" },
];

/**
 * The fabric well. The source video is never shown — what fills this section is
 * the same frames rebuilt as halftone dots on paper by the fragment shader.
 */
export function FabricSection() {
  return (
    <section className="bg-cream-200 px-[var(--page-pad-x)] py-16">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading tone="accent" script="in motion">
            The cloth
          </SectionHeading>
          <p className="max-w-[280px] text-ink-500">
            Filmed on the roll before it was cut. Rendered here one dot at a
            time, in real time.
          </p>
        </div>

        <Reveal className="border-2 border-blue-600 bg-cream-100 p-3">
          <div className="relative">
            <ShaderFilm
              src={versioned("/media/video_tecido.mp4")}
              className="aspect-[16/10] w-full md:aspect-[21/9]"
              knobs={{
                uGridSize: 7,
                uDotSize: 1.3,
                uContrast: 1.5,
                uBrightness: 0.04,
                uDither: 0.45,
                uGrain: 0.1,
                uAngle: 0.4,
                uEffectStrength: 1,
                uColor: [0x1b / 255, 0x1b / 255, 0xe0 / 255],
                uPaper: [0xfb / 255, 0xf9 / 255, 0xf3 / 255],
              }}
            />
            <span className="kire-label absolute top-4 left-4 bg-cream-100 px-2 py-1 text-blue-600">
              / Fabric
            </span>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-px border-t border-line-200 pt-3 md:grid-cols-4">
            {SPECS.map((spec) => (
              <div key={spec.label} className="flex flex-col gap-1 px-1">
                <dt className="kire-label text-ink-300">{spec.label}</dt>
                <dd className="text-[14px] font-semibold text-ink-900">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
