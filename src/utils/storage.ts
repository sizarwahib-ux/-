import { ConcernTicket, PreventiveAction, MessageItem } from '../types';
import { INITIAL_TICKETS, INITIAL_PREVENTIVE_ACTIONS } from '../data/mockData';

const TICKETS_KEY = 'nouar_school_tickets_v1';
const PREVENTIVE_KEY = 'nouar_school_preventive_v1';

export function getStoredTickets(): ConcernTicket[] {
  try {
    const raw = localStorage.getItem(TICKETS_KEY);
    if (!raw) {
      localStorage.setItem(TICKETS_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TICKETS;
  }
}

export function saveTicketToStorage(ticket: ConcernTicket): ConcernTicket[] {
  const current = getStoredTickets();
  const exists = current.some(t => t.id === ticket.id);
  const updated = exists 
    ? current.map(t => t.id === ticket.id ? ticket : t)
    : [ticket, ...current];
  
  localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
  return updated;
}

export function addMessageToTicket(ticketId: string, message: MessageItem): ConcernTicket[] {
  const current = getStoredTickets();
  const updated = current.map(t => {
    if (t.id === ticketId) {
      return {
        ...t,
        updatedAt: new Date().toISOString(),
        conversation: [...t.conversation, message]
      };
    }
    return t;
  });
  localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
  return updated;
}

export function getStoredPreventiveActions(): PreventiveAction[] {
  try {
    const raw = localStorage.getItem(PREVENTIVE_KEY);
    if (!raw) {
      localStorage.setItem(PREVENTIVE_KEY, JSON.stringify(INITIAL_PREVENTIVE_ACTIONS));
      return INITIAL_PREVENTIVE_ACTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PREVENTIVE_ACTIONS;
  }
}

export function savePreventiveActionToStorage(action: PreventiveAction): PreventiveAction[] {
  const current = getStoredPreventiveActions();
  const exists = current.some(a => a.id === action.id);
  const updated = exists
    ? current.map(a => a.id === action.id ? action : a)
    : [action, ...current];
  
  localStorage.setItem(PREVENTIVE_KEY, JSON.stringify(updated));
  return updated;
}

export function resetDemoData(): { tickets: ConcernTicket[]; actions: PreventiveAction[] } {
  localStorage.setItem(TICKETS_KEY, JSON.stringify(INITIAL_TICKETS));
  localStorage.setItem(PREVENTIVE_KEY, JSON.stringify(INITIAL_PREVENTIVE_ACTIONS));
  return { tickets: INITIAL_TICKETS, actions: INITIAL_PREVENTIVE_ACTIONS };
}
