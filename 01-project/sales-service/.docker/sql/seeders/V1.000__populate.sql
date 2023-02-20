INSERT INTO sales_service.products ("id", "title", "base_price","height","width","depth","weight")
  VALUES ('ef9334b1-b7db-412c-81d8-874e87ffa562', 'Produto 1', 89.9, 12, 40, 22, 1.2);
INSERT INTO sales_service.products ("id", "title", "base_price","height","width","depth","weight")
  VALUES ('2558a6df-c01f-41db-b378-75c7402508d5', 'Produto 2', 44.9, 20, 11, 4, 0.7);
INSERT INTO sales_service.products ("id", "title", "base_price","height","width","depth","weight")
  VALUES ('a40b5de2-1038-4c7a-ac26-70d51f0e9e57', 'Produto 3', 119.9, 102, 60, 90, 3.7);
INSERT INTO sales_service.coupons ("id", "name", "discount", "expires_in")
  VALUES ('2cd903a9-197f-4e2b-bf99-9102f8455698', 'VALE20', 20, '2023-03-22 12:00:00');
INSERT INTO sales_service.coupons ("id", "name", "discount", "expires_in")
  VALUES ('21e43797-a5dc-40ea-82e3-510df6fff633', 'VALE25', 25, '2023-01-25 12:00:00');
INSERT INTO sales_service.addresses ("id", "postal_code", "street_number", "country", "city", "neighborhood", "province", "street", "additional_data", "lat", "lng")
  VALUES ('51e02101-c375-47de-8e6e-ba8d028e6d16', '06020010', '1496', 'Brasil', 'Osasco', 'Vila Yara', 'São Paulo', 'Av. dos Autonomistas', NULL, '-23.540866', '-46.76731');
INSERT INTO sales_service.stores ("id", "name", "address_id")
  VALUES ('9bfe400a-a15b-496f-ba66-a2e7cb564c1a', 'iSale Garage', '51e02101-c375-47de-8e6e-ba8d028e6d16');
