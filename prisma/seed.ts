const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Accounts
  const accounts = [
    {
      id: "acc1",
      username: "user1",
      password: "hashed_password1",
      role: "Customer",
      updatedAt: new Date(),
    },
    {
      id: "acc2",
      username: "user2",
      password: "hashed_password2",
      role: "Customer",
      updatedAt: new Date(),
    },
    {
      id: "acc3",
      username: "user3",
      password: "hashed_password3",
      role: "Customer",
      updatedAt: new Date(),
    },
    {
      id: "acc4",
      username: "staff1",
      password: "hashed_password4",
      role: "Staff",
      updatedAt: new Date(),
    },
    {
      id: "acc5",
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
      id: "cust1",
      accountId: "acc1",
      fullName: "Alice Johnson",
      citizenId: "111111111",
      phoneNumber: "123456789",
      email: "alice@example.com",
      updatedAt: new Date(),
    },
    {
      id: "cust2",
      accountId: "acc2",
      fullName: "Bob Smith",
      citizenId: "222222222",
      phoneNumber: "987654321",
      email: "bob@example.com",
      updatedAt: new Date(),
    },
    {
      id: "cust3",
      accountId: "acc3",
      fullName: "Charlie Brown",
      citizenId: "333333333",
      phoneNumber: "567890123",
      email: "charlie@example.com",
      updatedAt: new Date(),
    },
    {
      id: "cust4",
      accountId: "acc4",
      fullName: "Dana White",
      citizenId: "444444444",
      phoneNumber: "123123123",
      email: "dana@example.com",
      updatedAt: new Date(),
    },
    {
      id: "cust5",
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
      id: "staff1",
      accountId: "acc4",
      fullName: "Emily Taylor",
      phoneNumber: "555666777",
      email: "emily@example.com",
      role: "Manager",
      updatedAt: new Date(),
    },
    {
      id: "staff2",
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
      id: "comp1",
      name: "PC-001",
      status: "Online",
      location: "Zone A",
      specs: "i5, 16GB RAM, GTX 1060",
      updatedAt: new Date(),
    },
    {
      id: "comp2",
      name: "PC-002",
      status: "Offline",
      location: "Zone B",
      specs: "i7, 32GB RAM, RTX 2060",
      updatedAt: new Date(),
    },
    {
      id: "comp3",
      name: "PC-003",
      status: "Online",
      location: "Zone C",
      specs: "Ryzen 5, 16GB RAM, GTX 1660",
      updatedAt: new Date(),
    },
    {
      id: "comp4",
      name: "PC-004",
      status: "Offline",
      location: "Zone D",
      specs: "i9, 64GB RAM, RTX 3080",
      updatedAt: new Date(),
    },
    {
      id: "comp5",
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
    { id: "srv1", name: "Printing", price: 2.0, updatedAt: new Date() },
    { id: "srv2", name: "Scanning", price: 3.0, updatedAt: new Date() },
    { id: "srv3", name: "Photocopy", price: 1.5, updatedAt: new Date() },
    { id: "srv4", name: "Lamination", price: 2.5, updatedAt: new Date() },
    { id: "srv5", name: "Binding", price: 5.0, updatedAt: new Date() },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  // UsageHistory
  const usageHistories = [
    {
      id: "usage1",
      customerId: "cust1",
      computerId: "comp1",
      startTime: new Date("2024-01-10T09:00:00Z"),
      endTime: new Date("2024-01-10T11:00:00Z"),
      totalHours: 2.0,
      totalCost: 10.0,
      updatedAt: new Date(),
    },
    {
      id: "usage2",
      customerId: "cust2",
      computerId: "comp2",
      startTime: new Date("2024-01-11T10:00:00Z"),
      endTime: new Date("2024-01-11T12:30:00Z"),
      totalHours: 2.5,
      totalCost: 12.5,
      updatedAt: new Date(),
    },
    {
      id: "usage3",
      customerId: "cust3",
      computerId: "comp3",
      startTime: new Date("2024-01-12T14:00:00Z"),
      endTime: new Date("2024-01-12T16:00:00Z"),
      totalHours: 2.0,
      totalCost: 10.0,
      updatedAt: new Date(),
    },
    {
      id: "usage4",
      customerId: "cust4",
      computerId: "comp4",
      startTime: new Date("2024-01-13T09:00:00Z"),
      endTime: new Date("2024-01-13T10:30:00Z"),
      totalHours: 1.5,
      totalCost: 7.5,
      updatedAt: new Date(),
    },
    {
      id: "usage5",
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
      id: "inv1",
      customerId: "cust1",
      invoiceDate: new Date("2024-01-10T09:00:00Z"),
      totalAmount: 10.0,
      status: "Paid",
      updatedAt: new Date(),
    },
    {
      id: "inv2",
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
