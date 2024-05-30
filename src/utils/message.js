import { getTranslationFunctions } from "./get-translations-locale.js";

/**
 * @typedef {import('../../i18n/i18n-types.js').TranslationFunctions} TranslationFunctions
 * @type {TranslationFunctions}
 */

/**
 * @typedef {function(TranslationFunctions): string} MessageFunction
 */

/**
 * @param {MessageFunction} messageFunction
 */
export function message(messageFunction) {
  return (value, { req }) => {
    const LL = getTranslationFunctions(req.locale);
    return messageFunction(LL);
  };
}
