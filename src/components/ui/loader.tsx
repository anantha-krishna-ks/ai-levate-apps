import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

export function PageLoader({
  message = "Loading…",
  className,
  fullScreen = false,
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-slate-600",
        fullScreen ? "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm" : "py-12",
        className,
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      {message ? <p className="text-sm font-medium">{message}</p> : null}
    </div>
  );
}

export default PageLoader;