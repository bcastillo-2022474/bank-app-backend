# Bank Application Documentation

This document provides an overview of the database schema, relations, and project details for the Bank Application.

## Database Schema

### User

```rust
Table User {
  // SYSTEM INFO
  id int [pk]
  email varchar [unique, not null]
  username varchar [unique, not null]
  password varchar [not null]

  // PERSONAL INFO
  name varchar [not null]
  last_name varchar [not null]
  address varchar
  DPI varchar [not null]
  phone_number varchar [not null]
  job_name varchar [not null]
  monthly_income double [not null]
  currency_income Currency [Ref: > Currency.id]

  // properties
  main_account Account [ref: - Account.id, not null]
  accounts Account[] [ref: <> Account.id, default: '[]']
  
  // TUPLE INFO
  created_at timestamp [not null]
  updated_at timestamp
  created_by User

  tp_status varchar [not null, default: 'ACTIVE']
}
```

The `User` table stores user information, including system and personal details. Each user has a main account (`main_account`) and can have multiple additional accounts (`accounts`).

### Account

```rust
Table Account {
  id int [pk]
  owner User [ref: > User.id, not null]
  currency Currency [ref: > Currency.id, not null]
  // balance
  balance double [not null]

  tp_status varchar [not null, default: 'ACTIVE']
}
```

The `Account` table represents a bank account owned by a user. It stores the account balance and the associated currency.

### FavoriteAccounts

```rust
Table FavoriteAccounts {
  id int [pk]
  account Account [ref: > Account.id, not null]
  owner Account [ref: > Account.id, not null]
  alias varchar [not null]
}
```

The `FavoriteAccounts` table allows users to store favorite accounts for quick transfers, along with an alias for each favorite account.

### Currency

```rust
Table Currency {
  id int [pk]
  symbol varchar [unique, not null]
  name varchar [unique, not null]
  // USED FOR THE API
  key varchar [unique, not null]

  tp_status varchar [not null, default: 'ACTIVE']
}
```

The `Currency` table stores information about available currencies and their exchange rates relative to a base currency.

### Movements

The following tables represent different types of movements or transactions related to bank accounts:

#### Transaction

```rust
Table Transaction {
  // DEPOSIT || WITHDRAWAL
  type varchar [not null]
  quantity double [not null]
  currency Currency [ref: > Currency.id, not null]
  account Account [ref: > Account.id, not null]

  // TUPLE INFO
  created_at timestamp [not null]
  updated_at timestamp [not null]

  tp_status varchar [not null, default: 'ACTIVE']
}
```

The `Transaction` table records deposits and withdrawals from accounts.

#### Transference

```rust
Table Transference {
  account_given Account [ref: > Account.id, not null]
  account_receiver Account [ref: > Account.id, not null]
  quantity double [not null]
  currency Currency [ref: > Currency.id, not null]

  // TUPLE INFO
  created_at timestamp [not null]
  updated_at timestamp [not null]

  tp_status varchar [not null, default: 'ACTIVE']
}
```

The `Transference` table records transfers between accounts.

#### Payout

```rust
Table Payout {
  id int [pk]
  service Service [ref: > Service.id, not null]
  // WE MIGHT NOT PAY EVERYTHING IN
  // ONE GO
  total double [not null]
  debited_account Account [ref: > Account.id, not null]

  // TUPLE INFO
  created_at timestamp [not null]
  updated_at timestamp [not null]

  tp_status varchar [not null, default: 'ACTIVE']
}
```

The `Payout` table records payments for services, where the amount is debited from a specific account.

#### Purchase

```rust
Table Purchase {
  id int [pk]
  purchaser Account [ref: > Account.id, not null]
  product Product [ref: > Product.id, not null]
  quantity int [not null]
  total double [not null]
  currency Currency [ref: > Currency.id, not null]

  // TUPLE INFO
  created_at timestamp [not null]
  updated_at timestamp [not null]

  tp_status varchar [not null, default: 'ACTIVE']
}
```

The `Purchase` table records purchases of products, where the amount is debited from a specific account.

### Service

```rust
Table Service {
  id int [pk]
  name varchar [not null]
  description varchar [not null]
  // FOR NOW, IT WILL BE A FIXED PRICE
  price double [not null]
  currency Currency [ref: > Currency.id,not null]

  // TUPLE INFO
  created_at timestamp [not null]
  updated_at timestamp [not null]

  tp_status varchar [not null, default: 'ACTIVE']
}
```

The `Service` table represents services (e.g., utility bill payments) that can be paid through the application.

### Product

```rust
Table Product {
  id int [pk]
  name varchar [not null]
  description varchar [not null]
  // FOR NOW, IT WILL BE A FIXED PRICE
  price double [not null]
  currency Currency [ref: > Currency.id,not null]
  stock int [not null]

  // TUPLE INFO
  created_at timestamp [not null]
  updated_at timestamp [not null]

  tp_status varchar [not null, default: 'ACTIVE']
}
```

The `Product` table represents physical products that can be purchased through the application.

## Relations

- **User** to **Account**: A user can have one main account (`main_account`) and multiple additional accounts (`accounts`).
- **Account** to **User**: An account is owned by a user.
- **FavoriteAccounts** to **Account**: A favorite account is associated with a specific account.
- **Transaction**, **Transference**, **Payout**, and **Purchase** to **Account**: These tables record movements or transactions related to accounts.
- **Payout** to **Service**: A payout is associated with a service.
- **Purchase** to **Product**: A purchase is associated with a product.
- **Service** and **Product** to **Currency**: Services and products have prices in a specific currency.

## Project Overview

The Bank Application is a web-based system that allows users to manage their bank accounts, perform transactions, and access exclusive services and products offered by the bank.

The application has two main user roles:

1. **Administrator**:
   - Can create and manage user accounts (except for other administrators)
   - Can view account balances and recent transactions for each user
   - Can manage services and products offered by the bank
   - Can perform deposits (which can be reversed within a specific time frame)

2. **Client**:
   - Can view and edit their personal information (except for DPI and password)
   - Can view account balances and transaction history
   - Can perform transfers to other accounts (subject to daily and per-transaction limits)
   - Can add favorite accounts for quick transfers
   - Can access an API for currency conversion
   - Can purchase exclusive products offered by the bank
   - Can pay for services through the application

The application handles various types of movements or transactions, such as deposits, withdrawals, transfers, service payments, and product purchases. Each movement is recorded in the respective table, with details like the involved accounts, amounts, currencies, and timestamps.

Services and products offered by the bank are stored in separate tables, allowing for easy management and association with payments or purchases.

The application supports multiple currencies, with exchange rates retrieved from [external API](https://github.com/fawazahmed0/exchange-api). Users can have accounts in different currencies and perform transactions across currencies, with the appropriate conversions applied.
