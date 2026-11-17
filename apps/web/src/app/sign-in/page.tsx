import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageContainer, PageIntro, PreviewNotice } from "@/components/site/page-intro";

export const metadata: Metadata = { title: "Portal sign in" };

export default function SignInPage() {
  return (
    <PageContainer>
      <PageIntro eyebrow="Portal" title="Sign in">
        <p>Customer, provider and driver accounts are coming with the next release.</p>
      </PageIntro>
      <div className="mt-8 max-w-3xl">
        <PreviewNotice>Sign-in isn&apos;t available in this preview.</PreviewNotice>
      </div>
      <Button asChild variant="outline" className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </PageContainer>
  );
}
