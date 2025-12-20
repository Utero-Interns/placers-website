export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Available':
    case 'Active':
    case 'Verified':
    case 'PAID':
    case 'COMPLETED':
      return 'badge-success';
    case 'NotAvailable':
    case 'Rejected':
    case 'CANCELLED':
    case 'REJECTED':
      return 'badge-danger';
    case 'Pending':
    case 'PENDING':
      return 'badge-warning';
    default:
      return 'badge-secondary';
  }
}
