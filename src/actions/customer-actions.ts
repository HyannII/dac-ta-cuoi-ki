"use server";

import prisma from "@/lib/db";
import cuid from "cuid";
import { revalidatePath } from "next/cache";

export async function getCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        Account: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!customer) return null;

    return {
      fullName: customer.fullName,
      citizenId: customer.citizenId,
      account: { username: customer.Account?.username || "" },
      phoneNumber: customer.phoneNumber || "",
      email: customer.email || "",
      membershipLevel: customer.membershipLevel,
      balance: customer.balance,
    };
  } catch (error) {
    console.error("Error fetching customer:", error);
    throw new Error("Unable to fetch customer data");
  }
}

export async function createCustomer(formData: FormData) {
  await prisma.customer.create({
    data: {
      id: cuid(),
      accountId: await prisma.account
        .findUniqueOrThrow({
          where: { username: formData.get("accountName") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      fullName: formData.get("fullName") as string,
      citizenId: formData.get("citizenId") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      membershipLevel: formData.get("membershipLevel") as string,
      balance: Number(formData.get("balance")),
      updatedAt: new Date(),
    },
  });
  revalidatePath("/customers");
}

export async function editCustomer(formData: FormData, id: string) {
  await prisma.customer.update({
    where: { id },
    data: {
      accountId: await prisma.account
        .findUniqueOrThrow({
          where: { username: formData.get("accountName") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      fullName: formData.get("fullName") as string,
      citizenId: formData.get("citizenId") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      membershipLevel: formData.get("membershipLevel") as string,
      balance: Number(formData.get("balance")),
      updatedAt: new Date(),
    },
  });
  revalidatePath("/customers");
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({ where: { id } });
  revalidatePath("/customers");
}
