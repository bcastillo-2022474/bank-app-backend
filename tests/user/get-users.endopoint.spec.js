import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";

describe("Get all users", () => {
  it("should return 200 when the limit and page query params are both positive integers", async () => {
    const response = await request(app).get("/user?limit=12&page=1");
    expect(response.status).toBe(StatusCodes.OK);
  });

  it("should return 400 when the limit query param is not a number", async () => {
    const response = await request(app).get("/user?limit=notanumber&page=1");
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should return 400 when the limit query param is a negative number", async () => {
    const response = await request(app).get("/user?limit=-1&page=1");
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should return 400 when the limit query param is a decimal number", async () => {
    const response = await request(app).get("/user?limit=10.5&page=1");
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
