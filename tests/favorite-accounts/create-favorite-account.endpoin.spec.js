import { StatusCodes } from "http-status-codes";
import { getCurrency, getUser } from "../utils/valid-payloads.js";
import request from "supertest";
import { app } from "../../routes.js";
import FavoriteAccounts from "../../src/application/favorite-accounts/favorite-accounts.model.js";
// import {wait} from "../utils/valid-payloads.js"

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

      const response = await request(app).post("/favorite-accounts").send({
        owner: "664c7b1dfe5864e21db4d8bc",
        account: accountFriend,
        alias: "Quezada",
      });

      expect(userResponseAccount.status).toBe(StatusCodes.CREATED);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe(`Should return ${StatusCodes.CONFLICT} code when `, () => {
    it(`trying to add an account with an existing alias`, async () => {
      const currencyResponse = await getCurrency();
      const userResponseAccount1 = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const userResponseAccount2 = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const userResponseOwner = await getUser({
        currency_income: currencyResponse.body.data._id,
      });
      const ownerId = userResponseOwner.body.data._id;
      const accountFriend1 = userResponseAccount1.body.data._id;
      const accountFriend2 = userResponseAccount2.body.data._id;

      console.log({ ownerId, accountFriend1, accountFriend2 });

      // Agregar un alias que ya existe
      await request(app).post("/favorite-accounts").send({
        owner: ownerId,
        account: accountFriend1,
        alias: "Quezada",
      });

      // Intentar agregar la misma cuenta con el mismo alias
      const response = await request(app).post("/favorite-accounts").send({
        owner: ownerId,
        account: accountFriend2,
        alias: "Quezada", // Alias repetido
      });

      // const x = await request(app).get(`/favorite-accounts/${ownerId}`);

      console.log(await FavoriteAccounts.find());

      console.log(response.body);
      expect(response.status).toBe(StatusCodes.CONFLICT);
      expect(response.body.message).toBe("Alias already exists");
    });
  });
});
