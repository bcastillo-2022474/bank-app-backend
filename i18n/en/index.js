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
        INTERNAL_SERVER_ERROR: "Internal server error",
        INVALID_REQUEST: "Invalid request",
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
      DESCRIPTION_REQUIRED: "The description is required",
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
      INVALID_SERVICE: "service must be a MongoID",
      INVALID_TOTAL: "total must be a positive number",
      INVALID_DEBITED_ACCOUNT: "debited_account must be a valid MongoID",
      INVALID_OPTIONAL_SERVICE: "If provided, service must be a valid MongoID",
      INVALID_OPTIONAL_TOTAL: "If provided, total must be a valid positive number",
      INVALID_OPTIONAL_DEBITED_ACCOUNT: "If provided, debited account must be a valid MongoID",
      INVALID_PAYOUT_ID: "Payout param url id must be a valid mongo id",
      INVALID_ACCOUNT_ID: "Account param url id must be a valid mongo id",
    },
    CONTROLLER: {
      MULTIPLE_RETRIEVED_SUCCESSFULLY: "Payouts retrieved successfully",
      CREATED: "Payout created successfully",
      UPDATED: "Payout update successfully",
      DELETED: "Payout deleted successfully",
    }
  },
  CURRENCY:{
      ERROR: {
          ALREADY_EXIST: "Currency already exists",
          NOT_FOUND: "Currency not found",
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
          INVALID_CURRENCY_ID: "Currency param url id must be a valid mongo id",

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
      OWNER_REQUIRED: "The owner is required and cannot be empty.",
      CURRENCY_REQUIRED: "The currency is required and must be specified.",
      BALANCE_REQUIRED: "The balance is required and must be a valid number.",
      TP_STATUS_REQUIRED: "The transaction status (tp_status) is required."
    },
    CONTROLLER: {
      MULTIPLE_RETRIEVED_SUCCESSFULLY: "Multiple accounts retrieved successfully.",
      CREATED: "The account has been created successfully.",
      UPDATED: "The account has been updated successfully.",
      DELETED: "The account has been deleted successfully."
    },
    ERROR: {
      NOT_FOUND: "The requested account was not found.",
      OWNER_ALREADY_EXISTS: "An account with this owner already exists. Please choose a different owner.",
      CURRENCY_ALREADY_EXISTS: "An account with this currency already exists. Please choose a different currency.",
      BALANCE_ALREADY_EXISTS: "An account with this balance already exists. Please specify a different balance.",
      INSUFFICIENT_BALANCE: "Not enough funds to complete the transaction.",
      DAILY_QUOTA_EXCEEDED: "You have exceeded the daily transaction quota."
    },
    ROUTES: {
      INVALID_OWNER: "Owner must be a valid MongoDB ObjectId.",
      INVALID_CURRENCY: "Currency must be a valid MongoDB ObjectId.",
      INVALID_BALANCE: "Balance must be a positive number.",
      INVALID_OPTIONAL_CURRENCY: "If provided, currency must be a valid MongoDB ObjectId.",
      INVALID_ACCOUNT_ID: "Account parameter URL ID must be a valid MongoDB ObjectId."
    },
  },
  PRODUCT: {
    DB: {
      NAME_REQUIRED: "The name is required and cannot be empty.",
      DESCRIPTION_REQUIRED: "The description is required and cannot be empty.",
      PRICE_REQUIRED: "The price is required and must be a valid number.",
      CURRENCY_REQUIRED: "The currency is required and must be a valid MongoDB ObjectId.",
      STOCK_REQUIRED: "The stock is required and must be a non-negative integer."
    },
    CONTROLLER: {
      MULTIPLE_RETRIEVED_SUCCESSFULLY: "Multiple products retrieved successfully.",
      CREATED: "The product has been created successfully.",
      UPDATED: "The product has been updated successfully.",
      DELETED: "The product has been deleted successfully.",
      STOCK_ADDED: "More stock has been added to the product."    
    },
    ERROR: {
      NOT_FOUND: "The requested item was not found.",    
    },
    ROUTES: {
      INVALID_NAME: "Name must be between 3 and 40 characters long",
      INVALID_DESCRIPTION: "Description must be between 3 and 40 characters long",
      INVALID_CURRENCY: "Currency must be a valid MongoDB ID",
      INVALID_STOCK: "Stock must be a positive integer",
      INVALID_OPTIONAL_NAME: "Optional Name must be between 3 and 255 characters long",
      INVALID_OPTIONAL_DESCRIPTION: "Optional Description must be between 3 and 255 characters long",
      INVALID_PRODUCT_ID: "Product ID must be a valid MongoDB ID",
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
      NOT_FOUND: "The service was not found",
    },
    ROUTES: {
      INVALID_NAME: "Name must be a string at least 3 characters long and maximum 255 characters long",
      INVALID_DESCRIPTION: "Description must be a string at least 5 characters long and maximum 255 characters long",
      INVALID_PRICE: "Price must be a positive number",
      INVALID_CURRENCY: "Currency must be a MongoID",
      INVALID_SERVICE_ID: "Service param url id must be a valid mongo id",
    },
    CONTROLLER: {
      MULTIPLE_RETRIEVED_SUCCESSFULLY: "Services retrieved successfully",
      CREATED: "Service created successfully",
      UPDATED: "Service updated successfully",
      DELETED: "Service deleted successfully",
    }
  },
  TRANSACTION: {
    DB: {
      TYPE_REQUIRED: "The type is required",
      AMOUNT_REQUIRED: "The amount is required",
      CURRENCY_REQUIRED: "The currency is required",
      ACCOUNT_REQUIRED: "The account is required",
    },
    ROUTES: {
      INVALID_ACCOUNT: "Account must be a MongoID",
      INVALID_AMOUNT: "Amount must be a positive number",
      INVALID_TYPE: "Type must be either 'DEPOSIT' or 'WITHDRAWAL'",
      INVALID_CURRENCY: "Currency must be a MongoID",
      INVALID_USER_ID: "User param url id must be a valid mongo id",
      INVALID_ACCOUNT_ID: "Account param url id must be a valid mongo id",
      INVALID_OPTIONAL_TYPE_PARAM: "If provided, type must be either 'DEPOSIT' or 'WITHDRAWAL'",
      INVALID_OPTIONAL_CURRENCY_PARAM: "If provided, currency must be a valid MongoID",
    },
    CONTROLLER: {
      MULTIPLE_RETRIEVED_SUCCESSFULLY: "Transactions retrieved successfully",
      CREATED: "Transaction created successfully",
    },
    ERROR: {
      EXCEEDED_MAX_WITHDRAWAL_PER_TRANSACTION: "The amount exceeds the maximum withdrawal per transaction",
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
    },
    CONTROLLER: {
      USER_CREATED: "User has been successfully created!",
      MULTIPLE_RETRIEVED_SUCCESSFULLY: "Users retrieved successfully",
      USER_ACCOUNTS_RETRIEVED_SUCCESSFULLY: "Users retrieved successfully",
      USER_NOT_FOUND: "User has not found in the db",
      RETRIEVED_SUCCESSFULLY: "User retrieved successfully",
    },
    ROUTES: {
      USER_EMAIL: "The email must be a valid email",
      INVALID_PASSWORD: "The password must have at least 8 characters, 1 letter LowerCase minimum, 1 letter Uppercase minimun and 1 number minimun",
      INVALID_USERNAME: "The username must be a string at least 3 characters long and maximum 255 characters long",
      INVALID_NAME: "The username must be a string at least 3 characters long and maximum 255 characters long",
      INVALID_LAST_NAME: "The username must be a string at least 3 characters long and maximum 255 characters long",
      INVALID_ADDRESS: "The address must be a string at least 3 characters long and maximum 255 characters long",
      INVALID_DPI: "The DPI must be only 13 characters long and only numbers ",
      INVALID_PHONE_NUMBER: "The phone number must be 8 characters and only numbers",
      INVALID_JOB_NAME: "The must be a string at least 3 characters long and maximum 255 characters long",
      INVALID_MONTHLY_INCOME: "The monthly income only positive numbers",
      INVALID_INITIAL_BALANCE: "The initial balance must be a positive number",
      INVALID_CURRENCY_INCOME: "The invalid currency income must be valid",
      INVALID_USER_ID: "User param url id must be a valid mongo id",
    },
    ERROR: {
      USERNAME_ALREADY_EXIST: "The username is already in use",
      EMAIL_ALREADY_EXIST: "The email is already in use",
      NOT_FOUND: "The user was not found",
    }
  }
};

export default en;
