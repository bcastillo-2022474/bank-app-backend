import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../routes.js";
import { getAdmin } from "../utils/valid-payloads.js";

describe("Delete admin by ID endpoint", () => {
  describe(`Should return ${StatusCodes.NOT_FOUND} code when `, () => {
    it("admin does not exist", async () => {
      const response = await request(app).delete(
        "/admin/60f1b9e3b3f1f3e8c8b4e4b1",
      );

      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.OK} code when `, () => {
    it("admin exists", async () => {
      const adminResponse = await getAdmin();

      const response = await request(app).delete(
        `/admin/${adminResponse.body.data._id}`,
      );

      expect(adminResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });
});
