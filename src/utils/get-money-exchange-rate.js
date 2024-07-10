import { logger } from "./logger.js";

export async function getMoneyExchangeRate(currencyOne, currencyTwo) {
  logger.info("Getting money exchange rate");
  logger.info(`Currency one: ${currencyOne.symbol.toLowerCase()}`);
  logger.info(`Currency two: ${currencyTwo.symbol.toLowerCase()}`);
  const value = await fetch(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currencyOne.symbol.toLowerCase()}.json`,
    // eslint-disable-next-line @joao-cst/enforce-consistent-return-express
  ).then((res) => res.json());

  return value[currencyOne.symbol.toLowerCase()][
    currencyTwo.symbol.toLowerCase()
  ];
}
