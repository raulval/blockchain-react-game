export const convertLBC = (value: number) => {
  const amount = value * 10 ** 18;
  return amount.toString();
};
