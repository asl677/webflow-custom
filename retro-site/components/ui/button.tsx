import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva("win95-button", {
  variants: {
    variant: {
      default: "",
      destructive: "",
      outline: "",
      secondary: "",
      ghost: "!bg-transparent !border-none hover:!bg-win95-hover",
      link: "!bg-transparent !border-none !text-win95-titlebar underline-offset-4 hover:underline",
    },
    size: {
      default: "h-6 px-2 py-1",
      sm: "h-5 px-1.5 py-0.5",
      lg: "h-8 px-3 py-1.5",
      icon: "w-6 h-6 p-1",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { Button, buttonVariants }
