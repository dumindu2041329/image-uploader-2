import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary/80 hover:shadow-md hover:shadow-primary/30",
        secondary: "border-transparent bg-secondary/80 text-secondary-foreground backdrop-blur-sm hover:bg-secondary/60",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm shadow-destructive/25 hover:bg-destructive/80",
        outline: "text-foreground border-border/50 bg-background/50 backdrop-blur-sm",
        glass: "border-border/30 bg-background/30 backdrop-blur-md text-foreground hover:bg-background/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
