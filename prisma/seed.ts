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
    },
    {
      id: "acc2",
      username: "user2",
      password: "hashed_password2",
      role: "Customer",
    },
    {
      id: "acc3",
      username: "user3",
      password: "hashed_password3",
      role: "Customer",
    },
    {
      id: "acc4",
      username: "user4",
      password: "hashed_password4",
      role: "Staff",
    },
    {
      id: "acc5",
      username: "user5",
      password: "hashed_password5",
      role: "Staff",
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
      email: "alice@example.com",
      membershipLevel: "Regular",
      balance: 100,
    },
    {
      id: "cust2",
      accountId: "acc2",
      fullName: "Bob Smith",
      email: "bob@example.com",
      membershipLevel: "Premium",
      balance: 200,
    },
    {
      id: "cust3",
      accountId: "acc3",
      fullName: "Charlie Brown",
      email: "charlie@example.com",
      membershipLevel: "Regular",
      balance: 50,
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
      email: "emily.taylor@example.com",
      role: "Manager",
    },
    {
      id: "staff2",
      accountId: "acc5",
      fullName: "Michael Scott",
      email: "michael.scott@example.com",
      role: "Operator",
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
    },
    {
      id: "comp2",
      name: "PC-002",
      status: "Offline",
      location: "Zone B",
      specs: "i7, 32GB RAM, RTX 2060",
    },
    {
      id: "comp3",
      name: "PC-003",
      status: "Online",
      location: "Zone C",
      specs: "Ryzen 5, 16GB RAM, GTX 1660",
    },
  ];

  for (const computer of computers) {
    await prisma.computer.create({ data: computer });
  }

  // Services
  const services = [
    { id: "srv1", name: "Printing", price: 2.0 },
    { id: "srv2", name: "Scanning", price: 3.0 },
    { id: "srv3", name: "Photocopy", price: 1.5 },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  // UsageHistory
  const usageHistory = [
    {
      id: "usage1",
      customerId: "cust1",
      computerId: "comp1",
      startTime: new Date("2024-01-10T09:00:00Z"),
      endTime: new Date("2024-01-10T11:00:00Z"),
      totalHours: 2.0,
      totalCost: 10.0,
    },
    {
      id: "usage2",
      customerId: "cust2",
      computerId: "comp2",
      startTime: new Date("2024-01-11T10:00:00Z"),
      endTime: new Date("2024-01-11T12:30:00Z"),
      totalHours: 2.5,
      totalCost: 12.5,
    },
  ];

  for (const history of usageHistory) {
    await prisma.usageHistory.create({ data: history });
  }

  // Invoices
  const invoices = [
    {
      id: "inv1",
      customerId: "cust1",
      invoiceDate: new Date("2024-01-10T09:00:00Z"),
      totalAmount: 10.0,
      status: "Paid",
    },
    {
      id: "inv2",
      customerId: "cust2",
      invoiceDate: new Date("2024-01-11T10:00:00Z"),
      totalAmount: 12.5,
      status: "Paid",
    },
  ];

  for (const invoice of invoices) {
    await prisma.invoice.create({ data: invoice });
  }

  // InvoiceServices
  const invoiceServices = [
    {
      id: "invSrv1",
      invoiceId: "inv1",
      serviceId: "srv1",
      quantity: 2,
      totalPrice: 4.0,
    },
    {
      id: "invSrv2",
      invoiceId: "inv2",
      serviceId: "srv2",
      quantity: 1,
      totalPrice: 3.0,
    },
  ];

  for (const invoiceService of invoiceServices) {
    await prisma.invoiceService.create({ data: invoiceService });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding complete!");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
