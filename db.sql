-- Tạo bảng Account
CREATE TABLE Account (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL
);

-- Tạo bảng Computer
CREATE TABLE Computer (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(255) DEFAULT 'Offline',
    location VARCHAR(255),
    specs TEXT,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL
);

-- Tạo bảng Customer
CREATE TABLE Customer (
    id SERIAL PRIMARY KEY,
    accountId INT UNIQUE NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    citizenId VARCHAR(255) UNIQUE NOT NULL,
    phoneNumber VARCHAR(255),
    email VARCHAR(255),
    membershipLevel VARCHAR(255) DEFAULT 'Regular',
    balance FLOAT DEFAULT 0.0,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL,
    CONSTRAINT fk_account FOREIGN KEY (accountId) REFERENCES Account (id)
);

-- Tạo bảng Invoice
CREATE TABLE Invoice (
    id SERIAL PRIMARY KEY,
    customerId INT NOT NULL,
    invoiceDate TIMESTAMP DEFAULT NOW(),
    totalAmount FLOAT NOT NULL,
    status VARCHAR(255) DEFAULT 'Unpaid',
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL,
    CONSTRAINT fk_customer FOREIGN KEY (customerId) REFERENCES Customer (id)
);

-- Tạo bảng InvoiceService
CREATE TABLE InvoiceService (
    id SERIAL PRIMARY KEY,
    invoiceId INT NOT NULL,
    serviceId INT NOT NULL,
    quantity INT DEFAULT 1,
    totalPrice FLOAT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL,
    CONSTRAINT fk_invoice FOREIGN KEY (invoiceId) REFERENCES Invoice (id) ON DELETE CASCADE,
    CONSTRAINT fk_service FOREIGN KEY (serviceId) REFERENCES Service (id)
);

-- Tạo bảng Service
CREATE TABLE Service (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL
);

-- Tạo bảng Staff
CREATE TABLE Staff (
    id SERIAL PRIMARY KEY,
    accountId INT UNIQUE NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    phoneNumber VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    role VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL,
    CONSTRAINT fk_account_staff FOREIGN KEY (accountId) REFERENCES Account (id)
);

-- Tạo bảng UsageHistory
CREATE TABLE UsageHistory (
    id SERIAL PRIMARY KEY,
    customerId INT NOT NULL,
    computerId INT NOT NULL,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP,
    totalHours FLOAT,
    totalCost FLOAT,
    invoiceId INT,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP NOT NULL,
    CONSTRAINT fk_computer FOREIGN KEY (computerId) REFERENCES Computer (id),
    CONSTRAINT fk_customer_history FOREIGN KEY (customerId) REFERENCES Customer (id),
    CONSTRAINT fk_invoice_history FOREIGN KEY (invoiceId) REFERENCES Invoice (id)
);
