"use server";

import prisma from "@/lib/db";
import cuid from "cuid";

export async function quickCreate(formData: FormData) {
  const role = "Customer";
  const accountId = cuid();
  const accountData = {
    id: accountId,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
    role,
    updatedAt: new Date(),
  };
  const customerData = {
    id: cuid(),
    accountId,
    fullName: formData.get("fullName") as string,
    citizenId: formData.get("citizenId") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    email: formData.get("email") as string,
    membershipLevel: formData.get("membershipLevel") as string,
    balance: Number(formData.get("balance")),
    updatedAt: new Date(),
  };

  await prisma.$transaction([
    prisma.account.create({ data: accountData }),
    prisma.customer.create({ data: customerData }),
  ]);

  return { account: accountData, customer: customerData };
}
