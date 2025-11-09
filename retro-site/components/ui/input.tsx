import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-white text-black border-2 border-t-win95-border-inset border-l-win95-border-inset border-r-white border-b-white font-sans text-xs w-full px-1 py-0.5 outline-none focus:outline-dotted focus:outline-1 focus:outline-black focus:outline-offset-[-3px] disabled:bg-win95-window disabled:text-win95-border-inset disabled:cursor-not-allowed h-11",
        className,
      )}
      {...props}
    />
  )
}

export { Input }
