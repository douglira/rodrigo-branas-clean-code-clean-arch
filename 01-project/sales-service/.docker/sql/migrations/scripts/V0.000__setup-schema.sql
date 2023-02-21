CREATE SCHEMA IF NOT EXISTS sales_service;

CREATE EXTENSION IF NOT EXISTS "cube" SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS "earthdistance" SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA pg_catalog;

CREATE TABLE IF NOT EXISTS sales_service.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  base_price NUMERIC NOT NULL,
  height NUMERIC NOT NULL,
  width NUMERIC NOT NULL,
  depth NUMERIC NOT NULL,
  "weight" NUMERIC NOT NULL,
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sales_service.coupons (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  discount NUMERIC NOT NULL,
  expires_in TIMESTAMP NOT NULL,
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sales_service.orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  serial_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL,
  cpf TEXT NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  freight_price NUMERIC(10,2) NOT NULL,
  coupon_id uuid,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_coupons_fkey FOREIGN KEY(coupon_id) REFERENCES sales_service.coupons(id)
);
CREATE INDEX IF NOT EXISTS orders_serial_code_idx ON sales_service.orders (serial_code);

CREATE TABLE IF NOT EXISTS sales_service.order_items (
  product_id uuid NOT NULL,
  order_id uuid NOT NULL,
  quantity INTEGER NOT NULL,
  sold_price NUMERIC(12,2) NOT NULL,
  CONSTRAINT order_items_products_fkey FOREIGN KEY(product_id) REFERENCES sales_service.products(id),
  CONSTRAINT order_items_orders_fkey FOREIGN KEY(order_id) REFERENCES sales_service.orders(id)
);
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON sales_service.order_items (order_id);

CREATE SEQUENCE IF NOT EXISTS sales_service.order_serial_number_seq;

CREATE OR REPLACE FUNCTION sales_service.get_order_serial_number_seq()
	RETURNS TEXT
	RETURN (CONCAT(DATE_PART('year', CURRENT_DATE), LPAD((NEXTVAL('sales_service.order_serial_number_seq'))::TEXT, 8, '0')));

CREATE TABLE IF NOT EXISTS sales_service.addresses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  postal_code TEXT NOT NULL,
  street_number TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  neighborhood TEXT,
  province TEXT NOT NULL,
  street TEXT NOT NULL,
  additional_data TEXT,
  lat TEXT NOT NULL,
  lng TEXT NOT NULL,
  CONSTRAINT addresses_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS sales_service.stores (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL,
  address_id uuid NOT NULL,
  CONSTRAINT stores_pkey PRIMARY KEY (id),
  CONSTRAINT stores_addresses_fkey FOREIGN KEY (address_id) REFERENCES sales_service.addresses(id)
);