import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";
import { faker } from "@faker-js/faker";
import { getCurrency } from "../utils/valid-payloads.js";

describe("Create Service Endpoint", () => {
  const validService = {
    name: faker.lorem.words(3),
    description: faker.lorem.words(5),
    price: faker.finance.amount(),
  };
  describe(`Should return ${StatusCodes.BAD_REQUEST} code when `, () => {
    it("name is not a valid string", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;

      // Act
      const response = await request(app)
        .post("/service")
        .send({ ...validService, currency: currencyId, name: 123 });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it("description is not a valid string", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;

      // Act
      const response = await request(app)
        .post("/service")
        .send({
          ...validService,
          currency: currencyId,
          description: Number.NaN,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it("price is not a valid number", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;

      // Act
      const response = await request(app)
        .post("/service")
        .send({ ...validService, currency: currencyId, price: false });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it("currency is not a valid MongoID", async () => {
      // Act
      const response = await request(app)
        .post("/service")
        .send({ ...validService, currency: "invalid" });

      // Assert
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe(`Should return ${StatusCodes.NOT_FOUND} code when `, () => {
    it("currency does not exist", async () => {
      // Act
      const response = await request(app)
        .post("/service")
        .send({ ...validService, currency: "60f1b9e3b3f1f3e8c8b4e4b1" });

      // Assert
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.CREATED} code when `, () => {
    it("all fields are valid", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;

      // Act
      const response = await request(app)
        .post("/service")
        .send({ ...validService, currency: currencyId });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.CREATED);
    });
  });
});
