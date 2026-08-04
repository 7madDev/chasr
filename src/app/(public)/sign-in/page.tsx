import { Suspense } from "react";
import { SignInForm } from "./SignInForm";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-sm mx-auto px-4 py-24 text-center">
          <div className="animate-pulse text-muted-foreground/70 text-sm">Loading...</div>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
