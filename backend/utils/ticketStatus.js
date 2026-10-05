// Single source of truth for the service-ticket lifecycle.
// Used by the Mongoose schema (enum), the controller (history) and, via the
// API, by the customer-facing tracker so the UI never invents a status.
const TICKET_STATUSES = ['Request Logged', 'Technician Assigned', 'In Progress', 'Completed', 'Cancelled'];

// Linear progress path shown in the tracker. 'Cancelled' is terminal and is
// handled separately because it is not part of the happy path.
const TICKET_FLOW = ['Request Logged', 'Technician Assigned', 'In Progress', 'Completed'];

module.exports = { TICKET_STATUSES, TICKET_FLOW };
