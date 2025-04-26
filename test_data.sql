-- Script SQL para cadastrar servidores e alertas para teste de integração
USE TechPix;

-- Inserir uma nova empresa para testes
INSERT INTO City (city) VALUES ('São Paulo - Teste');
INSERT INTO Address (street, number, postalCode, district, fkCity)
VALUES ('Av. Teste', '123', '01234-567', 'Bairro Teste', LAST_INSERT_ID());
INSERT INTO Company (socialReason, cnpj, active, fkAddress)
VALUES ('Empresa Teste Integração', '12345678901234', 1, LAST_INSERT_ID());

-- Obter o ID da empresa recém-criada
SET @company_id = LAST_INSERT_ID();

-- Inserir servidores em diferentes quadrantes (posições)
-- Quadrante 1
INSERT INTO Server (hostName, macAddress, status, position, mobuId, operationalSystem, active, fkCompany) VALUES
('srv-q1-01', '00:1B:2C:3D:4E:5F', 'Ativo', 1, 'MT10001', 'Linux', 1, @company_id),
('srv-q1-02', '00:1B:2C:3D:4E:6F', 'Ativo', 1, 'MT10002', 'Windows', 1, @company_id),
('srv-q1-03', '00:1B:2C:3D:4E:7F', 'Ativo', 1, 'MT10003', 'Linux', 1, @company_id);

-- Quadrante 2
INSERT INTO Server (hostName, macAddress, status, position, mobuId, operationalSystem, active, fkCompany) VALUES
('srv-q2-01', '00:2B:3C:4D:5E:6F', 'Ativo', 2, 'MT20001', 'Linux', 1, @company_id),
('srv-q2-02', '00:2B:3C:4D:5E:7F', 'Ativo', 2, 'MT20002', 'Windows', 1, @company_id);

-- Quadrante 3
INSERT INTO Server (hostName, macAddress, status, position, mobuId, operationalSystem, active, fkCompany) VALUES
('srv-q3-01', '00:3C:4D:5E:6F:7G', 'Ativo', 3, 'MT30001', 'Linux', 1, @company_id),
('srv-q3-02', '00:3C:4D:5E:6F:8G', 'Manutenção', 3, 'MT30002', 'Windows', 0, @company_id);

-- Quadrante 4
INSERT INTO Server (hostName, macAddress, status, position, mobuId, operationalSystem, active, fkCompany) VALUES
('srv-q4-01', '00:4D:5E:6F:7G:8H', 'Ativo', 4, 'MT40001', 'Linux', 1, @company_id),
('srv-q4-02', '00:4D:5E:6F:7G:9H', 'Ativo', 4, 'MT40002', 'Windows', 1, @company_id);

-- Inserir componentes para os servidores
-- Servidor Q1-01
SET @server_q1_01 = (SELECT idServer FROM Server WHERE hostName = 'srv-q1-01' AND fkCompany = @company_id);
INSERT INTO Component (name, type, description, fkServer, serial) VALUES
('CPU', 'Processador', 'Intel Xeon E5-2680', @server_q1_01, 'CPU-X2680-001'),
('RAM', 'Memória', 'DDR4 64GB', @server_q1_01, 'RAM-64GB-001'),
('Disco', 'Armazenamento', 'SSD 1TB', @server_q1_01, 'SSD-1TB-001');

-- Servidor Q1-02
SET @server_q1_02 = (SELECT idServer FROM Server WHERE hostName = 'srv-q1-02' AND fkCompany = @company_id);
INSERT INTO Component (name, type, description, fkServer, serial) VALUES
('CPU', 'Processador', 'AMD EPYC 7302', @server_q1_02, 'CPU-E7302-001'),
('RAM', 'Memória', 'DDR4 128GB', @server_q1_02, 'RAM-128GB-001'),
('Disco', 'Armazenamento', 'SSD 2TB', @server_q1_02, 'SSD-2TB-001');

-- Servidor Q1-03
SET @server_q1_03 = (SELECT idServer FROM Server WHERE hostName = 'srv-q1-03' AND fkCompany = @company_id);
INSERT INTO Component (name, type, description, fkServer, serial) VALUES
('CPU', 'Processador', 'Intel Xeon Gold 6248R', @server_q1_03, 'CPU-G6248R-001'),
('RAM', 'Memória', 'DDR4 256GB', @server_q1_03, 'RAM-256GB-001'),
('Disco', 'Armazenamento', 'SSD 4TB', @server_q1_03, 'SSD-4TB-001');

-- Servidor Q2-01
SET @server_q2_01 = (SELECT idServer FROM Server WHERE hostName = 'srv-q2-01' AND fkCompany = @company_id);
INSERT INTO Component (name, type, description, fkServer, serial) VALUES
('CPU', 'Processador', 'Intel Xeon E7-8890', @server_q2_01, 'CPU-X8890-001'),
('RAM', 'Memória', 'DDR4 512GB', @server_q2_01, 'RAM-512GB-001'),
('Disco', 'Armazenamento', 'SSD 8TB', @server_q2_01, 'SSD-8TB-001');

-- Servidor Q2-02
SET @server_q2_02 = (SELECT idServer FROM Server WHERE hostName = 'srv-q2-02' AND fkCompany = @company_id);
INSERT INTO Component (name, type, description, fkServer, serial) VALUES
('CPU', 'Processador', 'AMD EPYC 7742', @server_q2_02, 'CPU-E7742-001'),
('RAM', 'Memória', 'DDR4 1TB', @server_q2_02, 'RAM-1TB-001'),
('Disco', 'Armazenamento', 'SSD 16TB', @server_q2_02, 'SSD-16TB-001');

-- Servidor Q3-01
SET @server_q3_01 = (SELECT idServer FROM Server WHERE hostName = 'srv-q3-01' AND fkCompany = @company_id);
INSERT INTO Component (name, type, description, fkServer, serial) VALUES
('CPU', 'Processador', 'Intel Xeon Platinum 8280', @server_q3_01, 'CPU-P8280-001'),
('RAM', 'Memória', 'DDR4 768GB', @server_q3_01, 'RAM-768GB-001'),
('Disco', 'Armazenamento', 'SSD 10TB', @server_q3_01, 'SSD-10TB-001');

-- Servidor Q3-02
SET @server_q3_02 = (SELECT idServer FROM Server WHERE hostName = 'srv-q3-02' AND fkCompany = @company_id);
INSERT INTO Component (name, type, description, fkServer, serial) VALUES
('CPU', 'Processador', 'AMD EPYC 7763', @server_q3_02, 'CPU-E7763-001'),
('RAM', 'Memória', 'DDR4 384GB', @server_q3_02, 'RAM-384GB-001'),
('Disco', 'Armazenamento', 'SSD 6TB', @server_q3_02, 'SSD-6TB-001');

-- Servidor Q4-01
SET @server_q4_01 = (SELECT idServer FROM Server WHERE hostName = 'srv-q4-01' AND fkCompany = @company_id);
INSERT INTO Component (name, type, description, fkServer, serial) VALUES
('CPU', 'Processador', 'Intel Xeon E5-2699', @server_q4_01, 'CPU-X2699-001'),
('RAM', 'Memória', 'DDR4 192GB', @server_q4_01, 'RAM-192GB-001'),
('Disco', 'Armazenamento', 'SSD 3TB', @server_q4_01, 'SSD-3TB-001');

-- Servidor Q4-02
SET @server_q4_02 = (SELECT idServer FROM Server WHERE hostName = 'srv-q4-02' AND fkCompany = @company_id);
INSERT INTO Component (name, type, description, fkServer, serial) VALUES
('CPU', 'Processador', 'AMD EPYC 7713', @server_q4_02, 'CPU-E7713-001'),
('RAM', 'Memória', 'DDR4 256GB', @server_q4_02, 'RAM-256GB-001'),
('Disco', 'Armazenamento', 'SSD 5TB', @server_q4_02, 'SSD-5TB-001');

-- Inserir medidas para os componentes
-- Medidas para CPU
INSERT INTO Measure (measureType, limiterValue, fkComponent)
SELECT 'Uso de CPU', 90, idComponent FROM Component WHERE type = 'Processador' AND fkServer IN 
(SELECT idServer FROM Server WHERE fkCompany = @company_id);

-- Medidas para RAM
INSERT INTO Measure (measureType, limiterValue, fkComponent)
SELECT 'Uso de RAM', 85, idComponent FROM Component WHERE type = 'Memória' AND fkServer IN 
(SELECT idServer FROM Server WHERE fkCompany = @company_id);

-- Medidas para Disco
INSERT INTO Measure (measureType, limiterValue, fkComponent)
SELECT 'Uso de Disco', 80, idComponent FROM Component WHERE type = 'Armazenamento' AND fkServer IN 
(SELECT idServer FROM Server WHERE fkCompany = @company_id);

-- Inserir alertas para os componentes
-- Alertas para CPU (Quadrante 1)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'CPU', 
    95.5, 
    3500, 
    65.3, 
    4096000000, 
    45, 
    60000000000, 
    DATE_SUB(NOW(), INTERVAL 1 HOUR), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 1 AND Server.fkCompany = @company_id AND Component.type = 'Processador'
LIMIT 1;

-- Mais alertas para CPU (Quadrante 1)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'CPU', 
    92.0, 
    3400, 
    60.0, 
    3800000000, 
    40, 
    55000000000, 
    DATE_SUB(NOW(), INTERVAL 2 HOUR), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 1 AND Server.fkCompany = @company_id AND Component.type = 'Processador'
LIMIT 1;

-- Alertas para RAM (Quadrante 1)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'Memory', 
    70.0, 
    3200, 
    90.5, 
    5500000000, 
    50, 
    65000000000, 
    DATE_SUB(NOW(), INTERVAL 3 HOUR), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 1 AND Server.fkCompany = @company_id AND Component.type = 'Memória'
LIMIT 1;

-- Alertas para Disco (Quadrante 1)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'Disk', 
    65.0, 
    3100, 
    75.0, 
    4800000000, 
    92.0, 
    90000000000, 
    DATE_SUB(NOW(), INTERVAL 4 HOUR), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 1 AND Server.fkCompany = @company_id AND Component.type = 'Armazenamento'
LIMIT 1;

-- Alertas para CPU (Quadrante 2)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'CPU', 
    97.0, 
    3800, 
    70.0, 
    4500000000, 
    55, 
    70000000000, 
    DATE_SUB(NOW(), INTERVAL 5 HOUR), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 2 AND Server.fkCompany = @company_id AND Component.type = 'Processador'
LIMIT 1;

-- Alertas para RAM (Quadrante 2)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'Memory', 
    75.0, 
    3300, 
    88.0, 
    5200000000, 
    60, 
    75000000000, 
    DATE_SUB(NOW(), INTERVAL 6 HOUR), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 2 AND Server.fkCompany = @company_id AND Component.type = 'Memória'
LIMIT 1;

-- Alertas para CPU (Quadrante 3)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'CPU', 
    94.0, 
    3600, 
    68.0, 
    4200000000, 
    48, 
    62000000000, 
    DATE_SUB(NOW(), INTERVAL 1 DAY), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 3 AND Server.fkCompany = @company_id AND Component.type = 'Processador'
LIMIT 1;

-- Alertas para Disco (Quadrante 3)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'Disk', 
    70.0, 
    3200, 
    72.0, 
    4600000000, 
    89.0, 
    85000000000, 
    DATE_SUB(NOW(), INTERVAL 2 DAY), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 3 AND Server.fkCompany = @company_id AND Component.type = 'Armazenamento'
LIMIT 1;

-- Alertas para CPU (Quadrante 4)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'CPU', 
    96.5, 
    3700, 
    72.0, 
    4700000000, 
    52, 
    68000000000, 
    DATE_SUB(NOW(), INTERVAL 3 DAY), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 4 AND Server.fkCompany = @company_id AND Component.type = 'Processador'
LIMIT 1;

-- Alertas para RAM (Quadrante 4)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'Memory', 
    78.0, 
    3400, 
    93.0, 
    5800000000, 
    63, 
    78000000000, 
    DATE_SUB(NOW(), INTERVAL 4 DAY), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 4 AND Server.fkCompany = @company_id AND Component.type = 'Memória'
LIMIT 1;

-- Alertas para Disco (Quadrante 4)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'Disk', 
    72.0, 
    3300, 
    76.0, 
    4900000000, 
    94.0, 
    92000000000, 
    DATE_SUB(NOW(), INTERVAL 5 DAY), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.position = 4 AND Server.fkCompany = @company_id AND Component.type = 'Armazenamento'
LIMIT 1;

-- Alertas para Process (vários quadrantes)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    'Process', 
    85.0, 
    3200, 
    82.0, 
    5100000000, 
    58, 
    72000000000, 
    DATE_SUB(NOW(), INTERVAL 6 DAY), 
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.fkCompany = @company_id AND Component.type = 'Processador'
LIMIT 4;

-- Inserir alertas mais recentes (última hora) para todos os quadrantes
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    CASE 
        WHEN Component.type = 'Processador' THEN 'CPU'
        WHEN Component.type = 'Memória' THEN 'Memory'
        WHEN Component.type = 'Armazenamento' THEN 'Disk'
    END,
    CASE 
        WHEN Component.type = 'Processador' THEN 95.0 + (RAND() * 5)
        ELSE 70.0 + (RAND() * 20)
    END,
    3200 + (RAND() * 600),
    CASE 
        WHEN Component.type = 'Memória' THEN 90.0 + (RAND() * 10)
        ELSE 65.0 + (RAND() * 25)
    END,
    4000000000 + (RAND() * 2000000000),
    CASE 
        WHEN Component.type = 'Armazenamento' THEN 85.0 + (RAND() * 15)
        ELSE 45.0 + (RAND() * 30)
    END,
    60000000000 + (RAND() * 35000000000),
    DATE_SUB(NOW(), INTERVAL (RAND() * 60) MINUTE),
    idMeasure
FROM Measure 
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.fkCompany = @company_id
LIMIT 30;

-- Inserir processos para os servidores
INSERT INTO ProcessMachine (processCode, name, cpuPercent, ramPercent, ramUsed, fkServer)
SELECT 
    CONCAT('P', LPAD(FLOOR(RAND() * 10000), 4, '0')),
    'Java',
    15.0 + (RAND() * 20),
    25.0 + (RAND() * 30),
    1500000000 + (RAND() * 2500000000),
    idServer
FROM Server
WHERE fkCompany = @company_id
LIMIT 5;

INSERT INTO ProcessMachine (processCode, name, cpuPercent, ramPercent, ramUsed, fkServer)
SELECT 
    CONCAT('P', LPAD(FLOOR(RAND() * 10000), 4, '0')),
    'MySQL',
    20.0 + (RAND() * 25),
    30.0 + (RAND() * 35),
    2000000000 + (RAND() * 3000000000),
    idServer
FROM Server
WHERE fkCompany = @company_id
LIMIT 5;

INSERT INTO ProcessMachine (processCode, name, cpuPercent, ramPercent, ramUsed, fkServer)
SELECT 
    CONCAT('P', LPAD(FLOOR(RAND() * 10000), 4, '0')),
    'Apache',
    10.0 + (RAND() * 15),
    15.0 + (RAND() * 20),
    1000000000 + (RAND() * 1500000000),
    idServer
FROM Server
WHERE fkCompany = @company_id
LIMIT 5;

INSERT INTO ProcessMachine (processCode, name, cpuPercent, ramPercent, ramUsed, fkServer)
SELECT 
    CONCAT('P', LPAD(FLOOR(RAND() * 10000), 4, '0')),
    'Node.js',
    18.0 + (RAND() * 22),
    28.0 + (RAND() * 32),
    1800000000 + (RAND() * 2200000000),
    idServer
FROM Server
WHERE fkCompany = @company_id
LIMIT 5;

INSERT INTO ProcessMachine (processCode, name, cpuPercent, ramPercent, ramUsed, fkServer)
SELECT 
    CONCAT('P', LPAD(FLOOR(RAND() * 10000), 4, '0')),
    'Docker',
    12.0 + (RAND() * 18),
    20.0 + (RAND() * 25),
    1600000000 + (RAND() * 2000000000),
    idServer
FROM Server
WHERE fkCompany = @company_id
LIMIT 5;

-- Inserir dados de máquina para os componentes
INSERT INTO DataMachine (cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
SELECT 
    30 + (RAND() * 60),
    2400 + (RAND() * 1200),
    40 + (RAND() * 50),
    3000000000 + (RAND() * 5000000000),
    30 + (RAND() * 60),
    50000000000 + (RAND() * 50000000000),
    DATE_SUB(NOW(), INTERVAL (RAND() * 24) HOUR),
    idMeasure
FROM Measure
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.fkCompany = @company_id
LIMIT 50;

-- Verificar os dados inseridos
SELECT 'Empresa criada com ID: ' AS 'Info', @company_id AS 'ID';
SELECT COUNT(*) AS 'Total de Servidores' FROM Server WHERE fkCompany = @company_id;
SELECT COUNT(*) AS 'Total de Componentes' FROM Component WHERE fkServer IN (SELECT idServer FROM Server WHERE fkCompany = @company_id);
SELECT COUNT(*) AS 'Total de Medidas' FROM Measure WHERE fkComponent IN (SELECT idComponent FROM Component WHERE fkServer IN (SELECT idServer FROM Server WHERE fkCompany = @company_id));
SELECT COUNT(*) AS 'Total de Alertas' FROM AlertMachine WHERE fkMeasure IN (SELECT idMeasure FROM Measure WHERE fkComponent IN (SELECT idComponent FROM Component WHERE fkServer IN (SELECT idServer FROM Server WHERE fkCompany = @company_id)));
SELECT COUNT(*) AS 'Total de Processos' FROM ProcessMachine WHERE fkServer IN (SELECT idServer FROM Server WHERE fkCompany = @company_id);
SELECT COUNT(*) AS 'Total de Dados de Máquina' FROM DataMachine WHERE fkMeasure IN (SELECT idMeasure FROM Measure WHERE fkComponent IN (SELECT idComponent FROM Component WHERE fkServer IN (SELECT idServer FROM Server WHERE fkCompany = @company_id)));

-- Mostrar distribuição de alertas por quadrante
SELECT 
    Server.position AS 'Quadrante',
    COUNT(*) AS 'Número de Alertas'
FROM AlertMachine
JOIN Measure ON AlertMachine.fkMeasure = Measure.idMeasure
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.fkCompany = @company_id
GROUP BY Server.position
ORDER BY Server.position;

-- Mostrar distribuição de alertas por tipo
SELECT 
    AlertMachine.type AS 'Tipo de Alerta',
    COUNT(*) AS 'Número de Alertas'
FROM AlertMachine
JOIN Measure ON AlertMachine.fkMeasure = Measure.idMeasure
JOIN Component ON Measure.fkComponent = Component.idComponent
JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.fkCompany = @company_id
GROUP BY AlertMachine.type
ORDER BY COUNT(*) DESC;

