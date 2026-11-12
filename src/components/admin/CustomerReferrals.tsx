import { Button } from "@/components/site/Button";
import { statusLabels, type Referral, type ReferralRewardField } from "./customer-data";

type Props = {
  referredBy?: Referral;
  referred: Referral[];
  nameOf: (customerId: string) => string;
  busy: boolean;
  onMarkUsed: (id: string, field: ReferralRewardField) => void;
};

const box = "mt-4 flex flex-wrap items-center gap-4 border border-border px-4 py-3";

export function CustomerReferrals({ referredBy, referred, nameOf, busy, onMarkUsed }: Props) {
  return (
    <>
      {referredBy ? (
        <div className={box}>
          <span className="label-luxe text-gold-deep">Referred by</span>
          <span className="text-sm text-foreground">{nameOf(referredBy.referrer_customer_id)}</span>
          <span className="text-sm text-muted-foreground">
            New client reward: {statusLabels[referredBy.referred_reward_status] ?? "Available"}
          </span>
          {referredBy.referred_reward_status === "available" ? (
            <Button size="sm" variant="ghost" disabled={busy}
              onClick={() => onMarkUsed(referredBy.id, "referred_reward_status")}>
              Mark used
            </Button>
          ) : null}
        </div>
      ) : null}

      {referred.map((row) => (
        <div key={row.id} className={box}>
          <span className="label-luxe text-gold-deep">Referred</span>
          <span className="text-sm text-foreground">{nameOf(row.referred_customer_id)}</span>
          <span className="text-sm text-muted-foreground">
            {row.referral_status === "qualified" ? "First session completed" : "Awaiting first session"}{" "}
            · Referrer reward: {statusLabels[row.referrer_reward_status] ?? "Pending"}
          </span>
          {row.referrer_reward_status === "available" ? (
            <Button size="sm" variant="ghost" disabled={busy}
              onClick={() => onMarkUsed(row.id, "referrer_reward_status")}>
              Mark used
            </Button>
          ) : null}
        </div>
      ))}
    </>
  );
}
