CREATE TABLE IF NOT EXISTS sales_service.coupons (
  id uuid NOT NULL DEFAULT sales_service.uuid_generate_v4(),
  "name" text NOT NULL,
  discount numeric NOT NULL,
  CONSTRAINT coupon_pkey PRIMARY KEY (id)
);