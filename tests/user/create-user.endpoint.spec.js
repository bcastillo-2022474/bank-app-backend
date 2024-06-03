import { StatusCodes } from "http-status-codes";
import { app } from "../../routes.js";
import request from "supertest";

describe("Create user with account endpoint", () => {
  const validPayload = {
    email: "example@example.com",
    username: "exampleUser",
    password: "StrongPassword123",
    name: "John",
    last_name: "Doe",
    address: "123 Main St",
    DPI: "1234567890123",
    phone_number: "12345678",
    job_name: "Software Developer",
    monthly_income: 5000,
  };
  describe(`should return ${StatusCodes.BAD_REQUEST} when`, () => {
    it("the email is invalid", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          email: "ajklsdas",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the username is invalid", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          username: Number.NaN,
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the password is invalid", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          password: "1",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the name is invalid", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          name: "a",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the last_name is invalid", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          last_name: "a",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the address is invalid", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          address: "a",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the DPI is invalid", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          DPI: "123456789012",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the phone_number is invalid", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          phone_number: "1234567",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the job_name is invalid", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          job_name: "a",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the monthly_income is invalid", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          monthly_income: Number.NaN,
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the currency_income is invalid", async () => {
      const response = await request(app)
        .post("/user")
        .send({
          ...validPayload,
          email: "ajklsdas",
          currency_income: "60d0fe4f5311236168a109ca",
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe(`should return ${StatusCodes.CREATED} when`, () => {
    it("Everything its right", async () => {
      const responseCurrency = await request(app)
        .post("/currency")
        .send({ symbol: "USD", name: "United States Dollar", key: "US" });

      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post("/user")
        .send({ ...validPayload, currency_income: currency._id });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      console.log(response.body);
      expect(response.status).toBe(StatusCodes.CREATED);
    });
  });
});
