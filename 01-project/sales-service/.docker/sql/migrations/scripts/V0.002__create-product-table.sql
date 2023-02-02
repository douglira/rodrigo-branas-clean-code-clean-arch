CREATE TABLE IF NOT EXISTS sales_service.products (
  id uuid NOT NULL DEFAULT sales_service.uuid_generate_v4(),
  title text NOT NULL,
  base_price numeric NOT NULL,
  CONSTRAINT product_pkey PRIMARY KEY (id)
);