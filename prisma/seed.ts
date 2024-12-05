import cuid from "cuid";

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Accounts
  const accounts = [
    {
      id: cuid(),
      username: "user1",
      password: "hashed_password1",
      role: "Customer",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      username: "user2",
      password: "hashed_password2",
      role: "Customer",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      username: "user3",
      password: "hashed_password3",
      role: "Customer",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      username: "staff1",
      password: "hashed_password4",
      role: "Staff",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      username: "staff2",
      password: "hashed_password5",
      role: "Staff",
      updatedAt: new Date(),
    },
  ];

  for (const account of accounts) {
    await prisma.account.create({ data: account });
  }

  // Customers
  const customers = [
    {
      id: cuid(),
      accountId: "acc1",
      fullName: "Alice Johnson",
      citizenId: "111111111",
      phoneNumber: "123456789",
      email: "alice@example.com",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      accountId: "acc2",
      fullName: "Bob Smith",
      citizenId: "222222222",
      phoneNumber: "987654321",
      email: "bob@example.com",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      accountId: "acc3",
      fullName: "Charlie Brown",
      citizenId: "333333333",
      phoneNumber: "567890123",
      email: "charlie@example.com",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      accountId: "acc4",
      fullName: "Dana White",
      citizenId: "444444444",
      phoneNumber: "123123123",
      email: "dana@example.com",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      accountId: "acc5",
      fullName: "Eve Black",
      citizenId: "555555555",
      phoneNumber: "321321321",
      email: "eve@example.com",
      updatedAt: new Date(),
    },
  ];

  for (const customer of customers) {
    await prisma.customer.create({ data: customer });
  }

  // Staff
  const staff = [
    {
      id: cuid(),
      accountId: "acc4",
      fullName: "Emily Taylor",
      phoneNumber: "555666777",
      email: "emily@example.com",
      role: "Manager",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      accountId: "acc5",
      fullName: "Michael Scott",
      phoneNumber: "777888999",
      email: "michael@example.com",
      role: "Operator",
      updatedAt: new Date(),
    },
  ];

  for (const staffMember of staff) {
    await prisma.staff.create({ data: staffMember });
  }

  // Computers
  const computers = [
    {
      id: cuid(),
      name: "PC-001",
      status: "Online",
      location: "Zone A",
      specs: "i5, 16GB RAM, GTX 1060",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      name: "PC-002",
      status: "Offline",
      location: "Zone B",
      specs: "i7, 32GB RAM, RTX 2060",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      name: "PC-003",
      status: "Online",
      location: "Zone C",
      specs: "Ryzen 5, 16GB RAM, GTX 1660",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      name: "PC-004",
      status: "Offline",
      location: "Zone D",
      specs: "i9, 64GB RAM, RTX 3080",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      name: "PC-005",
      status: "Online",
      location: "Zone E",
      specs: "M1, 8GB RAM, Integrated",
      updatedAt: new Date(),
    },
  ];

  for (const computer of computers) {
    await prisma.computer.create({ data: computer });
  }

  // Services
  const services = [
    { id: cuid(), name: "Printing", price: 2.0, updatedAt: new Date() },
    { id: cuid(), name: "Scanning", price: 3.0, updatedAt: new Date() },
    { id: cuid(), name: "Photocopy", price: 1.5, updatedAt: new Date() },
    { id: cuid(), name: "Lamination", price: 2.5, updatedAt: new Date() },
    { id: cuid(), name: "Binding", price: 5.0, updatedAt: new Date() },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  // UsageHistory
  const usageHistories = [
    {
      id: cuid(),
      customerId: "cust1",
      computerId: "comp1",
      startTime: new Date("2024-01-10T09:00:00Z"),
      endTime: new Date("2024-01-10T11:00:00Z"),
      totalHours: 2.0,
      totalCost: 10.0,
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      customerId: "cust2",
      computerId: "comp2",
      startTime: new Date("2024-01-11T10:00:00Z"),
      endTime: new Date("2024-01-11T12:30:00Z"),
      totalHours: 2.5,
      totalCost: 12.5,
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      customerId: "cust3",
      computerId: "comp3",
      startTime: new Date("2024-01-12T14:00:00Z"),
      endTime: new Date("2024-01-12T16:00:00Z"),
      totalHours: 2.0,
      totalCost: 10.0,
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      customerId: "cust4",
      computerId: "comp4",
      startTime: new Date("2024-01-13T09:00:00Z"),
      endTime: new Date("2024-01-13T10:30:00Z"),
      totalHours: 1.5,
      totalCost: 7.5,
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      customerId: "cust5",
      computerId: "comp5",
      startTime: new Date("2024-01-14T11:00:00Z"),
      endTime: new Date("2024-01-14T13:00:00Z"),
      totalHours: 2.0,
      totalCost: 10.0,
      updatedAt: new Date(),
    },
  ];

  for (const usage of usageHistories) {
    await prisma.usageHistory.create({ data: usage });
  }

  // Invoices
  const invoices = [
    {
      id: cuid(),
      customerId: "cust1",
      invoiceDate: new Date("2024-01-10T09:00:00Z"),
      totalAmount: 10.0,
      status: "Paid",
      updatedAt: new Date(),
    },
    {
      id: cuid(),
      customerId: "cust2",
      invoiceDate: new Date("2024-01-11T10:00:00Z"),
      totalAmount: 12.5,
      status: "Paid",
      updatedAt: new Date(),
    },
  ];

  for (const invoice of invoices) {
    await prisma.invoice.create({ data: invoice });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
