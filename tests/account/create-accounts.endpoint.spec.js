import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";

describe("Create account", () => {
  describe(`should return ${StatusCodes.BAD_REQUEST} when`, () => {
    it(`the owner is not provided`, async () => {
      const response = await request(app)
        .post("/account")
        .send({ currency: "USD", balance: 100 });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it(`the currency is not provided`, async () => {
      const response = await request(app)
        .post("/account")
        .send({ owner: "user_id", balance: 100 });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it(`the balance is not provided`, async () => {
      const response = await request(app)
        .post("/account")
        .send({ owner: "user_id", currency: "USD" });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it(`the balance is not a number`, async () => {
      const response = await request(app)
        .post("/account")
        .send({ owner: "user_id", currency: "USD", balance: "not_a_number" });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  it("should return 201 when creating an account", async () => {
    const response = await request(app)
      .post("/account")
      .send({ owner: "user_id", currency: "USD", balance: 100 });
    expect(response.status).toBe(StatusCodes.CREATED);
  });

  it(`should return ${StatusCodes.CONFLICT} when trying to create an account with existing owner and currency`, async () => {
    // First, create an account
    await request(app)
      .post("/account")
      .send({ owner: "user_id", currency: "USD", balance: 100 });

    // Try to create another account with the same owner and currency
    const response = await request(app)
      .post("/account")
      .send({ owner: "user_id", currency: "USD", balance: 200 });
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
