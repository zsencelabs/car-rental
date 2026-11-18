import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PreviewNotice } from "@/components/site/page-intro";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image src="/images/story/self-drive-road.jpg" alt="" fill sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(15,30,22,0.85)] to-[rgba(15,30,22,0.2)]" />
        <p className="absolute right-10 bottom-10 left-10 text-3xl font-semibold tracking-[-0.03em] text-white">
          Welcome back. <em className="font-[family-name:var(--font-accent)] font-normal text-[#cfe0d2]">The road is waiting.</em>
        </p>
      </div>
      <div className="flex items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-sm">
          <p className="eyebrow">Your account</p>
          <h1 className="section-title mt-3">Log in</h1>
          <p className="mt-2 text-sm text-muted-foreground">For customers, vehicle providers and drivers.</p>
          <form className="mt-8 space-y-4" aria-describedby="login-notice">
            <fieldset disabled className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" className="mt-1.5 h-11" />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="current-password" className="mt-1.5 h-11" />
              </div>
              <Button type="submit" className="h-11 w-full">
                Log in
              </Button>
            </fieldset>
          </form>
          <div id="login-notice" className="mt-6">
            <PreviewNotice>Accounts open with the next release. Sign-in is disabled in this preview.</PreviewNotice>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            New to KAIYA?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
