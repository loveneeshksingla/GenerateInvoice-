export const checkAllfieldsFilled = (payload) => {
  const isFilled = Object.values(payload).every((value) => {
    if (!value) return false;
    else return true;
  });

  return isFilled;
};
