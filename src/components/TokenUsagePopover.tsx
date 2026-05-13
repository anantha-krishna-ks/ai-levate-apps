import { Coins, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TokenUsagePopoverProps {
  used?: number;
  total?: number;
  scopeLabel?: string;
}

const TokenUsagePopover = ({ used = 5349, total = 10000, scopeLabel = "This course" }: TokenUsagePopoverProps) => {
  const pct = Math.max(0, Math.min(100, Math.round((used / total) * 100)));
  const remaining = Math.max(0, total - used);

  return (
    <Popover>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="View token usage"
                className="rounded-full border-primary text-primary hover:bg-primary/5 h-9 w-9"
              >
                <Coins className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent side="bottom">
            <p>Token usage</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent
        className="w-[340px] p-0 overflow-hidden rounded-2xl border border-border/70 shadow-xl"
        align="end"
        sideOffset={10}
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
              <Coins className="h-[18px] w-[18px] text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Token Usage</span>
              <span className="text-sm font-semibold text-foreground">{scopeLabel}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[28px] font-bold text-foreground tabular-nums">
                {used.toLocaleString()}<span className="text-[20px] font-medium opacity-60">/ {total.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <div
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                className="relative h-2.5 flex-1 rounded-full bg-muted ring-1 ring-inset ring-black/5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] overflow-visible"
              >
                <div
                  className="relative h-full rounded-full bg-primary"
                  style={{ width: `${pct}%` }}
                >
                  <span className="absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-white/35" />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-3 w-3 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_4px_rgba(0,0,0,0.12),0_0_10px_3px_rgba(255,255,255,0.95)] ring-1 ring-black/5" />
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground tabular-nums">{pct}%</span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-[10px] text-muted-foreground tabular-nums">{pct}% of daily quota</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{remaining.toLocaleString()} left</span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="px-5 py-4 border-t border-border/60 space-y-2.5">
          {[
            { label: "Used today", value: used.toLocaleString() },
            { label: "Balance", value: remaining.toLocaleString() },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-orange-100' : 'bg-primary/10'}`}>
                {idx === 0 ? (
                  <Zap className="h-3.5 w-3.5 text-orange-600" />
                ) : (
                  <Coins className="h-3.5 w-3.5 text-primary" />
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-medium text-foreground">{item.label}</span>
                <span className="text-[10px] text-muted-foreground">
                  {idx === 0 ? 'Tokens consumed today' : 'Remaining available'}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground tabular-nums">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">Updated just now</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2.5 rounded-full text-primary hover:bg-primary/10 text-xs"
          >
            View details
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TokenUsagePopover;