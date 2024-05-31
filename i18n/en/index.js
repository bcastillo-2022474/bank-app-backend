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
    DB_ACCOUNT_REQUIRED: "The account is required",
    DB_OWNER_REQUIRED: "User owner is required",
    DB_ALIAS_REQUIRED: "The alias is required",
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
    INTERNAL_SERVER_ERROR: "Internal server error",
    DB_QUANTITY_REQUIRED: "The quantity is required",
    DB_TYPE_REQUIRED: "The type is required",
    DB_DESCRIPTION_REQUIRED: "The description is required",
    DB_PRICE_REQUIRED: "The price is required",
    DB_STOCK_REQUIRED: "The stock is required",
    GENERAL: {
        ROUTES: {
            ENDPOINT_NOT_FOUND: "Endpoint not found",
            INVALID_OPTIONAL_LIMIT: "If provided, limit must be a valid positive integer",
            INVALID_OPTIONAL_PAGE: "If provided, page must be a valid positive integer",
            INVALID_MONGO_ID: "Invalid mongo id",
        },
        DB: {
            TP_STATUS_REQUIRED: "The tp_status is required",
            CREATED_AT_REQUIRED: "The created_at is required",
        }
    },
    CURRENCY:{
        ERROR: {
            CURRENCY_ALREADY_EXIST: "Currency already exists",
            CURRENCY_NOT_FOUND: "Currency not found",
            SYMBOL_ALREADY_EXISTS: "A Currency with this symbol already exists",
            NAME_ALREADY_EXISTS: "A Currency with this name already exists",
            KEY_ALREADY_EXISTS: "A Currency with this key already exists",
        },
        DB: {
            CURRENCY_REQUIRED: "Currency is required",
            SYMBOL_REQUIRED: "Symbol is required",
            NAME_REQUIRED: "The name is required",
            KEY_REQUIRED: "The key is required",

        },
        ROUTES: {
            INVALID_SYMBOL: "Symbol is invalid",
            INVALID_NAME: "Name is invalid",
            INVALID_KEY: "Key is invalid",
            INVALID_OPTIONAL_SYMBOL: "If provided, symbol must be a valid",
            INVALID_OPTIONAL_NAME: "If provided, name must be a valid",
            INVALID_OPTIONAL_KEY: "If provided, key must be a valid",
        },
        CONTROLLER: {
            MULTIPLE_RETRIEVED_SUCCESSFULLY: "Currencies retrieved successfully",
            DELETED: "Currency deleted successfully",
            CREATED: "Currency created successfully",
            UPDATED: "Currency update successfully",
        }
    }
};

export default en;
