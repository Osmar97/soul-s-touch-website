import { Button } from "@/components/site/Button";
import { statusLabels, type Loyalty } from "./customer-data";

type Props = { loyalty?: Loyalty; completed: number; busy: boolean; onMarkUsed: () => void };

export function CustomerLoyalty({ loyalty, completed, busy, onMarkUsed }: Props) {
  return (
    <div className="mt-5 flex flex-wrap items-center gap-4 border border-border px-4 py-3">
      <span className="label-luxe text-gold-deep">Loyalty</span>
      <span className="text-sm text-muted-foreground">
        {loyalty?.completed_sessions ?? completed} / 10 completed sessions
      </span>
      <span className="text-sm text-foreground">
        {statusLabels[loyalty?.reward_status ?? "locked"] ?? "Locked"}
      </span>
      {loyalty?.reward_status === "unlocked" ? (
        <Button size="sm" variant="ghost" disabled={busy} onClick={onMarkUsed}>
          Mark reward used
        </Button>
      ) : null}
    </div>
  );
}
