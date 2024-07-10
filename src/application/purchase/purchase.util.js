export async function getMoneyExchangeRate(currencyOne, currencyTwo) {
  const value = await fetch(
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currencyOne.symbol}.json`,
  ).then((res) => res.json());

  return value[currencyOne.symbol][currencyTwo.symbol];
}
