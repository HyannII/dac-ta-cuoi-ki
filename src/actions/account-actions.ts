"use server";

import prisma from "@/lib/db";
import cuid from "cuid";
import { revalidatePath } from "next/cache";

export async function getAccountById(id: string) {
  try {
    const account = await prisma.account.findUnique({
      where: { id },
    });
    if (!account) return null;
    return {
      username: account.username,
      role: account.role,
      password: account.password,
    };
  } catch (error) {
    console.error("Error fetching account:", error);
    throw new Error("Unable to fetch account data");
  }
}

export async function createAccount(formData: FormData) {
  await prisma.account.create({
    data: {
      id: cuid(),
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/accounts");
}

export async function editAccount(formData: FormData, id: string) {
  await prisma.account.update({
    where: { id },
    data: {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/accounts");
}

export async function deleteAccount(id: string) {
  await prisma.account.delete({ where: { id } });
  revalidatePath("/accounts");
}
