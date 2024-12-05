"use server";

import prisma from "@/lib/db";
import cuid from "cuid";
import { revalidatePath } from "next/cache";

export async function getInvoiceById(id: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        Customer: {
          select: {
            citizenId: true,
          },
        },
        UsageHistory: {
          select: {
            id: true,
            customerId: true,
            computerId: true,
            startTime: true,
            endTime: true,
            totalHours: true,
            totalCost: true,
          },
        },
      },
    });

    if (!invoice) return null;

    return {
      customer: { citizenId: invoice.Customer?.citizenId || "" },
      invoiceDate: invoice.invoiceDate,
      totalAmount: invoice.totalAmount,
      status: invoice.status,
      usageHistories: invoice.UsageHistory.map((history) => ({
        id: history.id,
        customerId: history.customerId,
        computerId: history.computerId,
        startTime: history.startTime,
        endTime: history.endTime,
        totalHours: history.totalHours,
        totalCost: history.totalCost,
      })),
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    throw new Error("Unable to fetch invoice data");
  }
}

export async function getUsageHistoriesByCustomerId(id: string) {
  try {
    const usageHistory = await prisma.usageHistory.findMany({
    where: {
      customerId: id,
    },
  });
    return usageHistory.map((history) => ({
        id: history.id,
        computerId: history.computerId,
        startTime: history.startTime,
        endTime: history.endTime,
      })) 
  }catch (error) {
    console.error("Error fetching usageHistory:", error);
    throw new Error("Unable to fetch usageHistory data");
  }
}

export async function getCustomersByName(name: string){
  try {
    const customer = await prisma.customer.findMany({
      where: {
        fullName: {
          contains: name,
        }
      }
    });
    return customer.map((customer) => ({
      id: customer.id,
      fullName: customer.fullName,
      citizenId: customer.citizenId,
      phoneNumber: customer.phoneNumber || "",
      email: customer.email || "",
      membershipLevel: customer.membershipLevel,
      balance: customer.balance,
    }))
  }catch (error) {
    console.error("Error fetching customer:", error);
    throw new Error("Unable to fetch customer data");
  }
}

export async function createInvoice(formData: FormData) {
  await prisma.invoice.create({
    data: {
      id: cuid(),
      customerId: await prisma.customer
        .findUniqueOrThrow({
          where: { citizenId: formData.get("customerCitizenId") as string },
          select: { id: true },
        })
        .then(({ id }) => id),
      invoiceDate: new Date(),
      totalAmount: Number(formData.get("totalAmount")),
      status: formData.get("status") as string,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/invoices");
}

export async function editInvoice(formData: FormData, id: string) {
  const customerCitizenId = formData.get("customerCitizenId") as string;
  const usageHistoriesRaw = formData.get("usageHistories") as string;
  const totalAmount = Number(formData.get("totalAmount"));
  const status = formData.get("status") as string;

  if (!customerCitizenId || !usageHistoriesRaw) {
    throw new Error("Missing customerCitizenId or usageHistories in form data.");
  }

  const selectedUsageHistories = JSON.parse(usageHistoriesRaw as string) as string[];

  try {
    // Tìm ID của khách hàng dựa trên citizenId
    const customer = await prisma.customer.findUnique({
      where: { citizenId: customerCitizenId as string },
      select: { id: true },
    });

    if (!customer) {
      throw new Error(`Customer with citizenId ${customerCitizenId} not found`);
    }

    // Cập nhật hóa đơn
    await prisma.invoice.update({
      where: { id },
      data: {
        customerId: customer.id,
        totalAmount,
        status,
        updatedAt: new Date(),
      },
    });

    // Xóa liên kết UsageHistories cũ
    await prisma.usageHistory.updateMany({
      where: { invoiceId: id },
      data: { invoiceId: null },
    });

    // Liên kết UsageHistories mới nếu có
    if (selectedUsageHistories.length > 0) {
      for (const usageHistoryId of selectedUsageHistories) {
        const usageHistory = await prisma.usageHistory.findUnique({
          where: { id: usageHistoryId },
        });

        if (!usageHistory) {
          throw new Error(`UsageHistory with id ${usageHistoryId} not found`);
        }

        await prisma.usageHistory.update({
          where: { id: usageHistoryId },
          data: { invoiceId: id },
        });
      }
    }

    // Làm mới giao diện
    revalidatePath("/invoices");
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw new Error("Unable to update invoice");
  }
}



export async function deleteInvoice(id: string) {
  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/invoices");
}
