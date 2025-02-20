import { cn } from "@/lib/utils"
import { SignIn } from "@clerk/clerk-react"
import { Link } from "react-router-dom"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center space-y-2 text-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-12 h-12 border-2 border-black rounded-xl">
            <div className="flex items-center">
              <span className="text-[#6D6C71] text-2xl font-bold leading-none">T</span>
              <span className="text-[#ED2831] text-2xl font-bold leading-none">M</span>
            </div>
          </div>
        </Link>
      </div>

      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-primary hover:bg-primary/90 text-primary-foreground",
            card: "border border-input shadow-sm",
            headerTitle: "text-2xl font-semibold tracking-tight",
            headerSubtitle: "text-sm text-muted-foreground",
            socialButtonsBlockButton: "border-2 border-dashed hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[4px_4px_0px_#4d4d4f] hover:rounded-md transition-all duration-300",
            formFieldLabel: "text-sm font-medium leading-none",
            formFieldInput: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            footerActionLink: "text-primary hover:underline font-medium",
            dividerLine: "bg-muted",
            dividerText: "text-xs text-muted-foreground bg-background px-2",
          },
          layout: {
            socialButtonsPlacement: "bottom",
            termsPageUrl: "/terms",
            privacyPageUrl: "/privacy"
          }
        }}
      />
    </div>
  )
}
