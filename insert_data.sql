USE TechPix;

-- Insert cities
INSERT INTO City (city) VALUES 
('São Paulo'),
('Rio de Janeiro'),
('Belo Horizonte'),
('Brasília'),
('Porto Alegre');

-- Insert addresses
INSERT INTO Address (street, number, postalCode, district, fkCity) VALUES 
('Av. Paulista', '1000', '01310-100', 'Bela Vista', 1),
('Rua Tecnologia', '200', '22031-070', 'Centro', 2),
('Av. Digital', '500', '30130-110', 'Savassi', 3),
('Rua dos Servidores', '404', '70070-120', 'Asa Norte', 4),
('Av. Dados', '128', '90570-020', 'Petrópolis', 5);

-- Insert servers (all associated with company ID 1)
-- Multiple servers per quadrant (position)
INSERT INTO Server (hostName, macAddress, status, position, mobuId, operationalSystem, active, fkCompany) VALUES 
-- Position 1 (Quadrant 1)
('srv-q1-01', '00:1A:2B:3C:4D:5E', 'online', 1, 'MOBU001', 'Linux', 1, 1),
('srv-q1-02', '00:1A:2B:3C:4D:5F', 'online', 1, 'MOBU002', 'Windows', 1, 1),
('srv-q1-03', '00:1A:2B:3C:4D:60', 'online', 1, 'MOBU003', 'Linux', 1, 1),

-- Position 2 (Quadrant 2)
('srv-q2-01', '00:1A:2B:3C:4D:61', 'online', 2, 'MOBU004', 'Linux', 1, 1),
('srv-q2-02', '00:1A:2B:3C:4D:62', 'online', 2, 'MOBU005', 'Windows', 1, 1),
('srv-q2-03', '00:1A:2B:3C:4D:63', 'online', 2, 'MOBU006', 'Linux', 1, 1),

-- Position 3 (Quadrant 3)
('srv-q3-01', '00:1A:2B:3C:4D:64', 'online', 3, 'MOBU007', 'Linux', 1, 1),
('srv-q3-02', '00:1A:2B:3C:4D:65', 'online', 3, 'MOBU008', 'Windows', 1, 1),
('srv-q3-03', '00:1A:2B:3C:4D:66', 'online', 3, 'MOBU009', 'Linux', 1, 1),

-- Position 4 (Quadrant 4)
('srv-q4-01', '00:1A:2B:3C:4D:67', 'online', 4, 'MOBU010', 'Linux', 1, 1),
('srv-q4-02', '00:1A:2B:3C:4D:68', 'online', 4, 'MOBU011', 'Windows', 1, 1),
('srv-q4-03', '00:1A:2B:3C:4D:69', 'online', 4, 'MOBU012', 'Linux', 1, 1);

-- Insert components for each server
INSERT INTO Component (name, type, description, fkServer, serial, active) VALUES 
-- Components for server 1 (Position 1)
('CPU', 'Processor', 'Intel i7', 1, 'CPU123456', 1),
('RAM', 'Memory', '16GB DDR4', 1, 'RAM123456', 1),
('Disk', 'Storage', '1TB SSD', 1, 'DISK123456', 1),

-- Components for server 2 (Position 1)
('CPU', 'Processor', 'AMD Ryzen', 2, 'CPU234567', 1),
('RAM', 'Memory', '32GB DDR4', 2, 'RAM234567', 1),
('Disk', 'Storage', '2TB SSD', 2, 'DISK234567', 1),

-- Components for server 3 (Position 1)
('CPU', 'Processor', 'Intel Xeon', 3, 'CPU345678', 1),
('RAM', 'Memory', '64GB DDR4', 3, 'RAM345678', 1),
('Disk', 'Storage', '4TB SSD', 3, 'DISK345678', 1),

-- Components for server 4 (Position 2)
('CPU', 'Processor', 'Intel i9', 4, 'CPU456789', 1),
('RAM', 'Memory', '32GB DDR4', 4, 'RAM456789', 1),
('Disk', 'Storage', '2TB SSD', 4, 'DISK456789', 1),

-- Components for server 5 (Position 2)
('CPU', 'Processor', 'AMD EPYC', 5, 'CPU567890', 1),
('RAM', 'Memory', '64GB DDR4', 5, 'RAM567890', 1),
('Disk', 'Storage', '4TB SSD', 5, 'DISK567890', 1),

-- Components for server 6 (Position 2)
('CPU', 'Processor', 'Intel i7', 6, 'CPU678901', 1),
('RAM', 'Memory', '16GB DDR4', 6, 'RAM678901', 1),
('Disk', 'Storage', '1TB SSD', 6, 'DISK678901', 1),

-- Components for server 7 (Position 3)
('CPU', 'Processor', 'AMD Ryzen', 7, 'CPU789012', 1),
('RAM', 'Memory', '32GB DDR4', 7, 'RAM789012', 1),
('Disk', 'Storage', '2TB SSD', 7, 'DISK789012', 1),

-- Components for server 8 (Position 3)
('CPU', 'Processor', 'Intel Xeon', 8, 'CPU890123', 1),
('RAM', 'Memory', '64GB DDR4', 8, 'RAM890123', 1),
('Disk', 'Storage', '4TB SSD', 8, 'DISK890123', 1),

-- Components for server 9 (Position 3)
('CPU', 'Processor', 'Intel i9', 9, 'CPU901234', 1),
('RAM', 'Memory', '32GB DDR4', 9, 'RAM901234', 1),
('Disk', 'Storage', '2TB SSD', 9, 'DISK901234', 1),

-- Components for server 10 (Position 4)
('CPU', 'Processor', 'AMD EPYC', 10, 'CPU012345', 1),
('RAM', 'Memory', '64GB DDR4', 10, 'RAM012345', 1),
('Disk', 'Storage', '4TB SSD', 10, 'DISK012345', 1),

-- Components for server 11 (Position 4)
('CPU', 'Processor', 'Intel i7', 11, 'CPU123450', 1),
('RAM', 'Memory', '16GB DDR4', 11, 'RAM123450', 1),
('Disk', 'Storage', '1TB SSD', 11, 'DISK123450', 1),

-- Components for server 12 (Position 4)
('CPU', 'Processor', 'AMD Ryzen', 12, 'CPU234501', 1),
('RAM', 'Memory', '32GB DDR4', 12, 'RAM234501', 1),
('Disk', 'Storage', '2TB SSD', 12, 'DISK234501', 1);

-- Insert measures for each component
INSERT INTO Measure (measureType, limiterValue, fkComponent) VALUES 
-- Measures for CPU components
('Usage', 90, 1), -- CPU Server 1
('Usage', 90, 4), -- CPU Server 2
('Usage', 90, 7), -- CPU Server 3
('Usage', 90, 10), -- CPU Server 4
('Usage', 90, 13), -- CPU Server 5
('Usage', 90, 16), -- CPU Server 6
('Usage', 90, 19), -- CPU Server 7
('Usage', 90, 22), -- CPU Server 8
('Usage', 90, 25), -- CPU Server 9
('Usage', 90, 28), -- CPU Server 10
('Usage', 90, 31), -- CPU Server 11
('Usage', 90, 34), -- CPU Server 12

-- Measures for RAM components
('Usage', 85, 2), -- RAM Server 1
('Usage', 85, 5), -- RAM Server 2
('Usage', 85, 8), -- RAM Server 3
('Usage', 85, 11), -- RAM Server 4
('Usage', 85, 14), -- RAM Server 5
('Usage', 85, 17), -- RAM Server 6
('Usage', 85, 20), -- RAM Server 7
('Usage', 85, 23), -- RAM Server 8
('Usage', 85, 26), -- RAM Server 9
('Usage', 85, 29), -- RAM Server 10
('Usage', 85, 32), -- RAM Server 11
('Usage', 85, 35), -- RAM Server 12

-- Measures for Disk components
('Usage', 80, 3), -- Disk Server 1
('Usage', 80, 6), -- Disk Server 2
('Usage', 80, 9), -- Disk Server 3
('Usage', 80, 12), -- Disk Server 4
('Usage', 80, 15), -- Disk Server 5
('Usage', 80, 18), -- Disk Server 6
('Usage', 80, 21), -- Disk Server 7
('Usage', 80, 24), -- Disk Server 8
('Usage', 80, 27), -- Disk Server 9
('Usage', 80, 30), -- Disk Server 10
('Usage', 80, 33), -- Disk Server 11
('Usage', 80, 36); -- Disk Server 12

-- Insert alerts for each measure (multiple alerts per machine with different dates)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure) VALUES 
-- Alerts for Server 1 (Position 1)
('Warning', 85.5, 3200, 75.2, 12000000000, 65, 650000000000, '2023-01-15 08:30:00', 1), -- CPU
('Critical', 95.2, 3400, 82.1, 13000000000, 70, 700000000000, '2023-02-20 14:45:00', 1), -- CPU
('Warning', 70.5, 3100, 80.5, 12800000000, 60, 600000000000, '2023-03-10 10:15:00', 2), -- RAM
('Critical', 65.2, 3000, 92.8, 14800000000, 65, 650000000000, '2023-04-05 16:30:00', 2), -- RAM
('Warning', 60.8, 2900, 70.2, 11200000000, 75.5, 755000000000, '2023-05-12 09:45:00', 3), -- Disk
('Critical', 55.5, 2800, 65.8, 10500000000, 88.2, 882000000000, '2023-06-18 11:20:00', 3), -- Disk

-- Alerts for Server 2 (Position 1)
('Warning', 82.3, 3300, 72.5, 23000000000, 62, 1240000000000, '2023-01-18 09:30:00', 4), -- CPU
('Critical', 93.1, 3500, 80.2, 25600000000, 68, 1360000000000, '2023-02-22 15:45:00', 4), -- CPU
('Warning', 68.7, 3200, 78.9, 25200000000, 58, 1160000000000, '2023-03-12 11:15:00', 5), -- RAM
('Critical', 63.4, 3100, 90.5, 28900000000, 63, 1260000000000, '2023-04-08 17:30:00', 5), -- RAM
('Warning', 58.9, 3000, 68.4, 21800000000, 73.2, 1464000000000, '2023-05-15 10:45:00', 6), -- Disk
('Critical', 53.6, 2900, 63.7, 20300000000, 86.5, 1730000000000, '2023-06-20 12:20:00', 6), -- Disk

-- Alerts for Server 3 (Position 1)
('Warning', 84.7, 3400, 74.8, 47800000000, 64, 2560000000000, '2023-01-20 10:30:00', 7), -- CPU
('Critical', 94.5, 3600, 81.6, 52200000000, 69, 2760000000000, '2023-02-25 16:45:00', 7), -- CPU
('Warning', 69.9, 3300, 79.7, 51000000000, 59, 2360000000000, '2023-03-15 12:15:00', 8), -- RAM
('Critical', 64.8, 3200, 91.2, 58300000000, 64, 2560000000000, '2023-04-10 18:30:00', 8), -- RAM
('Warning', 59.3, 3100, 69.1, 44200000000, 74.8, 2992000000000, '2023-05-18 11:45:00', 9), -- Disk
('Critical', 54.2, 3000, 64.5, 41200000000, 87.3, 3492000000000, '2023-06-22 13:20:00', 9), -- Disk

-- Alerts for Server 4 (Position 2)
('Warning', 83.1, 3500, 73.6, 23500000000, 63, 1260000000000, '2023-01-22 11:30:00', 10), -- CPU
('Critical', 92.8, 3700, 80.9, 25800000000, 68, 1360000000000, '2023-02-27 17:45:00', 10), -- CPU
('Warning', 67.5, 3400, 78.3, 25000000000, 57, 1140000000000, '2023-03-17 13:15:00', 11), -- RAM
('Critical', 62.9, 3300, 89.7, 28700000000, 62, 1240000000000, '2023-04-12 19:30:00', 11), -- RAM
('Warning', 57.6, 3200, 67.8, 21600000000, 72.5, 1450000000000, '2023-05-20 12:45:00', 12), -- Disk
('Critical', 52.3, 3100, 62.4, 19900000000, 85.7, 1714000000000, '2023-06-25 14:20:00', 12), -- Disk

-- Alerts for Server 5 (Position 2)
('Warning', 86.2, 3600, 76.9, 49200000000, 66, 2640000000000, '2023-01-25 12:30:00', 13), -- CPU
('Critical', 95.9, 3800, 83.4, 53300000000, 71, 2840000000000, '2023-03-01 18:45:00', 13), -- CPU
('Warning', 71.3, 3500, 81.2, 51900000000, 61, 2440000000000, '2023-03-20 14:15:00', 14), -- RAM
('Critical', 66.7, 3400, 92.6, 59200000000, 66, 2640000000000, '2023-04-15 20:30:00', 14), -- RAM
('Warning', 61.5, 3300, 71.3, 45600000000, 76.9, 3076000000000, '2023-05-22 13:45:00', 15), -- Disk
('Critical', 56.8, 3200, 66.2, 42300000000, 89.1, 3564000000000, '2023-06-27 15:20:00', 15), -- Disk

-- Continue with similar patterns for the remaining servers...
-- Alerts for Server 6 (Position 2)
('Warning', 81.9, 3200, 72.1, 11500000000, 61, 610000000000, '2023-01-28 13:30:00', 16), -- CPU
('Critical', 91.6, 3400, 79.8, 12700000000, 66, 660000000000, '2023-03-03 19:45:00', 16), -- CPU
('Warning', 66.2, 3100, 77.5, 12400000000, 56, 560000000000, '2023-03-22 15:15:00', 17), -- RAM
('Critical', 61.5, 3000, 88.9, 14200000000, 61, 610000000000, '2023-04-18 21:30:00', 17), -- RAM
('Warning', 56.2, 2900, 66.7, 10600000000, 71.2, 712000000000, '2023-05-25 14:45:00', 18), -- Disk
('Critical', 51.4, 2800, 61.9, 9900000000, 84.5, 845000000000, '2023-06-30 16:20:00', 18), -- Disk

-- Alerts for Server 7 (Position 3)
('Warning', 84.5, 3300, 74.3, 23700000000, 64, 1280000000000, '2023-02-01 14:30:00', 19), -- CPU
('Critical', 94.2, 3500, 81.5, 26000000000, 69, 1380000000000, '2023-03-05 20:45:00', 19), -- CPU
('Warning', 69.3, 3200, 79.1, 25300000000, 58, 1160000000000, '2023-03-25 16:15:00', 20), -- RAM
('Critical', 64.1, 3100, 90.8, 29000000000, 63, 1260000000000, '2023-04-20 22:30:00', 20), -- RAM
('Warning', 58.9, 3000, 68.5, 21900000000, 73.6, 1472000000000, '2023-05-28 15:45:00', 21), -- Disk
('Critical', 53.7, 2900, 63.8, 20400000000, 86.8, 1736000000000, '2023-07-02 17:20:00', 21), -- Disk

-- Alerts for Server 8 (Position 3)
('Warning', 87.3, 3400, 77.6, 49600000000, 67, 2680000000000, '2023-02-03 15:30:00', 22), -- CPU
('Critical', 96.8, 3600, 84.2, 53800000000, 72, 2880000000000, '2023-03-08 21:45:00', 22), -- CPU
('Warning', 72.5, 3300, 82.3, 52600000000, 62, 2480000000000, '2023-03-28 17:15:00', 23), -- RAM
('Critical', 67.9, 3200, 93.5, 59800000000, 67, 2680000000000, '2023-04-22 23:30:00', 23), -- RAM
('Warning', 62.7, 3100, 72.1, 46100000000, 77.8, 3112000000000, '2023-05-30 16:45:00', 24), -- Disk
('Critical', 57.9, 3000, 67.3, 43000000000, 90.2, 3608000000000, '2023-07-05 18:20:00', 24), -- Disk

-- Alerts for Server 9 (Position 3)
('Warning', 82.7, 3500, 73.2, 23400000000, 62, 1240000000000, '2023-02-06 16:30:00', 25), -- CPU
('Critical', 92.4, 3700, 80.5, 25700000000, 67, 1340000000000, '2023-03-10 22:45:00', 25), -- CPU
('Warning', 67.1, 3400, 78.7, 25100000000, 57, 1140000000000, '2023-03-30 18:15:00', 26), -- RAM
('Critical', 62.5, 3300, 89.3, 28500000000, 62, 1240000000000, '2023-04-25 00:30:00', 26), -- RAM
('Warning', 57.2, 3200, 67.4, 21500000000, 72.1, 1442000000000, '2023-06-02 17:45:00', 27), -- Disk
('Critical', 52.1, 3100, 62.2, 19800000000, 85.3, 1706000000000, '2023-07-08 19:20:00', 27), -- Disk

-- Alerts for Server 10 (Position 4)
('Warning', 85.9, 3600, 76.5, 48900000000, 65, 2600000000000, '2023-02-09 17:30:00', 28), -- CPU
('Critical', 95.6, 3800, 83.1, 53100000000, 70, 2800000000000, '2023-03-12 23:45:00', 28), -- CPU
('Warning', 70.8, 3500, 80.9, 51700000000, 60, 2400000000000, '2023-04-02 19:15:00', 29), -- RAM
('Critical', 66.3, 3400, 92.2, 58900000000, 65, 2600000000000, '2023-04-28 01:30:00', 29), -- RAM
('Warning', 61.1, 3300, 70.9, 45300000000, 76.5, 3060000000000, '2023-06-05 18:45:00', 30), -- Disk
('Critical', 56.4, 3200, 65.8, 42000000000, 88.7, 3548000000000, '2023-07-10 20:20:00', 30), -- Disk

-- Alerts for Server 11 (Position 4)
('Warning', 81.5, 3200, 71.8, 11400000000, 60, 600000000000, '2023-02-12 18:30:00', 31), -- CPU
('Critical', 91.2, 3400, 79.4, 12700000000, 65, 650000000000, '2023-03-15 00:45:00', 31), -- CPU
('Warning', 65.9, 3100, 77.2, 12300000000, 55, 550000000000, '2023-04-05 20:15:00', 32), -- RAM
('Critical', 61.2, 3000, 88.6, 14100000000, 60, 600000000000, '2023-04-30 02:30:00', 32), -- RAM
('Warning', 55.9, 2900, 66.4, 10600000000, 70.8, 708000000000, '2023-06-08 19:45:00', 33), -- Disk
('Critical', 51.1, 2800, 61.6, 9800000000, 84.1, 841000000000, '2023-07-12 21:20:00', 33), -- Disk

-- Alerts for Server 12 (Position 4)
('Warning', 84.1, 3300, 74.1, 23600000000, 63, 1260000000000, '2023-02-15 19:30:00', 34), -- CPU
('Critical', 93.8, 3500, 81.2, 25900000000, 68, 1360000000000, '2023-03-18 01:45:00', 34), -- CPU
('Warning', 68.9, 3200, 78.8, 25200000000, 58, 1160000000000, '2023-04-08 21:15:00', 35), -- RAM
('Critical', 63.8, 3100, 90.5, 28900000000, 63, 1260000000000, '2023-05-02 03:30:00', 35), -- RAM
('Warning', 58.5, 3000, 68.2, 21800000000, 73.2, 1464000000000, '2023-06-10 20:45:00', 36), -- Disk
('Critical', 53.4, 2900, 63.5, 20300000000, 86.4, 1728000000000, '2023-07-15 22:20:00', 36); -- Disk