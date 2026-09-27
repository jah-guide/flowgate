import type { ServiceRequest, TimelineEvent } from "./types";

export interface ActivityItem {
  id: string;
  requestId: string;
  requestTitle: string;
  event: TimelineEvent;
}

export function collectRecentActivity(
  requests: ServiceRequest[],
  limit = 8,
): ActivityItem[] {
  const items: ActivityItem[] = [];

  for (const request of requests) {
    for (const event of request.timeline) {
      items.push({
        id: `${request.id}-${event.id}`,
        requestId: request.id,
        requestTitle: request.title,
        event,
      });
    }
  }

  return items
    .sort((a, b) => new Date(b.event.at).getTime() - new Date(a.event.at).getTime())
    .slice(0, limit);
}
