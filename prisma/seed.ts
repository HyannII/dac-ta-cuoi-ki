const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Accounts
  const accounts = [
    {
      id: "cm4b8ebfq00000cmpdvgreiqr",
      username: "user1",
      password: "hashed_password1",
      role: "Customer",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8emxg00010cmpa39eb8kv",
      username: "user2",
      password: "hashed_password2",
      role: "Customer",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8mcrf000v0cmpff2o32j1",
      username: "user3",
      password: "hashed_password3",
      role: "Customer",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8eua300020cmp2jvx9n3m",
      username: "staff1",
      password: "hashed_password4",
      role: "Staff",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8fddy00040cmp166077jz",
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
      id: "cm4b8fofe00050cmpaxlr257d",
      accountId: "cm4b8ebfq00000cmpdvgreiqr",
      fullName: "Alice Johnson",
      citizenId: "111111111",
      phoneNumber: "123456789",
      email: "alice@example.com",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8fumk00060cmpajdc0n9c",
      accountId: "cm4b8emxg00010cmpa39eb8kv",
      fullName: "Bob Smith",
      citizenId: "222222222",
      phoneNumber: "987654321",
      email: "bob@example.com",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8g3wj00070cmp3q9s9e1a",
      accountId: "cm4b8mcrf000v0cmpff2o32j1",
      fullName: "Charlie Brown",
      citizenId: "333333333",
      phoneNumber: "567890123",
      email: "charlie@example.com",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8ga5m00080cmp8xsi4s88",
      accountId: "cm4b8eua300020cmp2jvx9n3m",
      fullName: "Dana White",
      citizenId: "444444444",
      phoneNumber: "123123123",
      email: "dana@example.com",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8ghne000a0cmpbfql3q89",
      accountId: "cm4b8fddy00040cmp166077jz",
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
      id: "cm4b8gv9r000b0cmpdejh8xv0",
      accountId: "cm4b8eua300020cmp2jvx9n3m",
      fullName: "Emily Taylor",
      phoneNumber: "555666777",
      email: "emily@example.com",
      role: "Manager",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8no5e000w0cmp2or8362i",
      accountId: "cm4b8fddy00040cmp166077jz",
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
      id: "cm4b8hbbh000d0cmp9y525t0f",
      name: "PC-001",
      status: "Online",
      location: "Zone A",
      specs: "i5, 16GB RAM, GTX 1060",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8nw3u000x0cmp5q7vfs3f",
      name: "PC-002",
      status: "Offline",
      location: "Zone B",
      specs: "i7, 32GB RAM, RTX 2060",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8o0ab000y0cmp1i1vbmkb",
      name: "PC-003",
      status: "Online",
      location: "Zone C",
      specs: "Ryzen 5, 16GB RAM, GTX 1660",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8hq2g000f0cmp9uvlbzxt",
      name: "PC-004",
      status: "Offline",
      location: "Zone D",
      specs: "i9, 64GB RAM, RTX 3080",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8i0om000h0cmp01lbbuyf",
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
    {
      id: "cm4b8ih16000j0cmpa8q18ic6",
      name: "Printing",
      price: 2.0,
      updatedAt: new Date(),
    },
    {
      id: "cm4b8imor000k0cmpe5fc38s9",
      name: "Scanning",
      price: 3.0,
      updatedAt: new Date(),
    },
    {
      id: "cm4b8iro6000l0cmp7zpi3pv8",
      name: "Photocopy",
      price: 1.5,
      updatedAt: new Date(),
    },
    {
      id: "cm4b8ixck000m0cmpf3wfbnkm",
      name: "Lamination",
      price: 2.5,
      updatedAt: new Date(),
    },
    {
      id: "cm4b8j2le000n0cmp05gma22s",
      name: "Binding",
      price: 5.0,
      updatedAt: new Date(),
    },
  ];

  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  // UsageHistory
  const usageHistories = [
    {
      id: "cm4b8jazs000o0cmpgmz80ys3",
      customerId: "cm4b8fofe00050cmpaxlr257d",
      computerId: "cm4b8hbbh000d0cmp9y525t0f",
      startTime: new Date("2024-01-10T09:00:00Z"),
      endTime: new Date("2024-01-10T11:00:00Z"),
      totalHours: 2.0,
      totalCost: 10.0,
      updatedAt: new Date(),
    },
    {
      id: "cm4b8jj9v000p0cmpgrw6epv4",
      customerId: "cm4b8fumk00060cmpajdc0n9c",
      computerId: "cm4b8nw3u000x0cmp5q7vfs3f",
      startTime: new Date("2024-01-11T10:00:00Z"),
      endTime: new Date("2024-01-11T12:30:00Z"),
      totalHours: 2.5,
      totalCost: 12.5,
      updatedAt: new Date(),
    },
    {
      id: "cm4b8jpg5000q0cmp895k9zz2",
      customerId: "cm4b8g3wj00070cmp3q9s9e1a",
      computerId: "cm4b8o0ab000y0cmp1i1vbmkb",
      startTime: new Date("2024-01-12T14:00:00Z"),
      endTime: new Date("2024-01-12T16:00:00Z"),
      totalHours: 2.0,
      totalCost: 10.0,
      updatedAt: new Date(),
    },
    {
      id: "cm4b8juwf000r0cmp517nat6z",
      customerId: "cm4b8ga5m00080cmp8xsi4s88",
      computerId: "cm4b8hq2g000f0cmp9uvlbzxt",
      startTime: new Date("2024-01-13T09:00:00Z"),
      endTime: new Date("2024-01-13T10:30:00Z"),
      totalHours: 1.5,
      totalCost: 7.5,
      updatedAt: new Date(),
    },
    {
      id: "cm4b8k0zy000s0cmp0tredyu2",
      customerId: "cm4b8ghne000a0cmpbfql3q89",
      computerId: "cm4b8i0om000h0cmp01lbbuyf",
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
      id: "cm4b8k7kj000t0cmp1qe4fjqe",
      customerId: "cm4b8fofe00050cmpaxlr257d",
      invoiceDate: new Date("2024-01-10T09:00:00Z"),
      totalAmount: 10.0,
      status: "Paid",
      updatedAt: new Date(),
    },
    {
      id: "cm4b8kg3i000u0cmpbi7z09i6",
      customerId: "cm4b8fumk00060cmpajdc0n9c",
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
