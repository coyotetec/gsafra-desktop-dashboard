export function currencyFormat(number: number, fractionDigits = 2) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: fractionDigits
  }).format(number);
}
