import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl border-2 border-dashed font-medium transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px] hover:border-[#4d4d4f] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground hover:shadow-[4px_4px_0px_hsl(var(--primary))] hover:border-white",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:shadow-[4px_4px_0px_hsl(var(--destructive))]",
        outline:
          "border-input bg-background text-foreground hover:shadow-[4px_4px_0px_#4d4d4f]",
        secondary:
          "border-secondary bg-secondary text-secondary-foreground hover:shadow-[4px_4px_0px_hsl(var(--secondary))]",
        ghost: "border-transparent hover:bg-accent hover:text-accent-foreground",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-9 rounded-xl px-4 text-xs hover:rounded-md",
        lg: "h-12 rounded-2xl px-8 hover:rounded-lg",
        icon: "h-9 w-9 rounded-xl hover:rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
