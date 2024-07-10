import request from "supertest";
import { app } from "../../routes.js";
import { faker } from "@faker-js/faker";
import { StatusCodes } from "http-status-codes";
import dbConnection from "../../src/db/db-connection.js";
import mongoose, { mongo } from "mongoose";
import userModel from "../../src/application/user/user.model.js";

export const getCurrency = async (index) => {
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

  const currencyPos = index ?? Math.floor(Math.random() * currencies.length);
  const currency = currencies[currencyPos];

  const response = await request(app).post("/currency").send(currency);

  if (response.status !== StatusCodes.CREATED) {
    if (response.body) {
      console.log(response.body);
    } else console.log(response);
    console.log(currency, { currencyPosition: currencyPos }, index);
  }

  return response;
};

export const getUser = async (user) => {
  const [firstName, lastName] = [
    faker.person.firstName().padEnd(3, "0"),
    faker.person.lastName().padEnd(3, "0"),
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
    job_name: faker.person.jobTitle().padEnd(3, "x"),
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

  const response = await request(app).post("/user").send(validPayload);

  if (response.status !== StatusCodes.CREATED) {
    if (response.body) {
      console.log(response.body);
    } else console.log(response);
    console.log(validPayload, user);
  }

  return response;
};

export const getService = async (service) => {
  const validService = {
    name: faker.lorem.words(3),
    description: faker.lorem.words(5),
    price: faker.finance.amount(),
  };

  const response = await request(app)
    .post("/service")
    .send({ ...validService, ...service });

  if (response.status !== StatusCodes.CREATED) {
    if (response.body) {
      console.log(response.body);
    } else console.log(response);
  }

  return response;
};

await dbConnection();

const currencies = [
  "668df298537c841c3bc72de2",
  "668df2d0c5bbecbe35fae21b",
  "668df2d6943aee95b7234bf3",
];

// const ownerId = "668df47bc854d426145b8304";

for (let i = 0; i < 30; i++) {
  const currency = currencies[Math.round(Math.random() * 2)];
  // eslint-disable-next-line no-await-in-loop
  await request(app).post("/service").send({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.finance.amount(),
    currency,
  });
}
// if (response.status !== StatusCodes.CREATED) {
//   console.log(response.body);
//   throw new Error("Error creating favorite account");
// }
// }
