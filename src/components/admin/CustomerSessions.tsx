import { Button } from "@/components/site/Button";
import { SESSION_STATUSES, type Session, type SessionStatus } from "./customer-data";

type Props = {
  sessions: Session[];
  busy: boolean;
  onAdd: () => void;
  onStatus: (id: string, status: SessionStatus) => void;
};

export function CustomerSessions({ sessions, busy, onAdd, onStatus }: Props) {
  return (
    <div className="mt-5 border border-border px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="label-luxe text-muted-foreground">Sessions</span>
        <Button size="sm" variant="outline" disabled={busy} onClick={onAdd}>
          Record completed session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No sessions recorded.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {sessions.map((session) => (
            <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">
                {session.session_date}
                {session.service_label ? ` · ${session.service_label}` : ""}
              </span>
              <label className="flex items-center gap-2">
                <span className="sr-only">Session status</span>
                <select
                  value={session.status}
                  onChange={(event) => onStatus(session.id, event.target.value as SessionStatus)}
                  className="cursor-pointer rounded-none border border-border bg-transparent px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
                >
                  {SESSION_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {value.replace("_", "-")}
                    </option>
                  ))}
                </select>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
