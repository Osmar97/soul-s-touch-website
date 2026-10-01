import { createFileRoute, redirect } from "@tanstack/react-router";

// Review moderation now lives at /admin; keep the old address working.
export const Route = createFileRoute("/_authenticated/admin/reviews")({
  beforeLoad: () => {
    throw redirect({ to: "/admin", replace: true });
  },
});
