"use server";

import prisma from "@/lib/db";
import cuid from "cuid";
import { revalidatePath } from "next/cache";

export async function getStaffById(id: string) {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        Account: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!staff) return null;

    return {
      fullName: staff.fullName,
      account: { username: staff.Account?.username || "" },
      phoneNumber: staff.phoneNumber || "",
      email: staff.email || "",
      role: staff.role,
    };
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw new Error("Unable to fetch staff data");
  }
}

export async function createStaff(formData: FormData) {
  await prisma.staff.create({
    data: {
      id: cuid(),
      accountId: await prisma.account
        .findUniqueOrThrow({
          where: { username: formData.get("accountName") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      fullName: formData.get("fullName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/staffs");
}

export async function editStaff(formData: FormData, id: string) {
  await prisma.staff.update({
    where: { id },
    data: {
      accountId: await prisma.account
        .findUniqueOrThrow({
          where: { username: formData.get("accountName") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      fullName: formData.get("fullName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/staffs");
}

export async function deleteStaff(id: string) {
  await prisma.staff.delete({ where: { id } });
  revalidatePath("/staffs");
}
