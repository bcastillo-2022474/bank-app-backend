import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";

describe("Get all payouts", () => {
  it("should return 200 when the limit and page query params are both positive integers", async () => {
    const response = await request(app).get("/payout?limit=1&page=2");
    expect(response.status).toBe(StatusCodes.OK);
  });
});
