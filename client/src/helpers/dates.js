export function getPast7Days() {
  const today = new Date();
  const dateObj = {};
  [...Array(7)]
    .map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date;
    })
    .forEach((date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      dateObj[`${day}/${month}`] = 0;
    });
  return dateObj;
}

export function getDayAndMonth(date) {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  return `${day}/${month}`;
}
