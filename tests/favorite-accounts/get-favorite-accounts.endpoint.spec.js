import { StatusCodes } from "http-status-codes";
import { getCurrency, getUser } from "../utils/valid-payloads.js";
import request from "supertest";
import { app } from "../../routes.js";

describe("get favorite account endpoint", () => {
  describe(`should return ${StatusCodes.OK} code when: `, () => {
    it("all is right", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const userResponse = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const accountId = userResponse.body.data.main_account._id;
      console.log({ accountId });

      // Act
      const response = await request(app).get(
        `/favorite-accounts/${accountId}?limit=3&page=1`,
      );

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.data).toHaveProperty("length");
    });
  });
});
