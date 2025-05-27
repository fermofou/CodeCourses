import { SignUpForm } from "@/components/signup-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      <div className="relative flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[400px] space-y-6">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
