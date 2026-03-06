import * as React from "react";

/**
 * Hook to prevent Radix UI from locking the body scroll/pointer-events
 * if a component is unmounted during a closing animation.
 */
export function useRadixScrollLockFix() {
    React.useEffect(() => {
        // Monitor for changes to document.body.style
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "style") {
                    const body = document.body;

                    // If body has pointer-events: none but no radix portals are present
                    // we force set it back to auto after a short delay.
                    if (body.style.pointerEvents === "none") {
                        const hasPortals = !!document.querySelector("[data-radix-portal]");
                        if (!hasPortals) {
                            // Delay slightly to allow normal transitions to finish
                            setTimeout(() => {
                                const stillNoPortals = !!document.querySelector("[data-radix-portal]");
                                if (!stillNoPortals && body.style.pointerEvents === "none") {
                                    console.warn("Radix lock detected without portals, fixing...");
                                    body.style.pointerEvents = "";
                                    body.style.overflow = "";
                                    body.style.paddingRight = "";
                                }
                            }, 300);
                        }
                    }
                }
            });
        });

        observer.observe(document.body, { attributes: true });

        return () => observer.disconnect();
    }, []);
}
