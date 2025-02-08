import { MONTHS } from "../constants";

export const formatDate = (date: Date) => {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};
