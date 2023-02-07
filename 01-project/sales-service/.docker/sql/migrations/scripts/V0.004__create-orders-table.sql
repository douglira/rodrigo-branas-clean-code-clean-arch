CREATE TABLE IF NOT EXISTS sales_service.orders (
  id uuid NOT NULL DEFAULT sales_service.uuid_generate_v4(),
  serial_code text UNIQUE NOT NULL,
  created_at timestamp NOT NULL,
  cpf text NOT NULL,
  total_amount numeric(12,2) NOT NULL,
  freight_price numeric(5,2) NOT NULL,
  coupon_id uuid,
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_coupons_fkey FOREIGN KEY(coupon_id) REFERENCES sales_service.coupons(id)
);
CREATE INDEX IF NOT EXISTS orders_serial_code_idx ON sales_service.orders (serial_code);