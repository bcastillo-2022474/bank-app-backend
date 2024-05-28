// eslint-disable-next-line import/no-unresolved
import { L } from "../../i18n/i18n-node.js";

/**
 * Gets the translation functions for the given locale.
 *
 * @param {import('../../i18n/i18n-types.js').Locales} locale - The locale to get the translation functions for.
 * @returns {import('../../i18n/i18n-types.js').TranslationFunctions} The translation functions for the given locale.
 */
function getTranslationFunctions(locale) {
  /**
   * @typedef {import('../../i18n/i18n-types.js').TranslationFunctions} TranslationFunctions
   * @type {TranslationFunctions}
   */
  const LL = /** @type {TranslationFunctions} */ (L[locale]);
  return LL;
}

export { getTranslationFunctions };
