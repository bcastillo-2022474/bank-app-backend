import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";

const adminRoute = "/admin";

describe("Get all admins", () => {
  it(`should return ${StatusCodes.OK} when the limit and page query params are both positive integers`, async () => {
    const response = await request(app).get(`${adminRoute}/?limit=12&page=1`);
    expect(response.status).toBe(StatusCodes.OK);
  });

  describe(`should return ${StatusCodes.BAD_REQUEST} when `, () => {
    it("the limit query param is not a number", async () => {
      const response = await request(app).get(
        `${adminRoute}/?limit=notanumber&page=1`,
      );
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the limit query param is a negative number", async () => {
      const response = await request(app).get(`${adminRoute}/?limit=-1&page=1`);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the limit query param is a decimal number", async () => {
      const response = await request(app).get(
        `${adminRoute}/?limit=10.5&page=1`,
      );
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the page query param is not a number", async () => {
      const response = await request(app).get(
        `${adminRoute}/?limit=10&page=notanumber`,
      );
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the page query param is a negative number", async () => {
      const response = await request(app).get(
        `${adminRoute}/?limit=10&page=-1`,
      );
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the page query param is a decimal number", async () => {
      const response = await request(app).get(
        `${adminRoute}/?limit=10&page=1.5`,
      );
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
