// @ts-check

/**
 * @typedef { import('../i18n-types.js').BaseTranslation } BaseTranslation
 */

/** @satisfies { BaseTranslation } */
const en = {
  HI: "Hi {name:string}! Please leave a star if you like this project: https://github.com/ivanhofer/typesafe-i18n",
  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists",
  USER_CREATED: "User created successfully",
  ENDPOINT_NOT_FOUND: "Endpoint not found",
  DB_SYMBOL_REQUIRED: "Symbol is required",
  DB_NAME_REQUIRED: "The name is required",
  DB_KEY_REQUIRED: "The key is required",
  DB_TP_STATUS_REQUIRED: "The tp_status is required",
  DB_CREATED_AT_REQUIRED: "The created_at is required",
  DB_UPDATED_AT_REQUIRED: "The updated_at is required",
  DB_ACCOUNT_REQUIRED: "The account is required",
  DB_OWNER_REQUIRED: "User owner is required",
  DB_ALIAS_REQUIRED: "The alias is required",
  DB_CURRENCY_REQUIRED: "Currency is requires",
  DB_BALANCE_REQUIRED: "Balance is required",
  DB_EMAIL_REQUIRED: "The email is required",
  DB_USERNAME_REQUIRED: "The username is required",
  DB_PASSWORD_REQUIRED: "The password is required",
  DB_LASTNAME_REQUIRED: "The lastname is required",
  DB_ADDRESS_REQUIRED: "The address is required",
  DB_DPI_REQUIRED: "The DPI is required",
  DB_PHONE_NUMBER_REQUIRED: "The phone number is required",
  DB_JOB_NAME_REQUIRED: "The job name is required",
  DB_MONTHLY_INCOME_REQUIRED: "The monthly income is required",
  DB_QUANTITY_REQUIRED: "The quantity is required",
  DB_TYPE_REQUIRED: "The type is required",
  DB_DESCRIPTION_REQUIRED: "The description is required",
  DB_PRICE_REQUIRED: "The price is required",
  DB_STOCK_REQUIRED: "The stock is required",

  TRANSFERENCE:{
    ERROR: {
      NOT_FOUND: "Transference not found",
    },
    DB: {
      ACCOUNT_GIVEN_REQUIRED: "The account given is required",
      ACCOUNT_RECIVER_REQUIRED: "The account reciver is required",
      QUANTITY_REQUIRED: "The quantity is required",
      CURRENCY_REQUIRED: "Te currency is required",
    },
    ROUTES: {

    },
    CONTROLLER: {

    }
  },
  PURCHASE:{
    ERROR: {
      NOT_FOUND: "Purchase not found",
    },
    DB: {
      PURCHASER_REQUIRED: "The purchaser account is required",
      PRODUCT_REQUIRED: "The product is required",
      QUANTITY_REQUIRED: "The quantity is required",
      TOTAL_REQUIRED: "The total is required",
      CURRENCY_REQUIRED: "Te currency is required",
    },
    ROUTES: {

    },
    CONTROLLER: {

    }
  },
  PAYOUT:{
    ERROR: {
      NOT_FOUND: "Payout not found",
    },
    DB: {
      SERVICE_REQUIRED: "The service is required",
      DEBITED_ACCOUNT_REQUIRED: "The debited account is required",
      TOTAL_REQUIRED: "The total is required",
    },
    ROUTES: {

    },
    CONTROLLER: {

    }
  },


};

export default en;
