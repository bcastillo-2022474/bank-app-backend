import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../routes.js";

describe("Health check", () => {
  it("should return 200", async () => {
    const response = await request(app).get("/");
    console.log(response.body);
    expect(response.status).toBe(StatusCodes.OK);
  });
});
