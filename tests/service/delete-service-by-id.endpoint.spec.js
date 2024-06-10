import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../routes.js";
import { getCurrency, getService } from "../utils/valid-payloads.js";

describe("Delete service by ID endpoint", () => {
  describe(`Should return ${StatusCodes.NOT_FOUND} code when `, () => {
    it("service does not exist", async () => {
      // Act
      const response = await request(app).delete(
        "/service/60f1b9e3b3f1f3e8c8b4e4b1",
      );

      // Assert
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.OK} code when `, () => {
    it("service exists", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({
        currency: currencyId,
      });

      // Act
      const response = await request(app).delete(
        `/service/${serviceResponse.body.data._id}`,
      );

      // Assert
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });
});
