/**
 * 날짜를 한국어 형식으로 포맷팅합니다.
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * 금액을 한국어 형식으로 포맷팅합니다.
 */
export function formatAmount(amount: string | number): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return numAmount.toLocaleString("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * 환율을 한국어 형식으로 포맷팅합니다.
 */
export function formatRate(rate: string | number): string {
  const numRate = typeof rate === "string" ? parseFloat(rate) : rate;
  return numRate.toLocaleString("ko-KR", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });
}
