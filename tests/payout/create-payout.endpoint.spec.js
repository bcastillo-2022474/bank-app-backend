import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";

const payoutRoute = "/payout";

describe("Create payout", () => {
  describe(`should return ${StatusCodes.BAD_REQUEST} code when`, () => {
    it(`The service is not a mongo id`, async () => {
      const response = await request(app).post(payoutRoute).send({
        service: "a",
        total: 1200.5,
        debited_account: "664c7b1dfe5864e21db4d8bc",
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[service]")),
      ).toBe(true);
    });

    it(`The total is not a valid positive number`, async () => {
      const response = await request(app).post(payoutRoute).send({
        service: "664c7b1dfe5864e21db4d8bc",
        total: -100.2,
        debited_account: "664c7b1dfe5864e21db4d8bc",
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[total]")),
      ).toBe(true);
    });

    it(`The debited account is not a mongo id`, async () => {
      const response = await request(app).post(payoutRoute).send({
        service: "664c7b1dfe5864e21db4d8bc",
        total: 300,
        debited_account: "a",
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) =>
          str.startsWith("body[debited_account]"),
        ),
      ).toBe(true);
    });
  });

  describe(`should return ${StatusCodes.NOT_FOUND} code when`, () => {
    it(`The debited account or service does not exist`, async () => {
      const response = await request(app).post(payoutRoute).send({
        //  DOES NOT EXIST
        service: "664c7b1dfe5864e21db4d8bc",
        total: 300,
        // DOES NOT EXIST
        debited_account: "664c7b1dfe5864e21db4d8bc",
      });
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
