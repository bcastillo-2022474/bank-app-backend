import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { app } from "../../routes.js"; // Ajusta la ruta si es necesario
import { getUser } from "../utils/valid-payloads.js"; // Ajusta la ruta a tus utilidades

describe("Delete user by ID endpoint", () => {
  describe(`Should return ${StatusCodes.NOT_FOUND} code when`, () => {
    it("user does not exist", async () => {
      // Act
      const response = await request(app).delete(
        "/user/60f1b9e3b3f1f3e8c8b4e4b1",
      );

      // Assert
      expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.OK} code when`, () => {
    it("user exists", async () => {
      // Arrange
      const userResponse = await getUser();
      const userId = userResponse.body.data._id;

      // Act
      const response = await request(app).delete(`/user/${userId}`);

      // Assert
      expect(userResponse.status).toBe(StatusCodes.CREATED);
      expect(response.statusCode).toBe(StatusCodes.OK);
    });
  });
});
