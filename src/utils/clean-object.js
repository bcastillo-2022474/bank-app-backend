export const cleanObject = (obj) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] !== null && obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });

  return newObj;
};
