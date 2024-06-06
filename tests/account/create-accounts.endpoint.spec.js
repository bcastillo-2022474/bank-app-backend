import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";
import { faker } from "@faker-js/faker";

const userRoute = "/user";

const currencyRequest = () =>
  request(app)
    .post("/currency")
    .send({ symbol: "USD", name: "United States Dollar", key: "US" });

describe("Create account endpoint", () => {
  const [firstName, lastName] = [
    faker.person.firstName(),
    faker.person.lastName(),
  ];

  const validUserPayload = {
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

  describe(`should return ${StatusCodes.BAD_REQUEST} code when`, () => {
    it("the currency is not provided", async () => {
      const response = await request(app).post("/account").send({
        owner: "664c7b1dfe5864e21db4d8bc",
        balance: 100,
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[currency]")),
      ).toBe(true);
    });

    it("the owner is not provided", async () => {
      const response = await request(app).post("/account").send({
        currency: "664c7b1dfe5864e21db4d8bc",
        balance: 100,
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[owner]")),
      ).toBe(true);
    });

    it("the balance is not provided", async () => {
      const response = await request(app).post("/account").send({
        owner: "664c7b1dfe5864e21db4d8bc",
        currency: "664c7b1dfe5864e21db4d8bc",
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[balance]")),
      ).toBe(true);
    });

    it("the balance is not a number", async () => {
      const response = await request(app).post("/account").send({
        owner: "664c7b1dfe5864e21db4d8bc",
        currency: "664c7b1dfe5864e21db4d8bc",
        balance: "not_a_number",
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[balance]")),
      ).toBe(true);
    });
  });

  describe(`should return ${StatusCodes.NOT_FOUND} code when`, () => {
    it("the owner does not exist", async () => {
      const currencyResponse = await currencyRequest();
      const currency = currencyResponse.body.data;

      const response = await request(app).post("/account").send({
        owner: "664c7b1dfe5864e21db4d8bc",
        currency: currency._id,
        balance: 100,
      });

      expect(currencyResponse.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });

    it("the currency does not exist", async () => {
      const responseCurrency = await currencyRequest();
      const currency = responseCurrency.body.data;

      const responseUser = await request(app)
        .post(userRoute)
        .send({ ...validUserPayload, currency_income: currency._id });

      const response = await request(app).post("/account").send({
        owner: responseUser.body.data._id,
        currency: "664c7b1dfe5864e21db4d8bc",
        balance: 100,
      });

      expect(responseCurrency.status).toBe(StatusCodes.CREATED);
      expect(responseUser.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  it(`should return ${StatusCodes.CREATED} code when creating an account with proper values`, async () => {
    const responseCurrency = await currencyRequest();
    const currency = responseCurrency.body.data;

    const responseUser = await request(app)
      .post(userRoute)
      .send({ ...validUserPayload, currency_income: currency._id });

    const response = await request(app).post("/account").send({
      owner: responseUser.body.data._id,
      currency: currency._id,
      balance: 100,
    });

    expect(responseCurrency.status).toBe(StatusCodes.CREATED);
    expect(responseUser.status).toBe(StatusCodes.CREATED);
    expect(response.status).toBe(StatusCodes.CREATED);
  });
});
