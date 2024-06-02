import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";

describe("Get all currencies", () => {
  it("should return 200 when the limit and page query params are both positive integers", async () => {
    const response = await request(app).get("/currency?limit=12&page=13");
    expect(response.status).toBe(StatusCodes.OK);
  });

  it("should return 400 when the limit query param is not a number", async () => {
    const response = await request(app).get("/currency?limit=h&page=a");
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  // a test for endpoint to create currency, validate when I get an error when trying to create a currency that already exists

  it("should return 400 when the limit query is a negative number", async () => {
    const response = await request(app).get("/currency?limit=-2&page=-3");
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should return 400 when the limit query is a decimal number", async () => {
    const response = await request(app).get("/currency?limit=10.2&page=11.1");
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });

  // un test llamar al endpoint de crear luego eliminar esa currency e intentar crear otra vez la misma currency
});
