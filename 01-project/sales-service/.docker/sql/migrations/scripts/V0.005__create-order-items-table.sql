CREATE TABLE IF NOT EXISTS sales_service.order_items (
  id uuid NOT NULL DEFAULT sales_service.uuid_generate_v4(),
  product_id uuid NOT NULL,
  order_id uuid NOT NULL,
  quantity integer NOT NULL,
  sold_price numeric(12,2) NOT NULL,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_products_fkey FOREIGN KEY(product_id) REFERENCES sales_service.products(id),
  CONSTRAINT order_items_orders_fkey FOREIGN KEY(order_id) REFERENCES sales_service.orders(id)
);