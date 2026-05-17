export interface Greeting {
  text: string;
  hour: number;
}

export function getGreeting(date: Date = new Date()): Greeting {
  const hour = date.getHours();

  if (hour >= 5 && hour < 11) return { text: '早安', hour };
  if (hour >= 11 && hour < 13) return { text: '午安', hour };
  if (hour >= 13 && hour < 18) return { text: '下午好', hour };
  if (hour >= 18 && hour < 23) return { text: '晚上好', hour };
  return { text: '夜深了', hour };
}

export function formatLocalTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatLocalDate(date: Date = new Date()): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}
