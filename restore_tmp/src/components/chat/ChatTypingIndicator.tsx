import { TextShimmer } from "@/components/ui/text-shimmer";

export function ChatTypingIndicator({ mode }: { mode?: string }) {
  return (
    <TextShimmer mode={mode} />
  );
}
