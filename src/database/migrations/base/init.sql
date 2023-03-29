CREATE TABLE IF NOT EXISTS "o_product" (
  "id" SERIAL PRIMARY KEY,
  "symbol" varchar(20),
  "slippage" decimal(32,16),
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE IF NOT EXISTS "o_order" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL,
  "price" decimal(32,16) NOT NULL,
  "amount" decimal(32,16) NOT NULL,
  "side" int NOT NULL,
  "time" timestamp,
  "user_id" int NOT NULL,
  "status" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "o_user" (
  "id" SERIAL PRIMARY KEY,
  "address" varchar(100),
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now()),
  UNIQUE ("address")
);

CREATE TABLE IF NOT EXISTS "o_candle" (
  "id" SERIAL PRIMARY KEY,
  "product_id" int NOT NULL,
  "open" decimal(32,16) NOT NULL,
  "close" decimal(32,16) NOT NULL,
  "high" decimal(32,16) NOT NULL,
  "low" decimal(32,16) NOT NULL,
  "volume" decimal(32,16) NOT NULL,
  "time" bigint NOT NULL,
  "granularity" int NOT NULL,
  UNIQUE ("product_id", "granularity", "time")
);

ALTER TABLE "o_order" ADD FOREIGN KEY ("product_id") REFERENCES "o_product" ("id");

ALTER TABLE "o_candle" ADD FOREIGN KEY ("product_id") REFERENCES "o_product" ("id");

ALTER TABLE "o_order" ADD FOREIGN KEY ("user_id") REFERENCES "o_user" ("id");