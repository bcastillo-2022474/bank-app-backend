import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { app } from "../../routes.js";
// import mongoose from "mongoose";

describe("Get user accounts by ID", () => {
  // const invalidUserId = mongoose.Types.ObjectId(); // Genera un ID de MongoDB válido, pero inexistente

  // it("should return 200 and user accounts when the user ID is valid", async () => {
  //   const response = await request(app).get(`/users/${validUserId}`);
  //   expect(response.status).toBe(StatusCodes.OK);
  //   expect(response.body).toHaveProperty("main_account");
  //   expect(response.body).toHaveProperty("accounts");
  // });

  it("should return 404 when the user ID is not a valid MongoDB ID", async () => {
    const response = await request(app).get("/users/invalid-id");
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("should return 404 when the user ID does not exist", async () => {
    const response = await request(app).get(`/users/65eb28a54196f7d368a0821b`);
    // TODO: SHOULD BE 404, but for now, it will 400
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});
