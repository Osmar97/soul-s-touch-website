import { CustomerLoyalty } from "./CustomerLoyalty";
import { CustomerReferrals } from "./CustomerReferrals";
import { CustomerSessions } from "./CustomerSessions";
import { identity, type Customer, type CustomerActions, type CustomerData } from "./customer-data";

type Props = { customer: Customer; data: CustomerData; actions: CustomerActions };

export function CustomerCard({ customer, data, actions }: Props) {
  const id = customer.id;
  const loyalty = data.loyalty.find((row) => row.customer_id === id);
  const sessions = data.sessions.filter((row) => row.customer_id === id);
  const referredBy = data.referrals.find((row) => row.referred_customer_id === id);
  const referred = data.referrals.filter((row) => row.referrer_customer_id === id);
  const completed = sessions.filter((row) => row.status === "completed").length;

  const nameOf = (customerId: string) => {
    const match = data.customers.find((row) => row.id === customerId);
    return match ? identity(match) : "Unknown customer";
  };

  return (
    <li className="border-t border-border pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-serif text-xl text-foreground">{identity(customer)}</p>
        <span className="label-luxe text-muted-foreground">
          {customer.discovery_source ?? "source not recorded"} · {completed} completed
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
        {customer.email ? <span>{customer.email}</span> : null}
        {customer.phone ? <span>{customer.phone}</span> : null}
        <span>Added {new Date(customer.created_at).toLocaleDateString()}</span>
      </div>

      <CustomerLoyalty loyalty={loyalty} completed={completed} busy={actions.busy}
        onMarkUsed={() => actions.markLoyaltyUsed(id)} />
      <CustomerReferrals referredBy={referredBy} referred={referred} nameOf={nameOf}
        busy={actions.busy} onMarkUsed={actions.markReferralUsed} />
      <CustomerSessions sessions={sessions} busy={actions.busy}
        onAdd={() => actions.addSession(id)} onStatus={actions.setSessionStatus} />
    </li>
  );
}
