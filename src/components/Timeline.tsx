import type { TimelineEvent } from "@/lib/types";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="timeline">
      {events.map((event, index) => (
        <li key={event.id} className={index === events.length - 1 ? "timeline-current" : ""}>
          <div className="timeline-dot" aria-hidden />
          <div className="timeline-body">
            <div className="timeline-head">
              <strong>{event.label}</strong>
              <time dateTime={event.at}>{new Date(event.at).toLocaleString()}</time>
            </div>
            <p className="timeline-meta">
              {event.actor} · {event.type}
            </p>
            {event.note && <p className="timeline-note">{event.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
