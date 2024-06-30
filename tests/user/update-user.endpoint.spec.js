import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";
import { getCurrency, getUser } from "../utils/valid-payloads.js";

describe("Update user endpoint", () => {
  describe(`Should return ${StatusCodes.BAD_REQUEST} code when `, () => {
    it("username is not a valid string", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          username: 123,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[username]")),
      );
    });

    it("password is not a valid string", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          password: 123,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[password]")),
      );
    });

    it("name is not a valid string", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          name: Number.NaN,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.errors.some((str) => str.startsWith("body[name]")));
    });

    it("address is not a valid string", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          address: true,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[address]")),
      );
    });

    it("phone_number is not a valid string", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          phone_number: "123456789",
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) =>
          str.startsWith("body[phone_number]"),
        ),
      );
    });

    it("job_name is not a valid string", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          job_name: "12",
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[job_name]")),
      );
    });

    it("monthly_income is not a valid number", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          monthly_income: -10,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) =>
          str.startsWith("body[monthly_income]"),
        ),
      );
    });

    it("currency_income is not a valid MongoID", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({ ...userResponse.body, currency_income: "invalid" });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) =>
          str.startsWith("body[currency_income]"),
        ),
      );
    });
  });

  describe(`Should return ${StatusCodes.NOT_FOUND} code when `, () => {
    it("currency_income does not exist", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: "60f1b9e3b3f1f3e8c8b4e4b1",
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.OK} code when `, () => {
    it("username is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          username: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("password is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          password: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("name is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          name: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("address is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          address: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("phone_number is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          phone_number: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("job_name is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          job_name: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("monthly_income is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({
          ...userResponse.body,
          currency_income: currencyId,
          monthly_income: undefined,
        });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("currency_income is not provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({ ...userResponse.body, currency_income: undefined });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("all fields are provided", async () => {
      // Arrange
      const currencyResponse = await getCurrency();
      const currencyId = currencyResponse.body.data._id;
      const userResponse = await getUser({ currency_income: currencyId });

      // Act
      const response = await request(app)
        .put(`/user/${userResponse.body.data._id}`)
        .send({ ...userResponse.body, currency_income: currencyId });

      // Assert
      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });
});
