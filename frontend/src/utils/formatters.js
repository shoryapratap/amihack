// Utility formatters for timestamps, status badges, and metrics

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return 'Expired';
  }
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;
  
  if (diffHours > 0) {
    return `${diffHours}h ${remainingMinutes}m remaining`;
  }
  return `${remainingMinutes}m remaining`;
}

export function getStatusBadgeClass(status) {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
    case 'MATCHED':
      return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
    case 'ACCEPTED':
    case 'APPROVED':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
    case 'PICKED_UP':
    case 'EN_ROUTE_PICKUP':
    case 'EN_ROUTE_DROPOFF':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
    case 'DELIVERED':
      return 'bg-teal-500/10 text-teal-400 border border-teal-500/30';
    case 'REJECTED':
    case 'CANCELLED':
    case 'EXPIRED':
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
    default:
      return 'bg-slate-800 text-slate-300 border border-slate-700';
  }
}
