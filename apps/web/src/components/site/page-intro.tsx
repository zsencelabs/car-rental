import type { ReactNode } from "react";

interface PageIntroProps {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}

/** Shared heading block for content pages. */
export function PageIntro({ eyebrow, title, children }: PageIntroProps) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="section-title mt-3">{title}</h1>
      {children ? <div className="mt-4 text-base leading-relaxed text-muted-foreground">{children}</div> : null}
    </div>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-[1180px] px-4 py-14 sm:px-6 md:py-20">{children}</div>;
}

export function PreviewNotice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-[#eadfc3] bg-surface-cream px-4 py-3 text-sm text-[#6f5a32]">
      {children}
    </p>
  );
}
