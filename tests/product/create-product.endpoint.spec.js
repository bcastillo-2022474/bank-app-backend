import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";

const productRoute = "/product";

describe("Create product", () => {
  describe(`should return ${StatusCodes.BAD_REQUEST} code when`, () => {
    it(`The name is not provided`, async () => {
      const response = await request(app).post(productRoute).send({
        description: "Test description",
        price: 100,
        currency: "664c7b1dfe5864e21db4d8bc",
        stock: 10,
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[name]")),
      ).toBe(true);
    });

    it(`The price is not provided`, async () => {
      const response = await request(app).post(productRoute).send({
        name: "Test product",
        description: "Test description",
        currency: "664c7b1dfe5864e21db4d8bc",
        stock: 10,
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[price]")),
      ).toBe(true);
    });

    it(`The currency is not provided`, async () => {
      const response = await request(app).post(productRoute).send({
        name: "Test product",
        description: "Test description",
        price: 100,
        stock: 10,
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[currency]")),
      ).toBe(true);
    });

    it(`The stock is not provided`, async () => {
      const response = await request(app).post(productRoute).send({
        name: "Test product",
        description: "Test description",
        price: 100,
        currency: "664c7b1dfe5864e21db4d8bc",
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[stock]")),
      ).toBe(true);
    });
  });

  describe(`should return ${StatusCodes.NOT_FOUND} code when`, () => {
    it(`The currency does not exist`, async () => {
      const response = await request(app).post(productRoute).send({
        name: "Test product",
        description: "Test description",
        price: 100,
        currency: "664c7b1dfe5864e21db4d8bc",
        stock: 10,
      });
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
