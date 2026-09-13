export function formatAmount(amount: number, unit: string): string {
  const isCurrency = ["USD", "EUR", "GBP"].includes(unit);
  
  if (isCurrency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: unit,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const numberStr = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${numberStr} ${unit}`;
}
