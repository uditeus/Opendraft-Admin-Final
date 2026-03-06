import * as React from "react";
import { useNavigate } from "react-router-dom";

import { useChatStore } from "@/components/chat/store";
import { AppIcon } from "@/components/icons/AppIcon";

export default function NewPage() {
  const navigate = useNavigate();
  const store = useChatStore();

  React.useEffect(() => {
    const run = async () => {
      const id = await store.createThread();
      navigate(`/chat/${id}`, { replace: true });
    };
    run();
  }, [navigate, store]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background" />
  );
}
