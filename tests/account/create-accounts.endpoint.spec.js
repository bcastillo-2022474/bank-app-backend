import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";

describe("Create account", () => {
  const baseRequest = request(app).post("/account");

  describe("should return BAD_REQUEST when", () => {
    it("the owner is not provided", async () => {
      const response = await baseRequest.send({
        currency: "USD",
        balance: 100,
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.error).toBe("Owner is required");
    });

    it("the currency is not provided", async () => {
      const response = await baseRequest.send({
        owner: "user_id",
        balance: 100,
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.error).toBe("Currency is required");
    });

    it("the balance is not provided", async () => {
      const response = await baseRequest.send({
        owner: "user_id",
        currency: "USD",
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.error).toBe("Balance is required");
    });

    it("the balance is not a number", async () => {
      const response = await baseRequest.send({
        owner: "user_id",
        currency: "USD",
        balance: "not_a_number",
      });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.error).toBe("Balance must be a number");
    });
  });

  it("should return CREATED when creating an account", async () => {
    const response = await baseRequest.send({
      owner: "user_id",
      currency: "USD",
      balance: 100,
    });
    expect(response.status).toBe(StatusCodes.CREATED);
  });

  it("should return CONFLICT when trying to create an account with existing owner and currency", async () => {
    // First, create an account
    await baseRequest.send({ owner: "user_id", currency: "USD", balance: 100 });

    // Try to create another account with the same owner and currency
    const response = await baseRequest.send({
      owner: "user_id",
      currency: "USD",
      balance: 200,
    });
    expect(response.status).toBe(StatusCodes.CONFLICT);
    expect(response.body.error).toBe("Account already exists");
  });
});
