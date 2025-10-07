export const brl = (n: number) => {
  return (n ?? 0 ).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};