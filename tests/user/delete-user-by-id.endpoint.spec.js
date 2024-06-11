import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../routes.js";
import { getUser, getCurrency } from "../utils/valid-payloads.js";

describe("Delete user by ID endpoint", () => {
  describe(`Should return ${StatusCodes.NOT_FOUND} code when`, () => {
    it("user does not exist", async () => {
      const response = await request(app).delete(
        "/user/60f1b9e3b3f1f3e8c8b4e4b1",
      );

      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.OK} code when`, () => {
    it("user exists", async () => {
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const userId = userResponse.body.data._id;

      const response = await request(app).delete(`/user/${userId}`);

      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });
});
