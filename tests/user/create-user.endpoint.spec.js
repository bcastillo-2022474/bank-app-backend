import { StatusCodes } from "http-status-codes";
import { app } from "../../routes.js";
import request from "supertest";
import { faker } from "@faker-js/faker";

const userRoute = "/user";
const currencyRequest = () =>
  request(app)
    .post("/currency")
    .send({ symbol: "USD", name: "United States Dollar", key: "US" });

describe("Create user with account endpoint", () => {
  const [firstName, lastName] = [
    faker.person.firstName(),
    faker.person.lastName(),
  ];

  const validPayload = {
    email: faker.internet.email({
      firstName,
      lastName,
    }),
    username: faker.internet
      .userName({
        firstName,
        lastName,
      })
      .padEnd(4, "x"),
    password:
      "Aa1" +
      faker.internet.password({
        length: 6,
        numbers: true,
        symbols: false,
        // must have uppercase and lowercase
      }),
    name: firstName,
    last_name: lastName,
    address: faker.location.streetAddress({
      useFullAddress: true,
    }),
    DPI: "1234567890123",
    phone_number: "12345678",
    job_name: faker.person.jobTitle(),
    monthly_income: faker.finance.amount({
      min: 1000,
      max: 10_000,
      dec: 2,
    }),
  };

  describe(`should return ${StatusCodes.BAD_REQUEST} when`, () => {
    it("the email is invalid", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          email: false,
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[email]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the username is invalid", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          username: 3000,
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[username]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the password is invalid", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          password: faker.internet.password({
            length: 7,
            numbers: true,
            memorable: true,
          }),
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[password]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the name is invalid", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          name: "a",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[name]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the last_name is invalid", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          last_name: "a",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[last_name]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the address is invalid", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          address: "a",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[address]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the DPI is invalid", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          DPI: "123456789012",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[DPI]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the phone_number is invalid", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          phone_number: "1234567",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[phone_number]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the job_name is invalid", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          job_name: "a",
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[job_name]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the monthly_income is invalid", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          monthly_income: Number.NaN,
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[monthly_income]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the currency_income is invalid", async () => {
      const response = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          email: "ajklsdas",
          currency_income: "60d0fe4f5311236168a109ca",
        });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors.at(0)).toContain("body[email]");
    });
  });

  describe(`should return ${StatusCodes.CONFLICT} code when`, () => {
    it("Email already exists", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({ ...validPayload, currency_income: currency._id });

      const response2 = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          username: faker.internet
            .userName({
              firstName: faker.person.firstName(),
              lastName: faker.person.lastName(),
            })
            .padEnd(4, "0"),
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response2.status).toBe(StatusCodes.CONFLICT);
    });

    it("Username already exists", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({ ...validPayload, currency_income: currency._id });

      const response2 = await request(app)
        .post(userRoute)
        .send({
          ...validPayload,
          email: faker.internet.email({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
          }),
          currency_income: currency._id,
        });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response2.status).toBe(StatusCodes.CONFLICT);
    });
  });

  describe(`should return ${StatusCodes.CREATED} when`, () => {
    it("Everything its right", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const response = await request(app)
        .post(userRoute)
        .send({ ...validPayload, currency_income: currency._id });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.CREATED);
    });
  });
});
