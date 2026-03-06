import { Outlet, useNavigate } from "react-router-dom";
import { AppIcon } from "@/components/icons/AppIcon";
import { ChatComposer } from "@/components/chat/ChatComposer";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { GLOBAL_IMAGE_URL } from "@/lib/constants";

export default function AuthLayout() {
    const navigate = useNavigate();
    const { resolvedTheme } = useTheme();
    const [prompt, setPrompt] = useState("");
    const [placeholder, setPlaceholder] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    const phrases = [
        "escrever um email...",
        "criar um roteiro...",
        "gerar uma copy...",
        "corrigir um texto...",
        "planejar uma campanha..."
    ];

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % phrases.length;
            const fullText = "Peça para o Opendraft " + phrases[i];

            setPlaceholder(isDeleting
                ? fullText.substring(0, placeholder.length - 1)
                : fullText.substring(0, placeholder.length + 1)
            );

            setTypingSpeed(isDeleting ? 30 : 50); // Faster deleting

            if (!isDeleting && placeholder === fullText) {
                setTimeout(() => setIsDeleting(true), 2000); // Pause at end
            } else if (isDeleting && placeholder === "Peça para o Opendraft ") {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [placeholder, isDeleting, loopNum, typingSpeed]);

    const handlePromptSubmit = () => {
        navigate(`/signup?prompt=${encodeURIComponent(prompt)}`);
    };

    return (
        <div className="flex min-h-screen w-full bg-background font-sans antialiased text-foreground">
            {/* Left Side: Form Container */}
            <div className="flex w-full flex-col justify-between px-6 py-8 lg:w-1/2 lg:px-12 xl:px-24">
                {/* Form Content (Outlet) */}
                <div className="flex flex-1 flex-col justify-center py-12">
                    <Outlet />
                </div>


            </div>

            {/* Right Side: Hero (Hidden on mobile) */}
            <div className="hidden w-1/2 bg-background p-4 lg:block">
                <div className="relative h-full w-full overflow-hidden rounded-3xl z-0 text-slate-900 dark:text-white selection:bg-blue-100 selection:text-blue-900 transition-colors duration-500">
                    {/* Base Background Image (Original) */}
                    <div className="absolute inset-0 -z-20 bg-muted transition-colors duration-500">
                        <img
                            src={GLOBAL_IMAGE_URL}
                            alt="Background"
                            className="h-full w-full object-cover transition-opacity duration-500"
                        />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative flex h-full w-full flex-col items-center justify-center p-12 text-center z-10">
                        <div className="w-full max-w-xl relative">
                            {/* Overlay to block interaction */}
                            <div className="absolute inset-0 z-50 cursor-default" />
                            <div className="pointer-events-none select-none">
                                <ChatComposer
                                    value=""
                                    onChange={() => { }}
                                    onSubmit={() => { }}
                                    uiVariant="hero"
                                    placeholder={placeholder}
                                    forceActiveStyle={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
