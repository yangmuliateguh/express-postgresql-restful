# Database Schema Documentation

**Project:** Express PostgreSQL RESTful API  
**Version:** v1.0.0  
**Database:** PostgreSQL 12+  
**Migration File:** `src/database/migrations/001_create_users_services_products.up.sql`

---

## 📋 Table of Contents
- [Overview](#overview)
- [Schema Diagram](#schema-diagram)
- [Table: users](#table-users)
- [Table: products](#table-products)
- [Table: services](#table-services)
- [Indexes & Constraints](#indexes--constraints)
- [Data Types & Defaults](#data-types--defaults)
- [Relationships](#relationships)
- [Sample Data](#sample-data)
- [Migration SQL](#migration-sql)

---

## Overview

Database consists of **3 tables**:

| Table | Purpose | Row Estimate (dev) |
|-------|---------|-------------------|
| `users` | Authentication & authorization | ~10-100 |
| `products` | Inventory / product catalog | ~10-1000 |
| `services` | Service catalog | ~5-100 |

No foreign keys defined (denormalized for simplicity). All tables have `created_at` timestamp, no `updated_at` (immutable records).

---

## Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                             users                                   │
├─────────────┬─────────────┬───────┬─────────────┬───────────────────┤
│ id (PK)     │ email (UQ)  │ name  │ role        │ created_at        │
│ SERIAL      │ VARCHAR(255)│ VARCHAR│ VARCHAR(50) │ TIMESTAMP         │
│             │ NOT NULL    │ NULL  │ DEFAULT 'user'│ DEFAULT NOW     │
└─────────────┴─────────────┴───────┴─────────────┴───────────────────┘
                            ↑
         ┌──────────────────┼──────────────────┐
         │                  │                  │
┌───────────────┐  ┌───────────────────┐  ┌──────────────────┐
│  products     │  │   services        │  │ (no relations)   │
├───────────────┤  ├───────────────────┤  └──────────────────┘
│ id (PK)       │  │ id (PK)           │
│ name          │  │ name              │
│ category      │  │ description       │
│ stock         │  │ price             │
│ price         │  │ created_at        │
│ created_at    │  │                   │
└───────────────┘  └───────────────────┘
```

---

## Table: `users`

**Filename:** `src/auth/auth.service.js`  
**Purpose:** Store user credentials and RBAC roles

### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment user ID |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email (login identifier) |
| `password` | TEXT | NOT NULL | Bcrypt-hhed password string |
| `name` | VARCHAR(100) | NULLABLE | User's full name |
| `role` | VARCHAR(50) | DEFAULT `'user'` | RBAC role: `'admin'` or `'user'` |
| `created_at` | TIMESTAMP | DEFAULT `CURRENT_TIMESTAMP` | Registration timestamp |

### Indexes

| Index | Columns | Type |
|-------|---------|------|
| `users_pkey` | `id` | PRIMARY KEY (implicit) |
| `users_email_key` | `email` | UNIQUE (implicit) |
| *(none)* | *No additional indexes* | |

### Business Rules

- **Email uniqueness:** enforced at database level (`UNIQUE` constraint)
- **Password:** never stored plaintext, always hashed with bcrypt before INSERT/UPDATE
- **Role assignment:**
  - Default: `'user'` if omitted during registration
  - Allowed values: `['admin', 'user']`
  - Role escalation only possible via direct database UPDATE or registration with `role='admin'` if passed
- **No email validation** at DB level (app-level only)

### Sample Query

```sql
-- Check if user exists
SELECT id, email, name, role, created_at
FROM users
WHERE email = 'admin@example.com';
```

---

## Table: `products`

**Filename:** `src/modules/products/product.service.js`  
**Purpose:** Product inventory management

### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment product ID |
| `name` | VARCHAR(100) | NOT NULL | Product name |
| `category` | VARCHAR(50) | NULLABLE | Product category (e.g. "Electronics") |
| `stock` | INTEGER | DEFAULT `0` | Available stock quantity |
| `price` | NUMERIC(10, 2) | NULLABLE | Price in Rupiah / currency (max 10 digits, 2 decimal) |
| `created_at` | TIMESTAMP | DEFAULT `CURRENT_TIMESTAMP` | Creation timestamp |

### Indexes

| Index | Columns | Type |
|-------|---------|------|
| `products_pkey` | `id` | PRIMARY KEY |

### Business Rules

- **Name required:** `NOT NULL` constraint
- **Category default:** `'uncategorized'` if not provided (app-level, NOT DB)
- **Stock default:** `0` if not provided (app-level via `data.stock ?? 0`)
- **Price parsing:** Converted to float via `parseFloat()` in service layer
- **No negative stock check** (application should validate in future)
- **No soft delete** – DELETE permanently removes row

### Sample Query

```sql
-- Get all products with price > 1,000,000
SELECT id, name, category, stock, price, created_at
FROM products
WHERE price > 1000000
ORDER BY created_at DESC;
```

---

## Table: `services`

**Filename:** `src/modules/services/service.service.js`  
**Purpose:** Service catalog management

### Columns

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | SERIAL | PRIMARY KEY | Auto-increment service ID |
| `name` | VARCHAR(100) | NOT NULL | Service name |
| `description` | TEXT | NULLABLE | Service description / details |
| `price` | NUMERIC(10, 2) | NULLABLE | Service price |
| `created_at` | TIMESTAMP | DEFAULT `CURRENT_TIMESTAMP` | Creation timestamp |

### Indexes

| Index | Columns | Type |
|-------|---------|------|
| `services_pkey` | `id` | PRIMARY KEY |

### Business Rules

- **Name required:** `NOT NULL` constraint
- **Description optional:** can be `NULL` or text up to unlimited length (TEXT)
- **Price optional:** can be `NULL` (free service or quote-on-request)
- No additional constraints

### Sample Query

```sql
-- Search services by name keyword
SELECT id, name, description, price, created_at
FROM services
WHERE LOWER(name) LIKE '%consult%';
```

---

## Indexes & Constraints

### Primary Keys (automatically created)
```sql
ALTER TABLE users ADD PRIMARY KEY (id);
ALTER TABLE products ADD PRIMARY KEY (id);
ALTER TABLE services ADD PRIMARY KEY (id);
```

### Unique Constraints
```sql
ALTER TABLE users ADD UNIQUE (email);
```

### Check Constraints
*(None defined – can be added for: `price >= 0`, `stock >= 0`, `role IN ('admin','user')`)*

### Foreign Keys
*(None – tables are independent)*

---

## Data Types & Defaults

| Data Type | Usage | Notes |
|-----------|-------|-------|
| `SERIAL` | `id` columns | Auto-increment integer (4-byte) |
| `VARCHAR(n)` | `name`, `email`, `category`, `role` | Variable-length with limit |
| `TEXT` | `password`, `description` | Unlimited length |
| `INTEGER` | `stock` | Whole numbers |
| `NUMERIC(10,2)` | `price` | Fixed precision decimal; max 99999999.99 |
| `TIMESTAMP` | `created_at` | Date + time with timezone support |

### Default Values
- All `created_at`: `CURRENT_TIMESTAMP` (set at DB level)
- `users.role`: `'user'`
- `products.category`: `'uncategorized'` (app-level, NOT enforced)
- `products.stock`: `0` (app-level via `??` operator)

---

## Relationships

### Entity Relationship Diagram (ERD)

```
┌─────────┐       ┌────────────┐       ┌──────────┐
│  users  │       │ products   │       │ services │
├─────────┤       ├────────────┤       ├──────────┤
│ id (PK) │       │ id (PK)    │       │ id (PK)  │
│ email   │       │ name       │       │ name     │
│ name    │       │ category   │       │ desc     │
│ role    │       │ stock      │       │ price    │
│ created │       │ price      │       │ created  │
└─────────┘       │ created   │       └──────────┘
                  └───────────┘
```

**Relationship Type:** No foreign keys → independent tables

---

## Sample Data

### Insert Sample User (Admin)
```sql
INSERT INTO users (email, password, name, role)
VALUES (
  'admin@example.com',
  '$2b$08$ExampleHashedPasswordHere1234567890123456789012345',
  'Administrator',
  'admin'
);
```

### Insert Sample Product
```sql
INSERT INTO products (name, category, stock, price)
VALUES (
  'Laptop Gaming ASUS ROG',
  'Electronics',
  10,
  18000000.00
);
```

### Insert Sample Service
```sql
INSERT INTO services (name, description, price)
VALUES (
  'Web Development',
  'Custom full-stack website development using React & Node.js',
  15000000.00
);
```

---

## Migration SQL

**File:** `src/database/migrations/001_create_users_services_products.up.sql`

```sql
-- Tabel users: untuk login dan otentikasi
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel services: dummy fitur bisnis
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel products: dummy fitur bisnis
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  stock INTEGER DEFAULT 0,
  price NUMERIC(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notes on Migration
- Uses `IF NOT EXISTS` – safe to re-run (will not drop existing data)
- All `created_at` columns auto-set to current timestamp on insert
- No `FOREIGN KEY` constraints
- No additional indexes beyond PK and unique constraints

---

## Database Operations via Code

### Query Layer: `crud.js`

| Function | SQL Operation | Usage |
|----------|--------------|-------|
| `create(table, data)` | `INSERT INTO ... RETURNING *` | Insert new row |
| `getAll(table)` | `SELECT * FROM table` | Fetch all rows |
| `getById(table, column, value)` | `SELECT * FROM table WHERE column = $1` | Fetch single row |
| `update(table, column, value, data)` | `UPDATE ... SET ... WHERE ... RETURNING *` | Update row |
| `remove(table, column, value)` | `DELETE FROM ... WHERE ... RETURNING *` | Delete row |

### Query Layer: `others.js`

| Function | SQL Operation | Purpose |
|----------|--------------|---------|
| `existsByColumn(table, column, value)` | `SELECT 1 FROM ... WHERE ... LIMIT 1` | Check record exists (bool) |
| `findByColumn(table, column, value, fields)` | `SELECT fields FROM ... WHERE ... LIMIT 1` | Find single record |

### Parameterized Queries
All queries use `$n` placeholders to prevent SQL injection:
```javascript
// Example from crud.js
const query = `SELECT * FROM users WHERE email = $1`
const result = await db.query(query, [email])
```

---

## Production Considerations

This schema is designed for **educational use**. For production, consider:

1. **Additional Constraints:**
   ```sql
   ALTER TABLE products ADD CONSTRAINT chk_price_nonnegative CHECK (price >= 0);
   ALTER TABLE products ADD CONSTRAINT chk_stock_nonnegative CHECK (stock >= 0);
   ALTER TABLE users ADD CONSTRAINT chk_role_valid CHECK (role IN ('admin', 'user'));
   ```

2. **Indexes for Performance:**
   ```sql
   CREATE INDEX idx_products_category ON products(category);
   CREATE INDEX idx_services_name ON services(name);
   ```

3. **Timestamps:** Add `updated_at` column with trigger or application update
   ```sql
   ALTER TABLE products ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
   ```

4. **Foreign Keys:** If you have orders, carts, etc., link via `user_id` foreign key

5. **Audit Trail:** Create separate `audit_logs` table for change history

6. **Soft Deletes:** Add `deleted_at` nullable column instead of hard delete

7. **Full-Text Search:** Add `tsvector` columns for `products.name` / `services.name` search

8. **Connection Pooling:** Configure `pg.Pool` with `max`, `idleTimeoutMillis`, `connectionTimeoutMillis`

---

## Database Connection

**File:** `src/config/db.js`

```javascript
const pool = new Pool({
  user: process.env.DB_USER,      // from .env
  host: process.env.DB_HOST,      // 'localhost'
  database: process.env.DB_NAME,  // 'express_dev'
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT       // 5432
})

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
}
```

**No SSL required** (development only). Production should use `ssl: { rejectUnauthorized: false }` or connect via managed DB service.

---

## Database Reset / Reset Script

To wipe all data and restart fresh:

```bash
# Option 1: Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS express_dev;"
psql -U postgres -c "CREATE DATABASE express_dev;"
psql -U postgres -d express_dev -f src/database/migrations/001_create_users_services_products.up.sql

# Option 2: Truncate all tables (preserve structure)
psql -U postgres -d express_dev -c "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"
psql -U postgres -d express_dev -c "TRUNCATE TABLE products RESTART IDENTITY CASCADE;"
psql -U postgres -d express_dev -c "TRUNCATE TABLE services RESTART IDENTITY CASCADE;"

# Option 3: Via application (if you create seed endpoint – not in current code)
```

---

**END OF DATABASE DOCUMENTATION**
