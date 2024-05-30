export const printLanguage = async (req, _, next) => {
  // print language
  console.log({ languageReceived: req.headers["accept-language"] });
  console.log({
    language: (req.headers["accept-language"] || "en").slice(0, 2),
  });
  next();
};
