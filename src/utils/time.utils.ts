export function formatTime(time: number) {
  const hours = Math.floor(time);
  const minutes = Math.trunc((time * 60) % 60);
  return `${hours}h ${minutes}m`;
}
