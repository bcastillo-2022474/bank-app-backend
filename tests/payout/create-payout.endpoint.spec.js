import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";

describe("Create payout", () => {
  describe(`should return ${StatusCodes.BAD_REQUEST} when`, () => {
    it(`The service is not a mongo id`, async () => {
      const response = await request(app)
        .post("/payout")
        .send({ service: "a", total: 1, debited_account: 1 });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it(`The total is not a mongo id`, async () => {
      const response = await request(app)
        .post("/payout")
        .send({ service: 1, total: 10.2, debited_account: 1 });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it(`The debited account is not a mongo id`, async () => {
      const response = await request(app)
        .post("/payout")
        .send({ service: 1, total: 1, debited_account: "a" });
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  it("should return 201 when creating a payout", async () => {
    const response = await request(app)
      .post("/payout")
      .send({ service: 1, total: 1, debited_account: 1 });
    expect(response.status).toBe(StatusCodes.CREATED);
  });
});
