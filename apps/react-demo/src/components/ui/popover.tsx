import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

function PopoverContent({
    className,
    align = "start",
    sideOffset = 6,
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    // layout
                    "z-50 min-w-44 rounded-lg p-3 outline-none",
                    // theme — references :root CSS vars so they work inside the portal
                    "border",
                    // animation via Radix data attributes
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
                    className,
                )}
                style={{
                    background: "var(--surface-2)",
                    borderColor: "rgba(255,255,255,0.12)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                    color: "var(--text)",
                    fontFamily: '"IBM Plex Mono", monospace',
                    fontSize: "12px",
                }}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
}

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent };
