const MAX_EVENTS = 200;
const events = [];

export function recordSecurityEvent(event) {
    const entry = {
        ...event,
        at: event?.at || new Date().toISOString()
    };

    events.push(entry);
    if (events.length > MAX_EVENTS) {
        events.splice(0, events.length - MAX_EVENTS);
    }

    return entry;
}

export function listSecurityEvents(limit = 50) {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 50, 200));
    return events.slice(-safeLimit).reverse();
}
