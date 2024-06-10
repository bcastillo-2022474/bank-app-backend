import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";
import { getCurrency, getService } from "../utils/valid-payloads.js";

describe("Update service endpoint", () => {
  describe(`Should return ${StatusCodes.BAD_REQUEST} code when `, () => {
    it("name is not a valid string", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({ currency: currencyId });

      // Act
      const response = await request(app)
        .put(`/service/${serviceResponse.body.data._id}`)
        .send({ ...serviceResponse.body, currency: currencyId, name: 123 });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it("description is not a valid string", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({ currency: currencyId });

      // Act
      const response = await request(app)
        .put(`/service/${serviceResponse.body.data._id}`)
        .send({
          ...serviceResponse.body,
          currency: currencyId,
          description: Number.NaN,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it("price is not a valid number", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({ currency: currencyId });

      // Act
      const response = await request(app)
        .put(`/service/${serviceResponse.body.data._id}`)
        .send({ ...serviceResponse.body, currency: currencyId, price: false });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });

    it("currency is not a valid MongoID", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({ currency: currencyId });

      // Act
      const response = await request(app)
        .put(`/service/${serviceResponse.body.data._id}`)
        .send({ ...serviceResponse.body, currency: "invalid" });

      // Assert
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe(`Should return ${StatusCodes.NOT_FOUND} code when `, () => {
    it("currency does not exist", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({ currency: currencyId });

      // Act
      const response = await request(app)
        .put(`/service/${serviceResponse.body.data._id}`)
        .send({
          ...serviceResponse.body,
          currency: "60f1b9e3b3f1f3e8c8b4e4b1",
        });

      // Assert
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.OK} code when `, () => {
    it("name is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({ currency: currencyId });

      // Act
      const response = await request(app)
        .put(`/service/${serviceResponse.body.data._id}`)
        .send({
          ...serviceResponse.body,
          currency: currencyId,
          name: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("description is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({ currency: currencyId });

      // Act
      const response = await request(app)
        .put(`/service/${serviceResponse.body.data._id}`)
        .send({
          ...serviceResponse.body,
          currency: currencyId,
          description: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("price is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({ currency: currencyId });

      // Act
      const response = await request(app)
        .put(`/service/${serviceResponse.body.data._id}`)
        .send({
          ...serviceResponse.body,
          currency: currencyId,
          price: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("currency is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({ currency: currencyId });

      // Act
      const response = await request(app)
        .put(`/service/${serviceResponse.body.data._id}`)
        .send({
          ...serviceResponse.body,
          currency: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("all fields are provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const serviceResponse = await getService({ currency: currencyId });

      // Act
      const response = await request(app)
        .put(`/service/${serviceResponse.body.data._id}`)
        .send({
          ...serviceResponse.body,
          currency: currencyId,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(serviceResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });
});
