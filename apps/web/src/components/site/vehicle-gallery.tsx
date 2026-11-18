"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { VehicleImage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

export function VehicleGallery({ images, name }: { images: VehicleImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index];
  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-secondary">
        <AnimatePresence initial={false}>
          <motion.div
            key={current.src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 700px, 100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <span className="absolute top-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white capitalize backdrop-blur">
          {current.kind}
          {current.representative ? " · representative photo" : ""}
        </span>
        <span className="absolute right-3 bottom-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {index + 1} / {images.length}
        </span>
      </div>

      <ul className="mt-3 grid grid-cols-4 gap-2 sm:gap-3" aria-label={`${name} photos`}>
        {images.map((image, imageIndex) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-pressed={imageIndex === index}
              aria-label={`Show photo ${imageIndex + 1}: ${image.alt}`}
              className={cn(
                "relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-secondary ring-offset-2 ring-offset-background transition outline-none focus-visible:ring-3 focus-visible:ring-ring",
                imageIndex === index ? "ring-2 ring-primary" : "opacity-75 hover:opacity-100",
              )}
            >
              <Image src={image.src} alt="" fill sizes="160px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
