import type { Tables } from "@/integrations/supabase/types";

export type Customer = Tables<"customers">;
export type Loyalty = Tables<"loyalty">;
export type Session = Tables<"sessions">;
export type Referral = Tables<"referrals">;
export type SessionStatus = Session["status"];
export type ReferralRewardField = "referrer_reward_status" | "referred_reward_status";

export type CustomerData = {
  customers: Customer[];
  loyalty: Loyalty[];
  sessions: Session[];
  referrals: Referral[];
};

/** Actions the customer card can trigger; the page owns the mutations. */
export type CustomerActions = {
  busy: boolean;
  addSession: (customerId: string) => void;
  setSessionStatus: (id: string, status: SessionStatus) => void;
  markLoyaltyUsed: (customerId: string) => void;
  markReferralUsed: (id: string, field: ReferralRewardField) => void;
};

export const SESSION_STATUSES: SessionStatus[] = ["completed", "cancelled", "no_show", "unpaid"];

export const statusLabels: Record<string, string> = {
  locked: "Locked",
  unlocked: "Reward unlocked",
  used: "Reward used",
  pending: "Pending",
  available: "Available",
};

export function identity(customer: Customer) {
  return customer.full_name || customer.email || customer.phone || "Unnamed customer";
}

export function matchesSearch(customer: Customer, term: string) {
  if (!term) return true;
  return [customer.full_name, customer.email, customer.phone, customer.discovery_source]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(term));
}

/** True when the customer has a loyalty or referral reward waiting to be redeemed. */
export function hasRewardReady(customerId: string, data: CustomerData) {
  const loyalty = data.loyalty.find((row) => row.customer_id === customerId);
  if (loyalty?.reward_status === "unlocked") return true;
  return data.referrals.some(
    (row) =>
      (row.referrer_customer_id === customerId && row.referrer_reward_status === "available") ||
      (row.referred_customer_id === customerId && row.referred_reward_status === "available"),
  );
}
