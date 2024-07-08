import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { getCurrency, getUser } from "../utils/valid-payloads.js";
import { app } from "../../routes.js";

const transferenceRoute = "/transference";

describe(`Should return ${StatusCodes.NOT_FOUND} code when `, () => {
  it("no account is provided", async () => {
    const currencyResponse = await getCurrency();
    const userOne = await getUser({
      currency_income: currencyResponse.body.data._id,
    });

    request(app).post(transferenceRoute).send({
      account_given: userOne.body.data.main_account._id,
      account_receiver: "65eb28a54196f7d368a0821b",
      currency: currencyResponse.body.data._id,
      quantity: 1000,
    });
  });
});

// describe(`Should return ${StatusCodes.OK}`, () => {
//   it("describe something");
// });
