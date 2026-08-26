import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/site/Button";
import { Wordmark } from "@/components/site/Wordmark";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Sign in — Soul's Touch by Dani" },
      { name: "description", content: "Internal sign in for review moderation." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Sign in — Soul's Touch by Dani" },
      { property: "og:description", content: "Internal sign in for review moderation." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setPending(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate({ to: "/admin/reviews" });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-20">
      <div className="w-full max-w-sm">
        <Wordmark className="items-start" />
        <h1 className="mt-10 font-serif text-3xl text-foreground">Sign in</h1>
        <span className="rule-gold mt-6" aria-hidden="true" />

        <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="label-luxe text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border-b border-input bg-transparent py-2 text-sm text-foreground outline-none focus:border-gold"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="label-luxe text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="border-b border-input bg-transparent py-2 text-sm text-foreground outline-none focus:border-gold"
            />
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="solid" disabled={pending} className="mt-2 self-start">
            {pending ? "Signing in" : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
