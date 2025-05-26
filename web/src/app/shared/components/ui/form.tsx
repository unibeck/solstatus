import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { Label } from "@/app/shared/components/ui/label"
import { cn } from "@/lib/utils"

// Simple form wrapper - just a div with form styling
const Form = React.forwardRef<
  HTMLFormElement,
  React.HTMLAttributes<HTMLFormElement>
>(({ className, ...props }, ref) => (
  <form ref={ref} className={cn("space-y-6", className)} {...props} />
))
Form.displayName = "Form"

// Simple form item wrapper
function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-2", className)} {...props} />
}

// Simple form label - just wraps the Label component
function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className,
      )}
      {...props}
    />
  )
}

// Simple form control wrapper
function FormControl({
  className,
  ...props
}: React.ComponentProps<typeof Slot>) {
  return <Slot className={className} {...props} />
}

// Simple form description
function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

// Enhanced form message with variants
interface FormMessageProps extends React.ComponentProps<"p"> {
  variant?: "destructive" | "success" | "warning"
}

function FormMessage({
  className,
  children,
  variant = "destructive",
  ...props
}: FormMessageProps) {
  if (!children) {
    return null
  }

  const variants = {
    destructive: "bg-red-50 text-red-700 border-red-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  }

  return (
    <p
      className={cn(
        "text-sm p-3 rounded-md border",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage }
