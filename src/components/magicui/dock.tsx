import { cn } from "@/lib/utils";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

interface DockProps {
  className?: string;
  children: React.ReactNode;
}

type DockIconProps = ComponentPropsWithoutRef<"div">;

const SIZE = 40;
const ICON_SIZE = 20;

const Dock = ({ className, children }: DockProps) => {
  return (
    <div
      className={cn(
        "mx-auto overflow-visible rounded-none",
        className
      )}
    >
      {children}
    </div>
  );
};

const DockIcon = forwardRef<HTMLDivElement, DockIconProps>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ width: SIZE, height: SIZE, ...style }}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-none shrink-0 transition-colors",
          className
        )}
        {...props}
      >
        <div
          style={{ width: ICON_SIZE, height: ICON_SIZE }}
          className="flex items-center justify-center"
        >
          {children}
        </div>
      </div>
    );
  }
);
DockIcon.displayName = "DockIcon";

export { Dock, DockIcon };
export type { DockProps, DockIconProps };
