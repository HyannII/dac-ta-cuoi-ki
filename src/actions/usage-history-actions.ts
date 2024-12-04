"use server";

import prisma from "@/lib/db";
import cuid from "cuid";
import { revalidatePath } from "next/cache";

export async function getUsageHistoryById(id: string) {
  try {
    const usageHistory = await prisma.usageHistory.findUnique({
      where: { id },
      include: {
        Customer: {
          select: {
            citizenId: true,
          },
        },
        Computer: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!usageHistory) return null;
    return {
      customer: { citizenId: usageHistory.Customer?.citizenId || "" },
      computer: { name: usageHistory.Computer?.name || "" },
      startTime: usageHistory.startTime,
      endTime: usageHistory.endTime,
      totalHours: usageHistory.totalHours,
      totalCost: usageHistory.totalCost,
    };
  } catch (error) {
    console.error("Error fetching usageHistory:", error);
    throw new Error("Unable to fetch usageHistory data");
  }
}

export async function createUsageHistory(formData: FormData) {
  await prisma.usageHistory.create({
    data: {
      id: cuid(),
      customerId: await prisma.customer
        .findUniqueOrThrow({
          where: { citizenId: formData.get("customerCitizenId") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      computerId: await prisma.computer
        .findUniqueOrThrow({
          where: { name: formData.get("computerName") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      startTime: new Date(),
      updatedAt: new Date(),
    },
  });
  revalidatePath("/usage-history");
}

export async function editUsageHistory(formData: FormData, id: string, complete: boolean) {
  const usageHistory = await prisma.usageHistory.findUniqueOrThrow({
    where: { id },
    select: { startTime: true },
  });

  let endTime = null;
  let totalHours = null;
  let totalCost = null;

  if (complete) {
    endTime = new Date();
    totalHours =
      (endTime.getTime() - usageHistory.startTime.getTime()) / (1000 * 60 * 60);
    totalCost = totalHours * 5000;
  }

  await prisma.usageHistory.update({
    where: { id },
    data: {
      customerId: await prisma.customer
        .findUniqueOrThrow({
          where: { citizenId: formData.get("customerCitizenId") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      computerId: await prisma.computer
        .findUniqueOrThrow({
          where: { name: formData.get("computerName") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      endTime,
      totalHours,
      totalCost,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/usage-history");
}

export async function deleteUsageHistory(id: string) {
  await prisma.usageHistory.delete({ where: { id } });
  revalidatePath("/usage-history");
}
