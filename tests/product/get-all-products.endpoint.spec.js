import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";

describe("Get all products", () => {
  it(`should return ${StatusCodes.OK} when the limit and page query params are both positive integers`, async () => {
    const response = await request(app).get("/product?limit=12&page=13");
    expect(response.status).toBe(StatusCodes.OK);
  });

  it(`should return ${StatusCodes.OK} when the limit query param is not a number`, async () => {
    const response = await request(app).get("/product?limit=h&page=a");
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it(`should return ${StatusCodes.OK} when the limit query is a negative number`, async () => {
    const response = await request(app).get("/product?limit=-2&page=-3");
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it(`should return ${StatusCodes.OK} when the limit query is a decimal number`, async () => {
    const response = await request(app).get("/product?limit=10.2&page=11.1");
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
