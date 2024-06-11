import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { getCurrency, getUser } from "../utils/valid-payloads.js";
import { app } from "../../routes.js";
import {
  DEPOSIT,
  WITHDRAWAL,
} from "../../src/application/transaction/transaction.model.js";

const doBunchTransactions = async ({ accounts, currencies }, total = 10) => {
  const transactions = [];
  for (let i = 0; i < total; i++) {
    transactions.push(
      // eslint-disable-next-line no-await-in-loop
      await request(app)
        .post("/transaction")
        .send({
          currency: currencies[Math.floor(Math.random() * currencies.length)],
          account: accounts[Math.floor(Math.random() * accounts.length)],
          type: Math.random() > 0.5 ? DEPOSIT : WITHDRAWAL,
          amount: Math.floor(Math.random() * 100),
        }),
    );
  }

  return transactions;
};

describe("Get transactions by user ID", () => {
  describe(`Should return ${StatusCodes.BAD_REQUEST} code when `, () => {
    it("the user ID is not a valid MongoDB ID", async () => {
      // Arrange
      const invalidUserId = "invalid-id";

      const response = await request(app).get(
        `/transaction/user/${invalidUserId}`,
      );

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    describe("the limit query param is ", () => {
      it("not a number", async () => {
        // Arrange
        const invalidLimit = "notanumber";
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          currency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `/transaction/user/${userResponse.body.data._id}?limit=${invalidLimit}&page=1`,
        );

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });

      it("a negative number", async () => {
        // Arrange
        const invalidLimit = -1;
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          currency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `/transaction/user/${userResponse.body.data._id}?limit=${invalidLimit}&page=1`,
        );

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });

      it("a decimal number", async () => {
        // Arrange
        const invalidLimit = 10.5;
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          currency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `/transaction/user/${userResponse.body.data._id}?limit=${invalidLimit}&page=1`,
        );

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });
    });

    describe("the type query param is ", () => {
      it("not a valid transaction type", async () => {
        // Arrange
        const invalidType = "invalid-type";
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          currency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `/transaction/user/${userResponse.body.data._id}?type=${invalidType}&page=1`,
        );

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });

      it("a number", async () => {
        // Arrange
        const invalidType = 1;
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          currency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `/transaction/user/${userResponse.body.data._id}?type=${invalidType}&page=1`,
        );

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });
    });

    describe("the currency query param is ", () => {
      it("not a valid MongoDB ID", async () => {
        // Arrange
        const invalidCurrency = "invalid-id";
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          currency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `/transaction/user/${userResponse.body.data._id}?currency=${invalidCurrency}&page=1`,
        );

        expect(userResponse.status).toBe(StatusCodes.CREATED);
        expect(currencyResponse.status).toBe(StatusCodes.CREATED);
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });

      it("a number", async () => {
        // Arrange
        const invalidCurrency = 1;
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          currency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `/transaction/user/${userResponse.body.data._id}?currency=${invalidCurrency}&page=1`,
        );

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });
    });
  });

  describe(`Should return ${StatusCodes.NOT_FOUND} code when `, () => {
    it("the user ID does not exist", async () => {
      // Arrange
      const invalidUserId = "65eb28a54196f7d368a0821b";

      const response = await request(app).get(
        `/transaction/user/${invalidUserId}`,
      );

      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("the currency does not exist", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const invalidCurrency = "65eb28a54196f7d368a0821b";

      const response = await request(app).get(
        `/transaction/user/${userResponse.body.data._id}?currency=${invalidCurrency}&page=1`,
      );

      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.OK} code when `, () => {
    it("the user ID is valid", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const response = await request(app).get(
        `/transaction/user/${userResponse.body.data._id}`,
      );

      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.OK);
    });

    it("the currency is valid", async () => {
      // Arrange
      const [firstCurrencyResponse, secondCurrencyResponse] = await Promise.all(
        [getCurrency(0), getCurrency(1)],
      );
      const userResponse = await getUser({
        currency_income: firstCurrencyResponse.body.data._id,
      });

      const transactionsResponse = await doBunchTransactions(
        {
          accounts: [userResponse.body.data.main_account._id],
          currencies: [
            firstCurrencyResponse.body.data._id,
            secondCurrencyResponse.body.data._id,
          ],
        },
        5,
      );

      const response = await request(app).get(
        `/transaction/user/${userResponse.body.data._id}?currency=${firstCurrencyResponse.body.data._id}&page=1`,
      );
      expect(
        transactionsResponse.every((res) => res.status === StatusCodes.CREATED),
      ).toBe(true);
      expect(firstCurrencyResponse.status).toBe(StatusCodes.CREATED);
      expect(secondCurrencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.OK);
      expect(
        response.body.data.every(
          (transaction) =>
            transaction.currency === firstCurrencyResponse.body.data._id,
        ),
      ).toBe(true);
    });

    it("the limit and page query params are both positive integers", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const transactionsResponses = await doBunchTransactions(
        {
          accounts: [userResponse.body.data.main_account._id],
          currencies: [currencyResponse.body.data._id],
        },
        5,
      );

      const response = await request(app).get(
        `/transaction/user/${userResponse.body.data._id}?limit=4&page=0`,
      );

      expect(
        transactionsResponses.every(
          (res) => res.status === StatusCodes.CREATED,
        ),
      ).toBe(true);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.body.data.length).toBe(4);
      expect(response.body.total).toBe(transactionsResponses.length);
      expect(response.status).toBe(StatusCodes.OK);
    });

    it("the type query param is a valid transaction type", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const transactionsResponses = await doBunchTransactions(
        {
          accounts: [userResponse.body.data.main_account._id],
          currencies: [currencyResponse.body.data._id],
        },
        5,
      );

      const response = await request(app).get(
        `/transaction/user/${userResponse.body.data._id}?type=DEPOSIT`,
      );

      expect(
        transactionsResponses.every(
          (res) => res.status === StatusCodes.CREATED,
        ),
      ).toBe(true);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.OK);
      expect(
        response.body.data.every((transaction) => transaction.type === DEPOSIT),
      ).toBe(true);
    });

    it("all query params are valid", async () => {
      // Arrange
      const [firstCurrencyResponse, secondCurrencyResponse] = await Promise.all(
        [getCurrency(0), getCurrency(1)],
      );
      const userResponse = await getUser({
        currency_income: firstCurrencyResponse.body.data._id,
      });

      const transactionsResponse = await doBunchTransactions(
        {
          accounts: [userResponse.body.data.main_account._id],
          currencies: [
            firstCurrencyResponse.body.data._id,
            secondCurrencyResponse.body.data._id,
          ],
        },
        13,
      );

      // Act
      const response = await request(app).get(
        `/transaction/user/${userResponse.body.data._id}?currency=${firstCurrencyResponse.body.data._id}&type=WITHDRAWAL&limit=5&page=0`,
      );

      // Assert
      expect(
        transactionsResponse.every((res) => res.status === StatusCodes.CREATED),
      ).toBe(true);
      expect(firstCurrencyResponse.status).toBe(StatusCodes.CREATED);
      expect(secondCurrencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.data.length).toBeLessThanOrEqual(5);
      expect(response.body.total).toBe(13);
      expect(
        response.body.data.every(
          (transaction) => transaction.type === WITHDRAWAL,
        ),
      ).toBe(true);
      expect(
        response.body.data.every(
          (transaction) =>
            transaction.currency === firstCurrencyResponse.body.data._id &&
            transaction.type === WITHDRAWAL,
        ),
      ).toBe(true);
    });
  });
});
