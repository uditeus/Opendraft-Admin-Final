import { createRoot } from "react-dom/client";
import { GlobalError } from "./components/GlobalError.tsx";
import App from "./App.tsx";
import "./index.css";

import { ChatStoreProvider } from "@/components/chat/store";
import { BackgroundSettingsProvider } from "@/components/chat/background-settings";
import { AuthProvider } from "@/components/auth/AuthProvider";

createRoot(document.getElementById("root")!).render(
  <GlobalError>
    <AuthProvider>
      <BackgroundSettingsProvider>
        <ChatStoreProvider>
          <App />
        </ChatStoreProvider>
      </BackgroundSettingsProvider>
    </AuthProvider>
  </GlobalError>,
);

