import request from "supertest";
import { StatusCodes } from "http-status-codes";
import app from "../../app"; // Asegúrate de que esta ruta sea correcta
import Admin from "./admin.model.js";
import { setupDatabase, teardownDatabase } from "../../test/setup.js"; // Asumiendo que tienes un archivo setup.js para configurar tu base de datos de prueba

describe("Admin Controller", () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await teardownDatabase();
  });

  describe("POST /api/admin", () => {
    it("should create a new admin", async () => {
      const newAdmin = {
        email: "testadmin@example.com",
        username: "testadmin",
        password: "TestAdmin123",
        name: "Test",
        last_name: "Admin",
      };

      const response = await request(app)
        .post("/api/admin")
        .send(newAdmin)
        .expect(StatusCodes.CREATED);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.email).toBe(newAdmin.email);
      expect(response.body.data.username).toBe(newAdmin.username);
      expect(response.body.data.name).toBe(newAdmin.name);
      expect(response.body.data.last_name).toBe(newAdmin.last_name);
    });

    it("should not create a new admin if email already exists", async () => {
      const existingAdmin = {
        email: "existingadmin@example.com",
        username: "existingadmin",
        password: "ExistingAdmin123",
        name: "Existing",
        last_name: "Admin",
      };

      await new Admin(existingAdmin).save();

      const newAdmin = {
        email: "existingadmin@example.com",
        username: "newadmin",
        password: "NewAdmin123",
        name: "New",
        last_name: "Admin",
      };

      const response = await request(app)
        .post("/api/admin")
        .send(newAdmin)
        .expect(StatusCodes.CONFLICT);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Email already exists");
    });

    it("should not create a new admin if username already exists", async () => {
      const existingAdmin = {
        email: "uniqueemail@example.com",
        username: "uniqueadmin",
        password: "UniqueAdmin123",
        name: "Unique",
        last_name: "Admin",
      };

      await new Admin(existingAdmin).save();

      const newAdmin = {
        email: "newadmin@example.com",
        username: "uniqueadmin",
        password: "NewAdmin123",
        name: "New",
        last_name: "Admin",
      };

      const response = await request(app)
        .post("/api/admin")
        .send(newAdmin)
        .expect(StatusCodes.CONFLICT);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Username already exists");
    });

    it("should return validation error if fields are missing or invalid", async () => {
      const newAdmin = {
        email: "invalidemail",
        username: "ab",
        password: "weak",
        name: "Te",
        last_name: "Ad",
      };

      const response = await request(app)
        .post("/api/admin")
        .send(newAdmin)
        .expect(StatusCodes.BAD_REQUEST);

      expect(response.body).toHaveProperty("errors");
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: expect.stringMatching(/valid email/),
        }),
      );
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: expect.stringMatching(/Invalid username/),
        }),
      );
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: expect.stringMatching(/Invalid password/),
        }),
      );
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: expect.stringMatching(/Invalid name/),
        }),
      );
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          msg: expect.stringMatching(/Invalid last name/),
        }),
      );
    });
  });
});
