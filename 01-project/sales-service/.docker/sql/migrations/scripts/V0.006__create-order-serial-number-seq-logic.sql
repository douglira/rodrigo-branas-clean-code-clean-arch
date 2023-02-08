CREATE SEQUENCE IF NOT EXISTS sales_service.order_serial_number_seq;

CREATE OR REPLACE FUNCTION sales_service.get_order_serial_number_seq()
	RETURNS TEXT
	RETURN (CONCAT(DATE_PART('year', CURRENT_DATE), LPAD((NEXTVAL('sales_service.order_serial_number_seq'))::TEXT, 8, '0')));