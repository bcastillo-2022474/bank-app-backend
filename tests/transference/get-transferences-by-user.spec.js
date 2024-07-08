import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";
import { getCurrency, getUser } from "../utils/valid-payloads.js";

const doBunchTransferences = async ({ accounts, currencies }, total = 10) => {
  const transferences = [];
  for (let i = 0; i < total; i++) {
    transferences.push(
      // eslint-disable-next-line no-await-in-loop
      await request(app)
        .post("/transference")
        .send({
          currency: currencies[Math.floor(Math.random() * currencies.length)],
          account_given: accounts[Math.floor(Math.random() * accounts.length)],
          account_reciver:
            accounts[Math.floor(Math.random() * accounts.length)],
          quantity: Math.floor(Math.random() * 100),
        }),
    );
  }

  return transferences;
};

describe("Get transferences by user ID", () => {
  describe(`Should return ${StatusCodes.BAD_REQUEST} code when`, () => {
    it("the user ID is not a valid mongoID", async () => {
      const invalidUserId = "invalid-id";

      const response = await request(app).get(
        `/transaction/user/${invalidUserId}`,
      );
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    describe("the limit query param is ", () => {
      it("not a number", async () => {
        const invalidLimit = "randomNumber";
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          cuerrency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `transference/user${userResponse.body.data._id}?limit=${invalidLimit}&page=1`,
        );

        expect(currencyResponse.status).toBe(StatusCodes.BAD_REQUEST);
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });

      it("a decimal number", async () => {
        const invalidLimit = 4.2;
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          cuerrency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `transference/user${userResponse.body.data._id}?limit=${invalidLimit}&page=1`,
        );

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });

      it("a negative number", async () => {
        const invalidLimit = -420;
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          cuerrency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `transference/user${userResponse.body.data._id}?limit=${invalidLimit}&page=1`,
        );

        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });
    });

    describe("the currency query param is", () => {
      it("not a valid mongoID", async () => {
        const invalidCurrency = "invalid-id";
        const currencyResponse = await getCurrency();
        const userResponse = await getUser({
          currency_income: currencyResponse.body.data._id,
        });

        const response = await request(app).get(
          `/transference/user/${userResponse.body.data._is}?currency=${invalidCurrency}&page=1`,
        );

        expect(currencyResponse.status).toBe(StatusCodes.CREATED);
        expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      });
    });
  });

  describe(`Should return ${StatusCodes.OK} code when `, () => {
    it("the user ID is valid", async () => {
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const response = await request(app).get(
        `/transference/user/${userResponse.body.data._id}`,
      );

      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.OK);
    });

    it("the currency is valid", async () => {
      const [firstCurrencyResponse, secondCurrencyResponse] = await Promise.all(
        [getCurrency(0), getCurrency(1)],
      );
      const userResponse = await getUser({
        currency_income: firstCurrencyResponse.body.data._id,
      });

      const transferencesResponse = await doBunchTransferences(
        {
          users: userResponse.body.data._id,
          currencies: [
            firstCurrencyResponse.body.data._id,
            secondCurrencyResponse.body.data._id,
          ],
        },
        5,
      );

      const response = await request(app).get(
        `/transference/user/${userResponse.body.data._id}?currency=${firstCurrencyResponse.body.data._id}&page=1`,
      );
      expect(
        transferencesResponse.every(
          (res) => res.status === StatusCodes.CREATED,
        ),
      ).toBe(true);
      expect(firstCurrencyResponse.status).toBe(StatusCodes.CREATED);
      expect(secondCurrencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.OK);
      expect(
        response.body.data.every(
          (transference) =>
            transference.currency === firstCurrencyResponse.body.data._id,
        ),
      ).toBe(true);
    });
  });
});
