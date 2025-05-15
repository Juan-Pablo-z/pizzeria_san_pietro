export const formatMoney = (amount: number) => {
  return '$ ' + amount.toLocaleString('es-ES');
}