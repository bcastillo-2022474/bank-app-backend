import { StatusCodes } from "http-status-codes";
import { app } from "../../routes.js";
import request from "supertest";
import { faker } from "@faker-js/faker";

const adminRoute = "/admin";

const validPayload = {
  email: faker.internet.email(),
  username: faker.internet.userName().padEnd(4, "x"),
  password:
    "Aa1" +
    faker.internet.password({ length: 6, numbers: true, symbols: false }),
  name: faker.person.firstName(),
  last_name: faker.person.lastName(),
};

describe("Create admin endpoint", () => {
  describe(`should return ${StatusCodes.BAD_REQUEST} code when`, () => {
    it("the email is invalid", async () => {
      const response = await request(app)
        .post(adminRoute)
        .send({ ...validPayload, email: "invalid-email" });

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0]).toContain("body[email]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the username is invalid", async () => {
      const response = await request(app)
        .post(adminRoute)
        .send({ ...validPayload, username: "" });

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0]).toContain("body[username]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the password is invalid", async () => {
      const response = await request(app)
        .post(adminRoute)
        .send({
          ...validPayload,
          password: faker.internet.password({
            length: 6,
            numbers: true,
            memorable: true,
          }),
        });

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0]).toContain("body[password]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the name is invalid", async () => {
      const response = await request(app)
        .post(adminRoute)
        .send({ ...validPayload, name: "a" });

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0]).toContain("body[name]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it("the last_name is invalid", async () => {
      const response = await request(app)
        .post(adminRoute)
        .send({ ...validPayload, last_name: 123 });

      expect(response.body.errors.length).toBe(1);
      expect(response.body.errors[0]).toContain("body[last_name]");
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe(`should return ${StatusCodes.CONFLICT} code when`, () => {
    it("Email already exists", async () => {
      const response1 = await request(app).post(adminRoute).send(validPayload);
      const response2 = await request(app)
        .post(adminRoute)
        .send({
          ...validPayload,
          username: faker.internet.userName().padEnd(4, "o"),
        });

      expect(response2.status).toBe(StatusCodes.CONFLICT);
      expect(response1.status).toBe(StatusCodes.CREATED);
    });

    it("Username already exists", async () => {
      const newPayload = { ...validPayload, email: faker.internet.email() };
      const response1 = await request(app).post(adminRoute).send(newPayload);
      const response2 = await request(app).post(adminRoute).send(validPayload);

      expect(response2.status).toBe(StatusCodes.CONFLICT);
      expect(response1.status).toBe(StatusCodes.CREATED);
    });
  });

  describe(`should return ${StatusCodes.CREATED} code when`, () => {
    it("Everything is correct", async () => {
      const response = await request(app).post(adminRoute).send(validPayload);

      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.data).toHaveProperty("_id");
      expect(response.body.data.email).toBe(validPayload.email);
      expect(response.body.data.username).toBe(validPayload.username);
      expect(response.body.data.name).toBe(validPayload.name);
      expect(response.body.data.last_name).toBe(validPayload.last_name);
    });
  });
});
