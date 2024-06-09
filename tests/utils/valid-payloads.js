import request from "supertest";
import { app } from "../../routes.js";
import { faker } from "@faker-js/faker";

export const getCurrency = (index) => {
  const currencies = [
    {
      symbol: "USD",
      name: "United States Dollar",
      key: "US",
    },
    {
      symbol: "EUR",
      name: "Euro",
      key: "EU",
    },
    {
      symbol: "JPY",
      name: "Japanese Yen",
      key: "JP",
    },
  ];

  const currency =
    currencies[index ?? Math.floor(Math.random() * currencies.length)];

  return request(app).post("/currency").send(currency);
};

export const getUser = (user) => {
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
    initial_balance: faker.finance.amount({
      min: 1000,
      max: 10_000,
      dec: 2,
    }),
    ...user,
  };

  return request(app).post("/user").send(validPayload);
};
