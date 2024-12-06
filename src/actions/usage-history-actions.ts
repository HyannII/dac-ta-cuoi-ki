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
          include: {
            Account: {
              select: {
                username: true,
              },
            },
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
      customer: { username: usageHistory.Customer?.Account?.username || "" },
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

export async function getAccountByName(username: string) {
  try {
    const account = await prisma.account.findMany({
      where: {
        username: {
          contains: username,
        }
      }
    });
    return account.map((account) => (account.username));
  }catch (error) {
    console.error("Error fetching account:", error);
    throw new Error("Unable to fetch account data");
  }
}

export async function getComputerByName(name: string) {
  try {
    const computer = await prisma.computer.findMany({
      where: {
        name: {
          contains: name,
        },
      },
    });
    return computer.map((computer) => (computer.name));
  } catch (error) {
    console.error("Error fetching account:", error);
    throw new Error("Unable to fetch account data");
  }
}
interface UsageDetails {
  customerUsername: string;
  customerName: string;
  computerName: string;
  startTime: string;
  error?: string;
}
export async function createUsageHistory(
  formData: FormData
): Promise<{ error?: string; success?: boolean; usageDetails?: UsageDetails }> {
  const customerUsername = formData.get("customerUsername") as string;
  const computerName = formData.get("computerName") as string;

  const accountId = await prisma.account
    .findUniqueOrThrow({
      where: { username: customerUsername },
      select: { id: true },
    })
    .then(({ id }) => id);

  const customerId = await prisma.customer
    .findUniqueOrThrow({
      where: { accountId },
      select: { id: true, fullName: true },
    })
    .then(({ id, fullName }) => ({ id, fullName }));

  const existingUsage = await prisma.usageHistory.findFirst({
    where: {
      customerId: customerId.id,
      endTime: null,
    },
  });

  if (existingUsage) {
    return {
      error:
        "Khách hàng này vẫn đang sử dụng máy tính. Vui lòng kết thúc phiên sử dụng trước khi tạo mới.",
    };
  }

  // Kiểm tra trạng thái của máy tính
  const computer = await prisma.computer.findUniqueOrThrow({
    where: { name: computerName },
    select: { id: true, name: true, status: true },
  });

  if (computer.status === "online") {
    return {
      error:
        "Máy tính này đang online và không thể được sử dụng cho phiên mới.",
    };
  }

  // Cập nhật trạng thái máy tính thành online
  await prisma.computer.update({
    where: { id: computer.id },
    data: { status: "online" },
  });

  const usage = await prisma.usageHistory.create({
    data: {
      id: cuid(),
      customerId: customerId.id,
      computerId: computer.id,
      startTime: new Date(),
      updatedAt: new Date(),
    },
  });

  revalidatePath("/usage-history");

  const usageDetails: UsageDetails = {
    customerUsername,
    customerName: customerId.fullName,
    computerName: computer.name,
    startTime: usage.startTime.toISOString(),
  };

  return { success: true, usageDetails };
}


export async function editUsageHistory(
  formData: FormData,
  id: string,
  complete: boolean
) {
  const usageHistory = await prisma.usageHistory.findUniqueOrThrow({
    where: { id },
    select: { startTime: true, computerId: true },
  });

  let endTime = null;
  let totalHours = null;
  let totalCost = null;

  if (complete) {
    endTime = new Date();
    totalHours =
      (endTime.getTime() - usageHistory.startTime.getTime()) / (1000 * 60 * 60);
    totalCost = totalHours * 5000; // Giá 5000/giờ

    // Cập nhật trạng thái máy tính thành offline
    await prisma.computer.update({
      where: { id: usageHistory.computerId },
      data: { status: "offline" },
    });
  }

  const customerUsername = formData.get("customerUsername");
  if (!customerUsername) {
    throw new Error("Tên tài khoản khách hàng không được để trống.");
  }

  const accountId = await prisma.account
    .findUniqueOrThrow({
      where: { username: customerUsername as string },
      select: { id: true },
    })
    .then(({ id }) => id);

  const customerId = await prisma.customer
    .findUniqueOrThrow({
      where: { accountId },
      select: { id: true },
    })
    .then(({ id }) => id);

  const computerName = formData.get("computerName");

  if (!computerName) {
    throw new Error("Tên máy tính không được để trống.");
  }

  const computerId = await prisma.computer
    .findUniqueOrThrow({
      where: { name: computerName as string },
      select: { id: true },
    })
    .then(({ id }) => id);

  await prisma.usageHistory.update({
    where: { id },
    data: {
      customerId,
      computerId,
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
