"use client";
import { useEffect, useState, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * A floating Scroll-To-Top button.
 * Appears after user scrolls down a threshold (default 300px) and
 * smooth-scrolls to the top when activated.
 */
export function ScrollToTop({ threshold = 300 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);

  const onScroll = useCallback(() => {
    const y = window.scrollY || document.documentElement.scrollTop;
    setVisible(y > threshold);
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div aria-live="polite">
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={handleClick}
        className={cn(
          buttonVariants({ variant: "secondary", size: "icon" }),
          "fixed bottom-5 right-5 z-50 shadow-md transition-opacity duration-300 focus-visible:ring-offset-background", 
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <ArrowUp className="h-5 w-5" />
        <span className="sr-only">Scroll to top</span>
      </button>
    </div>
  );
}
