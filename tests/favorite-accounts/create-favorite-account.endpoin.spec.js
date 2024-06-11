import { StatusCodes } from "http-status-codes";
import { getCurrency, getUser } from "../utils/valid-payloads.js";
import request from "supertest";
import { app } from "../../routes.js";

describe("Create currency", () => {
  describe(`should return ${StatusCodes.BAD_REQUEST} code when `, () => {
    it(`alias is empty`, async () => {
      const currencyResponse = await getCurrency();
      const userResponseOwner = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const userResponseAccount = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const accountOwner = userResponseOwner.body.data._id;
      const accountFriend = userResponseAccount.body.data._id;

      // Caso de prueba: alias vacío
      const response = await request(app).post("/favorite-accounts").send({
        owner: accountOwner,
        account: accountFriend,
        alias: "",
      });

      expect(userResponseOwner.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.errors.some((str) => str.startsWith("body[alias]")));
    });

    it(`account is not provided`, async () => {
      const currencyResponse = await getCurrency();
      const userResponseOwner = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const accountOwner = userResponseOwner.body.data._id;

      // Caso de prueba: account no proporcionado
      const response = await request(app).post("/favorite-accounts").send({
        owner: accountOwner,
        alias: "TestAlias",
      });

      expect(userResponseOwner.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(
        response.body.errors.some((str) => str.startsWith("body[account]")),
      );
    });

    it(`owner is not provided`, async () => {
      const currencyResponse = await getCurrency();
      const userResponseAccount = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const accountFriend = userResponseAccount.body.data._id;

      // Caso de prueba: owner no proporcionado
      const response = await request(app).post("/favorite-accounts").send({
        account: accountFriend,
        alias: "TestAlias",
      });

      expect(userResponseAccount.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
      expect(response.body.errors.some((str) => str.startsWith("body[owner]")));
    });
  });

  describe(`Should return ${StatusCodes.NOT_FOUND} code when `, () => {
    it(`account owner doesnt exist`, async () => {
      const currencyResponse = await getCurrency();
      const userResponseAccount = await getUser({
        currency_income: currencyResponse.body.data._id,
      });

      const accountFriend = userResponseAccount.body.data._id;

      // Caso de prueba: alias vacío
      const response = await request(app).post("/favorite-accounts").send({
        owner: "664c7b1dfe5864e21db4d8bc",
        account: accountFriend,
        alias: "Quezada",
      });

      expect(userResponseAccount.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
});
