INSERT INTO sales_service.products ("id", "title", "base_price","height","width","depth","weight")
  VALUES ('ef9334b1-b7db-412c-81d8-874e87ffa562', 'Produto 1', 89.9, 12, 40, 22, 1.2);
INSERT INTO sales_service.products ("id", "title", "base_price","height","width","depth","weight")
  VALUES ('2558a6df-c01f-41db-b378-75c7402508d5', 'Produto 2', 44.9, 20, 11, 4, 0.7);
INSERT INTO sales_service.products ("id", "title", "base_price","height","width","depth","weight")
  VALUES ('a40b5de2-1038-4c7a-ac26-70d51f0e9e57', 'Produto 3', 119.9, 102, 60, 90, 3.7);
INSERT INTO sales_service.coupons ("id", "name", "discount", "expires_in")
  VALUES ('2cd903a9-197f-4e2b-bf99-9102f8455698', 'VALE20', 20, CURRENT_DATE + INTERVAL '30 day');
INSERT INTO sales_service.coupons ("id", "name", "discount", "expires_in")
  VALUES ('21e43797-a5dc-40ea-82e3-510df6fff633', 'VALE25', 25, CURRENT_DATE + INTERVAL '30 day');
INSERT INTO sales_service.coupons ("id", "name", "discount", "expires_in")
  VALUES ('21e43797-a5dc-40ea-82e3-a2e7cb564c1a', 'BEMVINDO10', 10, CURRENT_DATE - INTERVAL '10 day');
INSERT INTO sales_service.addresses ("id", "postal_code", "street_number", "country", "city", "neighborhood", "province", "street", "additional_data", "lat", "lng")
  VALUES ('51e02101-c375-47de-8e6e-ba8d028e6d16', '06020010', '1496', 'Brasil', 'Osasco', 'Vila Yara', 'São Paulo', 'Av. dos Autonomistas', NULL, '-23.540866', '-46.76731');
INSERT INTO sales_service.stores ("id", "name", "address_id")
  VALUES ('9bfe400a-a15b-496f-ba66-a2e7cb564c1a', 'iSale Garage - Osasco', '51e02101-c375-47de-8e6e-ba8d028e6d16');
INSERT INTO sales_service.addresses ("id", "postal_code", "street_number", "country", "city", "neighborhood", "province", "street", "additional_data", "lat", "lng")
  VALUES ('1120c184-0a2b-4d93-b0f4-fb2bc46a5f99', '13087460', '660', 'Brasil', 'Campinas', 'Mansões Santo Antônio', 'São Paulo', 'Rua Jasmin', NULL, '-22.854876', '-47.051134');
INSERT INTO sales_service.stores ("id", "name", "address_id")
  VALUES ('cbee8e68-6413-486f-b373-e4d3fa7418b1', 'iSale Garage - Campinas', '1120c184-0a2b-4d93-b0f4-fb2bc46a5f99');
INSERT INTO sales_service.addresses ("id", "postal_code", "street_number", "country", "city", "neighborhood", "province", "street", "additional_data", "lat", "lng")
  VALUES ('edde3d87-9021-4521-9bfc-9168f033b874', '80230030', '675', 'Brasil', 'Curitiba', 'Rebouças', 'São Paulo', 'Av. Presidente Getúlio Vargas', NULL, '-25.442907', '-49.266557');
INSERT INTO sales_service.stores ("id", "name", "address_id")
  VALUES ('a8336065-288f-4c50-96c5-f0c9965b8f81', 'iSale Garage - Curitiba', 'edde3d87-9021-4521-9bfc-9168f033b874');
