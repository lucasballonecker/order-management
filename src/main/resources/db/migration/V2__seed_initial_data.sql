INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Administrador', 'admin@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'ADMIN'),
(2, 'João Silva', 'joao@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'USER'),
(3, 'Maria Santos', 'maria@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'USER');

INSERT INTO products (id, name, description, price, active) VALUES 
(1, 'Notebook Dell Inspiron', 'Notebook Dell Inspiron 15 polegadas, Intel Core i5, 8GB RAM, 512GB SSD', 4500.00, true),
(2, 'Mouse Logitech MX Master 3', 'Mouse sem fio Logitech MX Master 3, Bluetooth, recarregável', 350.00, true),
(3, 'Teclado Mecânico Redragon', 'Teclado mecânico Redragon K552, switch red, RGB', 250.00, true),
(4, 'Monitor LG 27"', 'Monitor LG 27 polegadas 4K, IPS, 60Hz', 1800.00, true),
(5, 'Headset Gamer Razer', 'Headset gamer Razer BlackShark V2, 7.1 surround', 450.00, true),
(6, 'Webcam Logitech C920', 'Webcam Logitech C920, Full HD 1080p, 30fps', 380.00, true),
(7, 'Mousepad XXL', 'Mousepad XXL para gamer, superfície de tecido', 80.00, true),
(8, 'Suporte para Notebook', 'Suporte ajustável para notebook até 17 polegadas', 120.00, true),
(9, 'Hub USB 3.0', 'Hub USB 3.0 com 4 portas, plug and play', 65.00, true),
(10, 'Fone de Ouvido Bluetooth', 'Fone de ouvido Bluetooth JBL, cancelamento de ruído', 280.00, true);

INSERT INTO orders (id, user_id, status, total, created_at) VALUES 
(1, 2, 'CREATED', 4850.00, '2024-01-15 10:30:00'),
(2, 2, 'PAID', 730.00, '2024-01-16 14:20:00'),
(3, 3, 'DELIVERED', 2080.00, '2024-01-17 09:15:00'),
(4, 3, 'CREATED', 425.00, '2024-01-18 16:45:00'),
(5, 2, 'CANCELLED', 1800.00, '2024-01-19 11:30:00');

INSERT INTO order_items (id, order_id, product_id, quantity, price_at_moment) VALUES 
(1, 1, 1, 1, 4500.00),
(2, 1, 2, 1, 350.00),
(3, 2, 3, 1, 250.00),
(4, 2, 5, 1, 450.00),
(5, 2, 6, 1, 380.00),
(6, 3, 4, 1, 1800.00),
(7, 3, 7, 1, 80.00),
(8, 3, 8, 1, 120.00),
(9, 3, 9, 1, 65.00),
(10, 3, 10, 1, 280.00),
(11, 4, 2, 1, 350.00),
(12, 4, 3, 1, 250.00),
(13, 5, 4, 1, 1800.00);
