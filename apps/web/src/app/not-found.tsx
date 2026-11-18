import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageContainer, PageIntro } from "@/components/site/page-intro";

export default function NotFound() {
  return (
    <PageContainer>
      <PageIntro eyebrow="404" title={<>This road <em className="heading-accent">goes nowhere.</em></>}>
        <p>We couldn&apos;t find that page or car.</p>
      </PageIntro>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/cars">Browse cars</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Home</Link>
        </Button>
      </div>
    </PageContainer>
  );
}
