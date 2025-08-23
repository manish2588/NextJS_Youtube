 export const formatCount = (count) => {
  const num = parseInt(count);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

// Helper function to format date
export const formatDate = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    const days = Math.floor(diff / 86400);
    if (days < 30) return `${days}d ago`;

    const months =
      now.getMonth() -
      past.getMonth() +
      12 * (now.getFullYear() - past.getFullYear());
    if (months < 12) return `${months}mo ago`;

    // If older than 1 year, show Month Year
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${monthNames[past.getMonth()]} ${past.getFullYear()}`;
  };