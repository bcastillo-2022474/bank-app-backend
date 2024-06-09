import { StatusCodes } from "http-status-codes";
import request from "supertest";
import {
  MAX_WITHDRAWAL_PER_TRANSACTION,
  WITHDRAWAL,
} from "../../src/application/transaction/transaction.model.js";
import { app } from "../../routes.js";
import { getCurrency, getUser } from "../utils/valid-payloads.js";

const transactionRoute = "/transaction";

describe("Checking constraints for withdraw transaction", () => {
  describe(`Should return ${StatusCodes.FORBIDDEN} code when `, () => {
    it("the amount exceeds the maximum withdrawal per transaction", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        initial_balance: 3000,
        currency_income: currencyResponse.body.data._id,
      });

      const transaction = {
        currency: currencyResponse.body.data._id,
        type: WITHDRAWAL,
        amount: MAX_WITHDRAWAL_PER_TRANSACTION + 1,
        account: userResponse.body.data.main_account._id,
      };

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);

      // Assert
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });

    it("the withdrawals done in a day exceed the maximum withdrawal per day", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        initial_balance: 20_000,
        currency_income: currencyResponse.body.data._id,
      });

      const transaction = {
        currency: currencyResponse.body.data._id,
        type: WITHDRAWAL,
        amount: 1500,
        account: userResponse.body.data.main_account._id,
      };

      for (let i = 0; i < 6; i++) {
        // eslint-disable-next-line no-await-in-loop
        await request(app).post(transactionRoute).send(transaction);
      }

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);

      // Assert
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.FORBIDDEN);
    });
  });
});
