import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  message?: string;
  /** Alias for `message` (legacy prop). */
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

export function PageLoader({
  message,
  text,
  className,
  fullScreen = false,
}: PageLoaderProps) {
  const label = message ?? text ?? "Loading…";
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-slate-600",
        fullScreen ? "fixed inset-0 z-50 bg-white/80 backdrop-blur-sm" : "py-12",
        className,
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      {label ? <p className="text-sm font-medium">{label}</p> : null}
    </div>
  );
}

export default PageLoader;