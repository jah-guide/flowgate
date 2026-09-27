import type { TimelineEvent } from "@/lib/types";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  if (!events.length) {
    return <p className="muted">No timeline events yet.</p>;
  }

  return (
    <ol className="timeline">
      {events.map((event, index) => (
        <li key={event.id} className={index === events.length - 1 ? "timeline-current" : ""}>
          <div className="timeline-dot" aria-hidden />
          <div className="timeline-body">
            <div className="timeline-head">
              <strong>
                {event.label}
                <span className="timeline-type">{event.type}</span>
              </strong>
              <time dateTime={event.at}>{new Date(event.at).toLocaleString()}</time>
            </div>
            <p className="timeline-meta">{event.actor}</p>
            {event.note && <p className="timeline-note">{event.note}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
