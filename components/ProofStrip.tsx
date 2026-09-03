import { proof } from "@/lib/content";
import { Reveal } from "./Reveal";

export function ProofStrip() {
  return (
    <Reveal>
      <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:mt-24 lg:grid-cols-5">
        {proof.map((item, i) => (
          <div
            key={item.label}
            // Five items into two columns leaves a hole; the last one fills it.
            className={`bg-bg px-5 py-6 ${
              i === proof.length - 1 && proof.length % 2 === 1 ? "max-lg:col-span-2" : ""
            }`}
          >
            <p className="label">{item.label}</p>
            <p className="mt-2 text-lg font-medium tracking-tight text-fg">{item.value}</p>
            <p className="mt-1 text-[0.8rem] leading-snug text-subtle">{item.detail}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
