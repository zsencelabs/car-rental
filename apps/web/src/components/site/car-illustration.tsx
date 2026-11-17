import type { VehicleCategory, VehicleTint } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const TINT_CLASSES: Record<VehicleTint, string> = {
  sand: "bg-tint-sand text-[#6d806a]",
  sage: "bg-tint-sage text-[#678171]",
  mist: "bg-tint-mist text-[#647979]",
};

/** Roof height and body length per category, so the silhouettes differ a little. */
const SHAPES: Record<VehicleCategory, { roof: number; length: number }> = {
  hatchback: { roof: 30, length: 196 },
  sedan: { roof: 28, length: 224 },
  luxury: { roof: 27, length: 232 },
  suv: { roof: 40, length: 222 },
  van: { roof: 54, length: 226 },
};

interface CarIllustrationProps {
  category: VehicleCategory;
  tint: VehicleTint;
  label?: string;
  className?: string;
}

/**
 * Original, decorative side-profile car drawing used instead of photos
 * until real vehicle images are uploaded by providers.
 */
export function CarIllustration({ category, tint, label, className }: CarIllustrationProps) {
  const { roof, length } = SHAPES[category];
  const left = (260 - length) / 2;
  const right = left + length;
  const bodyTop = 70;
  const roofTop = bodyTop - roof;
  const cabinLeft = left + length * 0.24;
  const cabinRight = right - length * (category === "van" ? 0.06 : 0.2);

  return (
    <div
      className={cn("relative grid place-items-center overflow-hidden", TINT_CLASSES[tint], className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <div className="absolute -bottom-16 left-1/2 h-28 w-64 -translate-x-1/2 rounded-[50%] border border-white/60" />
      <svg viewBox="0 0 260 120" className="relative mt-3 w-[72%] max-w-[280px] drop-shadow-[0_9px_8px_rgba(50,71,59,0.13)]">
        <path
          d={`M${cabinLeft} ${bodyTop} L${cabinLeft + 18} ${roofTop} L${cabinRight - 14} ${roofTop} L${cabinRight} ${bodyTop} Z`}
          fill="#5d7d65"
        />
        <path
          d={`M${cabinLeft + 10} ${bodyTop - 4} L${cabinLeft + 22} ${roofTop + 6} L${cabinRight - 18} ${roofTop + 6} L${cabinRight - 8} ${bodyTop - 4} Z`}
          fill="#b9cbbd"
        />
        <rect x={left} y={bodyTop - 4} width={length} height="34" rx="16" fill="#5d7d65" />
        <rect x={left} y={bodyTop + 20} width={length} height="10" rx="5" fill="#4d6c56" />
        <rect x={left + 8} y={bodyTop + 4} width="14" height="8" rx="3" fill="#f4e9c8" />
        <circle cx={left + length * 0.22} cy={bodyTop + 30} r="15" fill="#364a3e" />
        <circle cx={left + length * 0.22} cy={bodyTop + 30} r="7" fill="#c5cec3" />
        <circle cx={right - length * 0.22} cy={bodyTop + 30} r="15" fill="#364a3e" />
        <circle cx={right - length * 0.22} cy={bodyTop + 30} r="7" fill="#c5cec3" />
      </svg>
    </div>
  );
}
