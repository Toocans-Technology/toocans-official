export const maskAddress = (address: string) => {
  if (!address || address.length < 6) return address;
  return `${address.substring(0, 3)}***${address.substring(address.length - 3)}`;
};
