"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageIntro } from "@/components/site/page-intro";

export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    // Surface the error in the console until an error-monitoring service is chosen.
    console.error(error);
  }, [error]);

  return (
    <PageContainer>
      <PageIntro eyebrow="Something went wrong" title="We hit a bump in the road">
        <p>Please try again. If the problem continues, contact support.</p>
      </PageIntro>
      <Button className="mt-6" onClick={() => retry()}>
        Try again
      </Button>
    </PageContainer>
  );
}
