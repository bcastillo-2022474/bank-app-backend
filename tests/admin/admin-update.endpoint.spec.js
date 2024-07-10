import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";
import { getAdmin } from "../utils/valid-payloads.js";

describe("Update admin endpoint", () => {
  describe(`Should return ${StatusCodes.BAD_REQUEST} code when `, () => {
    it("username is not a valid string", async () => {
      const adminResponse = await getAdmin();

      const response = await request(app)
        .put(`/admin/${adminResponse.body.data._id}`)
        .send({
          username: 123,
        });

      expect(adminResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[username]")),
      );
    });

    it("password is not a valid string", async () => {
      const adminResponse = await getAdmin();

      const response = await request(app)
        .put(`/admin/${adminResponse.body.data._id}`)
        .send({
          password: 123,
        });

      expect(adminResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[password]")),
      );
    });

    it("name is not a valid string", async () => {
      const adminResponse = await getAdmin();
      const response = await request(app)
        .put(`/admin/${adminResponse.body.data._id}`)
        .send({
          name: 123,
        });

      expect(adminResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.errors.some((str) => str.startsWith("body[name]")));
    });

    it("last_name is not a valid string", async () => {
      const adminResponse = await getAdmin();

      const response = await request(app)
        .put(`/admin/${adminResponse.body.data._id}`)
        .send({
          last_name: 123,
        });

      expect(adminResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[last_name]")),
      );
    });
  });

  describe(`Should return ${StatusCodes.NOT_FOUND} code when `, () => {
    it("admin does not exist", async () => {
      const response = await request(app)
        .put("/admin/60f1b9e3b3f1f3e8c8b4e4b1")
        .send({
          username: "newusername",
          password: "NewPassword123!",
          name: "New",
          last_name: "Name",
        });

      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.OK} code when `, () => {
    it("username is updated", async () => {
      const adminResponse = await getAdmin();

      const response = await request(app)
        .put(`/admin/${adminResponse.body.data._id}`)
        .send({
          username: "newusername",
        });

      expect(adminResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("password is updated", async () => {
      const adminResponse = await getAdmin();

      const response = await request(app)
        .put(`/admin/${adminResponse.body.data._id}`)
        .send({
          password: "NewPassword123!",
        });

      expect(adminResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("name is updated", async () => {
      const adminResponse = await getAdmin();

      const response = await request(app)
        .put(`/admin/${adminResponse.body.data._id}`)
        .send({
          name: "NewName",
        });

      expect(adminResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });

    it("last_name is updated", async () => {
      const adminResponse = await getAdmin();

      const response = await request(app)
        .put(`/admin/${adminResponse.body.data._id}`)
        .send({
          last_name: "NewLastName",
        });

      expect(adminResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });
});
