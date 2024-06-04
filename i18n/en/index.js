// @ts-check

/**
 * @typedef { import('../i18n-types.js').BaseTranslation } BaseTranslation
 */

/** @satisfies { BaseTranslation } */
const en = {
  HI: "Hello World!",
  GENERAL: {
    ROUTES: {
        ENDPOINT_NOT_FOUND: "Endpoint not found",
        INVALID_OPTIONAL_LIMIT: "If provided, limit must be a valid positive integer",
        INVALID_OPTIONAL_PAGE: "If provided, page must be a valid positive integer",
        INVALID_MONGO_ID: "Invalid mongo id",
        INTERNAL_SERVER_ERROR: "Internal server error",
    },
    DB: {
        TP_STATUS_REQUIRED: "The tp_status is required",
        CREATED_AT_REQUIRED: "The created_at is required",
    }
  },
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
      PAYOUT_NOT_FOUND: "Payout not found",
      SERVICE_ALREADY_EXISTS: "A Payout with this service already exists",
      TOTAL_ALREADY_EXISTS: "A Payout with this total already exists",
      DEBITED_ACCOUNT_ALREADY_EXISTS: "A Payout with this debited account already exists",
    },
    DB: {
      SERVICE_REQUIRED: "The service is required",
      DEBITED_ACCOUNT_REQUIRED: "The debited account is required",
      TOTAL_REQUIRED: "The total is required",
    },
    ROUTES: {
      INVALID_SERVICE: "Service is invalid because not is a mongo id",
      INVALID_TOTAL: "Total is invalid because not is a mongo id",
      INVALID_DEBITED_ACCOUNT: "Debited account is invalid because not is a mongo id",
      INVALID_OPTIONAL_TOTAL: "If provided, total must be a valid",
      INVALID_OPTIONAL_DEBITED_ACCOUNT: "If provided, debited account must be a valid",
    },
    CONTROLLER: {
      MULTIPLE_RETRIEVED_SUCCESSFULLY: "Payout retrieved successfully",
      CREATED: "Payout created successfully",
      UPDATED: "Payout update successfully",
      DELETED: "Payout deleted successfully",

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
  },
  ACCOUNT: {
    DB: {
      OWNER_REQUIRED: "The owner is required",
      CURRENCY_REQUIRED: "The currency is required",
      BALANCE_REQUIRED: "The balance is required",
    },
    ERROR: {
      NOT_FOUND: "The account is invalid",
    }
  },
  PRODUCT: {
    DB: {
      NAME_REQUIRED: "The name is required",
      DESCRIPTION_REQUIRED: "The description is required",
      PRICE_REQUIRED: "The price is required",
      CURRENCY_REQUIRED: "The currency is required",
      STOCK_REQUIRED: "The stock is required",
    }
  },
  FAVORITE_ACCOUNT: {
    DB: {
      ACCOUNT_REQUIRED: "The account is required",
      OWNER_REQUIRED: "The owner is required",
      ALIAS_REQUIRED: "The alias is required",
    },
  },
  SERVICE: {
    DB: {
      NAME_REQUIRED: "The name is required",
      DESCRIPTION_REQUIRED: "The description is required",
      PRICE_REQUIRED: "The price is required",
      CURRENCY_REQUIRED: "The currency is required",
    },
    ERROR: {
      NOT_FOUND: "The service is invalid",
    }
  },
  TRANSACTION: {
    DB: {
      TYPE_REQUIRED: "The type is required",
      QUANTITY_REQUIRED: "The quantity is required",
      CURRENCY_REQUIRED: "The currency is required",
      ACCOUNT_REQUIRED: "The account is required",
    }
  },
  USER: {
    DB: {
      EMAIL_REQUIRED: "The email is required",
      PASSWORD_REQUIRED: "The password is required",
      NAME_REQUIRED: "The name is required",
      USERNAME_REQUIRED: "The username is required",
      LAST_NAME_REQUIRED: "The last name is required",
      ADDRESS_REQUIRED: "The address is required",
      DPI_REQUIRED: "The DPI is required",
      PHONE_NUMBER_REQUIRED: "The phone number is required",
      JOB_NAME_REQUIRED: "The job name is required",
      MONTHLY_INCOME_REQUIRED: "The monthly income is required",
      CURRENCY_INCOME_REQUIRED: "The currency income is required",
      MAIN_ACCOUNT_REQUIRED: "The main account is required",
    }
  }
};

export default en;
