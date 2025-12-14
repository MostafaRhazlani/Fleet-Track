import dayjs from 'dayjs';

export function formatDate(date, fmt = 'YYYY/MM/DD') {
  if (!date) return '';
  return dayjs(date).format(fmt);
}

export function formatDateTime(date, fmt = 'YYYY/MM/DD HH:mm') {
  if (!date) return '';
  return dayjs(date).format(fmt);
}

export function toISO(date) {
  if (!date) return null;
  return dayjs(date).toISOString();
}

export function fromISOToLocal(iso, fmt = 'YYYY/MM/DD') {
  if (!iso) return '';
  return dayjs(iso).format(fmt);
}

export default {
  formatDate,
  formatDateTime,
  toISO,
  fromISOToLocal,
};
