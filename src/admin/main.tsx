import { createRoot } from "react-dom/client";
import { GlobalError } from "../components/GlobalError.tsx";
import { AdminApp } from "./AdminApp.tsx";
import "../index.css";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <GlobalError>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                disableTransitionOnChange
                storageKey="lovable-chat-theme"
            >
                <AuthProvider>
                    <AdminApp />
                </AuthProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </GlobalError>,
);
