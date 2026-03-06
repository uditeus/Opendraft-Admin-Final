import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppIcon } from "@/components/icons/AppIcon";
import { cn } from "@/lib/utils";

interface SelectionToolbarProps {
  onAction?: (action: string, text: string) => void;
}

export function SelectionToolbar({ onAction }: SelectionToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [selectionRects, setSelectionRects] = useState<{
    toolbar: { top: number; left: number };
    startHandle: { top: number; left: number; height: number };
    endHandle: { top: number; left: number; height: number };
  } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const toolbarRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const selection = window.getSelection();
    const activeEl = document.activeElement;

    // EXCLUDE Textarea/Input selection: User requested to hide handles in composer
    if (activeEl instanceof HTMLTextAreaElement || activeEl instanceof HTMLInputElement) {
      setIsVisible(false);
      setShowToolbar(false);
      return;
    }

    // Normal DOM selection
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setIsVisible(false);
      setShowToolbar(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rects = range.getClientRects();
    if (rects.length === 0) return;

    const firstRect = rects[0];
    const lastRect = rects[rects.length - 1];
    const boundingPect = range.getBoundingClientRect();

    const container = range.commonAncestorContainer;
    const element = container.nodeType === 1 ? (container as Element) : container.parentElement;

    // Ensure the element is still in the document (prevents ghost handles on navigation)
    if (!element || !document.contains(element)) {
      setIsVisible(false);
      setShowToolbar(false);
      return;
    }

    const isInsideDocument = !!element?.closest('[data-selection-area="document"]');
    const isInsideChat = !!element?.closest('[data-selection-area="chat"]');

    // ONLY show handles if we are in a designated selectable area
    if (!isInsideDocument && !isInsideChat) {
      setIsVisible(false);
      setShowToolbar(false);
      return;
    }

    setSelectedText(selection.toString().trim());

    setSelectionRects({
      toolbar: {
        top: boundingPect.top - 54,
        left: boundingPect.left + boundingPect.width / 2,
      },
      startHandle: {
        top: firstRect.top,
        left: firstRect.left,
        height: firstRect.height,
      },
      endHandle: {
        top: lastRect.top,
        left: lastRect.right,
        height: lastRect.height,
      }
    });

    setIsVisible(true);
    setShowToolbar(isInsideDocument);
  }, []);

  useEffect(() => {
    const handleEvent = () => {
      requestAnimationFrame(updatePosition);
    };

    const handleMouseDown = () => {
      // Hide immediately on click to prevent staled handles
      setIsVisible(false);
    };

    document.addEventListener("selectionchange", handleEvent);
    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("scroll", handleEvent, true);
    window.addEventListener("resize", handleEvent);

    return () => {
      document.removeEventListener("selectionchange", handleEvent);
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("scroll", handleEvent, true);
      window.removeEventListener("resize", handleEvent);
    };
  }, [updatePosition]);

  return (
    <AnimatePresence>
      {isVisible && selectionRects && (
        <>
          {/* Handles (Hastes Azuis) - Only for normal text, not inputs */}
          <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: selectionRects.startHandle.top,
                left: selectionRects.startHandle.left,
                height: selectionRects.startHandle.height,
              }}
              className="flex flex-col items-center"
            >
              <div className="absolute -top-[2px] h-2.5 w-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
              <div className="h-full w-[2px] bg-[#3b82f6]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: selectionRects.endHandle.top,
                left: selectionRects.endHandle.left,
                height: selectionRects.endHandle.height,
              }}
              className="flex flex-col items-center"
            >
              <div className="h-full w-[2px] bg-[#3b82f6]" />
              <div className="absolute -bottom-[2px] h-2.5 w-2.5 rounded-full bg-[#3b82f6] shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
            </motion.div>
          </div>

          {/* Action Toolbar - Only in Document */}
          {showToolbar && (
            <motion.div
              ref={toolbarRef}
              initial={{ opacity: 0, scale: 0.95, y: 10, x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: 10, x: "-50%" }}
              style={{
                position: "fixed",
                top: selectionRects.toolbar.top,
                left: selectionRects.toolbar.left,
                zIndex: 10000,
              }}
              className="flex items-center overflow-hidden rounded-full border border-white/[0.08] bg-[#1c1c1e] p-0.5 shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
            >
              <button
                onClick={() => {
                  onAction?.("edit", selectedText);
                  setIsVisible(false);
                  setShowToolbar(false);
                }}
                className="flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-semibold text-white transition-all hover:bg-white/[0.05] active:scale-[0.98]"
              >
                <AppIcon name="ArrowRight02Icon" className="h-3.5 w-3.5 text-white/90" />
                <span>Editar no Chat</span>
              </button>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
