export const retrieveLocale = async (req, res, next) => {
  const locale = (req.headers["accept-language"] || "en").slice(0, 2);
  req.locale = locale;
  next();
};
