import React from "react";
import { Button } from "@/components/ui/button";

export class GlobalError extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background p-4 text-center text-foreground">
                    <h1 className="text-2xl font-bold">Oops! Algo deu errado.</h1>
                    <p className="max-w-md text-muted-foreground">
                        {this.state.error?.message || "Ocorreu um erro inesperado."}
                    </p>
                    <Button onClick={() => window.location.reload()}>Recarregar Página</Button>
                    <div className="mt-8 max-w-lg overflow-auto rounded-lg bg-muted p-4 text-left font-mono text-xs">
                        {this.state.error?.stack}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
