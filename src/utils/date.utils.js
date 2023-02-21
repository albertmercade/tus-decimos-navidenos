export const nextDrawDate = () => {
  const currDate = new Date();
  const currYear = currDate.getFullYear();
  const lotteryDate = new Date(`${currYear}-12-22T09:00:00.000+01:00`);

  if (lotteryDate - currDate < 0) lotteryDate.setFullYear(currYear + 1);

  return lotteryDate;
};
