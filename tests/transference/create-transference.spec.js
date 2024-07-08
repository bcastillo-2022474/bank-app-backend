import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";
import { getCurrency, getUser } from "../utils/valid-payloads.js";

const transferenceRoute = "/transference";

describe("create transference endpoint", () => {
  describe(`Should return ${StatusCodes.BAD_REQUEST} code when`, () => {
    it("the quantity is a negative number", async () => {
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const transference = {
        account_given: userResponse.body.data.main_account._id,
        account_reciver: userResponse.body.data.main_account._id,
        quantity: -100,
        currency: currencyResponse.body.data._id,
      };

      const response = await request(app)
        .post(transferenceRoute)
        .send(transference);

      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[amount]")),
      );
    });

    it("the account is not mongoID", async () => {
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const transference = {
        account_given: "userResponse.body.data.main_account._id",
        account_reciver: "userResponse.body.data.main_account._id",
        quantity: 100,
        currency: currencyResponse.body.data._id,
      };

      const response = await request(app)
        .post(transferenceRoute)
        .send(transference);

      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[amount]")),
      );
    });

    it("the quantity is not a number", async () => {
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const transference = {
        account_given: userResponse.body.data.main_account._id,
        account_reciver: userResponse.body.data.main_account._id,
        quantity: "esto es una cantidad",
        currency: currencyResponse.body.data._id,
      };

      const response = await request(app)
        .post(transferenceRoute)
        .send(transference);

      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[amount]")),
      );
    });

    it("the currency is not a mongoID", async () => {
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const transference = {
        account_given: userResponse.body.data.main_account._id,
        account_reciver: userResponse.body.data.main_account._id,
        quantity: 100,
        currency: "currencyResponse.body.data._id",
      };

      const response = await request(app)
        .post(transferenceRoute)
        .send(transference);

      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[amount]")),
      );
    });

    it("the quantity is a negative number", async () => {
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const transference = {
        account_given: userResponse.body.data.main_account._id,
        account_reciver: userResponse.body.data.main_account._id,
        quantity: -100,
        currency: currencyResponse.body.data._id,
      };

      const response = await request(app)
        .post(transferenceRoute)
        .send(transference);

      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[amount]")),
      );
    });

    it("the currency does not exist", async () => {
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const transference = {
        account_given: userResponse.body.data.main_account._id,
        account_reciver: userResponse.body.data.main_account._id,
        quantity: 100,
        currency: "60f3f1f4e1e3c8b6a9e4b0b6",
      };

      const response = await request(app)
        .post(transferenceRoute)
        .send(transference);

      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[amount]")),
      );
    });
  });
});
