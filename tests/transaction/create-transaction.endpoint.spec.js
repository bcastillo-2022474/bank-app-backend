import { StatusCodes } from "http-status-codes";
import request from "supertest";
import {
  DEPOSIT,
  WITHDRAWAL,
} from "../../src/application/transaction/transaction.model.js";
import { app } from "../../routes.js";
import { getCurrency, getUser } from "../utils/valid-payloads.js";

const transactionRoute = "/transaction";

describe("create transaction endpoint", () => {
  describe(`Should return ${StatusCodes.BAD_REQUEST} code when `, () => {
    it("the amount is a negative number", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const transaction = {
        currency: currencyResponse.body.data._id,
        type: Math.random() > 0.5 ? DEPOSIT : WITHDRAWAL,
        amount: -100,
        account: userResponse.body.data.main_account._id,
      };

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);

      // Assert
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[amount]")),
      );
    });

    it("the amount is not a number", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const transaction = {
        currency: currencyResponse.body.data._id,
        type: Math.random() > 0.5 ? DEPOSIT : WITHDRAWAL,
        amount: "not a number",
        account: userResponse.body.data.main_account._id,
      };

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);

      // Assert
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[amount]")),
      );
    });

    it("the user is not a mongoID", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const transaction = {
        currency: currencyResponse.body.data._id,
        type: Math.random() > 0.5 ? DEPOSIT : WITHDRAWAL,
        amount: 100,
        account: "not a mongoID",
      };

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[account]")),
      );
    });

    it("the currency is not a mongoID", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const transaction = {
        currency: "not a mongoID",
        type: Math.random() > 0.5 ? DEPOSIT : WITHDRAWAL,
        amount: 100,
        account: userResponse.body.data.main_account._id,
      };

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);

      // Assert
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[currency]")),
      );
    });

    it("the type is not a valid type", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const transaction = {
        currency: currencyResponse.body.data._id,
        type: "not a valid type",
        amount: 100,
        account: userResponse.body.data.main_account._id,
      };

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);

      // Assert
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.errors.some((str) => str.startsWith("body[type]")));
    });
  });

  describe(`Should return ${StatusCodes.NOT_FOUND} code when `, () => {
    it("the user does not exist", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const transaction = {
        currency: currencyResponse.body.data._id,
        type: Math.random() > 0.5 ? DEPOSIT : WITHDRAWAL,
        amount: 100,
        account: "60f3f1f4e1e3c8b6a9e4b0b6",
      };

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("the currency does not exist", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const transaction = {
        currency: "60f3f1f4e1e3c8b6a9e4b0b6",
        type: Math.random() > 0.5 ? DEPOSIT : WITHDRAWAL,
        amount: 100,
        account: userResponse.body.data.main_account._id,
      };

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);

      // Assert
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.CREATED} code when `, () => {
    it(`the transaction is a ${DEPOSIT} created successfully`, async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const transaction = {
        currency: currencyResponse.body.data._id,
        type: DEPOSIT,
        amount: 100,
        account: userResponse.body.data.main_account._id,
      };

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);
      const userResponseAfter = await request(app).get(
        `/user/${userResponse.body.data._id}`,
      );

      // Assert
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(userResponseAfter.status).toBe(StatusCodes.OK);

      expect(userResponseAfter.body.data.main_account.balance).toBe(
        userResponse.body.data.main_account.balance + transaction.amount,
      );
    });

    it(`the transaction is a ${WITHDRAWAL} created successfully`, async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const transaction = {
        currency: currencyResponse.body.data._id,
        type: WITHDRAWAL,
        amount: 100,
        account: userResponse.body.data.main_account._id,
      };

      // Act
      const response = await request(app)
        .post(transactionRoute)
        .send(transaction);

      const userResponseAfter = await request(app).get(
        `/user/${userResponse.body.data._id}`,
      );

      // Assert
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(userResponseAfter.status).toBe(StatusCodes.OK);

      expect(userResponseAfter.body.data.main_account.balance).toBe(
        userResponse.body.data.main_account.balance - transaction.amount,
      );
    });
  });
});
