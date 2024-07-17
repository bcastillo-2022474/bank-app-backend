import { Router } from "express";
import { retrieveLocale } from "../../middleware/retrieve-locale.js";
import { body, query, param } from "express-validator";
import { message } from "../../utils/message.js";
import { validateChecks } from "../../middleware/validate-checks.js";
import {
  getAllfavoriteAccountsByUserId,
  createFavoriteAccounts,
  updateFavoriteAccounts,
  deleteFavoriteAccountsById,
} from "./favorite-accounts.controller.js";
import {
  FavoriteAccountsAlreadyExist,
  FavoriteAccountsNotFound,
} from "./favorite-accounts.error.js";
import { custom } from "../../middleware/custom.js";
import FavoriteAccounts from "./favorite-accounts.model.js";
import Account, { ACTIVE } from "../account/account.model.js";

const router = Router();

router.route("/:userId").get(
  [
    query("limit")
      .optional()
      .isInt({ min: 0 })
      .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_LIMIT())) // If last check fails, this message will be shown
      .toInt(), // // converts the value to an integer
    query("page")
      .optional()
      .isInt({ min: 0 })
      .withMessage(message((LL) => LL.GENERAL.ROUTES.INVALID_OPTIONAL_PAGE())) // If last check fails, this message will be shown
      .toInt(), // Converts the value to an integer
    validateChecks,
  ],
  getAllfavoriteAccountsByUserId,
);

router.post(
  "/",
  [
    body(
      "account",
      message((LL) => LL.FAVORITE_ACCOUNT.ROUTES.INVALID_ACCOUNT()),
    ).isMongoId(),

    body(
      "owner",
      message((LL) => LL.FAVORITE_ACCOUNT.ROUTES.INVALID_OWNER()),
    ).isMongoId(),
    body(
      "alias",
      message((LL) => LL.FAVORITE_ACCOUNT.ROUTES.INVALID_ALIAS()),
    )
      .isString()
      .isLength({ min: 3, max: 255 }),
    validateChecks,
    custom(async (req, LL) => {
      const { account } = req.body;
      // Check if the account already exists in the database
      const accountFound = await Account.findOne({
        name: account,
        tp_status: ACTIVE,
      });
      if (!accountFound) {
        throw new FavoriteAccountsNotFound(
          LL.FAVORITE_ACCOUNT.ERROR.ACCOUNT_NOT_FOUND(),
        );
      }
    }),
    custom(async (req, LL) => {
      const { owner } = req.body;
      // Check if the account already exists in the database
      const accountFound = await Account.findOne({
        _id: owner,
        tp_status: ACTIVE,
      });
      if (!accountFound) {
        throw new FavoriteAccountsNotFound(
          LL.FAVORITE_ACCOUNT.ERROR.OWNER_NOT_FOUND(),
        );
      }
    }),
    custom(async (req, LL) => {
      const { alias, owner } = req.body;
      // Check if the alias already exists in the database
      const favoriteAccount = await FavoriteAccounts.findOne({
        alias,
        owner,
      });
      if (favoriteAccount) {
        throw new FavoriteAccountsAlreadyExist(
          LL.FAVORITE_ACCOUNT.ERROR.ALIAS_ALREADY_EXISTS(),
        );
      }
    }),
  ],
  createFavoriteAccounts,
);

router
  .route("/:id")
  .put(
    [
      param("id").isMongoId(),
      body(
        "account",
        message((LL) => LL.FAVORITE_ACCOUNT.ROUTES.INVALID_OPTIONAL_ACCOUNT()),
      )
        .optional()
        .isMongoId(),
      body(
        "owner",
        message((LL) => LL.FAVORITE_ACCOUNT.ROUTES.INVALID_OPTIONAL_OWNER()),
      )
        .optional()
        .isMongoId(),
      body(
        "alias",
        message((LL) => LL.FAVORITE_ACCOUNT.ROUTES.INVALID_OPTIONAL_ALIAS()),
      )
        .optional()
        .isString()
        .isLength({ min: 3, max: 255 }),
      validateChecks,
      custom(async (req, LL) => {
        const { account } = req.body;
        // if account not provided, skip
        if (account === undefined || account === null) return;

        // Check if the account already exists in another account except itself
        const accountFound = await Account.findOne({
          _id: { $ne: req.params.id },
          account,
          tp_status: ACTIVE,
        });
        if (!accountFound) {
          throw new FavoriteAccountsAlreadyExist(
            LL.FAVORITE_ACCOUNT.ERROR.ACCOUNT_ALREADY_EXISTS(),
          );
        }
      }),
      custom(async (req, LL) => {
        const { owner } = req.body;
        // if owner not provided, skip
        if (owner === undefined || owner === null) return;

        // Check if the owner already exists in another owner except itself
        const accountFound = await Account.findOne({
          _id: { $ne: req.params.id },
          owner,
          tp_status: ACTIVE,
        });
        if (!accountFound) {
          throw new FavoriteAccountsAlreadyExist(
            LL.FAVORITE_ACCOUNT.ERROR.OWNER_ALREADY_EXISTS(),
          );
        }
      }),
      custom(async (req, LL) => {
        const { alias, owner } = req.body;
        // if favorite account not provided, skip
        if (alias === undefined || alias === null) return;

        // Check if the favorite account already exists in another alias except itself
        const favoriteAccount = await FavoriteAccounts.findOne({
          _id: { $ne: req.params.id },
          alias,
          owner,
          tp_status: ACTIVE,
        });
        if (favoriteAccount) {
          throw new FavoriteAccountsAlreadyExist(
            LL.FAVORITE_ACCOUNT.ERROR.ALIAS_ALREADY_EXISTS(),
          );
        }
      }),
    ],
    updateFavoriteAccounts,
  )
  .delete(
    [
      retrieveLocale,
      param("id")
        .isMongoId()
        .withMessage(
          message((LL) => LL.FAVORITE_ACCOUNT.ROUTES.INVALID_ACCOUNT_ID()),
        ),
      validateChecks,
      custom(async (req, LL) => {
        const { id } = req.params;
        const favoriteAccount = await FavoriteAccounts.findOne({
          _id: id,
          tp_status: ACTIVE,
        });

        if (!favoriteAccount) {
          throw new FavoriteAccountsNotFound(
            LL.FAVORITE_ACCOUNT.ERROR.NOT_FOUND(),
          );
        }
      }),
    ],
    deleteFavoriteAccountsById,
  );

export default router;
