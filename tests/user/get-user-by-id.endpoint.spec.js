import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";
import { getCurrency, getUser } from "../utils/valid-payloads.js";

const userRoute = "/user";

describe("Get user by ID", () => {
  it(`should return ${StatusCodes.BAD_REQUEST} when the user ID is not a valid MongoDB ID`, async () => {
    const response = await request(app).get(`${userRoute}/invalid-id`);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it(`should return ${StatusCodes.NOT_FOUND} when the user ID does not exist`, async () => {
    const response = await request(app).get(
      `${userRoute}/65eb28a54196f7d368a0821b`,
    );
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it(`should return ${StatusCodes.OK} when the user ID is valid`, async () => {
    const currencyResponse = await getCurrency();
    const userResponse = await getUser({
      currency_income: currencyResponse.body.data._id,
    });

    const response = await request(app).get(
      `${userRoute}/${userResponse.body.data._id}`,
    );

    expect(currencyResponse.status).toBe(StatusCodes.CREATED);
    expect(userResponse.status).toBe(StatusCodes.CREATED);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.data).toHaveProperty("main_account");
    expect(response.body.data).toHaveProperty("accounts");
  });
});
