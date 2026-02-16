/**
 * Date formatting utilities for consistent date display across the application
 */

/**
 * Format date to Indonesian locale
 * @param date - Date string or Date object
 * @param format - 'short' (16/02/2026) or 'long' (16 Februari 2026)
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date, 
  format: 'short' | 'long' = 'long'
): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return d.toLocaleDateString('id-ID'); // 16/02/2026
  }
  
  return d.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }); // 16 Februari 2026
};

/**
 * Format date with time
 * @param date - Date string or Date object
 * @returns Formatted datetime string (16 Februari 2026, 14:30)
 */
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const dateStr = d.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const timeStr = d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `${dateStr}, ${timeStr}`;
};

/**
 * Format date to relative time (e.g., "2 hari yang lalu")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan yang lalu`;
  return `${Math.floor(diffDays / 365)} tahun yang lalu`;
};

/**
 * Format date range
 * @param startDate - Start date
 * @param endDate - End date  
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDate: string | Date, 
  endDate: string | Date
): string => {
  const start = formatDate(startDate, 'long');
  const end = formatDate(endDate, 'long');
  return `${start} - ${end}`;
};
