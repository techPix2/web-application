DROP DATABASE IF EXISTS TechPix;
CREATE DATABASE IF NOT EXISTS TechPix;
USE TechPix;

CREATE TABLE City(
                     idCity INT PRIMARY KEY AUTO_INCREMENT,
                     city VARCHAR(45)
);

CREATE TABLE Address(
                        idAddress INT PRIMARY KEY AUTO_INCREMENT,
                        street VARCHAR(100),
                        number VARCHAR(48),
                        postalCode VARCHAR(10),
                        district VARCHAR(45),
                        fkCity INT,
                        CONSTRAINT fkCity_Address FOREIGN KEY (fkCity)
                            REFERENCES City(idCity)
);

CREATE TABLE Company(
                        idCompany INT PRIMARY KEY AUTO_INCREMENT,
                        socialReason VARCHAR(100),
                        cnpj CHAR(14),
                        active TINYINT,
                        fkAddress INT,
                        CONSTRAINT fkAddress_Company FOREIGN KEY (fkAddress)
                            REFERENCES Address(idAddress)
);

CREATE TABLE Server(
                       idServer INT PRIMARY KEY AUTO_INCREMENT,
                       hostName VARCHAR(45),
                       macAddress CHAR(17),
                       status VARCHAR(45),
                       position INT,
                       mobuId VARCHAR(100),
                       operationalSystem VARCHAR(45),
                       active TINYINT,
                       fkCompany INT,
                       CONSTRAINT fkCompany_Server FOREIGN KEY (fkCompany)
                           REFERENCES Company(idCompany)
);

CREATE TABLE Employer(
                         idEmployer INT PRIMARY KEY AUTO_INCREMENT,
                         name VARCHAR(45),
                         cpf CHAR(11),
                         role VARCHAR(45),
                         fkCompany INT,
                         fkAdmin INT,
                         email varchar(256),
                         password VARCHAR(45),
                         photoPath VARCHAR(100),
                         active TINYINT,
                         CONSTRAINT fkCompany_Employer FOREIGN KEY (fkCompany)
                             REFERENCES Company(idCompany),
                         CONSTRAINT fkAdmin_Employer FOREIGN KEY (fkAdmin)
                             REFERENCES Employer(idEmployer)
);
CREATE TABLE ProcessMachine(
                               idProcess INT PRIMARY KEY AUTO_INCREMENT,
                               processCode VARCHAR(45),
                               name VARCHAR(45),
                               cpuPercent DECIMAL(5,2),
                               ramPercent DECIMAL(5,2),
                               ramUsed BIGINT,
                               fkServer INT,
                               CONSTRAINT fkServer_ProcessMachine FOREIGN KEY (fkServer)
                                   REFERENCES Server(idServer)
);

CREATE TABLE Component (
                           idComponent INT PRIMARY KEY AUTO_INCREMENT,
                           name VARCHAR(45),
                           type VARCHAR(45),
                           description VARCHAR(45),
                           fkServer INT,
                           serial VARCHAR(100),
                           CONSTRAINT fkServer_Component FOREIGN KEY (fkServer)
                               REFERENCES Server(idServer)
);

CREATE TABLE Measure(
                        idMeasure INT PRIMARY KEY AUTO_INCREMENT,
                        measureType VARCHAR(45),
                        limiterValue INT,
                        fkComponent INT,
                        CONSTRAINT fkComponent_Measure FOREIGN KEY (fkComponent) REFERENCES Component(idComponent)
);

CREATE TABLE DataMachine(
                            idDataMachine INT PRIMARY KEY AUTO_INCREMENT,
                            cpuPercent INT,
                            cpuFreq INT,
                            ramPercent INT,
                            ramUsed BIGINT,
                            diskPercent INT,
                            diskUsed BIGINT,
                            dateTime DATETIME,
                            fkMeasure INT,
                            CONSTRAINT fkMeasure_DataMachine FOREIGN KEY (fkMeasure) REFERENCES Measure(idMeasure)
);

CREATE TABLE AlertMachine(
                             idAlertMachine INT PRIMARY KEY AUTO_INCREMENT,
                             type VARCHAR(45),
                             cpuPercent DOUBLE,
                             cpuFreq INT,
                             ramPercent DOUBLE,
                             ramUsed BIGINT,
                             diskPercent INT,
                             diskUsed BIGINT,
                             dateTime TIMESTAMP,
                             fkMeasure INT,
                             CONSTRAINT fkMeasure_AlertMachine FOREIGN KEY (fkMeasure)
                                 REFERENCES Measure(idMeasure)
);
CREATE TABLE AccessLog(
                          idAccessLog INT PRIMARY KEY AUTO_INCREMENT,
                          datetime DATETIME,
                          type VARCHAR(45),
                          fkEmployer INT,
                          CONSTRAINT fkEmployer_AccessLog FOREIGN KEY (fkEmployer)
                              REFERENCES Employer(idEmployer)
);
-- Inserindo dados na tabela City
INSERT INTO City (city) VALUES ('São Paulo');

-- Inserindo dados na tabela Address
INSERT INTO Address (street, number, postalCode, district, fkCity)
VALUES ('Av. Paulista', '1000', '01310-100', 'Bela Vista', 1);

-- Inserindo dados na tabela Company
INSERT INTO Company (socialReason, cnpj, active, fkAddress)
VALUES ('TechPix Ltda', '12345678000190', 1, 1);

-- Inserindo dados na tabela Server
INSERT INTO Server (hostName, macAddress, status, position, mobuId, operationalSystem, active, fkCompany)
VALUES ('server01', '00:1A:2B:3C:4D:5E', 'Ativo', 1, 'M123456', 'Linux', 1, 1);

-- Inserindo dados na tabela Employer (primeiro admin)
INSERT INTO Employer (name, cpf, role, fkCompany, password, photoPath, active)
VALUES ('Admin Master', '12345678901', 'Administrador', 1, 'senha123', '/photos/admin.jpg', 1);

-- Inserindo outro funcionário (não admin)
INSERT INTO Employer (name, cpf, role, fkCompany, fkAdmin, password, photoPath, active)
VALUES ('João Silva', '98765432109', 'Analista', 1, 1, 'senha456', '/photos/joao.jpg', 1);

-- Inserindo dados na tabela Component
INSERT INTO Component (name, type, description, fkServer, serial)
VALUES ('CPU', 'Processador', 'Intel i7', 1, 'CPU12345');

-- Inserindo dados na tabela Measure
INSERT INTO Measure (measureType, limiterValue, fkComponent)
VALUES ('Uso de CPU', 90, 1);

-- Inserindo dados na tabela ProcessMachine
INSERT INTO ProcessMachine (processCode, name, cpuPercent, ramPercent, ramUsed, fkServer)
VALUES ('P001', 'System', 5.25, 30.50, 2048000000, 1);

-- Inserindo dados na tabela DataMachine
INSERT INTO DataMachine (cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
VALUES (25, 2400, 45, 3072000000, 30, 50000000000, NOW(), 1);

-- Inserindo dados na tabela AlertMachine
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure)
VALUES ('Alerta CPU', 95.5, 3500, 65.3, 4096000000, 45, 60000000000, NOW(), 1);

-- Inserindo dados na tabela AccessLog
INSERT INTO AccessLog (datetime, type, fkEmployer)
VALUES (NOW(), 'Login', 1);
SELECT
    idServer,
    hostName,
    macAddress,
    status,
    position,
    mobuId,
    operationalSystem,
    fkCompany
FROM Server
WHERE position = '';

INSERT INTO City (city) VALUES
                            ('Rio de Janeiro'),
                            ('Belo Horizonte'),
                            ('Curitiba'),
                            ('Porto Alegre');

INSERT INTO Address (street, number, postalCode, district, fkCity) VALUES
                                                                       ('Av. Atlântica', '200', '22010-000', 'Copacabana', 2),
                                                                       ('Av. Afonso Pena', '1000', '30130-000', 'Centro', 3),
                                                                       ('Rua XV de Novembro', '500', '80020-000', 'Centro', 4),
                                                                       ('Av. Farrapos', '1200', '90220-005', 'São João', 5);

INSERT INTO Company (socialReason, cnpj, active, fkAddress) VALUES
                                                                ('DataCenter RJ', '98765432000101', 1, 2),
                                                                ('Cloud Solutions BH', '45678912000134', 1, 3),
                                                                ('TI Paraná', '32165498000176', 1, 4),
                                                                ('Servidores RS', '65412398000123', 1, 5);

-- Servidores na posição 1 (empresa 1)
INSERT INTO Server (hostName, macAddress, status, position, mobuId, operationalSystem, active, fkCompany) VALUES
                                                                                                              ('server02', '00:1A:2B:3C:4D:5F', 'Ativo', 1, 'M123457', 'Linux', 1, 1),
                                                                                                              ('server03', '00:1A:2B:3C:4D:6E', 'Ativo', 1, 'M123458', 'Windows', 1, 1),
                                                                                                              ('server04', '00:1A:2B:3C:4D:7F', 'Manutenção', 1, 'M123459', 'Linux', 0, 1);

-- Servidores na posição 2 (empresa 1)
INSERT INTO Server (hostName, macAddress, status, position, mobuId, operationalSystem, active, fkCompany) VALUES
                                                                                                              ('server05', '00:1A:2B:3C:4D:8E', 'Ativo', 2, 'M123460', 'Linux', 1, 1),
                                                                                                              ('server06', '00:1A:2B:3C:4D:9F', 'Ativo', 2, 'M123461', 'Windows', 1, 1);

-- Servidores em outras empresas
INSERT INTO Server (hostName, macAddress, status, position, mobuId, operationalSystem, active, fkCompany) VALUES
                                                                                                              ('dc-rj-01', '00:2B:3C:4D:5E:6F', 'Ativo', 1, 'M223456', 'Linux', 1, 2),
                                                                                                              ('dc-rj-02', '00:2B:3C:4D:5E:7F', 'Ativo', 2, 'M223457', 'Linux', 1, 2),
                                                                                                              ('cloud-bh-01', '00:3C:4D:5E:6F:7G', 'Ativo', 1, 'M323456', 'Windows', 1, 3);


-- Componentes para os servidores da empresa 1
INSERT INTO Component (name, type, description, fkServer, serial) VALUES
                                                                      ('CPU', 'Processador', 'Intel Xeon', 2, 'CPU23456'),
                                                                      ('RAM', 'Memória', 'DDR4 16GB', 2, 'RAM23456'),
                                                                      ('CPU', 'Processador', 'AMD Ryzen', 3, 'CPU34567'),
                                                                      ('RAM', 'Memória', 'DDR4 32GB', 3, 'RAM34567'),
                                                                      ('CPU', 'Processador', 'Intel i9', 4, 'CPU45678'),
                                                                      ('CPU', 'Processador', 'Intel Xeon Gold', 5, 'CPU56789'),
                                                                      ('CPU', 'Processador', 'AMD EPYC', 6, 'CPU67890'),
                                                                      ('CPU', 'Processador', 'Intel Xeon', 7, 'CPU78901'),
                                                                      ('CPU', 'Processador', 'AMD Ryzen', 8, 'CPU89012'),
                                                                      ('CPU', 'Processador', 'Intel i7', 9, 'CPU90123');

INSERT INTO Measure (measureType, limiterValue, fkComponent) VALUES
                                                                 ('Uso de CPU', 90, 2),
                                                                 ('Uso de RAM', 85, 3),
                                                                 ('Uso de CPU', 95, 4),
                                                                 ('Uso de RAM', 80, 5),
                                                                 ('Uso de CPU', 85, 6),
                                                                 ('Uso de CPU', 90, 7),
                                                                 ('Uso de CPU', 92, 8),
                                                                 ('Uso de CPU', 88, 9),
                                                                 ('Uso de CPU', 85, 10),
                                                                 ('Uso de CPU', 90, 11);
select * from Employer;
-- Alertas para o servidor 1 (vários alertas)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure) VALUES
                                                                                                                          ('Alerta CPU', 95.5, 3500, 65.3, 4096000000, 45, 60000000000, '2023-01-15 10:00:00', 1),
                                                                                                                          ('Alerta CPU', 96.2, 3600, 70.1, 4500000000, 50, 65000000000, '2023-01-15 11:30:00', 1),
                                                                                                                          ('Alerta RAM', 92.0, 3400, 90.5, 5500000000, 60, 70000000000, '2023-02-20 14:15:00', 1);

-- Alertas para o servidor 2
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure) VALUES
                                                                                                                          ('Alerta CPU', 91.0, 3200, 75.0, 5000000000, 55, 62000000000, '2023-03-10 09:00:00', 2),
                                                                                                                          ('Alerta CPU', 93.5, 3300, 78.3, 5200000000, 58, 63000000000, '2023-03-10 12:45:00', 2),
                                                                                                                          ('Alerta Disco', 88.0, 3100, 82.0, 5400000000, 92, 90000000000, '2023-04-05 16:30:00', 2);

-- Alertas para o servidor 3
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure) VALUES
                                                                                                                          ('Alerta CPU', 97.0, 3800, 85.0, 6000000000, 65, 75000000000, '2023-05-12 08:30:00', 4),
                                                                                                                          ('Alerta RAM', 94.0, 3700, 95.0, 7000000000, 70, 80000000000, '2023-05-12 10:45:00', 4),
                                                                                                                          ('Alerta Disco', 90.0, 3600, 88.0, 6500000000, 95, 95000000000, '2023-06-18 14:00:00', 4);

-- Alertas para o servidor 5 (posição 2)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure) VALUES
                                                                                                                          ('Alerta CPU', 92.5, 3400, 80.0, 5500000000, 60, 70000000000, '2023-07-22 11:20:00', 6),
                                                                                                                          ('Alerta RAM', 89.0, 3300, 92.0, 6500000000, 65, 72000000000, '2023-08-30 13:45:00', 6);

-- Alertas para o servidor 6 (posição 2)
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure) VALUES
                                                                                                                          ('Alerta CPU', 96.0, 3500, 82.0, 5800000000, 62, 71000000000, '2023-09-05 09:15:00', 7),
                                                                                                                          ('Alerta Disco', 91.0, 3450, 85.0, 6000000000, 93, 92000000000, '2023-10-12 15:30:00', 7);

-- Alertas para servidores de outras empresas
INSERT INTO AlertMachine (type, cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure) VALUES
                                                                                                                          ('Alerta CPU', 94.0, 3600, 78.0, 5200000000, 58, 68000000000, '2023-11-08 10:00:00', 8),
                                                                                                                          ('Alerta CPU', 93.5, 3550, 75.0, 5000000000, 60, 70000000000, '2023-12-15 14:20:00', 10);


INSERT INTO ProcessMachine (processCode, name, cpuPercent, ramPercent, ramUsed, fkServer) VALUES
                                                                                              ('P002', 'Java', 15.75, 25.30, 1800000000, 1),
                                                                                              ('P003', 'MySQL', 20.50, 35.75, 2500000000, 1),
                                                                                              ('P004', 'Apache', 10.25, 15.50, 1200000000, 2),
                                                                                              ('P005', 'Node.js', 18.75, 28.90, 2200000000, 2),
                                                                                              ('P006', 'Docker', 12.50, 20.75, 1600000000, 3),
                                                                                              ('P007', 'Python', 22.25, 32.60, 2800000000, 3),
                                                                                              ('P008', 'Nginx', 8.75, 12.30, 1000000000, 5),
                                                                                              ('P009', 'MongoDB', 25.50, 38.75, 3200000000, 6);

INSERT INTO DataMachine (cpuPercent, cpuFreq, ramPercent, ramUsed, diskPercent, diskUsed, dateTime, fkMeasure) VALUES
                                                                                                                   (35, 2600, 55, 3800000000, 40, 55000000000, '2023-01-15 09:45:00', 1),
                                                                                                                   (40, 2700, 60, 4200000000, 45, 58000000000, '2023-01-15 10:30:00', 1),
                                                                                                                   (45, 2800, 65, 4500000000, 50, 60000000000, '2023-01-15 11:15:00', 1),
                                                                                                                   (30, 2500, 50, 3500000000, 35, 50000000000, '2023-02-20 13:30:00', 2),
                                                                                                                   (50, 2900, 70, 5000000000, 55, 65000000000, '2023-02-20 14:00:00', 2),
                                                                                                                   (55, 3000, 75, 5500000000, 60, 70000000000, '2023-02-20 14:45:00', 2);


SELECT *
FROM AlertMachine
         JOIN Measure ON AlertMachine.fkMeasure = Measure.idMeasure
         JOIN Component ON Measure.fkComponent = Component.idComponent
         JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.fkCompany = 1
  AND position = 4
  AND AlertMachine.dateTime >= DATE_SUB(NOW(), INTERVAL 30 MONTH);

SELECT *
FROM AlertMachine
         JOIN Measure ON AlertMachine.fkMeasure = Measure.idMeasure
         JOIN Component ON Measure.fkComponent = Component.idComponent
         JOIN Server ON Component.fkServer = Server.idServer
WHERE Server.fkCompany = 1
  AND idServer = 1
  AND AlertMachine.dateTime >= DATE_SUB(NOW(), INTERVAL 30 MONTH);